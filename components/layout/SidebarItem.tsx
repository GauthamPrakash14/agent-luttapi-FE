"use client";

import { Trash2 } from "lucide-react";
import type { KeyboardEvent, MouseEvent } from "react";
import type { Conversation } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";

export interface SidebarItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * NOTE: The row is a `<div role="button">` (not a `<button>`) so the inner
 * delete control can also be a `<button>` without nesting interactive elements.
 * Keyboard accessibility is preserved via `tabIndex` and an Enter/Space handler.
 */
export function SidebarItem({
  conversation,
  isActive = false,
  onSelect,
  onDelete,
}: SidebarItemProps) {
  const handleSelect = () => onSelect(conversation.id);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
    }
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(conversation.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      data-active={isActive ? "true" : "false"}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors",
        "hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        "dark:hover:bg-slate-800",
        isActive
          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
          : "text-slate-700 dark:text-slate-300",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{conversation.title}</div>
        <div className="truncate text-xs text-slate-500 dark:text-slate-400">
          {formatRelativeTime(conversation.updatedAt)}
        </div>
      </div>
      <button
        type="button"
        aria-label={`Delete conversation: ${conversation.title}`}
        onClick={handleDelete}
        className={cn(
          "ml-2 flex h-7 w-7 items-center justify-center rounded text-slate-400 opacity-0",
          "transition-opacity hover:bg-slate-200 hover:text-red-600 group-hover:opacity-100",
          "dark:hover:bg-slate-700 dark:hover:text-red-400 focus-visible:opacity-100",
        )}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
