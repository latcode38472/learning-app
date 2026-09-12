/**
 * Local server for the assistant backend. Runs the exact handler that Netlify
 * runs in production, with a JSON-file store instead of Netlify Blobs.
 *
 *   OWNER_PASSWORD=choose-a-long-password ASSISTANT_SECRET=at-least-16-chars node server/dev-server.mjs
 *
 * Environment:
 *   OWNER_PASSWORD        required (8+ characters)
 *   ASSISTANT_SECRET      required (16+ characters); encrypts the stored API key
 *   OPENROUTER_BASE_URL   optional; point at the mock (http://127.0.0.1:8790/api/v1)
 *   ASSISTANT_DATA_DIR    optional; default .data/assistant (git-ignored)
 *   ASSISTANT_PORT        optional; default 8787
 *
 * Vite proxies /api to this port during `npm run dev` and `npm run preview`.
 */
import http from 'node:http';
import { resolve } from 'node:path';
import { createAssistantHandler } from './assistant/handler.mjs';
import { createFileStorage } from './assistant/storage.mjs';

const port = Number(process.env.ASSISTANT_PORT ?? 8787);
const dataDir = resolve(process.env.ASSISTANT_DATA_DIR ?? '.data/assistant');
const handler = createAssistantHandler({
  env: { ...process.env, ASSISTANT_COOKIE_SECURE: process.env.ASSISTANT_COOKIE_SECURE ?? 'false' },
  storage: createFileStorage(dataDir),
  log: (m) => console.log(`[assistant] ${m}`),
});

const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks);
  const url = `http://${req.headers.host ?? 'localhost'}${req.url}`;
  const controller = new AbortController();
  req.on('close', () => controller.abort());
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
    signal: controller.signal,
  });
  const response = await handler(request, { ip: req.socket.remoteAddress });
  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  if (!response.body) return res.end();
  const reader = response.body.getReader();
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } finally {
    res.end();
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Assistant backend on http://127.0.0.1:${port}${'/api/assistant'} (data: ${dataDir})`);
  if (!process.env.OWNER_PASSWORD || !process.env.ASSISTANT_SECRET) console.log('Warning: OWNER_PASSWORD and ASSISTANT_SECRET are not both set; the owner cannot sign in.');
  if (process.env.OPENROUTER_BASE_URL) console.log(`OpenRouter base URL: ${process.env.OPENROUTER_BASE_URL}`);
});
