/**
 * OpenRouter client (checked against the official API reference, September 2026):
 *
 *  POST https://openrouter.ai/api/v1/chat/completions
 *    headers: Authorization: Bearer <key>, Content-Type: application/json,
 *             optional HTTP-Referer and X-Title to identify the app
 *    body:    { model, messages, stream, max_tokens, temperature }
 *    stream:  Server-Sent Events. Each event is "data: <json>"; comment lines
 *             starting with ":" (e.g. ": OPENROUTER PROCESSING") must be
 *             ignored; the stream ends with "data: [DONE]". Text arrives in
 *             choices[0].delta.content. Usage (prompt_tokens, completion_tokens,
 *             total_tokens, cost in USD credits) is always included and arrives
 *             in the last data event before [DONE]. Errors after the response
 *             has started arrive as a data event with a top-level "error".
 *  GET  https://openrouter.ai/api/v1/key
 *    returns { data: { label, limit, limit_remaining, usage, is_free_tier, ... } }
 *  GET  https://openrouter.ai/api/v1/models
 *    returns { data: [{ id, name, pricing: { prompt, completion }, ... }] }
 *
 *  Errors: { error: { code, message, metadata? } } with HTTP 400 bad request,
 *  401 invalid key, 402 insufficient credits, 403 moderation/forbidden,
 *  408 timeout, 429 rate limited, 502 model down, 503 no provider.
 */

export const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterError extends Error {
  constructor(code, message, status, detail) {
    super(message);
    this.name = 'OpenRouterError';
    /** Stable machine-readable code used by the UI for localized messages. */
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

/** Map an HTTP status (and OpenRouter's error body) to a stable code + honest message. */
export function classifyError(status, body) {
  const message = body?.error?.message || body?.message || '';
  const lower = String(message).toLowerCase();
  if (status === 401) return new OpenRouterError('invalid_key', 'OpenRouter rejected the API key.', status, message);
  if (status === 402) return new OpenRouterError('no_credits', 'The OpenRouter account has no credits left.', status, message);
  if (status === 403) return new OpenRouterError('forbidden', 'OpenRouter refused the request (moderation or permissions).', status, message);
  if (status === 404 || (status === 400 && /model/.test(lower) && /(not|invalid|unknown|no endpoints)/.test(lower))) {
    return new OpenRouterError('model_not_found', 'The configured model id is not available on OpenRouter.', status, message);
  }
  if (status === 408) return new OpenRouterError('timeout', 'OpenRouter timed out.', status, message);
  if (status === 429) return new OpenRouterError('provider_rate_limited', 'OpenRouter is rate limiting this key.', status, message);
  if (status === 502 || status === 503) return new OpenRouterError('model_unavailable', 'The model is unavailable right now.', status, message);
  if (status === 400) return new OpenRouterError('bad_request', 'OpenRouter rejected the request.', status, message);
  return new OpenRouterError('provider_error', `OpenRouter responded with HTTP ${status}.`, status, message);
}

async function readErrorBody(res) {
  try {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { message: text.slice(0, 300) };
    }
  } catch {
    return {};
  }
}

function headers(apiKey, extra = {}) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://learningcomputerscience.netlify.app',
    'X-Title': 'CodePath learning app',
    ...extra,
  };
}

/** GET /key — validates the key and reports limits. Never returns the key itself. */
export async function checkKey(apiKey, { fetchImpl = fetch, baseUrl = DEFAULT_BASE_URL, signal } = {}) {
  const res = await fetchImpl(`${baseUrl}/key`, { headers: headers(apiKey), signal });
  if (!res.ok) throw classifyError(res.status, await readErrorBody(res));
  const json = await res.json();
  const d = json?.data ?? {};
  return {
    label: d.label ?? null,
    limit: d.limit ?? null,
    limitRemaining: d.limit_remaining ?? null,
    usage: d.usage ?? null,
    isFreeTier: !!d.is_free_tier,
  };
}

/** GET /models — finds one model and its pricing (USD per token). */
export async function findModel(apiKey, modelId, { fetchImpl = fetch, baseUrl = DEFAULT_BASE_URL, signal } = {}) {
  const res = await fetchImpl(`${baseUrl}/models`, { headers: headers(apiKey), signal });
  if (!res.ok) throw classifyError(res.status, await readErrorBody(res));
  const json = await res.json();
  const list = Array.isArray(json?.data) ? json.data : [];
  const m = list.find((x) => x.id === modelId);
  if (!m) return null;
  return {
    id: m.id,
    name: m.name ?? m.id,
    promptPrice: Number(m.pricing?.prompt ?? 0),
    completionPrice: Number(m.pricing?.completion ?? 0),
    contextLength: m.context_length ?? null,
  };
}

/**
 * Streams a chat completion. Yields:
 *   { type: 'delta', text }
 *   { type: 'usage', usage: { promptTokens, completionTokens, totalTokens, cost } }
 *   { type: 'finish', reason }
 * Throws OpenRouterError on HTTP errors or a mid-stream error event.
 */
export async function* streamChat({ apiKey, model, messages, maxTokens, temperature = 0.4, fetchImpl = fetch, baseUrl = DEFAULT_BASE_URL, signal }) {
  const res = await fetchImpl(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({ model, messages, stream: true, max_tokens: maxTokens, temperature }),
    signal,
  });
  if (!res.ok) throw classifyError(res.status, await readErrorBody(res));
  if (!res.body) throw new OpenRouterError('provider_error', 'OpenRouter returned an empty response.', res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let done = false;
  try {
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (streamDone) break;
      buffer += decoder.decode(value, { stream: true });
      let nl;
      while ((nl = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, nl).replace(/\r$/, '');
        buffer = buffer.slice(nl + 1);
        if (line === '' || line.startsWith(':')) continue; // keep-alive comments
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') {
          done = true;
          break;
        }
        let json;
        try {
          json = JSON.parse(payload);
        } catch {
          continue; // a partial or malformed frame; the next line will be complete
        }
        if (json.error) {
          const code = Number(json.error.code) || 500;
          throw classifyError(code, json);
        }
        const choice = Array.isArray(json.choices) ? json.choices[0] : undefined;
        const text = choice?.delta?.content;
        if (typeof text === 'string' && text.length) yield { type: 'delta', text };
        if (choice?.finish_reason) yield { type: 'finish', reason: choice.finish_reason };
        if (json.usage && typeof json.usage === 'object') {
          yield {
            type: 'usage',
            usage: {
              promptTokens: Number(json.usage.prompt_tokens ?? 0),
              completionTokens: Number(json.usage.completion_tokens ?? 0),
              totalTokens: Number(json.usage.total_tokens ?? 0),
              cost: typeof json.usage.cost === 'number' ? json.usage.cost : null,
            },
          };
        }
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* already closed */
    }
  }
}
