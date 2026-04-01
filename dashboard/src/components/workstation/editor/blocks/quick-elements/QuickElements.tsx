"use client";

import { useState, useEffect } from "react";
import type { Block, BlockType } from "@/lib/types";
import styles from "./QuickElements.module.css";

interface Suggestion {
  id: string;
  priority: "high" | "medium";
  icon: string;
  label: string;
  reason: string;
  detail: string;
  block: string;
  blockType: BlockType;
  blockIcon: string;
  impact: string;
  impactColor: string;
  preview: string;
}

interface QuickElementsProps {
  blocks: Block[];
  onInsertBlock?: (type: BlockType) => void;
}

function analyzeSuggestions(blocks: Block[]): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const types = new Set(blocks.map(b => b.type));
  const content = blocks.map(b => b.content || "").join(" ").toLowerCase();

  // No testimonial/quote in a doc with pricing or deliverables
  const hasPricing = types.has("money") || types.has("pricing-config") || content.includes("$") || content.includes("pricing") || content.includes("investment");
  const hasQuote = types.has("quote") || types.has("pullquote") || content.includes("testimonial");
  if (hasPricing && !hasQuote && blocks.length > 3) {
    suggestions.push({
      id: "social-proof", priority: "high", icon: "❝", label: "Add social proof",
      reason: "Proposals with testimonials close 34% more often",
      detail: "Your document has pricing but no testimonials. Drop a client quote before the pricing section — it builds trust right before the decision point.",
      block: "Pull Quote", blockType: "pullquote", blockIcon: "❝",
      impact: "+34% close rate", impactColor: "#5a9a3c",
      preview: "\"They didn't just deliver — they gave us a strategic foundation we still use today.\"",
    });
  }

  // No scope boundary in a doc with deliverables
  const hasDeliverables = types.has("deliverable") || types.has("todo") || content.includes("deliverable") || content.includes("scope");
  const hasScope = types.has("scope-boundary");
  if (hasDeliverables && !hasScope && blocks.length > 4) {
    suggestions.push({
      id: "scope-block", priority: "high", icon: "⇄", label: "Define scope boundary",
      reason: "No explicit scope — #1 cause of creep",
      detail: "You've listed deliverables but haven't drawn the line on what's excluded. Add a Scope Boundary block to prevent 'I thought that was included' conversations.",
      block: "Scope Boundary", blockType: "scope-boundary", blockIcon: "⇄",
      impact: "Prevents scope creep", impactColor: "#b07d4f",
      preview: "✓ Logo design, color palette, typography ✕ Website, copywriting, print production",
    });
  }

  // No timeline in a doc with multiple sections
  const hasTimeline = types.has("timeline") || types.has("deadline") || types.has("flow");
  const hasMultipleSections = blocks.filter(b => b.type === "h2" || b.type === "h3").length >= 2;
  if (!hasTimeline && hasMultipleSections && hasPricing) {
    suggestions.push({
      id: "timeline", priority: "medium", icon: "◇", label: "Show the timeline",
      reason: "Clients are 2× more likely to sign with a clear roadmap",
      detail: "Your proposal jumps from deliverables to pricing. Add a Visual Timeline between them so the client sees when each phase happens.",
      block: "Timeline", blockType: "timeline", blockIcon: "◇",
      impact: "2× sign rate", impactColor: "#5b7fa4",
      preview: "Week 1: Discovery → Week 2-3: Design → Week 4: Refinement → Week 5: Delivery",
    });
  }

  // No payment schedule with pricing
  const hasPaySchedule = types.has("money") || content.includes("payment schedule") || content.includes("milestone");
  if (hasPricing && !hasPaySchedule && blocks.length > 5) {
    suggestions.push({
      id: "payment", priority: "medium", icon: "$", label: "Add payment schedule",
      reason: "Milestone billing reduces payment disputes by 60%",
      detail: "You have pricing but no payment schedule. Break the total into milestones so the client knows when each payment is due.",
      block: "Money Block", blockType: "money", blockIcon: "$",
      impact: "−60% disputes", impactColor: "#5a9a3c",
      preview: "50% deposit → 25% on milestone → 25% on delivery",
    });
  }

  // No signature block
  const hasSignature = types.has("signoff") || content.includes("signature") || content.includes("sign off");
  if (hasPricing && !hasSignature && blocks.length > 5) {
    suggestions.push({
      id: "signature", priority: "medium", icon: "✓", label: "Add e-signature",
      reason: "Signed proposals are legally binding",
      detail: "Your proposal has no signature block. Add one so the client can formally accept the terms, timeline, and pricing.",
      block: "Sign-off", blockType: "signoff", blockIcon: "✓",
      impact: "Legal protection", impactColor: "#7c6b9e",
      preview: "Freelancer: ✓ Signed · Mar 15 | Client: Awaiting signature",
    });
  }

  return suggestions;
}

export default function QuickElements({ blocks, onInsertBlock }: QuickElementsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [inserted, setInserted] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setSuggestions(analyzeSuggestions(blocks));
  }, [blocks]);

  const active = suggestions.filter(s => !dismissed.has(s.id));

  if (active.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.head}>
          <div className={styles.headRow}>
            <span className={styles.headIcon}>✦</span>
            <span className={styles.headTitle}>Quick elements</span>
          </div>
        </div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✓</div>
          <div className={styles.emptyText}>Looking good</div>
          <div className={styles.emptySub}>No suggestions right now</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <div className={styles.headRow}>
          <span className={styles.headIcon}>✦</span>
          <span className={styles.headTitle}>Quick elements</span>
        </div>
        <div className={styles.headSub}>AI suggestions for this document</div>
      </div>

      <div className={styles.list}>
        {active.map(s => {
          const isExpanded = expanded === s.id;
          const isInserted = inserted.has(s.id);

          return (
            <div key={s.id} className={`${styles.item} ${isExpanded ? styles.itemExpanded : ""} ${isInserted ? styles.itemInserted : ""}`}>
              <div className={styles.itemTop} onClick={() => setExpanded(isExpanded ? null : s.id)}>
                <div className={styles.itemLeft}>
                  <div className={`${styles.itemIcon} ${styles[`priority_${s.priority}`]}`}>{s.icon}</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemLabel}>{s.label}</div>
                    <div className={styles.itemReason}>{s.reason}</div>
                  </div>
                </div>
                <div className={styles.itemChevron}>{isExpanded ? "−" : "+"}</div>
              </div>

              {isExpanded && !isInserted && (
                <div className={styles.itemDetail}>
                  <div className={styles.itemExplain}>{s.detail}</div>
                  <div className={styles.preview}>
                    <div className={styles.previewLabel}>
                      <span className={styles.previewIcon}>{s.blockIcon}</span>
                      {s.block}
                    </div>
                    <div className={styles.previewText}>{s.preview}</div>
                  </div>
                  <div className={styles.impact}>
                    <span className={styles.impactDot} style={{ background: s.impactColor }} />
                    <span className={styles.impactText} style={{ color: s.impactColor }}>{s.impact}</span>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.insertBtn} onClick={e => {
                      e.stopPropagation();
                      setInserted(prev => new Set([...prev, s.id]));
                      onInsertBlock?.(s.blockType);
                    }}>+ Insert {s.block}</button>
                    <button className={styles.dismissBtn} onClick={e => {
                      e.stopPropagation();
                      setDismissed(prev => new Set([...prev, s.id]));
                      setExpanded(null);
                    }}>Dismiss</button>
                  </div>
                </div>
              )}

              {isInserted && (
                <div className={styles.insertedMsg}>
                  <span className={styles.insertedIcon}>✓</span>
                  <span className={styles.insertedText}>Inserted</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.foot}>
        <div className={styles.footRow}>
          <span className={styles.footDot} />
          <span>Analyzing document...</span>
        </div>
      </div>
    </div>
  );
}
