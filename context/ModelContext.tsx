"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Model } from "@/lib/types";
import { useModels } from "@/hooks/useModels";

export interface ModelContextValue {
  models: Model[];
  isLoading: boolean;
  selectedModel: string;
  setSelectedModel: (name: string) => void;
}

const ModelContext = createContext<ModelContextValue | null>(null);

export interface ModelProviderProps {
  children: ReactNode;
}

/**
 * Provides the active model picker state to the component tree.
 *
 * - `models` and `isLoading` come from `useModels()` (mock async hook).
 * - `selectedModel` defaults to the first model once the list resolves;
 *   it stays as an empty string while loading.
 * - Manual selection via `setSelectedModel` is never overwritten by
 *   the auto-default once a choice has been made.
 */
export function ModelProvider({ children }: ModelProviderProps) {
  const { models, isLoading } = useModels();
  const [selectedModel, setSelectedModel] = useState<string>("");

  useEffect(() => {
    if (selectedModel === "" && models.length > 0) {
      setSelectedModel(models[0].name);
    }
  }, [models, selectedModel]);

  const value = useMemo<ModelContextValue>(
    () => ({ models, isLoading, selectedModel, setSelectedModel }),
    [models, isLoading, selectedModel],
  );

  return (
    <ModelContext.Provider value={value}>{children}</ModelContext.Provider>
  );
}

/**
 * Reads the active model context. Throws if used outside of a
 * `<ModelProvider>` — this is intentional: any consumer must be
 * mounted under the provider in `AppShell`.
 */
export function useModelContext(): ModelContextValue {
  const ctx = useContext(ModelContext);
  if (ctx === null) {
    throw new Error("useModelContext must be used within a ModelProvider");
  }
  return ctx;
}
