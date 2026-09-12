/**
 * A fake OpenRouter for tests and local development. It speaks the same
 * HTTP shapes as the real API (see openrouter.mjs) but never contacts the
 * network. Behaviour is chosen by the API key or model id:
 *
 *   key "sk-or-v1-mock-invalid"     -> 401 on every call
 *   key "sk-or-v1-mock-nocredits"   -> 402 on chat
 *   key "sk-or-v1-mock-ratelimited" -> 429 on chat
 *   model "mock/broken"             -> 502 on chat
 *   model "mock/midstream-error"    -> error event after one delta
 *   model "mock/slow"               -> streams one word every 150 ms (for Stop)
 *   model containing "unknown"      -> not listed in /models
 *
 * `createMockFetch()` returns a fetch-compatible function for in-process use;
 * `startMockServer()` serves it over HTTP for manual testing and Playwright.
 */
import http from 'node:http';

const OK_KEYS = new Set(['sk-or-v1-mock-valid-key-0000000000', 'sk-or-v1-mock-nocredits-000000000', 'sk-or-v1-mock-ratelimited-0000000']);

function sse(frames, signal) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for (const f of frames) {
        if (signal?.aborted) {
          controller.error(Object.assign(new Error('The operation was aborted'), { name: 'AbortError' }));
          return;
        }
        if (typeof f === 'number') {
          await new Promise((r) => setTimeout(r, f));
          continue;
        }
        controller.enqueue(encoder.encode(f));
      }
      controller.close();
    },
  });
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

export function createMockFetch({ reply = 'Hello! Let us look at your code together. What does line 1 do?', log = () => {} } = {}) {
  return async function mockFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;
    const auth = init.headers?.Authorization ?? init.headers?.authorization ?? '';
    const key = auth.replace(/^Bearer\s+/i, '');
    log(`${init.method ?? 'GET'} ${url}`);
    if (!OK_KEYS.has(key)) return jsonResponse(401, { error: { code: 401, message: 'No auth credentials found' } });

    if (url.endsWith('/key')) {
      return jsonResponse(200, { data: { label: 'mock key', limit: 5, limit_remaining: 4.25, usage: 0.75, is_free_tier: false } });
    }
    if (url.endsWith('/models')) {
      return jsonResponse(200, {
        data: [
          { id: 'openai/gpt-4o-mini', name: 'OpenAI: GPT-4o-mini', pricing: { prompt: '0.00000015', completion: '0.0000006' }, context_length: 128000 },
          { id: 'mock/slow', name: 'Mock slow model', pricing: { prompt: '0', completion: '0' }, context_length: 8000 },
          { id: 'mock/broken', name: 'Mock broken model', pricing: { prompt: '0', completion: '0' }, context_length: 8000 },
          { id: 'mock/midstream-error', name: 'Mock mid-stream error', pricing: { prompt: '0', completion: '0' }, context_length: 8000 },
        ],
      });
    }
    if (url.endsWith('/chat/completions')) {
      if (key === 'sk-or-v1-mock-nocredits-000000000') return jsonResponse(402, { error: { code: 402, message: 'Insufficient credits' } });
      if (key === 'sk-or-v1-mock-ratelimited-0000000') return jsonResponse(429, { error: { code: 429, message: 'Rate limit exceeded' } });
      const body = JSON.parse(init.body ?? '{}');
      const model = body.model ?? '';
      if (model === 'mock/broken') return jsonResponse(502, { error: { code: 502, message: 'Provider returned error' } });
      if (/unknown/.test(model)) return jsonResponse(400, { error: { code: 400, message: `${model} is not a valid model ID` } });
      const lastUser = [...(body.messages ?? [])].reverse().find((m) => m.role === 'user');
      const lang = (body.messages?.[0]?.content ?? '').includes('Reply in Hebrew') ? 'he' : 'en';
      const text = lastUser?.content === 'Reply with the single word OK.' ? 'OK' : lang === 'he' ? 'שלום! בואו נסתכל יחד על הקוד. מה עושה שורה 1?' : reply;
      const words = text.split(' ');
      const frames = [': OPENROUTER PROCESSING\n\n'];
      const delay = model === 'mock/slow' ? 150 : 0;
      const chunk = (delta, finish = null) => `data: ${JSON.stringify({ id: 'gen-mock', object: 'chat.completion.chunk', model, choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`;
      words.forEach((w, i) => {
        if (delay) frames.push(delay);
        frames.push(chunk({ content: (i ? ' ' : '') + w }));
        if (model === 'mock/midstream-error' && i === 0) {
          frames.push(`data: ${JSON.stringify({ id: 'gen-mock', error: { code: 502, message: 'Upstream provider failed mid-stream' }, choices: [{ index: 0, delta: {}, finish_reason: 'error' }] })}\n\n`);
        }
      });
      if (model !== 'mock/midstream-error') {
        frames.push(chunk({}, 'stop'));
        const completion = Math.max(1, words.length);
        const prompt = Math.ceil((body.messages ?? []).reduce((n, m) => n + String(m.content).length, 0) / 4);
        frames.push(`data: ${JSON.stringify({ id: 'gen-mock', object: 'chat.completion.chunk', model, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: prompt, completion_tokens: completion, total_tokens: prompt + completion, cost: (prompt * 0.15 + completion * 0.6) / 1_000_000 } })}\n\n`);
      }
      frames.push('data: [DONE]\n\n');
      return new Response(sse(frames, init.signal), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
    }
    return jsonResponse(404, { error: { code: 404, message: 'Not found' } });
  };
}

/** Serve the mock over HTTP: OPENROUTER_BASE_URL=http://127.0.0.1:8790/api/v1 */
export function startMockServer({ port = 8790, host = '127.0.0.1', log = console.log } = {}) {
  const mockFetch = createMockFetch({ log });
  const server = http.createServer(async (req, res) => {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const body = Buffer.concat(chunks).toString('utf8');
    const url = `http://${host}:${port}${req.url}`;
    const response = await mockFetch(url, { method: req.method, headers: { Authorization: req.headers.authorization ?? '' }, body: body || undefined });
    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    if (!response.body) return res.end();
    const reader = response.body.getReader();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  });
  return new Promise((resolve) => server.listen(port, host, () => resolve(server)));
}

if (process.argv[1] && process.argv[1].endsWith('mock-openrouter.mjs')) {
  const port = Number(process.env.MOCK_OPENROUTER_PORT ?? 8790);
  await startMockServer({ port });
  console.log(`Mock OpenRouter listening on http://127.0.0.1:${port}/api/v1 (valid key: sk-or-v1-mock-valid-key-0000000000)`);
}
