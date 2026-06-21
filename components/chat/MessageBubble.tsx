"use client";

import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LoadingDots } from "./LoadingDots";

export interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

/**
 * User messages: right-aligned, accent background.
 * Assistant messages: left-aligned, muted background.
 * Newlines in `content` are preserved via `whitespace-pre-wrap`.
 *
 * When `isStreaming` is true, the content area renders a `<LoadingDots />`
 * indicator instead of the text — used while waiting for the first token
 * of an assistant response.
 */
export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      data-testid="message-bubble"
      data-role={message.role}
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words md:max-w-[75%]",
          isUser
            ? "bg-slate-200 text-slate-900 dark:bg-[#2d2d2d] dark:text-slate-100"
            : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        )}
      >
        <div
          className={cn(
            "mb-1 text-[10px] font-semibold uppercase tracking-wide",
            "text-slate-500 dark:text-slate-400",
          )}
        >
          {isUser ? "You" : "Assistant"}
        </div>
        <div>{isStreaming ? <LoadingDots /> : message.content}</div>
      </div>
    </div>
  );
}
