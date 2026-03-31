# Forge Map — Dependency & Architecture Scan

> **Last forged**: 2026-03-31
> **Codebase**: 174 files, ~45,500 lines
> **Block types**: 55
> **Component folders**: 22
> **Editor imports**: 53

---

## Route Map

| Route | Entry File | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Dashboard shell — composes Editor, Sidebar, Rail, Launchpad |
| `/share/[id]` | `app/share/[id]/page.tsx` | Public shared document view |
| `/api/generate` | `app/api/generate/route.ts` | AI block generation endpoint |
| `/api/share` | `app/api/share/route.ts` | Share CRUD (create, lookup, update) |
| `/api/wire` | `app/api/wire/route.ts` | The Wire data endpoint |
| `/api/terminal/query` | `app/api/terminal/query/route.ts` | Terminal command processing |
| `/api/terminal/ambient` | `app/api/terminal/ambient/route.ts` | Terminal ambient data |

---

## Hotspot Files

| File | Importers | Risk |
|------|-----------|------|
| `lib/types.ts` | 68 | Critical — every component imports types |
| `lib/constants.ts` | 7 | High — block registry, status config, commands |
| `lib/due-dates.ts` | 3 | Medium — date utilities |
| `lib/utils.ts` | 5 | Medium — uid, cursorTo, makeBlocks |
| `editor/Editor.tsx` | 1 (page.tsx) but imports 53 | High — central dispatch for all blocks |
| `app/page.tsx` | 0 (entry point) but composes entire app | Critical — app shell |

---

## Block Registry

### Text (11)
paragraph, h1, h2, h3, bullet, numbered, todo, quote, code, callout, divider — all rendered inline via EditableBlock

### Rich Content (9)
| Type | Slash | Component | File |
|------|-------|-----------|------|
| table | `/table` | TableBlock | `blocks/ContentBlocks.tsx` |
| accordion | `/acc` | AccordionBlock | `blocks/ContentBlocks.tsx` |
| math | `/math` | MathBlock | `blocks/ContentBlocks.tsx` |
| gallery | `/gallery` | GalleryBlock | `blocks/ContentBlocks.tsx` |
| swatches | `/color` | SwatchesBlock | `blocks/ContentBlocks.tsx` |
| beforeafter | `/ba` | BeforeAfterBlock | `blocks/ContentBlocks.tsx` |
| bookmark | `/link` | BookmarkBlock | `blocks/ContentBlocks.tsx` |
| canvas | `/canvas` | CanvasBlock | `canvas/CanvasBlock.tsx` |
| audio | `/audio` | AudioBlockComponent | `audio/AudioBlock.tsx` |

### Visual (12)
| Type | Slash | Component | File |
|------|-------|-----------|------|
| graph | `/graph` | GraphBlockComponent | `graphs/GraphBlock.tsx` |
| deliverable | `/deliv` | DeliverableBlockComponent | `deliverable/DeliverableBlock.tsx` |
| deadline | `/deadline` | DeadlineBlockComponent | `deadline-block/DeadlineBlock.tsx` |
| visual | `/visual` | VisualBlock | `visual/VisualBlock.tsx` |
| timeline | `/timeline` | TimelineBlock | `blocks/VisualBlocks.tsx` |
| flow | `/flow` | FlowBlock | `blocks/VisualBlocks.tsx` |
| brandboard | `/brand` | BrandBoardBlock | `blocks/VisualBlocks.tsx` |
| moodboard | `/mood` | MoodBoardBlock | `blocks/VisualBlocks.tsx` |
| wireframe | `/wireframe` | WireframeBlock | `blocks/VisualBlocks.tsx` |
| pullquote | `/testimonial` | PullQuoteBlock | `blocks/VisualBlocks.tsx` |
| drawing | `/drawing` | DrawingBlock | `drawing/DrawingBlock.tsx` |
| columns | (internal) | ColumnsBlock | `columns/ColumnsBlock.tsx` |

### Animation (5)
| Type | Slash | Component | File |
|------|-------|-----------|------|
| hero-spotlight | `/spotlight` | HeroSpotlightBlock | `blocks/AnimationBlocks.tsx` |
| kinetic-type | `/kinetic` | KineticTypeBlock | `blocks/AnimationBlocks.tsx` |
| number-cascade | `/cascade` | NumberCascadeBlock | `blocks/AnimationBlocks.tsx` |
| stat-reveal | `/stats` | StatRevealBlock | `blocks/AnimationBlocks.tsx` |
| value-counter | `/value` | ValueCounterBlock | `blocks/AnimationBlocks.tsx` |

### Money (1)
| Type | Slash | Component | File |
|------|-------|-----------|------|
| money | `/money` | MoneyBlockComponent | `money/MoneyBlock.tsx` |

### Collaboration (9)
| Type | Slash | Component | File |
|------|-------|-----------|------|
| comment-thread | `/thread` | CommentThreadBlock | `blocks/CollabBlocks.tsx` |
| mention | `/mention` | MentionBlock | `blocks/CollabBlocks.tsx` |
| question | `/question` | QuestionBlock | `blocks/CollabBlocks.tsx` |
| feedback | `/feedback` | FeedbackBlock | `blocks/CollabBlocks.tsx` |
| decision | `/decision` | DecisionBlock | `blocks/CollabBlocks.tsx` |
| poll | `/poll` | PollBlock | `blocks/CollabBlocks.tsx` |
| handoff | `/handoff` | HandoffBlock | `blocks/CollabBlocks.tsx` |
| signoff | `/esign` | SignoffBlock | `blocks/CollabBlocks.tsx` |
| annotation | `/annotate` | AnnotationBlock | `blocks/CollabBlocks.tsx` |

### AI (2)
| Type | Slash | Component | File |
|------|-------|-----------|------|
| ai | `/ai` | AiBlock | `ai/AiBlock.tsx` |
| ai-action | `/action` | AiActionBlock | `ai-action/AiActionBlock.tsx` |

### Unique (8)
| Type | Slash | Component | File |
|------|-------|-----------|------|
| pricing-config | `/pricing` | PricingConfigBlock | `unique/PricingConfigBlock.tsx` |
| scope-boundary | `/scope` | ScopeBoundaryBlock | `unique/ScopeBoundaryBlock.tsx` |
| asset-checklist | `/assets` | AssetChecklistBlock | `unique/AssetChecklistBlock.tsx` |
| decision-picker | `/decide` | DecisionPickerBlock | `unique/DecisionPickerBlock.tsx` |
| availability-picker | `/avail` | AvailabilityPickerBlock | `unique/AvailabilityPickerBlock.tsx` |
| progress-stream | `/stream` | ProgressStreamBlock | `unique/ProgressStreamBlock.tsx` |
| dependency-map | `/deps` | DependencyMapBlock | `unique/DependencyMapBlock.tsx` |
| revision-heatmap | `/heat` | RevisionHeatmapBlock | `unique/RevisionHeatmapBlock.tsx` |

---

## Shared Components & Hooks

| Name | File | Importers | Count |
|------|------|-----------|-------|
| DueDatePicker | `shared/DueDatePicker.tsx` | Editor | 1 |
| ErrorBoundary | `shared/ErrorBoundary.tsx` | page.tsx | 1 |
| useFocusTrap | `shared/useFocusTrap.ts` | ShareModal, TemplatePicker | 2 |

**Extraction gaps** (from Shared Primitives mission):
- useClickOutside — duplicated 10+
- useEditableField — duplicated 8+
- useEscapeKey — duplicated 30
- Avatar, IconButton, EmptyState — duplicated 4-8 each

---

## Feature Folders

| Folder | Files | External Deps | Notes |
|--------|-------|---------------|-------|
| `editor/` | 55 | types, constants, utils, due-dates, shared | Core product — 55 of 174 files |
| `sidebar/` | 2 | types, constants, due-dates | Workspace tree |
| `rail/` | 2 | (self-contained) | Navigation icons |
| `dashboard/` | 2 | types, constants, due-dates | Home view |
| `calendar/` | 2 | types | Full calendar |
| `notifications/` | 2 | (self-contained) | Notification panel |
| `onboarding/` | 4 | types | Workspace creation + animation |
| `launchpad/` | 2 | types | Workspace picker |
| `search/` | 2 | types | Cross-workspace search |
| `templates/` | 4 | types, shared | Template management |
| `services/` | 2 | (self-contained) | Services page |
| `pipeline/` | 2 | types | Pipeline board |
| `finance/` | 2 | (self-contained) | Finance page |
| `team/` | 2 | types | Team screen |
| `wire/` | 2 | (self-contained) | The Wire |
| `workspace/` | 2 | types, constants, due-dates | Workspace home |
| `share/` | 2 | types | Public share view |
| `activity/` | 2 | types | Activity margin |
| `comments/` | 2 | types | Comment panel |
| `history/` | 2 | (self-contained) | Version history |
| `shared/` | 4 | types, due-dates | Reusable primitives |
| `terminal/` | 2 | (self-contained) | Terminal welcome |

---

## Pending Structural Missions

| Mission | Status | Impact |
|---------|--------|--------|
| Editor Core Refactor | Approved | Creates `editor/core/` (10 files), Editor.tsx → <200 lines |
| Shared Primitives | Approved | Adds 14 files to `shared/`, deduplicates hooks/components |
| Block Reorganization | Depends on Core | Splits 4 mega-files into category folders |
