"use client";

import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  modelDisplayName?: string;
  heading?: string;
  className?: string;
}

export function EmptyState({
  modelDisplayName,
  heading = "How can I help you today?",
  className,
}: EmptyStateProps) {
  return (
    <div
      data-testid="empty-state"
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-5 px-4 text-center",
        className,
      )}
    >
      {modelDisplayName && (
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <Bot className="h-8 w-8 text-slate-500 dark:text-slate-300" />
          </div>
          <span className="text-2xl font-semibold text-slate-900 dark:text-white">
            {modelDisplayName}
          </span>
        </div>
      )}
      <h2 className="text-lg font-normal text-slate-500 dark:text-slate-400">
        {heading}
      </h2>
    </div>
  );
}
