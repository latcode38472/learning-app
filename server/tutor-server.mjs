/**
 * CodePath optional tutor server.
 *
 * The app works fully without this. When a learner explicitly enables the
 * "connected AI tutor" in Settings and points it here, the browser sends the
 * conversation plus a system prompt describing the current lesson; this server
 * forwards it to Claude and returns the reply. The API key lives only here.
 *
 *   cd server && npm install
 *   ANTHROPIC_API_KEY=sk-ant-... npm start        # listens on :8787
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY        required (or an `ant auth login` profile)
 *   TUTOR_PORT               default 8787
 *   TUTOR_MODEL              default claude-opus-5
 *   TUTOR_ALLOWED_ORIGIN     default * (set to your app origin in production)
 *   TUTOR_MAX_PER_MINUTE     default 20 requests per client address
 *
 * Every request costs money through your own API account; the app shows a
 * cost notice before the learner can enable this.
 */
import http from 'node:http';
import Anthropic from '@anthropic-ai/sdk';

const PORT = Number(process.env.TUTOR_PORT ?? 8787);
const MODEL = process.env.TUTOR_MODEL ?? 'claude-opus-5';
const ALLOWED_ORIGIN = process.env.TUTOR_ALLOWED_ORIGIN ?? '*';
const MAX_PER_MINUTE = Number(process.env.TUTOR_MAX_PER_MINUTE ?? 20);
const MAX_MESSAGES = 12;
const MAX_CHARS = 6000;

const client = new Anthropic();

/** Very small per-address rate limiter so a misconfigured page cannot run up a bill. */
const buckets = new Map();
function allow(ip) {
  const now = Date.now();
  const entry = buckets.get(ip) ?? { count: 0, reset: now + 60_000 };
  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + 60_000;
  }
  entry.count += 1;
  buckets.set(ip, entry);
  return entry.count <= MAX_PER_MINUTE;
}

const GUARDRAILS = [
  'You are the tutor inside a beginner programming app. Follow the situation description you are given.',
  'Guide with questions and small nudges. Never write the complete solution to an exercise or project step.',
  'Only use concepts the learner has already met. Keep replies short (under 150 words) and kind.',
  'Reply in the language requested; keep code and Python keywords in English.',
].join(' ');

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 200_000) {
        reject(new Error('Body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  res.end(JSON.stringify(body));
}

async function tutorReply(messages, system) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `${GUARDRAILS}\n\n${system}`,
    output_config: { effort: 'low' },
    messages,
  });
  if (response.stop_reason === 'refusal') {
    return 'I cannot help with that request here. Let us get back to the lesson: what are you trying to make the program do?';
  }
  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true, model: MODEL });
  if (req.method !== 'POST' || req.url !== '/api/tutor') return send(res, 404, { error: 'Not found' });
  const ip = req.socket.remoteAddress ?? 'unknown';
  if (!allow(ip)) return send(res, 429, { error: 'Too many requests. Please wait a minute.' });
  try {
    const body = JSON.parse((await readBody(req)) || '{}');
    const system = typeof body.system === 'string' ? body.system.slice(0, 12_000) : '';
    const raw = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
    const messages = raw
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (messages.length === 0 || messages[0].role !== 'user') return send(res, 400, { error: 'messages must start with a user message' });
    const reply = await tutorReply(messages, system);
    return send(res, 200, { reply });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) return send(res, 500, { error: 'The tutor server has no valid API key.' });
    if (error instanceof Anthropic.RateLimitError) return send(res, 429, { error: 'The AI provider is rate limiting; try again shortly.' });
    if (error instanceof Anthropic.APIError) return send(res, 502, { error: `AI provider error (${error.status}).` });
    return send(res, 500, { error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

server.listen(PORT, () => {
  console.log(`CodePath tutor server listening on http://localhost:${PORT} (model: ${MODEL})`);
  if (!process.env.ANTHROPIC_API_KEY) console.log('Note: ANTHROPIC_API_KEY is not set; the SDK will look for another credential source.');
});
