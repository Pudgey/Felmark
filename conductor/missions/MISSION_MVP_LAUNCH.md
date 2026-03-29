# Mission: Felmark MVP — Chrome Extension Shell + Web App Launch

**Created**: 2026-03-29
**Status**: Planning
**Milestone**: M1 — Chrome Extension MVP

---

## Goal

Ship a Chrome extension that opens Felmark's web dashboard (app.tryfelmark.com) so freelancers can manage client workspaces, write proposals, track time, and collaborate — all from their browser.

---

## Scope

### Deliverables — Chrome Extension Shell (~50 lines)
- [ ] Create `extension/manifest.json` (MV3, new tab override or popup)
- [ ] Create `extension/newtab.html` with iframe to `app.tryfelmark.com`
- [ ] Add Felmark icon set (16, 32, 48, 128px)
- [ ] Test: load unpacked in Chrome, verify dashboard renders
- [ ] Chrome Web Store developer account + listing draft

### Deliverables — Web App Production Readiness
- [ ] Supabase project setup (auth, database, storage)
- [ ] Auth flow: Google OAuth + email sign-up/sign-in
- [ ] Persist workspaces to Supabase (create, read, update, delete)
- [ ] Persist projects/blocks to Supabase (per-workspace)
- [ ] Persist comments/activity to Supabase
- [ ] Real user profile (replace hardcoded "A" avatar)
- [ ] Deploy to Vercel at `app.tryfelmark.com`
- [ ] Dark mode toggle (light / dark / system auto)
- [ ] Landing page at `tryfelmark.com` (hero, features, waitlist)

### Deliverables — Data Layer
- [ ] Supabase schema: `workspaces`, `projects`, `blocks`, `comments`, `activities`, `users`
- [ ] React Query / SWR hooks for all CRUD operations
- [ ] Optimistic updates for block editing (no save delay)
- [ ] Autosave with debounce (500ms) + visual "Saved" indicator
- [ ] Offline fallback: localStorage cache, sync on reconnect

### Deliverables — Polish Before Launch
- [ ] Remove all hardcoded sample data (workspaces, projects, revenue, comments)
- [ ] Empty states for first-time user (no workspaces, no projects)
- [ ] Onboarding flow for brand new user (welcome → create first workspace)
- [ ] Error boundary messages match brand voice
- [ ] Loading skeleton matches real layout
- [ ] Responsive: test at 1024px, 1280px, 1440px, 1920px
- [ ] Keyboard shortcuts overlay (⌘/)
- [ ] `<title>` and meta tags for SEO

### Out of Scope (M1)
- Stripe Connect / invoicing / payments
- Auto time tracking (domain detection requires extension content scripts — M2)
- Real-time collaboration (WebSocket/Supabase Realtime — M2)
- Mobile responsive (< 1024px — M2)
- Client portal (shared view for clients — M3)
- AI features (proposal generation, context engine — M3+)
- Browser extension content scripts (web clipper, domain detection — M2)
- Export (PDF, Markdown — M2)

---

## Constraints

- **Technical**: Next.js 16 + Supabase. No additional frameworks without approval. Chrome extension is MV3 only.
- **Design**: Must use existing Felmark design tokens (parchment, ember, ink, warm). No new colors without design review.
- **Performance**: Dashboard must load in < 2s on 4G. Lighthouse score > 90.
- **Auth**: Google OAuth is primary. Email/password as fallback. No social logins beyond Google for M1.
- **Data**: All user data in Supabase. No client-side-only state for critical data.

---

## Affected Files

### New Files
- `extension/manifest.json` — MV3 manifest
- `extension/newtab.html` — iframe shell
- `extension/icons/` — icon set
- `dashboard/src/lib/supabase.ts` — Supabase client
- `dashboard/src/lib/hooks/` — React Query hooks for CRUD
- `dashboard/src/app/auth/` — auth pages (sign-in, sign-up, callback)
- `dashboard/src/components/shared/AuthGuard.tsx` — protected route wrapper
- `dashboard/supabase/migrations/` — database schema
- `landing/` — landing page (separate Next.js app or route)

### Modified Files
- `dashboard/src/app/page.tsx` — replace useState with Supabase queries
- `dashboard/src/app/layout.tsx` — add Supabase provider, auth context
- `dashboard/src/components/sidebar/Sidebar.tsx` — real data instead of constants
- `dashboard/src/components/editor/Editor.tsx` — autosave to Supabase
- `dashboard/src/app/globals.css` — add dark mode variables
- `dashboard/.env.local` — Supabase keys

### Dependencies (read-only)
- `@supabase/supabase-js` — database client
- `@supabase/auth-helpers-nextjs` — auth integration
- `@tanstack/react-query` — server state management

---

## Standards to Follow

- [ ] No Scope Creep — STOP → PROPOSE → WAIT
- [ ] Conductor Brain — maintain THOUGHTS.md, HANDOFF.md, journal
- [ ] No packages added without explicit human approval
- [ ] All Supabase queries use Row Level Security (RLS)
- [ ] No secrets in client-side code (use environment variables)
- [ ] Error handling on every network request
- [ ] Accessibility: all interactive elements have aria-labels

---

## Notes

- The dashboard UI is 95% built (32+ components). This mission is about connecting it to real data and shipping it.
- The Chrome extension is intentionally thin — ~50 lines. All logic lives in the web app.
- Revenue/pipeline numbers in the sidebar and terminal welcome need to compute from real project data (partially done — amounts parse from project strings).
- The 16 prototypes in `Prototype/` serve as reference for future features but are NOT part of M1 scope.
- Estimated timeline: 2–3 weeks with AI-assisted development.

## Implementation Order

1. **Supabase setup + schema** (day 1)
2. **Auth flow** (day 2)
3. **Data hooks + workspace CRUD** (day 3-4)
4. **Block/project persistence + autosave** (day 5-6)
5. **Remove hardcoded data, wire real queries** (day 7-8)
6. **Dark mode** (day 9)
7. **Chrome extension shell** (day 10)
8. **Deploy to Vercel + landing page** (day 11-12)
9. **Polish, test, Chrome Web Store submission** (day 13-14)
