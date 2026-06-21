"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useModelContext } from "@/context/ModelContext";
import { cn } from "@/lib/utils";

export interface ModelPickerProps {
  className?: string;
}

export function ModelPicker({ className }: ModelPickerProps) {
  const { models, selectedModel, setSelectedModel, isLoading } =
    useModelContext();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const currentModel = models.find((m) => m.name === selectedModel);
  const label = isLoading
    ? "Loading…"
    : models.length === 0
      ? "No models loaded"
      : (currentModel?.displayName ?? selectedModel ?? "Select model");

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Select model"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={isLoading || models.length === 0}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1 text-base font-semibold leading-tight",
          "text-slate-900 dark:text-white",
          "transition-opacity hover:opacity-70",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Available models"
          className={cn(
            "absolute left-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-xl",
            "border border-slate-200 bg-white shadow-xl",
            "dark:border-white/10 dark:bg-[#1e1e1e]",
          )}
        >
          {models.map((m) => (
            <button
              key={m.name}
              type="button"
              role="option"
              aria-selected={m.name === selectedModel}
              onClick={() => {
                setSelectedModel(m.name);
                setOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2.5 text-left text-sm transition-colors",
                "hover:bg-slate-50 dark:hover:bg-white/5",
                m.name === selectedModel
                  ? "font-semibold text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-400",
              )}
            >
              {m.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
