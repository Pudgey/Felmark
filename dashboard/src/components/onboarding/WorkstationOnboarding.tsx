"use client";

import { useState, useRef, useEffect } from "react";
import type { WorkstationTemplate, Workstation } from "@/lib/types";
import styles from "./WorkstationOnboarding.module.css";

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

const TEMPLATES: { id: WorkstationTemplate; icon: string; label: string; desc: string; sections: string[]; color: string }[] = [
  { id: "blank", icon: "◇", label: "Blank project", desc: "Start from scratch", sections: ["Notes"], color: "var(--ink-400)" },
  { id: "proposal", icon: "◆", label: "Proposal", desc: "Scope, timeline, pricing, terms", sections: ["Intro", "Scope", "Timeline", "Pricing", "Terms"], color: "var(--ember)" },
  { id: "meeting", icon: "○", label: "Meeting notes", desc: "Agenda, notes, action items", sections: ["Agenda", "Notes", "Action Items"], color: "#5a9a3c" },
  { id: "brief", icon: "□", label: "Project brief", desc: "Goals, audience, deliverables", sections: ["Overview", "Objectives", "Audience", "Deliverables", "Timeline"], color: "#5b7fa4" },
  { id: "retainer", icon: "↻", label: "Retainer", desc: "Monthly scope, hours, billing", sections: ["Scope", "Hours", "Deliverables", "Billing"], color: "#7c6b9e" },
  { id: "invoice", icon: "$", label: "Invoice only", desc: "Quick invoice, no project docs", sections: ["Line Items", "Terms"], color: "#8b5c3a" },
];

interface WorkstationOnboardingProps {
  initialName: string;
  workstations: Workstation[];
  onComplete: (data: {
    name: string;
    contact: string;
    rate: string;
    budget: string;
    color: string;
    template: WorkstationTemplate;
  }) => void;
  onSkip: () => void;
}

const AI_PLACEHOLDERS = [
  "What are you working on?",
  "Brand identity for a yoga studio",
  "Monthly retainer, $2k/mo",
  "Proposal for website redesign",
  "Quick invoice for logo project",
];

export default function WorkstationOnboarding({ initialName, workstations, onComplete, onSkip }: WorkstationOnboardingProps) {
  const [name, setName] = useState(initialName);
  const [contact, setContact] = useState("");
  const [rate, setRate] = useState("");
  const [budget, setBudget] = useState("");
  const [color, setColor] = useState(COLORS[9].value);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkstationTemplate>("proposal");
  const [showRecent, setShowRecent] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    template: WorkstationTemplate;
    templateLabel: string;
    projectName: string;
    sections: string[];
    tone: string;
    detectedBudget: string | null;
  } | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const nameRef = useRef<HTMLInputElement>(null);

  // Rotate placeholder every 3s
  useEffect(() => {
    if (aiPrompt) return; // stop rotating once user types
    const i = setInterval(() => setPlaceholderIdx(prev => (prev + 1) % AI_PLACEHOLDERS.length), 3000);
    return () => clearInterval(i);
  }, [aiPrompt]);

  const initials = name.trim()
    ? name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // Recent clients from existing workstations
  const recentClients = workstations
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

  const SECTION_PRESETS: Record<string, { template: WorkstationTemplate; label: string; sections: string[]; keywords: string[] }> = {
    brand: { template: "proposal", label: "Brand Identity Proposal", sections: ["Brand Audit", "Logo Exploration", "Color Palette", "Typography", "Brand Voice", "Applications", "Timeline", "Pricing"], keywords: ["brand", "identity", "logo", "branding"] },
    website: { template: "proposal", label: "Web Project Proposal", sections: ["Sitemap", "Wireframes", "Design Concepts", "Development", "Content Strategy", "Launch Plan", "Timeline", "Pricing"], keywords: ["website", "landing", "web", "app", "site"] },
    proposal: { template: "proposal", label: "Project Proposal", sections: ["Introduction", "Scope of Work", "Deliverables", "Timeline", "Pricing", "Terms"], keywords: ["proposal", "pitch", "bid", "project"] },
    invoice: { template: "invoice", label: "Invoice", sections: ["Line Items", "Payment Terms", "Notes"], keywords: ["invoice", "bill", "payment"] },
    meeting: { template: "meeting", label: "Meeting Notes", sections: ["Agenda", "Discussion", "Decisions", "Action Items", "Follow-ups"], keywords: ["meeting", "call", "standup", "sync", "check-in"] },
    brief: { template: "brief", label: "Project Brief", sections: ["Overview", "Objectives", "Target Audience", "Deliverables", "Constraints", "Timeline"], keywords: ["brief", "kick", "onboard", "scope", "requirements"] },
    retainer: { template: "retainer", label: "Retainer Agreement", sections: ["Monthly Scope", "Hours & Availability", "Deliverables", "Communication", "Billing", "Terms"], keywords: ["retainer", "monthly", "ongoing", "subscription"] },
    social: { template: "brief", label: "Social Media Project", sections: ["Strategy", "Content Calendar", "Platform Guidelines", "Asset Specs", "Analytics", "Timeline"], keywords: ["social", "instagram", "tiktok", "content", "campaign"] },
    packaging: { template: "proposal", label: "Packaging Design Proposal", sections: ["Brand Review", "Structural Design", "Visual Design", "Print Specs", "Mockups", "Timeline", "Pricing"], keywords: ["packaging", "package", "label", "print"] },
  };

  const handleAiSetup = () => {
    if (!aiPrompt.trim() || aiProcessing) return;
    setAiProcessing(true);

    setTimeout(() => {
      const prompt = aiPrompt.toLowerCase();

      // Find best matching preset
      let bestMatch = SECTION_PRESETS.brief; // fallback
      let bestScore = 0;
      for (const [, preset] of Object.entries(SECTION_PRESETS)) {
        const score = preset.keywords.filter(kw => prompt.includes(kw)).length;
        if (score > bestScore) { bestScore = score; bestMatch = preset; }
      }

      // Detect tone
      const casualWords = ["quick", "friend", "buddy", "simple", "small", "easy", "just"];
      const formalWords = ["enterprise", "corporation", "board", "executive", "compliance", "strategic"];
      const isCasual = casualWords.some(w => prompt.includes(w));
      const isFormal = formalWords.some(w => prompt.includes(w));
      const tone = isCasual ? "Casual" : isFormal ? "Formal" : "Professional";

      // Detect budget
      const budgetMatch = aiPrompt.match(/\$[\d,]+(?:\s*[–-]\s*\$?[\d,]+)?/);
      if (budgetMatch && !budget) setBudget(budgetMatch[0]);

      // Generate project name
      let projectName = "";
      if (!name.trim() || name === initialName) {
        // Try to extract a meaningful name from the prompt
        const cleaned = aiPrompt.trim().replace(/[,.].*$/, "").slice(0, 40);
        projectName = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      } else {
        projectName = name + " — " + bestMatch.label;
      }

      setSelectedTemplate(bestMatch.template);
      setAiResult({
        template: bestMatch.template,
        templateLabel: bestMatch.label,
        projectName,
        sections: [...bestMatch.sections],
        tone,
        detectedBudget: budgetMatch ? budgetMatch[0] : null,
      });

      setAiProcessing(false);
    }, 800);
  };

  const removeAiSection = (section: string) => {
    if (!aiResult) return;
    setAiResult({ ...aiResult, sections: aiResult.sections.filter(s => s !== section) });
  };

  const acceptAiResult = () => {
    if (!aiResult) return;
    if (aiResult.projectName && (!name.trim() || name === initialName)) {
      setName(aiResult.projectName);
    }
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
          <h2 className={styles.headerTitle}>{name.trim() || "New workstation"}</h2>
          <p className={styles.headerSub}>{contact || "Set up a new client workstation"}</p>
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

        {/* AI Assist */}
        <div className={styles.aiSection}>
          <div className={styles.aiHeader}>
            <span className={styles.aiIcon}>⚡</span>
            <span className={styles.aiLabel}>Describe your project</span>
            <span className={styles.optional}>optional</span>
          </div>
          <div className={styles.aiInputRow}>
            <textarea
              className={styles.aiInput}
              value={aiPrompt}
              onChange={e => { setAiPrompt(e.target.value); if (aiResult) setAiResult(null); }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiSetup(); } }}
              placeholder={AI_PLACEHOLDERS[placeholderIdx]}
              rows={2}
            />
            <button className={styles.aiBtn} onClick={handleAiSetup} disabled={!aiPrompt.trim() || aiProcessing}>
              {aiProcessing ? (
                <span className={styles.aiSpinner} />
              ) : "⚡"}
            </button>
          </div>

          {/* Structured AI result card */}
          {aiResult && (
            <div className={styles.aiCard}>
              <div className={styles.aiCardHeader}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="#5a9a3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className={styles.aiCardTitle}>Here&apos;s what I set up</span>
                <span className={styles.aiToneBadge}>{aiResult.tone}</span>
              </div>

              <div className={styles.aiCardRows}>
                <div className={styles.aiCardRow}>
                  <span className={styles.aiCardLabel}>Template</span>
                  <span className={styles.aiCardValue}>{aiResult.templateLabel}</span>
                </div>
                {aiResult.projectName && (
                  <div className={styles.aiCardRow}>
                    <span className={styles.aiCardLabel}>Project</span>
                    <span className={styles.aiCardValue}>{aiResult.projectName}</span>
                  </div>
                )}
                {aiResult.detectedBudget && (
                  <div className={styles.aiCardRow}>
                    <span className={styles.aiCardLabel}>Budget</span>
                    <span className={styles.aiCardValue}>{aiResult.detectedBudget}</span>
                  </div>
                )}
              </div>

              <div className={styles.aiCardSections}>
                <span className={styles.aiCardLabel}>Sections</span>
                <div className={styles.aiSectionPills}>
                  {aiResult.sections.map(s => (
                    <span key={s} className={styles.aiSectionPill}>
                      {s}
                      <button className={styles.aiSectionRemove} onClick={() => removeAiSection(s)} title="Remove section">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <button className={styles.aiAcceptBtn} onClick={acceptAiResult}>
                Looks good
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLabel}>start with</span>
        </div>

        {/* Templates */}
        <div className={`${styles.templates} ${aiResult ? styles.templatesDimmed : ""}`}>
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className={`${styles.template} ${selectedTemplate === t.id ? styles.templateActive : ""} ${aiResult && selectedTemplate !== t.id ? styles.templateDimmed : ""}`}
              onClick={() => { setSelectedTemplate(t.id); if (aiResult) setAiResult(null); }}
            >
              <span className={styles.templateIcon} style={{ color: t.color }}>{t.icon}</span>
              <div className={styles.templateInfo}>
                <span className={styles.templateLabel}>
                  {t.label}
                  {aiResult && selectedTemplate === t.id && <span className={styles.templateRecommended}>Recommended</span>}
                </span>
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
          Create workstation
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
