# Universal Search — Search Everything

**Created**: 2026-03-29
**Type**: Concept / Pre-Mission
**Milestone**: M1 (basic) → M2 (connected)

---

## Concept

A full-page, Spotlight-style universal search that indexes everything in Felmark: projects, documents, invoices, clients, messages, and commands. Triggered via the search icon in the Rail or `⌘F`. Results are categorized, keyboard-navigable, and show a live preview panel on the right.

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│ [🔍] Search everything...                    [esc] close     │
│ [All 8] [Projects 4] [Docs 3] [Invoices 3] [Clients 3] ... │
├──────────────────────────────┬───────────────────────────────┤
│ PROJECTS                     │ ◆ Projects                    │
│ ▸ Brand Guidelines v2        │ Brand Guidelines v2           │
│   Meridian · 65% · Active    │ Meridian Studio               │
│ ▸ Website Copy               │                               │
│   Meridian · 40% · Review    │ DETAILS                       │
│                              │ Status: 65% · Active          │
│ DOCUMENTS                    │ Last activity: 2m ago         │
│ ▸ Typography Scale v3        │                               │
│   Brand Guidelines · 2847w   │ PREVIEW                       │
│                              │ "Primary & secondary logo     │
│ INVOICES                     │  usage rules, color palette   │
│ ▸ Invoice #047               │  with hex/RGB/CMYK values..." │
│   Meridian · $2,400 · Sent   │                               │
│                              │ [Open]        [Copy Link]     │
└──────────────────────────────┴───────────────────────────────┘
↑↓ navigate · ⏎ open · tab switch category · esc close
```

---

## Features

### Search Input
- Large 18px input with search icon
- Focus ring with ember glow on focus
- Clear button when query present
- Esc to clear, Esc again to close

### Category Tabs
- All, Projects, Documents, Invoices, Clients, Messages, Commands
- Each shows result count
- Filtering preserves keyboard selection

### Results List (Left)
- Grouped by category with section labels
- Each result: icon/avatar, title, subtitle, 2-line preview, breadcrumb path
- Query text highlighted in amber across title/subtitle/preview
- Active item has ember left border + amber background
- Keyboard nav (↑↓) + mouse hover both select

### Preview Panel (Right)
- 360px fixed width
- Type badge (colored dot + label)
- Title (Cormorant Garamond serif, 24px)
- Subtitle
- Details section (status, last activity, contact)
- Content preview (parchment card with body text)
- Breadcrumb path
- Actions: Open, Copy Link

### Recent Searches
- Shown when input is empty and category is "all"
- Last 5 searches with clock icon
- Click to re-run

### Empty/No Results State
- Search icon + "No results for [query]" + suggestion text

---

## Result Types

| Type | Icon | Color | What It Searches |
|------|------|-------|-----------------|
| Projects | ◆ | status color | Name, client, status, progress |
| Documents | ☰ | ember | Title, content, block count |
| Invoices | $ | status color | Number, client, amount, status |
| Clients | ⬡ | workspace color | Name, email, projects, earnings |
| Messages | → | blue | Author, content, conversation |
| Commands | ❯ | ember | Command name, shortcut, description |

---

## Integration Path

### Where It Renders
- Rail search icon → opens search as full editor area view (like Calendar, Pipeline)
- `⌘F` when no document focused → opens search
- `⌘K` stays as command palette (quick actions) — search is the deeper, full-context version

### Data Sources (by Phase)

| Data | M1 Source | M2 Source |
|------|-----------|-----------|
| Projects | Workspace.projects array | Supabase |
| Documents | blocksMap content | Supabase full-text search |
| Invoices | Seed data | Stripe Connect |
| Clients | Workspace metadata | Supabase |
| Messages | Conversation seed data | Supabase Realtime |
| Commands | COMMANDS constant | Dynamic command registry |

---

## Implementation Phases

### Phase 1 (M1) — Static Search
- SearchPage component + CSS module
- Seed data for all result types
- Category tabs, keyboard nav, preview panel
- Renders in editor area when railActive === "search"
- Wire Rail search icon

### Phase 2 (M2) — Connected Search
- Index real workspace/project/block data
- Fuzzy matching (not just includes)
- Recent searches persisted to localStorage
- Search-as-you-type with debounce

### Phase 3 (M3) — Full-Text
- Supabase full-text search across all content
- Ranked results by relevance
- Search within document (jump to block)

---

## Review Notes

### Must Fix Before Integration
- Inline styles → CSS modules
- Remove duplicate `:root` vars and `<link>` font imports
- TypeScript types for Result interface
- `globalIdx` pattern (same as conversations) — compute indexed flat list before render
- `handleKeyDown` Enter case is empty — needs navigation action
- Category count computation re-filters on every render — memoize
- `focused` state hardcoded to `true` in className

### Should Fix
- Tab key should cycle categories (mentioned in footer but not wired)
- No debounce on search input
- Preview panel doesn't scroll for long content
- Highlight function only matches first occurrence

### Design Decisions
- Full-page view (not modal) — search is a destination, not a flyover
- Preview panel gives context without navigating — reduces round trips
- Commands in search results means `⌘F` can replace `⌘K` for power users
- Breadcrumb paths help disambiguate ("Typography Scale" in which project?)

---

## Prototype Code

### Data

```jsx
const CATEGORIES = [
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

const RESULTS = [
  // Projects
  { id: "r1", type: "projects", icon: "◆", color: "#5a9a3c", title: "Brand Guidelines v2", subtitle: "Meridian Studio", meta: "65% · Active · Due Apr 3", preview: "Primary & secondary logo usage rules, color palette with hex/RGB/CMYK values, typography scale & font pairings...", lastEdited: "2m ago", path: "Meridian Studio / Brand Guidelines v2" },
  { id: "r2", type: "projects", icon: "◆", color: "#b07d4f", title: "Website Copy", subtitle: "Meridian Studio", meta: "40% · In Review · Due Apr 8", preview: "Homepage hero copy, about page narrative, service descriptions for branding, strategy, and design...", lastEdited: "Yesterday", path: "Meridian Studio / Website Copy" },
  { id: "r3", type: "projects", icon: "◆", color: "#c24b38", title: "App Onboarding UX", subtitle: "Bolt Fitness", meta: "70% · Overdue · 4 days", preview: "Welcome flow, profile setup, workout preference quiz, first session scheduling, push notification opt-in...", lastEdited: "3 days ago", path: "Bolt Fitness / App Onboarding UX" },
  { id: "r4", type: "projects", icon: "◆", color: "#5a9a3c", title: "Course Landing Page", subtitle: "Nora Kim", meta: "25% · Active · Due Apr 12", preview: "Hero section with social proof, curriculum breakdown, instructor bio, testimonials carousel, pricing...", lastEdited: "Today", path: "Nora Kim / Course Landing Page" },

  // Documents
  { id: "r5", type: "docs", icon: "☰", color: "#b07d4f", title: "Typography Scale v3", subtitle: "Brand Guidelines v2", meta: "12 blocks · 2,847 words", preview: "Using Outfit Variable (single file, full weight range). Font scale: 12 / 14 / 16 / 20 / 24 / 32 / 40. Line height: 1.5 for body, 1.25 for headings.", lastEdited: "2m ago", path: "Meridian Studio / Brand Guidelines v2 / Typography" },
  { id: "r6", type: "docs", icon: "☰", color: "#7c8594", title: "Mood Board — Final", subtitle: "Brand Guidelines v2", meta: "8 blocks · 3 images", preview: "Warm earth tones, textured paper feel, modern serif meets monospace. References: Aesop, Kinfolk, Cereal Magazine.", lastEdited: "Yesterday", path: "Meridian Studio / Brand Guidelines v2 / Mood Board" },
  { id: "r7", type: "docs", icon: "☰", color: "#8a7e63", title: "Discovery Call Notes", subtitle: "Nora Kim", meta: "Meeting notes · Mar 25", preview: "Nora wants 'warm but professional' feel. Budget flexible. Timeline: 4 weeks. Key deliverable is the landing page.", lastEdited: "4 days ago", path: "Nora Kim / Discovery Call Notes" },

  // Invoices
  { id: "r8", type: "invoices", icon: "$", color: "#5a9a3c", title: "Invoice #047", subtitle: "Meridian Studio · $2,400", meta: "Sent · Viewed 2x", preview: "Brand Guidelines v2 — 50% deposit. Net 15. Due Apr 13.", lastEdited: "3h ago", path: "Meridian Studio / Invoices / #047" },
  { id: "r9", type: "invoices", icon: "$", color: "#c24b38", title: "Invoice #044", subtitle: "Bolt Fitness · $4,000", meta: "Overdue · 4 days", preview: "App Onboarding UX — full project fee. Net 15. Was due Mar 25.", lastEdited: "4 days ago", path: "Bolt Fitness / Invoices / #044" },
  { id: "r10", type: "invoices", icon: "$", color: "#7c8594", title: "Invoice #046", subtitle: "Nora Kim · $1,800", meta: "Paid · Mar 15", preview: "Retainer (March) — monthly coaching content support.", lastEdited: "Mar 15", path: "Nora Kim / Invoices / #046" },

  // Clients
  { id: "r11", type: "clients", icon: "⬡", color: "#7c8594", title: "Meridian Studio", subtitle: "sarah@meridianstudio.co", meta: "4 projects · $12.4k earned", preview: "Design & Branding · Client since Oct 2025 · Rate: $95/hr", lastEdited: "Active", path: "Workspaces / Meridian Studio", avatar: "M", avatarBg: "#7c8594" },
  { id: "r12", type: "clients", icon: "⬡", color: "#a08472", title: "Nora Kim", subtitle: "nora@coachkim.com", meta: "2 projects · $4.8k earned", preview: "Coaching · Client since Feb 2026 · Rate: $95/hr", lastEdited: "Active", path: "Workspaces / Nora Kim", avatar: "N", avatarBg: "#a08472" },
  { id: "r13", type: "clients", icon: "⬡", color: "#8a7e63", title: "Bolt Fitness", subtitle: "team@boltfit.co", meta: "2 projects · $4.8k earned", preview: "Fitness Tech · Client since Jan 2026 · Rate: $95/hr", lastEdited: "Overdue", path: "Workspaces / Bolt Fitness", avatar: "B", avatarBg: "#8a7e63" },

  // Messages
  { id: "r14", type: "messages", icon: "→", color: "#5b7fa4", title: "Sarah Chen", subtitle: "Brand Guidelines v2 · 2m ago", meta: "Comment", preview: "Can we make the logo usage section more specific? I want exact minimum sizes.", path: "Meridian Studio / Brand Guidelines v2 / Comments", avatar: "S", avatarBg: "#8a7e63" },
  { id: "r15", type: "messages", icon: "→", color: "#5b7fa4", title: "Jamie Park", subtitle: "Brand Guidelines v2 · 15m ago", meta: "Comment", preview: "I'd suggest adding a 'don't' section with misuse examples.", path: "Meridian Studio / Brand Guidelines v2 / Comments", avatar: "J", avatarBg: "#7c8594" },
  { id: "r16", type: "messages", icon: "→", color: "#5b7fa4", title: "Nora Kim", subtitle: "Direct message · Yesterday", meta: "DM", preview: "Love the direction! Can we add a testimonial section?", path: "Direct Messages / Nora Kim", avatar: "N", avatarBg: "#a08472" },

  // Commands
  { id: "r17", type: "commands", icon: "❯", color: "var(--ember)", title: "New proposal", meta: "⌘⇧P", preview: "Create a new proposal from template", path: "Command" },
  { id: "r18", type: "commands", icon: "❯", color: "var(--ember)", title: "New invoice", meta: "⌘⇧I", preview: "Generate and send an invoice", path: "Command" },
  { id: "r19", type: "commands", icon: "❯", color: "var(--ember)", title: "Switch workspace", meta: "⌘J", preview: "Jump to another client workspace", path: "Command" },
  { id: "r20", type: "commands", icon: "❯", color: "var(--ember)", title: "Open calendar", meta: "⌘⇧C", preview: "View today's schedule", path: "Command" },
];
```

### Component

```jsx
import { useState, useEffect, useRef } from "react";

export default function FelmarkSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showRecent, setShowRecent] = useState(true);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.trim()
    ? RESULTS.filter(r => {
        const matchesCategory = category === "all" || r.type === category;
        const matchesQuery = [r.title, r.subtitle, r.preview, r.meta, r.path]
          .filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      })
    : category === "all"
      ? RESULTS.slice(0, 8)
      : RESULTS.filter(r => r.type === category);

  const selected = filtered[selectedIdx];

  useEffect(() => { setSelectedIdx(0); }, [query, category]);

  useEffect(() => {
    if (!resultsRef.current) return;
    const el = resultsRef.current.querySelector(".sr-item.on");
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && selected) { /* navigate to selected */ }
    else if (e.key === "Escape") { setQuery(""); }
  };

  const groupedResults = () => {
    if (category !== "all") return [{ type: category, items: filtered }];
    const groups = [];
    const seen = new Set();
    filtered.forEach(r => {
      if (!seen.has(r.type)) { seen.add(r.type); groups.push({ type: r.type, items: [] }); }
      groups.find(g => g.type === r.type).items.push(r);
    });
    return groups;
  };

  // Full render: search input, category tabs, grouped results list,
  // preview panel, recent searches, no-results state, footer with keyboard hints
}
```

### Prototype Styles

```css
/* Search page — full viewport */
.search-page { height: 100vh; display: flex; flex-direction: column; }

/* Input — large, focused, with ember glow */
.sh-input-row { padding: 14px 20px; background: #fff; border: 1px solid var(--warm-200); border-radius: 12px; }
.sh-input-row.focused { border-color: var(--ember); box-shadow: 0 0 0 4px rgba(176,125,79,0.04); }
.sh-input { font-size: 18px; }

/* Category tabs — pill style */
.sh-cat { padding: 6px 14px; border-radius: 5px; }
.sh-cat.on { background: var(--ink-900); color: var(--parchment); }

/* Content — two-column: results list + preview panel */
.search-content { flex: 1; display: flex; overflow: hidden; }
.sr-list { flex: 1; overflow-y: auto; border-right: 1px solid var(--warm-100); }
.sr-preview-panel { width: 360px; flex-shrink: 0; background: var(--warm-50); }

/* Result items — left border highlight on active */
.sr-item { border-left: 2px solid transparent; }
.sr-item.on { background: var(--ember-bg); border-left-color: var(--ember); }

/* Query highlighting */
.sr-highlight { background: rgba(176,125,79,0.12); border-radius: 2px; color: var(--ink-700); }

/* Preview panel — serif title, card preview, actions */
.srp-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; }
.srp-content { background: var(--parchment); border: 1px solid var(--warm-200); border-radius: 8px; }

/* Footer — keyboard hint strip */
.search-footer { font-family: var(--mono); font-size: 10px; border-top: 1px solid var(--warm-200); }
```
