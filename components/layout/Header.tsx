"use client";

import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/IconButton";

export interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  rightSlot?: ReactNode;
  className?: string;
}

/**
 * Mobile-only top bar. Renders the hamburger, the app title, and an optional
 * right slot (typically the ThemeToggle on mobile). Hidden on md+ via `md:hidden`.
 */
export function Header({
  onMenuToggle,
  title = "Luttapi",
  rightSlot,
  className,
}: HeaderProps) {
  return (
    <header
      data-testid="header"
      className={cn(
        "flex h-14 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 md:hidden",
        "dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      <IconButton
        icon={<Menu className="h-5 w-5" />}
        label="Open sidebar"
        onClick={onMenuToggle}
      />
      <h1 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <div className="flex h-9 w-9 items-center justify-center">{rightSlot}</div>
    </header>
  );
}
