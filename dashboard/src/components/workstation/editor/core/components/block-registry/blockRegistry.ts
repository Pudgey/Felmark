import React from "react";
import type { Block } from "@/lib/types";
import TableBlock from "../../../blocks/table/TableBlock";
import AccordionBlock from "../../../blocks/accordion/AccordionBlock";
import MathBlock from "../../../blocks/math/MathBlock";
import ImageBlock from "../../../blocks/image/ImageBlock";
import GalleryBlock from "../../../blocks/gallery/GalleryBlock";
import SwatchesBlock from "../../../blocks/swatches/SwatchesBlock";
import BeforeAfterBlock from "../../../blocks/before-after/BeforeAfterBlock";
import BookmarkBlock from "../../../blocks/bookmark/BookmarkBlock";
import CommentThreadBlock from "../../../blocks/comment-thread/CommentThreadBlock";
import MentionBlock from "../../../blocks/mention/MentionBlock";
import QuestionBlock from "../../../blocks/question/QuestionBlock";
import FeedbackBlock from "../../../blocks/feedback/FeedbackBlock";
import DecisionBlock from "../../../blocks/decision/DecisionBlock";
import PollBlock from "../../../blocks/poll/PollBlock";
import HandoffBlock from "../../../blocks/handoff/HandoffBlock";
import SignoffBlock from "../../../blocks/signoff/SignoffBlock";
import AnnotationBlock from "../../../blocks/annotation/AnnotationBlock";
import AiActionBlock from "../../../blocks/ai-action/AiActionBlock";
import TimelineBlock from "../../../blocks/timeline/TimelineBlock";
import FlowBlock from "../../../blocks/flow/FlowBlock";
import BrandBoardBlock from "../../../blocks/brand-board/BrandBoardBlock";
import MoodBoardBlock from "../../../blocks/mood-board/MoodBoardBlock";
import WireframeBlock from "../../../blocks/wireframe/WireframeBlock";
import PullQuoteBlock from "../../../blocks/pull-quote/PullQuoteBlock";
import HeroSpotlightBlock from "../../../blocks/hero-spotlight/HeroSpotlightBlock";
import KineticTypeBlock from "../../../blocks/kinetic-type/KineticTypeBlock";
import NumberCascadeBlock from "../../../blocks/number-cascade/NumberCascadeBlock";
import StatRevealBlock from "../../../blocks/stat-reveal/StatRevealBlock";
import ValueCounterBlock from "../../../blocks/value-counter/ValueCounterBlock";
import PricingConfigBlock from "../../../blocks/unique/PricingConfigBlock";
import ScopeBoundaryBlock from "../../../blocks/unique/ScopeBoundaryBlock";
import AssetChecklistBlock from "../../../blocks/unique/AssetChecklistBlock";
import DecisionPickerBlock from "../../../blocks/unique/DecisionPickerBlock";
import AvailabilityPickerBlock from "../../../blocks/unique/AvailabilityPickerBlock";
import ProgressStreamBlock from "../../../blocks/unique/ProgressStreamBlock";
import DependencyMapBlock from "../../../blocks/unique/DependencyMapBlock";
import RevisionHeatmapBlock from "../../../blocks/unique/RevisionHeatmapBlock";
import DrawingBlock from "../../../blocks/drawing/DrawingBlock";

type BlockUpdateFn = (updater: Block[] | ((prev: Block[]) => Block[])) => void;

/**
 * Map from block type string to a render function.
 * Each render function receives the block and a setBlocks updater.
 */
export function getContentBlockMap(setBlocks: BlockUpdateFn): Record<string, (b: Block) => React.ReactNode> {
  return {
    table: (b) =>
      b.tableData
        ? React.createElement(TableBlock, {
            data: b.tableData,
            onChange: (d: Block["tableData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, tableData: d } : bl))),
          })
        : null,
    accordion: (b) =>
      b.accordionData
        ? React.createElement(AccordionBlock, {
            data: b.accordionData,
            onChange: (d: Block["accordionData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, accordionData: d } : bl))),
          })
        : null,
    math: (b) => (b.mathData ? React.createElement(MathBlock, { data: b.mathData }) : null),
    image: (b) =>
      b.imageData
        ? React.createElement(ImageBlock, {
            data: b.imageData,
            onChange: (d: Block["imageData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, imageData: d } : bl))),
          })
        : null,
    gallery: (b) => (b.galleryData ? React.createElement(GalleryBlock, { data: b.galleryData }) : null),
    swatches: (b) => (b.swatchesData ? React.createElement(SwatchesBlock, { data: b.swatchesData }) : null),
    beforeafter: (b) => (b.beforeAfterData ? React.createElement(BeforeAfterBlock, { data: b.beforeAfterData }) : null),
    bookmark: (b) => (b.bookmarkData ? React.createElement(BookmarkBlock, { data: b.bookmarkData }) : null),
    "comment-thread": (b) =>
      b.commentThreadData
        ? React.createElement(CommentThreadBlock, {
            data: b.commentThreadData,
            onChange: (d: Block["commentThreadData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, commentThreadData: d } : bl))),
          })
        : null,
    mention: (b) =>
      b.mentionData
        ? React.createElement(MentionBlock, {
            data: b.mentionData,
            onChange: (d: Block["mentionData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, mentionData: d } : bl))),
          })
        : null,
    question: (b) =>
      b.questionData
        ? React.createElement(QuestionBlock, {
            data: b.questionData,
            onChange: (d: Block["questionData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, questionData: d } : bl))),
          })
        : null,
    feedback: (b) =>
      b.feedbackData
        ? React.createElement(FeedbackBlock, {
            data: b.feedbackData,
            onChange: (d: Block["feedbackData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, feedbackData: d } : bl))),
          })
        : null,
    decision: (b) =>
      b.decisionData
        ? React.createElement(DecisionBlock, {
            data: b.decisionData,
            onChange: (d: Block["decisionData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, decisionData: d } : bl))),
          })
        : null,
    poll: (b) =>
      b.pollData
        ? React.createElement(PollBlock, {
            data: b.pollData,
            onChange: (d: Block["pollData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, pollData: d } : bl))),
          })
        : null,
    handoff: (b) =>
      b.handoffData
        ? React.createElement(HandoffBlock, {
            data: b.handoffData,
            onChange: (d: Block["handoffData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, handoffData: d } : bl))),
          })
        : null,
    signoff: (b) =>
      b.signoffData
        ? React.createElement(SignoffBlock, {
            data: b.signoffData,
            onChange: (d: Block["signoffData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, signoffData: d } : bl))),
          })
        : null,
    annotation: (b) =>
      b.annotationData
        ? React.createElement(AnnotationBlock, {
            data: b.annotationData,
            onChange: (d: Block["annotationData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, annotationData: d } : bl))),
          })
        : null,
    "ai-action": (b) =>
      b.aiActionData
        ? React.createElement(AiActionBlock, {
            data: b.aiActionData,
            onUpdate: (d: Block["aiActionData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, aiActionData: d } : bl))),
          })
        : null,
    timeline: (b) =>
      b.timelineData
        ? React.createElement(TimelineBlock, {
            data: b.timelineData,
            onChange: (d: Block["timelineData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, timelineData: d } : bl))),
          })
        : null,
    flow: (b) =>
      b.flowData
        ? React.createElement(FlowBlock, {
            data: b.flowData,
            onChange: (d: Block["flowData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, flowData: d } : bl))),
          })
        : null,
    brandboard: (b) =>
      b.brandBoardData
        ? React.createElement(BrandBoardBlock, {
            data: b.brandBoardData,
            onChange: (d: Block["brandBoardData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, brandBoardData: d } : bl))),
          })
        : null,
    moodboard: (b) =>
      b.moodBoardData
        ? React.createElement(MoodBoardBlock, {
            data: b.moodBoardData,
            onChange: (d: Block["moodBoardData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, moodBoardData: d } : bl))),
          })
        : null,
    wireframe: (b) =>
      b.wireframeData
        ? React.createElement(WireframeBlock, {
            data: b.wireframeData,
            onChange: (d: Block["wireframeData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, wireframeData: d } : bl))),
          })
        : null,
    pullquote: (b) =>
      b.pullQuoteData
        ? React.createElement(PullQuoteBlock, {
            data: b.pullQuoteData,
            onChange: (d: Block["pullQuoteData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, pullQuoteData: d } : bl))),
          })
        : null,
    "hero-spotlight": (b) =>
      b.heroSpotlightData
        ? React.createElement(HeroSpotlightBlock, {
            data: b.heroSpotlightData,
            onChange: (d: Block["heroSpotlightData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, heroSpotlightData: d } : bl))),
          })
        : null,
    "kinetic-type": (b) =>
      b.kineticTypeData
        ? React.createElement(KineticTypeBlock, {
            data: b.kineticTypeData,
            onChange: (d: Block["kineticTypeData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, kineticTypeData: d } : bl))),
          })
        : null,
    "number-cascade": (b) =>
      b.numberCascadeData
        ? React.createElement(NumberCascadeBlock, {
            data: b.numberCascadeData,
            onChange: (d: Block["numberCascadeData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, numberCascadeData: d } : bl))),
          })
        : null,
    "stat-reveal": (b) =>
      b.statRevealData
        ? React.createElement(StatRevealBlock, {
            data: b.statRevealData,
            onChange: (d: Block["statRevealData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, statRevealData: d } : bl))),
          })
        : null,
    "value-counter": (b) =>
      b.valueCounterData
        ? React.createElement(ValueCounterBlock, {
            data: b.valueCounterData,
            onChange: (d: Block["valueCounterData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, valueCounterData: d } : bl))),
          })
        : null,
    "pricing-config": (b) =>
      b.pricingConfigData
        ? React.createElement(PricingConfigBlock, {
            data: b.pricingConfigData,
            onUpdate: (d: Block["pricingConfigData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, pricingConfigData: d } : bl))),
          })
        : null,
    "scope-boundary": (b) =>
      b.scopeBoundaryData
        ? React.createElement(ScopeBoundaryBlock, {
            data: b.scopeBoundaryData,
            onUpdate: (d: Block["scopeBoundaryData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, scopeBoundaryData: d } : bl))),
          })
        : null,
    "asset-checklist": (b) =>
      b.assetChecklistData
        ? React.createElement(AssetChecklistBlock, {
            data: b.assetChecklistData,
            onUpdate: (d: Block["assetChecklistData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, assetChecklistData: d } : bl))),
          })
        : null,
    "decision-picker": (b) =>
      b.decisionPickerData
        ? React.createElement(DecisionPickerBlock, {
            data: b.decisionPickerData,
            onUpdate: (d: Block["decisionPickerData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, decisionPickerData: d } : bl))),
          })
        : null,
    "availability-picker": (b) =>
      b.availabilityPickerData
        ? React.createElement(AvailabilityPickerBlock, {
            data: b.availabilityPickerData,
            onUpdate: (d: Block["availabilityPickerData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, availabilityPickerData: d } : bl))),
          })
        : null,
    "progress-stream": (b) =>
      b.progressStreamData
        ? React.createElement(ProgressStreamBlock, {
            data: b.progressStreamData,
            onUpdate: (d: Block["progressStreamData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, progressStreamData: d } : bl))),
          })
        : null,
    "dependency-map": (b) =>
      b.dependencyMapData
        ? React.createElement(DependencyMapBlock, {
            data: b.dependencyMapData,
            onUpdate: (d: Block["dependencyMapData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, dependencyMapData: d } : bl))),
          })
        : null,
    "revision-heatmap": (b) =>
      b.revisionHeatmapData
        ? React.createElement(RevisionHeatmapBlock, {
            data: b.revisionHeatmapData,
            onUpdate: (d: Block["revisionHeatmapData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, revisionHeatmapData: d } : bl))),
          })
        : null,
    drawing: (b) =>
      b.drawingData
        ? React.createElement(DrawingBlock, {
            drawingData: b.drawingData,
            onUpdate: (d: Block["drawingData"]) =>
              setBlocks((prev) => prev.map((bl) => (bl.id === b.id ? { ...bl, drawingData: d } : bl))),
          })
        : null,
  };
}
