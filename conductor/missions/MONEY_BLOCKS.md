# Money Blocks — Financial Blocks Inside Documents

**Created**: 2026-03-29
**Type**: Mission
**Milestone**: M3 (Invoicing + Stripe Connect) — prototyped now, wired when payments are live
**Prototype**: `Prototype/MoneyBlocks.jsx`

---

## Mission Statement

Let freelancers **handle money inside their documents**. Rate calculators, payment schedules, expense trackers, milestone invoicing, tax estimates, and Stripe checkout buttons — all as blocks in the editor. No switching to a separate invoicing app. The proposal IS the invoice. The project doc IS the billing system.

This is the M3 killer feature that turns Felmark from "a tool I take notes in" to "the thing that runs my business."

---

## Why This Matters

1. **Freelancers context-switch constantly between writing and billing** — finish a deliverable, switch to invoice app, re-type the same info. Money blocks eliminate that hop.
2. **Proposals with embedded pricing convert better** — the client sees the scope AND the cost in one flow, then clicks a payment button without leaving the doc.
3. **HoneyBook's biggest gap is time-to-invoice** — their tracked hours don't flow into invoices. Felmark's money blocks live where the work description lives.
4. **No competitor has inline financial blocks** — Notion has databases, but no rate calculators, payment schedules, or Stripe checkout embedded in documents.

---

## 6 Block Types

| # | Block | Slash Command | Purpose |
|---|---|---|---|
| 1 | **Rate Calculator** | `/rate` | Hours x Rate = Total with daily/weekly/per-deliverable breakdowns |
| 2 | **Payment Schedule** | `/schedule` | Visual timeline of deposit, milestone, and final payments with status tracking |
| 3 | **Expense Tracker** | `/expense` | Log project costs, calculate net profit and margin percentage |
| 4 | **Milestone Payments** | `/milestone` | Tie payments to deliverables — "Send Invoice" button appears when work is complete |
| 5 | **Tax Estimate** | `/tax` | Quarterly tax set-aside based on projected annual income |
| 6 | **Payment Button** | `/pay` | Stripe checkout embedded in the document — client clicks, pays, done |

---

## Layouts

### Rate Calculator
```
┌─────────────────────────────────────────────────────────┐
│ ⊗ Rate Calculator                              [Edit]   │
├─────────────────────────────────────────────────────────┤
│     hours        x        rate        =       total     │
│      32                   $95                 $3,040    │
│                                                         │
│  Daily (8h)    │   Weekly (40h)    │   Per deliverable  │
│  $760          │   $3,800          │   $608             │
└─────────────────────────────────────────────────────────┘
```

### Payment Schedule
```
┌─────────────────────────────────────────────────────────┐
│ ◆ Payment Schedule                      $4,800 total    │
├─────────────────────────────────────────────────────────┤
│ [████████████████████░░░░░░░░░░]  50% received          │
│       ●50%            ○25%           ○25%               │
│                                                         │
│ ✓ Deposit    On signing         $2,400  Mar 15  [Paid]  │
│ ○ Milestone  After deliv 1-3    $1,200  Apr 1   [Soon]  │
│ ○ Final      On delivery        $1,200  Apr 10  [Soon]  │
│                                                         │
│ Received: $2,400          Remaining: $2,400             │
└─────────────────────────────────────────────────────────┘
```

### Milestone Payments
```
┌─────────────────────────────────────────────────────────┐
│ ⚑ Milestone Payments                       $4,800      │
├─────────────────────────────────────────────────────────┤
│ [███████░░░░░░░░░░░░]                                   │
│                                                         │
│ 01 ✓ Logo usage rules      Mar 17  #045   $960  [Paid]  │
│ 02 ● Color palette         Mar 21         $960  [Send]  │
│ 03 ○ Typography scale                     $960          │
│ 04 ○ Social templates                     $960          │
│ 05 ○ Final delivery                       $960          │
│                                                         │
│ ● $960 received  ● $960 ready to invoice  ● $2,880 left│
└─────────────────────────────────────────────────────────┘
```

### Payment Button
```
┌─────────────────────────────────────────────────────────┐
│ $ Payment                                               │
├─────────────────────────────────────────────────────────┤
│ Brand Guidelines v2 — 50% Deposit                       │
│ Meridian Studio                                         │
│                                                         │
│ $2,400                                                  │
│                                                         │
│ Processing fee (2.9%)             -$70                  │
│ You receive                      $2,330                 │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │          💳 Pay $2,400 via Stripe                   │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ 🔒 Secured by Stripe · 256-bit encryption               │
└─────────────────────────────────────────────────────────┘
```

---

## Integration Points

| System | Connection |
|---|---|
| **Stripe Connect** | Payment button triggers real checkout. Milestone "Send Invoice" creates Stripe invoice. Payment schedule syncs with received payments. |
| **Time Tracking (M2)** | Rate calculator auto-fills hours from tracked time per project. |
| **Services Catalog** | Rate and tier pricing pull from service definitions. |
| **Workspace Projects** | Expense tracker links to project budget. Milestone payments link to project deliverables. |
| **Block Editor** | All 6 blocks are slash-command insertable, appear in outline, save with document. |
| **Proposals** | Payment schedule + payment button are the natural end of a proposal doc. |
| **Tax Hub** | Tax estimate block feeds from real earnings data across all projects. |

---

## Slash Command Checklist (per standard)

Each money block follows `conductor/standards/SLASH_COMMAND_CHECKLIST.md`:

| # | Touchpoint | Status |
|---|---|---|
| 1 | `types.ts` — BlockType union | Need to add `"money"` or individual types |
| 2 | `constants.ts` — BLOCK_TYPES | Add 6 entries with icons |
| 3 | `Editor.tsx` — renderBlock | Non-editable blocks, custom rendering per type |
| 4 | `Editor.tsx` — selectSlashItem | Sub-picker for 6 money block types |
| 5 | `EditableBlock.tsx` — PLACEHOLDERS | N/A (non-editable) |
| 6 | `EditableBlock.tsx` — STYLES | N/A |
| 7 | `EditorMargin.tsx` — BLOCK_LABELS | Add labels ($, ⊗, ⚑, etc.) |
| 8 | `EditorMargin.tsx` — BLOCK_LABEL_COLORS | Add colors per type |
| 9 | `EditorMargin.tsx` — preview | Show block title |
| 10 | `Editor.module.css` | N/A (own CSS module) |

---

## Architecture Decision: One Type or Six?

**Option A: Single `"money"` block type** with a `moneyType` field (like graph blocks with `graphType`)
- Pro: One slash command, one sub-picker, one Block interface extension
- Pro: Simpler type system
- Con: All money blocks share one icon in the outline

**Option B: Six separate block types** (`"rate-calc"`, `"pay-schedule"`, `"expense"`, `"milestone"`, `"tax"`, `"payment"`)
- Pro: Each gets its own icon/color in outline
- Pro: Can be independently searched/filtered
- Con: 6 additions to BlockType union

**Recommendation**: Option A (single `"money"` type with sub-picker), same pattern as graph blocks. Proven to work, less type sprawl. The sub-picker differentiates them at insertion time.

---

## Data Models

```typescript
type MoneyBlockType = "rate-calc" | "pay-schedule" | "expense" | "milestone" | "tax" | "payment";

interface MoneyBlockData {
  moneyType: MoneyBlockType;
  // Shape varies by moneyType — see below
  data: unknown;
}

// Rate Calculator
interface RateCalcData {
  hours: number;
  rate: number;
}

// Payment Schedule
interface PayScheduleData {
  total: number;
  items: { id: string; label: string; pct: number; amount: number; status: "paid" | "invoiced" | "upcoming" | "overdue"; date: string; trigger: string }[];
}

// Expense Tracker
interface ExpenseData {
  projectRevenue: number;
  expenses: { id: string; name: string; amount: number; category: string; date: string }[];
}

// Milestone Payments
interface MilestoneData {
  milestones: { id: string; deliverable: string; amount: number; status: "paid" | "invoiced" | "ready" | "pending"; completedDate: string | null; invoiceNum: string | null }[];
}

// Tax Estimate
interface TaxData {
  annualEarnings: number;
  taxRate: number;
  quarterlyPayments: [number, number, number, number];
}

// Payment Button
interface PaymentData {
  amount: number;
  label: string;
  client: string;
  stripePaymentId?: string; // links to real Stripe checkout
}
```

---

## Phases

### Phase 1: Static Blocks (Now)
- Prototype saved as design reference
- 6 components render with hardcoded/editable demo data
- No Stripe connection

### Phase 2: Editor Integration
- Add `"money"` to BlockType
- Slash menu sub-picker (same pattern as graph blocks)
- Data persists with document blocks
- Click-to-edit for rate calculator, expenses, milestones

### Phase 3: Stripe Connect (M3)
- Payment button triggers real Stripe Checkout session
- Milestone "Send Invoice" creates real Stripe invoice
- Payment schedule syncs with actual received payments
- Tax estimate pulls from real annual earnings

---

## Competitive Advantage

No freelancer tool embeds financial operations inside documents:
- **HoneyBook**: Invoices are a separate flow. Zero in-document billing.
- **Bonsai**: Has invoicing but it's a standalone page, not inline.
- **Notion**: Has formulas but no payment processing, no Stripe integration.
- **Felmark**: The proposal doc contains the payment button. The project doc contains the expense tracker. The billing system IS the document.
