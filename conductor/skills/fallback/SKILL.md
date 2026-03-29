---
name: fallback
description: Scan a screen or feature for failure points and propose tier-classified fallback mechanics so nothing silently breaks.
---

# Fallback -- Resilience Audit & Hardening

Scan a target screen or feature for every failure point (network, auth, data, navigation) and propose fallback mechanics classified by trust level and severity. Based on the "No Dead Ends" philosophy -- a user should never hit a blank screen, frozen button, or silent failure.

References:
- `dev/conductor/standards/FALLBACK_HARDENING.md`

---

## How to Run

Target can be a screen, feature area, or the entire app:

```
/fallback activity          # Scan ActivityScreen
/fallback booking           # Scan full booking lifecycle
/fallback home              # Scan V4 homepage
/fallback all               # Full app scan (produces summary report)
```

---

## The Process

### 1. Inventory (Read-Only)

For the target, map every:
- **Data source** (provider, repository, service) and its failure modes
- **Write operation** (create, update, delete) and what happens on failure
- **Navigation path** (deep links, push routes) and what happens if target doesn't exist
- **External dependency** (Firebase Auth, Storage, FCM) and its failure modes

### 2. Classify

For each failure point, assign:
- **Trust level**: Critical / High / Medium / Low (see SOP Section 2.2)
- **Current behavior**: What happens RIGHT NOW when this fails
- **Proposed tier**: Tier 1 (retry) / 2 (cache) / 3 (degrade) / 4 (block) / 5 (queue+sync)
- **Priority**: P0 (fix now) / P1 (this sprint) / P2 (polish pass) / P3 (defer)

### 3. Run the Agent Gauntlet

Answer the 8 quick-check questions from the SOP for each screen. Score out of 8.

### 4. Propose (Do NOT implement)

Write findings using the `FB-NNN` format. Each finding includes:
- Trust level, current behavior, proposed fallback, files, specific code changes, safety check

### 5. Report

Save to `dev/conductor/Reports/FALLBACK_AUDIT_[target]_[date].md`

---

## Cardinal Rules (Non-Negotiable)

Every proposed fallback must obey ALL five:

1. **Never fake success** -- Failed writes must never appear to succeed
2. **Never show stale data as fresh** -- Cached data must be labeled
3. **Never silently swallow** -- Every catch needs AppLogger or user feedback or both
4. **Never bypass safety checks** -- Fallbacks don't skip auth, validation, or rules
5. **Never persist unverified state** -- Local saves marked "pending sync," not written to Firestore unconfirmed

---

## Five Fallback Tiers (Quick Reference)

| Tier | Name | When | User Sees |
|------|------|------|-----------|
| 1 | Retry | Transient network blip | Brief loading, then success or escalation |
| 2 | Cache | Offline / extended outage | Last-known data + "Offline" indicator |
| 3 | Degrade | Non-essential section fails | Screen works, broken section hidden or shows retry |
| 4 | Block | Critical operation hard-fails | Clear error + what to do + support link |
| 5 | Queue | Offline write (High trust) | Immediate UI response + background sync |

---

## Output

A findings report with:
- Score (X/8 per screen)
- Failure point inventory
- Tier-classified findings (FB-001+)
- Priority-ordered implementation list
- Safety check per finding (Cardinal Rule compliance)
