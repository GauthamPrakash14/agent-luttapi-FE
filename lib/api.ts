export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch { /* ignore json parse failure */ }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

// Derives a readable display name from an Ollama model name.
// "phi3.5" → "Phi3.5"  |  "llama3.2:3b" → "Llama3.2 3b"
export function toDisplayName(name: string): string {
  const s = name.replace(/:/g, ' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type StreamEvent =
  | { type: 'content'; text: string }
  | { type: 'thinking'; active: boolean };

// Async generator — yields StreamEvents from the SSE chat stream.
// Content tokens are type:'content'; thinking-state changes are type:'thinking'.
export async function* streamChat(
  conversationId: string,
  content: string,
): AsyncGenerator<StreamEvent> {
  const res = await fetch(
    `${API_BASE}/api/v1/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    },
  );
  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch { /* ignore */ }
    throw new Error(detail);
  }
  if (!res.body) return;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          if (typeof parsed.thinking === 'boolean') {
            yield { type: 'thinking', active: parsed.thinking };
          } else if (parsed.content) {
            yield { type: 'content', text: parsed.content as string };
          }
        } catch {
          /* skip malformed chunk */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
