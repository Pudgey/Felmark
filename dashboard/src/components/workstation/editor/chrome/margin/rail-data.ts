import type { Block, Tab, Workstation } from "@/lib/types";
import type { Comment } from "@/components/comments/CommentPanel";
import type { BlockActivity } from "@/components/activity/ActivityMargin";

const MEMBER_NAMES: Record<string, string> = {
  u1: "You",
  u2: "Jamie",
  u3: "Sarah",
  u4: "Marcus",
};

const REVIEW_BLOCK_TYPES = new Set<Block["type"]>([
  "decision",
  "poll",
  "feedback",
  "signoff",
  "scope-boundary",
  "decision-picker",
  "revision-heatmap",
]);

const CONTEXT_BLOCK_TYPES = new Set<Block["type"]>([
  "asset-checklist",
  "handoff",
  "bookmark",
  "deadline",
  "deliverable",
]);

export const BLOCK_LABELS: Record<string, string> = {
  h1: "H1", h2: "H2", h3: "H3", paragraph: "¶", todo: "☐", callout: "◆",
  divider: "—", code: "<>", bullet: "•", numbered: "1.", quote: "❝", graph: "▥", deliverable: "☰", money: "$", table: "⊞", accordion: "▸", math: "∑", gallery: "▦", swatches: "●", beforeafter: "◐", bookmark: "↗", deadline: "⚑",
  audio: "♫", ai: "AI", canvas: "✎", drawing: "✐",
  "comment-thread": "💬", mention: "@", question: "?", feedback: "↺", decision: "⚖", poll: "▣", handoff: "→", signoff: "✍", annotation: "📌",
  "ai-action": "⚡",
  timeline: "⏱", flow: "◎", brandboard: "✦", moodboard: "◇", wireframe: "☐", pullquote: "❝",
  "hero-spotlight": "★", "kinetic-type": "Aa", "number-cascade": "#",
  "stat-reveal": "◎", "value-counter": "$",
  "pricing-config": "≋", "scope-boundary": "⊟", "asset-checklist": "☑",
  "decision-picker": "⇄", "availability-picker": "◇", "progress-stream": "→", "dependency-map": "⊞", "revision-heatmap": "▥",
};

export const BLOCK_LABEL_COLORS: Record<string, string> = {
  h1: "var(--ember)", h2: "var(--ink-500)", h3: "var(--ink-400)",
  paragraph: "var(--ink-300)", todo: "#5a9a3c", callout: "var(--ember)",
  divider: "var(--warm-300)", code: "#5b7fa4", bullet: "var(--ink-400)",
  numbered: "var(--ink-400)", quote: "var(--ink-400)", graph: "#5b7fa4", deliverable: "#5b7fa4", money: "#5a9a3c", table: "var(--ink-500)", accordion: "var(--ink-500)", math: "var(--ember)", gallery: "#5b7fa4", swatches: "var(--ember)", beforeafter: "var(--ink-500)", bookmark: "#5b7fa4", deadline: "#c24b38",
  audio: "#8a7e63", ai: "#7864b4", canvas: "#5b7fa4", drawing: "var(--ink-500)",
  "comment-thread": "var(--ember)", mention: "var(--ember)", question: "#b89a20", feedback: "#5b7fa4", decision: "#7c8594", poll: "var(--ember)", handoff: "#5a9a3c", signoff: "#5a9a3c", annotation: "#c24b38",
  "ai-action": "#7864b4",
  timeline: "#5b7fa4", flow: "#7c6b9e", brandboard: "var(--ember)", moodboard: "#8a7e63", wireframe: "#7c8594", pullquote: "var(--ember)",
  "hero-spotlight": "var(--ember)", "kinetic-type": "var(--ink-500)", "number-cascade": "var(--ember)",
  "stat-reveal": "#5a9a3c", "value-counter": "var(--ember)",
  "pricing-config": "var(--ember)", "scope-boundary": "#7c8594", "asset-checklist": "#5a9a3c",
  "decision-picker": "var(--ember)", "availability-picker": "#5b7fa4", "progress-stream": "var(--ink-500)", "dependency-map": "#7c8594", "revision-heatmap": "var(--ember)",
};

export interface RailDocItem {
  id: string;
  name: string;
  active: boolean;
  badge: "current" | "split" | "open";
  meta: string;
}

export interface RailReviewItem {
  id: string;
  type: string;
  title: string;
  meta: string;
  badge: string;
  tone: "info" | "warning" | "danger" | "success" | "ember";
}

export interface RailContextItem {
  id: string;
  type: string;
  title: string;
  meta: string;
}

export interface RailSignalItem {
  id: string;
  targetId?: string;
  title: string;
  meta: string;
  tone: "info" | "warning" | "ember" | "purple" | "teal";
}

function humanizeToken(value: string) {
  return value.replace(/-/g, " ");
}

function titleizeToken(value: string) {
  return humanizeToken(value).replace(/\b\w/g, char => char.toUpperCase());
}

function firstText(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() && value.trim() !== "[]") return value.trim();
  }
  return "";
}

function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getMemberName(id?: string) {
  return id ? (MEMBER_NAMES[id] || "Team") : "Team";
}

export function getBlockSummary(block: Block) {
  switch (block.type) {
    case "divider":
      return "divider";
    case "graph":
      return firstText(block.graphData?.title, block.graphData?.graphType ? `${humanizeToken(block.graphData.graphType)} chart` : "");
    case "deliverable":
      return firstText(block.deliverableData?.title, block.deliverableData?.description, "deliverable");
    case "money":
      return firstText(block.moneyData?.moneyType ? humanizeToken(block.moneyData.moneyType) : "", "money");
    case "table":
      return block.tableData?.rows?.length ? countLabel(Math.max(0, block.tableData.rows.length - 1), "row") : "table";
    case "accordion":
      return firstText(block.accordionData?.items?.[0]?.title, block.accordionData?.items?.length ? countLabel(block.accordionData.items.length, "section") : "", "accordion");
    case "math":
      return firstText(block.mathData?.formula, block.mathData?.result, "formula");
    case "gallery":
      return block.galleryData?.images?.length ? countLabel(block.galleryData.images.length, "image") : "gallery";
    case "swatches":
      return block.swatchesData?.colors?.length ? countLabel(block.swatchesData.colors.length, "color") : "swatches";
    case "beforeafter":
      return firstText(
        block.beforeAfterData?.beforeLabel && block.beforeAfterData?.afterLabel
          ? `${block.beforeAfterData.beforeLabel} → ${block.beforeAfterData.afterLabel}`
          : "",
        "before / after",
      );
    case "bookmark":
      return firstText(block.bookmarkData?.title, block.bookmarkData?.source, block.bookmarkData?.url, "bookmark");
    case "deadline":
      return firstText(block.deadlineData?.title, block.deadlineData?.assignee, "deadline");
    case "audio":
      return firstText(block.audioData?.transcript, block.audioData?.audioUrl ? "recorded audio" : "", "audio note");
    case "ai":
      return "AI generation";
    case "comment-thread":
      return firstText(block.commentThreadData?.messages?.[0]?.text, "comment thread");
    case "mention":
      return firstText(block.mentionData?.person ? `mention ${block.mentionData.person}` : "", block.mentionData?.message, "mention");
    case "question":
      return firstText(block.questionData?.question, block.questionData?.answer, "question");
    case "feedback":
      return firstText(block.feedbackData?.description, block.feedbackData?.reviewer ? `feedback from ${block.feedbackData.reviewer}` : "", "feedback");
    case "decision":
      return firstText(block.decisionData?.title, block.decisionData?.decision, "decision");
    case "poll":
      return firstText(block.pollData?.question, block.pollData?.options?.length ? countLabel(block.pollData.options.length, "option") : "", "poll");
    case "handoff":
      return firstText(block.handoffData?.notes, block.handoffData?.from && block.handoffData?.to ? `${block.handoffData.from} → ${block.handoffData.to}` : "", "handoff");
    case "signoff":
      return firstText(block.signoffData?.section, block.signoffData?.signer, "signoff");
    case "annotation":
      return firstText(block.annotationData?.pins?.[0]?.comment, block.annotationData?.pins?.length ? countLabel(block.annotationData.pins.length, "annotation") : "", "annotation");
    case "canvas":
      return firstText(
        block.canvasData?.elements?.find(element => typeof element.text === "string" && element.text.trim())?.text,
        block.canvasData?.elements?.length ? countLabel(block.canvasData.elements.length, "element") : "",
        "canvas",
      );
    case "drawing":
      return firstText(block.drawingData?.title, block.drawingData?.drawingType ? humanizeToken(block.drawingData.drawingType) : "", "drawing");
    case "ai-action":
      return firstText(block.aiActionData?.targetLabel, block.aiActionData?.output, block.aiActionData?.mode ? `${humanizeToken(block.aiActionData.mode)} action` : "", "AI action");
    case "timeline":
      return firstText(block.timelineData?.title, block.timelineData?.phases?.[0]?.label, "timeline");
    case "flow":
      return firstText(block.flowData?.title, block.flowData?.nodes?.[0]?.label, "flow");
    case "brandboard":
      return firstText(block.brandBoardData?.title, block.brandBoardData?.logoName, "brand board");
    case "moodboard":
      return firstText(block.moodBoardData?.title, block.moodBoardData?.keywords?.[0], "mood board");
    case "wireframe":
      return firstText(block.wireframeData?.title, block.wireframeData?.viewport, "wireframe");
    case "pullquote":
      return firstText(block.pullQuoteData?.text, block.pullQuoteData?.author, "pull quote");
    case "hero-spotlight":
      return firstText(block.heroSpotlightData?.name, block.heroSpotlightData?.preLine, "hero spotlight");
    case "kinetic-type":
      return firstText(block.kineticTypeData?.lines?.[0]?.text, "kinetic type");
    case "number-cascade":
      return firstText(block.numberCascadeData?.stats?.[0]?.label, "number cascade");
    case "stat-reveal":
      return firstText(block.statRevealData?.footer, block.statRevealData?.stats?.[0]?.label, "stat reveal");
    case "value-counter":
      return firstText(block.valueCounterData?.topLabel, block.valueCounterData?.bottomLine, "value counter");
    case "pricing-config":
      return block.pricingConfigData ? `${block.pricingConfigData.selected.length}/${block.pricingConfigData.options.length} selected` : "pricing config";
    case "scope-boundary":
      return firstText(block.scopeBoundaryData?.note, block.scopeBoundaryData ? `${countLabel(block.scopeBoundaryData.inScope.length, "scope item")}` : "", "scope boundary");
    case "asset-checklist":
      return block.assetChecklistData?.items?.length ? countLabel(block.assetChecklistData.items.length, "asset") : "asset checklist";
    case "decision-picker": {
      const picked = block.decisionPickerData?.options.find(option => option.id === block.decisionPickerData?.choice);
      return firstText(picked?.label, block.decisionPickerData?.options?.length ? countLabel(block.decisionPickerData.options.length, "option") : "", "decision picker");
    }
    case "availability-picker":
      return firstText(block.availabilityPickerData?.selected, block.availabilityPickerData?.days?.length ? countLabel(block.availabilityPickerData.days.length, "day") : "", "availability");
    case "progress-stream":
      return firstText(block.progressStreamData?.snapshots?.[0]?.label, block.progressStreamData?.snapshots?.length ? countLabel(block.progressStreamData.snapshots.length, "update") : "", "progress stream");
    case "dependency-map":
      return firstText(block.dependencyMapData?.nodes?.[0]?.label, block.dependencyMapData?.nodes?.length ? countLabel(block.dependencyMapData.nodes.length, "dependency") : "", "dependency map");
    case "revision-heatmap":
      return firstText(block.revisionHeatmapData?.sections?.[0]?.name, block.revisionHeatmapData?.sections?.length ? countLabel(block.revisionHeatmapData.sections.length, "section") : "", "revision heatmap");
    default:
      return firstText(block.content);
  }
}

export function formatBlockPreview(block: Block, max = 30) {
  const summary = getBlockSummary(block);
  if (!summary) return "";
  return summary.length > max ? `${summary.slice(0, max - 2)}…` : summary;
}

function getReviewTone(block: Block): RailReviewItem["tone"] {
  if (block.type === "scope-boundary") return "danger";
  if (block.type === "revision-heatmap") return "warning";
  if (block.type === "signoff") return "success";
  if (block.type === "decision" || block.type === "decision-picker") return "info";
  return "ember";
}

function getReviewBadge(block: Block) {
  switch (block.type) {
    case "scope-boundary":
      return "Urgent";
    case "revision-heatmap":
      return "Watch";
    case "signoff":
      return block.signoffData?.signed ? "Signed" : "Waiting";
    case "feedback":
      return block.feedbackData?.status === "approved" ? "Approved" : "Needs reply";
    case "poll":
      return block.pollData?.closed ? "Closed" : "Open";
    case "decision-picker":
      return block.decisionPickerData?.choice ? "Chosen" : "Open";
    case "decision":
      return block.decisionData?.decision ? "Made" : "Open";
    default:
      return "Review";
  }
}

function getReviewMeta(block: Block) {
  switch (block.type) {
    case "scope-boundary":
      return firstText(block.scopeBoundaryData?.note, "Scope changed and should be acknowledged before handoff.");
    case "revision-heatmap":
      return firstText(block.revisionHeatmapData?.sections?.[0]?.name, "Revision pressure is clustering in one section.");
    case "signoff":
      return firstText(block.signoffData?.section, block.signoffData?.signer ? `Awaiting ${block.signoffData.signer}` : "", "Ready for signoff.");
    case "feedback":
      return firstText(block.feedbackData?.description, block.feedbackData?.reviewer ? `Feedback from ${block.feedbackData.reviewer}` : "", "Review item");
    case "poll":
      return firstText(block.pollData?.question, block.pollData?.options?.length ? countLabel(block.pollData.options.length, "option") : "", "Poll");
    case "decision-picker":
      return firstText(block.decisionPickerData?.choice ? "A choice has been made." : "Still waiting on a pick.", getBlockSummary(block));
    case "decision":
      return firstText(block.decisionData?.decision, block.decisionData?.title, "Decision item");
    default:
      return getBlockSummary(block);
  }
}

function summarizeSignalTarget(blocks: Block[], blockId?: string) {
  if (!blockId) return "current document";
  const target = blocks.find(block => block.id === blockId);
  if (!target) return "current document";
  return formatBlockPreview(target, 28) || titleizeToken(target.type);
}

export function buildRailData(input: {
  blocks: Block[];
  workstations: Workstation[];
  tabs: Tab[];
  activeProject: string;
  comments: Comment[];
  activities: BlockActivity[];
  splitProject?: string | null;
}) {
  const { blocks, workstations, tabs, activeProject, comments, activities, splitProject } = input;
  const unresolvedComments = comments.filter(comment => !comment.resolved);
  const activeWorkstation = workstations.find(workstation => workstation.projects.some(project => project.id === activeProject)) || null;
  const activeTab = tabs.find(tab => tab.id === activeProject) || null;

  const openDocs: RailDocItem[] = tabs.map(tab => ({
    id: tab.id,
    name: tab.name,
    active: tab.id === activeProject,
    badge: tab.id === activeProject ? "current" : splitProject === tab.id ? "split" : "open",
    meta: tab.id === activeProject
      ? `${blocks.length} blocks · ${unresolvedComments.length} open comments`
      : `${tab.client} · open document`,
  }));

  const reviewItems: RailReviewItem[] = blocks
    .filter(block => REVIEW_BLOCK_TYPES.has(block.type))
    .slice(0, 4)
    .map(block => ({
      id: block.id,
      type: titleizeToken(block.type),
      title: formatBlockPreview(block, 36) || titleizeToken(block.type),
      meta: getReviewMeta(block),
      badge: getReviewBadge(block),
      tone: getReviewTone(block),
    }));

  const contextItems: RailContextItem[] = blocks
    .filter(block => CONTEXT_BLOCK_TYPES.has(block.type))
    .slice(0, 3)
    .map(block => ({
      id: block.id,
      type: titleizeToken(block.type),
      title: formatBlockPreview(block, 36) || titleizeToken(block.type),
      meta: getBlockSummary(block),
    }));

  const activitySignals: RailSignalItem[] = activities
    .filter(activity => activity.typing || activity.hot || activity.comment)
    .slice(0, 3)
    .map(activity => ({
      id: activity.blockId,
      targetId: activity.blockId,
      title: activity.typing
        ? `${getMemberName(activity.editedBy)} is active`
        : activity.comment
          ? `${getMemberName(activity.comment.user)} commented`
          : "Active revision",
      meta: activity.typing
        ? `${summarizeSignalTarget(blocks, activity.blockId)} is live right now.`
        : activity.comment
          ? firstText(activity.comment.text, `${summarizeSignalTarget(blocks, activity.blockId)} has a fresh comment.`)
          : `${summarizeSignalTarget(blocks, activity.blockId)} is getting repeated edits.`,
      tone: activity.comment ? "ember" : activity.typing ? "info" : "warning",
    }));

  const commentSignals: RailSignalItem[] = unresolvedComments.slice(0, 2).map(comment => ({
    id: comment.id,
    targetId: comment.blockId,
    title: `${comment.author} left feedback`,
    meta: firstText(comment.highlight ? `"${comment.highlight}"` : "", comment.text),
    tone: comment.author === "You" ? "teal" : "purple",
  }));

  const liveSignals = [...activitySignals, ...commentSignals].slice(0, 4);

  return {
    activeTab,
    activeWorkstation,
    openDocs,
    reviewItems,
    contextItems,
    liveSignals,
    stationStats: {
      docs: tabs.length,
      reviews: reviewItems.length,
      signals: liveSignals.length,
    },
  };
}
