/**
 * Browser client for the assistant backend (/api/assistant/*).
 *
 * The API key never reaches the browser: this client only ever sees a masked
 * status. Owner routes rely on an HttpOnly cookie set by the server; the
 * anti-CSRF header below is required on every mutating request.
 */

export interface AssistantStatus {
  backend: true;
  serverConfigured: boolean;
  keyConfigured: boolean;
  model: string;
  learnerAccess: boolean;
  role: 'owner' | 'learner';
  canChat: boolean;
  limits: { maxOutputTokens: number; requestsPerMinute: number; requestsPerDay: number; maxMessageChars: number };
}

export interface AssistantLimits {
  maxOutputTokens: number;
  requestsPerMinute: number;
  requestsPerDay: number;
  dailyBudgetUsd: number;
  monthlyBudgetUsd: number;
  maxMessageChars: number;
  maxConversationChars: number;
  maxMessages: number;
}

export interface OwnerConfig {
  key: { configured: false } | { configured: true; masked: string; savedAt: string; label: string | null };
  model: string;
  learnerAccess: boolean;
  limits: AssistantLimits;
  updatedAt: string | null;
  serverConfigured: boolean;
  storage: string;
}

export interface KeyTestResult {
  ok: boolean;
  stage?: 'key' | 'sample';
  error?: ApiErrorBody;
  key?: { label: string | null; limit: number | null; limitRemaining: number | null; usage: number | null; isFreeTier: boolean } | null;
  model?: { id: string; found: boolean | null; name?: string; promptPrice?: number; completionPrice?: number; contextLength?: number | null; error?: ApiErrorBody } | null;
  sample?: { ok: boolean; text?: string; usage?: Usage | null; error?: ApiErrorBody } | null;
}

export interface Usage {
  promptTokens: number | null;
  completionTokens: number | null;
  totalTokens?: number | null;
  cost: number | null;
}

export interface UsageReport {
  days: Array<{ day: string; requests: number; promptTokens: number; completionTokens: number; cost: number; clients: number; byModel: Record<string, { requests: number; promptTokens: number; completionTokens: number; cost: number }>; errors: number; aborted: number }>;
  todayCost: number;
  monthCost: number;
  limits: AssistantLimits;
  note: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  status?: number;
  detail?: string;
  retryAfterMs?: number;
}

export class ApiError extends Error {
  code: string;
  status: number;
  detail?: string;
  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.code = body.code;
    this.status = status;
    this.detail = body.detail;
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatContext {
  lessonId?: string;
  lessonTitle?: string;
  objective?: string;
  concepts?: string[];
  exerciseTitle?: string;
  hints?: string[];
  code?: string;
  lastError?: string;
  lastResult?: string;
}

export interface ChatRequest {
  mode: 'lesson' | 'general';
  lang: 'en' | 'he';
  messages: ChatMessage[];
  context?: ChatContext;
}

export interface ChatHandlers {
  onMeta?: (meta: { model: string; mode: string; lang: string }) => void;
  onDelta: (text: string) => void;
  onUsage?: (usage: Usage) => void;
  onFinish?: (reason: string) => void;
}

const BASE = `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/api/assistant`;
const CLIENT_KEY = 'codepath.assistant.client';

/** A random per-device id used by the server for rate limits. Not an identity. */
export function clientId(): string {
  try {
    let id = window.localStorage.getItem(CLIENT_KEY);
    if (!id) {
      id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem(CLIENT_KEY, id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
}

function headers(): Record<string, string> {
  return { 'Content-Type': 'application/json', 'X-Requested-With': 'codepath', 'X-Client-Id': clientId() };
}

async function parseError(res: Response): Promise<ApiError> {
  let body: ApiErrorBody = { code: `http_${res.status}`, message: `The server responded with ${res.status}.` };
  try {
    const data = await res.json();
    if (data && data.error) body = data.error;
  } catch {
    /* not JSON */
  }
  return new ApiError(res.status, body);
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers(), ...(init.headers as Record<string, string>) }, credentials: 'same-origin' });
  if (!res.ok) throw await parseError(res);
  return (await res.json()) as T;
}

/** Returns null when no backend is reachable at this origin (static hosting without functions). */
export async function fetchStatus(): Promise<AssistantStatus | null> {
  try {
    const res = await fetch(`${BASE}/status`, { headers: headers(), credentials: 'same-origin' });
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) return null;
    const data = (await res.json()) as AssistantStatus;
    return data && data.backend ? data : null;
  } catch {
    return null;
  }
}

export const ownerLogin = (password: string) => call<{ ok: true; expiresAt: string }>('/owner/login', { method: 'POST', body: JSON.stringify({ password }) });
export const ownerLogout = () => call<{ ok: true }>('/owner/logout', { method: 'POST', body: '{}' });
export const getOwnerConfig = () => call<OwnerConfig>('/owner/config');
export const saveKey = (apiKey: string) => call<OwnerConfig>('/owner/key', { method: 'PUT', body: JSON.stringify({ apiKey }) });
export const removeKey = () => call<OwnerConfig>('/owner/key', { method: 'DELETE' });
export const testKey = (sendSample: boolean) => call<KeyTestResult>('/owner/test', { method: 'POST', body: JSON.stringify({ sendSample }) });
export const saveSettings = (patch: { model?: string; learnerAccess?: boolean; limits?: Partial<AssistantLimits> }) => call<OwnerConfig>('/owner/settings', { method: 'PUT', body: JSON.stringify(patch) });
export const getUsage = () => call<UsageReport>('/owner/usage');

/**
 * Streams one assistant reply. Resolves when the stream ends; rejects with an
 * ApiError (HTTP error or an `error` event) or an AbortError when cancelled.
 */
export async function streamChat(body: ChatRequest, handlers: ChatHandlers, signal?: AbortSignal): Promise<void> {
  const res = await fetch(`${BASE}/chat`, { method: 'POST', headers: headers(), body: JSON.stringify(body), signal, credentials: 'same-origin' });
  if (!res.ok) throw await parseError(res);
  if (!res.body) throw new ApiError(500, { code: 'empty', message: 'Empty response from the server.' });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let streamError: ApiError | null = null;
  const handleFrame = (frame: string) => {
    let event = 'message';
    const dataLines: string[] = [];
    for (const line of frame.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
    }
    if (!dataLines.length) return;
    let data: unknown;
    try {
      data = JSON.parse(dataLines.join('\n'));
    } catch {
      return;
    }
    switch (event) {
      case 'meta':
        handlers.onMeta?.(data as { model: string; mode: string; lang: string });
        break;
      case 'delta':
        handlers.onDelta((data as { text: string }).text);
        break;
      case 'usage':
        handlers.onUsage?.(data as Usage);
        break;
      case 'finish':
        handlers.onFinish?.((data as { reason: string }).reason);
        break;
      case 'error':
        streamError = new ApiError(502, data as ApiErrorBody);
        break;
      default:
        break;
    }
  };
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n\n')) >= 0) {
        handleFrame(buffer.slice(0, idx));
        buffer = buffer.slice(idx + 2);
      }
    }
    if (buffer.trim()) handleFrame(buffer);
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* ignore */
    }
  }
  if (streamError) throw streamError;
}
