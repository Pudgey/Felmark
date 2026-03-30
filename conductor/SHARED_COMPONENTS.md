# Shared Components

Components and utilities used across multiple features. Import from here — don't duplicate.

---

## Logic (`src/lib/`)

| File | What | Used by |
|---|---|---|
| `due-dates.ts` | Due date calculations: days left, urgency level, colors, labels, nearest deadline scanner, quick date helpers | Meta bar, sidebar, deliverables, deadlines, data chips, calendar, command bar |
| `utils.ts` | `uid()`, `cursorTo()`, `makeBlocks()`, `daysLeft()`, `formatDue()` — legacy date helpers (prefer `due-dates.ts` for new code) | Editor, blocks, onboarding |
| `types.ts` | All TypeScript interfaces and type unions | Everything |
| `constants.ts` | `BLOCK_TYPES`, `BLOCK_CATEGORIES`, `STATUS`, `COMMANDS`, `INITIAL_WORKSPACES` | Slash menu, editor, sidebar |

## UI (`src/components/shared/`)

| Component | What | Props | Used by |
|---|---|---|---|
| `DueDatePicker` | Click-to-edit date picker with calendar dropdown + quick picks (Today, Tomorrow, +1wk, +2wk, +1mo). Colors by urgency. Compact mode available. | `date`, `onChange`, `compact?` | Meta bar, deliverables, deadlines, sidebar (planned) |
| `ErrorBoundary` | React error boundary — catches render crashes, shows "Something went wrong" + retry button | `children` | Root layout wraps everything |
| `useFocusTrap` | Hook that traps focus inside a modal/panel for accessibility | `ref`, `active` | Command palette, history modal |

## Rules

- **One source of truth** — if a calculation exists in `due-dates.ts`, use it. Don't recompute days-left in a component.
- **Shared UI goes in `src/components/shared/`** — if 3+ components need the same widget, extract it here.
- **Shared logic goes in `src/lib/`** — pure functions, no React. Importable by both client and server code.
- **Don't put component-specific logic here** — if only one component uses it, keep it local.
