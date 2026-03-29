---
name: micro
description: Hyper-micro hardening -- hunt silent failures in navigation, small interactive elements, feedback loops, and system integrations.
---

# Micro -- Hyper-Micro Hardening for Small Elements & Redirects

Hunt for the small things that are **assumed to work** but have never been explicitly verified. These are the silent failure points -- the invisible glue that holds the app together. Every element found must pass the full 5-step chain before it's considered hardened.

Reference: `dev/conductor/standards/HYPER_MICRO_HARDENING_SOP.md`

---

## Global Rules

- **One category per pass** -- do not mix navigation with feedback elements
- **Declare scope** -- state the category and target directory before starting
- **Every finding must be traced end-to-end** -- no "looks fine" conclusions
- **`flutter analyze` after every change** -- zero new errors before moving on
- **Preserve all existing behavior** -- fix broken chains, don't redesign them
- **Commit after each completed pass** -- `git commit -m "micro(<category>): <summary>"`

---

## The Hyper-Micro Formula

For **every element** found in any category, apply this exact sequence:

```
1. FIND    — locate the element in the codebase (file:line)
2. TRACE   — follow it end-to-end: trigger → action → result → feedback
3. VERIFY  — confirm every step in the chain actually executes
4. HARDEN  — fix any broken, missing, or silent step in the chain
5. CONFIRM — run flutter analyze and verify the fix works end-to-end
```

No element is considered hardened until all 5 steps are complete. If step 3 reveals the chain is intact, mark it as verified and move on -- don't fix what isn't broken.

---

## Category: Navigation & Redirects

Hunt for anything that assumes a route will work without verifying it.

**Hunt for:**
- [ ] Named routes that are defined in the router but never reachable from any UI element
- [ ] Deep links that land on the wrong screen or crash silently (check `GoRoute` redirect logic)
- [ ] Back button behavior that skips screens or exits the app unexpectedly (missing `WillPopScope` / `PopScope`)
- [ ] `context.pop()` operations that return incorrect or `null` results to the caller
- [ ] Redirects that fire before auth state is confirmed (race condition with `authStateProvider`)
- [ ] Navigation that doesn't account for the user being mid-flow (form half-filled, upload in progress, unsaved changes)
- [ ] Routes with required path/query parameters that aren't validated on arrival
- [ ] `context.go()` vs `context.push()` misuse (go replaces stack, push adds to it)
- [ ] Navigation guards that check auth but not onboarding completion or city selection

**Trace pattern:** UI trigger → `context.go/push/pop` → GoRouter match → redirect logic → destination screen `build()` → expected state available

---

## Category: Small Interactive Elements

Hunt for tiny UI elements that are present but not fully functional.

**Hunt for:**
- [ ] Buttons that are visible but have `onPressed: null` or an empty `() {}` handler
- [ ] Toggle switches that update local UI state but don't persist the change (Firestore write missing)
- [ ] Dropdowns or selectors with hardcoded option lists that are incomplete or stale
- [ ] Chips, badges, or tags that display but trigger no action when tapped (decorative vs interactive confusion)
- [ ] Links (URLs, phone numbers, emails) that navigate nowhere or open the wrong destination
- [ ] Form field validators that are defined but never called on submit (`_formKey.currentState!.validate()` missing)
- [ ] "See All" or "View More" buttons that navigate to unimplemented screens
- [ ] Favorite/bookmark/save buttons that animate but don't write to Firestore
- [ ] Sort/filter controls that exist in the UI but don't modify the underlying query

**Trace pattern:** Element visible → user taps → handler fires → state changes → persistence write → UI reflects result

---

## Category: Feedback Micro-Elements

Hunt for moments where the app goes silent when it should communicate.

**Hunt for:**
- [ ] Success actions (save, submit, follow, book) with no confirmation to the user (no snackbar, no visual change)
- [ ] Error states that fail silently -- `catch` blocks with no user-facing message
- [ ] Async operations that complete but the UI doesn't reflect the new state (missing `setState` or provider invalidation)
- [ ] Dismissible elements (swipe-to-delete, dismiss notifications) with no visual confirmation
- [ ] Progress indicators that start but never stop (`_isLoading = true` without corresponding `false` in `finally`)
- [ ] Snackbars/toasts that are created but never shown (`ScaffoldMessenger` not in scope, or widget unmounted)
- [ ] Optimistic UI updates that succeed visually but silently fail on the backend (no rollback)
- [ ] Empty result sets that show nothing instead of "No results found" messaging

**Trace pattern:** User action → async operation → completion/failure → feedback shown → UI state consistent

---

## Category: System Integrations

Hunt for small system-level connections that are wired up but untested.

**Hunt for:**
- [ ] Permission requests (camera, photos, notifications) that don't handle denial gracefully
- [ ] Push notification tap handlers that don't route to the correct screen (or route to a screen without required data)
- [ ] Share sheet integrations that pass incorrect, empty, or poorly formatted data
- [ ] Clipboard copy actions that silently fail or copy the wrong value
- [ ] URL launcher calls (`launchUrl`) with no fallback when the URL can't be opened
- [ ] Platform channel calls with no error handling for unsupported platforms (web vs mobile)
- [ ] Background refresh or periodic fetch that triggers but produces no visible result
- [ ] Firebase Analytics events that are logged with missing or incorrect parameters

**Trace pattern:** System trigger → platform API call → result/error → app handles both paths → user informed if relevant

---

## Category: Data Micro-Elements

Hunt for small persistence operations that are assumed to work but may silently fail or drift.

**Hunt for:**
- [ ] `SharedPreferences` reads that assume a key exists (no fallback/default value)
- [ ] Boolean flags that are set but never cleared (e.g., `hasSeenOnboarding` persists after logout)
- [ ] Counters that increment but never reset or clamp (unbounded growth)
- [ ] Cached data that has no expiration or invalidation strategy (stale forever)
- [ ] Draft data saved to local storage but never cleaned up after successful submission
- [ ] Firestore document reads that assume fields exist without null checks in `fromMap()`
- [ ] Timestamps stored as different types across the codebase (`Timestamp` vs `int` vs `String`)
- [ ] User preferences that are written on one screen but not read on the screen that needs them

**Trace pattern:** Write operation → storage location → read operation → data matches → cleanup on invalidation

---

## Execution Protocol

1. **Declare** -- State the category and target scope:
   > "Running **Small Interactive Elements** micro-hardening on `lib/screens/profile/`"

2. **Inventory** -- List every element in scope that matches the category. Use Grep to find them systematically:
   ```bash
   # Example: find all onPressed handlers
   grep -rn "onPressed" lib/screens/profile/
   # Example: find all context.go/push/pop
   grep -rn "context\.\(go\|push\|pop\)" lib/screens/profile/
   ```

3. **Trace each element** through the 5-step formula:
   | Element | FIND | TRACE | VERIFY | HARDEN | CONFIRM |
   |---------|------|-------|--------|--------|---------|
   | Save button | file:42 | tap→write→snackbar | Chain breaks at write (no await) | Added await + error catch | `flutter analyze` clean |

4. **Fix** -- Apply fixes for broken chains. One file at a time.

5. **Verify** -- After each file:
   ```bash
   flutter analyze lib/path/to/modified_file.dart
   ```

6. **Report** -- After completing the pass:
   - Total elements inventoried
   - Elements verified intact (no fix needed)
   - Elements hardened (with file:line citations and which chain step was broken)
   - Elements deferred (with justification)

7. **Commit**:
   ```bash
   git commit -m "micro(<category>): <summary of what was hardened>"
   ```

---

## When to Use This Skill

| Situation | Use `micro` | Use `harden` instead |
|-----------|------------|---------------------|
| Verifying small interactive elements actually work end-to-end | Yes | No |
| Auditing navigation and deep link integrity | Yes | No |
| Sweeping for code-level type safety or dead code | No | Yes |
| Checking feedback loops (success/error/loading communication) | Yes | No |
| Enforcing design system tokens across the codebase | No | Yes |
| Verifying system integrations (permissions, share, clipboard) | Yes | No |
| Hunting performance issues (rebuilds, memory leaks) | No | Yes |
| Checking small persistence operations (flags, prefs, cache) | Yes | No |
