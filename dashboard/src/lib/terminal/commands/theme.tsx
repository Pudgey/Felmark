import React from "react";
import type { CommandRegistryEntry } from "../types";
import { THEMES, applyTheme, saveTheme, getActiveTheme } from "@/lib/themes";
import type { FelmarkTheme } from "@/lib/themes";

function ThemeCard({
  theme,
  isCurrent,
  onSelect,
}: {
  theme: FelmarkTheme;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const swatches = [
    theme.parchment,
    theme.warm200,
    theme.ink900,
    theme.railBg,
    theme.accent,
    theme.accentLight,
  ];

  return (
    <button
      onClick={onSelect}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        background: theme.warm50,
        border: isCurrent ? `2px solid ${theme.accent}` : `1px solid ${theme.warm200}`,
        borderRadius: 6,
        padding: "10px 12px",
        marginBottom: 6,
        cursor: "pointer",
        fontFamily: "var(--mono), 'JetBrains Mono', monospace",
        fontSize: 12,
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <span style={{ color: theme.accent, fontSize: 14 }}>&#9670;</span>
        <span style={{ color: theme.ink900, fontWeight: 600, fontSize: 12 }}>
          {theme.name}
        </span>
        {isCurrent && (
          <span
            style={{
              fontSize: 10,
              color: theme.accent,
              background: theme.accentBg,
              padding: "1px 6px",
              borderRadius: 99,
              marginLeft: 4,
            }}
          >
            current
          </span>
        )}
      </div>

      {/* Description */}
      <div style={{ color: theme.ink600, fontSize: 11, marginBottom: 6 }}>
        {theme.desc}
      </div>

      {/* Color strip + accent dot */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", gap: 3 }}>
          {swatches.map((color, i) => (
            <span
              key={i}
              style={{
                width: 18,
                height: 12,
                borderRadius: 2,
                background: color,
                display: "inline-block",
                border: `1px solid ${theme.warm300}`,
              }}
            />
          ))}
        </div>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: theme.accent,
            display: "inline-block",
          }}
        />
        <span style={{ color: theme.ink400, fontSize: 10 }}>{theme.id}</span>
      </div>
    </button>
  );
}

function ThemeConfirmation({ theme }: { theme: FelmarkTheme }) {
  return (
    <div
      style={{
        fontFamily: "var(--mono), 'JetBrains Mono', monospace",
        fontSize: 12,
        padding: "8px 0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: theme.accent,
            display: "inline-block",
          }}
        />
        <span style={{ color: "var(--ink-700)" }}>
          Theme changed to <strong style={{ color: "var(--ink-900)" }}>{theme.name}</strong>
        </span>
      </div>
      <div style={{ color: "var(--ink-400)", fontSize: 11, marginTop: 4, marginLeft: 18 }}>
        {theme.desc}
      </div>
    </div>
  );
}

function ThemeGallery() {
  const currentId = getActiveTheme();
  const themeList = Object.values(THEMES);

  const handleSelect = (theme: FelmarkTheme) => {
    applyTheme(theme);
    saveTheme(theme.id);
  };

  return (
    <div style={{ padding: "6px 0" }}>
      <div
        style={{
          fontFamily: "var(--mono), 'JetBrains Mono', monospace",
          fontSize: 11,
          color: "var(--ink-400)",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        Available themes — click to apply
      </div>
      {themeList.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isCurrent={theme.id === currentId}
          onSelect={() => handleSelect(theme)}
        />
      ))}
    </div>
  );
}

export const themeCommand: CommandRegistryEntry = {
  description: "Change the app color scheme",
  icon: "◐",
  category: "Settings",
  usage: "/theme [ember|midnight|sage|clay|frost]",
  handler: (parsed) => {
    const themeName = parsed.action || parsed.positional[0];

    // No argument — show gallery
    if (!themeName) {
      return <ThemeGallery />;
    }

    // Specific theme requested
    const key = themeName.toLowerCase();
    const theme = THEMES[key];

    if (!theme) {
      const available = Object.keys(THEMES).join(", ");
      return (
        <div
          style={{
            fontFamily: "var(--mono), 'JetBrains Mono', monospace",
            fontSize: 12,
            color: "#dc2626",
            padding: "8px 0",
          }}
        >
          Unknown theme: <strong>{themeName}</strong>
          <div style={{ color: "#9b988f", marginTop: 4, fontSize: 11 }}>
            Available: {available}
          </div>
        </div>
      );
    }

    applyTheme(theme);
    saveTheme(theme.id);

    return <ThemeConfirmation theme={theme} />;
  },
};
