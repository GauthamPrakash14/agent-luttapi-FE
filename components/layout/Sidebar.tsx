"use client";

import { Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import type { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { SidebarItem } from "./SidebarItem";

export interface SidebarProps {
  conversations: Conversation[];
  activeId?: string;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  footer?: ReactNode;
}

export function Sidebar({
  conversations,
  activeId,
  isOpen,
  onClose,
  onNewChat,
  onSelect,
  onDelete,
  footer,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        data-testid="sidebar-backdrop"
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-black/40 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        data-testid="sidebar"
        aria-label="Conversations sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r border-slate-200 bg-white",
          "transition-transform duration-200 dark:border-white/5 dark:bg-[#171717]",
          // Mobile: slide in/out
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible, normal flow
          "md:static md:translate-x-0 md:w-64 md:shrink-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-3 dark:border-white/5">
          <Button
            variant="primary"
            size="sm"
            onClick={onNewChat}
            className="flex-1 justify-start"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
          <IconButton
            icon={<X className="h-5 w-5" />}
            label="Close sidebar"
            onClick={onClose}
            className="md:hidden"
          />
        </div>

        {/* Conversation list */}
        <nav
          aria-label="Conversation list"
          className="flex-1 space-y-1 overflow-y-auto p-2"
        >
          {conversations.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              No conversations yet.
            </p>
          ) : (
            conversations.map((c) => (
              <SidebarItem
                key={c.id}
                conversation={c}
                isActive={c.id === activeId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))
          )}
        </nav>

        {/* Footer slot (model selector goes here) */}
        {footer ? (
          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            {footer}
          </div>
        ) : null}
      </aside>
    </>
  );
}
