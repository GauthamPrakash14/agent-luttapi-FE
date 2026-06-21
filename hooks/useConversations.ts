"use client";

import { useCallback, useEffect, useState } from "react";
import type { Conversation } from "@/lib/types";
import { apiFetch, API_BASE } from "@/lib/api";

interface RawConversation {
  id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
}

function mapConversation(c: RawConversation): Conversation {
  return {
    id: c.id,
    title: c.title,
    model: c.model,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  };
}

export interface UseConversationsReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  createConversation: (title: string, model: string) => Promise<Conversation>;
  deleteConversation: (id: string) => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<RawConversation[]>("/api/v1/conversations")
      .then((data) => {
        if (!cancelled) setConversations(data.map(mapConversation));
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const createConversation = useCallback(
    async (title: string, model: string): Promise<Conversation> => {
      const raw = await apiFetch<RawConversation>("/api/v1/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, model }),
      });
      const c = mapConversation(raw);
      setConversations((prev) => [c, ...prev]);
      return c;
    },
    [],
  );

  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    await fetch(`${API_BASE}/api/v1/conversations/${id}`, { method: "DELETE" });
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    conversations,
    isLoading,
    error,
    createConversation,
    deleteConversation,
  };
}
