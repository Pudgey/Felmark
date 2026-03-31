# @felmark/forge

The root service layer. Every feature in Felmark exists as a service before it exists as a UI. The dashboard, terminal, client portal, API, and AI all call the same forge functions. One source of truth.

## Architecture

```
@felmark/forge (src/forge/)
├── services/
│   ├── projects.ts      → list, get, create, update, archive, duplicate
│   ├── clients.ts       → list, get, create, update, merge
│   ├── invoices.ts      → list, create, send, markPaid, remind
│   ├── proposals.ts     → list, create, send, duplicate, accept
│   ├── time.ts          → log, summary, report, timer
│   ├── pipeline.ts      → stages, move, summary, forecast
│   ├── wire.ts          → signals, scan, dismiss, bookmark
│   ├── documents.ts     → get, addBlock, removeBlock, export
│   ├── templates.ts     → list, create, apply, share
│   ├── calendar.ts      → events, deadlines, availability
│   ├── share.ts         → create, update, revoke, track
│   └── auth.ts          → session, permissions, apiKeys
├── permissions/
│   ├── tiers.ts         → maps operations to Tier 1/2/3
│   └── authorize.ts     → checks user can do X
└── audit/
    └── log.ts           → records every action with who/when/what/where
```

## Who calls forge

| Interface | Path | Example |
|-----------|------|---------|
| Dashboard UI | React components → forge services | Click "Send Invoice" → `invoices.send()` |
| Terminal ($cat, commands) | Command parser → forge services | `/invoice send #047` → `invoices.send()` |
| Client Portal | Portal pages → forge services | Client clicks "Accept" → `proposals.accept()` |
| API Routes | `/api/*` → forge services | `POST /api/invoices` → `invoices.create()` |
| AI (Haiku) | AI suggestion → forge services | "Send reminder" → `invoices.remind()` |

## Permission tiers

### Tier 1 — Silent (no confirmation)
Read operations and low-stakes writes. 80% of usage.

- View any project, client, invoice, document
- Log time
- Add/edit blocks in a document
- Query the Wire
- Check rates, budgets, schedules
- Run calculations
- Create drafts (not send)

### Tier 2 — Confirm once (preview + y/n)
Medium-stakes writes that affect other people or create obligations.

- Send a proposal or invoice to a client
- Create and send a payment reminder
- Mark a project complete
- Share a document externally
- Accept a proposal (client portal)
- Move a deal to a new pipeline stage

**Rule:** if this ran by accident, you'd have to apologize to a client.

### Tier 3 — Full verification (type to confirm)
Destructive or high-stakes actions. Rare — maybe once a month.

- Delete a project, client, or workspace
- Cancel a signed contract
- Refund a payment
- Remove a team member
- Export all data
- Change Stripe/billing settings
- Revoke API keys

**Rule:** if this ran by accident, you'd lose data or money.

## Service function shape

Every forge function follows the same pattern:

```typescript
async function send(ctx: ForgeContext, params: SendParams): Promise<ForgeResult<Invoice>> {
  // 1. Authorize — check user can do this
  // 2. Validate — check params are valid
  // 3. Execute — do the thing
  // 4. Audit — log what happened
  // 5. Return — typed result or typed error
}
```

`ForgeContext` carries: user ID, session, permissions, interface source (dashboard/terminal/api/ai).

## AI + Forge

The AI reads through forge, suggests through the terminal/UI, and acts through forge.

- **Tier 1:** AI acts freely (log time, add blocks, look up data)
- **Tier 2:** AI drafts, human confirms (send invoice, send proposal)
- **Tier 3:** AI cannot initiate — only the human can start destructive actions

The AI never has its own path to the database. Every AI action has the same permission checks, audit trail, and tier confirmation as a human action.

## Audit trail

Every forge call logs:
- **Who** — user ID
- **When** — timestamp
- **What** — service + function + params
- **Where** — which interface (dashboard, terminal, portal, api, ai)
- **Result** — success/error + what changed

Used for: debugging, compliance, trust ("show me everything the AI did on my behalf").

## Why "forge"

The forge is where raw materials become finished products. You bring clients, ideas, and skills. The forge turns them into proposals, invoices, and deliverables. Every interface — the dashboard, the terminal, the AI — is just a different hammer hitting the same anvil.

## Implementation order

1. Define `ForgeContext` and `ForgeResult` types
2. Build `projects` and `clients` services (most referenced)
3. Build `invoices` and `proposals` (revenue path)
4. Wire dashboard to call forge instead of direct state
5. Wire terminal commands to forge
6. Add Supabase as the persistence layer behind forge
7. Add audit logging
8. Build permission tier checks
