Plan a redesign before implementing it.

Follow `conductor/skills/redesign/PROTOCOL.md`.

**Use this when:**
1. A UI surface is being redesigned, not just patched
2. A prototype, screenshot, pasted component, or visual concept exists
3. The change affects hierarchy, ownership, navigation, shell chrome, or interaction model
4. The team needs a spec and phased plan before touching product code

**Default workflow:**
1. Scan the redesign prototype
2. Capture or recreate the prototype in `Prototype/` as a visual reference only
3. Scan current requirements, code boundaries, and affected surfaces
4. Ask deep clarifying questions until ownership, hierarchy, data truth, and states are explicit
5. Write a redesign spec in `conductor/`
6. Produce a comprehensive implementation plan and wait for approval before coding

**Rules:**
- Treat this as a redesign, not a refactor, when hierarchy, ownership, or interaction patterns change
- Do not implement production UI in `dashboard/src/` before the redesign spec and plan are approved
- Keep prototype code isolated from production code
- Separate real/current data from aspirational/demo content in the spec
- If the prototype and requirements conflict, surface the conflict instead of guessing
