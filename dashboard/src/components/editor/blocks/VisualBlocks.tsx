"use client";

import { useState } from "react";
import type {
  TimelineBlockData,
  TimelinePhase,
  FlowBlockData,
  BrandBoardData,
  MoodBoardData,
  WireframeBlockData,
  PullQuoteData,
} from "@/lib/types";
import styles from "./VisualBlocks.module.css";

// ── Default data factories ──

export function getDefaultTimeline(): TimelineBlockData {
  return {
    title: "Brand Guidelines v2 Timeline",
    phases: [
      {
        label: "Discovery",
        date: "Mar 1 - 7",
        status: "done",
        items: ["Client questionnaire", "Competitor audit", "Mood board review"],
        color: "#5a9a3c",
      },
      {
        label: "Concept",
        date: "Mar 8 - 18",
        status: "done",
        items: ["3 logo directions", "Color palette exploration", "Typography shortlist"],
        color: "#5a9a3c",
      },
      {
        label: "Design",
        date: "Mar 19 - 28",
        status: "current",
        items: ["Primary logo refinement", "Brand board assembly", "Collateral templates"],
        color: "#b07d4f",
      },
      {
        label: "Review",
        date: "Mar 29 - Apr 3",
        status: "upcoming",
        items: ["Client presentation", "Revision round 1", "Final sign-off"],
        color: "#7c8594",
      },
      {
        label: "Deliver",
        date: "Apr 4 - 7",
        status: "upcoming",
        items: ["Export all assets", "Style guide PDF", "Handoff meeting"],
        color: "#7c8594",
      },
    ],
  };
}

export function getDefaultFlow(): FlowBlockData {
  return {
    title: "Client Onboarding Process",
    nodes: [
      { id: "n1", label: "Inquiry", sub: "Day 0", desc: "Client fills out the contact form. We review fit and schedule a discovery call within 24 hours.", icon: "✉", color: "rgba(91, 127, 164, 0.15)" },
      { id: "n2", label: "Discovery", sub: "Day 1-2", desc: "30-minute call to understand goals, timeline, and budget. Send summary + proposal link after.", icon: "◎", color: "rgba(124, 107, 158, 0.15)" },
      { id: "n3", label: "Proposal", sub: "Day 3", desc: "Custom proposal with scope, milestones, and pricing. Client signs and pays 50% deposit.", icon: "◆", color: "rgba(176, 125, 79, 0.15)" },
      { id: "n4", label: "Kickoff", sub: "Day 5", desc: "Create workspace, share brand questionnaire, set up project timeline and first milestone.", icon: "▶", color: "rgba(90, 154, 60, 0.15)" },
      { id: "n5", label: "Deliver", sub: "Ongoing", desc: "Work through milestones with weekly check-ins. Invoice remaining 50% on final delivery.", icon: "✦", color: "rgba(176, 125, 79, 0.15)" },
    ],
  };
}

export function getDefaultBrandBoard(): BrandBoardData {
  return {
    title: "Meridian Studio — Brand Board",
    logoLetter: "M",
    logoName: "Meridian",
    logoSub: "Design Studio",
    colors: [
      { hex: "#2c2a25", name: "Charcoal", type: "Primary" },
      { hex: "#b07d4f", name: "Amber", type: "Accent" },
      { hex: "#5b7fa4", name: "Slate Blue", type: "Secondary" },
      { hex: "#faf9f7", name: "Parchment", type: "Background" },
      { hex: "#5a9a3c", name: "Forest", type: "Success" },
    ],
    fonts: [
      { family: "Cormorant Garamond", role: "Heading", weight: "700" },
      { family: "Outfit", role: "Body", weight: "400" },
      { family: "JetBrains Mono", role: "Mono", weight: "400" },
    ],
    keywords: ["Elevated", "Warm", "Intentional", "Craft", "Timeless"],
  };
}

export function getDefaultMoodBoard(): MoodBoardData {
  return {
    title: "Visual Direction — Warm Minimalism",
    cells: [
      { color: "#2c2a25", icon: "◆", label: "Dark Base", span: "large", lightText: true },
      { color: "#b07d4f", icon: "◇", label: "Warm Accent", lightText: true },
      { color: "#faf9f7", icon: "○", label: "Light" },
      { color: "#5b7fa4", icon: "◎", label: "Calm Tone", span: "wide", lightText: true },
      { color: "#e8e3db", icon: "△", label: "Neutral" },
      { color: "#5a9a3c", icon: "✦", label: "Natural", lightText: true },
    ],
    keywords: ["Minimalism", "Warmth", "Texture", "Organic", "Intentional"],
  };
}

export function getDefaultWireframe(): WireframeBlockData {
  return {
    title: "Landing Page Layout",
    viewport: "Desktop 1440px",
    sections: [
      { label: "Nav", content: "Logo left, nav links center, CTA button right" },
      { label: "Hero", content: "Full-width hero with headline, subtext, and primary CTA. Background image or gradient." },
      { label: "Features", content: "3-column grid: icon + heading + description per feature card" },
      { label: "Testimonials", content: "Carousel or single pull-quote with avatar, name, and role" },
      { label: "CTA", content: "Centered heading + email capture form + trust badges" },
      { label: "Footer", content: "4-column: links, social icons, newsletter signup, copyright" },
    ],
  };
}

export function getDefaultPullQuote(): PullQuoteData {
  return {
    text: "Working with this team transformed our brand. The attention to detail and strategic thinking exceeded every expectation.",
    author: "Sarah Chen",
    role: "Founder, Meridian Studio",
    avatarLetter: "S",
    avatarColor: "#5b7fa4",
    rating: 5,
  };
}

// ══════════════════════════════════════
// 1. TIMELINE BLOCK
// ══════════════════════════════════════

export function TimelineBlock({ data, onChange }: { data: TimelineBlockData; onChange: (d: TimelineBlockData) => void }) {
  const toggleItem = (phaseIdx: number, itemIdx: number) => {
    const phases = data.phases.map((p, pi) => {
      if (pi !== phaseIdx) return p;
      const items = [...p.items];
      // Toggle by prefixing/removing "[x] "
      if (items[itemIdx].startsWith("[x] ")) {
        items[itemIdx] = items[itemIdx].slice(4);
      } else {
        items[itemIdx] = "[x] " + items[itemIdx];
      }
      return { ...p, items };
    });
    onChange({ ...data, phases });
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <div className={styles.timelineIcon}>&#x23F1;</div>
        <span className={styles.timelineLabel}>Timeline</span>
        <span className={styles.blockMeta}>{data.phases.length} phases</span>
      </div>
      <div className={styles.timelineBody}>
        <div className={styles.timelinePhases}>
          {data.phases.map((phase, pi) => {
            const dotClass = phase.status === "done"
              ? styles.timelineDotDone
              : phase.status === "current"
                ? styles.timelineDotCurrent
                : styles.timelineDotUpcoming;
            const phaseClass = phase.status === "upcoming" ? styles.timelinePhaseUpcoming : "";
            return (
              <div key={pi} className={`${styles.timelinePhase} ${phaseClass}`}>
                <div className={`${styles.timelineDot} ${dotClass}`}>
                  {phase.status === "done" && "✓"}
                </div>
                <div className={styles.timelineLine} />
                <span className={styles.timelinePhaseLabel}>{phase.label}</span>
                <span className={styles.timelinePhaseDate}>{phase.date}</span>
                <ul className={styles.timelineItems}>
                  {phase.items.map((item, ii) => {
                    const isDone = item.startsWith("[x] ");
                    const text = isDone ? item.slice(4) : item;
                    return (
                      <li key={ii} className={styles.timelineItem} onClick={() => toggleItem(pi, ii)}>
                        <span className={`${styles.timelineItemCheck} ${isDone ? styles.timelineItemCheckDone : ""}`}>
                          {isDone && "✓"}
                        </span>
                        <span className={`${styles.timelineItemText} ${isDone ? styles.timelineItemTextDone : ""}`}>{text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 2. FLOW BLOCK
// ══════════════════════════════════════

export function FlowBlock({ data, onChange }: { data: FlowBlockData; onChange: (d: FlowBlockData) => void }) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const activeDetail = data.nodes.find(n => n.id === activeNode);

  return (
    <div className={styles.flow}>
      <div className={styles.flowHeader}>
        <div className={styles.flowIcon}>&#x25CE;</div>
        <span className={styles.flowLabel}>Process Flow</span>
        <span className={styles.blockMeta}>{data.nodes.length} steps</span>
      </div>
      <div className={styles.flowBody}>
        <div className={styles.flowTrack}>
          <div className={styles.flowConnector} />
          {data.nodes.map((node) => (
            <div
              key={node.id}
              className={`${styles.flowNode} ${activeNode === node.id ? styles.flowNodeActive : ""}`}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
            >
              <div className={styles.flowNodeIcon} style={{ background: node.color }}>
                {node.icon}
              </div>
              <span className={styles.flowNodeLabel}>{node.label}</span>
              <span className={styles.flowNodeSub}>{node.sub}</span>
            </div>
          ))}
        </div>
        {activeDetail && (
          <div className={styles.flowDetail}>
            <div className={styles.flowDetailLabel}>{activeDetail.label} Details</div>
            {activeDetail.desc}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 3. BRAND BOARD BLOCK
// ══════════════════════════════════════

export function BrandBoardBlock({ data, onChange }: { data: BrandBoardData; onChange: (d: BrandBoardData) => void }) {
  return (
    <div className={styles.brand}>
      <div className={styles.brandHeader}>
        <div className={styles.brandIcon}>&#x2726;</div>
        <span className={styles.brandLabel}>Brand Board</span>
        <span className={styles.blockMeta}>{data.title}</span>
      </div>
      <div className={styles.brandBody}>
        {/* Logo area */}
        <div className={styles.brandLogo}>
          <div className={styles.brandLogoMark}>{data.logoLetter}</div>
          <div className={styles.brandLogoText}>
            <div className={styles.brandLogoName}>{data.logoName}</div>
            <div className={styles.brandLogoSub}>{data.logoSub}</div>
            <div className={styles.brandLogoVariants}>
              <div className={styles.brandLogoVariant} style={{ background: "#2c2a25", color: "#fff" }}>{data.logoLetter}</div>
              <div className={styles.brandLogoVariant} style={{ background: "#faf9f7", color: "#2c2a25", border: "1px solid #e8e3db" }}>{data.logoLetter}</div>
              <div className={styles.brandLogoVariant} style={{ background: "#b07d4f", color: "#fff" }}>{data.logoLetter}</div>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className={styles.brandColors}>
          <div className={styles.brandColorsLabel}>Color Palette</div>
          <div className={styles.brandColorRow}>
            {data.colors.map((c, i) => (
              <div key={i} className={styles.brandSwatch}>
                <div className={styles.brandSwatchColor} style={{ background: c.hex }} />
                <div className={styles.brandSwatchName}>{c.name}</div>
                <div className={styles.brandSwatchHex}>{c.hex}</div>
                <div className={styles.brandSwatchType}>{c.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className={styles.brandTypo}>
          <div className={styles.brandTypoLabel}>Typography</div>
          <div className={styles.brandTypoRow}>
            {data.fonts.map((f, i) => (
              <div key={i} className={styles.brandTypoSample}>
                <span className={styles.brandTypoRole}>{f.role}</span>
                <span className={styles.brandTypoText} style={{ fontFamily: f.family, fontWeight: Number(f.weight) }}>
                  {f.family}
                </span>
                <span className={styles.brandTypoWeight}>{f.weight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className={styles.brandKeywords}>
          {data.keywords.map((kw, i) => (
            <span key={i} className={styles.brandKeyword}>{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 4. MOOD BOARD BLOCK
// ══════════════════════════════════════

export function MoodBoardBlock({ data, onChange }: { data: MoodBoardData; onChange: (d: MoodBoardData) => void }) {
  return (
    <div className={styles.mood}>
      <div className={styles.moodHeader}>
        <div className={styles.moodIcon}>&#x25C7;</div>
        <span className={styles.moodLabel}>Mood Board</span>
        <span className={styles.blockMeta}>{data.cells.length} cells</span>
      </div>
      <div className={styles.moodBody}>
        <div className={styles.moodGrid}>
          {data.cells.map((cell, i) => (
            <div
              key={i}
              className={`${styles.moodCell} ${cell.span === "large" ? styles.moodCellLarge : ""} ${cell.span === "wide" ? styles.moodCellWide : ""}`}
              style={{ background: cell.color, color: cell.lightText ? "#fff" : "#2c2a25" }}
            >
              <span className={styles.moodCellIcon}>{cell.icon}</span>
              <span className={styles.moodCellLabel}>{cell.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.moodKeywords}>
          {data.keywords.map((kw, i) => (
            <span key={i} className={styles.moodKeyword}>{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 5. WIREFRAME BLOCK
// ══════════════════════════════════════

export function WireframeBlock({ data, onChange }: { data: WireframeBlockData; onChange: (d: WireframeBlockData) => void }) {
  return (
    <div className={styles.wire}>
      <div className={styles.wireHeader}>
        <div className={styles.wireIcon}>&#x2610;</div>
        <span className={styles.wireLabel}>Wireframe</span>
        <span className={styles.blockMeta}>{data.title}</span>
      </div>
      <div className={styles.wireBody}>
        <div className={styles.wireCanvas}>
          {data.sections.map((sec, i) => (
            <div key={i} className={styles.wireSection}>
              <span className={styles.wireSectionLabel}>{sec.label}</span>
              <div className={styles.wireSectionContent}>{sec.content}</div>
            </div>
          ))}
        </div>
        <div className={styles.wireFooter}>
          <span className={styles.wireHint}>Dashed borders = layout zones</span>
          <span className={styles.wireViewport}>{data.viewport}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 6. PULL QUOTE BLOCK
// ══════════════════════════════════════

export function PullQuoteBlock({ data, onChange }: { data: PullQuoteData; onChange: (d: PullQuoteData) => void }) {
  return (
    <div className={styles.pq}>
      <div className={styles.pqHeader}>
        <div className={styles.pqIcon}>&#x275D;</div>
        <span className={styles.pqLabel}>Pull Quote</span>
      </div>
      <div className={styles.pqBody}>
        <div className={styles.pqQuoteMark}>&ldquo;</div>
        <div className={styles.pqText}>{data.text}</div>
        <div className={styles.pqAttribution}>
          <div className={styles.pqAvatar} style={{ background: data.avatarColor }}>
            {data.avatarLetter}
          </div>
          <div>
            <div className={styles.pqAuthor}>{data.author}</div>
            <div className={styles.pqRole}>{data.role}</div>
          </div>
          <div className={styles.pqStars}>
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} className={`${styles.pqStar} ${star <= data.rating ? styles.pqStarFilled : ""}`}>
                &#x2605;
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
