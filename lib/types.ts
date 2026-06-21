/**
 * Type definitions mirroring the backend DB schema exactly.
 * Source of truth: agent-luttapi/plan.md (Database Design section).
 *
 * - `id` fields are UUID strings from the backend.
 * - Date fields are ISO 8601 strings (the API serializes TIMESTAMPTZ as ISO).
 * - `model` lives on `Conversation`, not `Message`.
 * - `role` is a string ("user" | "assistant") — backend stores as TEXT, not ENUM.
 */

export interface Conversation {
  id: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Model {
  name: string;
  displayName: string;
}

export const AVAILABLE_MODELS: Model[] = [
  { name: "phi3.5", displayName: "Phi 3.5" },
  { name: "llama3.2:3b", displayName: "Llama 3.2 3B" },
];
