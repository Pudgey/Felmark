---
name: fallback
description: Resilience audit for Felmark. Map failure points and define what the user should see when network, auth, storage, or integrations fail.
---

# Fallback -- Resilience Audit & Hardening

Audit a screen, flow, or feature for failure handling. A user should never be left staring at a blank panel, dead button, or fake success state.

References:
- `AGENTS.md`
- Relevant code under `dashboard/src/`, `extension/`, and any server or integration surface involved

---

## Scope

Valid targets:

- A single screen
- A feature area
- An end-to-end flow
- The whole product, if the user explicitly wants a broad pass

---

## Step 1: Inventory Failure Points

For the target, map every:

- Data read
- Data write
- Route transition
- External dependency
- Local persistence boundary
- Browser API dependency

Examples:

- Supabase query fails
- Share link generation fails
- Save succeeds locally but not remotely
- Extension redirect fails
- Export/download is blocked by the browser

---

## Step 2: Classify Current Behavior

For each failure point, record:

- Current behavior
- User-visible impact
- Severity
- Whether recovery is obvious

If the product currently fails silently, call that out directly.

---

## Step 3: Choose a Fallback Tier

Use the lightest fallback that preserves trust:

| Tier | Pattern | Use When |
|------|---------|----------|
| 1 | Retry | Transient failure likely to resolve quickly |
| 2 | Cached or preserved state | Last-known-good content is safe to show with labeling |
| 3 | Degrade gracefully | One section can fail without breaking the whole screen |
| 4 | Block clearly | The action cannot proceed safely |
| 5 | Queue and reconcile | User work must be preserved and retried later |

---

## Step 4: Guard the Trust Boundary

Every fallback must obey these rules:

1. Never fake success
2. Never show stale data as fresh
3. Never swallow failures silently
4. Never bypass auth or validation
5. Never drop user work without saying so

---

## Step 5: Report or Implement

If the task is audit-only, report findings with:

- Failure point
- Current behavior
- Recommended fallback
- Files involved
- Priority

If the task is implementation, fix one failure mode at a time and re-verify the full chain.

---

## Done Criteria

- Failure modes are mapped explicitly
- Recommended fallbacks preserve user trust
- No stale stack-specific fallback assumptions remain
