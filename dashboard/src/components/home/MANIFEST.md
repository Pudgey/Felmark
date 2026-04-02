# DashboardHome -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## What
App-level home screen displayed on logo click. Shows project overview, deadlines, activity feed, pipeline, and earnings. This is NOT a workstation feature -- it's the top-level landing page.

## Exports
- `DashboardHome` -- Main dashboard view with project overview, deadlines, and workspace stats

## Dependencies
- `react` -- useState, useEffect, useRef
- `@/lib/types` -- Workstation, Project
- `@/lib/constants` -- STATUS
- `@/lib/due-dates` -- getDaysLeft, getDueLabel, getDueColor

## Imported By
- `views/home.tsx` -- rendered when home view is active

## Files
- `DashboardHome.tsx` -- main component (411 lines)
- `DashboardHome.module.css` -- styles (736 lines)

## Rules
- Pure presentation -- no routing logic, no state management beyond local UI state
- All data arrives via props from the view wrapper
