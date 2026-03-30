"use client";

import { useState } from "react";
import type { AiActionBlockData, AiActionMode } from "@/lib/types";
import styles from "./AiActionBlock.module.css";

const MODES: { mode: AiActionMode; icon: string; label: string }[] = [
  { mode: "summarize", icon: "\u03A3", label: "Summarize" },
  { mode: "suggest", icon: "\u25C8", label: "Suggest" },
  { mode: "translate", icon: "\u27D0", label: "Translate" },
  { mode: "tone", icon: "\u266A", label: "Tone Check" },
  { mode: "scope", icon: "\u26A0", label: "Scope Risk" },
];

const MOCK_OUTPUTS: Record<AiActionMode, string> = {
  summarize:
    "This section covers brand guidelines including logo usage rules, typography scale, and color palette definitions. Key decisions: minimum logo size set to 48px, primary typeface is Inter, accent color is #b07d4f (ember). 3 subsections, 2 completed.",
  suggest:
    "Based on the context, consider adding:\n\u2022 A section on logo clear space requirements (commonly expected in brand guides)\n\u2022 Dark mode color variants for each primary color\n\u2022 Social media avatar sizing guide\n\u2022 File format specifications for logo exports (SVG, PNG, EPS)",
  translate:
    "[Spanish]\nEsta secci\u00F3n cubre las directrices de marca, incluyendo las reglas de uso del logotipo, la escala tipogr\u00E1fica y las definiciones de la paleta de colores.",
  tone:
    "\u2713 Professional tone \u2014 consistent throughout\n\u26A0 Line 4: \u201CJust use the logo however\u201D \u2014 too casual for a brand guide\n\u26A0 Line 12: \u201CThe client shall henceforth comply with...\u201D \u2014 overly formal, consider simplifying\n\u2713 89% of content matches target tone (Professional)",
  scope:
    "\u26A0 2 risks detected:\n1. \u201CDesign deliverables\u201D \u2014 vague. Specify: How many concepts? What file formats? What revision rounds?\n2. \u201COngoing support\u201D \u2014 undefined scope. Add: hours/month cap, response time SLA, what\u2019s included vs. excluded.\n\u2713 Budget ($2,400) and timeline (Apr 3) are defined.",
};

const LANGUAGES = [
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Japanese",
  "Mandarin",
  "Korean",
  "Italian",
  "Dutch",
  "Arabic",
];

interface AiActionBlockProps {
  data: AiActionBlockData;
  onUpdate: (data: AiActionBlockData) => void;
}

export function getDefaultAiActionData(): AiActionBlockData {
  return { mode: "summarize", output: "", targetLabel: "Section above", ran: false };
}

export default function AiActionBlock({ data, onUpdate }: AiActionBlockProps) {
  const [running, setRunning] = useState(false);
  const [selectedLang, setSelectedLang] = useState(data.language || "Spanish");

  const activeMode = MODES.find((m) => m.mode === data.mode) || MODES[0];

  const handleModeChange = (mode: AiActionMode) => {
    onUpdate({ ...data, mode, output: "", ran: false });
  };

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      let output = MOCK_OUTPUTS[data.mode];
      if (data.mode === "translate") {
        output = `[${selectedLang}]\nEsta secci\u00F3n cubre las directrices de marca, incluyendo las reglas de uso del logotipo, la escala tipogr\u00E1fica y las definiciones de la paleta de colores.`;
      }
      onUpdate({ ...data, output, ran: true, language: selectedLang });
      setRunning(false);
    }, 800);
  };

  const handleDismiss = () => {
    onUpdate({ ...data, output: "", ran: false });
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerIcon}>{"\u26A1"}</span>
        <span className={styles.headerLabel}>AI Action</span>
        <span className={styles.headerMode}>{activeMode.label}</span>
      </div>

      {/* Mode picker */}
      <div className={styles.modePicker}>
        {MODES.map((m) => (
          <button
            key={m.mode}
            className={`${styles.modeBtn} ${data.mode === m.mode ? styles.modeBtnActive : ""}`}
            onClick={() => handleModeChange(m.mode)}
            title={m.label}
          >
            <span className={styles.modeBtnIcon}>{m.icon}</span>
            <span className={styles.modeBtnLabel}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Context line */}
      <div className={styles.context}>
        Analyzing: <span className={styles.contextTarget}>{data.targetLabel}</span>
      </div>

      {/* Language picker for translate mode */}
      {data.mode === "translate" && !data.ran && (
        <div className={styles.langPicker}>
          <label className={styles.langLabel}>Target language:</label>
          <select
            className={styles.langSelect}
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Run button */}
      {!data.ran && (
        <button className={styles.runBtn} onClick={handleRun} disabled={running}>
          {running ? "Analyzing..." : "Run Analysis"}
        </button>
      )}

      {/* Output area */}
      {data.ran && data.output && (
        <div className={styles.output}>
          <div className={styles.outputContent}>
            {data.output.split("\n").map((line, i) => (
              <div key={i} className={styles.outputLine}>
                {line}
              </div>
            ))}
          </div>
          <div className={styles.outputActions}>
            <button className={styles.rerunBtn} onClick={handleRun} disabled={running}>
              {running ? "Analyzing..." : "Re-run"}
            </button>
            <button className={styles.dismissBtn} onClick={handleDismiss}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
