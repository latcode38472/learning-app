// Copies the Pyodide runtime (Python compiled to WebAssembly) from node_modules
// into public/pyodide so the app can run Python fully inside the learner's
// browser without depending on an external CDN at runtime.
//
// Learner code never runs on a server: it runs inside a Web Worker in the
// browser, sandboxed by WebAssembly, with a timeout and output limits.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'node_modules', 'pyodide');
const dest = join(root, 'public', 'pyodide');

if (!existsSync(src)) {
  console.error('[copy-pyodide] node_modules/pyodide not found. Run `npm install` first.');
  process.exit(0);
}

const wanted = (name) =>
  !name.endsWith('.d.ts') &&
  !name.endsWith('.md') &&
  !name.endsWith('.map') &&
  name !== 'package.json' &&
  name !== 'node_modules' &&
  !name.endsWith('.whl');

mkdirSync(dest, { recursive: true });
const stampFile = join(dest, '.version');
const pkgVersion = JSON.parse(readFileSync(join(src, 'package.json'), 'utf8')).version;
if (existsSync(stampFile) && readFileSync(stampFile, 'utf8').trim() === pkgVersion) {
  console.log(`[copy-pyodide] public/pyodide already has Pyodide ${pkgVersion}.`);
  process.exit(0);
}

let copied = 0;
for (const name of readdirSync(src)) {
  if (!wanted(name)) continue;
  const from = join(src, name);
  if (statSync(from).isDirectory()) continue;
  cpSync(from, join(dest, name));
  copied += 1;
}
writeFileSync(stampFile, pkgVersion + '\n');
console.log(`[copy-pyodide] Copied ${copied} files for Pyodide ${pkgVersion} into public/pyodide.`);
