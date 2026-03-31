import type { Block } from "@/lib/types";

export const COLLABORATION_DEFAULTS: Record<string, () => Partial<Block>> = {
  "comment-thread": () => ({
    commentThreadData: { messages: [], resolved: false },
  }),
  mention: () => ({
    mentionData: { person: "", message: "", notified: false },
  }),
  question: () => ({
    questionData: { question: "", assignee: "", answered: false, answer: "" },
  }),
  feedback: () => ({
    feedbackData: { description: "", reviewer: "", dueDate: null, status: "pending", comments: "" },
  }),
  decision: () => ({
    decisionData: { title: "", decision: "", alternatives: [], context: "", decidedBy: "", decidedAt: null },
  }),
  poll: () => ({
    pollData: { question: "Which option do you prefer?", options: [{ id: "1", label: "Option A", votes: 0 }, { id: "2", label: "Option B", votes: 0 }], closed: false, totalVotes: 0 },
  }),
  handoff: () => ({
    handoffData: { from: "You", to: "", notes: "", status: "pending", items: ["Final assets delivered", "Documentation complete"] },
  }),
  signoff: () => ({
    signoffData: {
      section: "", signer: "", signed: false, signedAt: null, locked: false,
      parties: [
        { name: "", role: "Freelancer", signed: false, signedAt: null },
        { name: "", role: "Client", signed: false, signedAt: null },
      ],
    },
  }),
  annotation: () => ({
    annotationData: { imageUrl: "", pins: [] },
  }),
};
