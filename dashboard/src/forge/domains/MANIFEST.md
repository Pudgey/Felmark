# domains/

Canonical business-domain layer for Forge.

This folder is where Felmark stops thinking in terms of screens and starts thinking in terms of owned truth. A domain may serve many surfaces, but no surface owns the domain.

## Planned Domains

| Domain | Owns |
|--------|------|
| `workstations/` | Client/workstation identity, status, shell-level state |
| `projects/` | Project status, due dates, phase, pinned state, activity counts |
| `documents/` | Document and block truth |
| `finance/` | Revenue, invoices, payment state, Stripe references |

## Rules

- Domains own canonical records and mutation logic.
- Domains do not import UI components or surface folders.
- Domains expose selectors and services; surfaces consume read models built from them.
- Cross-domain composition belongs in `../read-models/`, not inside a domain unless it is truly canonical.

## Migration Note

Current mutation logic still lives in `../services/`. This folder is introduced first as the structure contract so later refactors have a stable target.
