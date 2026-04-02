Load external engineering intelligence from top open source projects.

Follow `conductor/skills/super-brain/PROTOCOL.md`.

**Phases:**
1. **Stack fingerprint** — Read package.json, next.config, tsconfig. Know the exact stack, not generic.
2. **Reference mining** — Search GitHub for 1K+ star repos using same stack. Three tiers: competitors, same-stack-at-scale, quality exemplars.
3. **Gap analysis** — Decision table: what the best teams do vs what we do vs where the gap is vs how to fix it.
4. **Slop audit** — Scan codebase for AI slop: unnecessary abstractions, restating comments, verbose error handling, wrapper functions, over-engineering.
5. **Recommendations** — Fix Now / Fix Next / Monitor. Under 200 lines total output. Dense, actionable, no fluff.

**Anti-slop standard:**
- Three similar lines > premature abstraction
- If the function name explains it, no comment needed
- Flat > nested, delete > comment out
- The simplest solution that works IS the solution

**Context cost:** High. Best run at session start or before a major refactor. Not for quick tasks.
