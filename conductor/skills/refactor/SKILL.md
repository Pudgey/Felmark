---
name: refactor
description: Safe incremental refactoring -- snapshot, change, verify, commit. One concern per pass.
---

# Refactor -- Safe Incremental Code Improvement

Apply a single, well-scoped refactoring to the INDEP codebase. Every refactor follows the same safety protocol: snapshot before, change one thing, verify nothing broke, commit. Never batch multiple unrelated improvements into one pass.

References:
- `dev/conductor/missions/FLUTTER_IMPROVEMENTS.md` (improvement backlog)
- `dev/conductor/standards/Flutter/FLUTTER_BEST_PRACTICES_2026-02-15.md`
- `indep_app/CLAUDE.md` (Ground Rules)

---

## Step 0: Scope the Change

Before touching code, answer these 3 questions:

1. **What is the single concern?** (e.g., "Migrate `UserProfileNotifier` from `StateNotifier` to `Notifier`")
2. **What files will be affected?** (the source file + all its importers)
3. **Is there a test?** (if yes, it must still pass after; if no, consider writing one first via the `test` skill)

### Scope Rules

- **One concern per refactor.** "Migrate StateNotifier AND add ref.select AND rename variables" is three refactors.
- **No behavioral changes.** The app should work identically before and after. If behavior must change, that's a feature, not a refactor.
- **No drive-by fixes.** If you notice a bug while refactoring, log it (FIX_MANIFEST or journal) and fix it separately.

---

## Step 1: Snapshot

Before touching anything:

```bash
# 1. Verify clean working tree
git status

# 2. Run analyze to establish baseline
flutter analyze 2>&1 | tail -5

# 3. Snapshot commit (if there are uncommitted changes)
git add -A && git commit -m "checkpoint: pre-refactor <description>"
```

**This is mandatory.** If the refactor goes wrong, you need a clean rollback point. Do not skip this step.

---

## Step 2: Map the Blast Radius

Find every file that imports or references the code you're changing:

```bash
# Find all importers of the file you're modifying
grep -rn "import.*<filename>" lib/

# Find all references to the symbol you're renaming/changing
grep -rn "SymbolName" lib/
```

Write down the list. Every file in this list must be checked after the change.

### Common Blast Radius Patterns

| Refactor Type | What to Grep |
|--------------|-------------|
| Rename provider | `grep -rn "providerName" lib/` |
| Change model field | `grep -rn "fieldName" lib/` + check `fromMap`/`toMap` |
| Migrate StateNotifier → Notifier | Grep the provider + all `ref.watch`/`ref.read` call sites |
| Extract widget | Grep for the old widget class name |
| Change function signature | Grep the function name, check all call sites |

---

## Step 3: Apply the Change

Make the change to the source file. Then update every file in the blast radius.

### Common Refactoring Recipes

#### A. StateNotifier → Notifier Migration

```dart
// BEFORE
class MyNotifier extends StateNotifier<AsyncValue<List<Item>>> {
  final Ref _ref;
  MyNotifier(this._ref) : super(const AsyncValue.loading()) { _load(); }

  Future<void> _load() async {
    final result = await repo.getAll();
    if (!mounted) return;
    result.when(
      success: (data) => state = AsyncValue.data(data),
      failure: (e) => state = AsyncValue.error(e, StackTrace.current),
    );
  }
}

final myProvider = StateNotifierProvider<MyNotifier, AsyncValue<List<Item>>>((ref) {
  return MyNotifier(ref);
});
```

```dart
// AFTER
class MyNotifier extends AutoDisposeAsyncNotifier<List<Item>> {
  @override
  Future<List<Item>> build() async {
    final result = await repo.getAll();
    return result.when(
      success: (data) => data,
      failure: (e) => throw Exception(e),
    );
  }
}

final myProvider = AsyncNotifierProvider.autoDispose<MyNotifier, List<Item>>(
  MyNotifier.new,
);
```

**Blast radius**: Every `ref.watch(myProvider)` and `ref.read(myProvider.notifier)` call site. The `.state` access pattern changes -- `state` is now `AsyncValue<T>` on the notifier itself.

#### B. Add `ref.select()` for Large State

```dart
// BEFORE -- rebuilds on ANY state change
final profile = ref.watch(userProfileProvider);
final name = profile.valueOrNull?.displayName ?? '';

// AFTER -- rebuilds only when displayName changes
final name = ref.watch(
  userProfileProvider.select((state) => state.valueOrNull?.displayName ?? ''),
);
```

**Blast radius**: Only the widget with the select. No other files affected.

#### C. Extract Reusable Widget

1. Cut the widget subtree from the parent
2. Create `lib/widgets/<category>/<widget_name>.dart`
3. Make configuration points into constructor parameters
4. Add to barrel file (`lib/widgets/<category>/<category>.dart`) if one exists
5. Replace original location with the new widget
6. Grep for duplicate patterns in other screens -- replace those too

#### D. Replace Hardcoded Values with base_ui Tokens

```dart
// BEFORE
padding: EdgeInsets.all(16),
style: TextStyle(fontSize: 14, color: Color(0xFF333333)),

// AFTER
padding: EdgeInsets.all(BaseSpacing.lg),
style: BaseTypography.bodyMedium.copyWith(color: BaseColors.textPrimary),
```

**Remember**: base_ui tokens are NOT const. Remove `const` from any parent widget.

---

## Step 4: Verify

Run these checks in order. Stop at the first failure.

```bash
# 1. Static analysis -- must match or improve baseline
flutter analyze

# 2. Tests -- all must pass
flutter test

# 3. Visual check -- launch app and verify the refactored screen
flutter run -d chrome
```

### Verification Matrix

| Check | Pass Criteria |
|-------|--------------|
| `flutter analyze` | 0 new errors or warnings vs baseline |
| `flutter test` | All tests pass (0 failures) |
| Importers compile | Every file in blast radius builds without error |
| Behavioral equivalence | App works identically before and after |
| No orphaned code | Old classes/functions deleted if replaced (grep to confirm 0 references) |

---

## Step 5: Commit

```bash
git add <specific files>
git commit -m "refactor: <one-line description of the single concern>"
```

### Commit Message Format

- `refactor: migrate UserProfileNotifier to AsyncNotifier`
- `refactor: extract ReusableCard widget from home screen`
- `refactor: replace hardcoded spacing with BaseSpacing tokens`
- `refactor: add ref.select to provider profile stats`

**One concern per commit.** If you changed two unrelated things, split into two commits.

---

## Step 6: Update Tracking (if applicable)

- If the refactor was from `FLUTTER_IMPROVEMENTS.md`, check off the item
- If you discovered a new issue during the refactor, add it to `FIX_MANIFEST.md` or write a journal entry
- If the refactor changed a public API that other skills reference, update those skills
- **If any system-level flow changed** (data pipeline, provider chain, service dependency), update `dev/LOGIC_REFERENCE.md` — edit the relevant section + append a Changelog row

---

## Anti-Patterns (Do NOT Do These)

| Anti-Pattern | Why It's Wrong | Do This Instead |
|-------------|---------------|----------------|
| Batch 3+ concerns in one pass | Impossible to bisect if something breaks | One concern per refactor |
| Refactor without snapshot commit | No rollback point | Always snapshot first |
| Rename AND change behavior | Can't tell which caused a regression | Separate the rename from the behavior change |
| Delete "unused" code without grep | Might be used dynamically or in tests | `grep -rn "SymbolName" .` before deleting |
| Skip analyze after change | Silent regressions | Always run analyze |
| Refactor untested code without adding tests first | No safety net | Write test first (test skill), then refactor |

---

## Verification Checklist

- [ ] Single concern identified and stated
- [ ] Snapshot commit made before changes
- [ ] Blast radius mapped (grep all importers/references)
- [ ] All importers updated to match new API
- [ ] `flutter analyze` -- 0 new errors vs baseline
- [ ] `flutter test` -- 0 failures
- [ ] App launches and refactored area works correctly
- [ ] Old code deleted (no orphaned classes/functions)
- [ ] Commit message follows `refactor: <description>` format
- [ ] Tracking updated (FLUTTER_IMPROVEMENTS.md, FIX_MANIFEST, or journal)
