"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/chat/EmptyState";
import { MessageInput } from "@/components/chat/MessageInput";
import { useModelContext } from "@/context/ModelContext";
import { useConversations } from "@/hooks/useConversations";

function ChatContent() {
  const router = useRouter();
  const { selectedModel, models } = useModelContext();
  const { createConversation } = useConversations();
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const currentModel = models.find((m) => m.name === selectedModel);
  const modelDisplayName = currentModel?.displayName ?? selectedModel ?? undefined;

  const handleSend = async (content: string) => {
    setError(null);
    setIsSending(true);
    try {
      const convo = await createConversation(content.slice(0, 60), selectedModel);
      router.push(`/chat/${convo.id}?q=${encodeURIComponent(content)}`);
    } catch (e) {
      setError(String(e));
      setIsSending(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <EmptyState modelDisplayName={modelDisplayName} />
      {error && (
        <div className="px-4 py-2 text-sm text-red-500">{error}</div>
      )}
      <div className="border-t border-slate-100 bg-white px-4 py-3 dark:border-white/5 dark:bg-[#0d0d0d]">
        <div className="mx-auto w-full max-w-3xl">
          <MessageInput
            onSend={handleSend}
            disabled={!selectedModel || isSending}
            placeholder={selectedModel ? "Send a message…" : "Load a model first…"}
          />
        </div>
      </div>
    </div>
  );
}

export default function NewChatPage() {
  return (
    <AppShell>
      <ChatContent />
    </AppShell>
  );
}
