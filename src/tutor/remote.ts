/**
 * Client for the optional tutor server (server/tutor-server.mjs).
 * The API key lives on that server, never in the browser.
 */
export interface TutorMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askRemoteTutor(endpoint: string, messages: TutorMessage[], system: string, signal?: AbortSignal): Promise<string> {
  const url = endpoint.replace(/\/$/, '') + '/api/tutor';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system }),
    signal,
  });
  if (!res.ok) throw new Error(`Tutor server responded with ${res.status}`);
  const data = (await res.json()) as { reply?: string; error?: string };
  if (!data.reply) throw new Error(data.error ?? 'Empty reply');
  return data.reply;
}
