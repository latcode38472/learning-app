/**
 * Cryptographic helpers for the assistant backend.
 *
 *  - The OpenRouter API key is encrypted at rest with AES-256-GCM. The
 *    encryption key is derived from ASSISTANT_SECRET, an environment variable
 *    that only exists on the server (Netlify environment settings or a local
 *    .env that is never committed). Without that secret the stored blob is
 *    useless.
 *  - Owner sessions are HMAC-signed tokens (no server-side session table).
 *  - Password comparison is constant-time.
 */
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const ALGO = 'aes-256-gcm';

/** 32-byte key derived from the secret; a stable KDF so redeploys keep decrypting. */
export function deriveKey(secret, purpose = 'codepath-assistant-key-v1') {
  if (typeof secret !== 'string' || secret.length < 16) {
    throw new Error('ASSISTANT_SECRET must be set to a string of at least 16 characters');
  }
  return createHash('sha256').update(`${purpose}:${secret}`).digest();
}

export function encryptString(plain, secret) {
  const key = deriveKey(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const data = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { v: 1, iv: iv.toString('base64'), tag: tag.toString('base64'), data: data.toString('base64') };
}

export function decryptString(blob, secret) {
  if (!blob || blob.v !== 1) throw new Error('Unknown ciphertext format');
  const key = deriveKey(secret);
  const decipher = createDecipheriv(ALGO, key, Buffer.from(blob.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(blob.tag, 'base64'));
  const out = Buffer.concat([decipher.update(Buffer.from(blob.data, 'base64')), decipher.final()]);
  return out.toString('utf8');
}

/** Constant-time comparison of two strings (hashes them so lengths do not leak). */
export function safeEqual(a, b) {
  const ha = createHash('sha256').update(String(a ?? '')).digest();
  const hb = createHash('sha256').update(String(b ?? '')).digest();
  return timingSafeEqual(ha, hb);
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s) {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

/** Signed token: base64url(payload).base64url(hmac). Payload carries `exp` (ms since epoch). */
export function signToken(payload, secret) {
  const body = b64url(JSON.stringify(payload));
  const mac = createHmac('sha256', deriveKey(secret, 'codepath-assistant-session-v1')).update(body).digest();
  return `${body}.${b64url(mac)}`;
}

export function verifyToken(token, secret, now = Date.now()) {
  if (typeof token !== 'string') return null;
  const [body, mac] = token.split('.');
  if (!body || !mac) return null;
  const expected = createHmac('sha256', deriveKey(secret, 'codepath-assistant-session-v1')).update(body).digest();
  const given = fromB64url(mac);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(fromB64url(body).toString('utf8'));
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

/** "sk-or-v1-…c3d4" — enough to recognise a key, never enough to use it. */
export function maskKey(key) {
  const s = String(key ?? '');
  if (s.length <= 8) return '••••';
  return `${s.slice(0, 9)}…${s.slice(-4)}`;
}

export function randomId(bytes = 16) {
  return randomBytes(bytes).toString('hex');
}
