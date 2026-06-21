"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";

export interface ChatAreaProps {
  messages: Message[];
  streamingContent?: string | null;
  conversationId?: string;
  isThinking?: boolean;
  className?: string;
}

export function ChatArea({
  messages,
  streamingContent = null,
  conversationId = "",
  isThinking = false,
  className,
}: ChatAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Smooth scroll when a new committed message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // Instant scroll on every streaming token so the view follows the text down
  useEffect(() => {
    if (streamingContent === null) return;
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [streamingContent]);

  return (
    <div
      ref={containerRef}
      data-testid="chat-area"
      className={cn("flex-1 overflow-y-auto", className)}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {streamingContent !== null && (
          <MessageBubble
            message={{
              id: "streaming",
              conversationId,
              role: "assistant",
              content: streamingContent,
              createdAt: new Date().toISOString(),
            }}
            isStreaming={streamingContent === ""}
            isThinking={streamingContent === "" && isThinking}
          />
        )}

        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  );
}
