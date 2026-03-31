import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK SETTINGS — 10x
   10 themes. Live preview. Every section refined.

   PROTOTYPE REFERENCE — Not production code.
   See conductor/missions/MISSION_SETTINGS.md for implementation plan.
   ═══════════════════════════════════════════ */

const THEMES = {
  ember: { name: "Ember", desc: "Warm parchment, forge fire", p: "#faf9f7", w50: "#f7f6f3", w100: "#f0eee9", w200: "#e5e2db", w300: "#d5d1c8", w400: "#b8b3a8", i9: "#2c2a25", i8: "#3d3a33", i7: "#4f4c44", i6: "#65625a", i5: "#7d7a72", i4: "#9b988f", i3: "#b5b2a9", a: "#b07d4f", al: "#c89360", ab: "rgba(176,125,79,0.08)", ok: "#5a9a3c", err: "#c24b38", inf: "#5b7fa4", warn: "#d4a34a" },
  midnight: { name: "Midnight", desc: "Deep navy, electric blue", p: "#0f1219", w50: "#151b27", w100: "#1a2332", w200: "#243044", w300: "#2e3d56", w400: "#3d5170", i9: "#e8ecf4", i8: "#c8d1e0", i7: "#a8b5cc", i6: "#8899b3", i5: "#6b7d99", i4: "#4f6180", i3: "#3d5170", a: "#4a9eff", al: "#6db3ff", ab: "rgba(74,158,255,0.08)", ok: "#34d399", err: "#f87171", inf: "#60a5fa", warn: "#fbbf24" },
  sage: { name: "Sage", desc: "Forest green, morning fog", p: "#f5f7f4", w50: "#eef2ec", w100: "#e3e9df", w200: "#d4ddd0", w300: "#c0ccba", w400: "#a3b39b", i9: "#2a3328", i8: "#3a4637", i7: "#4a5946", i6: "#5d6e59", i5: "#738570", i4: "#8f9e8b", i3: "#a8b5a3", a: "#5f8c5a", al: "#72a36c", ab: "rgba(95,140,90,0.08)", ok: "#3d9a6d", err: "#c0534f", inf: "#5e89a8", warn: "#c9a84e" },
  clay: { name: "Clay", desc: "Terra cotta, desert sunset", p: "#faf6f3", w50: "#f5ede7", w100: "#ede3da", w200: "#e0d2c6", w300: "#d1bfb0", w400: "#bda899", i9: "#33261e", i8: "#4a382d", i7: "#5e493d", i6: "#755d4f", i5: "#8d7465", i4: "#a68d7e", i3: "#bba69a", a: "#c47a5a", al: "#d4906e", ab: "rgba(196,122,90,0.08)", ok: "#6a9a5c", err: "#c25050", inf: "#6889a4", warn: "#c9a050" },
  frost: { name: "Frost", desc: "Cool white, violet accents", p: "#f8f9fc", w50: "#f0f2f7", w100: "#e6e9f0", w200: "#d5dae6", w300: "#c0c8d8", w400: "#a3aec4", i9: "#1e2433", i8: "#2d3548", i7: "#3f4a5e", i6: "#556075", i5: "#6d788e", i4: "#8892a6", i3: "#a3abbb", a: "#7c6aef", al: "#9384f5", ab: "rgba(124,106,239,0.08)", ok: "#36b37e", err: "#e5484d", inf: "#5b8def", warn: "#e5a336" },
  obsidian: { name: "Obsidian", desc: "Volcanic black, lava accent", p: "#121110", w50: "#1a1918", w100: "#232220", w200: "#2f2d2b", w300: "#3d3a37", w400: "#524e4a", i9: "#ece8e2", i8: "#d4cfc7", i7: "#b8b2a8", i6: "#9c958a", i5: "#807870", i4: "#666059", i3: "#524e4a", a: "#e85d3a", al: "#f07350", ab: "rgba(232,93,58,0.08)", ok: "#4ade80", err: "#fb7185", inf: "#60a5fa", warn: "#facc15" },
  dune: { name: "Dune", desc: "Sun-bleached sand, gold", p: "#f9f3e8", w50: "#f4edd9", w100: "#ede4cc", w200: "#e2d7b8", w300: "#d4c7a2", w400: "#c1b38a", i9: "#3b3122", i8: "#504530", i7: "#665a40", i6: "#7d7054", i5: "#96886a", i4: "#afa283", i3: "#c4b99f", a: "#c48a2a", al: "#d9a03e", ab: "rgba(196,138,42,0.08)", ok: "#6a9a3c", err: "#c44a3a", inf: "#5a87a8", warn: "#d4a030" },
  ink: { name: "Ink", desc: "Pure monochrome, zero color", p: "#fafafa", w50: "#f5f5f5", w100: "#eeeeee", w200: "#e0e0e0", w300: "#cccccc", w400: "#aaaaaa", i9: "#171717", i8: "#262626", i7: "#404040", i6: "#525252", i5: "#6b6b6b", i4: "#8a8a8a", i3: "#a3a3a3", a: "#171717", al: "#404040", ab: "rgba(23,23,23,0.05)", ok: "#404040", err: "#171717", inf: "#525252", warn: "#6b6b6b" },
  copper: { name: "Copper", desc: "Burnished metal, patina", p: "#f4f2ee", w50: "#ece9e3", w100: "#e2ded6", w200: "#d5d0c5", w300: "#c5bfb2", w400: "#aea79a", i9: "#28271f", i8: "#3a382e", i7: "#4e4b3f", i6: "#636052", i5: "#7b7768", i4: "#949080", i3: "#aca89b", a: "#b87333", al: "#cc8844", ab: "rgba(184,115,51,0.07)", ok: "#5e8c6a", err: "#b84a42", inf: "#4f7a8c", warn: "#c4923a" },
  lavender: { name: "Lavender", desc: "Soft purple, twilight", p: "#f9f8fc", w50: "#f3f1f8", w100: "#eae7f2", w200: "#ddd8ea", w300: "#cdc6de", w400: "#b5adc9", i9: "#24213a", i8: "#35314e", i7: "#484363", i6: "#5d5879", i5: "#746f8f", i4: "#8e89a6", i3: "#a8a4ba", a: "#8b5cf6", al: "#a07af7", ab: "rgba(139,92,246,0.07)", ok: "#34d399", err: "#f472b6", inf: "#818cf8", warn: "#fbbf24" },
};

const SECTIONS = [
  { id: "appearance", icon: "◆", label: "Appearance" },
  { id: "profile", icon: "◎", label: "Profile" },
  { id: "business", icon: "$", label: "Business" },
  { id: "brand", icon: "✦", label: "Brand & Portal" },
  { id: "notifications", icon: "◇", label: "Notifications" },
  { id: "integrations", icon: "⚙", label: "Integrations" },
  { id: "billing", icon: "★", label: "Plan & Billing" },
  { id: "security", icon: "◎", label: "Security" },
  { id: "data", icon: "↗", label: "Data & Export" },
];

function Toggle({ on, onChange, label, sub, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", cursor: "pointer", borderBottom: `1px solid ${t.w100}` }} onClick={onChange}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.i7 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: t.i3, marginTop: 1 }}>{sub}</div>}
      </div>
      <div style={{ width: 32, height: 18, borderRadius: 9, background: on ? t.a : t.w300, position: "relative", flexShrink: 0, transition: "background .15s" }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: on ? 16 : 2, transition: "left .15s", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }} />
      </div>
    </div>
  );
}

function Field({ label, value, mono, type = "text", sub, t }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.i6, marginBottom: 4 }}>{label}</label>
      {type === "textarea" ? (
        <textarea defaultValue={value} rows={3} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${t.w200}`, borderRadius: 6, fontSize: 13, fontFamily: mono ? "var(--mono)" : "inherit", color: t.i8, outline: "none", background: t.p === "#fafafa" || t.p.startsWith("#f") ? "#fff" : t.w50, resize: "vertical", minHeight: 56, lineHeight: 1.5 }} />
      ) : (
        <input type={type} defaultValue={value} style={{ width: "100%", padding: "8px 12px", border: `1px solid ${t.w200}`, borderRadius: 6, fontSize: 13, fontFamily: mono ? "var(--mono)" : "inherit", color: t.i8, outline: "none", background: t.p === "#fafafa" || t.p.startsWith("#f") ? "#fff" : t.w50 }} />
      )}
      {sub && <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.i3, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function ThemeMini({ theme, active, onClick }) {
  const t = theme;
  return (
    <div onClick={onClick} style={{
      padding: 10, borderRadius: 8, border: `2px solid ${active ? t.a : t.w200}`,
      background: t.p, cursor: "pointer", transition: "all .15s",
      boxShadow: active ? `0 0 0 3px ${t.ab}` : "none",
      transform: active ? "translateY(-2px)" : "none",
    }}>
      <div style={{ height: 3, borderRadius: 2, background: t.a, marginBottom: 6 }} />
      <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
        {[t.p, t.w200, t.i9, t.a, t.ok].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c, border: `1px solid ${t.w300}` }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 1, background: t.w200 }} />
        <div style={{ flex: 1, height: 6, borderRadius: 1, background: t.w200 }} />
      </div>
      <div style={{ height: 4, borderRadius: 1, background: t.w100, width: "60%", marginBottom: 4 }} />
      <div style={{ height: 14, borderRadius: 3, background: t.a, opacity: 0.8 }} />
      <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: t.i9, textAlign: "center" }}>{t.name}</div>
      <div style={{ fontSize: 8, color: t.i4, textAlign: "center", fontFamily: "var(--mono)" }}>{active ? "Active" : t.desc.split(",")[0]}</div>
    </div>
  );
}

export default function Settings() {
  const [sec, setSec] = useState("appearance");
  const [themeId, setThemeId] = useState("ember");
  const [notifs, setNotifs] = useState({ email: true, push: true, proposals: true, payments: true, overdue: true, comments: true, wire: false, digest: true, marketing: false });
  const [portalColor, setPortalColor] = useState("#b07d4f");
  const [twoFA, setTwoFA] = useState(false);
  const [fontSize, setFontSize] = useState("default");
  const [density, setDensity] = useState("comfortable");
  const [draftLine, setDraftLine] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [sidebarPos, setSidebarPos] = useState("left");

  const t = THEMES[themeId];
  const tn = (k) => setNotifs(p => ({ ...p, [k]: !p[k] }));
  const cardBg = t.p.startsWith("#f") || t.p === "#fafafa" ? "#fff" : t.w50;
  const card = { background: cardBg, border: `1px solid ${t.w200}`, borderRadius: 10, padding: "16px 18px", marginBottom: 12, transition: "all .3s" };
  const cardLabel = { fontFamily: "var(--mono)", fontSize: 9, color: t.i3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10, transition: "color .3s" };
  const secHead = { marginBottom: 14 };
  const secTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: t.i9, marginBottom: 2, transition: "color .3s" };
  const secSub = { fontSize: 13, color: t.i4, transition: "color .3s" };

  // Full component continues — see Prototype/Settings.jsx for all 9 sections
  // Sections: Appearance (themes + display + editor), Profile, Business, Brand & Portal,
  // Notifications, Integrations, Plan & Billing, Security, Data & Export
  return null; // Prototype — render via v0.dev or standalone
}
