import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK SETTINGS — 10x
   10 themes. Live preview. Every section refined.
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

// Mini theme preview
function ThemeMini({ theme, active, onClick }) {
  const t = theme;
  return (
    <div onClick={onClick} style={{
      padding: 10, borderRadius: 8, border: `2px solid ${active ? t.a : t.w200}`,
      background: t.p, cursor: "pointer", transition: "all .15s",
      boxShadow: active ? `0 0 0 3px ${t.ab}` : "none",
      transform: active ? "translateY(-2px)" : "none",
    }}>
      {/* Accent bar */}
      <div style={{ height: 3, borderRadius: 2, background: t.a, marginBottom: 6 }} />
      {/* Color chips */}
      <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
        {[t.p, t.w200, t.i9, t.a, t.ok].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c, border: `1px solid ${t.w300}` }} />
        ))}
      </div>
      {/* Mini layout */}
      <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
        <div style={{ flex: 1, height: 6, borderRadius: 1, background: t.w200 }} />
        <div style={{ flex: 1, height: 6, borderRadius: 1, background: t.w200 }} />
      </div>
      <div style={{ height: 4, borderRadius: 1, background: t.w100, width: "60%", marginBottom: 4 }} />
      <div style={{ height: 14, borderRadius: 3, background: t.a, opacity: 0.8 }} />
      {/* Name */}
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

  // Styles object for reuse
  const card = { background: cardBg, border: `1px solid ${t.w200}`, borderRadius: 10, padding: "16px 18px", marginBottom: 12, transition: "all .3s" };
  const cardLabel = { fontFamily: "var(--mono)", fontSize: 9, color: t.i3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10, transition: "color .3s" };
  const secHead = { marginBottom: 14 };
  const secTitle = { fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: t.i9, marginBottom: 2, transition: "color .3s" };
  const secSub = { fontSize: 13, color: t.i4, transition: "color .3s" };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0;padding:0}:root{--mono:'JetBrains Mono',monospace}input:focus,textarea:focus{border-color:${t.a} !important}`}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: t.i7, background: t.p, minHeight: "100vh", display: "flex", flexDirection: "column", transition: "background .4s, color .4s" }}>

        {/* Top bar */}
        <div style={{ padding: "8px 20px", borderBottom: `1px solid ${t.w200}`, display: "flex", alignItems: "center", gap: 10, background: cardBg, flexShrink: 0, transition: "all .3s" }}>
          <button style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${t.w200}`, background: cardBg, color: t.i4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>←</button>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: t.i9, flex: 1, transition: "color .3s" }}>Settings</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, color: t.i4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.ok }} />
            <span>Saved</span>
          </div>
          <button style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: t.i9, color: t.p.startsWith("#f") || t.p === "#fafafa" ? "#fff" : t.i9 === "#171717" ? "#fafafa" : "#fff", fontSize: 12, fontWeight: 500, fontFamily: "inherit", cursor: "pointer" }}>Save Changes</button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Sidebar */}
          <div style={{ width: 200, borderRight: `1px solid ${t.w200}`, background: cardBg, padding: "12px 6px", flexShrink: 0, overflowY: "auto", transition: "all .3s" }}>
            {SECTIONS.map(s => (
              <div key={s.id} onClick={() => setSec(s.id)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 6,
                cursor: "pointer", marginBottom: 1, transition: "all .08s",
                background: sec === s.id ? t.ab : "transparent",
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, flexShrink: 0, transition: "all .1s",
                  background: sec === s.id ? t.ab : t.w50,
                  border: `1px solid ${sec === s.id ? t.a + "20" : t.w200}`,
                  color: sec === s.id ? t.a : t.i4,
                }}>{s.icon}</div>
                <span style={{ fontSize: 13, color: sec === s.id ? t.i8 : t.i5, fontWeight: sec === s.id ? 500 : 400, transition: "color .1s" }}>{s.label}</span>
              </div>
            ))}
            <div style={{ padding: "10px 10px", borderTop: `1px solid ${t.w100}`, marginTop: 12, fontFamily: "var(--mono)", fontSize: 9, color: t.i3, lineHeight: 1.6, transition: "all .3s" }}>
              Felmark v1.0<br />
              Theme: {t.name}<br />
              <span style={{ color: t.a }}>tryfelmark.com</span>
            </div>
          </div>

          {/* Main */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 60px" }}>
            <div style={{ maxWidth: 640 }}>

              {/* ═══ APPEARANCE ═══ */}
              {sec === "appearance" && <>
                <div style={secHead}><div style={secTitle}>Appearance</div><div style={secSub}>Customize how Felmark looks and feels</div></div>

                {/* Theme grid */}
                <div style={card}>
                  <div style={cardLabel}>Theme — {t.name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 6 }}>
                    {Object.entries(THEMES).slice(0, 5).map(([id, theme]) => (
                      <ThemeMini key={id} theme={theme} active={themeId === id} onClick={() => setThemeId(id)} />
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                    {Object.entries(THEMES).slice(5).map(([id, theme]) => (
                      <ThemeMini key={id} theme={theme} active={themeId === id} onClick={() => setThemeId(id)} />
                    ))}
                  </div>
                </div>

                {/* Active palette */}
                <div style={card}>
                  <div style={cardLabel}>Active Palette — {t.name}</div>
                  <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                    {[t.p, t.w50, t.w100, t.w200, t.w300, t.w400].map((c, i) => (
                      <div key={i} style={{ flex: 1 }}>
                        <div style={{ height: 24, borderRadius: 3, background: c, border: `1px solid ${t.w300}` }} />
                        <div style={{ fontFamily: "var(--mono)", fontSize: 7, color: t.i4, textAlign: "center", marginTop: 2 }}>{c}</div>
                      </div>
                    ))}
                    <div style={{ width: 8 }} />
                    {[t.i9, t.i7, t.i5, t.i3].map((c, i) => (
                      <div key={i} style={{ flex: 1 }}>
                        <div style={{ height: 24, borderRadius: 3, background: c, border: `1px solid ${t.w300}` }} />
                        <div style={{ fontFamily: "var(--mono)", fontSize: 7, color: t.i4, textAlign: "center", marginTop: 2 }}>{c}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[{ l: "Accent", c: t.a }, { l: "Success", c: t.ok }, { l: "Error", c: t.err }, { l: "Info", c: t.inf }, { l: "Warning", c: t.warn }].map((s, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ height: 20, borderRadius: 3, background: s.c, transition: "background .3s" }} />
                        <div style={{ fontFamily: "var(--mono)", fontSize: 7, color: t.i4, marginTop: 2 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display options */}
                <div style={card}>
                  <div style={cardLabel}>Display</div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.i6, marginBottom: 6 }}>Font size</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[{ id: "compact", label: "Compact", sub: "13px" }, { id: "default", label: "Default", sub: "14px" }, { id: "large", label: "Large", sub: "16px" }].map(f => (
                        <div key={f.id} onClick={() => setFontSize(f.id)} style={{
                          flex: 1, padding: "8px 6px", borderRadius: 6, textAlign: "center", cursor: "pointer", transition: "all .1s",
                          border: `1px solid ${fontSize === f.id ? t.a : t.w200}`,
                          background: fontSize === f.id ? t.ab : "transparent",
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: fontSize === f.id ? t.a : t.i6 }}>{f.label}</div>
                          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: t.i3 }}>{f.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.i6, marginBottom: 6 }}>Density</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[{ id: "compact", label: "Compact" }, { id: "comfortable", label: "Comfortable" }, { id: "spacious", label: "Spacious" }].map(d => (
                        <div key={d.id} onClick={() => setDensity(d.id)} style={{
                          flex: 1, padding: "8px 6px", borderRadius: 6, textAlign: "center", cursor: "pointer",
                          border: `1px solid ${density === d.id ? t.a : t.w200}`,
                          background: density === d.id ? t.ab : "transparent",
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: density === d.id ? t.a : t.i6 }}>{d.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.i6, marginBottom: 6 }}>Sidebar position</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[{ id: "left", label: "Left" }, { id: "right", label: "Right" }].map(s => (
                        <div key={s.id} onClick={() => setSidebarPos(s.id)} style={{
                          flex: 1, padding: "8px 6px", borderRadius: 6, textAlign: "center", cursor: "pointer",
                          border: `1px solid ${sidebarPos === s.id ? t.a : t.w200}`,
                          background: sidebarPos === s.id ? t.ab : "transparent",
                        }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: sidebarPos === s.id ? t.a : t.i6 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Editor options */}
                <div style={card}>
                  <div style={cardLabel}>Editor</div>
                  <Toggle label="Draft line" sub="Show typewriter focus line below active block" on={draftLine} onChange={() => setDraftLine(!draftLine)} t={t} />
                  <Toggle label="Animations" sub="Motion effects, transitions, and micro-interactions" on={animations} onChange={() => setAnimations(!animations)} t={t} />
                  <Toggle label="Block chrome on hover" sub="Show add/drag handles when hovering blocks" on={true} onChange={() => {}} t={t} />
                  <Toggle label="Slash command palette" sub="Type / to insert blocks" on={true} onChange={() => {}} t={t} />
                </div>
              </>}

              {/* ═══ PROFILE ═══ */}
              {sec === "profile" && <>
                <div style={secHead}><div style={secTitle}>Profile</div><div style={secSub}>Your personal information</div></div>
                <div style={card}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: t.a, color: "#fff", fontSize: 20, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 500, color: t.i8 }}>Alex Mercer</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: t.i4 }}>alex@tryfelmark.com</div>
                      <button style={{ marginTop: 3, padding: "3px 10px", borderRadius: 4, border: `1px solid ${t.w200}`, background: cardBg, fontSize: 11, fontFamily: "inherit", color: t.i5, cursor: "pointer" }}>Change photo</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1 }}><Field label="First name" value="Alex" t={t} /></div><div style={{ flex: 1 }}><Field label="Last name" value="Mercer" t={t} /></div></div>
                  <Field label="Email" value="alex@tryfelmark.com" type="email" t={t} />
                  <Field label="Website" value="https://alexmercer.design" mono t={t} />
                  <Field label="Bio" value="Brand identity designer specializing in startups. 8+ years building brands that people remember." type="textarea" t={t} />
                </div>
              </>}

              {/* ═══ BUSINESS ═══ */}
              {sec === "business" && <>
                <div style={secHead}><div style={secTitle}>Business</div><div style={secSub}>Freelance business details</div></div>
                <div style={card}>
                  <div style={cardLabel}>Business info</div>
                  <Field label="Business name" value="Alex Mercer Design" t={t} />
                  <div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1 }}><Field label="EIN / Tax ID" value="XX-XXXXXXX" mono sub="For 1099 generation" t={t} /></div><div style={{ flex: 1 }}><Field label="Currency" value="USD" mono t={t} /></div></div>
                </div>
                <div style={card}>
                  <div style={cardLabel}>Default rates</div>
                  <div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1 }}><Field label="Hourly rate" value="$125" mono t={t} /></div><div style={{ flex: 1 }}><Field label="Day rate" value="$900" mono t={t} /></div></div>
                  <div style={{ display: "flex", gap: 10 }}><div style={{ flex: 1 }}><Field label="Minimum project" value="$2,500" mono t={t} /></div><div style={{ flex: 1 }}><Field label="Rush multiplier" value="1.5×" mono t={t} /></div></div>
                </div>
              </>}

              {/* ═══ BRAND & PORTAL ═══ */}
              {sec === "brand" && <>
                <div style={secHead}><div style={secTitle}>Brand & Portal</div><div style={secSub}>Customize how clients see you</div></div>
                <div style={card}>
                  <div style={cardLabel}>Client portal</div>
                  <Field label="Portal headline" value="Welcome to your project portal" t={t} />
                  <Field label="Portal subtext" value="View proposals, invoices, and project updates in one place." type="textarea" t={t} />
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: t.i6, marginBottom: 6 }}>Portal accent color</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[t.a, t.i9, "#5b7fa4", "#5a9a3c", "#7c6b9e", "#c24b38", "#c89360", "#8a7e63"].map(c => (
                        <div key={c} onClick={() => setPortalColor(c)} style={{ width: 28, height: 28, borderRadius: 6, background: c, cursor: "pointer", border: portalColor === c ? `2px solid ${t.i9}` : "2px solid transparent", boxShadow: portalColor === c ? "0 0 0 2px #fff inset" : "none", transition: "all .1s" }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div style={card}>
                  <div style={cardLabel}>Custom domain</div>
                  <Field label="Portal URL" value="portal.alexmercer.design" mono sub="CNAME → portal.tryfelmark.com" t={t} />
                </div>
              </>}

              {/* ═══ NOTIFICATIONS ═══ */}
              {sec === "notifications" && <>
                <div style={secHead}><div style={secTitle}>Notifications</div><div style={secSub}>Control what you get alerted about</div></div>
                <div style={card}>
                  <div style={cardLabel}>Delivery</div>
                  <Toggle label="Email notifications" sub="Alerts to your inbox" on={notifs.email} onChange={() => tn("email")} t={t} />
                  <Toggle label="Push notifications" sub="Browser and mobile" on={notifs.push} onChange={() => tn("push")} t={t} />
                  <Toggle label="Daily digest" sub="Morning summary at 8am" on={notifs.digest} onChange={() => tn("digest")} t={t} />
                </div>
                <div style={card}>
                  <div style={cardLabel}>Events</div>
                  <Toggle label="Proposal viewed or signed" sub="Client opens or accepts" on={notifs.proposals} onChange={() => tn("proposals")} t={t} />
                  <Toggle label="Payment received" sub="Money via Stripe" on={notifs.payments} onChange={() => tn("payments")} t={t} />
                  <Toggle label="Invoice overdue" sub="Past due date" on={notifs.overdue} onChange={() => tn("overdue")} t={t} />
                  <Toggle label="Comments" sub="Client or collaborator" on={notifs.comments} onChange={() => tn("comments")} t={t} />
                  <Toggle label="Wire signals" sub="Intelligence matches" on={notifs.wire} onChange={() => tn("wire")} t={t} />
                </div>
              </>}

              {/* ═══ INTEGRATIONS ═══ */}
              {sec === "integrations" && <>
                <div style={secHead}><div style={secTitle}>Integrations</div><div style={secSub}>Connect your tools</div></div>
                {[
                  { cat: "Payments", items: [{ ic: "$", n: "Stripe Connect", d: "2.9% per transaction", ok: true }] },
                  { cat: "Calendar & Comms", items: [
                    { ic: "G", n: "Google Calendar", d: "Sync deadlines", ok: true },
                    { ic: "Gm", n: "Gmail", d: "Send from your email", ok: true },
                    { ic: "Z", n: "Zoom", d: "Meeting links", ok: false },
                    { ic: "Sl", n: "Slack", d: "Notifications", ok: false },
                  ]},
                  { cat: "Storage & Design", items: [
                    { ic: "Fg", n: "Figma", d: "Embed frames", ok: false },
                    { ic: "Nt", n: "Notion", d: "Import pages", ok: false },
                    { ic: "Dr", n: "Google Drive", d: "Attach files", ok: false },
                  ]},
                ].map((group, gi) => (
                  <div key={gi} style={card}>
                    <div style={cardLabel}>{group.cat}</div>
                    {group.items.map((it, ii) => (
                      <div key={ii} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: ii < group.items.length - 1 ? `1px solid ${t.w100}` : "none" }}>
                        <div style={{ width: 32, height: 32, borderRadius: 7, background: it.ok ? t.ok + "08" : t.w100, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: it.ok ? t.ok : t.i5 }}>{it.ic}</div>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, color: t.i7 }}>{it.n}</div><div style={{ fontSize: 11, color: t.i3 }}>{it.d}</div></div>
                        <button style={{ padding: "4px 12px", borderRadius: 5, border: `1px solid ${it.ok ? t.ok + "15" : t.w200}`, background: it.ok ? t.ok + "04" : cardBg, fontSize: 11, fontFamily: "inherit", color: it.ok ? t.ok : t.i5, cursor: "pointer" }}>{it.ok ? "✓ Connected" : "Connect"}</button>
                      </div>
                    ))}
                  </div>
                ))}
              </>}

              {/* ═══ BILLING ═══ */}
              {sec === "billing" && <>
                <div style={secHead}><div style={secTitle}>Plan & Billing</div><div style={secSub}>Subscription and payment history</div></div>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  {[
                    { name: "Free", price: "$0", sub: "forever", desc: "Full editor, proposals, invoicing. 2.9% on payments.", cur: true },
                    { name: "Pro", price: "$0", sub: "+ 2.9%", desc: "Everything plus The Wire, custom domain, priority support.", cur: false },
                  ].map((plan, i) => (
                    <div key={i} style={{ flex: 1, border: plan.cur ? `2px solid ${t.a}` : `1px solid ${t.w200}`, borderRadius: 10, padding: 16, textAlign: "center", background: plan.cur ? t.ab : cardBg, cursor: "pointer", transition: "all .15s" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: t.i8 }}>{plan.name}</div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: t.i9, lineHeight: 1 }}>{plan.price}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.i3 }}>{plan.sub}</div>
                      <div style={{ fontSize: 11, color: t.i4, marginTop: 6, lineHeight: 1.4 }}>{plan.desc}</div>
                      {plan.cur && <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: t.a, background: t.ab, border: `1px solid ${t.a}20`, padding: "1px 6px", borderRadius: 3, display: "inline-block", marginTop: 6 }}>Current plan</div>}
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <div style={cardLabel}>Revenue summary</div>
                  {[
                    { l: "Total processed", v: "$68,400", c: t.i8, w: 600 },
                    { l: "Felmark fees (2.9%)", v: "$1,983.60", c: t.i4, w: 400 },
                    { l: "Net to you", v: "$66,416.40", c: t.ok, w: 600 },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 2 ? `1px solid ${t.w100}` : "none", fontSize: 13 }}>
                      <span style={{ color: t.i4 }}>{r.l}</span>
                      <span style={{ fontFamily: "var(--mono)", fontWeight: r.w, color: r.c }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </>}

              {/* ═══ SECURITY ═══ */}
              {sec === "security" && <>
                <div style={secHead}><div style={secTitle}>Security</div><div style={secSub}>Protect your account</div></div>
                <div style={card}>
                  <div style={cardLabel}>Authentication</div>
                  <Field label="Password" value="••••••••••" type="password" sub="Last changed 45 days ago" t={t} />
                  <div style={{ height: 1, background: t.w200, margin: "14px 0" }} />
                  <Toggle label="Two-factor authentication" sub="Authenticator app required on login" on={twoFA} onChange={() => setTwoFA(!twoFA)} t={t} />
                </div>
                <div style={card}>
                  <div style={cardLabel}>Active sessions</div>
                  {[
                    { n: "MacBook Pro — Chrome", m: "San Francisco · Active now", cur: true },
                    { n: "iPhone 15 — Safari", m: "San Francisco · 2h ago", cur: false },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 1 ? `1px solid ${t.w100}` : "none" }}>
                      <span style={{ fontSize: 14, color: t.i4, width: 18 }}>◎</span>
                      <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: t.i6 }}>{s.n}</div><div style={{ fontFamily: "var(--mono)", fontSize: 10, color: t.i3 }}>{s.m}</div></div>
                      {s.cur && <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: t.ok, background: t.ok + "08", padding: "1px 6px", borderRadius: 3, border: `1px solid ${t.ok}10` }}>This device</span>}
                    </div>
                  ))}
                </div>
                <div style={{ border: `1px solid ${t.err}15`, borderRadius: 8, padding: "14px 16px", marginTop: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div><div style={{ fontSize: 13, fontWeight: 500, color: t.err }}>Delete account</div><div style={{ fontSize: 11, color: t.i3 }}>Permanently delete your account and all data</div></div>
                    <button style={{ padding: "5px 14px", borderRadius: 5, border: `1px solid ${t.err}20`, background: cardBg, fontSize: 11, fontFamily: "inherit", color: t.err, cursor: "pointer" }}>Delete Account</button>
                  </div>
                </div>
              </>}

              {/* ═══ DATA & EXPORT ═══ */}
              {sec === "data" && <>
                <div style={secHead}><div style={secTitle}>Data & Export</div><div style={secSub}>Download your data or migrate</div></div>
                <div style={card}>
                  <div style={cardLabel}>Export</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      { ic: "☰", l: "All Projects", s: "Documents, proposals" },
                      { ic: "$", l: "Financial Data", s: "Invoices, payments" },
                      { ic: "◎", l: "Client List", s: "Contacts, history" },
                      { ic: "◆", l: "Full Backup", s: "Everything in ZIP" },
                    ].map((e, i) => (
                      <button key={i} style={{ flex: 1, minWidth: 120, padding: "10px 12px", border: `1px solid ${t.w200}`, borderRadius: 7, background: cardBg, cursor: "pointer", textAlign: "left" }}>
                        <div style={{ fontSize: 15, marginBottom: 2 }}>{e.ic}</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: t.i7 }}>{e.l}</div>
                        <div style={{ fontSize: 10, color: t.i3 }}>{e.s}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={card}>
                  <div style={cardLabel}>Import from</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[{ ic: "H", l: "HoneyBook" }, { ic: "N", l: "Notion" }, { ic: "C", l: "CSV" }].map((e, i) => (
                      <button key={i} style={{ flex: 1, padding: "10px 12px", border: `1px solid ${t.w200}`, borderRadius: 7, background: cardBg, cursor: "pointer", textAlign: "center" }}>
                        <div style={{ fontSize: 15, marginBottom: 2 }}>{e.ic}</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: t.i7 }}>{e.l}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={card}>
                  <div style={cardLabel}>Retention</div>
                  <Toggle label="Keep deleted items 30 days" sub="Recover accidentally deleted projects" on={true} onChange={() => {}} t={t} />
                  <Toggle label="Automatic backups" sub="Daily backup to cloud" on={true} onChange={() => {}} t={t} />
                </div>
              </>}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
