"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

const baseClasses =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-600 " +
  "transition-colors hover:bg-slate-100 hover:text-slate-900 " +
  "dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, label, className, type = "button", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn(baseClasses, className)}
        {...rest}
      >
        {icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
