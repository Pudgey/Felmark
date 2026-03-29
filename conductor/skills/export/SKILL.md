---
name: export
description: Walk through porting a dev_main.dart prototype screen to production safely.
---

# Export -- Prototype to Production Port

Step-by-step protocol for safely porting a screen from `dev_main.dart` (dev catalog) to the production app. The dev catalog uses a custom ThemeData (plain Material 3 + GoogleFonts), while production uses `BaseThemeData.light()` with different defaults. Without this protocol, text fields, colors, and spacing will break.

Reference: `dev/conductor/standards/EXPORT_PROTOCOL.md`

---

## Theme Differences to Account For

| Property | dev_main (mockup) | Production (BaseThemeData) |
|----------|-------------------|---------------------------|
| InputDecoration | unfilled, no border | `filled: true`, `fillColor: backgroundSecondary`, `OutlineInputBorder(12px)` |
| TextTheme | `GoogleFonts.interTextTheme()` | BaseTypography (Inter via base_ui) |
| ColorScheme | `fromSeed(0xFF6C5CE7)` | base_ui brand palette |

---

## Pre-Export Steps

### Step 1: TextField Border Hardening

For every `TextField` and `TextFormField` in the screen being ported:

- [ ] Set `filled: false` (or `filled: true` with explicit `fillColor`)
- [ ] Set ALL THREE borders: `border`, `enabledBorder`, `focusedBorder`
  - `border: InputBorder.none` alone does NOT override theme-level `enabledBorder`/`focusedBorder`
  - Always set: `border: InputBorder.none, enabledBorder: InputBorder.none, focusedBorder: InputBorder.none`
- [ ] Set `contentPadding` explicitly
- [ ] Set `hintStyle` using `BaseTypography.*` with explicit color
- [ ] Set `style` (text style) using `BaseTypography.*` with explicit color

Find all TextFields:
```bash
grep -rn "TextField\|TextFormField" lib/screens/<target>/
```

### Step 2: Style Hardening -- Colors and Typography

- [ ] All text colors use `BaseColors.*` (never `Theme.of(context).colorScheme.*`)
- [ ] All text styles use `BaseTypography.*` (never `Theme.of(context).textTheme.*`)
- [ ] All background colors use explicit `BaseColors.*` or literal `Color(0x...)` (never inherited)
- [ ] No `const` keyword on widgets referencing non-const `BaseColors.*`, `BaseTypography.*`, or `BaseSpacing.*`

### Step 3: Import Conflict Check

Before adding any import to the target file:
```bash
grep -rn "class ClassName" lib/
```

Known conflict patterns:
- `AuthColors` -- defined in both `neighborhood_hero.dart` and re-exported from `verify_email_screen.dart`
- Widget names that match across packages (e.g., `ShimmerSweep` in mockup vs existing `ShimmerSkeleton`)

Fix with `import '...' as prefix;` and a `typedef` alias if needed.

### Step 4: Widget Dependency Inventory

For every widget the screen imports:
- [ ] Confirm it exists in `indep_app` or `base_ui`
- [ ] Confirm the import path is correct for the production location
- [ ] If it is a new widget file, place it in the screen's `widgets/` subdirectory (NOT in shared `lib/widgets/`)

### Step 5: Asset Check

- [ ] All image paths use `assets/avatars/` (never `assets/images/avatars/`)
- [ ] base_ui assets use `package: 'base_ui'` in `Image.asset()` calls
- [ ] No new assets required (or they have been added to the correct `pubspec.yaml`)

---

## During Export

### Step 6: Snapshot Commit (NON-NEGOTIABLE)

Before touching ANY production files:
```bash
cd /Users/donteennis/Indep/indep_app
git add -A
git commit -m "checkpoint: pre-port <screen_name> redesign"
```

This gives you a clean revert target. If the port goes wrong:
```bash
git checkout HEAD~1 -- lib/screens/<target>/<file>.dart
```

### Step 7: Surgical Edit -- Only Touch the Target

- [ ] Only edit the target screen file (e.g., `login_screen.dart`)
- [ ] Do NOT modify shared widgets in `lib/widgets/`
- [ ] Do NOT modify providers, models, services, or repositories
- [ ] New sub-widgets go in the screen's own `widgets/` subdirectory

### Step 8: Import Path Translation

Map dev paths to production paths and update all `import` statements.

---

## Post-Export Verification

### Step 9: Static Analysis

```bash
flutter analyze lib/screens/<target>/
flutter analyze lib/dev_main.dart
```
Must show 0 NEW errors (pre-existing warnings are OK).

### Step 10: Visual Comparison

Run both entry points and compare:
```bash
flutter run -d chrome                          # Production app
flutter run -t lib/dev_main.dart -d chrome     # Dev catalog
```

The production screen must visually match the dev_main prototype. If text fields look different, revisit Step 1.

### Step 11: Regression Check

- [ ] `grep -rn "import.*<deleted_file>" lib/` -- if any file was removed, verify 0 importers remain
- [ ] Spot-check 3-4 other screens still render
- [ ] No new `flutter analyze` errors anywhere in the project

### Step 12: Final Commit

```bash
git add -A
git commit -m "feat: port <screen_name> redesign from dev prototype"
```

---

## Rollback

If `flutter analyze` shows new errors after porting:
```bash
git checkout -- lib/screens/<target>/
```
Then reassess against this checklist.
