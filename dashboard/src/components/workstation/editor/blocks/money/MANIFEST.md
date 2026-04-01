# MoneyBlock -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `MoneyBlock` -- Meta-block routing to 6 financial sub-blocks
- `getDefaultMoneyData` / `MONEY_TYPE_OPTIONS` -- factories and config
- Sub-blocks: `RateCalc`, `PaySchedule`, `ExpenseTracker`, `MilestonePayment`, `TaxEstimate`, `PaymentButton`

## Dependencies
- `@/lib/types` -- MoneyBlockData, MoneyBlockType

## Imported By
- `Editor.tsx` -- rendered for money block type

## Files
- `MoneyBlock.tsx` -- meta-block router (80 lines)
- `MoneyBlock.module.css` -- shared money styles
- `RateCalc.tsx` -- hourly rate calculator (53 lines)
- `PaySchedule.tsx` -- payment schedule display (55 lines)
- `ExpenseTracker.tsx` -- expense tracker (69 lines)
- `MilestonePayment.tsx` -- milestone payment tracker (68 lines)
- `TaxEstimate.tsx` -- quarterly tax estimator (61 lines)
- `PaymentButton.tsx` -- payment action button (50 lines)
