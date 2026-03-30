# Neovim-Inspired Editor Features

**Status:** Concept
**Created:** 2026-03-30
**Priority:** TBD — post-MVP enhancement candidates

---

## High Value

### Marks / Jump List
- `m` to bookmark a spot in a doc, backtick to jump back
- "Recent positions" ring lets you bounce between docs without losing your place
- Freelancers work across 10+ docs daily — this saves real context-switching pain

### Registers / Clipboard Ring
- Keep last ~10 copied things instead of one clipboard
- Paste with a picker popup
- Freelancers constantly copy client names, amounts, dates between docs

### Split Panes
- View two docs side-by-side within the editor area
- Compare proposal draft against signed contract
- Reference meeting notes while writing scope doc
- Neovim's `:vsplit` is one of its most-used features for a reason
- **Recommended as first build** — solves biggest pain point

### Macros / Quick Actions
- Record a sequence ("insert date, add client name, format as invoice line") and replay
- Not full Vim macros — "record my last 5 actions and replay them"
- Genuinely unique in the freelancer tool space

### Telescope / Fuzzy Content Search
- Fuzzy search across all doc *content*, not just names
- "Find the paragraph where I mentioned the $4,000 retainer" across all workspaces
- Builds on existing Cmd+K Command Palette but goes deeper
- **Recommended as first build** alongside split panes

### Minimap / Breadcrumb Trail
- Treesitter-style breadcrumbs in header: "Contract > Section 3 > Payment Terms"
- Builds on existing Document Spine
- Helps orientation in long documents

---

## Cool but Lower Priority

### Zen Mode
- Strip everything (sidebar, rail, tabs, margins) and center the doc
- One keybind to toggle
- Writers love this

### Diff View
- Proper inline diff (green/red lines) for comparing doc versions
- Builds on existing History Modal
- Powerful for contract revisions

### Folding
- Collapse sections by heading
- Long proposals become scannable
- Click H2 to fold everything under it

### Leap / Quick-Nav
- Type two characters to jump anywhere visible
- Faster than scrolling for power users

### Which-Key
- Press a leader key, show popup of what follows
- "Space" leader that shows "s = split, m = mark, z = zen"
- Lowers learning curve for all keybinds
- Builds on existing slash menu pattern

---

## What NOT to Steal

- **Modal editing** (normal/insert/visual) — users aren't Vim people
- **Statusline** with git branch/encoding/filetype — too dev-focused
- **LSP/autocomplete** — not relevant to document editing
- **Plugin ecosystem** — too early, adds complexity

---

## Recommended Build Order

1. **Split panes** + **Fuzzy content search** — solve the biggest pain point (working across multiple client docs simultaneously), make Felmark feel like a power tool
2. **Marks / jump list** + **Clipboard ring** — quick wins, high daily utility
3. **Zen mode** + **Folding** — writing experience polish
4. **Which-key** + **Macros** — power user layer
