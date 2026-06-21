"use client";

import { useCallback, useState } from "react";

export interface UseSidebarReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Controls the open/close state of the mobile sidebar drawer.
 * Desktop sidebar is always visible (CSS handles that); this hook is
 * only used to toggle the mobile overlay.
 */
export function useSidebar(initialOpen = false): UseSidebarReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}
