# Development Brief — Single Source of Truth

> **Auto-maintained**: Every session that creates a mission, completes a milestone item, or adds a strategy doc must update this file.
>
> **Last updated**: YYYY-MM-DD

---

## How This Doc Works

Three tiers:
1. **Milestones** — sequenced by user need, gated
2. **Missions** — scoped work units linked to milestones
3. **Strategy & Ideas** — future thinking, not yet scoped into missions

**Rules:**
- New missions get added here when created (with milestone tag)
- Completed items get checked off and dated
- Strategy docs that become missions get moved from Tier 3 → Tier 2
- AI agents read this before `/mission` to avoid duplicate work

---

## Tier 1: Milestones

### M1: "It Works" — Alpha Ready
> **Gate**: Define what "working" means for your project.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|

### M2: "It's Usable" — Closed Beta
> **Gate**: Define what "usable by real users" means.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|

### M3: "It's Good" — Open Beta
> **Gate**: Define quality and retention targets.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|

### M4: "It's Ready" — Public Launch
> **Gate**: Define launch criteria.
> **Status**: Not started

| Item | Status | Notes |
|------|--------|-------|

---

## Tier 2: Missions

### Active
| Mission | Milestone | Status | Doc |
|---------|-----------|--------|-----|

### Planning
| Mission | Milestone | Doc |
|---------|-----------|-----|

### Completed
| Mission | Completed | Doc |
|---------|-----------|-----|

---

## Tier 3: Strategy & Ideas

| Doc | Summary | Potential Milestone |
|-----|---------|-------------------|

---

## Maintenance Protocol

| Trigger | Action |
|---------|--------|
| New mission created | Add to Tier 2 with milestone tag |
| Mission completed | Check off in Tier 1, update Tier 2 status |
| New strategy/idea doc written | Add to Tier 3 |
| Strategy doc promoted to mission | Move from Tier 3 → Tier 2 |
| Quarterly review | Prune stale Tier 3, reprioritize |
