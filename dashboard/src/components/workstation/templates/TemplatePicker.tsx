"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { DocumentTemplate, Block } from "@/lib/types";
import { uid } from "@/lib/utils";
import styles from "./TemplatePicker.module.css";

interface TemplatePickerProps {
  open: boolean;
  onClose: () => void;
  templates: DocumentTemplate[];
  onSelectBlank: () => void;
  onSelectTemplate: (blocks: Block[]) => void;
}

function templateToBlocks(template: DocumentTemplate): Block[] {
  return template.blocks.map(tb => ({
    id: uid(),
    type: tb.type,
    content: tb.content,
    checked: tb.checked || false,
    graphData: tb.graphData,
    moneyData: tb.moneyData,
    deliverableData: tb.deliverableData,
    tableData: tb.tableData,
    accordionData: tb.accordionData,
    deadlineData: tb.deadlineData,
  }));
}

export default function TemplatePicker({ open, onClose, templates, onSelectBlank, onSelectTemplate }: TemplatePickerProps) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => setSearch(""));
    setTimeout(() => searchRef.current?.focus(), 100);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!search) return templates;
    const q = search.toLowerCase();
    return templates.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.includes(q));
  }, [templates, search]);

  // Group: recent (used) first, then felmark built-in, then user by category
  const recent = filtered.filter(t => t.usageCount > 0).sort((a, b) => b.usageCount - a.usageCount).slice(0, 3);
  const recentIds = new Set(recent.map(t => t.id));
  const builtIn = filtered.filter(t => t.source === "felmark" && !recentIds.has(t.id));
  const userTemplates = filtered.filter(t => t.source === "user" && !recentIds.has(t.id));

  const handlePick = (template: DocumentTemplate) => {
    onSelectTemplate(templateToBlocks(template));
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.head}>
          <div className={styles.headRow}>
            <span className={styles.title}>New document</span>
            <button className={styles.closeBtn} onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div className={styles.searchRow}>
            <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            <input ref={searchRef} className={styles.searchInput} placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className={styles.body}>
          {/* Blank option */}
          {!search && (
            <div className={styles.blank} onClick={() => { onSelectBlank(); onClose(); }}>
              <div className={styles.blankIcon}>+</div>
              <div className={styles.blankInfo}>
                <div className={styles.blankName}>Blank document</div>
                <div className={styles.blankDesc}>Start from scratch</div>
              </div>
            </div>
          )}

          {/* Recent */}
          {recent.length > 0 && !search && (
            <>
              <div className={styles.secLabel}>recently used</div>
              {recent.map(t => (
                <div key={t.id} className={styles.item} onClick={() => handlePick(t)}>
                  <div className={styles.itemIcon}>{t.icon}</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{t.name}</div>
                    <div className={styles.itemDesc}>{t.description}</div>
                  </div>
                  <div className={styles.itemMeta}>{t.blocks.length} blocks<br />Used {t.usageCount}x</div>
                </div>
              ))}
            </>
          )}

          {/* Built-in */}
          {builtIn.length > 0 && (
            <>
              <div className={styles.secLabel}>felmark templates</div>
              {builtIn.map(t => (
                <div key={t.id} className={styles.item} onClick={() => handlePick(t)}>
                  <div className={styles.itemIcon}>{t.icon}</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{t.name}</div>
                    <div className={styles.itemDesc}>{t.description}</div>
                  </div>
                  <div className={styles.itemMeta}>{t.blocks.length} blocks</div>
                </div>
              ))}
            </>
          )}

          {/* User templates */}
          {userTemplates.length > 0 && (
            <>
              <div className={styles.secLabel}>your templates</div>
              {userTemplates.map(t => (
                <div key={t.id} className={styles.item} onClick={() => handlePick(t)}>
                  <div className={styles.itemIcon}>{t.icon}</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{t.name}</div>
                    <div className={styles.itemDesc}>{t.description}</div>
                  </div>
                  <div className={styles.itemMeta}>{t.blocks.length} blocks<br />{t.usageCount > 0 ? `Used ${t.usageCount}x` : "New"}</div>
                </div>
              ))}
            </>
          )}

          {filtered.length === 0 && search && (
            <div className={styles.empty}>No templates match &ldquo;{search}&rdquo;</div>
          )}
        </div>

        <div className={styles.footer}>
          <span>{templates.length} templates</span>
          <span>⏎ select · esc close</span>
        </div>
      </div>
    </div>
  );
}
