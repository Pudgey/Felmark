import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — SHOWCASE BENTO GRID
   Stories from freelancers who left their mark.
   ═══════════════════════════════════════════ */

export default function ShowcaseBento() {
  const [hovered, setHovered] = useState(null);

  const cards = [
    {
      id: "alex", size: "wide-tall",
      bg: "linear-gradient(135deg, #2c2a25 0%, #3d3a33 50%, #4f4c44 100%)",
      pattern: "forge",
      tag: "Brand Designer",
      name: "Alex Mercer Design",
      stat: "$142k",
      statLabel: "processed through Felmark in 8 months",
      quote: "I replaced HoneyBook, Asana, and three Notion databases with one Workspace. My clients think I hired an assistant.",
      accent: "#b07d4f",
      textColor: "#ece8e2",
    },
    {
      id: "priya", size: "normal",
      bg: "linear-gradient(160deg, #f5f7f4 0%, #eef2ec 100%)",
      pattern: "dots",
      tag: "UX Consultant",
      name: "Priya Sharma",
      stat: "34 clients",
      statLabel: "managed from one screen",
      quote: "Space Blocks let me build a retainer dashboard that no other tool could do without code.",
      accent: "#5f8c5a",
      textColor: "#2a3328",
    },
    {
      id: "jake", size: "normal",
      bg: "linear-gradient(145deg, #1a1918 0%, #2f2d2b 100%)",
      pattern: "grid",
      tag: "Photographer",
      name: "Jake Torres Photo",
      stat: "3× faster",
      statLabel: "client onboarding vs manual workflow",
      quote: "Shot lists, album delivery, invoicing — all in the Workspace. I focus on shooting, not spreadsheets.",
      accent: "#e85d3a",
      textColor: "#ece8e2",
    },
    {
      id: "luna", size: "tall",
      bg: "linear-gradient(170deg, #f9f8fc 0%, #eae7f2 100%)",
      pattern: "waves",
      tag: "Copywriter",
      name: "Luna Voss Writing",
      stat: "$108/hr",
      statLabel: "effective rate tracked in real-time",
      quote: "The AI Whisper caught me undercharging Bolt Fitness. One nudge saved me $2,400 over three months. Forge Paper is where every proposal starts now.",
      accent: "#8b5cf6",
      textColor: "#24213a",
    },
    {
      id: "metric1", size: "stat",
      bg: "linear-gradient(135deg, #b07d4f 0%, #c89360 100%)",
      pattern: "none",
      value: "2.9%",
      label: "That's it. Free forever.\nWe only earn when you get paid.",
      textColor: "#fff",
    },
    {
      id: "omar", size: "wide",
      bg: "linear-gradient(150deg, #f9f3e8 0%, #ede4cc 100%)",
      pattern: "sand",
      tag: "Web Developer",
      name: "Omar Freelance Dev",
      stat: "Sprint boards",
      statLabel: "built with Space Blocks — no templates needed",
      quote: "I tried ClickUp, Linear, Notion. None of them understood freelance dev. I built my own project tracker with Space Blocks in 10 minutes.",
      accent: "#c48a2a",
      textColor: "#3b3122",
    },
    {
      id: "metric2", size: "stat",
      bg: "linear-gradient(135deg, #2c2a25 0%, #3d3a33 100%)",
      pattern: "none",
      value: "73M",
      label: "freelancers in the US alone.\nBuilt for every one of them.",
      textColor: "#ece8e2",
      accent: "#b07d4f",
    },
    {
      id: "sarah", size: "normal",
      bg: "linear-gradient(155deg, #0f1219 0%, #1a2332 100%)",
      pattern: "circuit",
      tag: "Marketing Strategist",
      name: "Sarah & Co Strategy",
      stat: "Zero missed",
      statLabel: "invoice due dates since switching",
      quote: "Automations send my milestone updates and chase overdue payments. I haven't manually followed up in four months.",
      accent: "#4a9eff",
      textColor: "#e8ecf4",
    },
    {
      id: "mei", size: "normal-tall",
      bg: "linear-gradient(160deg, #faf6f3 0%, #ede3da 100%)",
      pattern: "terracotta",
      tag: "Event Planner",
      name: "Mei Lin Events",
      stat: "12 weddings",
      statLabel: "managed simultaneously last season",
      quote: "Each client has their own workspace. Vendor lists, timelines, budgets, shot lists — everything in one place. My couples see a beautiful client portal, I see the chaos managed.",
      accent: "#c47a5a",
      textColor: "#33261e",
    },
    {
      id: "metric3", size: "stat-wide",
      bg: "#fff",
      pattern: "none",
      isTestimonial: true,
      quote: "Felmark is what happens when someone builds the tool freelancers actually need instead of the tool VCs want to fund.",
      author: "Independent Tech Review",
      textColor: "#2c2a25",
    },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.bento-page{background:#edebe6;min-height:100vh;padding:60px 24px 80px;font-family:'Outfit',sans-serif}
.bento-inner{max-width:1080px;margin:0 auto}

/* Header */
.bento-hd{text-align:center;margin-bottom:48px}
.bento-hd-eyebrow{font-family:var(--mono);font-size:11px;color:var(--ember);text-transform:uppercase;letter-spacing:.15em;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:10px}
.bento-hd-eyebrow::before,.bento-hd-eyebrow::after{content:'';width:40px;height:1px;background:var(--warm-300)}
.bento-hd-title{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:600;color:var(--ink-900);line-height:1.05;margin-bottom:12px;letter-spacing:-.02em}
.bento-hd-title em{font-style:italic;color:var(--ember)}
.bento-hd-sub{font-size:17px;color:var(--ink-400);max-width:520px;margin:0 auto;line-height:1.6}

/* Grid */
.bento-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:10px;grid-auto-rows:minmax(80px,auto)}

/* Card base */
.bc{border-radius:16px;overflow:hidden;position:relative;cursor:pointer;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s ease}
.bc:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.08)}

/* Card sizes */
.bc.wide-tall{grid-column:span 7;grid-row:span 3}
.bc.normal{grid-column:span 5;grid-row:span 2}
.bc.tall{grid-column:span 4;grid-row:span 4}
.bc.wide{grid-column:span 8;grid-row:span 2}
.bc.stat{grid-column:span 4;grid-row:span 2}
.bc.normal-tall{grid-column:span 4;grid-row:span 3}
.bc.stat-wide{grid-column:span 8;grid-row:span 2}

/* Inner layout */
.bc-inner{position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:28px 32px;z-index:2}

/* Patterns */
.bc-pattern{position:absolute;inset:0;z-index:1;opacity:.12;pointer-events:none}

/* Forge pattern: crossed hammer grid */
.bc-pattern.forge{background-image:
  repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(176,125,79,.15) 39px,rgba(176,125,79,.15) 40px),
  repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(176,125,79,.15) 39px,rgba(176,125,79,.15) 40px);
}
.bc-pattern.dots{background-image:radial-gradient(circle,rgba(95,140,90,.2) 1px,transparent 1px);background-size:16px 16px}
.bc-pattern.grid{background-image:
  linear-gradient(rgba(232,93,58,.08) 1px,transparent 1px),
  linear-gradient(90deg,rgba(232,93,58,.08) 1px,transparent 1px);
  background-size:24px 24px}
.bc-pattern.waves{background-image:repeating-linear-gradient(120deg,rgba(139,92,246,.04) 0px,rgba(139,92,246,.04) 2px,transparent 2px,transparent 12px)}
.bc-pattern.sand{background-image:
  radial-gradient(circle at 20% 80%,rgba(196,138,42,.06) 0%,transparent 50%),
  radial-gradient(circle at 80% 20%,rgba(196,138,42,.06) 0%,transparent 50%);
}
.bc-pattern.circuit{background-image:
  linear-gradient(0deg,rgba(74,158,255,.06) 1px,transparent 1px),
  linear-gradient(90deg,rgba(74,158,255,.06) 1px,transparent 1px);
  background-size:32px 32px}
.bc-pattern.terracotta{background-image:radial-gradient(circle,rgba(196,122,90,.06) 1.5px,transparent 1.5px);background-size:20px 20px}

/* Gradient overlay for depth */
.bc-gradient{position:absolute;inset:0;z-index:1;pointer-events:none}

/* Tag */
.bc-tag{font-family:var(--mono);font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;padding:4px 10px;border-radius:4px;display:inline-flex;align-items:center;gap:5px;margin-bottom:12px;width:fit-content;backdrop-filter:blur(4px)}

/* Name */
.bc-name{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;line-height:1.15;margin-bottom:8px}

/* Stat */
.bc-stat{margin-bottom:10px}
.bc-stat-val{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700;line-height:1}
.bc-stat-label{font-family:var(--mono);font-size:10px;opacity:.5;margin-top:2px;line-height:1.4}

/* Quote */
.bc-quote{font-size:14px;line-height:1.65;opacity:.75;max-width:400px}
.bc-quote.large{font-family:'Cormorant Garamond',serif;font-size:28px;font-style:italic;line-height:1.35;opacity:1;max-width:600px}

/* Stat cards */
.bc-stat-card{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center}
.bc-stat-card-val{font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:700;line-height:.9}
.bc-stat-card-label{font-size:14px;margin-top:10px;opacity:.6;line-height:1.5;white-space:pre-line}

/* Testimonial */
.bc-testimonial{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 48px;text-align:center}
.bc-testimonial-mark{font-family:'Cormorant Garamond',serif;font-size:64px;line-height:.5;color:var(--ember);opacity:.15;margin-bottom:16px}
.bc-testimonial-text{font-family:'Cormorant Garamond',serif;font-size:24px;font-style:italic;line-height:1.4;max-width:560px;margin-bottom:12px}
.bc-testimonial-author{font-family:var(--mono);font-size:11px;color:var(--ink-400)}

/* Hover decorative line */
.bc-accent-line{position:absolute;bottom:0;left:0;width:0;height:3px;z-index:3;transition:width .4s cubic-bezier(.16,1,.3,1)}
.bc:hover .bc-accent-line{width:100%}

/* Shimmer on hover */
.bc-shimmer{position:absolute;inset:0;z-index:2;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.03) 50%,transparent 70%);opacity:0;transition:opacity .3s;pointer-events:none}
.bc:hover .bc-shimmer{opacity:1;animation:shimmer 1.5s ease infinite}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

/* Decorative corner marks */
.bc-corner{position:absolute;width:20px;height:20px;z-index:3;opacity:0;transition:opacity .2s}
.bc:hover .bc-corner{opacity:.2}
.bc-corner.tl{top:16px;left:16px;border-top:1.5px solid;border-left:1.5px solid}
.bc-corner.br{bottom:16px;right:16px;border-bottom:1.5px solid;border-right:1.5px solid}

/* CTA row */
.bento-cta{margin-top:40px;text-align:center}
.bento-cta-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border-radius:10px;border:none;background:var(--ink-900);color:#fff;font-family:'Outfit',sans-serif;font-size:15px;font-weight:500;cursor:pointer;transition:all .15s;letter-spacing:.01em}
.bento-cta-btn:hover{background:var(--ink-800);transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,0.12)}
.bento-cta-btn span{font-family:var(--mono);font-size:11px;opacity:.4}
.bento-cta-sub{font-family:var(--mono);font-size:11px;color:var(--ink-300);margin-top:10px}
      `}</style>

      <div className="bento-page">
        <div className="bento-inner">

          {/* Header */}
          <div className="bento-hd">
            <div className="bento-hd-eyebrow">Leave your mark</div>
            <div className="bento-hd-title">Freelancers who chose<br /><em>the Forge</em></div>
            <div className="bento-hd-sub">One Workspace. Every industry. These are the people building their businesses with Felmark.</div>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            {cards.map(card => {
              const isHov = hovered === card.id;

              // Stat cards
              if (card.size === "stat" || card.size === "stat-wide") {
                if (card.isTestimonial) {
                  return (
                    <div key={card.id} className={`bc ${card.size}`}
                      style={{ background: card.bg, border: "1px solid var(--warm-200)" }}
                      onMouseEnter={() => setHovered(card.id)}
                      onMouseLeave={() => setHovered(null)}>
                      <div className="bc-testimonial">
                        <div className="bc-testimonial-mark">❝</div>
                        <div className="bc-testimonial-text" style={{ color: card.textColor }}>{card.quote}</div>
                        <div className="bc-testimonial-author">{card.author}</div>
                      </div>
                      <div className="bc-accent-line" style={{ background: "var(--ember)" }} />
                      <div className="bc-corner tl" style={{ borderColor: "var(--ember)" }} />
                      <div className="bc-corner br" style={{ borderColor: "var(--ember)" }} />
                    </div>
                  );
                }
                return (
                  <div key={card.id} className={`bc ${card.size}`}
                    style={{ background: card.bg }}
                    onMouseEnter={() => setHovered(card.id)}
                    onMouseLeave={() => setHovered(null)}>
                    <div className="bc-stat-card" style={{ color: card.textColor }}>
                      <div className="bc-stat-card-val" style={{ color: card.accent || card.textColor }}>{card.value}</div>
                      <div className="bc-stat-card-label">{card.label}</div>
                    </div>
                    <div className="bc-accent-line" style={{ background: card.accent || "var(--ember)" }} />
                    <div className="bc-shimmer" />
                  </div>
                );
              }

              // Content cards
              return (
                <div key={card.id} className={`bc ${card.size}`}
                  style={{ background: card.bg }}
                  onMouseEnter={() => setHovered(card.id)}
                  onMouseLeave={() => setHovered(null)}>

                  {/* Pattern overlay */}
                  {card.pattern !== "none" && <div className={`bc-pattern ${card.pattern}`} />}

                  {/* Gradient overlay for bottom readability */}
                  <div className="bc-gradient" style={{
                    background: card.textColor === "#ece8e2" || card.textColor === "#e8ecf4"
                      ? `linear-gradient(to top, ${card.bg.includes("#2c2a25") ? "rgba(44,42,37,.7)" : card.bg.includes("#1a1918") ? "rgba(26,25,24,.7)" : card.bg.includes("#0f1219") ? "rgba(15,18,25,.7)" : "rgba(0,0,0,.3)"} 0%, transparent 60%)`
                      : `linear-gradient(to top, ${card.bg.includes("#f5f7f4") ? "rgba(245,247,244,.6)" : card.bg.includes("#f9f8fc") ? "rgba(249,248,252,.6)" : card.bg.includes("#f9f3e8") ? "rgba(249,243,232,.5)" : card.bg.includes("#faf6f3") ? "rgba(250,246,243,.5)" : "rgba(255,255,255,.3)"} 0%, transparent 50%)`
                  }} />

                  {/* Content */}
                  <div className="bc-inner" style={{ color: card.textColor }}>
                    {/* Tag */}
                    <div className="bc-tag" style={{
                      color: card.accent,
                      background: card.accent + "12",
                      border: `1px solid ${card.accent}20`,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: card.accent, display: "inline-block" }} />
                      {card.tag}
                    </div>

                    {/* Name */}
                    <div className="bc-name">{card.name}</div>

                    {/* Stat */}
                    <div className="bc-stat">
                      <div className="bc-stat-val" style={{ color: card.accent }}>{card.stat}</div>
                      <div className="bc-stat-label">{card.statLabel}</div>
                    </div>

                    {/* Quote */}
                    <div className="bc-quote">{card.quote}</div>
                  </div>

                  {/* Hover effects */}
                  <div className="bc-accent-line" style={{ background: card.accent }} />
                  <div className="bc-shimmer" />
                  <div className="bc-corner tl" style={{ borderColor: card.accent }} />
                  <div className="bc-corner br" style={{ borderColor: card.accent }} />
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="bento-cta">
            <button className="bento-cta-btn">
              Start building your Workspace
              <span>Free forever →</span>
            </button>
            <div className="bento-cta-sub">No credit card · 2.9% on payments only · Cancel never</div>
          </div>

        </div>
      </div>
    </>
  );
}
