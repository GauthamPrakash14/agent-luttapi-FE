"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LoadingDots } from "./LoadingDots";

export interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  isThinking?: boolean;
}

export function MessageBubble({ message, isStreaming = false, isThinking = false }: MessageBubbleProps) {
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
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words md:max-w-[75%]",
          isUser
            ? "bg-slate-200 text-slate-900 dark:bg-[#2d2d2d] dark:text-slate-100"
            : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        )}
      >
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {isUser ? "You" : "Assistant"}
        </div>

        {isStreaming ? (
          isThinking ? (
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
              <span className="text-xs italic">Thinking</span>
              <LoadingDots />
            </div>
          ) : (
            <LoadingDots />
          )
        ) : isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div
            className={cn(
              "prose prose-sm max-w-none dark:prose-invert",
              "prose-p:my-1 prose-p:leading-relaxed",
              "prose-headings:mb-2 prose-headings:mt-3 prose-headings:font-semibold",
              "prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5",
              "prose-code:rounded prose-code:bg-black/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono dark:prose-code:bg-white/10",
              "prose-pre:rounded-xl prose-pre:bg-black/20 prose-pre:p-3 dark:prose-pre:bg-black/40",
              "prose-blockquote:border-slate-300 dark:prose-blockquote:border-slate-600",
              "prose-strong:font-semibold",
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
