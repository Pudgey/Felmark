# Mission: Save Editor as Template — Reusable Document Layouts

**Created**: 2026-03-30
**Status**: Planning
**Milestone**: M1

---

## Goal

A freelancer builds a document they love — proposal structure, meeting notes format, project brief layout — and saves it as a template with one click. They recall it when creating new projects, opening new tabs, or via `/template` in the editor. The template preserves all block types, structure, and placeholder content.

---

## The Problem

Freelancers rebuild the same document structures repeatedly:
- Every proposal has the same sections (Objective, Scope, Timeline, Investment, Terms)
- Every meeting note has the same layout (Agenda, Discussion, Action Items, Next Meeting)
- Every client onboarding doc has the same checklist

Currently they either start from scratch each time, or copy-paste from an old document and manually clear the content. Both waste time and introduce inconsistency.

---

## How It Works

### Save Flow

```
User is in a document they want to reuse
  → Menu (⌘⇧S or right-click) → "Save as template"
  → Modal: name, description, category, icon
  → Strips content but keeps structure + block types
  → Saved to template library
```

**What gets saved:**
- All block types and their order (h1, callout, h2, todo, divider, etc.)
- Block metadata: graph type, money type, deliverable structure, table headers
- Placeholder content (user can customize what stays vs. what gets cleared)

**What gets stripped:**
- Specific text content (replaced with placeholder text or left empty)
- Checked states on todos (reset to unchecked)
- File attachments on deliverables
- Comments and approvals

### Recall Flow — Three Entry Points

**1. New project creation**
When creating a new project (via `+` tab, workspace home "New note", or nox), the user can pick a template:

```
┌─────────────────────────────┐
│ New document                │
│                             │
│ [Blank]  [From template →]  │
│                             │
│ RECENT TEMPLATES            │
│ ◆ Project Proposal          │
│ ◆ Meeting Notes             │
│ ◆ Client Onboarding         │
│                             │
│ ALL TEMPLATES               │
│ [Search...]                 │
│ ◆ Service Agreement         │
│ ◆ Project Brief             │
│ ◆ Weekly Report             │
└─────────────────────────────┘
```

**2. Slash command in editor**
Type `/template` in any empty block → template picker appears in the slash menu position → selecting a template inserts all its blocks below the current cursor position.

**3. Templates screen**
The existing Templates page (rail icon) becomes the management hub: browse, preview, edit, duplicate, delete templates.

### Template Preview

Before applying, the user sees a preview of what blocks the template contains:

```
┌─────────────────────────────────────┐
│ ◆ Project Proposal                  │
│ "Standard client proposal layout"   │
│                                     │
│ Preview:                            │
│  H1  Document title                 │
│  ¶   Introduction paragraph         │
│  H2  Objective                      │
│  ¶   Goal description               │
│  H2  Scope                          │
│  •   Deliverable 1                  │
│  •   Deliverable 2                  │
│  H2  Timeline                       │
│  ☐   Phase 1 — Discovery            │
│  ☐   Phase 2 — Creative             │
│  H2  Investment                     │
│  ▥   Payment schedule table         │
│  ──  Divider                        │
│  ¶   Closing paragraph              │
│                                     │
│ 15 blocks · Last used 2 days ago    │
│                                     │
│ [Use template]     [Edit] [Delete]  │
└─────────────────────────────────────┘
```

---

## Data Model

```typescript
interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;              // "◆", "☰", "$", "§", etc.
  category: TemplateCategory;
  blocks: TemplateBlock[];   // Block structure without IDs
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  lastUsed: string | null;
  source: "user" | "felmark"; // user-created vs. built-in
}

type TemplateCategory =
  | "proposals"
  | "contracts"
  | "notes"
  | "planning"
  | "financial"
  | "onboarding"
  | "custom";

interface TemplateBlock {
  type: BlockType;
  content: string;           // Placeholder text or empty
  checked?: boolean;         // Always false for templates
  // Data block structures preserved:
  graphData?: GraphBlockData;
  moneyData?: MoneyBlockData;
  deliverableData?: Partial<DeliverableData>;
  tableData?: TableBlockData;
  accordionData?: AccordionBlockData;
  deadlineData?: Partial<DeadlineBlockData>;
}
```

---

## Scope

### Deliverables

**D1 — Save as Template modal**
- [ ] "Save as template" action in editor (menu or `⌘⇧S`)
- [ ] Modal: template name, description, category dropdown, icon picker
- [ ] Preview of block structure before saving
- [ ] Option to keep/clear content per block (toggle)
- [ ] Saves to local state (M1) / Supabase (M2)

**D2 — Template picker on new document**
- [ ] When creating a new tab/project, show template picker
- [ ] Recent templates at top (sorted by usage count)
- [ ] "Blank" option always first
- [ ] Search/filter by name and category
- [ ] Preview on hover/select
- [ ] Selecting a template populates the new document with its blocks

**D3 — `/template` slash command**
- [ ] Add "Template" to slash menu under a "Templates" section
- [ ] Opens inline template picker below the cursor
- [ ] Inserts template blocks at cursor position (doesn't replace existing content)
- [ ] New IDs generated for each inserted block

**D4 — Template management on Templates page**
- [ ] List view with name, category, block count, usage count, last used
- [ ] Preview panel (same as D2)
- [ ] Edit: re-open save modal with existing data
- [ ] Duplicate: copy with "Copy of" prefix
- [ ] Delete: confirmation prompt

**D5 — Felmark starter templates (built-in)**
- [ ] Project Proposal (h1, paragraph, h2×4, bullets, table, divider)
- [ ] Meeting Notes (h2, callout, h3×4, numbered, todos)
- [ ] Client Onboarding (h1, callout, h2×3, bullets, todos)
- [ ] Service Agreement (h1, paragraph, h2×6, bullets, divider)
- [ ] Weekly Report (h2, callout, h3×3, todos, table)
- [ ] Project Brief (h1, h2×5, bullets, numbered)
- Marked as `source: "felmark"`, non-deletable

### Out of Scope
- Template marketplace / sharing between users
- Version history on templates
- Template variables (`{{client_name}}` auto-fill) — separate feature
- Linked templates (edit source → updates all instances)
- Template import/export

---

## Constraints

- No new packages
- Templates stored in component state for M1 (lifted to page.tsx alongside workspaces)
- Block IDs regenerated on every template application (no shared references)
- Built-in templates are code constants, not fetched

---

## Affected Files

### New Files
- `dashboard/src/components/templates/SaveTemplateModal.tsx` + `.module.css`
- `dashboard/src/components/templates/TemplatePicker.tsx` + `.module.css`
- `dashboard/src/lib/starter-templates.ts` — built-in template definitions

### Modified Files
- `dashboard/src/app/page.tsx` — template state, save/load handlers
- `dashboard/src/components/editor/Editor.tsx` — "Save as template" menu, `/template` slash command
- `dashboard/src/components/editor/SlashMenu.tsx` — add Templates section
- `dashboard/src/components/templates/TemplatesPage.tsx` — integrate real template data
- `dashboard/src/lib/types.ts` — `DocumentTemplate`, `TemplateBlock`, `TemplateCategory` types

---

## Standards to Follow

- [ ] UI/UX Guidelines — modal pattern, search input, section labels
- [ ] Slash Command Checklist — if adding `/template` as a new slash command type
- [ ] Code review checklist

---

## Notes

- This connects to the Template System concept (`conductor/missions/TEMPLATE_SYSTEM_CONCEPT.md`) but is specifically about document-level templates, not individual block templates.
- The save flow should be smart about stripping content: headings keep their text (they define structure), paragraphs get cleared, todos get unchecked, tables keep headers but clear data rows.
- Usage count + last used tracking enables the "recent templates" sort — most-used templates surface first.
- Built-in templates serve as examples and starting points. Users will quickly create their own once they see the pattern.
