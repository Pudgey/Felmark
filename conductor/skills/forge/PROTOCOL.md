# Forge — Dependency Map & Architecture Scanner

> **Non-negotiable**: This skill maintains the living dependency map of the codebase. FORGE.md must exist and be current. Any session that adds, removes, or restructures files must run Forge before closing — or at minimum verify the map is still accurate.

## Purpose

As the codebase grows, no human or AI can hold the full dependency graph in their head. Forge builds a machine-readable map from actual code — not memory, not guesses, not documentation that drifts. The AI reads FORGE.md before touching code so it knows exactly where everything is, what imports what, and what breaks if something changes.

**The anti-hallucination contract:** Every path, every import, every line number in FORGE.md was verified by scanning disk. If it's in the map, it exists. If it's not in the map, it either doesn't exist or the map is stale and must be rebuilt.

---

## The Artifact: `conductor/FORGE.md`

A single file. Machine-readable. Human-scannable. Updated by scanning, never by guessing.

### Sections:

```
## Pulse
File count, line count, component count, block count — with timestamp

## Route Map
Every page route → what it renders → key props/state

## Dependency Chains
Hotspot files ranked by import count (types.ts, constants.ts, Editor.tsx, etc.)
Each with: number of importers, list of importers

## Block Registry
Every block type → component file:line → data types → CSS module → slash command
Sorted by category (Text, Content, Visual, Animation, Collab, AI, Unique)

## Shared Components & Hooks
Everything in shared/ → who uses it → usage count

## Feature Map
Each feature folder → what it contains → what it imports from outside itself
```

---

## Execution Protocol

### Phase 1: Scan (automated — no guessing)

Every data point comes from disk. The commands:

```bash
# File inventory
find dashboard/src -name "*.tsx" -o -name "*.ts" -o -name "*.css" | wc -l
find dashboard/src -name "*.tsx" -o -name "*.ts" -o -name "*.css" | xargs wc -l | tail -1

# Route map
find dashboard/src/app -name "page.tsx" -o -name "route.ts"

# Import graph for hotspot files
grep -rl "from.*types" dashboard/src --include="*.tsx" --include="*.ts" | wc -l
grep -rl "from.*constants" dashboard/src --include="*.tsx" --include="*.ts" | wc -l
grep -rl "from.*Editor" dashboard/src --include="*.tsx" --include="*.ts" | wc -l

# Block registry
grep "type:" dashboard/src/lib/constants.ts  # All registered block types
grep -n "contentBlockMap" dashboard/src/components/editor/Editor.tsx  # All rendered blocks
grep -n "CONTENT_DEFAULTS" dashboard/src/components/editor/Editor.tsx  # All default data

# Shared usage
for f in dashboard/src/components/shared/*.tsx dashboard/src/components/shared/*.ts; do
  name=$(basename "$f" | sed 's/\..*//')
  count=$(grep -rl "$name" dashboard/src --include="*.tsx" --include="*.ts" | grep -v "$f" | wc -l)
  echo "$name: $count importers"
done

# Feature folders
ls -d dashboard/src/components/*/
```

### Phase 2: Diff (compare against existing FORGE.md)

If FORGE.md already exists:
1. Compare file count — if delta > 5%, flag as significant growth
2. Compare block count — if new blocks exist that aren't in the map, flag
3. Compare route count — if new routes exist, flag
4. Check for deleted files still listed in the map — remove them
5. Check for new files not in the map — add them

If FORGE.md doesn't exist: generate from scratch (first run).

### Phase 3: Update (regenerate FORGE.md)

Rewrite FORGE.md with current scan data. Every section regenerated from commands above.

Rules for the update:
- **Never carry forward stale data** — if a file was deleted, it's gone from the map
- **Never add a file that doesn't exist on disk** — if the scan didn't find it, it doesn't go in
- **Include line numbers** — `CollabBlocks.tsx:473` not just `CollabBlocks.tsx`
- **Include counts** — `types.ts → 85 importers` not just `types.ts → many importers`
- **Timestamp the scan** — `Last forged: 2026-03-31 11:42 EDT`

### Phase 4: Verify (anti-hallucination check)

After regenerating FORGE.md, verify:

```bash
# Every file path in FORGE.md exists on disk
grep -oP '`[^`]+\.tsx`' conductor/FORGE.md | tr -d '`' | while read f; do
  [ ! -f "dashboard/src/$f" ] && [ ! -f "$f" ] && echo "MISSING: $f"
done

# File count in FORGE.md matches actual count
# Block count in FORGE.md matches constants.ts count
# Route count matches actual page/route files
```

If any verification fails: fix the map, don't ship it broken.

---

## Cascading Change Protocol

When Forge detects a change that cascades across 5+ files:

1. **Do NOT execute directly** — generate a sprint plan instead
2. **Sprint format:**
   ```
   Task 1: Update types.ts (source of change)
   Task 2: Update constants.ts (depends on types)
   Task 3: Update Editor.tsx (depends on types + constants)
   Task 4–N: Update each consumer file
   Verify: Build + type check after each task
   ```
3. **Hand off to /sprint** for execution with verification between each step
4. **Never batch more than 5 file changes without a build check**

This prevents the "AI changed 20 files and broke 3 of them silently" failure mode.

---

## When to Run Forge

### Mandatory (non-negotiable)
- **After any session that created or deleted files** — the map must match reality
- **Before any refactor mission** — know the full dependency graph first
- **Before handing codebase to a new developer or AI** — the map is their entry point

### Recommended
- **Weekly** — catch drift before it compounds
- **After a sprint** — many files change, map needs refresh
- **When the AI seems confused about file locations** — stale map is the likely cause

### Skip if
- Session was purely conversational
- Only modified content within existing files (no structural changes)

---

## Integration with Other Skills

| Skill | How Forge Connects |
|-------|--------------------|
| `/brain` | Brain loads project context. Forge loads structural context. Brain reads FORGE.md as part of grounding. |
| `/sprint` | Forge generates sprint tasks for cascading changes. Sprint executes them. |
| `/super-brain` | Super-brain compares our structure against open source. Forge provides our structure. |
| `/housekeeping` | Housekeeping cleans dead code. Forge identifies orphaned files and broken import chains. |
| `/refactor` | Refactor moves code. Forge maps what needs to move and what depends on it. |
| `/guardrail` | Guardrail tracks features and metrics. Forge tracks the actual file-level dependency graph beneath those features. |

---

## FORGE.md Format

```markdown
# Forge — Dependency Map
> Last forged: YYYY-MM-DD HH:MM
> Codebase: X files, ~Y,000 lines

## Route Map
| Route | Entry File | Renders |
|-------|-----------|---------|
| / | app/page.tsx | Editor, Sidebar, Rail, Launchpad |
| /share/[id] | app/share/[id]/page.tsx | ShareView |
| /api/generate | app/api/generate/route.ts | AI endpoint |
| /api/share | app/api/share/route.ts | Share CRUD |

## Hotspot Files (imported by 10+)
| File | Importers | Risk Level |
|------|-----------|-----------|
| lib/types.ts | 85 | Critical — change cascades everywhere |
| lib/constants.ts | 12 | High — block registry |
| editor/Editor.tsx | 1 (page.tsx) but imports 54 | High — central hub |

## Block Registry
| Type | Component | File:Line | Data Type | CSS | Slash |
|------|-----------|-----------|-----------|-----|-------|
| signoff | SignoffBlock | CollabBlocks.tsx:473 | SignoffData | CollabBlocks.module.css | /esign |
| timeline | TimelineBlock | VisualBlocks.tsx:12 | TimelineBlockData | VisualBlocks.module.css | /timeline |
| ... | ... | ... | ... | ... | ... |

## Shared Components & Hooks
| Name | File | Used By | Count |
|------|------|---------|-------|
| DueDatePicker | shared/DueDatePicker.tsx | Sidebar, DeadlineBlock, CalendarFull | 3 |
| ErrorBoundary | shared/ErrorBoundary.tsx | page.tsx | 1 |
| useFocusTrap | shared/useFocusTrap.ts | (none currently) | 0 |

## Feature Folders
| Folder | Files | External Imports | Notes |
|--------|-------|-----------------|-------|
| editor/ | 84 | types, constants, shared | Core product |
| sidebar/ | 2 | types, constants, utils, due-dates | Navigation |
| notifications/ | 2 | (self-contained) | Panel component |
| ... | ... | ... | ... |
```

---

## Anti-Hallucination Guarantees

1. **Every file path was verified by `ls` or `find`** — no paths from memory
2. **Every import count was verified by `grep -c`** — no estimated numbers
3. **Every line number was verified by `grep -n`** — no "around line 400"
4. **The map is regenerated, not patched** — stale data can't accumulate
5. **If a scan command fails, the section is marked STALE** — never fill in from memory
6. **Cascading changes go through sprint** — never bulk-modify from a stale map

---

## The Standard

> An AI opens a session on the Felmark codebase. Before writing a single line of code, it reads FORGE.md and knows:
> - Every route and what renders on each
> - Every block type, where it lives, what types it uses
> - Which files are hotspots that cascade changes
> - Which shared components exist and who uses them
> - The exact file count and line count as of the last scan
>
> No guessing. No hallucinating paths. No "I think this file is at..."
>
> That's the contract. Forge enforces it.
