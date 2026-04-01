"use client";

import { useState } from "react";
import type { Block, TemplateCategory, DocumentTemplate, TemplateBlock } from "@/lib/types";
import { uid } from "@/lib/utils";
import styles from "./SaveTemplateModal.module.css";

const ICONS = ["◆", "☰", "$", "§", "◎", "→", "☐", "✎", "◇", "⬡"];

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: "proposals", label: "Proposals" },
  { id: "contracts", label: "Contracts" },
  { id: "notes", label: "Notes" },
  { id: "planning", label: "Planning" },
  { id: "financial", label: "Financial" },
  { id: "onboarding", label: "Onboarding" },
  { id: "custom", label: "Custom" },
];

const BLOCK_LABELS: Record<string, string> = {
  h1: "H1", h2: "H2", h3: "H3", paragraph: "¶", bullet: "•", numbered: "1.",
  todo: "☐", quote: "❝", code: "<>", callout: "!", divider: "——",
  graph: "▥", money: "$", deliverable: "◆", table: "▤", accordion: "▾",
  math: "∑", deadline: "⏱", audio: "🎙",
};

interface SaveTemplateModalProps {
  open: boolean;
  onClose: () => void;
  blocks: Block[];
  onSave: (template: DocumentTemplate) => void;
}

function blocksToTemplateBlocks(blocks: Block[]): TemplateBlock[] {
  return blocks.map(b => {
    const tb: TemplateBlock = {
      type: b.type,
      content: b.type.startsWith("h") ? b.content : "",
      checked: false,
    };
    // Preserve structure data, clear specific values
    if (b.graphData) tb.graphData = b.graphData;
    if (b.moneyData) tb.moneyData = b.moneyData;
    if (b.tableData) tb.tableData = { rows: b.tableData.rows.length > 0 ? [b.tableData.rows[0], ...b.tableData.rows.slice(1).map(r => r.map(() => ""))] : [] };
    if (b.accordionData) tb.accordionData = b.accordionData;
    if (b.deadlineData) tb.deadlineData = b.deadlineData;
    if (b.deliverableData) tb.deliverableData = { ...b.deliverableData, status: "todo", files: [], comments: [], approvals: [] };
    // Keep heading/callout/quote content (structural)
    if (b.type === "callout" || b.type === "quote") tb.content = b.content;
    return tb;
  });
}

export default function SaveTemplateModal({ open, onClose, blocks, onSave }: SaveTemplateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("custom");
  const [icon, setIcon] = useState("◆");

  if (!open) return null;

  const templateBlocks = blocksToTemplateBlocks(blocks);

  const handleSave = () => {
    if (!name.trim()) return;
    const template: DocumentTemplate = {
      id: uid(),
      name: name.trim(),
      description: description.trim(),
      icon,
      category,
      blocks: templateBlocks,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      usageCount: 0,
      lastUsed: null,
      source: "user",
    };
    onSave(template);
    onClose();
    setName("");
    setDescription("");
    setCategory("custom");
    setIcon("◆");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.head}>
          <span className={styles.title}>Save as template</span>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Template name</label>
            <input className={styles.input} placeholder="e.g. Project Proposal" value={name} onChange={e => setName(e.target.value)} autoFocus
              onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") onClose(); }} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} placeholder="What is this template for?" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select className={styles.select} value={category} onChange={e => setCategory(e.target.value as TemplateCategory)}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Icon</label>
            <div className={styles.icons}>
              {ICONS.map(ic => (
                <button key={ic} className={`${styles.iconBtn} ${icon === ic ? styles.iconBtnOn : ""}`} onClick={() => setIcon(ic)}>{ic}</button>
              ))}
            </div>
          </div>

          <div className={styles.previewLabel}>
            Preview ({templateBlocks.length} blocks)
          </div>
          <div className={styles.preview}>
            {templateBlocks.map((b, i) => (
              <div key={i} className={styles.previewRow}>
                <span className={styles.previewType}>{BLOCK_LABELS[b.type] || b.type}</span>
                <span className={styles.previewText}>{b.content || `(${b.type})`}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} disabled={!name.trim()}>Save template</button>
        </div>
      </div>
    </div>
  );
}
