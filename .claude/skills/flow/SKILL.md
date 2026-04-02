Run an end-to-end user journey audit on: $ARGUMENTS

Follow `conductor/skills/flow/PROTOCOL.md`.

**Steps:**
1. Define the journey (e.g., "signup -> browse -> hire -> review")
2. Walk through every screen in order, reading the code
3. At each step, check:
   - Can the user get stuck? (dead end, no back button, no CTA)
   - Does state survive the transition? (form data, scroll position)
   - Are errors surfaced? (or silently swallowed)
   - Is feedback given? (loading, success, failure indicators)
   - Is the next step obvious? (clear CTA, logical navigation)
4. Map the journey as a flow diagram
5. List findings: dead ends, friction points, missing feedback, state loss
6. Prioritize: P0 (blocked), P1 (confusing), P2 (annoying), P3 (suboptimal)

**Rules:**
- One journey per pass
- Walk the actual code path, not the happy path assumption
- Test error branches (what if the API fails at step 3?)
- Test back-navigation at every step

If no journey is specified, ask the user which user flow to audit.
