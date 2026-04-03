<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Organization Rules

**Organization and scale are more important than shipping fast.** Every agent — whether running a sprint, fixing a bug, or building a feature — must follow these rules. No exceptions.

## Update MANIFEST.md on Every Task (NON-NEGOTIABLE)

- **Every completed task that creates, modifies, or deletes files in a component folder MUST update that folder's `MANIFEST.md` before the task is considered done.**
- If the folder has no `MANIFEST.md`, create one.
- If the task created a new folder, create a `MANIFEST.md` in the same commit.
- The manifest declares: Exports, Dependencies, Imported By, Files. Keep it current.
- **No exceptions.** Every task, every time.

## Read Before You Write (NON-NEGOTIABLE)

- **Before modifying ANY file, read its current contents from disk.** Do not regenerate a file from memory or context — the file on disk is the source of truth.
- **Never overwrite functionality you didn't add.** If a file has features, props, sections, or logic you don't recognize, those were added by another session. Preserve them. If your task conflicts with existing work, STOP and ask the user.
- **Refactors must preserve, not replace.** If you're restructuring a file, diff your output against the original. Every prop, handler, section, and import in the original must appear in the result unless explicitly removed by the user.
- **This exists because**: multiple AI agents work on this codebase. A broad refactor by one agent has silently reverted days of work by another. This rule prevents that.

## Before Writing Any Code

1. **Check the target file's line count.** If > 500 lines, flag it to the user and propose splitting before adding code. If > 800, do NOT add code — refactor first.
2. **Check the target folder's size.** If > 10 siblings, flag it. If > 15, propose restructuring.
3. **Check responsibility.** Is the file you're editing doing one thing? If it renders UI for unrelated features (e.g. an editor rendering a calendar), that's a structural bug — fix it before building on top of it.
4. **Check the canonical hierarchy.** New files go in the right folder the first time. See CLAUDE.md "Canonical Folder Hierarchy" for the map.

## Where Things Live

| What | Where | NOT here |
|------|-------|----------|
| Home dashboard | `components/home/` | `components/workstation/` |
| Workstation features | `components/workstation/<feature>/` | `components/<feature>/` |
| Block types | `components/workstation/editor/blocks/<block>/` | `editor/<block>/` |
| Editor chrome (slash menu, format bar, etc.) | `components/workstation/editor/chrome/<tool>/` | `editor/<tool>/` |
| Editor panels (conversation, share, cat) | `components/workstation/editor/panels/<panel>/` | `editor/<panel>/` |
| View routing | `views/<view>.tsx` + `views/ViewRouter.tsx` | `page.tsx` or `Editor.tsx` |
| App state + layout | `app/page.tsx` | Nowhere else |
| Shared/cross-cutting components | `components/shared/`, `components/comments/`, etc. | Inside workstation/ |

## Routing Rules

- **page.tsx** owns state, handlers, and layout (Rail, Sidebar, modals). It passes everything to `ViewRouter`.
- **ViewRouter** maps `railActive` to the correct view wrapper. One switch statement, nothing else.
- **View wrappers** (`views/*.tsx`) wire props from ViewRouter to one component. 15-50 lines each.
- **Components render themselves.** A component should NEVER render another top-level view. If you find an Editor rendering a Calendar, that's a bug.

## The Question You Must Always Ask

Before adding code to any file:

> "Is this file already doing too much? Should I refactor before I build?"

If the answer is yes — or even maybe — ask the user. The cost of asking is 10 seconds. The cost of not asking is a multi-hour restructure later.
