/**
 * The assistant backend as one request handler (Web Request → Web Response),
 * so the same code runs as a Netlify Function and inside the local dev server
 * and the tests.
 *
 * Security model
 *  - Owner identity: OWNER_PASSWORD (server environment). A successful login
 *    sets an HttpOnly, SameSite=Strict cookie holding an HMAC-signed token
 *    that expires after 12 hours. Every owner route verifies the token on the
 *    server; nothing in the frontend, URL or browser storage grants access.
 *  - The OpenRouter key is stored encrypted (AES-256-GCM, key derived from
 *    ASSISTANT_SECRET) and is decrypted only in memory for the duration of a
 *    request to OpenRouter. It is never returned by any endpoint or logged.
 *  - Learners talk to the model only through POST /chat, and only while the
 *    owner has switched learner access on. Limits are enforced here:
 *    requests per minute and per day per client, message and conversation
 *    size, output tokens, and daily/monthly spending budgets.
 *  - Mutating routes require the header X-Requested-With: codepath in
 *    addition to the cookie (a cross-site form cannot set it).
 */
import { decryptString, encryptString, maskKey, safeEqual, signToken, verifyToken } from './crypto.mjs';
import { checkKey, findModel, streamChat, OpenRouterError, DEFAULT_BASE_URL } from './openrouter.mjs';
import { buildSystemPrompt, sanitizeContext } from './prompts.mjs';

export const API_PREFIX = '/api/assistant';
const COOKIE = 'cp_owner';
const SESSION_MS = 12 * 60 * 60 * 1000;
const CONFIG_KEY = 'config';

export const DEFAULT_LIMITS = {
  /** Highest number of output tokens per reply. */
  maxOutputTokens: 700,
  /** Per learner device (client id). */
  requestsPerMinute: 6,
  requestsPerDay: 60,
  /** Whole site, in USD credits as reported by OpenRouter. 0 = no budget check. */
  dailyBudgetUsd: 1,
  monthlyBudgetUsd: 10,
  /** Size limits for the conversation sent with each request. */
  maxMessageChars: 4000,
  maxConversationChars: 16000,
  maxMessages: 20,
};

export function defaultConfig() {
  return {
    version: 1,
    encryptedKey: null,
    keyMasked: null,
    keySavedAt: null,
    keyLabel: null,
    model: 'openai/gpt-4o-mini',
    learnerAccess: false,
    limits: { ...DEFAULT_LIMITS },
    updatedAt: null,
  };
}

/* ------------------------------------------------------------------ small utils */

function json(status, body, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

function error(status, code, message, extra = {}) {
  return json(status, { error: { code, message, ...extra } });
}

function parseCookies(header) {
  const out = {};
  for (const part of String(header ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function dayKey(d) {
  return d.toISOString().slice(0, 10);
}
function monthKey(d) {
  return d.toISOString().slice(0, 7);
}

async function readJson(request, maxBytes = 200_000) {
  const text = await request.text();
  if (text.length > maxBytes) throw error(413, 'too_large', 'Request body too large.');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw error(400, 'bad_json', 'The request body is not valid JSON.');
  }
}

function clampNumber(v, fallback, min, max) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/** In-memory sliding window; per function instance (documented as best-effort). */
class MinuteLimiter {
  constructor() {
    this.hits = new Map();
  }
  take(key, limit, now, windowMs = 60_000) {
    const arr = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (arr.length >= limit) {
      this.hits.set(key, arr);
      return { ok: false, retryAfterMs: windowMs - (now - arr[0]) };
    }
    arr.push(now);
    this.hits.set(key, arr);
    return { ok: true };
  }
}

/**
 * Serialises read-modify-write sequences on the usage documents within one
 * process. Netlify may run several function instances, so this is a strong
 * guarantee locally and a best-effort one in production (documented).
 */
class KeyedLock {
  constructor() {
    this.chains = new Map();
  }
  async run(key, fn) {
    const prev = this.chains.get(key) ?? Promise.resolve();
    let release;
    const gate = new Promise((r) => (release = r));
    this.chains.set(key, prev.then(() => gate));
    await prev;
    try {
      return await fn();
    } finally {
      release();
      if (this.chains.get(key) === gate) this.chains.delete(key);
    }
  }
}

/* ------------------------------------------------------------------ handler */

export function createAssistantHandler({ env = process.env, storage, fetchImpl = fetch, now = () => new Date(), log = () => {} } = {}) {
  if (!storage) throw new Error('storage is required');
  const usageLock = new KeyedLock();
  const secret = env.ASSISTANT_SECRET;
  const ownerPassword = env.OWNER_PASSWORD;
  const baseUrl = env.OPENROUTER_BASE_URL || DEFAULT_BASE_URL;
  const secure = String(env.ASSISTANT_COOKIE_SECURE ?? env.NETLIFY ?? '') !== '' && env.ASSISTANT_COOKIE_SECURE !== 'false';
  const minuteLimiter = new MinuteLimiter();
  const loginLimiter = new MinuteLimiter();

  const configured = () => typeof secret === 'string' && secret.length >= 16 && typeof ownerPassword === 'string' && ownerPassword.length >= 8;

  async function loadConfig() {
    const stored = await storage.getJSON(CONFIG_KEY);
    const base = defaultConfig();
    if (!stored) return base;
    return { ...base, ...stored, limits: { ...base.limits, ...(stored.limits ?? {}) } };
  }

  async function saveConfig(config) {
    config.updatedAt = now().toISOString();
    await storage.setJSON(CONFIG_KEY, config);
    return config;
  }

  function ownerFromRequest(request) {
    if (!configured()) return null;
    const cookies = parseCookies(request.headers.get('cookie'));
    const token = cookies[COOKIE];
    if (!token) return null;
    const payload = verifyToken(token, secret, now().getTime());
    return payload && payload.role === 'owner' ? payload : null;
  }

  function cookieHeader(value, maxAgeSeconds) {
    const parts = [`${COOKIE}=${value}`, 'Path=/api/assistant', 'HttpOnly', 'SameSite=Strict', `Max-Age=${maxAgeSeconds}`];
    if (secure) parts.push('Secure');
    return { 'Set-Cookie': parts.join('; ') };
  }

  function requireCsrf(request) {
    if (request.headers.get('x-requested-with') !== 'codepath') throw error(403, 'csrf', 'Missing X-Requested-With header.');
  }

  function clientKey(request, meta) {
    const id = String(request.headers.get('x-client-id') ?? '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64);
    const ip = meta.ip ?? request.headers.get('x-nf-client-connection-ip') ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    return { clientId: id || `ip:${ip}`, ip };
  }

  async function getUsageDoc(day) {
    return (await storage.getJSON(`usage/${day}`)) ?? { day, requests: 0, promptTokens: 0, completionTokens: 0, cost: 0, byClient: {}, byModel: {} };
  }

  /**
   * Usage is written in two phases: the request is counted before the model
   * is called (so rapid parallel requests hit the per-day limit), and tokens,
   * cost and the outcome are added once the reply has finished.
   */
  function recordUsage(args) {
    return usageLock.run('usage', () => recordUsageUnlocked(args));
  }

  async function recordUsageUnlocked({ clientId, model, usage, aborted, errored, phase = 'both' }) {
    const day = dayKey(now());
    const doc = await getUsageDoc(day);
    const pt = usage?.promptTokens ?? 0;
    const ct = usage?.completionTokens ?? 0;
    const cost = usage?.cost ?? 0;
    const countRequest = phase !== 'end';
    const addUsage = phase !== 'start';
    const bump = (row) => {
      if (countRequest) row.requests += 1;
      if (addUsage) {
        row.promptTokens += pt;
        row.completionTokens += ct;
        row.cost += cost;
      }
      return row;
    };
    bump(doc);
    if (addUsage && aborted) doc.aborted = (doc.aborted ?? 0) + 1;
    if (addUsage && errored) doc.errors = (doc.errors ?? 0) + 1;
    doc.byClient[clientId] = bump(doc.byClient[clientId] ?? { requests: 0, promptTokens: 0, completionTokens: 0, cost: 0 });
    doc.byModel[model] = bump(doc.byModel[model] ?? { requests: 0, promptTokens: 0, completionTokens: 0, cost: 0 });
    await storage.setJSON(`usage/${day}`, doc);
    return doc;
  }

  async function monthCost(month) {
    // Sum the days of the month that have a usage document (at most 31 reads).
    let total = 0;
    const [y, m] = month.split('-').map(Number);
    const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
    for (let d = 1; d <= days; d += 1) {
      const key = `usage/${month}-${String(d).padStart(2, '0')}`;
      const doc = await storage.getJSON(key);
      if (doc) total += doc.cost ?? 0;
    }
    return total;
  }

  /* ------------------------------------------------------------ routes */

  async function status(request) {
    const config = await loadConfig();
    const owner = !!ownerFromRequest(request);
    return json(200, {
      backend: true,
      serverConfigured: configured(),
      keyConfigured: !!config.encryptedKey,
      model: config.model,
      learnerAccess: config.learnerAccess,
      role: owner ? 'owner' : 'learner',
      canChat: !!config.encryptedKey && (owner || config.learnerAccess),
      limits: {
        maxOutputTokens: config.limits.maxOutputTokens,
        requestsPerMinute: config.limits.requestsPerMinute,
        requestsPerDay: config.limits.requestsPerDay,
        maxMessageChars: config.limits.maxMessageChars,
      },
    });
  }

  async function login(request, meta) {
    requireCsrf(request);
    if (!configured()) return error(503, 'server_not_configured', 'OWNER_PASSWORD and ASSISTANT_SECRET must be set on the server before the owner can sign in.');
    const { ip } = clientKey(request, meta);
    const gate = loginLimiter.take(`login:${ip}`, 5, now().getTime(), 15 * 60_000);
    if (!gate.ok) return error(429, 'too_many_attempts', 'Too many sign-in attempts. Try again in a few minutes.');
    const body = await readJson(request, 10_000);
    if (typeof body.password !== 'string' || !safeEqual(body.password, ownerPassword)) {
      log('owner login failed');
      return error(401, 'bad_password', 'Wrong password.');
    }
    const token = signToken({ role: 'owner', exp: now().getTime() + SESSION_MS }, secret);
    log('owner login ok');
    return json(200, { ok: true, role: 'owner', expiresAt: new Date(now().getTime() + SESSION_MS).toISOString() }, cookieHeader(token, SESSION_MS / 1000));
  }

  async function logout(request) {
    requireCsrf(request);
    return json(200, { ok: true }, cookieHeader('', 0));
  }

  function publicConfig(config) {
    return {
      key: config.encryptedKey ? { configured: true, masked: config.keyMasked, savedAt: config.keySavedAt, label: config.keyLabel } : { configured: false },
      model: config.model,
      learnerAccess: config.learnerAccess,
      limits: config.limits,
      updatedAt: config.updatedAt,
      serverConfigured: configured(),
      storage: storage.kind,
    };
  }

  async function getConfig() {
    return json(200, publicConfig(await loadConfig()));
  }

  async function putKey(request) {
    requireCsrf(request);
    const body = await readJson(request, 10_000);
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
    if (apiKey.length < 20 || /\s/.test(apiKey)) return error(400, 'invalid_key_format', 'That does not look like an OpenRouter API key.');
    const config = await loadConfig();
    config.encryptedKey = encryptString(apiKey, secret);
    config.keyMasked = maskKey(apiKey);
    config.keySavedAt = now().toISOString();
    config.keyLabel = null;
    await saveConfig(config);
    log('api key saved');
    return json(200, publicConfig(config));
  }

  async function deleteKey(request) {
    requireCsrf(request);
    const config = await loadConfig();
    config.encryptedKey = null;
    config.keyMasked = null;
    config.keySavedAt = null;
    config.keyLabel = null;
    config.learnerAccess = false;
    await saveConfig(config);
    log('api key removed');
    return json(200, publicConfig(config));
  }

  async function putSettings(request) {
    requireCsrf(request);
    const body = await readJson(request, 20_000);
    const config = await loadConfig();
    if (typeof body.model === 'string') {
      const model = body.model.trim();
      if (!/^[a-zA-Z0-9._:/-]{3,120}$/.test(model)) return error(400, 'invalid_model', 'A model id looks like "openai/gpt-4o-mini".');
      config.model = model;
    }
    if (typeof body.learnerAccess === 'boolean') {
      if (body.learnerAccess && !config.encryptedKey) return error(400, 'no_key', 'Save and test an API key before opening the assistant to learners.');
      config.learnerAccess = body.learnerAccess;
    }
    if (body.limits && typeof body.limits === 'object') {
      const L = body.limits;
      config.limits = {
        maxOutputTokens: clampNumber(L.maxOutputTokens, config.limits.maxOutputTokens, 50, 4000),
        requestsPerMinute: clampNumber(L.requestsPerMinute, config.limits.requestsPerMinute, 1, 60),
        requestsPerDay: clampNumber(L.requestsPerDay, config.limits.requestsPerDay, 1, 2000),
        dailyBudgetUsd: clampNumber(L.dailyBudgetUsd, config.limits.dailyBudgetUsd, 0, 10_000),
        monthlyBudgetUsd: clampNumber(L.monthlyBudgetUsd, config.limits.monthlyBudgetUsd, 0, 100_000),
        maxMessageChars: clampNumber(L.maxMessageChars, config.limits.maxMessageChars, 200, 20_000),
        maxConversationChars: clampNumber(L.maxConversationChars, config.limits.maxConversationChars, 1000, 100_000),
        maxMessages: clampNumber(L.maxMessages, config.limits.maxMessages, 2, 100),
      };
    }
    await saveConfig(config);
    return json(200, publicConfig(config));
  }

  async function testKey(request) {
    requireCsrf(request);
    const config = await loadConfig();
    if (!config.encryptedKey) return error(400, 'no_key', 'No API key is saved.');
    let apiKey;
    try {
      apiKey = decryptString(config.encryptedKey, secret);
    } catch {
      return error(500, 'decrypt_failed', 'The stored key cannot be decrypted. ASSISTANT_SECRET probably changed; paste the key again.');
    }
    const body = await readJson(request, 10_000);
    const result = { key: null, model: null, sample: null };
    try {
      result.key = await checkKey(apiKey, { fetchImpl, baseUrl });
      config.keyLabel = result.key.label;
      await saveConfig(config);
    } catch (e) {
      return json(200, { ok: false, stage: 'key', error: describeError(e) });
    }
    try {
      const model = await findModel(apiKey, config.model, { fetchImpl, baseUrl });
      result.model = model ? { ...model, found: true } : { id: config.model, found: false };
    } catch (e) {
      result.model = { id: config.model, found: null, error: describeError(e) };
    }
    if (body.sendSample) {
      try {
        let text = '';
        let usage = null;
        for await (const ev of streamChat({ apiKey, model: config.model, messages: [{ role: 'user', content: 'Reply with the single word OK.' }], maxTokens: 10, fetchImpl, baseUrl })) {
          if (ev.type === 'delta') text += ev.text;
          if (ev.type === 'usage') usage = ev.usage;
        }
        result.sample = { ok: true, text: text.slice(0, 80), usage };
        await recordUsage({ clientId: 'owner-test', model: config.model, usage, phase: 'both' });
      } catch (e) {
        result.sample = { ok: false, error: describeError(e) };
        return json(200, { ok: false, stage: 'sample', ...result });
      }
    }
    return json(200, { ok: true, ...result });
  }

  async function usageReport() {
    const today = now();
    const days = [];
    for (let i = 0; i < 31; i += 1) {
      const d = new Date(today.getTime() - i * 86_400_000);
      const doc = await storage.getJSON(`usage/${dayKey(d)}`);
      if (doc) days.push({ day: doc.day, requests: doc.requests, promptTokens: doc.promptTokens, completionTokens: doc.completionTokens, cost: doc.cost, clients: Object.keys(doc.byClient ?? {}).length, byModel: doc.byModel ?? {}, errors: doc.errors ?? 0, aborted: doc.aborted ?? 0 });
    }
    const config = await loadConfig();
    return json(200, {
      days,
      todayCost: days.find((d) => d.day === dayKey(today))?.cost ?? 0,
      monthCost: await monthCost(monthKey(today)),
      limits: config.limits,
      note: 'Costs are the USD credit amounts reported by OpenRouter per request and summed here; they are estimates, not a hard cap. Set a per-key limit on openrouter.ai for a real ceiling.',
    });
  }

  async function chat(request, meta) {
    requireCsrf(request);
    const config = await loadConfig();
    const owner = ownerFromRequest(request);
    if (!config.encryptedKey) return error(503, 'not_configured', 'The AI assistant is not set up on this site yet.');
    if (!owner && !config.learnerAccess) return error(403, 'learners_disabled', 'The site owner has not opened the AI assistant to learners.');
    const { clientId } = clientKey(request, meta);
    const who = owner ? 'owner' : clientId;
    const L = config.limits;

    const t = now().getTime();
    const gate = minuteLimiter.take(`chat:${who}`, L.requestsPerMinute, t);
    if (!gate.ok) return error(429, 'rate_limited', 'You are sending messages too quickly. Wait a moment and try again.', { retryAfterMs: gate.retryAfterMs });

    const body = await readJson(request, 400_000);
    const mode = body.mode === 'lesson' ? 'lesson' : 'general';
    const lang = body.lang === 'he' ? 'he' : 'en';
    const raw = Array.isArray(body.messages) ? body.messages : [];
    const messages = raw
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.replace(/ /g, '') }));
    if (messages.length === 0 || messages[messages.length - 1].role !== 'user') return error(400, 'bad_messages', 'The conversation must end with a user message.');
    if (messages.some((m) => m.content.length > L.maxMessageChars)) return error(413, 'message_too_long', `A message may have at most ${L.maxMessageChars} characters.`);
    const trimmed = messages.slice(-L.maxMessages);
    const totalChars = trimmed.reduce((n, m) => n + m.content.length, 0);
    if (totalChars > L.maxConversationChars) return error(413, 'conversation_too_long', 'This conversation is too long to send. Start a new chat.');

    const context = sanitizeContext(body.context);
    const system = buildSystemPrompt({ mode, lang, context });

    let apiKey;
    try {
      apiKey = decryptString(config.encryptedKey, secret);
    } catch {
      return error(503, 'decrypt_failed', 'The AI assistant is misconfigured (the saved key cannot be read).');
    }

    const abort = new AbortController();
    request.signal?.addEventListener?.('abort', () => abort.abort());
    const encoder = new TextEncoder();
    const model = config.model;
    let usage = null;
    let aborted = false;
    let errored = false;

    // Daily limit and budgets are checked and the request counted under one
    // lock, so a burst of parallel requests cannot slip past the limit.
    const gateResult = await usageLock.run('usage', async () => {
      const todayDoc = await getUsageDoc(dayKey(now()));
      if (!owner && (todayDoc.byClient[clientId]?.requests ?? 0) >= L.requestsPerDay) {
        return error(429, 'daily_limit', "You have reached today's limit of AI messages on this device.");
      }
      if (L.dailyBudgetUsd > 0 && todayDoc.cost >= L.dailyBudgetUsd) return error(429, 'budget_exhausted', "The AI assistant has used up today's budget.");
      if (L.monthlyBudgetUsd > 0 && (await monthCost(monthKey(now()))) >= L.monthlyBudgetUsd) return error(429, 'budget_exhausted', "The AI assistant has used up this month's budget.");
      await recordUsageUnlocked({ clientId: who, model, phase: 'start' });
      return null;
    });
    if (gateResult) return gateResult;

    const stream = new ReadableStream({
      async start(controller) {
        const send = (event, data) => controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        send('meta', { model, mode, lang });
        try {
          for await (const ev of streamChat({ apiKey, model, messages: [{ role: 'system', content: system }, ...trimmed], maxTokens: L.maxOutputTokens, fetchImpl, baseUrl, signal: abort.signal })) {
            if (ev.type === 'delta') send('delta', { text: ev.text });
            else if (ev.type === 'usage') usage = ev.usage;
            else if (ev.type === 'finish') send('finish', { reason: ev.reason });
          }
          send('usage', usage ?? { promptTokens: null, completionTokens: null, cost: null });
          send('done', {});
        } catch (e) {
          if (abort.signal.aborted) {
            aborted = true;
          } else {
            errored = true;
            const d = describeError(e);
            log(`chat error: ${d.code}`);
            send('error', d);
          }
        } finally {
          apiKey = null;
          try {
            await recordUsage({ clientId: who, model, usage, aborted, errored, phase: 'end' });
          } catch (e) {
            log(`usage record failed: ${e?.message ?? e}`);
          }
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        }
      },
      cancel() {
        abort.abort();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' },
    });
  }

  /* ------------------------------------------------------------ dispatch */

  return async function handle(request, meta = {}) {
    const url = new URL(request.url);
    const path = url.pathname.startsWith(API_PREFIX) ? url.pathname.slice(API_PREFIX.length).replace(/\/+$/, '') : null;
    if (path === null) return error(404, 'not_found', 'Unknown route.');
    const method = request.method.toUpperCase();
    try {
      if (method === 'GET' && path === '/status') return await status(request);
      if (method === 'POST' && path === '/owner/login') return await login(request, meta);
      if (method === 'POST' && path === '/owner/logout') return await logout(request);
      if (method === 'POST' && path === '/chat') return await chat(request, meta);
      if (path.startsWith('/owner/')) {
        if (!ownerFromRequest(request)) return error(401, 'owner_required', 'Owner sign-in required.');
        if (method === 'GET' && path === '/owner/config') return await getConfig();
        if (method === 'PUT' && path === '/owner/key') return await putKey(request);
        if (method === 'DELETE' && path === '/owner/key') return await deleteKey(request);
        if (method === 'PUT' && path === '/owner/settings') return await putSettings(request);
        if (method === 'POST' && path === '/owner/test') return await testKey(request);
        if (method === 'GET' && path === '/owner/usage') return await usageReport();
      }
      return error(404, 'not_found', 'Unknown route.');
    } catch (e) {
      if (e instanceof Response) return e;
      log(`unhandled: ${e?.message ?? e}`);
      return error(500, 'internal', 'Something went wrong on the server.');
    }
  };
}

export function describeError(e) {
  if (e instanceof OpenRouterError) return { code: e.code, message: e.message, status: e.status, detail: typeof e.detail === 'string' ? e.detail.slice(0, 300) : undefined };
  if (e && e.name === 'AbortError') return { code: 'aborted', message: 'The request was cancelled.' };
  const message = e instanceof Error ? e.message : String(e);
  if (/fetch failed|ECONNREFUSED|ENOTFOUND|network/i.test(message)) return { code: 'network', message: 'The server could not reach OpenRouter.' };
  return { code: 'unknown', message: 'Unexpected error while talking to the model.' };
}
