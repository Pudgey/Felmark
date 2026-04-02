Run deep root-cause analysis on: $ARGUMENTS

Follow `conductor/skills/deep-debug/SKILL.md`.

**When to use:**
- Intermittent, layered, device-specific, stateful, or timing-sensitive bugs
- Crashes, hangs, ANRs, jank, memory leaks, decoding failures
- Re-entrancy loops, race conditions, release-only bugs
- Cross-layer failures (API → model → state → render)
- Issues where basic debugging has stalled

**Steps:**
1. **Frame** — Write an issue brief (what, where, when, how often, what changed)
2. **Reproduce** — Build a reproduction matrix (debug/release, device, cache, timing)
3. **Classify** — Identify primary failure type (crash, hang, race, decode, loop, etc.)
4. **Observe** — Define minimum evidence needed (breakpoints, traces, payloads, memory)
5. **Hypothesize** — State hypothesis, predict evidence, collect, mark supported/disproven
6. **Isolate** — Narrow to smallest boundary where correct becomes incorrect
7. **Prove** — Root cause must have minimal repro, trace, or causal timeline
8. **Fix** — Smallest safe change addressing actual cause
9. **Validate** — Re-run original + adjacent flows + edge conditions
10. **Guard** — Add test, assertion, monitor, or benchmark

**Rules:**
- Do not guess — every conclusion tied to evidence
- Do not patch blindly — separate symptom from cause
- Change one variable at a time
- Prove the fix before declaring resolved
- Leave a durable safeguard behind
