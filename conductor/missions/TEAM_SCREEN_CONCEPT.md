# Team Screen — Member & Client Management

**Created**: 2026-03-30
**Type**: Concept / Pre-Mission
**Milestone**: M3 (Team tier)

---

## Concept

A full-page team management screen for viewing and managing team members, clients, roles, permissions, and invitations. Two-panel layout: member list (left) with detail panel (right). Supports 4 roles: Owner, Editor, Viewer, Client.

---

## Features

### Roles & Permissions
- **Owner**: Full access (edit, delete, invite, billing, settings, export)
- **Editor**: Edit & delete docs, export — no billing/settings/invites
- **Viewer**: View & comment only
- **Client**: View shared docs, approve deliverables, pay invoices

### Member List (Left Panel)
- Tabs: Members, Clients, Permissions
- Avatar with online/offline status dot
- Role badge (color-coded), email, last active
- Pending invites section with revoke option

### Detail Panel (Right)
- Large avatar, name, email, role badge (clickable to change), join date
- Stats row: projects, docs edited, invoices sent, earned
- Capacity bar: hours this week / capacity with color-coded fill
- Assigned projects list
- Recent activity feed

### Permissions Matrix Tab
- Full grid: Permission × Role with checkmarks
- 11 permissions across 4 roles

### Invite Modal
- Email input, role picker (3 selectable cards), optional personal message
- Success state with confirmation

---

## Integration

- Rail: Team icon (people/group) wired to `onItemClick("team")`
- Renders in editor area when `railActive === "team"`

---

## Prototype Reference

Prototype provided as standalone JSX with inline styles. Contains: ROLES, MEMBERS (4), PENDING_INVITES, PERMISSIONS_MATRIX data, full TeamScreen component with member list, detail panel, permissions tab, invite modal.
