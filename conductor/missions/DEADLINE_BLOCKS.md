# Deadline Blocks — Dates That Live Where Work Happens

**Created**: 2026-03-29
**Type**: Mission
**Milestone**: M1 (MVP block types)
**Depends on**: Real ISO dates on Project (done), Slash Command Checklist standard

---

## Mission Statement

Let freelancers **set deadlines inside their documents**, not in a separate settings panel. A `/deadline` block creates a visible milestone with a date picker, assignee, and automatic calendar integration. An inline `@date` chip lets you reference dates mid-sentence. Both surface in the calendar, terminal welcome, and outline — dates are data, not text.

---

## Why This Matters

1. **Deadlines are born during writing** — you're drafting a scope doc and think "logo concepts need to be done by April 3rd." Right now you'd have to leave the editor, find the project settings, and set a due date there. That hop kills flow.
2. **Documents should contain their own schedule** — a proposal with embedded deadline blocks IS the project plan. No separate Gantt chart needed.
3. **HoneyBook/Bonsai gap** — no competitor has inline deadlines that feed into a real calendar. They all separate "documents" from "scheduling."
4. **Feeds the intelligence layer** — deadline blocks + time tracking = "are you on pace to hit this date?"

---

## Two Block Types

### 1. `/deadline` — Standalone Deadline Block

A visible, styled block that declares a formal milestone.

```
┌─────────────────────────────────────────────────────────┐
│ ⚑ Logo concepts due              [Apr 3, 2026]    You  │
│   Linked to: Brand Guidelines v2                        │
└─────────────────────────────────────────────────────────┘
```

- Inserted via `/deadline` slash command
- Title: editable inline (what's due)
- Date: clickable chip opens native date picker
- Assignee: optional, defaults to "You"
- Linked project: auto-detected from the workspace, or manually set
- Status: auto-computed (upcoming / due today / overdue / completed)
- Completable: checkbox or click to mark done

**Surfaces in:**
- Calendar view (as an event on that day)
- Terminal Welcome "Attention" section (if due within 7 days)
- Editor outline margin (with ⚑ icon and date)
- Project deadline count in sidebar

### 2. `@date` — Inline Date Chip

A lightweight date reference that lives inside a paragraph.

```
We'll deliver the first round of concepts by [Apr 3] and final files by [Apr 15].
```

- Triggered by typing `@date` mid-sentence (same pattern as `@mention`)
- Renders as a small styled chip: ember background, date text, clickable
- Clicking opens a mini calendar picker to change the date
- Does NOT create a formal milestone — it's a date reference, not a deliverable
- Aggregates in the outline margin under a "Dates" subsection

**Surfaces in:**
- Editor outline margin (listed under "dates" label)
- Calendar view (as a subtle marker, not a full event)

---

## Layout — Deadline Block

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚑  [Title: editable text                ]  [Apr 3, 2026 ▾]  👤 │
│    ○ upcoming · Brand Guidelines v2 · 5 days left               │
└──────────────────────────────────────────────────────────────────┘
```

States:
- **Upcoming**: muted border, date in ink-400
- **Due soon** (≤3 days): ember border, date in ember
- **Due today**: ember background, bold
- **Overdue**: red border, red date, "X days overdue"
- **Completed**: green check, strikethrough title, green border

---

## Layout — Inline Date Chip

```
We'll deliver concepts by [Apr 3] and finals by [Apr 15].
                          ^^^^^^^^              ^^^^^^^^
                          ember-bg              ember-bg
                          clickable             clickable
```

The chip is inline — it flows with text like a `<span>`, not a block-level element.

---

## Data Models

### Deadline Block

```typescript
// Added to BlockType union: "deadline"
// Added to Block interface: deadlineData?: DeadlineBlockData

interface DeadlineBlockData {
  title: string;
  due: string | null;           // ISO date
  assignee: string;             // "You" or a name
  completed: boolean;
  linkedProjectId?: string;     // auto-link to project
}
```

### Inline Date Chip

Not a block type — it's an inline decoration within paragraph content. Stored as a special HTML span in the block's `content` field:

```html
We'll deliver concepts by <span data-felmark-date="2026-04-03" class="date-chip">Apr 3</span> and finals by <span data-felmark-date="2026-04-15" class="date-chip">Apr 15</span>.
```

Parsed from `content` by the editor renderer. The `data-felmark-date` attribute holds the ISO date; the visible text is the formatted display.

---

## Slash Command Checklist (per standard)

### `/deadline` block

| # | Touchpoint | What to do |
|---|---|---|
| 1 | `types.ts` | Add `"deadline"` to BlockType, `DeadlineBlockData` interface, `deadlineData?` on Block |
| 2 | `constants.ts` | Add `{ type: "deadline", label: "Deadline", icon: "⚑", section: "Blocks", shortcut: "/deadline" }` |
| 3 | `Editor.tsx` renderBlock | Render deadline component with date picker, title, assignee, status |
| 4 | `Editor.tsx` selectSlashItem | Insert deadline block with defaults + paragraph after |
| 5 | `EditableBlock.tsx` | N/A (non-editable block, custom renderer) |
| 6 | `EditorMargin.tsx` | Add `deadline: "⚑"` to BLOCK_LABELS, color to BLOCK_LABEL_COLORS, show title + date in preview |
| 7 | `Editor.module.css` | N/A (own CSS module) |

### `@date` inline chip

Not a block type — requires:
| # | What | How |
|---|---|---|
| 1 | Trigger detection | In `EditableBlock.tsx` handleInput, detect `@date` like `/` triggers slash menu |
| 2 | Date picker popup | Mini calendar that appears at cursor position when `@date` is typed |
| 3 | Chip insertion | Insert `<span data-felmark-date="..." class="date-chip">` at cursor position |
| 4 | Chip rendering | CSS styles the chip inline (ember-bg, rounded, clickable) |
| 5 | Chip editing | Clicking an existing chip opens the date picker to change the date |
| 6 | Content parsing | When reading block content, extract date chips for outline/calendar aggregation |

---

## Integration Points

| System | Deadline Block | Inline Date Chip |
|---|---|---|
| **Calendar** | Shows as a full event on the due date | Shows as a subtle dot/marker |
| **Terminal Welcome** | "Attention" section if due ≤7 days | Not shown (too noisy) |
| **Outline margin** | ⚑ icon with title and date | Listed under "dates" subsection |
| **Sidebar project** | Counts toward project deadline total | Not counted |
| **Notifications** | Triggers notification when approaching | Not triggered |
| **Time tracking** | Can track time against a deadline | N/A |

---

## Phases

### Phase 1: `/deadline` Block (Build Now)
- New block type with title, date picker, assignee, completion toggle
- Status auto-computes from date (upcoming/soon/today/overdue/done)
- Renders in editor with appropriate styling per status
- Shows in outline margin
- Follows slash command checklist

### Phase 2: `@date` Inline Chip (Build Now)
- Detect `@date` trigger in EditableBlock
- Show date picker popup at cursor
- Insert styled `<span>` with ISO date attribute
- Clicking existing chips reopens picker
- Extract dates from content for outline aggregation

### Phase 3: Smart Date Detection (Future)
- Auto-detect natural language dates ("next Friday", "April 3rd", "in 2 weeks")
- Subtle underline on detected dates
- Click to confirm and convert to a date chip
- Requires NLP or pattern matching

### Phase 4: Deadline Intelligence (Future)
- "Are you on pace?" — compare tracked hours vs. remaining time
- "This deadline conflicts with X" — calendar collision detection
- Auto-suggest deadline dates based on project scope and your historical pace

---

## Open Questions

1. Should deadline blocks be completable with a checkbox, or auto-complete when the linked deliverable is marked done?
2. Should inline date chips have relative display? ("in 3 days" vs "Apr 3") — leaning toward absolute dates with relative shown on hover
3. Should `@date` also support date ranges? `@date Apr 1–15` → renders as a range chip
4. When a deadline block is in a proposal sent to a client, should the client see the deadline? (Probably yes — it sets expectations)
