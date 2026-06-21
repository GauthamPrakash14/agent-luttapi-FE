"use client";

import { useEffect, useState } from "react";
import type { Model } from "@/lib/types";
import { apiFetch, toDisplayName } from "@/lib/api";

export interface UseModelsReturn {
  models: Model[];
  isLoading: boolean;
  error: string | null;
}

interface RawModel {
  name: string;
  is_loaded: boolean;
}

/**
 * Fetches the available models from `GET /api/v1/models` and returns
 * only those currently loaded into Ollama. Each model name is mapped
 * to a human-readable `displayName`.
 */
export function useModels(): UseModelsReturn {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<RawModel[]>("/api/v1/models")
      .then((data) => {
        if (cancelled) return;
        setModels(
          data
            .filter((m) => m.is_loaded)
            .map((m) => ({
              name: m.name,
              displayName: toDisplayName(m.name),
            })),
        );
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

  return { models, isLoading, error };
}
