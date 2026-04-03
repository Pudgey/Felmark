import type { Block } from "@/lib/types";
import { getDefaultDeadlineData } from "@/components/workstation/editor/blocks/deadline/DeadlineBlock";
import { getDefaultCanvasData } from "@/components/workstation/editor/blocks/canvas/CanvasBlock";
import { getDefaultAudioData } from "@/components/workstation/editor/blocks/audio/AudioBlock";

export const CONTENT_DEFAULTS: Record<string, () => Partial<Block>> = {
  table: () => ({ tableData: { rows: [["Column 1", "Column 2", "Column 3"], ["—", "—", "—"], ["—", "—", "—"]] } }),
  accordion: () => ({ accordionData: { items: [{ title: "Section 1", content: "Content here..." }, { title: "Section 2", content: "Content here..." }] } }),
  math: () => ({ mathData: { formula: "Total = Quantity × Rate", variables: [{ name: "Quantity", value: "1" }, { name: "Rate", value: "$0" }], result: "$0" } }),
  gallery: () => ({ galleryData: { images: [{ icon: "◆", caption: "Image 1", meta: "Click to upload" }, { icon: "◇", caption: "Image 2", meta: "Click to upload" }, { icon: "◎", caption: "Image 3", meta: "Click to upload" }] } }),
  swatches: () => ({ swatchesData: { colors: [{ name: "Primary", hex: "#b07d4f" }, { name: "Dark", hex: "#2c2a25" }, { name: "Light", hex: "#faf9f7" }, { name: "Accent", hex: "#5a9a3c" }] } }),
  bookmark: () => ({ bookmarkData: { url: "https://example.com", title: "Link Title", description: "A brief description.", source: "Website", favicon: "◇" } }),
  audio: () => ({ audioData: getDefaultAudioData() }),
  canvas: () => ({ canvasData: getDefaultCanvasData() }),
  deadline: () => ({ deadlineData: getDefaultDeadlineData() }),
  deliverable: () => ({
    deliverableData: {
      title: "New Deliverable", description: "Describe what needs to be delivered...",
      status: "todo", assignee: "You", assigneeAvatar: "A", assigneeColor: "#b07d4f",
      dueDate: "—", files: [], comments: [], approvals: [],
    },
  }),
};
