/// <reference lib="webworker" />
/**
 * Web Worker that hosts the Python sandbox (Pyodide = CPython compiled to
 * WebAssembly). Learner code only ever runs here, inside the learner's own
 * browser, isolated from the page. The main thread enforces time limits by
 * terminating this worker when a program runs too long.
 */
import harnessSource from './harness.py?raw';

type Request =
  | { id: number; type: 'init'; indexURL: string }
  | { id: number; type: 'run'; payload: unknown }
  | { id: number; type: 'grade'; payload: unknown }
  | { id: number; type: 'trace'; payload: unknown };

interface PyodideLike {
  FS: { writeFile(path: string, data: string): void; mkdirTree?(path: string): void };
  pyimport(name: string): Record<string, (arg: string) => string>;
  runPython(code: string): unknown;
}

let pyodide: PyodideLike | null = null;
let harness: Record<string, (arg: string) => string> | null = null;
let initPromise: Promise<void> | null = null;

async function init(indexURL: string): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const mod = (await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`)) as {
        loadPyodide: (opts: { indexURL: string }) => Promise<PyodideLike>;
      };
      const py = await mod.loadPyodide({ indexURL });
      py.FS.writeFile('/home/pyodide/codepath_harness.py', harnessSource);
      harness = py.pyimport('codepath_harness');
      pyodide = py;
    })();
  }
  return initPromise;
}

self.onmessage = async (event: MessageEvent<Request>) => {
  const msg = event.data;
  try {
    if (msg.type === 'init') {
      await init(msg.indexURL);
      self.postMessage({ id: msg.id, ok: true, result: { ready: true } });
      return;
    }
    if (!pyodide || !harness) throw new Error('Python runtime not initialised');
    const request = JSON.stringify(msg.payload);
    let result: string;
    if (msg.type === 'run') result = harness.run_json(request);
    else if (msg.type === 'grade') result = harness.grade_json(request);
    else if (msg.type === 'trace') result = harness.trace_json(request);
    else throw new Error('Unknown request type');
    self.postMessage({ id: msg.id, ok: true, result: JSON.parse(result) });
  } catch (err) {
    self.postMessage({ id: msg.id, ok: false, error: err instanceof Error ? err.message : String(err) });
  }
};
