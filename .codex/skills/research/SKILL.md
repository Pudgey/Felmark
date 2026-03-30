# Research — External Best Practices & Competitive Intelligence

On-demand research for when you need to know how other tools solve a problem, what the industry standard is, or what users expect. Not automatic — only when explicitly asked.

## When to Use

- "How do other tools handle X?"
- "What's the standard UX pattern for Y?"
- "Research competitors for Z feature"
- "What are best practices for W?"
- Before building a feature that exists in other products (scheduling, invoicing, auth flows)

## When NOT to Use

- Every task (that's what $brain is for)
- Bug fixes (read the error, fix the code)
- Internal refactors (your codebase is the source of truth)
- Styling decisions (your design system is already defined)

## Steps

1. **Clarify the question** — Restate what you're researching in one sentence
2. **Search** — Run 2-3 targeted web searches:
   - `"[feature] UX pattern [year]"` — for interaction design
   - `"[competitor] [feature] how it works"` — for competitive intel
   - `"[topic] best practices freelancer tools"` — for domain-specific patterns
3. **Read** — Fetch 2-3 top results. Skip listicles, prefer docs and case studies
4. **Synthesize** — Summarize in this format:
   - **What others do** — 3-5 bullet points, concrete patterns
   - **What's unique to Felmark** — how our architecture/users differ
   - **Recommendation** — one clear suggestion with reasoning
5. **Cite** — Link sources so the human can dig deeper

## Rules

- **Max 3 searches** — more means the question is too broad. Narrow it.
- **Max 5 minutes** — get the signal, move on.
- **Filter for recency** — prefer 2025-2026 sources.
- **Don't copy** — understand the pattern, adapt to Felmark's design language.
- **Bias toward action** — end with "here's what I'd build" not "here are 10 options."

## Output Format

```
## Research: [topic]

### What others do
- Tool A: [pattern]
- Tool B: [pattern]
- Common pattern: [pattern]

### Felmark context
- [How our architecture/users/brand differs]

### Recommendation
[One clear direction with reasoning]

### Sources
- [url] — [what you learned from it]
```
