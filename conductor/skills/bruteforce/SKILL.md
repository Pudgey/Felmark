---
name: bruteforce
description: Orchestrate a 5-agent adversarial codebase audit to find schema mismatches, leaks, async bugs, ghost UI, and structural rot.
---

# BRUTEFORCE -- 5-Agent Adversarial Codebase Audit

Launch 5 specialized auditors in parallel against the INDEP codebase. Each agent hunts a specific class of defect. Combined output provides full audit coverage across data integrity, runtime safety, async correctness, UX completeness, and architectural health.

Reference: `dev/conductor/standards/Bruteforce/BRUTEFORCE_SOP.md`

---

## Pre-Flight Checklist

Before spawning agents, complete these steps:

1. **Snapshot codebase state** -- Note the current commit hash or timestamp.
   ```bash
   cd /Users/donteennis/Indep/indep_app && git log --oneline -1
   ```

2. **Confirm target directories exist** -- Verify `lib/` structure is standard.
   ```bash
   ls lib/models/ lib/repositories/ lib/data/ lib/screens/ lib/providers/ lib/services/ lib/routing/
   ```

3. **Identify seed/mock data files** -- Agents 1 and 3 need these paths.
   - `packages/beverk_core/lib/data/seed_users.dart`
   - `packages/beverk_core/lib/data/seed_listings.dart`
   - `packages/beverk_core/lib/data/seed_firestore.dart`

4. **Collect known pre-existing issues** -- Read `dev/audits/FIX_MANIFEST.md` and extract all open/known issues. These will be passed to agents so they do not re-report them.

5. **Confirm no active refactor** -- Audit a stable state, not mid-change code. If a branch is in-flight, switch to main first.

---

## Agent Roster

| Pass | Codename | Domain | Target Dirs | Agent Spec |
|------|----------|--------|-------------|------------|
| 1 | DATA HAWK | Schema Mismatch | `lib/models/`, `lib/repositories/`, `lib/data/` | `agents/data-hawk.md` |
| 2 | CHAOS MONKEY | Leaks & Crashes | `lib/screens/`, `lib/providers/` | `agents/chaos-monkey.md` |
| 3 | ASYNC SNIPER | Async Safety | `lib/services/`, `lib/repositories/`, `lib/providers/` | `agents/async-sniper.md` |
| 4 | UX PESSIMIST | Ghost UI & Dead Zones | `lib/screens/` | `agents/ux-pessimist.md` |
| 5 | THE ARCHITECT | Structural Rot | `lib/routing/`, `lib/providers/`, full `lib/` tree | `agents/architect.md` |

---

## Spawn Instructions

Launch all 5 agents **in parallel** using `subagent_type: Explore` (read-only). Each agent receives:

1. Its mission statement and methodology from the corresponding agent spec in `agents/`.
2. The list of known pre-existing issues (from pre-flight step 4).
3. The target directory paths.

### Prompt Template for Each Agent

```
You are {CODENAME}, a specialized auditor for the BRUTEFORCE protocol.

## Your Mission
{MISSION_FROM_AGENT_SPEC}

## Target Directories
{TARGET_DIRS}

## Working Directory
/Users/donteennis/Indep/indep_app/

## Known Pre-Existing Issues (DO NOT REPORT)
{KNOWN_ISSUES_LIST}

## Scan Methodology
{METHODOLOGY_FROM_AGENT_SPEC}

## Output Requirements
1. Start with an Executive Summary (3-5 sentences, key numbers)
2. List findings in descending severity (CRITICAL -> HIGH -> MEDIUM)
3. Each finding must include: File(s), Issue, Impact, Evidence (code snippets)
4. End with a Statistics section including audit coverage tables
5. Use finding IDs: F-01, F-02, etc.

## Rules
- DO NOT modify any files. Read-only audit.
- DO NOT report known pre-existing issues listed above.
- DO NOT report style preferences (formatting, naming convention opinions).
- DO report evidence with exact file paths and line numbers.
- If a pattern appears 5+ times, report it once with a count, not 5 separate findings.
- Use code snippets to prove every finding -- no "I believe" or "it seems."
```

---

## Post-Audit Consolidation

After all 5 agents complete their reports:

### Step 1: Collect Reports

Gather all 5 agent outputs. Save each as:
```
dev/conductor/standards/Bruteforce/Reports/
  PASS_1_DATA_HAWK_{YYYY-MM-DD}.md
  PASS_2_CHAOS_MONKEY_{YYYY-MM-DD}.md
  PASS_3_ASYNC_SNIPER_{YYYY-MM-DD}.md
  PASS_4_UX_PESSIMIST_{YYYY-MM-DD}.md
  PASS_5_ARCHITECT_{YYYY-MM-DD}.md
```

### Step 2: Deduplicate Cross-Agent Findings

Some issues surface in multiple passes. Examples:
- Data Hawk finds a missing field; UX Pessimist reports the resulting empty UI.
- Async Sniper finds an unawaited write; Chaos Monkey flags the missing error handling.

Merge these into a single finding with the root cause from the deeper pass.

### Step 3: Build Master Severity Table

| ID | Pass | Severity | Title | Files |
|----|------|----------|-------|-------|
| B-01 | 1 | CRITICAL | ... | ... |
| B-02 | 3 | CRITICAL | ... | ... |

### Step 4: Prioritize Remediation

Order by impact:
1. CRITICAL findings that crash (runtime exceptions, phantom routes)
2. CRITICAL findings that lose data (unawaited writes, schema mismatches)
3. HIGH findings that degrade trust (dead buttons on core flows, ghost UI on ratings)
4. HIGH findings that leak (undisposed controllers, racing async)
5. MEDIUM findings (cleanup, consistency, accessibility)

### Step 5: Create Fix Tickets

For each finding or cluster of related findings:
- **What**: Precise description of the change
- **Where**: Exact file(s) and line(s)
- **How**: Suggested fix pattern (code sketch, not full implementation)
- **Risk**: What could break if the fix is done incorrectly

Update `dev/audits/FIX_MANIFEST.md` with new findings.

---

## When to Run BRUTEFORCE

- Before a major release (full audit of release candidate)
- After a large refactor (verify no regressions)
- After onboarding a new data source (validate schema alignment)
- Quarterly maintenance (catch accumulated tech debt)
