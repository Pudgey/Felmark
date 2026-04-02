# Empty — Loading/Empty/Error State Audit

Audit every data-driven widget for missing, broken, or low-quality loading, empty, and error states.

## What to Check

For every widget that displays data from an async source:

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
- Flag `SizedBox.shrink()` after empty checks (hidden failures)
- Flag half-implemented `.when()` branches
- Propose warm copy for generic messages
