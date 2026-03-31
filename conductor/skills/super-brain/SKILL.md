# Super-Brain — Learn from the Best, Build Like the Best

> **Context cost**: High. This skill reads open source repos, searches GitHub, and cross-references against the current codebase. Best run at the start of a session or before a major refactor. Not for quick tasks.

## Purpose

Load real-world engineering intelligence from top open source projects that use the same stack as Felmark. Not blog posts. Not opinions. Actual working code from teams shipping at scale — grounded in human ingenuity, creative solutions, and zero AI slop.

The output is a decision table, not an essay. The goal is to make every line of code in this project look like it was written by a senior engineer who's seen 50 codebases, not by an AI that read a tutorial.

---

## The Two Missions of Super-Brain

### Mission 1: Structural Intelligence
How do the best teams organize code at our scale and beyond? Folder structures, component patterns, state management, import conventions, file boundaries. What works at 50 files that still works at 500.

### Mission 2: Code Quality Enforcement
Prevent AI slop from entering the codebase. Every line should be concise, intentional, and readable. If a developer opens this project for the first time, they should think "someone who knows what they're doing wrote this" — not "an AI generated this."

---

## What AI Slop Looks Like (and Super-Brain Prevents)

### In Code Structure
- Unnecessary abstractions for one-time operations
- Wrapper functions that add no value
- Helper utilities that are used once
- Over-engineered base classes for simple components
- "Registry" patterns when a plain object would do
- Feature flags and backwards-compat shims for code that was just written

### In Code Style
- Comments that restate what the code already says (`// set the name` above `setName()`)
- Type annotations on things TypeScript already infers
- Verbose error handling for things that can't fail
- Defensive null checks against impossible states
- 10 lines where 3 would do
- Try/catch around synchronous code that doesn't throw
- `async/await` on functions that aren't async

### In Component Design
- Props interfaces with 20+ optional fields instead of composition
- `useEffect` chains that should be derived state
- State that duplicates what's already in props
- Context providers wrapping a single consumer
- Memoization on components that re-render 3 times total
- "Reusable" components used exactly once

### What Human-Quality Code Looks Like
- Three similar lines is better than a premature abstraction
- If the function name explains it, no comment needed
- Flat is better than nested
- Delete code instead of commenting it out
- The simplest solution that works IS the solution
- One obvious way to do something, not three clever ways
- Names that read like English: `markAllRead()` not `handleMarkAllNotificationsAsReadAction()`

---

## Execution Steps

### Phase 1: Stack Fingerprint (2 min)

Read the project's actual configuration — not "Next.js" generically, but the exact version and patterns:

```bash
# Read exact stack
cat package.json          # Dependencies, versions, scripts
cat next.config.*         # Next.js configuration
cat tsconfig.json         # TypeScript config
ls dashboard/src/app/     # App router structure
```

Produce a fingerprint:
- Framework: Next.js [version] with [Turbopack/Webpack]
- Styling: CSS Modules (no Tailwind, no styled-components)
- State: useState/useCallback (no Redux, no Zustand)
- Router: App Router
- TypeScript: Strict mode [yes/no]
- Key patterns: Block editor, CSS modules per component, feature folders

### Phase 2: Reference Mining (5–10 min)

Search GitHub for the top open source projects matching this fingerprint. Criteria:
- **1,000+ stars** (proven quality)
- **Active in last 6 months** (not abandoned)
- **Same major framework version** (Next.js 14+ with App Router)
- **Similar domain** (SaaS dashboards, editors, productivity tools)

#### Tier 1: Direct Competitors / Same Domain
Search for projects that solve similar problems:
- Block editors (BlockNote, Novel, Plate, Tiptap-based)
- Freelancer/agency tools (if any open source)
- SaaS dashboards with complex editors
- Chrome extensions with companion web apps

#### Tier 2: Same Stack at Scale
Search for Next.js + CSS Modules + App Router projects with large codebases:
- Cal.com (~500 components, scheduling SaaS)
- Dub.co (link management, clean Next.js patterns)
- Papermark (document sharing, similar to our share feature)
- Infisical (secrets management, enterprise-grade)
- Formbricks (survey builder, block-editor-adjacent)
- Documenso (document signing, similar to our sign-off blocks)
- Plane (project management, kanban + editor)

#### Tier 3: Code Quality Exemplars
Search for repos known for exceptional code quality regardless of stack:
- Any repo by the Vercel team (framework authors)
- shadcn/ui patterns (component composition)
- tRPC (TypeScript patterns at scale)

**For each reference repo, extract:**
1. Root folder structure (top 2 levels)
2. Component organization pattern
3. How they handle shared/common components
4. State management approach
5. File naming conventions
6. Average file length (are files <250 lines?)
7. How they handle 50+ component types (if applicable)
8. Testing approach (if any)
9. Self-documentation pattern — do they use manifests, index files, README per folder? Compare against our MANIFEST.md approach. Note what works better.

### Phase 3: Gap Analysis (5 min)

Compare reference patterns against the current codebase. Produce a decision table:

```
| Pattern | Best-in-Class (from repos) | Felmark (current) | Gap | Fix |
|---------|---------------------------|-------------------|-----|-----|
| Component org | Feature folders, 1 component per file | Mixed — some mega-files, some folders | Medium | Phase 2 of editor refactor |
| Shared hooks | Dedicated hooks/ folder, 10+ reusable | 4 hooks in shared/, 10+ duplicated | High | Shared primitives mission |
| Folder manifests | MANIFEST.md in every folder | 46 manifests, all component folders covered | ✅ Match | Maintain: update on every change |
| ... | ... | ... | ... | ... |
```

### Phase 4: Slop Audit (5 min)

Scan the current codebase for AI slop patterns. For each finding:
- File and line number
- What the slop is
- What it should be instead
- Whether it's a quick fix or needs a refactor

```bash
# Check for over-commenting
grep -rn "^  //" dashboard/src --include="*.tsx" | head -30

# Check for verbose type annotations on obvious types
grep -rn ": string =" dashboard/src --include="*.tsx" | head -20

# Check for unnecessary async
grep -rn "async.*=>" dashboard/src --include="*.tsx" | head -20

# Check for try/catch around non-throwing code
grep -rn "try {" dashboard/src --include="*.tsx" -A 3 | head -30

# Check for single-use abstractions
# (functions defined and called once in the same file)
```

### Phase 5: Recommendations (2 min)

Output a prioritized action list. Three categories:

**Fix Now** — things that are actively making the code worse
- AI slop that's in hot-path files
- Duplicate implementations of shared patterns
- Over-engineered abstractions

**Fix Next** — structural improvements for scalability
- Folder reorganization
- Hook extraction
- File splitting

**Monitor** — not broken yet but will be
- Files approaching size limits
- Patterns that don't match best-in-class
- Dependencies that need updating

---

## Output Format

The output is NOT an essay. It is:

1. **Stack fingerprint** — 5 lines max
2. **Reference repos** — table with repo name, stars, what we learned
3. **Gap analysis** — decision table (pattern / best-in-class / ours / gap / fix)
4. **Slop findings** — file:line, what it is, what it should be
5. **Action list** — Fix Now / Fix Next / Monitor, 3–5 items each

Total output: under 200 lines. Dense, actionable, no fluff.

---

## When to Run Super-Brain

- **Before a major refactor** — know what "good" looks like before restructuring
- **Before building a new surface area** — learn how the best teams solved the same problem
- **Monthly health check** — catch drift before it becomes debt
- **When onboarding** — give a new developer (or AI) the full context of why things are the way they are
- **After a big sprint** — audit what was built for slop and structural drift

---

## Anti-Patterns (What Super-Brain is NOT)

- NOT a "best practices" lecture — it's pattern mining from real code
- NOT a rewrite proposal — it finds targeted improvements, not "start over"
- NOT a style guide — the codebase already has UI_UX_GUIDELINES.md for that
- NOT a performance tool — use /optimize for that
- NOT a generic code review — use /review for that

Super-brain is specifically: "what do the best teams do, where are we different, and which differences matter?"

---

## Staleness Protocol

After running, note:
- **Date run**: [YYYY-MM-DD]
- **Repos referenced**: [list with star counts]
- **Codebase size at time of run**: [file count, LOC]

If the codebase has grown by 20%+ since last run, or 3+ months have passed, run again. The intelligence decays as both the project and the reference repos evolve.

---

## Integration with Other Skills

| Skill | Relationship |
|-------|-------------|
| `/brain` | Brain loads project context. Super-brain loads external context. Run brain first, then super-brain. |
| `/review` | Review checks code quality reactively. Super-brain sets the quality bar proactively. |
| `/housekeeping` | Housekeeping cleans dead code. Super-brain prevents it from being written. |
| `/refactor` | Refactor executes changes. Super-brain tells you which changes to make. |
| `/polish` | Polish audits UI/UX. Super-brain audits architecture and code quality. |
| `/research` | Research looks at competitors and market. Super-brain looks at code. |

---

## The Standard We're Building Toward

> A developer opens the Felmark codebase for the first time. Within 10 minutes, they understand:
> - What the app does (from CLAUDE.md)
> - Where everything lives (from folder names)
> - How to add a new feature (from the REFACTORING_SOP.md in core/)
> - What patterns to follow (from the code itself — not docs, the actual code)
> - That every file has a reason to exist and every line has a reason to be there
>
> That's the bar. Super-brain exists to keep us there.
