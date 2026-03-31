# Mission: Settings Page

**Status**: PLANNED — NOT STARTED
**Priority**: Medium
**Created**: 2026-03-31

---

## Overview

Full settings page with 10 themes (live preview), 9 sections, and all freelancer-relevant configuration fields. Prototype exists at `Prototype/Settings.jsx`.

## Prototype Reference

`Prototype/Settings.jsx` — Complete React prototype with:
- 10 themes (Ember, Midnight, Sage, Clay, Frost, Obsidian, Dune, Ink, Copper, Lavender)
- Each theme: 17 color tokens (parchment, 6 warm steps, 6 ink steps, accent, accent-light, accent-bg, ok, err, inf, warn)
- Live preview — switching themes updates every element in real-time
- 9 sections with full UI

## Sections

| Section | What it contains |
|---------|-----------------|
| **Appearance** | Theme grid (5x2), active palette display, font size (compact/default/large), density (compact/comfortable/spacious), sidebar position (left/right), editor toggles (draft line, animations, block chrome, slash commands) |
| **Profile** | Avatar, first/last name, email, website, bio |
| **Business** | Business name, EIN/Tax ID, currency, hourly rate, day rate, minimum project, rush multiplier |
| **Brand & Portal** | Portal headline, subtext, accent color picker, custom domain (CNAME) |
| **Notifications** | Delivery (email, push, digest), Events (proposals, payments, overdue, comments, wire) |
| **Integrations** | Stripe Connect, Google Calendar, Gmail, Zoom, Slack, Figma, Notion, Google Drive — connected/not connected states |
| **Plan & Billing** | Free/Pro plan cards, revenue summary (total processed, fees, net) |
| **Security** | Password, 2FA toggle, active sessions list, delete account (danger zone) |
| **Data & Export** | Export (projects, financial, clients, full backup), Import from (HoneyBook, Notion, CSV), retention toggles |

## Theme System

The 10 themes define a complete color system:
```
p:    parchment (background)
w50-w400:  warm scale (6 steps, light to dark)
i9-i3:    ink scale (6 steps, dark to light)
a:    accent color
al:   accent light
ab:   accent background (rgba)
ok:   success green
err:  error red
inf:  info blue
warn: warning yellow
```

**Implementation approach**: CSS custom properties set at `:root` level. Theme switching updates all `--` variables. Every component already uses `var(--warm-*)`, `var(--ink-*)`, `var(--ember)` — the theme system maps these to the selected theme's values.

## Implementation Plan

### Phase 1: Theme engine
- Create `lib/themes.ts` with all 10 theme definitions
- Create `ThemeProvider` context that sets CSS variables on `<html>`
- Wire to settings state (localStorage for persistence)
- Every existing CSS module already uses the right variables — themes work instantly

### Phase 2: Settings page component
- Create `components/settings/` folder with MANIFEST.md
- Split into sub-components: SettingsSidebar, AppearanceSection, ProfileSection, etc.
- CSS modules (not inline styles like the prototype)
- Route: rail icon → settings page (already have settings icon in Rail)

### Phase 3: Persistence
- Supabase user_settings table (when auth is wired)
- localStorage fallback for offline/pre-auth
- Theme persists across sessions

## Dependencies
- No new packages
- Supabase auth (for Phase 3 persistence — can defer)
- Rail already has settings icon

## Files to Create
```
components/settings/
├── MANIFEST.md
├── SettingsPage.tsx
├── SettingsPage.module.css
├── sections/
│   ├── AppearanceSection.tsx
│   ├── ProfileSection.tsx
│   ├── BusinessSection.tsx
│   ├── BrandSection.tsx
│   ├── NotificationsSection.tsx
│   ├── IntegrationsSection.tsx
│   ├── BillingSection.tsx
│   ├── SecuritySection.tsx
│   └── DataSection.tsx
└── components/
    ├── Toggle.tsx
    ├── Field.tsx
    ├── ThemeMini.tsx
    └── settings-shared.module.css

lib/themes.ts          — Theme definitions + ThemeProvider
```
