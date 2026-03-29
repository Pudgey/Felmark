# Review — Systematic Code Review

Run a systematic code review on the specified target.

Follow `conductor/skills/review/SKILL.md`.

## Checklist

**Architecture**
- [ ] Changes follow established project patterns
- [ ] No layer violations (UI importing data layer directly, etc.)
- [ ] No unnecessary coupling between modules

**Correctness**
- [ ] Logic handles edge cases (null, empty, error, boundary)
- [ ] Async operations are properly awaited
- [ ] Error states are handled (not swallowed)
- [ ] No race conditions in shared state

**Memory & Resources**
- [ ] All controllers/subscriptions/timers are disposed
- [ ] No listeners or callbacks registered without cleanup
- [ ] No unbounded list growth or memory leaks

**Security**
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] User input is validated before use
- [ ] No SQL injection, XSS, or command injection vectors

**Performance**
- [ ] No unnecessary re-renders or re-computations
- [ ] Lists use lazy loading for large datasets
- [ ] Images are sized/cached appropriately

**Style**
- [ ] Follows project naming conventions
- [ ] No dead code or commented-out blocks
- [ ] Commit messages describe WHY, not just WHAT

If no target is specified, review all recently changed files.
