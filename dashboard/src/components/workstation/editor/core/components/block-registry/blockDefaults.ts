import type { Block } from "@/lib/types";
import { getDefaultCommentThread } from "../../../blocks/comment-thread/CommentThreadBlock";
import { getDefaultMention } from "../../../blocks/mention/MentionBlock";
import { getDefaultQuestion } from "../../../blocks/question/QuestionBlock";
import { getDefaultFeedback } from "../../../blocks/feedback/FeedbackBlock";
import { getDefaultDecision } from "../../../blocks/decision/DecisionBlock";
import { getDefaultPoll } from "../../../blocks/poll/PollBlock";
import { getDefaultHandoff } from "../../../blocks/handoff/HandoffBlock";
import { getDefaultSignoff } from "../../../blocks/signoff/SignoffBlock";
import { getDefaultAnnotation } from "../../../blocks/annotation/AnnotationBlock";
import { getDefaultAiActionData } from "../../../blocks/ai-action/AiActionBlock";
import { getDefaultTimeline } from "../../../blocks/timeline/TimelineBlock";
import { getDefaultFlow } from "../../../blocks/flow/FlowBlock";
import { getDefaultBrandBoard } from "../../../blocks/brand-board/BrandBoardBlock";
import { getDefaultMoodBoard } from "../../../blocks/mood-board/MoodBoardBlock";
import { getDefaultWireframe } from "../../../blocks/wireframe/WireframeBlock";
import { getDefaultPullQuote } from "../../../blocks/pull-quote/PullQuoteBlock";
import { getDefaultHeroSpotlight } from "../../../blocks/hero-spotlight/HeroSpotlightBlock";
import { getDefaultKineticType } from "../../../blocks/kinetic-type/KineticTypeBlock";
import { getDefaultNumberCascade } from "../../../blocks/number-cascade/NumberCascadeBlock";
import { getDefaultStatReveal } from "../../../blocks/stat-reveal/StatRevealBlock";
import { getDefaultValueCounter } from "../../../blocks/value-counter/ValueCounterBlock";
import { getDefaultImageData } from "../../../blocks/image/ImageBlock";
import { getDefaultPricingConfigData } from "../../../blocks/unique/PricingConfigBlock";
import { getDefaultScopeBoundaryData } from "../../../blocks/unique/ScopeBoundaryBlock";
import { getDefaultAssetChecklistData } from "../../../blocks/unique/AssetChecklistBlock";
import { getDefaultDecisionPickerData } from "../../../blocks/unique/DecisionPickerBlock";
import { getDefaultAvailabilityPickerData } from "../../../blocks/unique/AvailabilityPickerBlock";
import { getDefaultProgressStreamData } from "../../../blocks/unique/ProgressStreamBlock";
import { getDefaultDependencyMapData } from "../../../blocks/unique/DependencyMapBlock";
import { getDefaultRevisionHeatmapData } from "../../../blocks/unique/RevisionHeatmapBlock";

/**
 * Default data for content block types inserted via slash menu.
 * Keyed by block type string.
 */
export const CONTENT_DEFAULTS: Record<string, Partial<Block>> = {
  table: {
    tableData: {
      rows: [
        ["Column 1", "Column 2", "Column 3"],
        ["\u2014", "\u2014", "\u2014"],
        ["\u2014", "\u2014", "\u2014"],
      ],
    },
  },
  accordion: {
    accordionData: {
      items: [
        { title: "Section 1", content: "Content here..." },
        { title: "Section 2", content: "Content here..." },
      ],
    },
  },
  math: {
    mathData: {
      formula: "Total = Quantity \u00d7 Rate",
      variables: [
        { name: "Quantity", value: "1" },
        { name: "Rate", value: "$0" },
      ],
      result: "$0",
    },
  },
  image: { imageData: getDefaultImageData() },
  gallery: {
    galleryData: {
      images: [
        { icon: "\u25c6", caption: "Image 1", meta: "Click to upload" },
        { icon: "\u25c7", caption: "Image 2", meta: "Click to upload" },
        { icon: "\u25ce", caption: "Image 3", meta: "Click to upload" },
      ],
    },
  },
  swatches: {
    swatchesData: {
      colors: [
        { name: "Primary", hex: "#b07d4f" },
        { name: "Dark", hex: "#2c2a25" },
        { name: "Light", hex: "#faf9f7" },
        { name: "Accent", hex: "#5a9a3c" },
      ],
    },
  },
  beforeafter: { beforeAfterData: { beforeLabel: "Before", afterLabel: "After" } },
  bookmark: {
    bookmarkData: {
      url: "https://example.com",
      title: "Link Title",
      description: "A brief description of the linked resource.",
      source: "Website",
      favicon: "\u25c7",
    },
  },
  "comment-thread": { commentThreadData: getDefaultCommentThread() },
  mention: { mentionData: getDefaultMention() },
  question: { questionData: getDefaultQuestion() },
  feedback: { feedbackData: getDefaultFeedback() },
  decision: { decisionData: getDefaultDecision() },
  poll: { pollData: getDefaultPoll() },
  handoff: { handoffData: getDefaultHandoff() },
  signoff: { signoffData: getDefaultSignoff() },
  annotation: { annotationData: getDefaultAnnotation() },
  "ai-action": { aiActionData: getDefaultAiActionData() },
  timeline: { timelineData: getDefaultTimeline() },
  flow: { flowData: getDefaultFlow() },
  brandboard: { brandBoardData: getDefaultBrandBoard() },
  moodboard: { moodBoardData: getDefaultMoodBoard() },
  wireframe: { wireframeData: getDefaultWireframe() },
  pullquote: { pullQuoteData: getDefaultPullQuote() },
  "hero-spotlight": { heroSpotlightData: getDefaultHeroSpotlight() },
  "kinetic-type": { kineticTypeData: getDefaultKineticType() },
  "number-cascade": { numberCascadeData: getDefaultNumberCascade() },
  "stat-reveal": { statRevealData: getDefaultStatReveal() },
  "value-counter": { valueCounterData: getDefaultValueCounter() },
  "pricing-config": { pricingConfigData: getDefaultPricingConfigData() },
  "scope-boundary": { scopeBoundaryData: getDefaultScopeBoundaryData() },
  "asset-checklist": { assetChecklistData: getDefaultAssetChecklistData() },
  "decision-picker": { decisionPickerData: getDefaultDecisionPickerData() },
  "availability-picker": { availabilityPickerData: getDefaultAvailabilityPickerData() },
  "progress-stream": { progressStreamData: getDefaultProgressStreamData() },
  "dependency-map": { dependencyMapData: getDefaultDependencyMapData() },
  "revision-heatmap": { revisionHeatmapData: getDefaultRevisionHeatmapData() },
};

export function getDefaultDataForType(type: string): Partial<Block> | undefined {
  return CONTENT_DEFAULTS[type];
}
