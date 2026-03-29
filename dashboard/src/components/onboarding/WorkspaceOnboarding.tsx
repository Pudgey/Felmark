"use client";

import { useState, useRef, useEffect } from "react";
import type { WorkspaceTemplate, Workspace } from "@/lib/types";
import styles from "./WorkspaceOnboarding.module.css";

const COLORS = [
  { id: "slate", value: "#7c8594" },
  { id: "clay", value: "#a08472" },
  { id: "olive", value: "#7a7e53" },
  { id: "moss", value: "#5a6e50" },
  { id: "storm", value: "#5c6878" },
  { id: "rust", value: "#8b5c3a" },
  { id: "forest", value: "#3d6b52" },
  { id: "violet", value: "#7c6b9e" },
  { id: "rose", value: "#9e5a6b" },
  { id: "ember", value: "#b07d4f" },
];

const TEMPLATES: { id: WorkspaceTemplate; icon: string; label: string; desc: string; sections: string[]; color: string }[] = [
  { id: "blank", icon: "◇", label: "Blank project", desc: "Start from scratch", sections: ["Notes"], color: "var(--ink-400)" },
  { id: "proposal", icon: "◆", label: "Proposal", desc: "Scope, timeline, pricing, terms", sections: ["Intro", "Scope", "Timeline", "Pricing", "Terms"], color: "var(--ember)" },
  { id: "meeting", icon: "○", label: "Meeting notes", desc: "Agenda, notes, action items", sections: ["Agenda", "Notes", "Action Items"], color: "#5a9a3c" },
  { id: "brief", icon: "□", label: "Project brief", desc: "Goals, audience, deliverables", sections: ["Overview", "Objectives", "Audience", "Deliverables", "Timeline"], color: "#5b7fa4" },
  { id: "retainer", icon: "↻", label: "Retainer", desc: "Monthly scope, hours, billing", sections: ["Scope", "Hours", "Deliverables", "Billing"], color: "#7c6b9e" },
  { id: "invoice", icon: "$", label: "Invoice only", desc: "Quick invoice, no project docs", sections: ["Line Items", "Terms"], color: "#8b5c3a" },
];

interface WorkspaceOnboardingProps {
  initialName: string;
  workspaces: Workspace[];
  onComplete: (data: {
    name: string;
    contact: string;
    rate: string;
    budget: string;
    color: string;
    template: WorkspaceTemplate;
  }) => void;
  onSkip: () => void;
}

export default function WorkspaceOnboarding({ initialName, workspaces, onComplete, onSkip }: WorkspaceOnboardingProps) {
  const [name, setName] = useState(initialName);
  const [contact, setContact] = useState("");
  const [rate, setRate] = useState("");
  const [budget, setBudget] = useState("");
  const [color, setColor] = useState(COLORS[9].value);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkspaceTemplate>("proposal");
  const [showRecent, setShowRecent] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const initials = name.trim()
    ? name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // Recent clients from existing workspaces
  const recentClients = workspaces
    .filter(w => w.contact)
    .slice(0, 5)
    .map(w => ({ name: w.client, color: w.avatarBg, contact: w.contact || "" }));

  useEffect(() => {
    nameRef.current?.select();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSkip]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onComplete({ name: name.trim(), contact, rate, budget, color, template: selectedTemplate });
  };

  const selectRecent = (client: { name: string; color: string; contact: string }) => {
    setName(client.name);
    setContact(client.contact);
    const match = COLORS.find(c => c.value === client.color);
    if (match) setColor(match.value);
    setShowRecent(false);
  };

  return (
    <div className={styles.card}>
      {/* Header — live avatar + title */}
      <div className={styles.header}>
        <div className={styles.headerIcon} style={{ background: name.trim() ? color : "var(--warm-200)" }}>
          {initials}
        </div>
        <div className={styles.headerInfo}>
          <h2 className={styles.headerTitle}>{name.trim() || "New workspace"}</h2>
          <p className={styles.headerSub}>{contact || "Set up a new client workspace"}</p>
        </div>
      </div>

      <div className={styles.body}>
        {/* Client name + recent picker */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Client name</label>
            {recentClients.length > 0 && (
              <button className={styles.recentTrigger} onClick={() => setShowRecent(!showRecent)}>
                or pick recent
              </button>
            )}
          </div>
          <div className={styles.inputWrap}>
            <input
              ref={nameRef}
              className={`${styles.input} ${styles.inputLarge}`}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Meridian Studio"
              onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
            />
            {showRecent && (
              <div className={styles.recentDropdown}>
                {recentClients.map(c => (
                  <div key={c.name} className={styles.recentItem} onClick={() => selectRecent(c)}>
                    <div className={styles.recentAv} style={{ background: c.color }}>{c.name[0]}</div>
                    <div>
                      <div className={styles.recentName}>{c.name}</div>
                      <div className={styles.recentContact}>{c.contact}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact + Rate */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Contact <span className={styles.optional}>optional</span></label>
            <input className={styles.input} value={contact} onChange={e => setContact(e.target.value)} placeholder="sarah@acme.com" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Rate <span className={styles.optional}>optional</span></label>
            <input className={styles.input} value={rate} onChange={e => setRate(e.target.value)} placeholder="$95/hr" />
          </div>
        </div>

        {/* Color picker */}
        <div className={styles.field}>
          <label className={styles.label}>Color</label>
          <div className={styles.colors}>
            {COLORS.map(c => (
              <button
                key={c.id}
                className={`${styles.colorDot} ${color === c.value ? styles.colorDotActive : ""}`}
                style={{ background: c.value }}
                onClick={() => setColor(c.value)}
              >
                {color === c.value && <span className={styles.colorCheck}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className={styles.field}>
          <label className={styles.label}>Estimated budget <span className={styles.optional}>optional</span></label>
          <input className={styles.input} value={budget} onChange={e => setBudget(e.target.value)} placeholder="$2,000 – $5,000" />
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLabel}>start with</span>
        </div>

        {/* Templates */}
        <div className={styles.templates}>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className={`${styles.template} ${selectedTemplate === t.id ? styles.templateActive : ""}`}
              onClick={() => setSelectedTemplate(t.id)}
            >
              <span className={styles.templateIcon} style={{ color: t.color }}>{t.icon}</span>
              <div className={styles.templateInfo}>
                <span className={styles.templateLabel}>{t.label}</span>
                <span className={styles.templateDesc}>{t.desc}</span>
                <div className={styles.templateSections}>
                  {t.sections.map((s, i) => (
                    <span key={i} className={styles.templateSection}>{s}</span>
                  ))}
                </div>
              </div>
              <div className={styles.templateCheck}>
                {selectedTemplate === t.id && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerHint}>
          <kbd className={styles.kbd}>esc</kbd> skip
        </div>
        <button className={styles.createBtn} onClick={handleSubmit} disabled={!name.trim()}>
          Create workspace
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
