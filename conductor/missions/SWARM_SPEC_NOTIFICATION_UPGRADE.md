# Swarm Spec — Notification Panel Upgrade

**Goal:** Upgrade the existing NotificationPanel from generic placeholder to prototype-quality freelancer intelligence feed.

**Lane:** Design + Feature

**Status:** AWAITING APPROVAL

---

## Current State

The NotificationPanel (`notifications/NotificationPanel.tsx`) has:
- 5 generic types: deadline, payment, comment, status, mention
- 3 filters: All, Unread, Mentions
- No action buttons
- No avatar support for person-based notifications
- No workspace tags
- No PRO badge
- Generic body text
- No footer

## Target State (from approved prototype)

### Task 1: Expand notification types
Expand `Notification` interface type union from 5 to 10:
- `payment` — "$" icon, green
- `comment` — person avatar, workspace color
- `view` — "◎" icon, blue (invoice/proposal tracking)
- `signed` — "✓" icon, green (proposal accepted)
- `overdue` — "!" icon, red (overdue invoice)
- `edit` — person avatar, gray (document edits)
- `deadline` — "⏱" icon, ember (approaching deadline)
- `proposal` — "↗" icon, ember (proposal sent)
- `wire` — "◆" icon, ember (competitive signals, PRO)
- `milestone` — "⬡" icon, green (deliverable approved)

Add fields to Notification interface:
- `action: string` — contextual action label
- `avatar?: string` — person initial (for person-based notifs)
- `avatarBg?: string` — avatar background color
- `pro?: boolean` — PRO badge flag

### Task 2: Upgrade filters
Replace `All | Unread | Mentions` with:
`All | Unread | Payments | Comments | Deadlines | Clients`

Filter logic:
- Payments → type === "payment"
- Comments → type === "comment" || type === "edit"
- Deadlines → type === "deadline" || type === "overdue"
- Clients → type === "signed" || type === "view"

### Task 3: Add contextual action buttons
Each notification gets a hover-visible action button on the right. Label comes from `action` field. Clicking triggers `onNotificationAction(notif)` callback.

### Task 4: Avatar vs icon rendering
If `avatar` is set, render a colored circle with the initial (person notification). Otherwise render the type icon with tinted background.

### Task 5: Upgrade body text density
Replace generic mock data in Editor.tsx with the 10 prototype-quality notifications that tell a real freelancer story.

### Task 6: Workspace tags + PRO badge
Show workspace as a small mono tag in the footer row. Show PRO badge on premium notifications.

### Task 7: Footer
Add "You're up to date" footer at the bottom of the panel.

### Task 8: CSS refinements
Match prototype spacing: 14px item padding, 24px horizontal, proper icon sizing at 32px, action button opacity animation.

---

## Files to Modify

| File | Changes |
|------|---------|
| `notifications/NotificationPanel.tsx` | New types, filters, avatar logic, action buttons, footer |
| `notifications/NotificationPanel.module.css` | Updated styles for actions, avatars, tags, footer |
| `editor/Editor.tsx` | Updated mock data (10 notifications), new `onNotificationAction` prop |

## Dependencies
- None — self-contained upgrade

## Risks
- Low risk. CSS-only changes + interface expansion. No new dependencies.
- The `Notification` interface is exported and used in Editor.tsx — both must update together.

---

**Awaiting human approval to execute.**
