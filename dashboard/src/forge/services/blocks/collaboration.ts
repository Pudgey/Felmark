import type { Block } from "@/lib/types";
import { getDefaultCommentThread, getDefaultMention, getDefaultQuestion, getDefaultFeedback, getDefaultDecision, getDefaultPoll, getDefaultHandoff, getDefaultSignoff, getDefaultAnnotation } from "@/components/editor/blocks/CollabBlocks";

export const COLLABORATION_DEFAULTS: Record<string, () => Partial<Block>> = {
  "comment-thread": () => ({ commentThreadData: getDefaultCommentThread() }),
  mention: () => ({ mentionData: getDefaultMention() }),
  question: () => ({ questionData: getDefaultQuestion() }),
  feedback: () => ({ feedbackData: getDefaultFeedback() }),
  decision: () => ({ decisionData: getDefaultDecision() }),
  poll: () => ({ pollData: getDefaultPoll() }),
  handoff: () => ({ handoffData: getDefaultHandoff() }),
  signoff: () => ({ signoffData: getDefaultSignoff() }),
  annotation: () => ({ annotationData: getDefaultAnnotation() }),
};
