---
name: "export"
description: "Port a prototype to production code. Use when the user explicitly invokes $export or asks for this workflow in Felmark."
---

# Export — Port Prototype to Production

Port a prototype to production code.

Follow `conductor/skills/export/SKILL.md`.

## Steps
1. Read the prototype file completely
2. Identify design tokens, components, and patterns
3. Map prototype patterns to the project's component system
4. Port section by section, verifying after each
5. Remove prototype-specific hacks (inline styles, hardcoded data)
6. Wire up to real data sources and state management

If no target prototype is specified, ask which file to port.

