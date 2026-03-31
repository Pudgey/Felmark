# Mission: Felmark Toolbox — Plugin Ecosystem

**Status**: PLANNED — FUTURE (Month 7–12)
**Priority**: Strategic
**Created**: 2026-03-31

---

## The Thesis

Felmark builds 77 core blocks. The community builds the next 7,000.

Obsidian has 1,800+ plugins. Every user's setup is unique. You can't replicate someone's vault in another tool because their vault has 15 plugins that don't exist anywhere else. The plugins ARE the moat.

For Felmark, the same logic applies but sharper. Freelancers work in wildly different niches. A wedding photographer's workflow is nothing like a SaaS consultant's. You can't build every niche-specific feature. But a plugin system lets the community build them:

- A **photographer** tool: shot list blocks, album delivery tracking, print pricing calculators
- A **developer** tool: GitHub milestone syncing, sprint scope blocks, currency rate converters
- A **copywriter** tool: SEO score blocks, keyword density checkers, content calendar views
- A **bookkeeper** tool: expense categorization, quarterly tax estimates, 1099 generation

You build the core. The community builds the niches.

---

## Architecture — Three Layers

### Layer 1: Blocks (80% of what developers will want)

A tool registers a new block type with a render function, serialization, and slash command metadata. The block appears in the slash palette alongside native blocks.

```typescript
felmark.blocks.register({
  id: "shot-list",
  name: "Shot List",
  icon: "📷",
  category: "photography",
  render: (props) => { /* React component */ },
  serialize: (state) => { /* JSON */ },
  deserialize: (data) => { /* state */ },
});
```

### Layer 2: Sidebar Panels

A tool can add a new tab to the right sidebar or a new panel to the left sidebar.

```typescript
felmark.panels.register({
  id: "seo-score",
  name: "SEO",
  position: "right",
  icon: "↗",
  render: (props) => { /* React component */ },
});
```

### Layer 3: Forge Commands

A tool can register new terminal commands that route through the Forge.

```typescript
felmark.commands.register({
  cmd: "/contacts",
  desc: "Search your contact list",
  handler: async (args, forge) => { /* logic */ },
});
```

---

## Security Sandbox — What Tools CANNOT Do

- Modify Forge core services
- Intercept payment flows
- Access other users' data
- Modify permission tiers
- Execute arbitrary server-side code
- Modify the editor core or shell

**What tools CAN do:**
- Read document content
- Render UI (blocks, panels)
- Call their own API endpoints
- Register blocks, panels, and commands
- Read business data through Forge (with permission tiers)

Expand the sandbox later when security implications are understood.

---

## The 10x Advantage Over Obsidian

Obsidian plugins can only read and write markdown files. Felmark tools have access to **business data** through the Forge:

- Client lists, project statuses, invoice amounts
- Time logs, pipeline stages, Wire signals
- Payment history, response times, project velocity

A tool can build a "Client Health Dashboard" that scores every client based on payment history, response time, and project velocity. Obsidian can't do that because Obsidian doesn't know what a client is.

The Forge is what makes the tool ecosystem smart. Without it, it's just another block editor with extensions. With it, every tool is a business intelligence instrument.

---

## Trust Model

Start with Obsidian's approach:
- Tools are open source on GitHub
- Users install manually and accept the risk
- Community review process (lightweight)
- No App Store or approval queue on day one

Later: curated marketplace with verified tools, if demand warrants it.

---

## Naming

| Concept | Name |
|---------|------|
| Plugin system | **Felmark Toolbox** |
| Individual plugin | **Tool** |
| SDK package | `@felmark/toolbox-sdk` |
| Registry | `toolbox.tryfelmark.com` |
| Install command | `/toolbox install shot-list` |

"Install a tool" > "install a plugin." Fits the Forge metaphor — the Forge is the engine, the Toolbox is where you keep your specialized instruments.

---

## Timeline

| Phase | When | What |
|-------|------|------|
| **Core product** | Months 1–3 | Ship editor, proposals, invoices, payments, client portal, 77 blocks, terminal |
| **Stabilize** | Months 4–6 | Fix bugs, listen to users, watch what they hack together with existing blocks. The hacks tell you what tools people will build. |
| **SDK beta** | Months 7–9 | Build the Toolbox SDK. Layer 1 (blocks only). Release beta to 10–20 developers. Let them find API gaps. The SDK will be wrong on the first try — every SDK is. Better to be wrong with 10 devs than 1,000. |
| **Public launch** | Months 10–12 | Open the registry. Layer 2 (panels) + Layer 3 (commands). Documentation. 3–5 example tools to prove patterns. Launch publicly. |
| **Ecosystem** | Year 2 | Stop building niche features. Community handles it. Focus on Forge, editor core, payments, AI layer. Tools become the product's immune system — adapt to every niche without touching a line of code. |

---

## Prerequisites (Build the Forge First)

The Toolbox depends on:
1. **Forge service layer** — the API surface that tools call. Must be stable.
2. **Block registry pattern** — the `core/blockRegistry.ts` from the editor refactor. Tools register blocks through the same system.
3. **Permission tiers** — Free/Pro/Team. Tools respect the same tiers.
4. **Supabase auth** — tools need to know who the user is.
5. **Stable type system** — `types.ts` Block interface must be settled before external devs depend on it.

**Do NOT build the Toolbox before the Forge is solid.** The Forge is the foundation. The Toolbox follows naturally.

---

## Example Tools (build these yourself to prove the SDK)

1. **Pomodoro Timer** — sidebar panel, tracks focus sessions per project
2. **Word Count Goals** — sidebar panel, daily/weekly word count targets
3. **Client Portal Customizer** — block type, lets clients configure their portal view
4. **Invoice Template Pack** — 5 pre-styled invoice block templates
5. **Markdown Import** — command, imports .md files as Felmark blocks

These 5 tools exercise all 3 layers and prove the SDK works before external developers touch it.

---

## Not In Scope (for this mission)

- Monetization of tools (marketplace fees, revenue sharing)
- Tool analytics (install counts, usage metrics)
- Tool versioning and update mechanisms
- Tool conflict resolution (two tools registering the same slash command)
- Server-side tool execution (all tools run client-side for now)

These are Year 2+ concerns. Ship the SDK first, learn from usage, then add infrastructure.
