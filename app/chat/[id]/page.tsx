"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ChatArea } from "@/components/chat/ChatArea";
import { MessageInput } from "@/components/chat/MessageInput";
import { apiFetch, streamChat } from "@/lib/api";
import type { Conversation, Message } from "@/lib/types";

interface RawMessage {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
}

interface RawDetail {
  id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
  messages: RawMessage[];
}

function mapMessage(m: RawMessage): Message {
  return {
    id: m.id,
    conversationId: m.conversation_id,
    role: m.role as "user" | "assistant",
    content: m.content,
    createdAt: m.created_at,
  };
}

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id ?? "";

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSentInitial = useRef(false);

  const handleSend = useCallback(
    async (content: string) => {
      if (!content.trim() || streamingContent !== null) return;
      const userMsg: Message = {
        id: crypto.randomUUID(),
        conversationId: id,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setStreamingContent("");
      setIsThinking(false);
      let full = "";
      try {
        for await (const event of streamChat(id, content)) {
          if (event.type === "thinking") {
            setIsThinking(event.active);
          } else {
            full += event.text;
            setStreamingContent(full);
          }
        }
      } catch (e) {
        setError(String(e));
      } finally {
        setIsThinking(false);
        if (full) {
          const aMsg: Message = {
            id: crypto.randomUUID(),
            conversationId: id,
            role: "assistant",
            content: full,
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, aMsg]);
        }
        setStreamingContent(null);
      }
    },
    [id, streamingContent],
  );

  // Load conversation on mount
  useEffect(() => {
    if (!id) return;
    apiFetch<RawDetail>(`/api/v1/conversations/${id}`)
      .then((data) => {
        setConversation({
          id: data.id,
          title: data.title,
          model: data.model,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
        // Only populate from DB if there are no optimistic messages already in state.
        // On a new chat, the auto-send effect adds the user message optimistically
        // before this fetch resolves — overwriting with an empty DB response would
        // wipe that message from the screen.
        setMessages((prev) =>
          prev.length > 0 ? prev : data.messages.map(mapMessage),
        );
      })
      .catch((e) => setError(String(e)));
  }, [id]);

  // Auto-send initial message from ?q= param
  useEffect(() => {
    const q = searchParams?.get("q");
    if (!q || hasSentInitial.current) return;
    hasSentInitial.current = true;
    // Clear the query param from URL without re-render loop
    router.replace(`/chat/${id}`, { scroll: false });
    handleSend(decodeURIComponent(q));
  }, [searchParams, id, router, handleSend]);

  return (
    <AppShell activeConversationId={id} headerTitle={conversation?.title}>
      <div className="flex min-h-0 flex-1 flex-col">
        {error && (
          <div className="px-4 py-2 text-sm text-red-500">{error}</div>
        )}
        <ChatArea
          messages={messages}
          streamingContent={streamingContent}
          conversationId={id}
          isThinking={isThinking}
        />
        <div className="border-t border-slate-100 bg-white px-4 py-3 dark:border-white/5 dark:bg-[#0d0d0d]">
          <div className="mx-auto w-full max-w-3xl">
            <MessageInput
              onSend={handleSend}
              disabled={streamingContent !== null}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
