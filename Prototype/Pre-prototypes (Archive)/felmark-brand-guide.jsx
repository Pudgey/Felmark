import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK BRAND GUIDE
   5 themes. 1 system. Every token defined.
   ═══════════════════════════════════════════ */

const THEMES = {
  ember: {
    name: "Ember",
    desc: "The original. Warm parchment, ink darks, golden ember accents. Craftsman energy.",
    inspiration: "Game of Thrones stone halls, aged paper, forge fire",
    parchment: "#faf9f7", warm50: "#f7f6f3", warm100: "#f0eee9", warm200: "#e5e2db", warm300: "#d5d1c8", warm400: "#b8b3a8",
    ink900: "#2c2a25", ink800: "#3d3a33", ink700: "#4f4c44", ink600: "#65625a", ink500: "#7d7a72", ink400: "#9b988f", ink300: "#b5b2a9",
    accent: "#b07d4f", accentLight: "#c89360", accentBg: "rgba(176,125,79,0.08)",
    success: "#5a9a3c", error: "#c24b38", info: "#5b7fa4", warning: "#d4a34a",
  },
  midnight: {
    name: "Midnight",
    desc: "Deep navy base, silver text, electric blue accents. For night owls and focus sessions.",
    inspiration: "Bloomberg Terminal, deep ocean, starlight on steel",
    parchment: "#0f1219", warm50: "#151b27", warm100: "#1a2332", warm200: "#243044", warm300: "#2e3d56", warm400: "#3d5170",
    ink900: "#e8ecf4", ink800: "#c8d1e0", ink700: "#a8b5cc", ink600: "#8899b3", ink500: "#6b7d99", ink400: "#4f6180", ink300: "#3d5170",
    accent: "#4a9eff", accentLight: "#6db3ff", accentBg: "rgba(74,158,255,0.08)",
    success: "#34d399", error: "#f87171", info: "#60a5fa", warning: "#fbbf24",
  },
  sage: {
    name: "Sage",
    desc: "Muted green-grey tones, forest accents. Calm, grounded, organic.",
    inspiration: "Japanese garden, morning fog, matcha ceramics",
    parchment: "#f5f7f4", warm50: "#eef2ec", warm100: "#e3e9df", warm200: "#d4ddd0", warm300: "#c0ccba", warm400: "#a3b39b",
    ink900: "#2a3328", ink800: "#3a4637", ink700: "#4a5946", ink600: "#5d6e59", ink500: "#738570", ink400: "#8f9e8b", ink300: "#a8b5a3",
    accent: "#5f8c5a", accentLight: "#72a36c", accentBg: "rgba(95,140,90,0.08)",
    success: "#3d9a6d", error: "#c0534f", info: "#5e89a8", warning: "#c9a84e",
  },
  clay: {
    name: "Clay",
    desc: "Terra cotta warmth, dusty rose accents. Earthy, physical, handmade.",
    inspiration: "Southwest pottery, desert sunset, adobe walls",
    parchment: "#faf6f3", warm50: "#f5ede7", warm100: "#ede3da", warm200: "#e0d2c6", warm300: "#d1bfb0", warm400: "#bda899",
    ink900: "#33261e", ink800: "#4a382d", ink700: "#5e493d", ink600: "#755d4f", ink500: "#8d7465", ink400: "#a68d7e", ink300: "#bba69a",
    accent: "#c47a5a", accentLight: "#d4906e", accentBg: "rgba(196,122,90,0.08)",
    success: "#6a9a5c", error: "#c25050", info: "#6889a4", warning: "#c9a050",
  },
  frost: {
    name: "Frost",
    desc: "Cool whites, slate greys, violet-blue accents. Crisp, technical, modern.",
    inspiration: "Scandinavian winter, frosted glass, aurora borealis",
    parchment: "#f8f9fc", warm50: "#f0f2f7", warm100: "#e6e9f0", warm200: "#d5dae6", warm300: "#c0c8d8", warm400: "#a3aec4",
    ink900: "#1e2433", ink800: "#2d3548", ink700: "#3f4a5e", ink600: "#556075", ink500: "#6d788e", ink400: "#8892a6", ink300: "#a3abbb",
    accent: "#7c6aef", accentLight: "#9384f5", accentBg: "rgba(124,106,239,0.08)",
    success: "#36b37e", error: "#e5484d", info: "#5b8def", warning: "#e5a336",
  },
};

function Swatch({ color, label, mono }) {
  return (
    <div className="bg-swatch">
      <div className="bg-swatch-color" style={{ background: color }} />
      <div className="bg-swatch-info">
        <span className="bg-swatch-label">{label}</span>
        <span className="bg-swatch-hex">{color}</span>
      </div>
    </div>
  );
}

function MiniCard({ t }) {
  return (
    <div className="bg-mini" style={{ background: t.parchment, borderColor: t.warm200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${t.warm200}` }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: t.ink900, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, fontSize: 12, fontWeight: 600 }}>◆</div>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: t.ink900, lineHeight: 1.1 }}>Dashboard</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: t.ink400 }}>@felmark/forge</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[
          { v: "$14.8k", c: t.success },
          { v: "$112/hr", c: t.accent },
          { v: "32h", c: t.info },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "6px 5px", background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 5, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: s.c, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 6, color: t.ink400, marginTop: 2 }}>METRIC</div>
          </div>
        ))}
      </div>

      {/* Activity rows */}
      {[
        { dot: t.success, text: "Payment received", sub: "$1,800" },
        { dot: t.info, text: "Invoice viewed", sub: "Meridian" },
        { dot: t.accent, text: "Proposal sent", sub: "$6,500" },
      ].map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", borderBottom: i < 2 ? `1px solid ${t.warm100}` : "none" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: t.ink700, flex: 1 }}>{a.text}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: t.ink400 }}>{a.sub}</span>
        </div>
      ))}

      {/* Button */}
      <div style={{ marginTop: 8, padding: "5px 8px", background: t.accent, color: "#fff", borderRadius: 5, fontSize: 9, fontWeight: 500, textAlign: "center" }}>
        Send to Client →
      </div>
    </div>
  );
}

export default function BrandGuide() {
  const [activeTheme, setActiveTheme] = useState("ember");
  const t = THEMES[activeTheme];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--mono:'JetBrains Mono',monospace}

.bg{font-family:'Outfit',sans-serif;min-height:100vh;transition:background .4s,color .4s}
.bg-in{max-width:880px;margin:0 auto;padding:40px 24px 80px}

/* Hero */
.bg-hero{margin-bottom:40px}
.bg-hero-eyebrow{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;transition:color .3s}
.bg-hero-title{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:700;line-height:1.1;margin-bottom:6px;transition:color .3s}
.bg-hero-sub{font-size:16px;line-height:1.6;max-width:540px;transition:color .3s}

/* Section */
.bg-sec{margin-bottom:40px}
.bg-sec-label{font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px;display:flex;align-items:center;gap:8px;transition:color .3s}
.bg-sec-label::after{content:'';flex:1;height:1px;transition:background .3s}

/* Theme selector */
.bg-themes{display:flex;gap:6px;margin-bottom:24px}
.bg-theme-btn{padding:10px 16px;border-radius:8px;border:2px solid transparent;cursor:pointer;transition:all .15s;text-align:left;min-width:120px;position:relative;overflow:hidden}
.bg-theme-btn:hover{transform:translateY(-1px)}
.bg-theme-btn.on{border-width:2px}
.bg-theme-accent{position:absolute;top:0;left:0;right:0;height:3px}
.bg-theme-name{font-size:14px;font-weight:600;margin-bottom:1px}
.bg-theme-desc{font-size:10px;opacity:.6;line-height:1.3}

/* Swatch grid */
.bg-swatches{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:16px}
.bg-swatch{border-radius:6px;overflow:hidden;transition:border-color .3s}
.bg-swatch-color{height:40px}
.bg-swatch-info{padding:5px 6px}
.bg-swatch-label{font-size:10px;display:block;transition:color .3s}
.bg-swatch-hex{font-family:var(--mono);font-size:9px;display:block;transition:color .3s}

/* Accent group */
.bg-accents{display:flex;gap:6px;margin-bottom:16px}
.bg-accent-card{flex:1;border-radius:8px;padding:12px;text-align:center;transition:all .3s}
.bg-accent-dot{width:28px;height:28px;border-radius:50%;margin:0 auto 6px;transition:background .3s}
.bg-accent-name{font-size:11px;font-weight:500;transition:color .3s}
.bg-accent-hex{font-family:var(--mono);font-size:9px;transition:color .3s}

/* Typography */
.bg-type-sample{margin-bottom:14px;padding:16px;border-radius:8px;transition:all .3s}
.bg-type-label{font-family:var(--mono);font-size:9px;margin-bottom:4px;transition:color .3s}
.bg-type-text{transition:color .3s}

/* Component preview */
.bg-previews{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.bg-mini{border:1px solid;border-radius:10px;padding:12px;transition:all .4s;font-family:'Outfit',sans-serif}

/* Token table */
.bg-tokens{width:100%;border-collapse:collapse;font-size:12px}
.bg-tokens th{text-align:left;font-family:var(--mono);font-size:9px;text-transform:uppercase;letter-spacing:.04em;padding:8px 0;transition:color .3s}
.bg-tokens td{padding:6px 0;transition:color .3s;vertical-align:middle}
.bg-tokens tr{transition:border-color .3s}
.bg-token-swatch{width:16px;height:16px;border-radius:3px;display:inline-block;vertical-align:middle;margin-right:6px;border:1px solid rgba(0,0,0,0.06)}
.bg-token-var{font-family:var(--mono);font-size:11px}
.bg-token-use{font-size:11px;opacity:.6}

/* Spacing */
.bg-space-row{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.bg-space-bar{height:8px;border-radius:2px;transition:background .3s}
.bg-space-label{font-family:var(--mono);font-size:10px;width:40px;flex-shrink:0;transition:color .3s}
.bg-space-val{font-family:var(--mono);font-size:10px;width:40px;text-align:right;flex-shrink:0;transition:color .3s}

/* Logo */
.bg-logos{display:flex;gap:12px}
.bg-logo-card{flex:1;padding:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .3s}
.bg-logo-mark{font-size:24px;transition:color .3s}
.bg-logo-text{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;transition:color .3s}
      `}</style>

      <div className="bg" style={{ background: t.parchment, color: t.ink700 }}>
        <div className="bg-in">

          {/* ═══ HERO ═══ */}
          <div className="bg-hero">
            <div className="bg-hero-eyebrow" style={{ color: t.accent }}>Brand Guide · v1.0</div>
            <div className="bg-hero-title" style={{ color: t.ink900 }}>Felmark Design System</div>
            <div className="bg-hero-sub" style={{ color: t.ink500 }}>
              Five complete themes. One system. Every background, border, text, and accent token defined.
              Switch themes and the entire product transforms.
            </div>
          </div>

          {/* ═══ THEME SELECTOR ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400, borderColor: t.warm200 }}>
              Themes
              <span style={{ flex: "none" }}></span>
            </div>
            <div className="bg-sec-label" style={{ color: t.ink400 }}>::after pseudo not available, using border below</div>

            <div className="bg-themes">
              {Object.entries(THEMES).map(([id, theme]) => (
                <div key={id}
                  className={`bg-theme-btn${activeTheme === id ? " on" : ""}`}
                  style={{
                    background: theme.warm50,
                    borderColor: activeTheme === id ? theme.accent : theme.warm200,
                  }}
                  onClick={() => setActiveTheme(id)}>
                  <div className="bg-theme-accent" style={{ background: theme.accent }} />
                  <div className="bg-theme-name" style={{ color: theme.ink900 }}>{theme.name}</div>
                  <div className="bg-theme-desc" style={{ color: theme.ink500 }}>{theme.desc.split(".")[0]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ INSPIRATION ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Inspiration</div>
            <div style={{ fontSize: 15, color: t.ink600, fontStyle: "italic", lineHeight: 1.6 }}>"{t.inspiration}"</div>
          </div>

          {/* ═══ PALETTE — Neutrals ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Neutral Palette</div>
            <div className="bg-swatches">
              <Swatch color={t.parchment} label="Parchment" />
              <Swatch color={t.warm50} label="Warm 50" />
              <Swatch color={t.warm100} label="Warm 100" />
              <Swatch color={t.warm200} label="Warm 200" />
              <Swatch color={t.warm300} label="Warm 300" />
              <Swatch color={t.warm400} label="Warm 400" />
              <div />
            </div>
            <div className="bg-swatches">
              <Swatch color={t.ink900} label="Ink 900" />
              <Swatch color={t.ink800} label="Ink 800" />
              <Swatch color={t.ink700} label="Ink 700" />
              <Swatch color={t.ink600} label="Ink 600" />
              <Swatch color={t.ink500} label="Ink 500" />
              <Swatch color={t.ink400} label="Ink 400" />
              <Swatch color={t.ink300} label="Ink 300" />
            </div>
          </div>

          {/* ═══ PALETTE — Semantic ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Semantic Colors</div>
            <div className="bg-accents">
              {[
                { name: "Accent", color: t.accent },
                { name: "Accent Light", color: t.accentLight },
                { name: "Success", color: t.success },
                { name: "Error", color: t.error },
                { name: "Info", color: t.info },
                { name: "Warning", color: t.warning },
              ].map((c, i) => (
                <div key={i} className="bg-accent-card" style={{ background: t.warm50, border: `1px solid ${t.warm200}` }}>
                  <div className="bg-accent-dot" style={{ background: c.color }} />
                  <div className="bg-accent-name" style={{ color: t.ink700 }}>{c.name}</div>
                  <div className="bg-accent-hex" style={{ color: t.ink400 }}>{c.color}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ TYPOGRAPHY ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Typography</div>

            <div className="bg-type-sample" style={{ background: t.warm50, border: `1px solid ${t.warm200}` }}>
              <div className="bg-type-label" style={{ color: t.ink400 }}>Headings — Cormorant Garamond</div>
              <div className="bg-type-text" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: t.ink900, lineHeight: 1.15 }}>
                The Forge shapes everything.
              </div>
            </div>

            <div className="bg-type-sample" style={{ background: t.warm50, border: `1px solid ${t.warm200}` }}>
              <div className="bg-type-label" style={{ color: t.ink400 }}>Body — Outfit 400</div>
              <div className="bg-type-text" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: t.ink700, lineHeight: 1.7 }}>
                Felmark is a freelancer workspace built for the 99.8% who won't pay $39/month. Free forever. Monetized on payments. Every proposal, invoice, and contract runs through The Forge.
              </div>
            </div>

            <div className="bg-type-sample" style={{ background: t.warm50, border: `1px solid ${t.warm200}` }}>
              <div className="bg-type-label" style={{ color: t.ink400 }}>Metadata — JetBrains Mono</div>
              <div className="bg-type-text" style={{ fontFamily: "var(--mono)", fontSize: 12, color: t.ink500, lineHeight: 1.6, letterSpacing: ".02em" }}>
                @felmark/forge · v1.0.0 · 8 services · 99.98% uptime · FM-2026-981
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[
                { weight: 300, label: "Light" },
                { weight: 400, label: "Regular" },
                { weight: 500, label: "Medium" },
                { weight: 600, label: "Semibold" },
              ].map((w, i) => (
                <div key={i} style={{ flex: 1, padding: 10, background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 6, textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: w.weight, color: t.ink900, marginBottom: 2 }}>Aa</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400 }}>{w.label} · {w.weight}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ LOGO ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Logo Usage</div>
            <div className="bg-logos">
              <div className="bg-logo-card" style={{ background: t.ink900 }}>
                <span className="bg-logo-mark" style={{ color: t.accent }}>◆</span>
                <span className="bg-logo-text" style={{ color: "#fff" }}>Felmark</span>
              </div>
              <div className="bg-logo-card" style={{ background: t.warm50, border: `1px solid ${t.warm200}` }}>
                <span className="bg-logo-mark" style={{ color: t.accent }}>◆</span>
                <span className="bg-logo-text" style={{ color: t.ink900 }}>Felmark</span>
              </div>
              <div className="bg-logo-card" style={{ background: t.accent }}>
                <span className="bg-logo-mark" style={{ color: "#fff" }}>◆</span>
                <span className="bg-logo-text" style={{ color: "#fff" }}>Felmark</span>
              </div>
            </div>
          </div>

          {/* ═══ SPACING ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Spacing Scale</div>
            {[
              { label: "4px", val: "0.25rem", w: 16 },
              { label: "8px", val: "0.5rem", w: 32 },
              { label: "12px", val: "0.75rem", w: 48 },
              { label: "16px", val: "1rem", w: 64 },
              { label: "24px", val: "1.5rem", w: 96 },
              { label: "32px", val: "2rem", w: 128 },
              { label: "48px", val: "3rem", w: 192 },
            ].map((s, i) => (
              <div key={i} className="bg-space-row">
                <span className="bg-space-label" style={{ color: t.ink500 }}>{s.label}</span>
                <div className="bg-space-bar" style={{ width: s.w, background: t.accent, opacity: 0.25 + (i * 0.1) }} />
                <span className="bg-space-val" style={{ color: t.ink400 }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* ═══ BORDER RADIUS ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Border Radius</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { r: 4, label: "sm · 4px" },
                { r: 6, label: "md · 6px" },
                { r: 8, label: "lg · 8px" },
                { r: 10, label: "xl · 10px" },
                { r: 14, label: "2xl · 14px" },
                { r: 999, label: "full" },
              ].map((b, i) => (
                <div key={i} style={{ width: 48, height: 48, borderRadius: b.r, background: t.accent, opacity: 0.15, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: t.ink500 }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ LIVE PREVIEW ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Live Preview — All 5 Themes</div>
            <div className="bg-previews">
              {Object.entries(THEMES).map(([id, theme]) => (
                <div key={id} style={{ position: "relative" }}>
                  {id === activeTheme && (
                    <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--mono)", fontSize: 8, color: t.accent, background: t.parchment, padding: "0 6px", zIndex: 1 }}>ACTIVE</div>
                  )}
                  <MiniCard t={theme} />
                  <div style={{ textAlign: "center", marginTop: 6, fontFamily: "var(--mono)", fontSize: 10, color: t.ink400 }}>{theme.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ CSS VARIABLES ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>CSS Variables — {t.name} Theme</div>
            <div style={{ background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 8, padding: 14, fontFamily: "var(--mono)", fontSize: 11, lineHeight: 2, color: t.ink600 }}>
              <div style={{ color: t.ink400, marginBottom: 4 }}>:root {"{"}</div>
              {[
                ["--parchment", t.parchment], ["--warm-50", t.warm50], ["--warm-100", t.warm100], ["--warm-200", t.warm200], ["--warm-300", t.warm300], ["--warm-400", t.warm400],
                ["--ink-900", t.ink900], ["--ink-800", t.ink800], ["--ink-700", t.ink700], ["--ink-600", t.ink600], ["--ink-500", t.ink500], ["--ink-400", t.ink400], ["--ink-300", t.ink300],
                ["--accent", t.accent], ["--accent-light", t.accentLight], ["--accent-bg", t.accentBg],
                ["--success", t.success], ["--error", t.error], ["--info", t.info], ["--warning", t.warning],
              ].map(([key, val], i) => (
                <div key={i} style={{ display: "flex", gap: 4, paddingLeft: 16 }}>
                  <span style={{ color: t.ink500 }}>{key}:</span>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: val, border: `1px solid ${t.warm200}`, verticalAlign: "middle" }} />
                  <span style={{ color: t.accent }}>{val}</span>
                  <span style={{ color: t.ink300 }}>;</span>
                </div>
              ))}
              <div style={{ color: t.ink400 }}>{"}"}</div>
            </div>
          </div>

          {/* ═══ USAGE GUIDELINES ═══ */}
          <div className="bg-sec">
            <div className="bg-sec-label" style={{ color: t.ink400 }}>Usage Rules</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { title: "Backgrounds", rules: "parchment for page base. warm-50 for card backgrounds and subtle fills. White (#fff) only for elevated cards on parchment. ink-900 exclusively for the Finance screen and Forge core node." },
                { title: "Text", rules: "ink-900 for headings. ink-700 for body text. ink-500 for secondary text. ink-400 for labels and metadata. ink-300 for placeholders and disabled. Never use pure black." },
                { title: "Borders", rules: "warm-200 for card borders and dividers. warm-100 for subtle internal separators. warm-300 on hover. accent on focus/active. Never use grey — always warm-tinted." },
                { title: "Accent", rules: "Primary CTAs and active states. Accent-bg for tinted backgrounds (8% opacity). Accent-light for hover. Never use accent for large background areas — it's for moments, not surfaces." },
              ].map((r, i) => (
                <div key={i} style={{ padding: 14, background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 8 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 500, color: t.ink800, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: t.ink500, lineHeight: 1.6 }}>{r.rules}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", paddingTop: 32, borderTop: `1px solid ${t.warm200}`, fontFamily: "var(--mono)", fontSize: 10, color: t.ink300 }}>
            Felmark Brand Guide · v1.0 · {Object.keys(THEMES).length} themes · {Object.values(THEMES[activeTheme]).filter(v => typeof v === "string" && v.startsWith("#")).length} tokens · tryfelmark.com
          </div>

        </div>
      </div>
    </>
  );
}
