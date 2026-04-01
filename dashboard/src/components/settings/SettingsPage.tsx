"use client";

import { useState } from "react";
import { THEMES, applyTheme, saveTheme, getActiveTheme } from "@/lib/themes";
import type { FelmarkTheme } from "@/lib/themes";
import styles from "./SettingsPage.module.css";

/* ═══ Section definitions ═══ */
type SectionId =
  | "appearance"
  | "profile"
  | "business"
  | "brand"
  | "notifications"
  | "integrations"
  | "plan"
  | "security"
  | "data";

interface Section {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}

const SECTIONS: Section[] = [
  {
    id: "appearance",
    label: "Appearance",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 2.5v11" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 2.5A5.5 5.5 0 0 1 13.5 8 5.5 5.5 0 0 1 8 13.5" fill="currentColor" opacity="0.15" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "business",
    label: "Business",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 5V3.5A1.5 1.5 0 0 1 6.5 2h3A1.5 1.5 0 0 1 11 3.5V5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "brand",
    label: "Brand & Portal",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 6h12" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="4.5" cy="4" r="0.8" fill="currentColor" />
        <circle cx="7" cy="4" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6a4 4 0 0 1 8 0v3l1.5 2H2.5L4 9V6z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 2v4a2 2 0 0 0 4 0V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 8v3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 14h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 11v3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "plan",
    label: "Plan & Billing",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 7h12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Security",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L2.5 4v4c0 3.5 2.5 5.5 5.5 6.5 3-1 5.5-3 5.5-6.5V4L8 1.5z" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "data",
    label: "Data & Export",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12v1.5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

/* ═══ Brand accent color options ═══ */
const ACCENT_COLORS = [
  "#b07d4f",
  "#4a9eff",
  "#5f8c5a",
  "#c47a5a",
  "#7c6aef",
  "#e85d3a",
  "#c48a2a",
  "#8b5cf6",
];

/* ═══ Component ═══ */
export default function SettingsPage() {
  const [section, setSection] = useState<SectionId>("appearance");
  const [activeThemeId, setActiveThemeId] = useState(getActiveTheme);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [density, setDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [sidebarPos, setSidebarPos] = useState<"left" | "right">("left");
  const [draftLine, setDraftLine] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [blockChrome, setBlockChrome] = useState(true);
  const [slashPalette, setSlashPalette] = useState(true);

  // Profile
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");

  // Business
  const [bizName, setBizName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [hourlyRate, setHourlyRate] = useState("");
  const [dayRate, setDayRate] = useState("");
  const [minProject, setMinProject] = useState("");
  const [rushMultiplier, setRushMultiplier] = useState("1.5");

  // Brand
  const [portalHeadline, setPortalHeadline] = useState("Welcome to your project portal");
  const [portalSubtext, setPortalSubtext] = useState("Everything you need, in one place.");
  const [brandAccent, setBrandAccent] = useState(ACCENT_COLORS[0]);
  const [customDomain, setCustomDomain] = useState("");

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);
  const [notifProposals, setNotifProposals] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifOverdue, setNotifOverdue] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifWire, setNotifWire] = useState(false);

  // Security
  const [twoFa, setTwoFa] = useState(false);

  // Data
  const [retainProjects, setRetainProjects] = useState(true);
  const [retainFinancial, setRetainFinancial] = useState(true);

  const [dirty, setDirty] = useState(false);

  const themeList = Object.values(THEMES);

  function handleThemeClick(theme: FelmarkTheme) {
    applyTheme(theme);
    saveTheme(theme.id);
    setActiveThemeId(theme.id);
  }

  function markDirty() {
    setDirty(true);
  }

  function handleSave() {
    setDirty(false);
  }

  /* ═══ Toggle helper ═══ */
  function Toggle({ on, onToggle }: { on: boolean; onToggle: (v: boolean) => void }) {
    return (
      <button
        className={on ? styles.toggleOn : styles.toggle}
        onClick={() => {
          onToggle(!on);
          markDirty();
        }}
        type="button"
      >
        <span className={styles.toggleDot} />
      </button>
    );
  }

  /* ═══ Theme mini-preview card ═══ */
  function ThemeMiniCard({ theme }: { theme: FelmarkTheme }) {
    const isActive = theme.id === activeThemeId;
    return (
      <div
        className={isActive ? styles.themeMiniActive : styles.themeMini}
        onClick={() => handleThemeClick(theme)}
        style={{
          background: theme.parchment,
          borderColor: isActive ? theme.accent : "transparent",
        }}
      >
        <div className={styles.themeMiniBar} style={{ background: theme.accent, width: "60%" }} />
        <div className={styles.themeMiniLines}>
          <div className={styles.themeMiniLine} style={{ background: theme.ink900, width: "80%", opacity: 0.7 }} />
          <div className={styles.themeMiniLine} style={{ background: theme.ink600, width: "60%", opacity: 0.4 }} />
          <div className={styles.themeMiniLine} style={{ background: theme.ink400, width: "45%", opacity: 0.25 }} />
        </div>
        <div className={styles.themeMiniName} style={{ color: theme.ink700 }}>
          {theme.name}
        </div>
      </div>
    );
  }

  /* ═══ Section Renderers ═══ */
  function renderAppearance() {
    const active = THEMES[activeThemeId] || THEMES.ember;
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Appearance</div>
          <div className={styles.secSub}>Customize how Felmark looks and feels</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Theme</div>
          <div className={styles.themeGrid}>
            {themeList.map((t) => (
              <ThemeMiniCard key={t.id} theme={t} />
            ))}
          </div>

          <div className={styles.cardLabel}>Active palette</div>
          <div className={styles.paletteRow}>
            <div className={styles.paletteSwatch} style={{ background: active.parchment }} />
            <div className={styles.paletteSwatch} style={{ background: active.warm200 }} />
            <div className={styles.paletteSwatch} style={{ background: active.ink900 }} />
            <div className={styles.paletteSwatch} style={{ background: active.ink600 }} />
            <div className={styles.paletteSwatch} style={{ background: active.accent }} />
            <span className={styles.paletteLabel}>{active.name}</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.optionGroupLabel}>Font size</div>
          <div className={styles.optionGroup}>
            {(["small", "medium", "large"] as const).map((s) => (
              <button
                key={s}
                className={fontSize === s ? styles.optionBtnActive : styles.optionBtn}
                onClick={() => { setFontSize(s); markDirty(); }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.optionGroupLabel}>Density</div>
          <div className={styles.optionGroup}>
            {(["compact", "comfortable", "spacious"] as const).map((d) => (
              <button
                key={d}
                className={density === d ? styles.optionBtnActive : styles.optionBtn}
                onClick={() => { setDensity(d); markDirty(); }}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.optionGroupLabel}>Sidebar position</div>
          <div className={styles.optionGroup}>
            {(["left", "right"] as const).map((p) => (
              <button
                key={p}
                className={sidebarPos === p ? styles.optionBtnActive : styles.optionBtn}
                onClick={() => { setSidebarPos(p); markDirty(); }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Editor</div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Draft line</div>
              <div className={styles.toggleDesc}>Show a subtle left border on the focused block</div>
            </div>
            <Toggle on={draftLine} onToggle={setDraftLine} />
          </div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Animations</div>
              <div className={styles.toggleDesc}>Enable block transitions and micro-interactions</div>
            </div>
            <Toggle on={animations} onToggle={setAnimations} />
          </div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Block chrome</div>
              <div className={styles.toggleDesc}>Show drag handles and block type indicators</div>
            </div>
            <Toggle on={blockChrome} onToggle={setBlockChrome} />
          </div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Slash command palette</div>
              <div className={styles.toggleDesc}>Show the slash menu when typing /</div>
            </div>
            <Toggle on={slashPalette} onToggle={setSlashPalette} />
          </div>
        </div>
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Profile</div>
          <div className={styles.secSub}>Your personal information</div>
        </div>

        <div className={styles.card}>
          <div className={styles.avatarRow}>
            <div className={styles.avatar}>
              {firstName ? firstName[0].toUpperCase() : "?"}
            </div>
            <button className={styles.avatarUploadBtn} type="button">Upload photo</button>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>First name</label>
              <input className={styles.fieldInput} value={firstName} onChange={(e) => { setFirstName(e.target.value); markDirty(); }} placeholder="Jane" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Last name</label>
              <input className={styles.fieldInput} value={lastName} onChange={(e) => { setLastName(e.target.value); markDirty(); }} placeholder="Doe" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email</label>
              <input className={styles.fieldInput} type="email" value={email} onChange={(e) => { setEmail(e.target.value); markDirty(); }} placeholder="jane@example.com" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Website</label>
              <input className={styles.fieldInput} value={website} onChange={(e) => { setWebsite(e.target.value); markDirty(); }} placeholder="https://yoursite.com" />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.fieldLabel}>Bio</label>
              <textarea className={styles.fieldTextarea} value={bio} onChange={(e) => { setBio(e.target.value); markDirty(); }} placeholder="Tell clients about yourself..." />
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderBusiness() {
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Business</div>
          <div className={styles.secSub}>Your freelance business details</div>
        </div>

        <div className={styles.card}>
          <div className={styles.fieldGrid}>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.fieldLabel}>Business name</label>
              <input className={styles.fieldInput} value={bizName} onChange={(e) => { setBizName(e.target.value); markDirty(); }} placeholder="Your Studio LLC" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Tax ID / EIN</label>
              <input className={styles.fieldInput} value={taxId} onChange={(e) => { setTaxId(e.target.value); markDirty(); }} placeholder="XX-XXXXXXX" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Currency</label>
              <select className={styles.fieldInput} value={currency} onChange={(e) => { setCurrency(e.target.value); markDirty(); }}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (&euro;)</option>
                <option value="GBP">GBP (&pound;)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Hourly rate</label>
              <input className={styles.fieldInput} type="number" value={hourlyRate} onChange={(e) => { setHourlyRate(e.target.value); markDirty(); }} placeholder="150" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Day rate</label>
              <input className={styles.fieldInput} type="number" value={dayRate} onChange={(e) => { setDayRate(e.target.value); markDirty(); }} placeholder="1200" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Minimum project</label>
              <input className={styles.fieldInput} type="number" value={minProject} onChange={(e) => { setMinProject(e.target.value); markDirty(); }} placeholder="2500" />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Rush multiplier</label>
              <input className={styles.fieldInput} value={rushMultiplier} onChange={(e) => { setRushMultiplier(e.target.value); markDirty(); }} placeholder="1.5x" />
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderBrand() {
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Brand &amp; Portal</div>
          <div className={styles.secSub}>Customize your client-facing portal</div>
        </div>

        <div className={styles.card}>
          <div className={styles.fieldGrid}>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.fieldLabel}>Portal headline</label>
              <input className={styles.fieldInput} value={portalHeadline} onChange={(e) => { setPortalHeadline(e.target.value); markDirty(); }} />
            </div>
            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label className={styles.fieldLabel}>Subtext</label>
              <input className={styles.fieldInput} value={portalSubtext} onChange={(e) => { setPortalSubtext(e.target.value); markDirty(); }} />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Accent color</div>
          <div className={styles.colorDots}>
            {ACCENT_COLORS.map((c) => (
              <div
                key={c}
                className={brandAccent === c ? styles.colorDotActive : styles.colorDot}
                style={{ background: c }}
                onClick={() => { setBrandAccent(c); markDirty(); }}
              />
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Custom domain</label>
            <input className={styles.fieldInput} value={customDomain} onChange={(e) => { setCustomDomain(e.target.value); markDirty(); }} placeholder="portal.yourdomain.com" />
          </div>
        </div>
      </>
    );
  }

  function renderNotifications() {
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Notifications</div>
          <div className={styles.secSub}>Choose how and when you get notified</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Delivery</div>
          <div className={styles.toggleRow}>
            <div><div className={styles.toggleLabel}>Email notifications</div></div>
            <Toggle on={notifEmail} onToggle={setNotifEmail} />
          </div>
          <div className={styles.toggleRow}>
            <div><div className={styles.toggleLabel}>Push notifications</div></div>
            <Toggle on={notifPush} onToggle={setNotifPush} />
          </div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Daily digest</div>
              <div className={styles.toggleDesc}>Get a summary email at 9 AM</div>
            </div>
            <Toggle on={notifDigest} onToggle={setNotifDigest} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Events</div>
          <div className={styles.toggleRow}>
            <div><div className={styles.toggleLabel}>Proposals signed</div></div>
            <Toggle on={notifProposals} onToggle={setNotifProposals} />
          </div>
          <div className={styles.toggleRow}>
            <div><div className={styles.toggleLabel}>Payments received</div></div>
            <Toggle on={notifPayments} onToggle={setNotifPayments} />
          </div>
          <div className={styles.toggleRow}>
            <div><div className={styles.toggleLabel}>Overdue invoices</div></div>
            <Toggle on={notifOverdue} onToggle={setNotifOverdue} />
          </div>
          <div className={styles.toggleRow}>
            <div><div className={styles.toggleLabel}>Comments &amp; mentions</div></div>
            <Toggle on={notifComments} onToggle={setNotifComments} />
          </div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Wire signals</div>
              <div className={styles.toggleDesc}>Business intelligence alerts</div>
            </div>
            <Toggle on={notifWire} onToggle={setNotifWire} />
          </div>
        </div>
      </>
    );
  }

  function renderIntegrations() {
    const groups = [
      {
        label: "Payments",
        items: [
          { name: "Stripe", icon: "S", connected: true },
          { name: "PayPal", icon: "P", connected: false },
          { name: "Wise", icon: "W", connected: false },
        ],
      },
      {
        label: "Calendar & Comms",
        items: [
          { name: "Google Calendar", icon: "G", connected: true },
          { name: "Slack", icon: "#", connected: false },
          { name: "Zoom", icon: "Z", connected: false },
        ],
      },
      {
        label: "Storage & Design",
        items: [
          { name: "Google Drive", icon: "D", connected: false },
          { name: "Dropbox", icon: "B", connected: false },
          { name: "Figma", icon: "F", connected: false },
        ],
      },
    ];

    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Integrations</div>
          <div className={styles.secSub}>Connect your favorite tools</div>
        </div>

        {groups.map((g) => (
          <div key={g.label} className={styles.integrationGroup}>
            <div className={styles.integrationGroupLabel}>{g.label}</div>
            <div className={styles.card}>
              {g.items.map((item) => (
                <div key={item.name} className={styles.integrationRow}>
                  <div className={styles.integrationIcon}>{item.icon}</div>
                  <div className={styles.integrationName}>{item.name}</div>
                  <button
                    className={item.connected ? styles.integrationBtnConnected : styles.integrationBtn}
                    type="button"
                  >
                    {item.connected ? "Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  function renderPlan() {
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Plan &amp; Billing</div>
          <div className={styles.secSub}>Manage your subscription and billing</div>
        </div>

        <div className={styles.planGrid}>
          <div className={styles.planCardActive}>
            <div className={styles.planBadge}>Current</div>
            <div className={styles.planName}>Free</div>
            <div className={styles.planPrice}>$0 / month</div>
            <ul className={styles.planFeatures}>
              <li className={styles.planFeature}>3 workspaces</li>
              <li className={styles.planFeature}>Local storage</li>
              <li className={styles.planFeature}>Basic block editor</li>
              <li className={styles.planFeature}>Markdown export</li>
            </ul>
          </div>
          <div className={styles.planCard}>
            <div className={styles.planName}>Pro</div>
            <div className={styles.planPrice}>$12 / month</div>
            <ul className={styles.planFeatures}>
              <li className={styles.planFeature}>Unlimited workspaces</li>
              <li className={styles.planFeature}>Cloud sync</li>
              <li className={styles.planFeature}>Time tracking</li>
              <li className={styles.planFeature}>Invoicing (Stripe)</li>
              <li className={styles.planFeature}>The Wire (business intel)</li>
              <li className={styles.planFeature}>Client portal</li>
            </ul>
            <button className={styles.planBtn} type="button">Upgrade to Pro</button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Revenue summary</div>
          <div className={styles.revenueSummary}>
            <div className={styles.revenueStat}>
              <div className={styles.revenueValue}>$0</div>
              <div className={styles.revenueLabel}>This month</div>
            </div>
            <div className={styles.revenueStat}>
              <div className={styles.revenueValue}>$0</div>
              <div className={styles.revenueLabel}>This quarter</div>
            </div>
            <div className={styles.revenueStat}>
              <div className={styles.revenueValue}>$0</div>
              <div className={styles.revenueLabel}>This year</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderSecurity() {
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Security</div>
          <div className={styles.secSub}>Protect your account</div>
        </div>

        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Change password</label>
            <input className={styles.fieldInput} type="password" placeholder="New password" />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Two-factor authentication</div>
              <div className={styles.toggleDesc}>Add an extra layer of security with TOTP</div>
            </div>
            <Toggle on={twoFa} onToggle={setTwoFa} />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Active sessions</div>
          <div className={styles.sessionRow}>
            <div>
              <div className={styles.sessionDevice}>Chrome on macOS</div>
              <div className={styles.sessionMeta}>San Francisco, CA</div>
            </div>
            <span className={styles.sessionCurrent}>Current</span>
          </div>
          <div className={styles.sessionRow}>
            <div>
              <div className={styles.sessionDevice}>Safari on iPhone</div>
              <div className={styles.sessionMeta}>Last active 2 hours ago</div>
            </div>
            <button className={styles.integrationBtn} type="button">Revoke</button>
          </div>
        </div>

        <div className={styles.dangerZone}>
          <div className={styles.dangerTitle}>Delete account</div>
          <div className={styles.dangerDesc}>
            Permanently remove your account and all associated data. This action cannot be undone.
          </div>
          <button className={styles.dangerBtn} type="button">Delete my account</button>
        </div>
      </>
    );
  }

  function renderData() {
    return (
      <>
        <div className={styles.secHead}>
          <div className={styles.secTitle}>Data &amp; Export</div>
          <div className={styles.secSub}>Export your data or import from other tools</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Export</div>
          <div className={styles.exportGrid}>
            <button className={styles.exportBtn} type="button">
              <span className={styles.exportIcon}>&#128196;</span> Projects &amp; notes
            </button>
            <button className={styles.exportBtn} type="button">
              <span className={styles.exportIcon}>&#128176;</span> Financial data
            </button>
            <button className={styles.exportBtn} type="button">
              <span className={styles.exportIcon}>&#128101;</span> Client list
            </button>
            <button className={styles.exportBtn} type="button">
              <span className={styles.exportIcon}>&#128230;</span> Full backup (ZIP)
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Import from</div>
          <div className={styles.importRow}>
            <button className={styles.importBtn} type="button">HoneyBook</button>
            <button className={styles.importBtn} type="button">Notion</button>
            <button className={styles.importBtn} type="button">CSV</button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Data retention</div>
          <div className={styles.retentionRow}>
            <div className={styles.toggleLabel}>Keep deleted projects for 30 days</div>
            <Toggle on={retainProjects} onToggle={setRetainProjects} />
          </div>
          <div className={styles.retentionRow}>
            <div className={styles.toggleLabel}>Retain financial records indefinitely</div>
            <Toggle on={retainFinancial} onToggle={setRetainFinancial} />
          </div>
        </div>
      </>
    );
  }

  const sectionMap: Record<SectionId, () => React.ReactNode> = {
    appearance: renderAppearance,
    profile: renderProfile,
    business: renderBusiness,
    brand: renderBrand,
    notifications: renderNotifications,
    integrations: renderIntegrations,
    plan: renderPlan,
    security: renderSecurity,
    data: renderData,
  };

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} type="button" aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={styles.topTitle}>Settings</div>
        <span className={styles.saveIndicator}>{dirty ? "Unsaved changes" : "All saved"}</span>
        <button className={styles.saveBtn} onClick={handleSave} type="button">Save Changes</button>
      </div>

      <div className={styles.body}>
        {/* Sidebar navigation */}
        <nav className={styles.sidebar}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className={section === s.id ? styles.sidebarItemActive : styles.sidebarItem}
              onClick={() => setSection(s.id)}
              type="button"
            >
              <span className={styles.sidebarIcon}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <div className={styles.main}>
          {sectionMap[section]()}
        </div>
      </div>
    </div>
  );
}
