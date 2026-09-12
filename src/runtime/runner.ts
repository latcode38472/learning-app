/**
 * Main-thread interface to the Python sandbox worker.
 *
 * Execution limits:
 *  - every request has a timeout; on timeout the worker is terminated and a
 *    fresh one is started (the learner sees a friendly "did a loop never end?" message)
 *  - output is capped inside the harness
 *  - the worker has no access to the page, the app state or any server
 */
import type { CodeCheck } from '@/content/schema';

export interface PythonError {
  type: string;
  message: string;
  line: number | null;
  source: string | null;
  traceback: string;
}

export interface RunResult {
  stdout: string;
  error: PythonError | null;
  needInput: string | null;
  truncated: boolean;
  /** Set by the runner, not the harness. */
  timedOut?: boolean;
  elapsedMs?: number;
}

export interface CheckResult {
  kind: 'test' | 'requires' | 'forbids';
  passed: boolean;
  index?: number;
  type?: 'output' | 'function' | 'python';
  name?: { en: string; he?: string } | null;
  message?: { en: string; he?: string } | string | null;
  stdin?: string[];
  expected?: string;
  actual?: string;
  actualValue?: string;
  call?: string;
  match?: string;
  reason?: 'need-input' | 'too-much-output' | 'printed-not-returned' | 'bad-expected';
  printed?: string;
  error?: PythonError;
}

export interface GradeResult {
  passed: boolean;
  results: CheckResult[];
  timedOut?: boolean;
  /** The sandbox itself failed (e.g. a fatal WebAssembly error); it has been restarted. */
  workerError?: string;
}

export interface TraceCondition {
  /** Source text of the condition, e.g. "x > 3". */
  src: string;
  kind: 'if' | 'while';
  result: boolean;
  /** body = entered the block; else/elif = went to that branch; skip = jumped past the if; exit = left the loop. */
  taken: 'body' | 'else' | 'elif' | 'skip' | 'exit';
}

export interface TraceStep {
  line: number;
  event: 'call' | 'line' | 'return';
  func: string;
  depth: number;
  vars: Record<string, string>;
  stdout: string;
  ret: string | null;
  /** Present when this line holds an if / elif / while test whose outcome is known. */
  cond?: TraceCondition;
}

export interface TraceResult {
  steps: TraceStep[];
  finalVars: Record<string, string>;
  stdout: string;
  error: PythonError | null;
  needInput: string | null;
  truncated: boolean;
  timedOut?: boolean;
}

export type RuntimeStatus = 'idle' | 'loading' | 'ready' | 'busy' | 'error';

type Pending = { resolve: (v: unknown) => void; reject: (e: Error) => void; timer: number };

export class TimeoutError extends Error {
  constructor(public readonly seconds: number) {
    super(`Program stopped after ${seconds} seconds`);
    this.name = 'TimeoutError';
  }
}

const DEFAULT_TIMEOUT_MS = 8_000;

/** A fresh seed for runs where randomness should look random (not for grading). */
export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000) + 1;
}

/** Turn a failure of the sandbox itself into a learner-facing error object. */
function workerFailure(e: unknown): PythonError {
  const message = e instanceof Error ? e.message : String(e);
  return { type: 'SandboxError', message, line: null, source: null, traceback: message };
}

function resolveIndexURL(): string {
  const configured = import.meta.env.VITE_PYODIDE_INDEX_URL as string | undefined;
  if (configured) return configured.endsWith('/') ? configured : configured + '/';
  const base = import.meta.env.BASE_URL || '/';
  return new URL(`${base}pyodide/`, window.location.href).href;
}

class PythonRuntime {
  private worker: Worker | null = null;
  private nextId = 1;
  private pending = new Map<number, Pending>();
  private readyPromise: Promise<void> | null = null;
  private statusValue: RuntimeStatus = 'idle';
  private listeners = new Set<(s: RuntimeStatus) => void>();
  private queue: Promise<unknown> = Promise.resolve();

  get status(): RuntimeStatus {
    return this.statusValue;
  }

  subscribe(listener: (s: RuntimeStatus) => void): () => void {
    this.listeners.add(listener);
    listener(this.statusValue);
    return () => this.listeners.delete(listener);
  }

  private setStatus(s: RuntimeStatus) {
    this.statusValue = s;
    for (const l of this.listeners) l(s);
  }

  /** Start loading Python in the background (call early so the first Run is fast). */
  warmUp(): Promise<void> {
    return this.ensureReady().catch(() => undefined);
  }

  private spawn(): Worker {
    const worker = new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<{ id: number; ok: boolean; result?: unknown; error?: string }>) => {
      const { id, ok, result, error } = event.data;
      const p = this.pending.get(id);
      if (!p) return;
      this.pending.delete(id);
      window.clearTimeout(p.timer);
      if (ok) p.resolve(result);
      else p.reject(new Error(error ?? 'Unknown worker error'));
    };
    worker.onerror = (e) => {
      for (const [id, p] of this.pending) {
        window.clearTimeout(p.timer);
        p.reject(new Error(e.message || 'Worker error'));
        this.pending.delete(id);
      }
      this.setStatus('error');
    };
    return worker;
  }

  private ensureReady(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;
    this.setStatus('loading');
    this.worker = this.spawn();
    const promise: Promise<void> = this.send('init', { indexURL: resolveIndexURL() }, 120_000)
      .then(() => {
        if (this.readyPromise === promise) this.setStatus('ready');
      })
      .catch((e) => {
        // Only clear our own promise: a restart may already have installed a newer one.
        if (this.readyPromise === promise) {
          this.setStatus('error');
          this.readyPromise = null;
        }
        throw e;
      });
    this.readyPromise = promise;
    return promise;
  }

  private send(type: string, payload: unknown, timeoutMs: number): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('No worker'));
        return;
      }
      const id = this.nextId++;
      const timer = window.setTimeout(() => {
        this.pending.delete(id);
        reject(new TimeoutError(Math.round(timeoutMs / 1000)));
        this.restart();
      }, timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      const message = type === 'init' ? { id, type, ...(payload as object) } : { id, type, payload };
      this.worker.postMessage(message);
    });
  }

  /** Kill a runaway worker and prepare a fresh one. */
  restart(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    for (const [id, p] of this.pending) {
      window.clearTimeout(p.timer);
      p.reject(new Error('Runtime restarted'));
      this.pending.delete(id);
    }
    this.readyPromise = null;
    this.setStatus('idle');
    void this.warmUp();
  }

  /** Requests run one at a time so a timeout only ever kills the offending program. */
  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const run = this.queue.then(fn, fn);
    this.queue = run.catch(() => undefined);
    return run;
  }

  private async request<T>(type: 'run' | 'grade' | 'trace', payload: unknown, timeoutMs: number): Promise<T> {
    return this.enqueue(async () => {
      await this.ensureReady();
      this.setStatus('busy');
      const started = performance.now();
      try {
        const result = (await this.send(type, payload, timeoutMs)) as T;
        return result;
      } finally {
        if (this.statusValue === 'busy') this.setStatus('ready');
        void started;
      }
    });
  }

  /** Any failure of the sandbox itself (not a timeout) leaves it in an unknown state: restart it. */
  private recover(e: unknown): void {
    if (e instanceof TimeoutError) return;
    this.restart();
  }

  async run(code: string, opts: { stdin?: string[]; seed?: number; timeoutMs?: number } = {}): Promise<RunResult> {
    const started = performance.now();
    try {
      const res = await this.request<RunResult>(
        'run',
        { code, stdin: opts.stdin ?? [], seed: opts.seed ?? 1, echo: true, showPrompt: true },
        opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      );
      return { ...res, elapsedMs: performance.now() - started };
    } catch (e) {
      if (e instanceof TimeoutError) return { stdout: '', error: null, needInput: null, truncated: false, timedOut: true };
      this.recover(e);
      return { stdout: '', error: workerFailure(e), needInput: null, truncated: false };
    }
  }

  async grade(code: string, check: CodeCheck, opts: { seed?: number; timeoutMs?: number } = {}): Promise<GradeResult> {
    try {
      return await this.request<GradeResult>('grade', { code, check, seed: opts.seed ?? 1 }, opts.timeoutMs ?? 20_000);
    } catch (e) {
      if (e instanceof TimeoutError) return { passed: false, results: [], timedOut: true };
      this.recover(e);
      return { passed: false, results: [], workerError: workerFailure(e).message };
    }
  }

  async trace(code: string, opts: { stdin?: string[]; seed?: number; maxSteps?: number; timeoutMs?: number } = {}): Promise<TraceResult> {
    try {
      return await this.request<TraceResult>(
        'trace',
        { code, stdin: opts.stdin ?? [], seed: opts.seed ?? 1, maxSteps: opts.maxSteps ?? 400 },
        opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      );
    } catch (e) {
      if (e instanceof TimeoutError) {
        return { steps: [], finalVars: {}, stdout: '', error: null, needInput: null, truncated: false, timedOut: true };
      }
      this.recover(e);
      return { steps: [], finalVars: {}, stdout: '', error: workerFailure(e), needInput: null, truncated: false };
    }
  }
}

export const runtime = new PythonRuntime();
export const RUN_TIMEOUT_SECONDS = DEFAULT_TIMEOUT_MS / 1000;
