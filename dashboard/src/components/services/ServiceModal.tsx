"use client";

import { useState, useEffect } from "react";
import type { Service, ServiceTier } from "@/lib/types";
import { uid } from "@/lib/utils";
import styles from "./ServiceModal.module.css";

const EMOJI_OPTIONS = ["\u25C6", "\u25C7", "\u270E", "\u25CE", "\u2B21", "$", "\u00A7", "\u2192"];
const COLOR_OPTIONS = ["#b07d4f", "#5b7fa4", "#5a9a3c", "#7c6b9e", "#8a7e63", "#c24b38", "#3a8a8a", "#9a5b8a"];
const CATEGORY_OPTIONS = ["Design", "Writing", "Consulting", "Development", "Marketing", "Other"];

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  editService?: Service | null;
}

function emptyTier(): ServiceTier {
  return { id: uid(), name: "", price: 0, unit: "flat", hours: 0, popular: false, includes: [""] };
}

export default function ServiceModal({ open, onClose, onSave, editService }: ServiceModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [category, setCategory] = useState("Design");
  const [tiers, setTiers] = useState<ServiceTier[]>([emptyTier()]);

  useEffect(() => {
    if (editService) {
      setName(editService.name);
      setDesc(editService.desc);
      setEmoji(editService.emoji);
      setColor(editService.color);
      setCategory(editService.category);
      setTiers(editService.tiers.length > 0 ? editService.tiers : [emptyTier()]);
    } else {
      setName("");
      setDesc("");
      setEmoji(EMOJI_OPTIONS[0]);
      setColor(COLOR_OPTIONS[0]);
      setCategory("Design");
      setTiers([emptyTier()]);
    }
  }, [editService, open]);

  if (!open) return null;

  const updateTier = (idx: number, updates: Partial<ServiceTier>) => {
    setTiers(prev => prev.map((t, i) => i === idx ? { ...t, ...updates } : t));
  };

  const removeTier = (idx: number) => {
    if (tiers.length <= 1) return;
    setTiers(prev => prev.filter((_, i) => i !== idx));
  };

  const addTier = () => {
    setTiers(prev => [...prev, emptyTier()]);
  };

  const updateInclude = (tierIdx: number, incIdx: number, value: string) => {
    setTiers(prev => prev.map((t, i) => {
      if (i !== tierIdx) return t;
      const inc = [...t.includes];
      inc[incIdx] = value;
      return { ...t, includes: inc };
    }));
  };

  const removeInclude = (tierIdx: number, incIdx: number) => {
    setTiers(prev => prev.map((t, i) => {
      if (i !== tierIdx) return t;
      return { ...t, includes: t.includes.filter((_, j) => j !== incIdx) };
    }));
  };

  const addInclude = (tierIdx: number) => {
    setTiers(prev => prev.map((t, i) => {
      if (i !== tierIdx) return t;
      return { ...t, includes: [...t.includes, ""] };
    }));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const cleanTiers = tiers
      .filter(t => t.name.trim())
      .map(t => ({ ...t, includes: t.includes.filter(inc => inc.trim()) }));

    const service: Service = {
      id: editService?.id || uid(),
      name: name.trim(),
      desc: desc.trim(),
      emoji,
      color,
      category,
      tiers: cleanTiers.length > 0 ? cleanTiers : [{ id: uid(), name: "Standard", price: 0, unit: "flat", hours: 0, includes: [] }],
      timesUsed: editService?.timesUsed || 0,
      totalEarned: editService?.totalEarned || 0,
      avgRating: editService?.avgRating || 0,
      lastUsed: editService?.lastUsed || "Never",
      builtIn: editService?.builtIn,
    };
    onSave(service);
    onClose();
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.head}>
          <span className={styles.headTitle}>{editService ? "Edit Service" : "New Service"}</span>
          <button className={styles.close} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Service name</label>
            <input className={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Brand Identity" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea className={styles.textarea} value={desc} onChange={e => setDesc(e.target.value)} placeholder="What does this service include?" />
          </div>

          <div className={styles.row}>
            <div className={styles.field} style={{ flex: 1 }}>
              <label className={styles.label}>Icon</label>
              <div className={styles.emojiRow}>
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} className={`${styles.emojiBtn} ${emoji === e ? styles.emojiBtnOn : ""}`} onClick={() => setEmoji(e)}>{e}</button>
                ))}
              </div>
            </div>
            <div className={styles.field} style={{ width: 160 }}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <div className={styles.colorRow}>
              {COLOR_OPTIONS.map(c => (
                <button key={c} className={`${styles.colorBtn} ${color === c ? styles.colorBtnOn : ""}`} style={{ background: c }} onClick={() => setColor(c)} />
              ))}
            </div>
          </div>

          <div className={styles.section}>pricing tiers</div>

          {tiers.map((tier, idx) => (
            <div key={tier.id} className={styles.tierCard}>
              <div className={styles.tierHead}>
                <span className={styles.tierTitle}>Tier {idx + 1}</span>
                <div className={styles.tierActions}>
                  <label className={styles.popularToggle}>
                    <input type="checkbox" checked={!!tier.popular} onChange={e => updateTier(idx, { popular: e.target.checked })} />
                    Popular
                  </label>
                  {tiers.length > 1 && (
                    <button className={styles.tierRemove} onClick={() => removeTier(idx)} title="Remove tier">&times;</button>
                  )}
                </div>
              </div>
              <div className={styles.tierFields}>
                <input className={`${styles.input} ${styles.tierFlex}`} value={tier.name} onChange={e => updateTier(idx, { name: e.target.value })} placeholder="Tier name" />
                <input className={`${styles.input} ${styles.tierSmall}`} type="number" value={tier.price || ""} onChange={e => updateTier(idx, { price: Number(e.target.value) })} placeholder="Price" />
                <select className={`${styles.select} ${styles.tierMed}`} value={tier.unit} onChange={e => updateTier(idx, { unit: e.target.value })}>
                  <option value="flat">Flat</option>
                  <option value="per page">Per page</option>
                  <option value="per month">Per month</option>
                  <option value="per hour">Per hour</option>
                </select>
                <input className={`${styles.input} ${styles.tierSmall}`} type="number" value={tier.hours || ""} onChange={e => updateTier(idx, { hours: Number(e.target.value) })} placeholder="Hours" />
              </div>

              <label className={styles.label}>Includes</label>
              <div className={styles.includesList}>
                {tier.includes.map((inc, incIdx) => (
                  <div key={incIdx} className={styles.includeRow}>
                    <input className={styles.includeInput} value={inc} onChange={e => updateInclude(idx, incIdx, e.target.value)} placeholder="Feature or deliverable..." />
                    {tier.includes.length > 1 && (
                      <button className={styles.includeRemove} onClick={() => removeInclude(idx, incIdx)}>&times;</button>
                    )}
                  </div>
                ))}
                <button className={styles.addInclude} onClick={() => addInclude(idx)}>+ Add item</button>
              </div>
            </div>
          ))}

          <button className={styles.addTierBtn} onClick={addTier}>+ Add Tier</button>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>{editService ? "Save Changes" : "Create Service"}</button>
        </div>
      </div>
    </>
  );
}
