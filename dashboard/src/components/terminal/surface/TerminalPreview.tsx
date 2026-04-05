"use client";

import { useMemo } from "react";
import { COMMAND_REGISTRY } from "@/lib/terminal/commands";
import FeatureGrid from "./previews/FeatureGrid";
import CommandPreview from "./previews/CommandPreview";

interface TerminalPreviewProps {
  currentInput: string;
  onTypeCommand: (cmd: string) => void;
}

export default function TerminalPreview({ currentInput, onTypeCommand }: TerminalPreviewProps) {
  const commandName = useMemo(() => {
    const trimmed = currentInput.trim();
    if (!trimmed.startsWith("/")) return "";
    const firstWord = trimmed.slice(1).split(/\s/)[0].toLowerCase();
    return firstWord;
  }, [currentInput]);

  if (!commandName) {
    return <FeatureGrid onSelectCommand={onTypeCommand} />;
  }

  if (commandName in COMMAND_REGISTRY) {
    return <CommandPreview command={commandName} />;
  }

  return (
    <div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-400)", marginBottom: 12 }}>
        Unknown command: /{commandName}
      </div>
      <FeatureGrid onSelectCommand={onTypeCommand} />
    </div>
  );
}
