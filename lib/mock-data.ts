import type { Conversation, Message, Model } from "./types";

/**
 * Simulates the subset of models currently loaded into Ollama
 * (as opposed to `AVAILABLE_MODELS` which lists every model the
 * project knows about). The mock async `useModels` hook returns this.
 *
 * Keep this list short — the point is to exercise the "only loaded
 * models are pickable" path. Today it's just phi3.5.
 */
export const MOCK_LOADED_MODELS: Model[] = [
  { name: "phi3.5", displayName: "Phi 3.5" },
];

/**
 * Mock data for UI development. 3 conversations, 4–6 messages each.
 * Covers normal Q&A, multi-turn, very long content, and short one-word reply.
 */

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    title: "How do I configure nginx as a reverse proxy?",
    model: "phi3.5",
    createdAt: "2026-06-19T10:15:00.000Z",
    updatedAt: "2026-06-19T10:22:00.000Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Quick sanity check on my React useEffect",
    model: "llama3.2:3b",
    createdAt: "2026-06-20T14:02:00.000Z",
    updatedAt: "2026-06-20T14:08:00.000Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    title: "Brainstorm dinner ideas for tonight",
    model: "phi3.5",
    createdAt: "2026-06-21T08:30:00.000Z",
    updatedAt: "2026-06-21T08:34:00.000Z",
  },
];

export const MOCK_MESSAGES: Message[] = [
  // Conversation 1 — long-form technical answer (5 messages)
  {
    id: "m1-1",
    conversationId: "11111111-1111-1111-1111-111111111111",
    role: "user",
    content: "How do I configure nginx as a reverse proxy for a FastAPI backend running on port 8000?",
    createdAt: "2026-06-19T10:15:00.000Z",
  },
  {
    id: "m1-2",
    conversationId: "11111111-1111-1111-1111-111111111111",
    role: "assistant",
    content:
      "You can configure nginx as a reverse proxy by adding a `location` block to your server config. Here is a minimal example:\n\nserver {\n  listen 80;\n  server_name luttapi.local;\n\n  location /api/ {\n    proxy_pass http://127.0.0.1:8000/;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n    proxy_set_header X-Forwarded-Proto $scheme;\n  }\n\n  location / {\n    root /var/www/luttapi;\n    try_files $uri $uri/ /index.html;\n  }\n}\n\nFor Server-Sent Events you also need `proxy_buffering off;` and a generous `proxy_read_timeout` (e.g. 1h) inside the /api/ block — otherwise nginx will buffer the stream and the client will see chunks arriving in batches instead of token-by-token. Don't forget to `nginx -t` to validate before `nginx -s reload`.",
    createdAt: "2026-06-19T10:16:00.000Z",
  },
  {
    id: "m1-3",
    conversationId: "11111111-1111-1111-1111-111111111111",
    role: "user",
    content: "Does the proxy_buffering off setting hurt performance for non-SSE endpoints?",
    createdAt: "2026-06-19T10:20:00.000Z",
  },
  {
    id: "m1-4",
    conversationId: "11111111-1111-1111-1111-111111111111",
    role: "assistant",
    content:
      "Slightly, yes — for normal request/response traffic, buffering lets nginx hold the upstream's reply in memory and free up the upstream worker faster. For an SSE-only sub-path (`/api/v1/chat`) you can scope `proxy_buffering off;` to just that location and keep the global setting on. That gives you streaming where you need it and buffering where you benefit from it.",
    createdAt: "2026-06-19T10:21:00.000Z",
  },
  {
    id: "m1-5",
    conversationId: "11111111-1111-1111-1111-111111111111",
    role: "user",
    content: "Got it, thanks!",
    createdAt: "2026-06-19T10:22:00.000Z",
  },

  // Conversation 2 — short multi-turn (4 messages)
  {
    id: "m2-1",
    conversationId: "22222222-2222-2222-2222-222222222222",
    role: "user",
    content:
      "Should I put my fetch call inside useEffect or in an event handler?",
    createdAt: "2026-06-20T14:02:00.000Z",
  },
  {
    id: "m2-2",
    conversationId: "22222222-2222-2222-2222-222222222222",
    role: "assistant",
    content:
      "If the fetch happens because of a user action, prefer an event handler — it keeps the side effect close to the cause and avoids stale-closure traps. Use useEffect only for fetches that should run on mount or when a specific dependency changes (e.g. route param). Either way, abort with an AbortController on unmount.",
    createdAt: "2026-06-20T14:03:00.000Z",
  },
  {
    id: "m2-3",
    conversationId: "22222222-2222-2222-2222-222222222222",
    role: "user",
    content: "Cool.",
    createdAt: "2026-06-20T14:07:00.000Z",
  },
  {
    id: "m2-4",
    conversationId: "22222222-2222-2222-2222-222222222222",
    role: "assistant",
    content: "Anytime.",
    createdAt: "2026-06-20T14:08:00.000Z",
  },

  // Conversation 3 — casual brainstorm (6 messages, includes one-word reply)
  {
    id: "m3-1",
    conversationId: "33333333-3333-3333-3333-333333333333",
    role: "user",
    content: "I have chicken thighs, rice, and broccoli. What should I make?",
    createdAt: "2026-06-21T08:30:00.000Z",
  },
  {
    id: "m3-2",
    conversationId: "33333333-3333-3333-3333-333333333333",
    role: "assistant",
    content:
      "A teriyaki chicken rice bowl is fast and forgiving: sear the thighs skin-side down, glaze with a soy/mirin/honey reduction, steam the broccoli, and serve over rice with a sprinkle of sesame.",
    createdAt: "2026-06-21T08:31:00.000Z",
  },
  {
    id: "m3-3",
    conversationId: "33333333-3333-3333-3333-333333333333",
    role: "user",
    content: "No mirin. Substitute?",
    createdAt: "2026-06-21T08:32:00.000Z",
  },
  {
    id: "m3-4",
    conversationId: "33333333-3333-3333-3333-333333333333",
    role: "assistant",
    content:
      "Use one tablespoon of rice vinegar plus one teaspoon of sugar — it gets you close to mirin's sweet-acidic profile. Dry white wine plus a pinch of sugar works too.",
    createdAt: "2026-06-21T08:33:00.000Z",
  },
  {
    id: "m3-5",
    conversationId: "33333333-3333-3333-3333-333333333333",
    role: "user",
    content: "Perfect",
    createdAt: "2026-06-21T08:34:00.000Z",
  },
  {
    id: "m3-6",
    conversationId: "33333333-3333-3333-3333-333333333333",
    role: "assistant",
    content: "Enjoy!",
    createdAt: "2026-06-21T08:34:30.000Z",
  },
];

/**
 * Helper: get messages for a given conversation, sorted by createdAt ascending.
 */
export function getMessagesForConversation(conversationId: string): Message[] {
  return MOCK_MESSAGES.filter((m) => m.conversationId === conversationId).sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt),
  );
}

/**
 * Helper: look up a conversation by id.
 */
export function getConversationById(id: string): Conversation | undefined {
  return MOCK_CONVERSATIONS.find((c) => c.id === id);
}
