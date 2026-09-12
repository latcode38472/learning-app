/**
 * Small key/value storage abstraction with three backends:
 *  - Netlify Blobs (production; site-wide store, strong consistency)
 *  - a JSON-file directory (local development)
 *  - memory (tests)
 *
 * Keys look like "config", "usage/2026-09-12". Values are JSON.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export function createMemoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    kind: 'memory',
    async getJSON(key) {
      return map.has(key) ? structuredClone(map.get(key)) : null;
    },
    async setJSON(key, value) {
      map.set(key, structuredClone(value));
    },
    async delete(key) {
      map.delete(key);
    },
    /** Test helper: raw view of everything stored. */
    dump() {
      return Object.fromEntries(map);
    },
  };
}

export function createFileStorage(dir) {
  const pathFor = (key) => join(dir, key.replace(/[^a-zA-Z0-9/_.-]/g, '_') + '.json');
  return {
    kind: 'file',
    dir,
    async getJSON(key) {
      try {
        return JSON.parse(await readFile(pathFor(key), 'utf8'));
      } catch (e) {
        if (e && e.code === 'ENOENT') return null;
        throw e;
      }
    },
    async setJSON(key, value) {
      const file = pathFor(key);
      await mkdir(dirname(file), { recursive: true });
      // Write then rename so a crash never leaves a half-written config.
      const tmp = `${file}.${process.pid}.tmp`;
      await writeFile(tmp, JSON.stringify(value, null, 2), { mode: 0o600 });
      const { rename } = await import('node:fs/promises');
      await rename(tmp, file);
    },
    async delete(key) {
      await rm(pathFor(key), { force: true });
    },
  };
}

/**
 * Netlify Blobs. Works without configuration inside Netlify Functions (site
 * id and token are injected by the platform). Imported lazily so the local
 * dev server and the tests do not need the package.
 */
export async function createNetlifyBlobStorage(storeName = 'codepath-assistant') {
  const { getStore } = await import('@netlify/blobs');
  const store = getStore({ name: storeName, consistency: 'strong' });
  return {
    kind: 'netlify-blobs',
    async getJSON(key) {
      const value = await store.get(key, { type: 'json' });
      return value ?? null;
    },
    async setJSON(key, value) {
      await store.setJSON(key, value);
    },
    async delete(key) {
      await store.delete(key);
    },
  };
}
