import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines `clsx` and `tailwind-merge` so conditional Tailwind classes
 * de-duplicate correctly (e.g. `cn("p-2", condition && "p-4")` → "p-4").
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Short relative-time formatter for sidebar timestamps.
 * Examples: "just now", "5m ago", "2h ago", "3d ago", "Jun 19".
 */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 30) return "just now";
  if (diffMin < 1) return `${diffSec}s ago`;
  if (diffHr < 1) return `${diffMin}m ago`;
  if (diffDay < 1) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return then.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
