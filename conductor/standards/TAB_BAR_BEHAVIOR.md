---
title: Tab Bar Behavior
version: 1.0
created: 2026-03-29
last_reviewed: 2026-03-29
next_review: 2026-06-29
---

# Tab Bar Behavior

## Principle

The right column (tools + avatar) is sacred space. Tabs never push it offscreen. The tab zone has a fixed budget: `100% - right_column_width`.

## Rules

### 1. Sacred Right Column
- The right column (tools + avatar) has a fixed, reserved width.
- Tab zone fills remaining horizontal space. Tabs never overflow into or displace the right column.

### 2. Tab Shrinking
- As tabs are added, all tabs shrink equally to share the available tab zone.
- Active tab may retain full width (showing full client name) while background tabs compress.

### 3. Minimum Width Floor
- Tabs stop shrinking at ~100px minimum width.
- Below that threshold, client names become unreadable and tabs lose their purpose.

### 4. Overflow
- Once tabs hit min-width, excess tabs collapse into an overflow indicator (e.g., "+3" pill or chevron) at the right edge of the tab zone.
- The active tab is always visible — it never gets overflowed.
- Overflow menu shows the full client name for each hidden tab.

### 5. Active vs. Background
- The overflow boundary creates a natural "active vs. background" separation that mirrors how freelancers think about their workload (3-4 active clients, rest in the background).
- This is a feature, not a limitation.

## Precedents
- Chrome: pinned tabs vs. regular tabs, tab shrinking with overflow chevron
- VS Code: tab shrinking with scroll + dropdown overflow
