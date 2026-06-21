"use client";

import { cn } from "@/lib/utils";

export interface LoadingDotsProps {
  className?: string;
}

/**
 * Three staggered bouncing dots — typing/loading indicator.
 * Designed to live inside an assistant MessageBubble or below one.
 */
export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div
      data-testid="loading-dots"
      role="status"
      aria-label="Assistant is typing"
      className={cn("flex items-center gap-1.5", className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          data-testid="loading-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
          className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500"
        />
      ))}
    </div>
  );
}
