---
name: tone
description: Microcopy and brand voice audit -- sweep one screen or feature area for off-brand, generic, or inconsistent copy.
---

# Tone -- Microcopy & Brand Voice Audit

Audit one screen (or feature area) per pass. Find every user-facing string -- error messages, empty states, button labels, snackbar text, dialog titles, placeholders, tooltips, confirmation messages, loading text -- and verify it speaks in the INDEP voice: warm, encouraging, neighborhood-rooted.

References:
- `packages/base_ui/` (design tokens -- BaseColors, BaseTypography)
- `lib/screens/` (all feature screens)
- `lib/widgets/` (shared components, empty states, error states)
- `CLAUDE.md` (Ground Rules, Product Vision)

---

## INDEP Voice Guide

INDEP is "your neighborhood engine for independence." The voice is a friendly neighbor who knows the block -- not a corporation, not a chatbot trying too hard to be cute.

### Voice Principles

| Principle | Meaning |
|-----------|---------|
| **Warm** | Feels like a neighbor talking, not a system reporting |
| **Encouraging** | Assumes the best, nudges forward, never scolds |
| **Grounded** | Refers to real places, real people, real neighborhoods |
| **Clear** | Says what happened and what to do next -- no jargon |
| **Brief** | Respects attention -- every word earns its place |

### Do / Don't Cheat Sheet

| Category | Don't | Do |
|----------|-------|----|
| **Errors** | "Something went wrong" | "Couldn't load your neighborhood feed -- tap to try again" |
| **Errors** | "Error 403" | "You don't have access to this yet" |
| **Errors** | "Network error" | "Looks like you're offline -- we'll retry when you're back" |
| **Empty states** | "No data" | "Nothing here yet -- be the first on your block" |
| **Empty states** | "No results found" | "No matches in your area -- try broadening your search" |
| **Empty states** | "No items" | "Your neighborhood is waiting -- post something new" |
| **Buttons** | "Submit" | "Post it" / "Share with neighbors" / "Send" |
| **Buttons** | "Cancel" | "Never mind" / "Go back" |
| **Buttons** | "OK" | "Got it" / "Sounds good" |
| **Confirmations** | "Are you sure?" | "Remove this listing from your neighborhood?" |
| **Confirmations** | "Delete item?" | "Take down this post? You can always create a new one." |
| **Loading** | "Loading..." | "Checking your neighborhood..." / "Pulling up the latest..." |
| **Loading** | "Please wait" | "Almost there..." / "One moment..." |
| **Success** | "Success" | "You're all set!" / "Posted to your neighborhood" |
| **Success** | "Operation completed" | "Done! Your neighbors can see this now." |
| **Placeholders** | "Enter text here" | "What are you offering?" / "Describe what you need..." |
| **Placeholders** | "Search" | "Search your neighborhood..." |
| **Tooltips** | "Click to view" | "See what your neighbors are up to" |
| **Onboarding** | "Create account" | "Join your neighborhood" |
| **Onboarding** | "Select your location" | "Where's home?" / "Pick your neighborhood" |

### Capitalization Rules

- **Buttons**: Sentence case ("Post it", not "Post It" or "POST IT")
- **Titles/Headers**: Sentence case ("Your neighborhood feed", not "Your Neighborhood Feed")
- **Snackbars**: Sentence case, no trailing period for short messages
- **Error messages**: Sentence case, include recovery action when possible

### Punctuation Rules

- **No periods** on single-sentence snackbars or button labels
- **Use periods** on multi-sentence empty state descriptions
- **Use ellipsis (...)** sparingly -- only for loading states or trailing prompts
- **No exclamation marks** in error messages (feels panicky)
- **One exclamation max** in success messages ("You're all set!")

---

## Step 0: Select Target

Pick one screen or feature area to audit. One pass = one target.

Good targets (pick one):
- A single screen file (e.g., `lib/screens/home/v4/v4_greeting.dart`)
- A feature directory (e.g., `lib/screens/listing/`)
- A shared widget set (e.g., `lib/widgets/empty_states/`)
- A flow (e.g., onboarding screens end-to-end)

```bash
# Find all user-facing strings in the target
grep -rn "Text(" lib/screens/<target>/
grep -rn "hintText\|labelText\|helperText" lib/screens/<target>/
grep -rn "SnackBar\|showSnackBar\|ScaffoldMessenger" lib/screens/<target>/
grep -rn "AlertDialog\|showDialog\|DialogTitle" lib/screens/<target>/
grep -rn "tooltip\|Tooltip" lib/screens/<target>/
grep -rn "PioneerCityState\|V4SectionError\|EmptyState" lib/screens/<target>/
```

---

## Step 1: Extract All User-Facing Copy

Read the target file(s) and catalog every string the user could see.

### Copy Inventory Table

Build a table of every string found:

| Location | Type | Current Copy | Issue? |
|----------|------|-------------|--------|
| `file.dart:42` | Error message | "Something went wrong" | Generic -- no context |
| `file.dart:78` | Button label | "Submit" | Corporate -- not INDEP voice |
| `file.dart:103` | Empty state | "No listings" | Cold -- needs encouragement |
| `file.dart:120` | Hint text | "Enter text" | Placeholder left in |

### Types to Catalog

1. **Error messages** -- `V4SectionError`, `catch` blocks, `.when(error:)` callbacks
2. **Empty states** -- `PioneerCityState`, custom empty widgets, "no data" conditions
3. **Button labels** -- `ElevatedButton`, `TextButton`, `IconButton` with text
4. **Snackbar text** -- `ScaffoldMessenger.of(context).showSnackBar`
5. **Dialog titles and bodies** -- `AlertDialog`, `showDialog`, `showModalBottomSheet`
6. **Placeholder/hint text** -- `hintText`, `labelText`, `helperText` on TextFields
7. **Tooltips** -- `Tooltip(message:)`, `tooltip:` properties
8. **Confirmation messages** -- Delete dialogs, "are you sure" patterns
9. **Loading text** -- Strings shown during async operations
10. **Success messages** -- Post-action feedback (snackbars, dialogs, inline text)

---

## Step 2: Flag Issues

Check every cataloged string against the voice guide. Flag anything that matches these categories:

### Red Flags (Must Fix)

| Flag | Pattern | Example |
|------|---------|---------|
| **Generic** | Default framework text with no context | "Something went wrong", "Error", "No data", "Loading..." |
| **Technical** | Exposes internals to the user | "Null pointer", "Exception", "timeout", "403", "parse error" |
| **Leftover placeholder** | Developer text shipped to UI | "TODO", "placeholder", "test", "lorem ipsum", "Enter text here" |
| **Missing recovery** | Error with no next step | "Failed to load" (no retry button or suggestion) |
| **Hostile tone** | Blames the user or sounds robotic | "Invalid input", "You must...", "Required field" |

### Yellow Flags (Should Fix)

| Flag | Pattern | Example |
|------|---------|---------|
| **Inconsistent casing** | Mixed Title Case and sentence case | "Post It" vs "Post it" in same flow |
| **Corporate voice** | Correct but soulless | "Submit", "Cancel", "Confirm", "Proceed" |
| **Missed opportunity** | Functional but not INDEP-flavored | "Search" vs "Search your neighborhood..." |
| **Punctuation drift** | Inconsistent periods, exclamation marks | "Done!" next to "Posted." in same flow |
| **Overlong** | More than two sentences in a snackbar | Snackbar should be scannable in under 2 seconds |

---

## Step 3: Write Replacements

For every flagged string, write a replacement that follows the INDEP voice guide.

### Replacement Rules

1. **Keep it short.** If the original was 5 words, aim for 5-8 words. Don't turn a label into a paragraph.
2. **Include context.** "Couldn't load listings" beats "Something went wrong" because it says what failed.
3. **Include recovery.** Error messages should say what the user can do: "tap to retry", "check your connection", "try again later."
4. **Sound like a neighbor.** Read it out loud -- would a friendly neighbor say this? If not, rewrite.
5. **Stay consistent.** If one empty state says "Nothing here yet", don't make the next one say "No content available."

### Replacement Table

| Location | Current | Replacement | Reason |
|----------|---------|-------------|--------|
| `file.dart:42` | "Something went wrong" | "Couldn't load your feed -- tap to try again" | Adds context + recovery |
| `file.dart:78` | "Submit" | "Post it" | INDEP voice |
| `file.dart:103` | "No listings" | "No listings in your area yet -- be the first!" | Encouraging + grounded |

---

## Step 4: Apply Changes

Edit the target file(s) to replace flagged copy with approved replacements.

### Before Editing

```bash
# Snapshot baseline
flutter analyze lib/screens/<target>/ 2>&1 | tail -5
```

### Edit Rules

1. **Only change string literals.** Do not restructure widgets, change layouts, or modify logic.
2. **Preserve interpolation.** If the string uses `$variable` or `${expression}`, keep it in the replacement.
3. **Preserve context.** If the string is inside a `Text()` widget with specific styling, keep the styling.
4. **Check for reuse.** If a string is defined as a constant or in a shared widget, grep callers before changing:
   ```bash
   grep -rn "the exact string" lib/
   ```
   If used in multiple places, update all instances for consistency.

---

## Step 5: Verify

```bash
# 1. Static analysis -- 0 new errors
flutter analyze lib/screens/<target>/

# 2. Grep for any remaining red flags in the target
grep -rn '"Something went wrong"\|"Error"\|"No data"\|"Loading..."' lib/screens/<target>/
grep -rn '"TODO"\|"placeholder"\|"test text"' lib/screens/<target>/
grep -rn '"Submit"\|"Cancel"\|"OK"' lib/screens/<target>/

# 3. Run app and visually confirm
flutter run -d chrome
# Navigate to the target screen and verify:
# - All copy reads naturally in the INDEP voice
# - No truncation from longer replacement strings
# - Capitalization is consistent (sentence case throughout)
# - No leftover generic/placeholder text
```

### Visual Spot Check

- [ ] Read every visible string on the screen out loud -- does it sound like a friendly neighbor?
- [ ] Check string length -- did any replacement cause text overflow or truncation?
- [ ] Check consistency -- do all buttons, errors, and empty states use the same tone?
- [ ] Check dark mode (if applicable) -- are all strings still legible?

---

## Step 6: Commit

```bash
git add lib/screens/<target>/
git commit -m "tone: microcopy audit for <target screen/feature>"
```

If the audit touched shared widgets (empty states, error components), include those:

```bash
git add lib/screens/<target>/ lib/widgets/<affected>/
git commit -m "tone: microcopy audit for <target> + shared widgets"
```

---

## Anti-Patterns (Do NOT Do These)

| Anti-Pattern | Why It's Wrong | Do This Instead |
|-------------|---------------|----------------|
| Audit the whole app at once | Unfocused, misses nuance per screen | One screen/feature per pass |
| Change widget structure to fix copy | Scope creep -- this is a copy audit | Only change string literals |
| Make copy "clever" or punny | Cutesy wears thin fast | Warm and clear beats clever |
| Use different tone per screen | Breaks the unified voice | Follow the cheat sheet consistently |
| Skip the grep for shared strings | Risk breaking other screens | Always check for reuse before editing |
| Add emoji to user-facing strings | Not part of INDEP design language | Use words, not symbols |

---

## Verification Checklist

- [ ] Target screen/feature selected (one per pass)
- [ ] All user-facing strings cataloged (errors, empties, buttons, snackbars, dialogs, hints, tooltips, loading, success)
- [ ] Every string checked against the INDEP voice guide
- [ ] Red flags identified and replaced (generic, technical, placeholder, hostile)
- [ ] Yellow flags identified and replaced (corporate, inconsistent, missed opportunity)
- [ ] Replacements follow the voice principles (warm, encouraging, grounded, clear, brief)
- [ ] Capitalization is consistent (sentence case throughout)
- [ ] No widget structure changes -- only string literal edits
- [ ] Shared strings grepped and updated consistently across all usages
- [ ] `flutter analyze` -- 0 new errors
- [ ] Visual spot check passed (no truncation, consistent tone, readable)
- [ ] Committed with `tone:` prefix in commit message
