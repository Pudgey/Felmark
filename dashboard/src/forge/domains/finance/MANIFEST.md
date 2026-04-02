# finance/

Finance domain for Forge.

This domain will become the only canonical home for revenue, invoice, outstanding-balance, payment, and payout state.

## Owns

- Invoice records and lifecycle state
- Collected revenue and outstanding revenue
- Payment status, payment attempts, and collection health
- Client-level finance summaries derived from canonical invoice/payment state
- Future Stripe identifiers and payment-provider metadata

## Planned Files

| File | Purpose |
|------|---------|
| `types.ts` | Canonical finance records and enums |
| `service.ts` | Finance mutations and orchestration |
| `selectors.ts` | Finance-derived summaries for read models |
| `integrations/stripe.ts` | Stripe mapping seam and provider-specific behavior |

## Rules

- Stripe hooks only land here.
- No surface computes canonical client revenue on its own.
- `Sidebar`, `Workspace`, and `Workstation` consume finance summaries through read models, not by importing finance UI.
- If a finance datum changes behavior across multiple surfaces, it belongs here first.
