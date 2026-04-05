"use client";

import { useMemo } from "react";
import { COMMAND_REGISTRY } from "@/lib/terminal/commands";
import styles from "./previews.module.css";

const PLATFORM_FEATURES = [
  { name: "Editor", desc: "Block editor with 55+ block types", icon: "\u270E", category: "Workstation" },
  { name: "Workspace", desc: "Client panes \u2014 money, work, signals", icon: "\u25CE", category: "Workspace" },
  { name: "Calendar", desc: "Project timeline & deadlines", icon: "\u25A6", category: "Dashboard" },
  { name: "Forge Paper", desc: "Client proposals & documents", icon: "\u25C6", category: "Workstation" },
  { name: "Search", desc: "Cross-workspace content search", icon: "\u2315", category: "Dashboard" },
  { name: "Templates", desc: "Starter templates for documents", icon: "\u25A4", category: "Dashboard" },
];

interface FeatureGridProps {
  onSelectCommand: (cmd: string) => void;
}

export default function FeatureGrid({ onSelectCommand }: FeatureGridProps) {
  const commandEntries = useMemo(() => {
    return Object.entries(COMMAND_REGISTRY).map(([name, entry]) => ({
      name,
      desc: entry.description,
      icon: entry.icon,
      category: entry.category,
    }));
  }, []);

  const allItems = useMemo(() => {
    return [...commandEntries, ...PLATFORM_FEATURES];
  }, [commandEntries]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof allItems>();
    for (const item of allItems) {
      const cat = item.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    }
    return map;
  }, [allItems]);

  return (
    <div>
      <div className={styles.gridTitle}>Felmark Features</div>
      {Array.from(grouped.entries()).map(([category, items]) => (
        <div key={category}>
          <div className={styles.category}>{category}</div>
          <div className={styles.grid}>
            {items.map((item) => {
              const isCommand = item.name in COMMAND_REGISTRY;
              return (
                <button
                  key={item.name}
                  className={`${styles.card} ${isCommand ? styles.cardClickable : ""}`}
                  onClick={isCommand ? () => onSelectCommand("/" + item.name + " ") : undefined}
                  type="button"
                >
                  <div className={styles.cardIcon}>{item.icon}</div>
                  <div className={styles.cardName}>{isCommand ? `/${item.name}` : item.name}</div>
                  <div className={styles.cardDesc}>{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
