# blocks/ -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Structure

All block-type components live here, organized by category.

### shared/
- `useInView.ts` -- IntersectionObserver hook for scroll-triggered animations

### Individual block folders (pre-existing, moved from editor root)
- `ai/` -- AI assistant block
- `ai-action/` -- AI action block with configurable prompts
- `audio/` -- Audio player/recorder block
- `canvas/` -- Drawing canvas block
- `deadline/` -- Deadline/due-date block (renamed from deadline-block)
- `deliverable/` -- Project deliverable tracking block
- `drawing/` -- Drawing/sketch block
- `graphs/` -- Chart/graph block with data editor
- `money/` -- Financial/invoice block types
- `unique/` -- One-off specialized blocks (PricingConfig, ScopeBoundary, AssetChecklist, DecisionPicker, AvailabilityPicker, ProgressStream, DependencyMap, RevisionHeatmap)

### Animation blocks (unbundled from AnimationBlocks.tsx)
- `hero-spotlight/` -- Full-page hero with letter-by-letter reveal animation
- `kinetic-type/` -- Animated typography with configurable weights/sizes
- `number-cascade/` -- Grid of animated statistics
- `stat-reveal/` -- Animated stat cards with SVG ring progress
- `value-counter/` -- Dark-theme value counter with phased reveal

### Collaboration blocks (unbundled from CollabBlocks.tsx)
- `comment-thread/` -- Threaded comment discussion
- `mention/` -- @mention notification block
- `question/` -- Question/answer block with assignee
- `feedback/` -- Feedback request with status workflow
- `decision/` -- Decision record with alternatives
- `poll/` -- Voting poll with live results
- `handoff/` -- Project handoff checklist
- `signoff/` -- E-signature block with draw/type modes
- `annotation/` -- Image annotation with pin comments

### Content blocks (unbundled from ContentBlocks.tsx)
- `table/` -- Editable data table
- `accordion/` -- Collapsible accordion sections
- `math/` -- Formula display with variables
- `image/` -- Single-image block with caption and alt text
- `gallery/` -- Image gallery with lightbox
- `swatches/` -- Color swatch palette with contrast checker
- `before-after/` -- Before/after slider comparison
- `bookmark/` -- URL bookmark card

### Visual blocks (unbundled from VisualBlocks.tsx)
- `timeline/` -- Project timeline with phases and checklist items
- `flow/` -- Process flow diagram with clickable nodes
- `brand-board/` -- Brand identity board (logo, colors, typography, keywords)
- `mood-board/` -- Visual mood board grid
- `wireframe/` -- Page wireframe with labeled sections
- `pull-quote/` -- Testimonial/quote block with avatar and rating

## Dependencies
- `@/lib/types` -- block data interfaces
- `react` -- component framework

## Imported By
- `editor/core/components/block-registry/blockRegistry.ts` -- content block map
- `editor/core/components/block-renderer/BlockRenderer.tsx` -- graph, money, deliverable, deadline, audio, ai, canvas, drawing blocks
- `forge/services/blocks/*.ts` -- default data factories
