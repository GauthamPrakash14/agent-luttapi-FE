"use client";

import { ArrowUp } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

export interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const MAX_ROWS = 6;
const LINE_HEIGHT_PX = 24;

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Send a message…",
  className,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const maxHeight = LINE_HEIGHT_PX * MAX_ROWS + 16;
    // useLayoutEffect means this runs before paint, so the intermediate
    // "auto" state is never visible — no text-disappearing flicker.
    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    el.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, []);

  useLayoutEffect(() => {
    resize();
  }, [value, resize]);

  // Restore focus when the textarea transitions from disabled → enabled
  // (e.g. after streaming finishes, or on initial mount when enabled).
  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !disabled;

  const send = () => {
    if (!canSend) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      data-testid="message-input"
      className={cn(
        "flex w-full flex-col rounded-2xl border border-slate-200 bg-white",
        "focus-within:ring-1 focus-within:ring-slate-300",
        "dark:border-white/10 dark:bg-[#1e1e1e]",
        "dark:focus-within:ring-white/20",
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Message"
        className={cn(
          "w-full resize-none bg-transparent px-4 pt-3 pb-1 text-sm leading-6 outline-none",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      />
      <div className="flex items-center justify-end px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
            "bg-slate-900 text-white hover:bg-slate-700",
            "disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400",
            "dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
            "dark:disabled:bg-slate-700 dark:disabled:text-slate-500",
          )}
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
