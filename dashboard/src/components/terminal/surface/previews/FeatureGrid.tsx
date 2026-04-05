"use client";

import { COMMAND_REGISTRY } from "@/lib/terminal/commands";
import styles from "./previews.module.css";

const HOTKEYS: Record<string, string> = {
  status: "S",
  rate: "R",
  client: "C",
  pipeline: "P",
  wire: "W",
  clear: "X",
  theme: "T",
};

const COMMAND_ICONS: Record<string, string> = {
  status: "\u25C6",
  rate: "\u25CE",
  client: "\u25C7",
  pipeline: "\u2192",
  wire: "\u26A1",
  clear: "\u2715",
  theme: "\u25D0",
};

const SECTIONS = [
  { id: "business", label: "Business", commands: ["status", "rate", "client", "pipeline"] },
  { id: "intelligence", label: "Intelligence", commands: ["wire"] },
  { id: "system", label: "System", commands: ["clear", "theme"] },
];

const SURFACES = [
  { name: "Editor", icon: "\u270E", desc: "Block editor \u00B7 55+ blocks" },
  { name: "Forge Paper", icon: "\u25C6", desc: "Proposals & documents" },
  { name: "Workspace", icon: "\u229E", desc: "Split-pane cockpit" },
  { name: "Bridge", icon: "\u25CE", desc: "Business dashboard" },
];

interface FeatureGridProps {
  onSelectCommand: (cmd: string) => void;
}

export default function FeatureGrid({ onSelectCommand }: FeatureGridProps) {
  const totalCommands = Object.keys(COMMAND_REGISTRY).length;

  return (
    <div className={styles.list}>
      {/* Header */}
      <div className={styles.listHeader}>
        <span className={styles.listHeaderTitle}>Commands</span>
        <span className={styles.listHeaderCount}>
          {totalCommands} commands &middot; {SURFACES.length} surfaces
        </span>
      </div>

      {/* Command sections */}
      {SECTIONS.map((sec) => (
        <div key={sec.id} className={styles.listSection}>
          <div className={styles.listSectionHeader}>
            <span className={styles.listSectionLabel}>{sec.label}</span>
            <span className={styles.listSectionCount}>{sec.commands.length}</span>
          </div>
          {sec.commands.map((cmdName) => {
            const entry = COMMAND_REGISTRY[cmdName];
            if (!entry) return null;
            return (
              <button
                key={cmdName}
                type="button"
                className={styles.cmdRow}
                onClick={() => onSelectCommand("/" + cmdName + " ")}
              >
                <span className={styles.cmdIcon}>{COMMAND_ICONS[cmdName] || entry.icon}</span>
                <div className={styles.cmdInfo}>
                  <div className={styles.cmdName}>/{cmdName}</div>
                  <div className={styles.cmdDesc}>{entry.description}</div>
                </div>
                {HOTKEYS[cmdName] && <span className={styles.cmdKey}>{HOTKEYS[cmdName]}</span>}
              </button>
            );
          })}
        </div>
      ))}

      {/* Surfaces section */}
      <div className={styles.listSection}>
        <div className={styles.listSectionHeader}>
          <span className={styles.listSectionLabel}>Surfaces</span>
        </div>
        {SURFACES.map((s) => (
          <div key={s.name} className={styles.navRow}>
            <span className={styles.navIcon}>{s.icon}</span>
            <span className={styles.navName}>{s.name}</span>
            <span className={styles.navArrow}>&rarr;</span>
          </div>
        ))}
      </div>
    </div>
  );
}
