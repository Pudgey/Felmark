import type { Block } from "@/lib/types";
import { getDefaultCommentThread } from "@/components/workstation/editor/blocks/comment-thread/CommentThreadBlock";
import { getDefaultMention } from "@/components/workstation/editor/blocks/mention/MentionBlock";
import { getDefaultQuestion } from "@/components/workstation/editor/blocks/question/QuestionBlock";
import { getDefaultFeedback } from "@/components/workstation/editor/blocks/feedback/FeedbackBlock";
import { getDefaultDecision } from "@/components/workstation/editor/blocks/decision/DecisionBlock";
import { getDefaultPoll } from "@/components/workstation/editor/blocks/poll/PollBlock";
import { getDefaultHandoff } from "@/components/workstation/editor/blocks/handoff/HandoffBlock";
import { getDefaultSignoff } from "@/components/workstation/editor/blocks/signoff/SignoffBlock";
import { getDefaultAnnotation } from "@/components/workstation/editor/blocks/annotation/AnnotationBlock";

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
