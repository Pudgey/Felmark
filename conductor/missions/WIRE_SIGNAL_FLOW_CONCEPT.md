# Wire Signal Creation Flow — Guided Onboarding

**Created**: 2026-03-30
**Type**: Concept / Pre-Mission
**Milestone**: M2

---

## Concept

Replace the static Wire onboarding with a 6-step guided flow that lets the freelancer configure exactly what intelligence they want. The flow takes them from "What do you want to track?" through source selection, frequency preferences, and a live AI analysis animation — then reveals personalized results.

---

## The 6 Steps

1. **Signal Type** — Choose: Opportunity Scanner, Market Pulse, Competitor Watch, Client Signals, Rate Intelligence, Tool & Trend Radar
2. **Your Niche** — Select from preset niches (Brand Identity, Web Design, etc.) + add custom
3. **Sources** — Toggle data sources (LinkedIn, Upwork, Dribbble, Twitter/X, Google Trends, Reddit, etc.) + set scan frequency (real-time/daily/weekly) and relevance threshold
4. **Review** — Confirm selections with edit links back to each step
5. **Analyzing** — AI orb animation with ripple rings, waveform visualization, step-by-step progress (scanning sources → analyzing demand → cross-referencing → scoring → generating)
6. **Results** — Signal cards revealed one by one with stats summary, CTAs to open in The Wire or create another signal

---

## Integration

The signal creation flow replaces the current Phase A/B onboarding in WirePage. When the user has never generated signals:
- Show the signal flow instead of the blurred preview
- On completion: save preferences to localStorage, trigger actual `/api/wire` call with the configured context, transition to normal Wire feed

The flow state (selected type, niches, sources, frequency) feeds into the Wire context builder, making the AI call more targeted than the generic "here's everything about your business."

---

## Prototype Reference

Full standalone prototype provided with inline styles. Contains: 6-step wizard, signal type grid, niche pill selector with custom input, source toggles with frequency/threshold preferences, review summary with edit links, AI analysis orb with ripple/ring animations and waveform, staggered result card reveals.
