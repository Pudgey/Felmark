"use client";

import { useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from "react";
import type { Workstation } from "@/lib/types";
import styles from "./SearchPage.module.css";

// ── Types ──

interface SearchResult {
  id: string;
  type: string;
  icon: string;
  color: string;
  title: string;
  subtitle?: string;
  meta?: string;
  preview: string;
  lastEdited?: string;
  path: string;
  avatar?: string;
  avatarBg?: string;
  contact?: string;
}

interface Category {
  id: string;
  label: string;
  icon: string | null;
}

// ── Data ──

const CATEGORIES: Category[] = [
  { id: "all", label: "All", icon: null },
  { id: "projects", label: "Projects", icon: "◆" },
  { id: "docs", label: "Documents", icon: "☰" },
  { id: "invoices", label: "Invoices", icon: "$" },
  { id: "clients", label: "Clients", icon: "⬡" },
  { id: "messages", label: "Messages", icon: "→" },
  { id: "commands", label: "Commands", icon: "❯" },
];

const RECENT_SEARCHES = [
  "brand guidelines typography",
  "bolt fitness invoice",
  "nora proposal",
];

const RESULTS: SearchResult[] = [
  { id: "r1", type: "projects", icon: "◆", color: "#5a9a3c", title: "Brand Guidelines v2", subtitle: "Meridian Studio", meta: "65% · Active · Due Apr 3", preview: "Primary & secondary logo usage rules, color palette with hex/RGB/CMYK values, typography scale & font pairings...", lastEdited: "2m ago", path: "Meridian Studio / Brand Guidelines v2" },
  { id: "r2", type: "projects", icon: "◆", color: "#b07d4f", title: "Website Copy", subtitle: "Meridian Studio", meta: "40% · In Review · Due Apr 8", preview: "Homepage hero copy, about page narrative, service descriptions for branding, strategy, and design...", lastEdited: "Yesterday", path: "Meridian Studio / Website Copy" },
  { id: "r3", type: "projects", icon: "◆", color: "#c24b38", title: "App Onboarding UX", subtitle: "Bolt Fitness", meta: "70% · Overdue · 4 days", preview: "Welcome flow, profile setup, workout preference quiz, first session scheduling, push notification opt-in...", lastEdited: "3 days ago", path: "Bolt Fitness / App Onboarding UX" },
  { id: "r4", type: "projects", icon: "◆", color: "#5a9a3c", title: "Course Landing Page", subtitle: "Nora Kim", meta: "25% · Active · Due Apr 12", preview: "Hero section with social proof, curriculum breakdown, instructor bio, testimonials carousel, pricing...", lastEdited: "Today", path: "Nora Kim / Course Landing Page" },

  { id: "r5", type: "docs", icon: "☰", color: "#b07d4f", title: "Typography Scale v3", subtitle: "Brand Guidelines v2", meta: "12 blocks · 2,847 words", preview: "Using Outfit Variable (single file, full weight range). Font scale: 12 / 14 / 16 / 20 / 24 / 32 / 40.", lastEdited: "2m ago", path: "Meridian Studio / Brand Guidelines v2 / Typography" },
  { id: "r6", type: "docs", icon: "☰", color: "#7c8594", title: "Mood Board — Final", subtitle: "Brand Guidelines v2", meta: "8 blocks · 3 images", preview: "Warm earth tones, textured paper feel, modern serif meets monospace. References: Aesop, Kinfolk, Cereal Magazine.", lastEdited: "Yesterday", path: "Meridian Studio / Brand Guidelines v2 / Mood Board" },
  { id: "r7", type: "docs", icon: "☰", color: "#8a7e63", title: "Discovery Call Notes", subtitle: "Nora Kim", meta: "Meeting notes · Mar 25", preview: "Nora wants 'warm but professional' feel. Budget flexible. Timeline: 4 weeks.", lastEdited: "4 days ago", path: "Nora Kim / Discovery Call Notes" },

  { id: "r8", type: "invoices", icon: "$", color: "#5a9a3c", title: "Invoice #047", subtitle: "Meridian Studio · $2,400", meta: "Sent · Viewed 2x", preview: "Brand Guidelines v2 — 50% deposit. Net 15. Due Apr 13.", lastEdited: "3h ago", path: "Meridian Studio / Invoices / #047" },
  { id: "r9", type: "invoices", icon: "$", color: "#c24b38", title: "Invoice #044", subtitle: "Bolt Fitness · $4,000", meta: "Overdue · 4 days", preview: "App Onboarding UX — full project fee. Net 15. Was due Mar 25.", lastEdited: "4 days ago", path: "Bolt Fitness / Invoices / #044" },
  { id: "r10", type: "invoices", icon: "$", color: "#7c8594", title: "Invoice #046", subtitle: "Nora Kim · $1,800", meta: "Paid · Mar 15", preview: "Retainer (March) — monthly coaching content support.", lastEdited: "Mar 15", path: "Nora Kim / Invoices / #046" },

  { id: "r11", type: "clients", icon: "⬡", color: "#7c8594", title: "Meridian Studio", subtitle: "sarah@meridianstudio.co", meta: "4 projects · $12.4k earned", preview: "Design & Branding · Client since Oct 2025 · Rate: $95/hr", lastEdited: "Active", path: "Workstations / Meridian Studio", avatar: "M", avatarBg: "#7c8594" },
  { id: "r12", type: "clients", icon: "⬡", color: "#a08472", title: "Nora Kim", subtitle: "nora@coachkim.com", meta: "2 projects · $4.8k earned", preview: "Coaching · Client since Feb 2026 · Rate: $95/hr", lastEdited: "Active", path: "Workstations / Nora Kim", avatar: "N", avatarBg: "#a08472" },
  { id: "r13", type: "clients", icon: "⬡", color: "#8a7e63", title: "Bolt Fitness", subtitle: "team@boltfit.co", meta: "2 projects · $4.8k earned", preview: "Fitness Tech · Client since Jan 2026 · Rate: $95/hr", lastEdited: "Overdue", path: "Workstations / Bolt Fitness", avatar: "B", avatarBg: "#8a7e63" },

  { id: "r14", type: "messages", icon: "→", color: "#5b7fa4", title: "Sarah Chen", subtitle: "Brand Guidelines v2 · 2m ago", meta: "Comment", preview: "Can we make the logo usage section more specific? I want exact minimum sizes.", path: "Meridian Studio / Brand Guidelines v2 / Comments", avatar: "S", avatarBg: "#8a7e63" },
  { id: "r15", type: "messages", icon: "→", color: "#5b7fa4", title: "Jamie Park", subtitle: "Brand Guidelines v2 · 15m ago", meta: "Comment", preview: "I'd suggest adding a 'don't' section with misuse examples.", path: "Meridian Studio / Brand Guidelines v2 / Comments", avatar: "J", avatarBg: "#7c8594" },
  { id: "r16", type: "messages", icon: "→", color: "#5b7fa4", title: "Nora Kim", subtitle: "Direct message · Yesterday", meta: "DM", preview: "Love the direction! Can we add a testimonial section?", path: "Direct Messages / Nora Kim", avatar: "N", avatarBg: "#a08472" },

  { id: "r17", type: "commands", icon: "❯", color: "var(--ember)", title: "New proposal", meta: "⌘⇧P", preview: "Create a new proposal from template", path: "Command" },
  { id: "r18", type: "commands", icon: "❯", color: "var(--ember)", title: "New invoice", meta: "⌘⇧I", preview: "Generate and send an invoice", path: "Command" },
  { id: "r19", type: "commands", icon: "❯", color: "var(--ember)", title: "Switch workstation", meta: "⌘J", preview: "Jump to another client workstation", path: "Command" },
  { id: "r20", type: "commands", icon: "❯", color: "var(--ember)", title: "Open calendar", meta: "⌘⇧C", preview: "View today's schedule", path: "Command" },
];

// ── Component ──

interface SearchPageProps {
  workstations: Workstation[];
}

export default function SearchPage({ workstations }: SearchPageProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showRecent, setShowRecent] = useState(true);
  const [focused, setFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // Filter results
  const filtered = useMemo(() => {
    if (query.trim()) {
      return RESULTS.filter(r => {
        const matchesCat = category === "all" || r.type === category;
        const matchesQuery = [r.title, r.subtitle, r.preview, r.meta, r.path]
          .filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase());
        return matchesCat && matchesQuery;
      });
    }
    return category === "all" ? RESULTS.slice(0, 8) : RESULTS.filter(r => r.type === category);
  }, [query, category]);

  const selected = filtered[selectedIdx];

  // Reset selection on filter/query change
  useEffect(() => { setSelectedIdx(0); }, [query, category]);

  // Scroll selected into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const items = resultsRef.current.querySelectorAll(`[data-selected="true"]`);
    if (items[0]) (items[0] as HTMLElement).scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  // Category counts
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const q = query.toLowerCase();
    CATEGORIES.forEach(c => {
      if (c.id === "all") {
        counts[c.id] = q ? RESULTS.filter(r => [r.title, r.subtitle, r.preview].filter(Boolean).join(" ").toLowerCase().includes(q)).length : RESULTS.length;
      } else {
        counts[c.id] = RESULTS.filter(r => r.type === c.id).filter(r => !q || [r.title, r.subtitle, r.preview].filter(Boolean).join(" ").toLowerCase().includes(q)).length;
      }
    });
    return counts;
  }, [query]);

  // Group results
  const groups = useMemo(() => {
    if (category !== "all") return [{ type: category, items: filtered }];
    const g: { type: string; items: SearchResult[] }[] = [];
    const seen = new Set<string>();
    filtered.forEach(r => {
      if (!seen.has(r.type)) { seen.add(r.type); g.push({ type: r.type, items: [] }); }
      g.find(gr => gr.type === r.type)!.items.push(r);
    });
    return g;
  }, [filtered, category]);

  // Flat indexed list for keyboard nav
  const flatList = useMemo(() => groups.flatMap(g => g.items), [groups]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, flatList.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Escape") { setQuery(""); setShowRecent(true); }
  }, [flatList.length]);

  const getCategoryLabel = (type: string) => CATEGORIES.find(c => c.id === type)?.label || type;

  // Highlight query in text
  const highlightText = useCallback((text: string | undefined): ReactNode => {
    if (!query || !text) return text || "";
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return <>{text.slice(0, idx)}<span className={styles.highlight}>{text.slice(idx, idx + query.length)}</span>{text.slice(idx + query.length)}</>;
  }, [query]);

  // Determine preview value color
  const previewValClass = (meta: string | undefined) => {
    if (!meta) return "";
    if (meta.includes("Overdue")) return styles.previewValRed;
    if (meta.includes("Active") || meta.includes("Paid")) return styles.previewValGreen;
    return styles.previewValEmber;
  };

  let globalIdx = -1;

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={`${styles.inputRow} ${focused ? styles.inputRowFocused : ""}`}>
          <span className={styles.inputIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search everything..."
            value={query}
            onChange={e => { setQuery(e.target.value); setShowRecent(false); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => { setQuery(""); setShowRecent(true); inputRef.current?.focus(); }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          )}
          <div className={styles.hints}>
            <span className={styles.kbd}>esc</span>
            <span style={{ color: "var(--warm-300)", fontSize: 10 }}>clear</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className={styles.cats}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} className={`${styles.cat} ${category === cat.id ? styles.catOn : ""}`} onClick={() => setCategory(cat.id)}>
              {cat.icon && <span className={styles.catIcon}>{cat.icon}</span>}
              {cat.label}
              <span className={styles.catCount}>{catCounts[cat.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Results list */}
        <div className={styles.list} ref={resultsRef}>
          {/* Recent searches */}
          {!query && showRecent && category === "all" && (
            <div className={styles.recent}>
              <div className={styles.recentLabel}>recent searches</div>
              {RECENT_SEARCHES.map((s, i) => (
                <div key={i} className={styles.recentItem} onClick={() => { setQuery(s); setShowRecent(false); }}>
                  <span className={styles.recentIcon}>↻</span>
                  <span className={styles.recentText}>{s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Grouped results */}
          {filtered.length > 0 ? (
            groups.map(group => (
              <div key={group.type}>
                <div className={styles.groupLabel}>{getCategoryLabel(group.type)}</div>
                {group.items.map(r => {
                  globalIdx++;
                  const isOn = globalIdx === selectedIdx;
                  const thisIdx = globalIdx;

                  return (
                    <div
                      key={r.id}
                      className={`${styles.item} ${isOn ? styles.itemOn : ""}`}
                      data-selected={isOn ? "true" : "false"}
                      onClick={() => setSelectedIdx(thisIdx)}
                      onMouseEnter={() => setSelectedIdx(thisIdx)}
                    >
                      {r.avatar ? (
                        <div className={`${styles.itemIcon} ${styles.itemIconAvatar}`} style={{ background: r.avatarBg }}>{r.avatar}</div>
                      ) : (
                        <div className={`${styles.itemIcon} ${styles.itemIconSymbol}`} style={{ color: r.color, background: r.color + "08", borderColor: r.color + "18" }}>{r.icon}</div>
                      )}
                      <div className={styles.itemBody}>
                        <div className={styles.itemTitleRow}>
                          <span className={styles.itemTitle}>{highlightText(r.title)}</span>
                          <span className={styles.itemMeta}>{r.meta}</span>
                        </div>
                        {r.subtitle && <div className={styles.itemSubtitle}>{highlightText(r.subtitle)}</div>}
                        <div className={styles.itemPreview}>{highlightText(r.preview)}</div>
                        <div className={styles.itemPath}>
                          {r.path.split(" / ").map((seg, si, arr) => (
                            <span key={si}>{seg}{si < arr.length - 1 && <span className={styles.pathSep}> / </span>}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : query ? (
            <div className={styles.noResults}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.3 }}><circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M21 21l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M10 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              <div className={styles.noResultsText}>No results for &ldquo;{query}&rdquo;</div>
              <div className={styles.noResultsSub}>Try a different search term or category</div>
            </div>
          ) : null}
        </div>

        {/* Preview panel */}
        <div className={styles.preview}>
          {selected ? (
            <>
              <div className={styles.previewHeader}>
                <div className={styles.previewType} style={{ color: selected.color }}>
                  <span className={styles.previewTypeDot} style={{ background: selected.color }} />
                  {getCategoryLabel(selected.type)}
                </div>
                <div className={styles.previewTitle}>{selected.title}</div>
                {selected.subtitle && <div className={styles.previewSubtitle}>{selected.subtitle}</div>}
              </div>

              <div className={styles.previewSection}>details</div>
              {selected.meta && (
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Status</span>
                  <span className={`${styles.previewVal} ${previewValClass(selected.meta)}`}>{selected.meta}</span>
                </div>
              )}
              {selected.lastEdited && (
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Last activity</span>
                  <span className={styles.previewVal}>{selected.lastEdited}</span>
                </div>
              )}

              <div className={styles.previewSection}>preview</div>
              <div className={styles.previewContent}>{selected.preview}</div>

              <div className={styles.previewPath}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8V2h4l2 2v4H2z" stroke="currentColor" strokeWidth="0.8" /></svg>
                {selected.path}
              </div>

              <div className={styles.previewActions}>
                <button className={`${styles.previewBtn} ${styles.previewBtnPrimary}`}>Open</button>
                <button className={`${styles.previewBtn} ${styles.previewBtnGhost}`}>Copy Link</button>
              </div>
            </>
          ) : (
            <div className={styles.previewEmpty}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ opacity: 0.3 }}><circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.2" /><path d="M24 24l8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
              <div className={styles.previewEmptyText}>Select a result to preview</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerHints}>
          <div className={styles.footerHint}><span className={styles.kbd}>↑↓</span> navigate</div>
          <div className={styles.footerHint}><span className={styles.kbd}>⏎</span> open</div>
          <div className={styles.footerHint}><span className={styles.kbd}>tab</span> category</div>
          <div className={styles.footerHint}><span className={styles.kbd}>esc</span> clear</div>
        </div>
        <span>{filtered.length} results</span>
      </div>
    </div>
  );
}
