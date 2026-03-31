# Blocks -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `ContentBlocks` -- TableBlock, AccordionBlock, MathBlock, GalleryBlock, SwatchesBlock, BeforeAfterBlock, BookmarkBlock
- `CollabBlocks` -- CommentThreadBlock, MentionBlock, QuestionBlock, FeedbackBlock, DecisionBlock, PollBlock, HandoffBlock, SignoffBlock, AnnotationBlock + default data factories
- `VisualBlocks` -- TimelineBlock, FlowBlock, BrandBoardBlock, MoodBoardBlock, WireframeBlock, PullQuoteBlock + default data factories
- `AnimationBlocks` -- HeroSpotlightBlock, KineticTypeBlock, NumberCascadeBlock, StatRevealBlock, ValueCounterBlock + default data factories

## Dependencies
- `@/lib/types` -- block data interfaces (TableBlockData, CommentThreadData, TimelineBlockData, HeroSpotlightData, etc.)

## Imported By
- `Editor.tsx` -- all block components rendered in contentBlockMap

## Files
- `ContentBlocks.tsx` -- content block components (187 lines)
- `ContentBlocks.module.css` -- content styles
- `CollabBlocks.tsx` -- collaboration block components (796 lines)
- `CollabBlocks.module.css` -- collab styles
- `VisualBlocks.tsx` -- visual block components (413 lines)
- `VisualBlocks.module.css` -- visual styles
- `AnimationBlocks.tsx` -- animation block components (572 lines)
- `AnimationBlocks.module.css` -- animation styles
