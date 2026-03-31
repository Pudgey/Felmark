"use client";

import { useEffect } from "react";
import { THEMES, applyTheme, getActiveTheme } from "@/lib/themes";

/**
 * Client component that restores the saved theme on mount.
 * Renders nothing — side-effect only.
 */
export default function ThemeLoader() {
  useEffect(() => {
    const themeId = getActiveTheme();
    const theme = THEMES[themeId];
    if (theme) {
      applyTheme(theme);
    }
  }, []);

  return null;
}
