# Services Catalog — Freelancer Service Menu + Invoice Builder

**Created**: 2026-03-29
**Type**: Mission
**Milestone**: M2 (Pro tier feature) — Rail icon wired now
**Prototype**: `Prototype/Services.jsx`

---

## Mission Statement

Give freelancers a **reusable service catalog** so they never type the same scope twice. Define services once with tiered pricing, then pull them into proposals and invoices in seconds. Over time, the catalog becomes a business intelligence layer — showing which services earn the most, which clients buy what, and where to raise prices.

This is the bridge between "I track my work in Felmark" and "I run my business in Felmark." HoneyBook has nothing like this — their invoices start from scratch every time.

---

## Why This Matters

1. **Freelancers re-type the same services constantly** — every proposal, every invoice, same 4-5 offerings described slightly differently each time
2. **No tool connects service definition → pricing → invoicing → analytics** in one flow
3. **HoneyBook gap**: No service catalog, no tiered pricing, no "which service earns me the most" analytics
4. **Competitive wedge**: Moxie and Bonsai have basic service lists but no tiers, no analytics, no earned-bar visualization
5. **Directly feeds M3 invoicing** — services become line items on Stripe Connect invoices

---

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ Services                          [Invoice (3)] [+ New Service]  │
├──────────────────────────────────────────────────────────────────┤
│ $98.3k        │ 46          │ $2,137       │ Brand Identity      │
│ total earned  │ times used  │ avg deal     │ top earner          │
├══════════════════════════════════════════════════════════════════┤
│ ████████████████████████████░░░░░░░░░░░░░  earned bar (by svc)  │
├──────────────────────────────────────────────────────────────────┤
│ [All] [Design] [Writing] [Consulting]        Sort: [Most earned] │
├──────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐     │
│ │ ◆ Brand Identity│ │ ◇ Website Design│ │ ✎ Content & Copy│     │
│ │ Design          │ │ Design          │ │ Writing          │     │
│ │                 │ │                 │ │                  │     │
│ │ Essential $2.4k │ │ Landing  $1.8k  │ │ Per page  $350   │     │
│ │ Complete  $4.8k │ │ Multi    $4.2k  │ │ Sequence  $1.2k  │     │
│ │ Premium   $8.5k │ │ Full     $7.5k  │ │ Full site $3.5k  │     │
│ │                 │ │                 │ │                  │     │
│ │ $28.6k │ 8x │ 4.9│ │ $21k │ 5x │ 4.8│ │ $18.4k│12x│ 5.0│     │
│ │ ████████████░░░ │ │ █████████░░░░░░ │ │ ███████░░░░░░░░ │     │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

---

## Detail Modal (Click a card)

```
┌──────────────────────────────────────────────────────┐
│ ◆ Brand Identity                              [✕]   │
│ Design                                               │
│ Full brand identity system including logo...         │
├──────────────────────────────────────────────────────┤
│ CHOOSE A TIER ─────────────────────────────────────  │
│ ┌──────────┐ ┌──────────────┐ ┌──────────┐          │
│ │ Essential│ │ ★ Complete   │ │ Premium  │          │
│ │ $2,400   │ │ $4,800       │ │ $8,500   │          │
│ │ ~24 hrs  │ │ ~48 hrs      │ │ ~80 hrs  │          │
│ │ ✓ Logo   │ │ ✓ Logo (4)   │ │ ✓ All +  │          │
│ │ ✓ Colors │ │ ✓ Colors     │ │ ✓ Workshop│          │
│ │ ✓ Type   │ │ ✓ Type scale │ │ ✓ Audit  │          │
│ │ ✓ PDF    │ │ ✓ Guidelines │ │ ✓ Voice  │          │
│ │          │ │ ✓ Social     │ │ ✓ Support│          │
│ │ [Select] │ │ [Add to Inv] │ │ [Select] │          │
│ └──────────┘ └──────────────┘ └──────────┘          │
│                                                      │
│ PERFORMANCE ─────────────────────────────────────    │
│ $28.6k      │ 8           │ $3,575       │ ★ 4.9   │
│ lifetime    │ invoiced    │ avg/invoice  │ rating  │
└──────────────────────────────────────────────────────┘
```

---

## UX Decisions (Agreed)

### 1. Kill the Invoice Drawer — Use Toast + Dedicated View

**Problem**: The invoice drawer (z-index 40) and detail modal (z-index 51) overlap. Clicking "Add to Invoice" from inside the modal adds the item but the user can't see it — the drawer hides behind the overlay.

**Solution**:
- Adding a service to the invoice shows a **toast notification** at the bottom: `"Brand Identity (Complete) added to invoice"` with an undo link. Toast auto-dismisses after 3 seconds.
- The header "Invoice (N)" button count **pulses briefly** on add for visual confirmation.
- Clicking "Invoice (N)" navigates to a **dedicated invoice builder view** (right panel or full view) — NOT a competing overlay.
- Invoice builder becomes its own first-class screen, not a drawer fighting for z-index.

### 2. Tier Click on Cards Opens Detail — Not Invoice

**Problem**: Clicking a tier on the grid card immediately adds to invoice. Users accidentally add items while just browsing.

**Solution**:
- Clicking a tier on the grid card opens the **detail modal with that tier pre-selected**.
- Only the explicit "Add to Invoice" button inside the detail modal triggers an add.
- Card tiers become preview/navigation, not action triggers.

### 3. Quantity Support

**Problem**: Invoice items hardcode `qty: 1`. Freelancers frequently bill multiples (3 pages of copy at $350/page, 2 strategy sessions).

**Solution**:
- Invoice builder items include a **qty stepper** (+/- buttons or editable number field).
- Line total = price x qty, shown per row.
- Unit label adapts: "$350/page x 3 = $1,050".

### 4. Empty States

| State | What to show |
|---|---|
| No services match filter | "No [category] services yet. Create one?" with CTA |
| Empty invoice | Don't show the invoice button at all (current behavior, keep it) |
| New user, no services | Onboarding prompt: "Define your first service to start building invoices faster" |

### 5. Keyboard Navigation

| Key | Action |
|---|---|
| Escape | Close detail modal, close invoice drawer, close toast |
| Tab | Cycle through tier cards in detail modal (focus trap) |
| Enter | Select focused tier / confirm action |
| Cmd+I | Toggle invoice panel from anywhere in Services view |

### 6. State Mutation Bug

`services.sort()` in the earned bar mutates state in place. Must use `[...services].sort()`. Fixed in prototype.

### 7. "New Service" Button

Currently does nothing (`showCreate` state exists but no form). Options:
- **Phase 1**: Simple modal form — name, emoji, color, category, description, add tiers
- **Phase 2**: AI-assisted: "Describe what you offer" → auto-generates tiers with market-rate pricing suggestions

### 8. CSS/Architecture Cleanup (For Production Build)

| Issue | Fix |
|---|---|
| Global `* { margin: 0; padding: 0 }` reset | Remove — app's own reset handles this |
| `height: 100vh` on `.svc` | Change to `height: 100%; flex: 1` (same fix as TerminalWelcome) |
| Inline `<style>` tag | Convert to `Services.module.css` |
| Plain JSX, no types | Convert to TypeScript with proper interfaces |
| Untyped state (`useState(null)`) | Add `useState<string \| null>(null)` etc. |

---

## Data Model

```typescript
interface ServiceTier {
  id: string;
  name: string;           // "Essential" | "Complete" | "Premium"
  price: number;
  unit: "flat" | "per page" | "per hour" | "per month" | "per word";
  hours: number;          // estimated hours
  popular?: boolean;      // highlight badge
  includes: string[];     // bullet list of deliverables
}

interface Service {
  id: string;
  name: string;
  emoji: string;
  color: string;
  desc: string;
  category: string;       // "Design" | "Writing" | "Consulting" | custom
  tiers: ServiceTier[];
  timesUsed: number;      // auto-incremented when added to invoice
  totalEarned: number;    // auto-summed from paid invoices
  avgRating: number;      // client feedback (future)
  lastUsed: string;       // date string
  createdAt: string;
}

interface InvoiceItem {
  id: string;
  serviceId: string;
  tierId: string;
  serviceName: string;
  tierName: string;
  price: number;
  unit: string;
  qty: number;
}
```

---

## Integration Points

| System | Connection |
|---|---|
| **Rail** | Star icon between Pipeline and separator (wired, `railActive === "services"`) |
| **Editor view routing** | `railActive === "services"` renders `<ServicesCatalog />` in editorCol |
| **Invoicing (M3)** | Services become pre-built line items on Stripe Connect invoices |
| **Proposals** | "Insert service" in block editor pulls from catalog with tier selector |
| **Time tracking (M2)** | Link tracked hours back to service tiers for profitability analysis |
| **Pipeline** | Deals reference services — "Nora wants Brand Identity Complete ($4,800)" |
| **Terminal Welcome** | "Top service this month" in revenue section |

---

## Phases

### Phase 1: Catalog + Detail Modal
- Service grid with cards
- Detail modal with tier selection
- Filter by category, sort by earned/used/name
- Stats bar + earned bar
- Toast confirmation on add
- CRUD for services (create, edit, delete)

### Phase 2: Invoice Builder
- Dedicated invoice view (not a drawer)
- Pull services as line items with qty stepper
- Client selector (from workspaces)
- Preview before send
- Connect to Stripe (M3 dependency)

### Phase 3: Intelligence Layer
- "Which service earns me the most per hour?"
- "Which tier do clients pick most often?"
- Price optimization suggestions ("Your Complete tier converts 3x more than Essential — consider raising Essential to nudge clients up")
- Seasonal trends ("You sell 2x more Brand Identity in Q1")

---

## Competitive Advantage

| Competitor | Their approach | Felmark advantage |
|---|---|---|
| HoneyBook | Invoices start from scratch every time | Reusable catalog, one-click add |
| Bonsai | Basic flat-rate service list | Tiered pricing, analytics, earned visualization |
| Moxie | Service packages exist but no analytics | Full earnings tracking per service |
| Dubsado | Package builder but clunky | Beautiful card UI, instant preview |
| Assembly | No services concept at all | First-class feature |

---

## Open Questions

1. Should services be workspace-scoped or global? (Leaning global — "Brand Identity" applies across clients)
2. Should the invoice builder live in Services view or be accessible from anywhere? (Leaning: accessible from anywhere via Cmd+I or header button, but primary home is Services)
3. Should we support custom units beyond the defaults? (e.g., "per sprint", "per deliverable")
4. Client-facing service menu? (Let clients browse your services and self-select tiers — future M3/M4 feature)
