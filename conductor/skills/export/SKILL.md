---
name: export
description: Port a prototype or concept screen into Felmark production code safely, without dragging prototype shortcuts into the real app.
---

# Export -- Prototype to Production Port

Use this when a screen or interaction already exists in `Prototype/` and needs to be rebuilt inside the real product. The goal is not a literal copy. The goal is to preserve the product idea while rebuilding it in the repo's actual architecture.

References:
- `AGENTS.md`
- `Prototype/`
- Target production area under `dashboard/src/` or `extension/`

---

## Step 0: Define Source and Destination

Identify:

1. The prototype file
2. The production destination
3. The exact user-facing behavior being exported

Examples:

- `Prototype/FreelancerPad.jsx` -> `dashboard/src/components/editor/`
- `Prototype/TheWireV2.jsx` -> `dashboard/src/components/wire/`

Do not export an entire prototype just because one interaction is useful.

---

## Step 1: Extract the Real Requirements

Before coding, separate the prototype into three buckets:

- Keep: product behavior worth shipping
- Adapt: visuals or state flow that need production structure
- Drop: mock data, throwaway helpers, hardcoded shortcuts, fake latency, and demo-only UI

If the prototype mixes several ideas together, split them into separate production concerns first.

---

## Step 2: Map Production Constraints

Read the destination area and answer:

1. Which route, component tree, and state shape own this work?
2. Which existing tokens, utilities, and patterns already solve part of it?
3. What persistence layer or API surface should this use in production?
4. What needs to remain local-only for now?

Useful scans:

```bash
rg -n "ComponentName|featureName" dashboard/src
rg --files dashboard/src/components dashboard/src/lib dashboard/src/app
```

---

## Step 3: Rebuild, Do Not Copy Blindly

When exporting:

- Recreate the UI in the production folder structure
- Replace prototype-only data with real types and props
- Remove dead styling or layout hacks that existed only to sell the concept
- Keep naming consistent with the live codebase

Avoid:

- Moving one huge prototype file into production unchanged
- Preserving fake data sources after real types exist
- Recreating one-off helpers that only serve the prototype

---

## Step 4: Match the Product, Not the Demo

Verify:

- The shipped version keeps the prototype's core interaction model
- The final component works with real data shape or a clearly defined stub boundary
- Desktop and mobile layouts both hold up
- Keyboard, focus, and empty states are not lost during the port

---

## Step 5: Verify

Run available verification for the touched surface:

```bash
npm run lint
npm run build
```

Then manually compare:

1. Prototype behavior
2. Production implementation
3. Known gaps still intentionally deferred

Document any deliberate omissions in the relevant mission or handoff doc.

---

## Done Criteria

- Prototype behavior is represented in production code
- No prototype-only mock logic leaked into the final implementation
- The production component fits the repo's architecture and naming
- Remaining gaps are explicit, not accidental
