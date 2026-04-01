# settings/ — MANIFEST

## Exports
- `SettingsPage` (default) — Full settings screen with 9 sections and live theme switching

## Dependencies
- `@/lib/themes` — THEMES, applyTheme, saveTheme, getActiveTheme, FelmarkTheme
- `react` — useState

## Imported By
- `components/editor/Editor.tsx` — renders when `railActive === "settings"`

## Files
- `SettingsPage.tsx` — Main component (9 sections: Appearance, Profile, Business, Brand & Portal, Notifications, Integrations, Plan & Billing, Security, Data & Export)
- `SettingsPage.module.css` — CSS module using project design tokens
- `MANIFEST.md` — This file
