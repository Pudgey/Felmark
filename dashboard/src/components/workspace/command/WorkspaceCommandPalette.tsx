"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import { SURFACES } from "@/components/workspace/core/surfaces/registry";
import styles from "./WorkspaceCommandPalette.module.css";

interface CommandItem {
  label: string;
  hint: string;
  icon: string;
  action: () => void;
}

interface CommandGroup {
  title: string;
  items: CommandItem[];
}

interface WorkspaceCommandPaletteProps {
  onClose: () => void;
}

export default function WorkspaceCommandPalette({ onClose }: WorkspaceCommandPaletteProps) {
  const nav = useWorkspaceNav();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const groups: CommandGroup[] = [
    {
      title: "Navigate",
      items: SURFACES.map((s) => ({
        label: s.label,
        hint: "surface",
        icon: s.icon,
        action: () => {
          console.log("Navigate to surface:", s.id);
          onClose();
        },
      })),
    },
    {
      title: "Open Tool",
      items: [
        {
          label: "Pipeline",
          hint: "tool",
          icon: "\u2192",
          action: () => {
            nav.openTool("pipeline");
            onClose();
          },
        },
        {
          label: "Finance",
          hint: "tool",
          icon: "$",
          action: () => {
            nav.openTool("finance");
            onClose();
          },
        },
        {
          label: "Products",
          hint: "tool",
          icon: "\u25c7",
          action: () => {
            nav.openTool("services");
            onClose();
          },
        },
        {
          label: "Wire",
          hint: "tool",
          icon: "\u223c",
          action: () => {
            nav.openTool("wire");
            onClose();
          },
        },
      ],
    },
    {
      title: "Clients",
      items: [
        {
          label: "Meridian Studio",
          hint: "client",
          icon: "\u25ce",
          action: () => {
            nav.openHub({ clientId: "c1", clientName: "Meridian Studio", clientAvatar: "MS", clientColor: "#7c8594" });
            onClose();
          },
        },
        {
          label: "Nora Kim",
          hint: "client",
          icon: "\u25ce",
          action: () => {
            nav.openHub({ clientId: "c2", clientName: "Nora Kim", clientAvatar: "NK", clientColor: "#7c8594" });
            onClose();
          },
        },
        {
          label: "Bolt Fitness",
          hint: "client",
          icon: "\u25ce",
          action: () => {
            nav.openHub({ clientId: "c3", clientName: "Bolt Fitness", clientAvatar: "BF", clientColor: "#8a7e63" });
            onClose();
          },
        },
        {
          label: "Luna Boutique",
          hint: "client",
          icon: "\u25ce",
          action: () => {
            nav.openHub({ clientId: "c4", clientName: "Luna Boutique", clientAvatar: "LB", clientColor: "#7c8594" });
            onClose();
          },
        },
      ],
    },
    {
      title: "Actions",
      items: [
        {
          label: "New Tab",
          hint: "action",
          icon: "+",
          action: () => {
            nav.openNewTab();
            onClose();
          },
        },
        {
          label: "Workspace Home",
          hint: "action",
          icon: "\u25c6",
          action: () => {
            nav.goToWorkspace();
            onClose();
          },
        },
      ],
    },
  ];

  // Filter groups by query
  const filteredGroups: CommandGroup[] = query
    ? groups
        .map((g) => ({
          ...g,
          items: g.items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
        }))
        .filter((g) => g.items.length > 0)
    : groups;

  // Flatten items for keyboard navigation
  const flatItems = filteredGroups.flatMap((g) => g.items);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeSelected = useCallback(() => {
    if (flatItems[selectedIndex]) {
      flatItems[selectedIndex].action();
    }
  }, [flatItems, selectedIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(flatItems.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + Math.max(flatItems.length, 1)) % Math.max(flatItems.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeSelected();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flatItems.length, executeSelected, onClose]);

  // Track absolute item index across groups for selected highlight
  let absoluteIndex = 0;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Input row */}
        <div className={styles.inputRow}>
          <span className={styles.searchIcon}>{"\u2315"}</span>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search or run a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        <div className={styles.results}>
          {flatItems.length === 0 ? (
            <div className={styles.empty}>No results</div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.title}>
                <div className={styles.groupHeader}>{group.title}</div>
                {group.items.map((item) => {
                  const isSelected = absoluteIndex === selectedIndex;
                  const currentIndex = absoluteIndex;
                  absoluteIndex++;
                  return (
                    <div
                      key={item.label}
                      className={`${styles.item} ${isSelected ? styles.itemSelected : ""}`}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      onClick={item.action}
                    >
                      <span className={styles.itemIcon}>{item.icon}</span>
                      <span className={styles.itemLabel}>{item.label}</span>
                      <span className={styles.itemHint}>{item.hint}</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span>&#x2191;&#x2193; navigate</span>
          <span>&#x23ce; open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
