import type { Block } from "@/lib/types";

// Import default data factories from the actual component files
// These are the source of truth for each block type's initial data
import { getDefaultTimeline, getDefaultFlow, getDefaultBrandBoard, getDefaultMoodBoard, getDefaultWireframe, getDefaultPullQuote } from "@/components/editor/blocks/VisualBlocks";
import { getDefaultHeroSpotlight, getDefaultKineticType, getDefaultNumberCascade, getDefaultStatReveal, getDefaultValueCounter } from "@/components/editor/blocks/AnimationBlocks";
import { getDefaultGraphData } from "@/components/editor/graphs/GraphBlock";

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
