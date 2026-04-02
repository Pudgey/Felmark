import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — THEME PACK 2
   5 more worlds to work in.
   ═══════════════════════════════════════════ */

const THEMES = {
  obsidian: {
    name: "Obsidian",
    desc: "Volcanic black glass. Warm grey text. Red-orange accent that cuts like lava through stone.",
    inspiration: "Volcanic glass, dark mode done right, molten core",
    parchment: "#121110", warm50: "#1a1918", warm100: "#232220", warm200: "#2f2d2b", warm300: "#3d3a37", warm400: "#524e4a",
    ink900: "#ece8e2", ink800: "#d4cfc7", ink700: "#b8b2a8", ink600: "#9c958a", ink500: "#807870", ink400: "#666059", ink300: "#524e4a",
    accent: "#e85d3a", accentLight: "#f07350", accentBg: "rgba(232,93,58,0.08)",
    success: "#4ade80", error: "#fb7185", info: "#60a5fa", warning: "#facc15",
  },
  dune: {
    name: "Dune",
    desc: "Sun-bleached sand, dry heat, golden hour warmth. The desert as a design system.",
    inspiration: "Saharan dunes, sandstone temples, golden hour film grain",
    parchment: "#f9f3e8", warm50: "#f4edd9", warm100: "#ede4cc", warm200: "#e2d7b8", warm300: "#d4c7a2", warm400: "#c1b38a",
    ink900: "#3b3122", ink800: "#504530", ink700: "#665a40", ink600: "#7d7054", ink500: "#96886a", ink400: "#afa283", ink300: "#c4b99f",
    accent: "#c48a2a", accentLight: "#d9a03e", accentBg: "rgba(196,138,42,0.08)",
    success: "#6a9a3c", error: "#c44a3a", info: "#5a87a8", warning: "#d4a030",
  },
  mono: {
    name: "Ink",
    desc: "Pure monochrome. No color. Only black, white, and 11 shades between. Typography-first.",
    inspiration: "Newspaper print, darkroom photography, letterpress",
    parchment: "#fafafa", warm50: "#f5f5f5", warm100: "#eeeeee", warm200: "#e0e0e0", warm300: "#cccccc", warm400: "#aaaaaa",
    ink900: "#171717", ink800: "#262626", ink700: "#404040", ink600: "#525252", ink500: "#6b6b6b", ink400: "#8a8a8a", ink300: "#a3a3a3",
    accent: "#171717", accentLight: "#404040", accentBg: "rgba(23,23,23,0.05)",
    success: "#404040", error: "#171717", info: "#525252", warning: "#6b6b6b",
  },
  copper: {
    name: "Copper",
    desc: "Industrial warmth. Oxidized green patina, burnished metal, workshop grit.",
    inspiration: "Copper pipes, patina verde, steampunk workbench, oxidized metal",
    parchment: "#f4f2ee", warm50: "#ece9e3", warm100: "#e2ded6", warm200: "#d5d0c5", warm300: "#c5bfb2", warm400: "#aea79a",
    ink900: "#28271f", ink800: "#3a382e", ink700: "#4e4b3f", ink600: "#636052", ink500: "#7b7768", ink400: "#949080", ink300: "#aca89b",
    accent: "#b87333", accentLight: "#cc8844", accentBg: "rgba(184,115,51,0.07)",
    success: "#5e8c6a", error: "#b84a42", info: "#4f7a8c", warning: "#c4923a",
  },
  lavender: {
    name: "Lavender",
    desc: "Soft purple haze. Cool greys with violet undertones. Gentle but professional.",
    inspiration: "Provence fields, twilight sky, amethyst crystal, soft gauze",
    parchment: "#f9f8fc", warm50: "#f3f1f8", warm100: "#eae7f2", warm200: "#ddd8ea", warm300: "#cdc6de", warm400: "#b5adc9",
    ink900: "#24213a", ink800: "#35314e", ink700: "#484363", ink600: "#5d5879", ink500: "#746f8f", ink400: "#8e89a6", ink300: "#a8a4ba",
    accent: "#8b5cf6", accentLight: "#a07af7", accentBg: "rgba(139,92,246,0.07)",
    success: "#34d399", error: "#f472b6", info: "#818cf8", warning: "#fbbf24",
  },
};

function Swatch({ color, label, small }) {
  return (
    <div style={{ borderRadius: 4, overflow: "hidden" }}>
      <div style={{ height: small ? 24 : 32, background: color }} />
      <div style={{ padding: "3px 4px" }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, opacity: 0.5 }}>{color}</div>
      </div>
    </div>
  );
}

function Preview({ t, active }) {
  return (
    <div style={{
      background: t.parchment, border: `1.5px solid ${active ? t.accent : t.warm200}`,
      borderRadius: 10, padding: 14, fontFamily: "'Outfit', sans-serif", transition: "all .3s",
      boxShadow: active ? `0 0 0 3px ${t.accentBg}` : "none",
    }}>
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${t.warm200}` }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: t.ink900, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent, fontSize: 10, fontWeight: 600 }}>◆</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: t.ink900, flex: 1 }}>Dashboard</div>
        <div style={{ padding: "3px 8px", background: t.accent, color: "#fff", borderRadius: 4, fontSize: 8, fontWeight: 500 }}>Send →</div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
        {[{ v: "$14.8k", c: t.success }, { v: "$112", c: t.accent }, { v: "32h", c: t.info }].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "5px 4px", background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 4, textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 600, color: s.c, lineHeight: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Rows */}
      {[
        { dot: t.success, text: "Payment received" },
        { dot: t.error, text: "Invoice overdue" },
        { dot: t.accent, text: "Proposal sent" },
        { dot: t.info, text: "Contract viewed" },
      ].map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 0", borderBottom: i < 3 ? `1px solid ${t.warm100}` : "none" }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: a.dot }} />
          <span style={{ fontSize: 9, color: t.ink700, flex: 1 }}>{a.text}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 7, color: t.ink400 }}>2m</span>
        </div>
      ))}

      {/* Checklist */}
      <div style={{ marginTop: 8, padding: 8, background: t.warm50, borderRadius: 5, border: `1px solid ${t.warm200}` }}>
        {["Brand guidelines", "Logo concepts", "Typography"].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 0", fontSize: 9, color: i < 2 ? t.ink400 : t.ink700 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, border: `1.5px solid ${i < 2 ? t.accent : t.warm300}`, background: i < 2 ? t.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 7 }}>
              {i < 2 ? "✓" : ""}
            </div>
            <span style={{ textDecoration: i < 2 ? "line-through" : "none" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Terminal preview */}
      <div style={{ marginTop: 8, padding: 6, background: t.warm100, borderRadius: 5, fontFamily: "var(--mono)", fontSize: 8, color: t.ink500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
          <span style={{ color: t.accent, fontWeight: 500 }}>❯</span>
          <span>/status</span>
        </div>
        <div style={{ color: t.ink400 }}>4 projects · <span style={{ color: t.success }}>2 active</span> · <span style={{ color: t.error }}>1 overdue</span></div>
      </div>
    </div>
  );
}

export default function ThemePack2() {
  const [active, setActive] = useState("obsidian");
  const t = THEMES[active];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}:root{--mono:'JetBrains Mono',monospace}`}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif", background: t.parchment, color: t.ink700, minHeight: "100vh", padding: "36px 20px", transition: "background .4s, color .4s" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.accent, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4, transition: "color .3s" }}>Theme Pack 2</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 700, color: t.ink900, lineHeight: 1.1, transition: "color .3s" }}>5 New Worlds</div>
            <div style={{ fontSize: 15, color: t.ink500, marginTop: 4, transition: "color .3s" }}>Click a theme to transform everything.</div>
          </div>

          {/* Theme selector */}
          <div style={{ display: "flex", gap: 5, marginBottom: 28 }}>
            {Object.entries(THEMES).map(([id, theme]) => (
              <div key={id} onClick={() => setActive(id)} style={{
                flex: 1, padding: "10px 12px", borderRadius: 8, cursor: "pointer", transition: "all .2s",
                background: theme.parchment, border: `2px solid ${active === id ? theme.accent : theme.warm200}`,
                boxShadow: active === id ? `0 0 0 3px ${theme.accentBg}` : "none",
              }}>
                <div style={{ height: 3, borderRadius: 2, background: theme.accent, marginBottom: 8 }} />
                <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                  {[theme.parchment, theme.warm200, theme.ink900, theme.accent, theme.success].map((c, i) => (
                    <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: `1px solid ${theme.warm300}` }} />
                  ))}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.ink900 }}>{theme.name}</div>
                <div style={{ fontSize: 9, color: theme.ink500, lineHeight: 1.3, marginTop: 1 }}>{theme.desc.split(".")[0]}</div>
              </div>
            ))}
          </div>

          {/* Inspiration */}
          <div style={{ marginBottom: 28, padding: 16, background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 8, transition: "all .3s" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>Inspiration</div>
            <div style={{ fontSize: 16, fontStyle: "italic", color: t.ink600, lineHeight: 1.5, transition: "color .3s" }}>"{t.inspiration}"</div>
          </div>

          {/* Neutral scale */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10, transition: "color .3s" }}>Neutral Scale</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(13, 1fr)", gap: 3 }}>
              {[
                [t.parchment, "Base"], [t.warm50, "50"], [t.warm100, "100"], [t.warm200, "200"], [t.warm300, "300"], [t.warm400, "400"],
                [null, ""],
                [t.ink300, "300"], [t.ink400, "400"], [t.ink500, "500"], [t.ink600, "600"], [t.ink700, "700"], [t.ink800, "800"],
              ].map(([c, l], i) => c ? (
                <div key={i}>
                  <div style={{ height: 28, borderRadius: 3, background: c, border: `1px solid ${t.warm200}` }} />
                  <div style={{ fontFamily: "var(--mono)", fontSize: 7, color: t.ink400, marginTop: 2, textAlign: "center" }}>{l}</div>
                </div>
              ) : <div key={i} />)}
            </div>
            {/* ink-900 full width */}
            <div style={{ marginTop: 4, height: 20, borderRadius: 3, background: t.ink900, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: t.ink900 === "#171717" ? "#aaa" : t.warm400 }}>ink-900 · {t.ink900}</span>
            </div>
          </div>

          {/* Semantic colors */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Semantic + Accent</div>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { n: "Accent", c: t.accent },
                { n: "Accent Lt", c: t.accentLight },
                { n: "Success", c: t.success },
                { n: "Error", c: t.error },
                { n: "Info", c: t.info },
                { n: "Warning", c: t.warning },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 32, borderRadius: 6, background: s.c, marginBottom: 4, transition: "background .3s" }} />
                  <div style={{ fontSize: 10, color: t.ink600, fontWeight: 500 }}>{s.n}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: t.ink400 }}>{s.c}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography samples */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Typography</div>
            <div style={{ padding: 16, background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 8, transition: "all .3s" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, color: t.ink900, lineHeight: 1.15, marginBottom: 8, transition: "color .3s" }}>
                Leave your mark.
              </div>
              <div style={{ fontSize: 14, color: t.ink600, lineHeight: 1.7, marginBottom: 8, transition: "color .3s" }}>
                Felmark is where freelancers forge proposals, track projects, send invoices, and grow their business. Every tool in one workspace. Free forever.
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: t.ink500, lineHeight: 1.6, transition: "color .3s" }}>
                forge.projects.list() → 4 active · forge.invoices.create() → INV-0048
              </div>
            </div>
          </div>

          {/* Logo lockups */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Logo</div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ flex: 1, padding: 16, borderRadius: 8, background: t.ink900, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background .3s" }}>
                <span style={{ fontSize: 20, color: t.accent }}>◆</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: t.ink900 === "#171717" ? "#fafafa" : "#fff" }}>Felmark</span>
              </div>
              <div style={{ flex: 1, padding: 16, borderRadius: 8, background: t.warm50, border: `1px solid ${t.warm200}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .3s" }}>
                <span style={{ fontSize: 20, color: t.accent }}>◆</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: t.ink900 }}>Felmark</span>
              </div>
              <div style={{ flex: 1, padding: 16, borderRadius: 8, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background .3s" }}>
                <span style={{ fontSize: 20, color: "#fff" }}>◆</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#fff" }}>Felmark</span>
              </div>
            </div>
          </div>

          {/* Live previews */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Live Preview — All 5 Themes</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {Object.entries(THEMES).map(([id, theme]) => (
                <div key={id} onClick={() => setActive(id)} style={{ cursor: "pointer" }}>
                  <Preview t={theme} active={active === id} />
                  <div style={{ textAlign: "center", marginTop: 4, fontFamily: "var(--mono)", fontSize: 9, color: active === id ? t.accent : t.ink400, fontWeight: active === id ? 500 : 400, transition: "color .3s" }}>
                    {theme.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CSS Variables */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.ink400, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>CSS Variables — {t.name}</div>
            <div style={{ background: t.warm50, border: `1px solid ${t.warm200}`, borderRadius: 8, padding: 14, fontFamily: "var(--mono)", fontSize: 11, lineHeight: 1.9, color: t.ink600, transition: "all .3s", overflowX: "auto" }}>
              <div style={{ color: t.ink400 }}>:root {"{"}</div>
              {[
                ["--parchment", t.parchment], ["--warm-50", t.warm50], ["--warm-100", t.warm100], ["--warm-200", t.warm200],
                ["--warm-300", t.warm300], ["--warm-400", t.warm400],
                ["--ink-900", t.ink900], ["--ink-800", t.ink800], ["--ink-700", t.ink700], ["--ink-600", t.ink600],
                ["--ink-500", t.ink500], ["--ink-400", t.ink400], ["--ink-300", t.ink300],
                ["--accent", t.accent], ["--accent-light", t.accentLight], ["--accent-bg", t.accentBg],
                ["--success", t.success], ["--error", t.error], ["--info", t.info], ["--warning", t.warning],
              ].map(([k, v], i) => (
                <div key={i} style={{ paddingLeft: 16, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ color: t.ink500 }}>{k}:</span>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: v, border: `1px solid ${t.warm300}`, flexShrink: 0 }} />
                  <span style={{ color: t.accent }}>{v}</span>
                  <span style={{ color: t.ink300 }}>;</span>
                </div>
              ))}
              <div style={{ color: t.ink400 }}>{"}"}</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", paddingTop: 24, borderTop: `1px solid ${t.warm200}`, fontFamily: "var(--mono)", fontSize: 10, color: t.ink300, transition: "all .3s" }}>
            Felmark Theme Pack 2 · 5 themes · 100 tokens · tryfelmark.com
          </div>

        </div>
      </div>
    </>
  );
}
