"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import { useConversations } from "@/hooks/useConversations";
import { ModelProvider } from "@/context/ModelContext";
import { ModelPicker } from "@/components/ui/ModelPicker";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export interface AppShellProps {
  activeConversationId?: string;
  headerTitle?: string;
  children: ReactNode;
}

export function AppShell({
  activeConversationId,
  headerTitle,
  children,
}: AppShellProps) {
  const router = useRouter();
  const sidebar = useSidebar(false);
  const { conversations, deleteConversation } = useConversations();

  const handleNewChat = () => {
    sidebar.close();
    router.push("/chat");
  };

  const handleSelect = (id: string) => {
    sidebar.close();
    router.push(`/chat/${id}`);
  };

  const handleDelete = (id: string) => {
    void deleteConversation(id);
  };

  return (
    <ModelProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900 dark:bg-[#0d0d0d] dark:text-slate-100">
        <Sidebar
          conversations={conversations}
          activeId={activeConversationId}
          isOpen={sidebar.isOpen}
          onClose={sidebar.close}
          onNewChat={handleNewChat}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile header — hamburger + theme toggle */}
          <Header
            onMenuToggle={sidebar.toggle}
            title={headerTitle}
            rightSlot={<ThemeToggle />}
          />

          {/* Model picker row — visible on all screen sizes */}
          <div className="flex items-center border-b border-slate-100 px-4 py-3 dark:border-white/5">
            <ModelPicker />
          </div>

          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </div>
      </div>
    </ModelProvider>
  );
}
