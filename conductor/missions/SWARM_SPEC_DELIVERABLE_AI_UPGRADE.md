# Swarm Spec — Deliverable Upgrade + AI Action Block

**Goal:** Upgrade the existing DeliverableBlock with drop zone, rich file cards, activity log, and kanban mini-board. Create a new AiActionBlock with 5 modes (summarize, suggest, translate, tone-check, scope-risk).

**Lane:** Feature + Design

**Status:** AWAITING SCOUT DATA — will finalize after codebase scan

---

## Part 1: DeliverableBlock Upgrade

### Current State
The DeliverableBlock has: title, description, status lifecycle, assignee, due date, files (name-only list), comments, approvals.

### Upgrades

**Task 1: Drop zone**
Add a drag-and-drop visual zone inside the files section. On drag-over, highlight with ember dashed border. Mock the upload (add to files array with fake metadata). No actual file upload — just the UI interaction.

**Task 2: Rich file cards**
Replace the plain file list with cards showing:
- File type icon (PDF, image, doc, spreadsheet, code, generic)
- File name + size
- Uploader name + upload time
- Hover actions: download, remove

**Task 3: Inline activity log**
Collapsible section at the bottom showing chronological events:
- "Status changed to Review"
- "File uploaded: brand-guide-v2.pdf"
- "Approved by Sarah"
- Auto-generated from deliverable state changes (mock for now)

**Task 4: Kanban mini-board**
Inline 3-column board (To Do / In Progress / Done) for sub-tasks within a deliverable. Each sub-task: title + drag between columns. Add sub-task button.

### Files to Modify
- `deliverable/DeliverableBlock.tsx` — all 4 upgrades
- `deliverable/DeliverableBlock.module.css` — new styles
- `lib/types.ts` — extend DeliverableData with file metadata, activity entries, sub-tasks

---

## Part 2: AI Action Block (New)

### Concept
One block type (`ai-action`) with 5 modes, selectable via a picker (like graph type picker). Each mode operates on surrounding content.

### Modes
1. **Summarize** — "Auto-summary of the section above"
2. **Suggest** — "Context-aware writing suggestions"
3. **Translate** — "Mirror content in another language"
4. **Tone Check** — "Flag sections that are too casual or formal"
5. **Scope Risk** — "Warn about vague deliverables"

### UI Pattern
- Mode picker bar at top (5 icon buttons)
- "Analyzing: [section name]" context line
- "Run" button
- Output area (simulated — show realistic mock output per mode)
- Re-run and dismiss buttons

### Files to Create/Modify
- NEW: `editor/ai-action/AiActionBlock.tsx`
- NEW: `editor/ai-action/AiActionBlock.module.css`
- `lib/types.ts` — add AiActionBlockData interface + block type
- `lib/constants.ts` — add to BLOCK_TYPES
- `editor/Editor.tsx` — wire into renderBlock + CONTENT_DEFAULTS
- `editor/SlashMenu.tsx` — already supports new sections
- `editor/margin/EditorMargin.tsx` — add labels

---

## Dependencies
- Part 1 and Part 2 are independent — can run in parallel

## Risks
- DeliverableBlock is complex — careful not to break existing functionality
- AI Action outputs are mocked — make it obvious these are simulated

---

**Awaiting scout data to finalize, then human approval.**
