---
name: "empty"
description: "Run a Loading/Empty/Error State Audit on the specified target. Use when the user explicitly invokes $empty or asks for this workflow in Felmark."
---

# Empty — Loading/Empty/Error State Audit

Run a Loading/Empty/Error State Audit on the specified target.

Follow `conductor/skills/empty/PROTOCOL.md`.

For every data-driven widget in scope, check:

| State | What to Look For |
|-------|-----------------|
| **Loading** | Is there a skeleton/shimmer? Or just a blank space? |
| **Empty** | Is there a warm message + CTA? Or just "No data" / blank? |
| **Error** | Is there a retry button + explanation? Or silent failure? |

## Grading
- **A**: All three states handled with warm, branded UI
- **B**: States handled but generic messages
- **C**: Some states missing (usually error)
- **D**: Only loading handled, empty/error show blank
- **F**: No state handling — widget shows nothing or crashes

## Rules
- One screen or feature area per pass
- Grade each data-driven widget independently
- Flag hidden failures (e.g. returning nothing after empty checks)
- Propose warm copy for generic messages

If no target is specified, ask the user what screen or feature to audit.

