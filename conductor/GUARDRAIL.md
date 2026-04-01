# Guardrail — Feature Inventory & Codebase Health

> **Last synced**: 2026-03-31
> **Auto-update rule**: This file MUST be updated in the same commit as any feature add, delete, rename, or move. This is not optional — the AI enforces it as a mandatory post-commit check.

## Codebase Pulse

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Total source files | 192 | <200 OK, 200–400 caution, 400+ split | ⚠️ Approaching caution |
| Total lines of code | ~47,900 | <50K OK, 50–100K caution, 100K+ enterprise | ⚠️ Approaching caution |
| Component directories | 21 | <30 OK, 30–50 caution, 50+ split | ✅ OK |
| Block types registered | 55 | No limit — each lives in its own folder | ✅ OK |
| Types in Block interface | 30+ fields | Verbose but flat — no tangled deps | ✅ OK |
| Shared hotspot files | 7 | Keep minimal | ✅ OK |
| Editor.tsx imports | 25+ | Only real bottleneck — monitor size | ⚠️ Watch |

### Architecture note

Block count is NOT a scaling concern. Every block type is self-contained:
- Own folder (`editor/blocks/`, `editor/money/`, `editor/ai-action/`, etc.)
- Own CSS module
- Own data interface in types.ts
- Own default factory function

The only shared coupling is mechanical boilerplate in 3 places:
1. `Editor.tsx` — import, CONTENT_DEFAULTS entry, contentBlockMap entry
2. `EditorMargin.tsx` — BLOCK_LABELS, BLOCK_LABEL_COLORS
3. `constants.ts` — BLOCK_TYPES registration

This is boilerplate, not complexity. No refactor needed unless Editor.tsx itself becomes hard to navigate (past ~2,500 lines, consider extracting the contentBlockMap into a separate `blockRegistry.ts` file).

### When thresholds are hit:

- **Caution**: Note in session, consider if the metric is actually causing friction
- **Split**: Only if files are genuinely hard to work with — not just because a number is high
- **Enterprise**: When onboarding a new developer would take more than a day to understand the codebase

---

## Enforcement Rules

### On Session Start (automatic)
1. Read this file as part of the brain grounding protocol
2. Run `find dashboard/src -name "*.tsx" -o -name "*.ts" -o -name "*.css" | wc -l` to get file count
3. Run `wc -l` on all source files for line count
4. Compare against thresholds above — flag any that crossed into caution/split
5. Check that the Feature Registry below matches what actually exists on disk

### On Feature Add/Delete (mandatory)
1. Update the Feature Registry table below
2. Update the Block Registry if block types were added/removed
3. Update the Codebase Pulse metrics
4. If a shared hotspot file was modified, note it
5. This update happens in the SAME COMMIT as the feature change — not a follow-up

### On Session Close
1. Verify Feature Registry is current
2. Update the "Last synced" date at the top
3. If any threshold was crossed during the session, note it in HANDOFF.md

---

## Current Top-Level Surfaces

| Surface | Primary Entry | Notes |
|---------|---------------|-------|
| Dashboard shell | `dashboard/src/app/page.tsx` | Main client-side app composition point |
| Share route | `dashboard/src/app/share/[id]/page.tsx` | Public/shared project surface |
| AI generation API | `dashboard/src/app/api/generate/route.ts` | AI request endpoint |
| Share API | `dashboard/src/app/api/share/route.ts` | Share lookup/create/update endpoint |
| Forge Paper | `dashboard/src/components/forge-paper/` | Rail surface — document view for client proposals |

---

## Feature Registry

| Feature | Status | Primary Files | Notes |
|---------|--------|---------------|-------|
| **Workspace shell & nav** | Active | `page.tsx`, `rail/`, `sidebar/`, `dashboard/` | Core frame, workspace switching, rail icons |
| **Editor core** | Active | `editor/Editor.tsx`, `types.ts`, `constants.ts` | Block system, slash menu, format bar, command bar |
| **Editor margin** | Active | `editor/margin/` | Outline, multi-select, context menu, drag reorder |
| **Activity & comments** | Active | `activity/`, `comments/` | Right-side activity margin, comment panel |
| **Calendar** | Active | `calendar/` | Full calendar view, event creation, week view |
| **Templates** | Active | `templates/` | Template picker, save-template, starter templates |
| **Services** | Needs wiring | `services/` | Surface exists, not connected to real data |
| **Share system** | Active | `share/`, `editor/ShareModal.tsx`, API routes | Share creation, PIN protection, public view |
| **Notifications** | Active | `notifications/` | 10 types, avatar/icon, action buttons, 6 filters |
| **Onboarding / Launchpad** | Active | `onboarding/`, `launchpad/` | First-run, workspace creation, creation animation |
| **Search** | Active | `search/` | Cross-workspace content search |
| **Finance** | Active | `finance/`, `editor/money/` | Finance page + money blocks |
| **Pipeline** | Active | `pipeline/` | Pipeline board view |
| **Team** | Active | `team/` | Team collaboration surface |
| **The Wire** | Needs wiring | `wire/` | Competitive intelligence surface |
| **Workspace** | Active | `workspace-page/` | Rail surface — task/project management, list/board/timeline views |
| **Forge Paper** | Active | `forge-paper/` | Rail surface — owns blocks state, document view for client proposals |
| **Terminal Welcome** | Active | `editor/TerminalWelcome.tsx` | Dead-state splash screen |
| **History** | Active | `history/` | Version history modal |
| **Conversations** | Active | `editor/ConversationPanel.tsx` | Left-side conversation panel |

---

## Block Registry

### Text (11)
paragraph, h1, h2, h3, bullet, numbered, todo, quote, code, callout, divider

### Rich Content (9)
table, gallery, accordion, math, swatches, bookmark, canvas, audio, columns

### Visual (12)
graph, beforeafter, deadline, deliverable, visual, timeline, flow, brandboard, moodboard, wireframe, pullquote, drawing

### Animation (5)
hero-spotlight, kinetic-type, number-cascade, stat-reveal, value-counter

### Money (1)
money

### Collaboration (9)
comment-thread, mention, question, feedback, decision, poll, handoff, signoff, annotation

### AI (2)
ai, ai-action

### Unique (6)
pricing-config, scope-boundary, asset-checklist, decision-picker, availability-picker, progress-stream

**Total: 55 block types**

---

## Shared File Hotspots

These files have broad blast radius. Check them when features are added or deleted:

| File | Why it's hot | Impact |
|------|-------------|--------|
| `page.tsx` | App composition, state, all feature imports | Every feature |
| `types.ts` | Block interface, all data types | Every block type |
| `constants.ts` | BLOCK_TYPES, BLOCK_CATEGORIES, STATUS | Every block type |
| `Editor.tsx` | contentBlockMap, CONTENT_DEFAULTS, renderBlock | Every block type |
| `EditorMargin.tsx` | BLOCK_LABELS, BLOCK_LABEL_COLORS | Every block type |
| `Rail.tsx` | Navigation icons | Top-level features |
| `Sidebar.tsx` | Workspace tree, calendar, search | Navigation features |

---

## Change Checklist

Before closing any feature task, confirm:

- [ ] Feature is in the Feature Registry (or marked retired)
- [ ] Block types are in the Block Registry with correct category
- [ ] Primary file paths are current
- [ ] Codebase Pulse metrics are updated
- [ ] Shared hotspot files were checked for consistency
- [ ] If a threshold was crossed, it's noted in HANDOFF.md
- [ ] `CLAUDE.md` and `AGENTS.md` still reference this file

---

## Architecture Signals

**The only real scaling concern is Editor.tsx** — it's the central dispatch for all block types. Everything else is modular by design.

1. **Editor.tsx size** — when it passes ~2,500 lines, extract `contentBlockMap` and `CONTENT_DEFAULTS` into a separate `blockRegistry.ts`. This is the one refactor that will actually help.
2. **Slash menu** — already has BLOCK_CATEGORIES with tabbed navigation. No action needed unless search feels sluggish.
3. **Bundle size** — if initial load gets slow, lazy-load block components that aren't visible on first render (animation blocks, visual blocks, collab blocks are good candidates).
4. **No refactor needed for**: block count, Block interface fields, types.ts size, CSS module count, or component directory count. These are all modular and self-contained.
