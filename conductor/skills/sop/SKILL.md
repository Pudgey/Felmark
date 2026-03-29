---
name: sop
description: Production readiness orchestrator — audits screens across 11 dimensions, proposes missing features/screens, delegates to specialized skills.
---

# SOP — Standard Operating Procedure for Production Readiness

The **master orchestrator** skill. SOP answers the question every other skill answers partially: *"What does it take to ship this?"*

It reads the code, researches how best-in-class apps handle the same screen type, evaluates 11 dimensions (including missing features and screens), and produces a strategic operating procedure. When a dimension needs deeper work, SOP **delegates to the right specialized skill** — so the user never needs to know which of the 37 skills to invoke.

**Use `/sop` when**: You want a complete picture of what's left to ship — bugs, gaps, missing features, missing screens, everything.
**SOP replaces guessing** which skill to run. It analyzes first, then tells you (or runs) the right skill for each finding.

References:
- `dev/conductor/Skills/README.md` (full skills catalog — SOP references all available skills)
- `dev/conductor/standards/Flutter/FLUTTER_CHECKLIST.md`
- `dev/conductor/standards/PERSISTENCY_CHECK.md`
- `dev/audits/FIX_MANIFEST.md`
- `CLAUDE.md` (Ground Rules)

---

## Arguments

```
/sop <screen>          # Audit one screen (e.g., /sop category_screen)
/sop <feature>         # Audit a feature area (e.g., /sop booking, /sop chat)
/sop full              # Full app sweep — produces a master SOP across all screens
/sop status            # Show current SOP progress if a full sweep is in progress
```

---

## Step 0: Scope & Confirm

Ask the user:

> **What should I audit?**
> - A specific screen or feature area (faster, deeper)
> - Full app sweep (comprehensive, takes longer)

If the user specified a target in the argument, confirm it:

> Auditing: `lib/screens/category/category_screen.dart` + related widgets
> This will cover the [Category] marketplace screen. Proceed?

Wait for confirmation before starting.

---

## Step 1: Read the Screen

Read every file involved in the target screen:

1. **The screen file** itself (e.g., `category_screen.dart`)
2. **All widgets** it imports from its `widgets/` subdirectory
3. **Providers** it watches/reads
4. **Models** the providers return
5. **Routes** that navigate to/from this screen
6. **Shared widgets** it uses (cards, states, avatars, etc.)

Build a mental model: What does this screen DO? What data does it show? What actions can the user take? What states can it be in?

---

## Step 2: Research (Targeted)

Search the web for how best-in-class apps handle this specific screen type. This is NOT generic research — it's targeted to the exact screen pattern.

**Examples:**
- Category/marketplace screen → Search: "marketplace category page mobile app UX best practices 2026", "Airbnb category listing page", "Thumbtack service category mobile"
- Profile screen → Search: "user profile page mobile app trust signals 2026", "provider profile best practices marketplace"
- Chat/messaging → Search: "mobile messaging UX patterns 2026", "real-time chat best practices"
- Booking flow → Search: "service booking flow mobile UX", "appointment scheduling app patterns"

**Research output** (keep concise — 3-5 key insights):
- What do top apps include that we don't?
- What patterns are users expecting in 2026?
- Any UX research on this screen type? (Baymard, NNGroup, etc.)
- What adjacent screens or features do competitors provide?

Save research to: `dev/conductor/sops/research/YYYY-MM-DD_<screen>.md` (if significant findings)

---

## Step 3: The 11-Dimension Audit

For the target screen, evaluate each dimension. Score each as:
- **PASS** — meets production standard
- **PARTIAL** — exists but incomplete
- **FAIL** — missing or broken
- **N/A** — not applicable to this screen

### Dimension 1: Feature Completeness
- Can the user complete every core task on this screen?
- Are there dead buttons, "coming soon" placeholders, or mock data?
- Does every CTA route to a real destination?
- Are all interactive elements wired to real actions?
- **Delegate**: `/find` for systematic dead-code scan, `/micro` for dead button audit

### Dimension 2: Data Integrity
- Does all data come from Firestore (not mock/seed)?
- Are providers using `.when()` (not `.valueOrNull`)?
- Is data city-scoped where required?
- Does the screen handle the full data lifecycle? (create, read, update, delete)
- **Delegate**: `/wire-audit` for broken data chains, `/macro-persist` for ripple failures

### Dimension 3: Empty / Loading / Error States
- Does every data-driven widget have all 3 states?
- Are empty states warm and actionable (not just "No data")?
- Do loading states use skeletons (not spinners)?
- Do error states have retry CTAs?
- Is there a Pioneer state for empty cities?
- **Delegate**: `/empty` for comprehensive empty-state audit

### Dimension 4: Edge Cases
- What happens on back navigation mid-flow?
- What happens with no network?
- What happens if the user is logged out mid-screen?
- What happens with very long text, many items, or zero items?
- What happens if Firestore returns unexpected data types?
- Deep link to this screen — does it work cold-start?
- **Delegate**: `/fallback` for failure-point classification, `/debug` for complex edge cases

### Dimension 5: Accessibility
- Do all interactive elements have `Semantics` labels?
- Are touch targets >= 44dp?
- Does the screen work with text scaling (up to 200%)?
- Is color contrast >= 4.5:1 for all text?
- Is there a logical focus/tab order?
- Are decorative elements excluded from screen readers?
- **Delegate**: `/a11y` for full accessibility audit

### Dimension 6: Responsiveness
- Does the layout work on narrow viewports (320dp)?
- Does the layout work on wide viewports (tablet)?
- Does text truncate gracefully with `maxLines` + `overflow`?
- Are images constrained with `cacheHeight`/`cacheWidth`?
- Is there horizontal scroll overflow on any row?
- **Delegate**: `/responsive` for full responsive audit

### Dimension 7: Security
- Is user input validated before submission?
- Are auth gates enforced on this screen's route?
- Is there any client-side data the user shouldn't see?
- Are Firestore writes validated by rules?
- **Delegate**: `/secure` for full security audit

### Dimension 8: Performance
- Are lists using `ListView.builder` / `SliverList` (not `Column`)?
- Are controllers disposed?
- Are providers using `ref.watch()` in build, `ref.read()` in callbacks?
- Are images cached with `cacheHeight`/`cacheWidth` in lists?
- Are there unnecessary rebuilds from over-watching?
- **Delegate**: `/perf` for full performance audit

### Dimension 9: Brand & Tone
- Do all user-facing strings match INDEP voice? (warm, neighborhood, peer-to-peer)
- Are error messages helpful and human? (not technical or generic)
- Are empty states encouraging? (not "No results found")
- Is copy consistent with other screens?
- Are there any placeholder strings ("Lorem ipsum", "TODO", "Coming soon")?
- **Delegate**: `/tone` for full microcopy audit

### Dimension 10: Platform Compliance
- Is the screen using base_ui tokens (not hardcoded colors/styles)?
- Are all three TextField borders set?
- Are `const` rules followed (no const on BaseColors/BaseTypography widgets)?
- Is the file header comment present?
- Does `flutter analyze` pass with 0 errors?
- **Delegate**: `/review` for code review checklist

### Dimension 11: Feature Gaps & Opportunities
This is where SOP goes beyond auditing what exists — it identifies what's **missing**.

- What do competitors include on this screen type that we don't?
- What would a first-time user expect to find here based on industry norms?
- Are there missing screens that should exist adjacent to this one?
  - e.g., Category screen exists but no "Save this search" flow
  - e.g., Provider profile exists but no "Request a quote" sheet
  - e.g., Booking exists but no "Rate your experience" post-completion prompt
- Are there micro-features that would significantly increase trust or engagement?
  - e.g., "Verified" filter, "Response time" badge, "Similar providers" section
- What's the minimum feature set for this screen type to feel complete to a first-time user?

**Classify each suggestion:**

| Classification | Meaning | Example |
|---------------|---------|---------|
| **Expected** | Users will notice its absence — industry standard | Sort by rating, filter by price, save search |
| **Differentiator** | Sets INDEP apart from competitors | "Neighbors who hired this provider", community vouches |
| **Nice-to-have** | Polish, not core — adds delight | Parallax hero, animated transitions, share card |

**Delegate**: `/mission` to plan missing features, `/newscreen` to scaffold new screens, `/wire` to connect new data flows

---

## Step 4: Skill Delegation Map

After completing the 11-dimension audit, SOP recommends which skills to run next. This is the key value — **the user doesn't need to know 37 skills exist.** SOP maps findings to skills automatically.

### Full Skill Catalog (SOP references all available skills)

**IMPORTANT**: When new skills are created, update this table. SOP must always know the full catalog.

| Dimension | Finding Type | Recommended Skill | What It Does |
|-----------|-------------|-------------------|-------------|
| 1. Feature | Dead buttons, unwired CTAs | `/find` or `/micro` | Hunt dead interactive elements |
| 2. Data | Broken wiring chain | `/wire-audit` | Audit Screen → Provider → Repo → Model |
| 2. Data | Stale data not rippling | `/macro-persist` | Hunt cross-screen data inconsistency |
| 3. States | Missing loading/empty/error | `/empty` | Comprehensive state audit |
| 4. Edge | Failure points need classification | `/fallback` | Tier-classify failure mechanics |
| 4. Edge | Complex bug needs root cause | `/debug` | Parallel hypothesis debugging |
| 5. A11y | Accessibility gaps | `/a11y` | Full accessibility audit |
| 6. Responsive | Layout breaks on viewports | `/responsive` | Responsive overflow audit |
| 7. Security | Auth, rules, input validation | `/secure` | Full security audit |
| 8. Perf | Rebuilds, jank, memory | `/perf` | Flutter performance audit |
| 9. Tone | Off-brand copy | `/tone` | Microcopy and voice audit |
| 10. Compliance | Code quality | `/review` | Code review protocol |
| 11. Gaps | Missing feature needs planning | `/mission` | Feature mission planning |
| 11. Gaps | New screen needed | `/newscreen` | Scaffold screen + routing |
| 11. Gaps | New data flow needed | `/wire` | Model → Repo → Provider → Screen |
| Any | Multiple P0-P1 findings | `/swarm` | Multi-agent batch fix |
| Any | Single known bug | `/fix` | Work a FIX_MANIFEST finding |
| Any | Need to see it running | `/deploy` | Build and deploy to Firebase |
| Any | Pre-release final check | `/polish` | Polish checklist |
| Any | Persistence concern | `/persist-check` | State survival audit |
| Any | Online/toggle state bugs | `/micro-persist` | Micro-persistence hunt |
| Any | Visual heaviness | `/breathe` | Lighten the interface |
| Any | User journey broken | `/flow` | End-to-end journey audit |
| Any | Heatmap data available | `/heatmap` | Interpret click/scroll data |
| Any | Strategic optimization | `/optimize` | Multi-mode strategy engine |
| Any | Full adversarial audit | `/bruteforce` | 5-agent codebase tear-down |
| Any | Need tests | `/test` | Write unit/widget/provider tests |
| Any | Cleanup needed | `/housekeeping` | Dead files, stale imports, temp artifacts |
| Any | Safe restructure | `/refactor` | Incremental refactoring |
| Any | Quality gate | `/aas` | Three-layer independent review |
| Any | Seed data needed | `/seed` | Create Firestore test data |
| Any | Upload pipeline | `/upload` | Media upload flow |
| Any | Batch parallel work | `/sprint` | Multi-agent task board |

### How Delegation Works

After the audit, SOP presents its findings and recommends next steps:

```
## Recommended Next Steps

Based on this SOP, here's what to run next:

1. **P0 Blockers** (2 items) → Fix directly or `/fix`
2. **Accessibility** (FAIL) → Run `/a11y category_screen` for deep audit
3. **Empty States** (PARTIAL) → Run `/empty category_screen`
4. **Missing Features** (3 Expected gaps) → Run `/mission` to plan "Save Search" feature
5. **Brand Voice** (PARTIAL) → Run `/tone category_screen`

Want me to run any of these now?
```

The user can say "run 2 and 3" and SOP launches those skills. Or "run all" for a full sweep. Or "just the SOP doc is enough" to stop at planning.

---

## Step 5: Gap Classification

For every PARTIAL or FAIL finding, classify it:

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0 — Blocker** | Crashes, data loss, security hole, broken core flow | Must fix before any user sees this screen |
| **P1 — Critical** | Major UX gap, missing state, dead feature, accessibility violation, Expected feature gap | Must fix before beta |
| **P2 — Important** | Inconsistent copy, minor edge case, performance optimization, Differentiator feature gap | Fix during beta polish |
| **P3 — Nice-to-have** | Visual polish, micro-interaction, animation, Nice-to-have feature gap | Post-beta backlog |

---

## Step 6: Write the SOP Document

Write to `dev/conductor/sops/SOP_<screen_name>.md`:

```markdown
# SOP: [Screen Name] — Production Readiness

> **Created**: YYYY-MM-DD
> **Screen**: `lib/screens/<path>/<screen>.dart`
> **Status**: DRAFT
> **Overall Score**: X/11 dimensions passing
> **Skills Catalog Version**: 37 skills (as of YYYY-MM-DD)

## Audit Summary

| # | Dimension | Score | Findings | Skill to Run |
|---|-----------|-------|----------|-------------|
| 1 | Feature Completeness | PASS/PARTIAL/FAIL | Brief note | `/find` if needed |
| 2 | Data Integrity | PASS/PARTIAL/FAIL | Brief note | `/wire-audit` if needed |
| 3 | Empty/Loading/Error | PASS/PARTIAL/FAIL | Brief note | `/empty` if needed |
| 4 | Edge Cases | PASS/PARTIAL/FAIL | Brief note | `/fallback` if needed |
| 5 | Accessibility | PASS/PARTIAL/FAIL | Brief note | `/a11y` if needed |
| 6 | Responsiveness | PASS/PARTIAL/FAIL | Brief note | `/responsive` if needed |
| 7 | Security | PASS/PARTIAL/FAIL | Brief note | `/secure` if needed |
| 8 | Performance | PASS/PARTIAL/FAIL | Brief note | `/perf` if needed |
| 9 | Brand & Tone | PASS/PARTIAL/FAIL | Brief note | `/tone` if needed |
| 10 | Platform Compliance | PASS/PARTIAL/FAIL | Brief note | `/review` if needed |
| 11 | Feature Gaps | PASS/PARTIAL/FAIL | Brief note | `/mission` if needed |

## Research Insights
[3-5 key findings from web research — what top apps do that we don't]

## Feature Gap Analysis (Dimension 11)

### Expected (users will notice absence)
| Gap | What competitors do | Recommendation | Priority |
|-----|-------------------|----------------|----------|

### Differentiators (sets INDEP apart)
| Gap | Why it matters | Recommendation | Priority |
|-----|---------------|----------------|----------|

### Nice-to-have (delight, not core)
| Gap | Inspiration | Recommendation | Priority |
|-----|------------|----------------|----------|

### Missing Screens / Flows
| Screen | Purpose | Connects to | Priority |
|--------|---------|-------------|----------|

## Action Items

### P0 — Blockers (fix before anyone sees this)
| ID | Dimension | Issue | File | Fix | Skill |
|----|-----------|-------|------|-----|-------|

### P1 — Critical (fix before beta)
| ID | Dimension | Issue | File | Fix | Skill |
|----|-----------|-------|------|-----|-------|

### P2 — Important (fix during beta polish)
| ID | Dimension | Issue | File | Fix | Skill |
|----|-----------|-------|------|-----|-------|

### P3 — Nice-to-have (post-beta backlog)
| ID | Dimension | Issue | File | Fix | Skill |
|----|-----------|-------|------|-----|-------|

## Recommended Next Steps

[Prioritized list of skills to run, based on findings]

1. [Skill] — [Why] — [Scope]
2. [Skill] — [Why] — [Scope]
3. ...

## Production Readiness Verdict

**READY** / **READY WITH CAVEATS** / **NOT READY**

[One paragraph: what needs to happen before this screen ships]
```

---

## Step 7: Full Sweep Mode

When the user runs `/sop full`:

1. **Inventory all screens**: List every screen in `lib/screens/` grouped by feature area
2. **Prioritize**: Start with the highest-traffic screens (home, explore, category, listing detail, profile, messages)
3. **Batch audit**: Run Steps 1-6 for each screen, producing individual SOP files
4. **Master SOP**: After all screens are audited, produce `dev/conductor/sops/SOP_MASTER.md`:

```markdown
# Master SOP — App-Wide Production Readiness

> **Created**: YYYY-MM-DD
> **Screens Audited**: N
> **Overall Readiness**: X%
> **Skills Catalog Version**: 37 skills

## Screen Readiness Matrix

| Screen | Score | P0 | P1 | P2 | P3 | Verdict |
|--------|-------|----|----|----|----|---------|
| Home V4 | 9/11 | 0 | 2 | 3 | 1 | READY WITH CAVEATS |
| Explore | 8/11 | 0 | 3 | 4 | 2 | READY WITH CAVEATS |
| Category | 10/11 | 0 | 0 | 2 | 1 | READY |
| ... | ... | ... | ... | ... | ... | ... |

## App-Wide Patterns
[Systemic issues that appear across multiple screens]

## Missing Features & Screens (Aggregated Dimension 11)
[All Expected/Differentiator gaps across every screen, deduplicated]

## Recommended Skill Runs
[Aggregated skill recommendations across all screens, deduplicated]

| Skill | Screens Affected | Finding Count | Priority |
|-------|-----------------|---------------|----------|
| `/a11y` | 8 screens | 14 findings | P1 |
| `/empty` | 5 screens | 9 findings | P1 |
| `/tone` | 12 screens | 18 findings | P2 |

## Recommended Sprint
[Suggested order to address P0 and P1 items across all screens]
```

5. **Cap**: Max 5 screens per sweep session to avoid context exhaustion. Pause and checkpoint between batches.

---

## Self-Maintenance: Keeping SOP Current

**SOP must always know about every available skill.** When the skill catalog changes:

1. **On new skill creation**: Update the Skill Delegation Map table (Step 4) to include the new skill with its trigger conditions.
2. **On skill removal**: Remove it from the delegation map.
3. **On skill rename**: Update all references in the delegation map.
4. **Periodically**: Compare the delegation map against `dev/conductor/Skills/README.md` to detect drift. If a skill exists in README but not in SOP's map, add it.

The `Skills Catalog Version` field in SOP documents tracks how many skills were available at audit time. If a future SOP run has a higher version, earlier SOPs may be missing delegation recommendations.

---

## Anti-Patterns (Do NOT Do These)

| Anti-Pattern | Why It's Wrong | Do This Instead |
|-------------|---------------|----------------|
| Fix issues during the audit | SOP is a planning tool, not an execution tool | Document findings, delegate to skills |
| Flag every minor style issue | Noise buries real gaps | Only flag things that affect users or trust |
| Skip web research | Miss what users expect in 2026 | Always research the specific screen type |
| Audit without reading the code | Assumptions miss real state | Read every file the screen touches |
| Mark everything P0 | Kills prioritization | Be honest — most issues are P1-P2 |
| Audit mock/dev screens | Waste of time | Only audit production-path screens |
| Forget Dimension 11 | Miss the forest for the trees | Always assess what's missing, not just what's broken |
| Skip skill delegation | User has to guess which skill to run | Always recommend specific skills for each finding |
| Let the skill catalog go stale | SOP stops being the orchestrator | Update delegation map when skills change |

---

## Verification Checklist

- [ ] Scope confirmed with user (specific screen or full sweep)
- [ ] All screen files read (screen, widgets, providers, models, routes)
- [ ] Web research conducted for the specific screen type
- [ ] All 11 dimensions evaluated with PASS/PARTIAL/FAIL
- [ ] Dimension 11 (Feature Gaps) includes Expected/Differentiator/Nice-to-have classification
- [ ] Findings classified by priority (P0-P3)
- [ ] Each finding has a recommended skill in the Skill column
- [ ] SOP document written to `dev/conductor/sops/`
- [ ] Recommended Next Steps section lists specific skills to run
- [ ] No code was modified (SOP is read-only + planning)
- [ ] Summary reported to user with verdict
- [ ] Skills Catalog Version matches current skill count
