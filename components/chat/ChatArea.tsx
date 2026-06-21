"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";
import { LoadingDots } from "./LoadingDots";

export interface ChatAreaProps {
  messages: Message[];
  isStreaming?: boolean;
  className?: string;
}

/**
 * Scrollable, flex-column list of MessageBubbles.
 * Scrolls to bottom on mount and whenever a new message arrives.
 */
export function ChatArea({
  messages,
  isStreaming = false,
  className,
}: ChatAreaProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isStreaming]);

  return (
    <div
      data-testid="chat-area"
      className={cn(
        "flex-1 overflow-y-auto",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isStreaming && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={endRef} aria-hidden="true" />
      </div>
    </div>
  );
}
