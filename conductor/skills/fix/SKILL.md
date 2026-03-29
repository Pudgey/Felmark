---
name: fix
description: Work a FIX_MANIFEST finding -- verify, fix, mark resolved, update manifest.
---

# Fix -- Resolve a FIX_MANIFEST Finding

Systematically work through a finding from `dev/audits/FIX_MANIFEST.md`. Every fix follows the same flow: verify the issue still exists, understand the root cause, apply the correct fix, prove it's resolved, and update the manifest.

References:
- `dev/audits/FIX_MANIFEST.md` (source of truth for all findings)
- `dev/conductor/standards/SUPER_DEBUGGER.md` (if the finding is complex)
- `dev/conductor/standards/Flutter/FLUTTER_CHECKLIST.md` (quick rules reference)
- `indep_app/CLAUDE.md` (Ground Rules)

---

## Step 0: Pick a Finding

Open `dev/audits/FIX_MANIFEST.md` and select a finding to work on.

### Selection Priority

1. **CRITICAL** open items first (data loss, crashes, security)
2. **HIGH** open items next (broken UX, silent failures)
3. **MEDIUM** items (inconsistencies, missing validation)
4. **LOW** items (code hygiene, minor polish)

Within the same severity, prefer findings that:
- Block an active mission
- Affect the most screens/users
- Are in files you're already touching

### Read the Finding

Each finding in the manifest has:
- **ID**: Unique reference (e.g., `BF-042`)
- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Source**: Which audit found it (bruteforce pass, logic audit, etc.)
- **Description**: What's wrong
- **File(s)**: Where the issue lives
- **Status**: Open / Fixed / Not An Issue

---

## Step 1: Verify the Finding

Before writing any fix, confirm the issue still exists. Code may have changed since the audit.

```bash
# 1. Read the affected file(s)
# Use the Read tool to examine the exact lines mentioned in the finding

# 2. Search for the pattern
grep -rn "<pattern from finding>" lib/

# 3. Run flutter analyze on the file
flutter analyze lib/path/to/affected_file.dart
```

### Possible Outcomes

| Finding Status | Action |
|---------------|--------|
| **Still present** | Proceed to Step 2 |
| **Already fixed** (code changed since audit) | Skip to Step 5, mark as Fixed with note "already resolved" |
| **Not a real issue** (intentional design, false positive) | Skip to Step 5, mark as "Not An Issue" with justification |
| **Partially fixed** | Note what remains, proceed to Step 2 for the remaining part |

---

## Step 2: Understand the Root Cause

Don't jump to a fix. Understand WHY the issue exists.

### Root Cause Categories

| Category | Example | Correct Fix |
|----------|---------|-------------|
| **Missing safety cast** | `map['field'] as String` (crashes on null) | `map['field'] as String? ?? ''` |
| **Schema asymmetry** | `toMap` writes `userName`, `fromMap` reads `name` | Align field names |
| **Missing disposal** | `AnimationController` created but never disposed | Add to `dispose()` method |
| **Ghost UI** | Button has `onPressed: () {}` (empty callback) | Wire to real action or remove button |
| **Flash-of-empty** | `.valueOrNull ?? []` returns empty during load | Use `.when()` with skeleton |
| **Async race** | `setState` after `await` without `mounted` check | Add `if (!mounted) return;` |
| **Missing validation** | TextField accepts any input | Add `InputValidator` |
| **Silent data loss** | Write fails but UI doesn't show error | Add error handling with user feedback |

### Check Related Standards

Before fixing, read the relevant standard to ensure your fix follows the established pattern:

| Issue Type | Standard to Check |
|-----------|-------------------|
| Data/schema | `wire` skill (Step 1: Model requirements) |
| State persistence | `PERSISTENCY_CHECK.md` |
| Async safety | `SUPER_DEBUGGER.md` (Common Bug Categories) |
| UI dead zones | `LOGIC_AUDIT_PROTOCOL.md` |
| TextField issues | CLAUDE.md Ground Rule #5 (border hardening) |
| Location queries | `LOCATION_STATE_PRINCIPLE.md` |

---

## Step 3: Apply the Fix

### Before Fixing

```bash
# Snapshot baseline
flutter analyze 2>&1 | tail -5

# Note the current error/warning count
```

### Fix Rules

1. **Fix only the reported issue.** No drive-by improvements, no refactoring, no "while I'm here" changes.
2. **Follow existing patterns.** Look at how adjacent code handles the same situation. Match the convention.
3. **Minimal diff.** The smallest change that resolves the finding correctly.
4. **Check the blast radius.** If changing a model field or function signature, grep all callers:
   ```bash
   grep -rn "functionName\|ClassName" lib/
   ```

### Common Fix Patterns

#### Hard Cast → Safe Cast
```dart
// BEFORE (crashes on null)
final name = map['name'] as String;

// AFTER
final name = map['name'] as String? ?? '';
```

#### Missing Disposal
```dart
// BEFORE (leak)
late final AnimationController _controller;

@override
void initState() {
  super.initState();
  _controller = AnimationController(vsync: this, duration: Duration(ms: 300));
}

// AFTER (add dispose)
@override
void dispose() {
  _controller.dispose();
  super.dispose();
}
```

#### Missing Mounted Check
```dart
// BEFORE (setState after dispose)
Future<void> _load() async {
  final data = await repository.fetch();
  setState(() => _items = data);
}

// AFTER
Future<void> _load() async {
  final data = await repository.fetch();
  if (!mounted) return;
  setState(() => _items = data);
}
```

#### Empty Callback → Real Action or Removal
```dart
// BEFORE (ghost button)
onPressed: () {},

// AFTER -- Option A: Wire to real action
onPressed: () => context.push('/feature/detail/${item.id}'),

// AFTER -- Option B: Remove the button entirely if no action exists yet
// (delete the button widget, don't leave a dead callback)
```

#### Flash-of-Empty → Proper Loading State
```dart
// BEFORE
final items = ref.watch(provider).valueOrNull ?? [];
return ListView(children: items.map(...).toList());

// AFTER
return ref.watch(provider).when(
  loading: () => const ItemListSkeleton(),
  error: (e, _) => ErrorState(message: 'Failed to load', onRetry: () => ref.invalidate(provider)),
  data: (items) => ListView(children: items.map(...).toList()),
);
```

---

## Step 4: Verify the Fix

```bash
# 1. Static analysis -- 0 new errors
flutter analyze

# 2. Run tests
flutter test

# 3. Manual verification -- launch the affected screen
flutter run -d chrome
# Navigate to the affected screen and verify:
# - The issue is resolved
# - No new visual regressions
# - Adjacent functionality still works
```

### Verification Questions

- [ ] Does the fix resolve the exact issue described in the finding?
- [ ] Does `flutter analyze` show 0 new errors/warnings?
- [ ] Does the fix follow the pattern from the relevant standard?
- [ ] Are there other instances of the same bug elsewhere? (grep to check)

**If you find other instances**: Don't fix them in this pass. Log them as new findings or note "N additional instances found" in the manifest update.

---

## Step 5: Update the Manifest

Edit `dev/audits/FIX_MANIFEST.md` to record the resolution.

### For Fixed Items

Change the finding's status and add resolution details:

```markdown
| BF-042 | HIGH | ~~Open~~ **Fixed** | `fromMap` hard cast on `rating` field | `lib/models/review.dart` | Safe cast with `?? 0.0` fallback. Fixed 2026-02-15. |
```

### For Not-An-Issue Items

```markdown
| BF-042 | MEDIUM | ~~Open~~ **Not An Issue** | Empty onPressed on share button | `lib/screens/listing/listing_detail.dart` | Intentional placeholder — share feature planned for M3. |
```

### Update the Summary Table

Adjust the counts in the summary table at the top of FIX_MANIFEST.md:

```markdown
| Severity | Open | Fixed | Not An Issue | Total |
|----------|------|-------|--------------|-------|
| HIGH | 2 | 34 | 3 | 39 |  ← was 3 open, now 2
```

Update the "Last verified" date.

---

## Step 6: Check for Systemic Pattern

After fixing, ask: **Is this a one-off or a pattern?**

```bash
# Search for the same bug pattern across the codebase
grep -rn "<bug pattern>" lib/
```

| Result | Action |
|--------|--------|
| 0 other instances | Done. Move on. |
| 1-2 other instances | Fix them now (same fix, same commit). Update manifest for each. |
| 3+ other instances | This is a systemic pattern. Write a journal entry. If 3+ journal entries share this tag, propose a standard update. |

---

## Anti-Patterns (Do NOT Do These)

| Anti-Pattern | Why It's Wrong | Do This Instead |
|-------------|---------------|----------------|
| Fix without verifying first | Issue may already be resolved | Always Step 1 first |
| Expand scope while fixing | Turns a 5-minute fix into a 2-hour refactor | Fix only the reported issue |
| Mark as "Not An Issue" without justification | Future audits will re-flag it | Always explain why |
| Fix the symptom, not the cause | Bug recurs in slightly different form | Trace to root cause (Step 2) |
| Forget to update manifest | Audit tracker becomes unreliable | Always Step 5 |
| Fix N instances but only update manifest for 1 | Manifest undercounts | Update for every instance |

---

## Verification Checklist

- [ ] Finding verified as still present (or marked as already fixed / not an issue)
- [ ] Root cause identified (not just symptom)
- [ ] Relevant standard consulted for correct fix pattern
- [ ] Fix applied with minimal diff
- [ ] `flutter analyze` -- 0 new errors
- [ ] `flutter test` -- 0 failures
- [ ] Manual verification on affected screen
- [ ] FIX_MANIFEST.md updated (status, resolution, date, summary table counts)
- [ ] Checked for systemic instances (`grep` for same pattern)
- [ ] Journal entry written if pattern is recurring (3+ instances)
