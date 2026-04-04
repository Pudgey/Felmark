# Linting & Code Quality Standards

> **Last Reviewed**: 2026-04-04
> **Next Review**: 2026-05-04

## Overview

Felmark enforces code quality through automated tooling that runs **regardless of who writes the code** — human or AI. Quality gates are layered so violations get caught as early as possible:

1. **On save** — VS Code auto-formats and auto-fixes (zero effort)
2. **On commit** — Husky + lint-staged blocks commits with lint or format violations
3. **On push** — Husky pre-push runs full lint + typecheck
4. **On PR** — GitHub Actions CI runs lint + typecheck + build

AI-specific: Claude Code has an additional post-edit hook that runs ESLint inline, but this is a convenience layer — the real gates are the four above.

---

## Tools

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint 9 | `^9` | Linting — Next.js core web vitals + TypeScript rules |
| TypeScript | `^5` | Type checking — `strict: true`, `noEmit`, `isolatedModules` |
| Prettier | `^3` | Formatting — consistent style across all agents and contributors |
| Husky | `^9` | Git hooks — runs lint-staged on pre-commit |
| lint-staged | `^16` | Scoped checks — only lint/format staged files |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `dashboard/eslint.config.mjs` | ESLint flat config — Next.js web vitals, TypeScript, unused-var rules |
| `dashboard/.prettierrc.json` | Prettier config — semi, double quotes, trailing commas, 120 char width |
| `dashboard/package.json` `lint-staged` | lint-staged config — ESLint + Prettier on staged `.ts`/`.tsx`; Prettier on `.css`/`.json` |
| `.husky/pre-commit` | Git hook — runs `npx lint-staged` inside `dashboard/` |
| `.husky/pre-push` | Git hook — runs full lint + typecheck before push |
| `.vscode/settings.json` | VS Code — format on save, ESLint auto-fix on save, workspace TS SDK |
| `.vscode/extensions.json` | VS Code — recommends Prettier, ESLint, EditorConfig extensions |
| `.editorconfig` | Editor-agnostic — 2-space indent, LF endings, UTF-8, trim whitespace |
| `.claude/settings.json` | AI-specific — runs ESLint on every Claude Code file edit |

---

## Commands

Run from `dashboard/`:

```bash
npm run lint            # ESLint with --max-warnings=0 (strict)
npm run lint:fix        # ESLint with --fix
npm run format          # Prettier — format all src files
npm run format:check    # Prettier — check without writing
npm run typecheck       # TypeScript — type check only
npm run check           # Full pipeline: lint → typecheck → format:check → build
```

---

## Enforcement Layers

### Layer 1 — On Save (VS Code)

`.vscode/settings.json` configures:
- **Format on save** via Prettier (`esbenp.prettier-vscode`)
- **Auto-fix on save** via ESLint (`source.fixAll.eslint`)
- ESLint workspace scoped to `dashboard/`
- TypeScript SDK pointed to project's `node_modules`

`.vscode/extensions.json` recommends Prettier, ESLint, and EditorConfig extensions — VS Code prompts to install them on first open.

- Scope: current file
- Blocking: no (auto-fixes silently)
- Works for: any developer using VS Code, no setup required

### Layer 2 — On Commit (Husky + lint-staged)

The `.husky/pre-commit` hook runs lint-staged, which:
- Runs ESLint (`--max-warnings=0`) + Prettier on staged `.ts`/`.tsx` files
- Runs Prettier on staged `.css`/`.json` files
- **Blocks the commit** if any check fails

This is the first hard gate — nothing with lint errors or format drift gets into git.

### Layer 3 — On Push (Husky)

The `.husky/pre-push` hook runs:
1. `npm run lint` — full ESLint pass (not just staged files)
2. `npm run typecheck` — full TypeScript check

**Blocks the push** if either fails. Catches issues that lint-staged missed (e.g., a type error caused by a change in a different file than the one staged).

### Layer 4 — On PR (GitHub Actions)

`.github/workflows/dashboard-quality.yml` runs on every PR touching `dashboard/`:
1. `npm run lint` — ESLint strict
2. `npm run typecheck` — TypeScript strict
3. `npm run build` — Full production build

All three must pass before merge. This is the final gate and the only one that also validates the build.

### AI Layer — On Edit (Claude Code Hook)

Every time Claude Code writes or edits a file, ESLint runs automatically via `.claude/settings.json`. This is a convenience for AI workflows — agents see lint errors inline and fix them immediately. Not a substitute for the gates above.

---

## ESLint Rules

### Active Rules

| Rule | Level | Notes |
|------|-------|-------|
| Next.js core web vitals | error | Performance, accessibility, best practices |
| Next.js TypeScript | error | TS-specific Next.js rules |
| `@typescript-eslint/no-unused-vars` | warn | Ignores `_`-prefixed args, vars, destructured, caught errors |
| `react-hooks/refs` | error | Cannot access refs during render |

### Global Ignores

- `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

---

## Prettier Config

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2
}
```

Matches the project's existing style: semicolons, double quotes, 2-space indent.

---

## Editor Setup

### VS Code (recommended)

On first open, VS Code will prompt to install recommended extensions (Prettier, ESLint, EditorConfig). Accept the prompt — everything else is automatic:

- **Save** → Prettier formats the file + ESLint auto-fixes
- **Problems panel** → live ESLint + TypeScript errors
- **TypeScript** → uses the project's TS version, not VS Code's built-in

No manual configuration needed. `.vscode/settings.json` and `.vscode/extensions.json` handle it.

### Other Editors

`.editorconfig` at repo root standardizes across any editor that supports it:
- 2-space indentation
- LF line endings
- UTF-8 charset
- Trim trailing whitespace (except `.md`)
- Insert final newline

For non-VS Code editors, install Prettier and ESLint plugins manually and point them at the `dashboard/` configs.

---

## Adding ESLint Rules

1. Add the rule to `dashboard/eslint.config.mjs`
2. Run `npm run lint` to verify no new violations (or fix them in the same pass)
3. Update this document's "Active Rules" table

## Troubleshooting

### `npm run lint` fails in a fresh worktree
Worktrees use symlinked `node_modules`. If the symlink is broken, run `npm install` in the worktree's `dashboard/` directory.

### Pre-commit hook not running
Verify: `git config core.hooksPath` should return `.husky`. If not: `git config core.hooksPath .husky` from the repo root.

### Claude Code hook not firing
The hook lives in `.claude/settings.json` (not `settings.local.json`). Restart the Claude Code session after modifying it.

### TypeScript errors in worktree
`tsconfig.json` includes `.next/types/**/*.ts`. Run `npx next build` once to generate types, then `npm run typecheck`.
