import type { Block } from "@/lib/types";

// Import default data factories from the actual component files
// These are the source of truth for each block type's initial data
import { getDefaultTimeline } from "@/components/workstation/editor/blocks/timeline/TimelineBlock";
import { getDefaultFlow } from "@/components/workstation/editor/blocks/flow/FlowBlock";
import { getDefaultBrandBoard } from "@/components/workstation/editor/blocks/brand-board/BrandBoardBlock";
import { getDefaultMoodBoard } from "@/components/workstation/editor/blocks/mood-board/MoodBoardBlock";
import { getDefaultWireframe } from "@/components/workstation/editor/blocks/wireframe/WireframeBlock";
import { getDefaultPullQuote } from "@/components/workstation/editor/blocks/pull-quote/PullQuoteBlock";
import { getDefaultHeroSpotlight } from "@/components/workstation/editor/blocks/hero-spotlight/HeroSpotlightBlock";
import { getDefaultKineticType } from "@/components/workstation/editor/blocks/kinetic-type/KineticTypeBlock";
import { getDefaultNumberCascade } from "@/components/workstation/editor/blocks/number-cascade/NumberCascadeBlock";
import { getDefaultStatReveal } from "@/components/workstation/editor/blocks/stat-reveal/StatRevealBlock";
import { getDefaultValueCounter } from "@/components/workstation/editor/blocks/value-counter/ValueCounterBlock";
import { getDefaultGraphData } from "@/components/workstation/editor/blocks/graphs/GraphBlock";

export const VISUAL_DEFAULTS: Record<string, () => Partial<Block>> = {
  graph: () => ({ graphData: getDefaultGraphData("bar") }),
  timeline: () => ({ timelineData: getDefaultTimeline() }),
  flow: () => ({ flowData: getDefaultFlow() }),
  brandboard: () => ({ brandBoardData: getDefaultBrandBoard() }),
  moodboard: () => ({ moodBoardData: getDefaultMoodBoard() }),
  wireframe: () => ({ wireframeData: getDefaultWireframe() }),
  pullquote: () => ({ pullQuoteData: getDefaultPullQuote() }),
  "hero-spotlight": () => ({ heroSpotlightData: getDefaultHeroSpotlight() }),
  "kinetic-type": () => ({ kineticTypeData: getDefaultKineticType() }),
  "number-cascade": () => ({ numberCascadeData: getDefaultNumberCascade() }),
  "stat-reveal": () => ({ statRevealData: getDefaultStatReveal() }),
  "value-counter": () => ({ valueCounterData: getDefaultValueCounter() }),
  beforeafter: () => ({ beforeAfterData: { beforeLabel: "Before", afterLabel: "After" } }),
};
