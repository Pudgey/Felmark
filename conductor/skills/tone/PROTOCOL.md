---
name: tone
description: Microcopy and brand voice audit for Felmark. Keep copy clear, useful, and grounded in freelancer work.
---

# Tone -- Microcopy & Brand Voice Audit

Audit one screen or feature area for copy quality. Felmark is a freelancer operating system, not a generic note app and not a cute productivity toy. Copy should help users move work forward fast.

References:
- `AGENTS.md`
- Relevant UI under `dashboard/src/` or `extension/`

---

## Felmark Voice Guide

Felmark should sound:

- Direct
- Calm
- Useful
- Work-aware
- Slightly sharp when clarity matters

Felmark should not sound:

- Corporate
- Precious
- Overly cheerful
- Vague
- Like a generic note-taking product

---

## Principles

### 1. Put the work first

Copy should orient around client work, tasks, notes, deadlines, sharing, and follow-through.

### 2. Be concrete

Say what happened and what the user can do next.

### 3. Avoid fake warmth

Do not write copy that tries to charm instead of informing.

### 4. Keep product identity clear

This is a freelancer operating system. It can contain notes, but it is not "just a notepad."

---

## Good and Bad Patterns

| Category | Avoid | Prefer |
|----------|-------|--------|
| Empty state | "No notes yet" | "No workspace notes yet" |
| Save feedback | "Success!" | "Changes saved" |
| Error | "Something went wrong" | "Couldn't load this workspace" |
| CTA | "Get Started" | "Create workspace" |
| Share | "Invite people" | "Share workspace" |
| Deadline | "Reminder set" | "Deadline added" |
| Generic | "Your productivity hub" | "Client work, notes, and follow-through in one place" |

---

## Audit Process

1. Pick one target surface
2. Find all user-facing strings
3. Flag copy that is vague, generic, misleading, off-brand, or too cute
4. Rewrite only what improves clarity and product identity
5. Re-check for truncation or layout regressions

Useful scans:

```bash
rg -n "\"[^\"]+\"" dashboard/src extension
rg -n "placeholder|title=|aria-label|toast|error|empty" dashboard/src extension
```

---

## Red Flags

- Placeholder copy left in production UI
- "Submit", "OK", or "Continue" where a specific action is known
- Copy that calls Felmark a note app
- Empty states that do not suggest a next step
- Error text with no recovery action

---

## Output Format

For each issue:

- File and line
- Existing copy
- Replacement copy
- Why the change is better

---

## Done Criteria

- Copy is clearer and more product-specific
- No stale brand language from older projects remains
- Replacements improve meaning without bloating the UI
