"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./CreationAnimation.module.css";

interface CreationAnimationProps {
  clientName: string;
  templateName: string;
  color: string;
  onComplete: () => void;
}

const PHASES = [
  { type: "thinking", duration: 1200 },
  { type: "command", duration: 800 },
  { type: "progress", duration: 1800 },
  { type: "files", duration: 1400 },
  { type: "ai", duration: 2400 },
  { type: "success", duration: 0 },
];

function ProgressBar({ duration = 1800 }: { duration?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const frame = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [duration]);

  const filled = Math.round(progress * 24);
  const empty = 24 - filled;
  return (
    <span className={styles.progressMono}>
      [{"█".repeat(filled)}{"░".repeat(empty)}] {Math.round(progress * 100)}%
    </span>
  );
}

export default function CreationAnimation({ clientName, templateName, color, onComplete }: CreationAnimationProps) {
  const [phase, setPhase] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initials = clientName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => {
    let current = 0;
    const advance = () => {
      if (current >= PHASES.length - 1) return;
      const dur = PHASES[current].duration;
      setTimeout(() => {
        current++;
        setPhase(current);
        advance();
      }, dur + 400);
    };
    advance();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [phase]);

  const files = [
    { name: `${clientName.toLowerCase().replace(/\s+/g, "-")}/proposal.fm`, size: "2.4 KB" },
    { name: "scope-of-work.fm", size: "1.8 KB" },
    { name: "timeline.fm", size: "0.9 KB" },
    { name: "pricing.fm", size: "1.1 KB" },
    { name: ".felmark/config.yml", size: "0.4 KB" },
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.modal}>
        {/* Terminal chrome */}
        <div className={styles.termHead}>
          <div className={styles.dots}>
            <div className={styles.dot} style={{ background: "#ff5f57" }} />
            <div className={styles.dot} style={{ background: "#febc2e" }} />
            <div className={styles.dot} style={{ background: "#28c840" }} />
          </div>
          <div className={styles.termTitle}>felmark — creating workstation</div>
          <div style={{ width: 52 }} />
        </div>

        <div className={styles.termBody} ref={scrollRef}>
          {/* Phase 0: Thinking */}
          {phase >= 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                <span className={styles.spinner}>⠋</span> thinking
              </div>
              <div className={styles.fadeLine}>Analyzing workstation context...</div>
              <div className={styles.fadeLine} style={{ animationDelay: "0.3s" }}>Client: {clientName}</div>
              <div className={styles.fadeLine} style={{ animationDelay: "0.6s" }}>Template: {templateName}</div>
            </div>
          )}

          {/* Phase 1: Command */}
          {phase >= 1 && (
            <>
              <div className={styles.divider} />
              <div className={styles.command}>
                <span className={styles.prompt}>❯</span>
                <span className={styles.cmdText}>felmark create-workstation</span>
                <span className={styles.cmdFlags}>--client &quot;{clientName}&quot; --template {templateName.toLowerCase().replace(/\s+/g, "-")}</span>
              </div>
            </>
          )}

          {/* Phase 2: Progress */}
          {phase >= 2 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>scaffolding</div>
              {["Creating workstation structure", "Setting up document tree", "Initializing block editor", `Loading template: ${templateName}`].map((text, i) => (
                <div key={i} className={styles.stepLine} style={{ animationDelay: `${i * 0.35}s` }}>
                  <span className={styles.check}>✓</span>
                  <span>{text}</span>
                </div>
              ))}
              <div className={styles.barWrap}><ProgressBar /></div>
            </div>
          )}

          {/* Phase 3: Files */}
          {phase >= 3 && (
            <>
              <div className={styles.divider} />
              <div className={styles.section}>
                <div className={styles.sectionLabel}>generated files</div>
                {files.map((f, i) => (
                  <div key={i} className={styles.fileLine} style={{ animationDelay: `${i * 0.15}s` }}>
                    <span className={styles.fileStatus}>+</span>
                    <span className={styles.fileName}>{f.name}</span>
                    <span className={styles.fileSize}>{f.size}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Phase 4: AI */}
          {phase >= 4 && (
            <>
              <div className={styles.divider} />
              <div className={styles.section}>
                <div className={styles.aiLabel}><span>✦</span> ai context</div>
                {[
                  "Scanning workstation for client history...",
                  "Pre-filling scope from template defaults",
                  "Suggesting pricing based on similar projects",
                  `Timeline auto-set based on ${templateName.toLowerCase()} template`,
                ].map((text, i) => (
                  <div key={i} className={styles.aiLine} style={{ animationDelay: `${i * 0.45}s` }}>{text}</div>
                ))}
              </div>
            </>
          )}

          {/* Phase 5: Success */}
          {phase >= 5 && (
            <>
              <div className={styles.divider} />
              <div className={styles.success}>
                <div className={styles.successAvatar} style={{ background: color }}>{initials}</div>
                <div className={styles.successTitle}>{clientName}</div>
                <div className={styles.successSub}>Workstation ready · {templateName} template applied</div>
                <button className={styles.openBtn} onClick={onComplete}>
                  Open Workstation
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
