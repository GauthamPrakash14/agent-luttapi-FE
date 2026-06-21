"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconButton } from "./IconButton";

/**
 * Renders a sun (light) or moon (dark) icon and toggles the theme on click.
 * Uses a `mounted` guard so the SSR'd icon doesn't mismatch the hydrated one
 * (next-themes can't know the theme on the server).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder of identical size before mount to avoid layout shift.
  if (!mounted) {
    return (
      <IconButton
        icon={<span className="h-5 w-5" />}
        label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <IconButton
      icon={
        isDark ? (
          <Sun data-testid="sun-icon" className="h-5 w-5" />
        ) : (
          <Moon data-testid="moon-icon" className="h-5 w-5" />
        )
      }
      label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    />
  );
}
