import type { Block } from "@/lib/types";

// Import default data functions from visual block components
// These are lazy-loaded to avoid circular deps — the functions are simple data factories
export const VISUAL_DEFAULTS: Record<string, () => Partial<Block>> = {
  graph: () => ({
    graphData: { graphType: "bar", title: "Chart", data: [{ label: "A", value: 10 }, { label: "B", value: 20 }, { label: "C", value: 15 }] },
  }),
  timeline: () => ({
    timelineData: {
      title: "Project Timeline",
      phases: [
        { label: "Discovery", date: "Week 1", status: "done", items: ["Research", "Interviews"], color: "#5a9a3c" },
        { label: "Design", date: "Week 2-3", status: "current", items: ["Wireframes", "Mockups"], color: "#b07d4f" },
        { label: "Build", date: "Week 4-5", status: "upcoming", items: ["Development"], color: "#5b7fa4" },
        { label: "Launch", date: "Week 6", status: "upcoming", items: ["Deploy", "Handoff"], color: "#7c6b9e" },
      ],
    },
  }),
  flow: () => ({
    flowData: {
      title: "Process Flow",
      nodes: [
        { id: "1", label: "Start", sub: "Kickoff", desc: "Begin project", icon: "→", color: "#5a9a3c" },
        { id: "2", label: "Design", sub: "Creative", desc: "Visual concepts", icon: "◆", color: "#b07d4f" },
        { id: "3", label: "Build", sub: "Development", desc: "Implementation", icon: "⚙", color: "#5b7fa4" },
        { id: "4", label: "Ship", sub: "Delivery", desc: "Launch", icon: "★", color: "#7c6b9e" },
      ],
    },
  }),
  brandboard: () => ({
    brandBoardData: {
      title: "Brand Board", logoLetter: "M", logoName: "Brand", logoSub: "Identity",
      colors: [{ hex: "#2c2a25", name: "Ink", type: "primary" }, { hex: "#b07d4f", name: "Ember", type: "accent" }, { hex: "#faf9f7", name: "Parchment", type: "background" }],
      fonts: [{ family: "Cormorant Garamond", role: "Headings", weight: "600" }, { family: "Outfit", role: "Body", weight: "400" }],
      keywords: ["Warm", "Professional", "Minimal"],
    },
  }),
  moodboard: () => ({
    moodBoardData: {
      title: "Mood Board",
      cells: [
        { color: "#d5d1c8", icon: "◆", label: "Typography" },
        { color: "#b07d4f", icon: "●", label: "Color", lightText: true },
        { color: "#f0eee9", icon: "◎", label: "Texture" },
        { color: "#2c2a25", icon: "★", label: "Mood", lightText: true },
      ],
      keywords: ["Organic", "Warm", "Premium"],
    },
  }),
  wireframe: () => ({
    wireframeData: {
      title: "Page Wireframe", viewport: "Desktop",
      sections: [{ label: "Header", content: "Nav + Logo" }, { label: "Hero", content: "Main CTA" }, { label: "Content", content: "Body" }, { label: "Footer", content: "Links" }],
    },
  }),
  pullquote: () => ({
    pullQuoteData: { text: "Quote text here", author: "Author Name", role: "Role / Company", avatarLetter: "A", avatarColor: "#b07d4f", rating: 5 },
  }),
  "hero-spotlight": () => ({
    heroSpotlightData: { line1: "Your", line2: "Brand", line3: "Here", color: "#b07d4f" },
  }),
  "kinetic-type": () => ({
    kineticTypeData: { lines: ["Design", "Build", "Launch"], style: "stagger" },
  }),
  "number-cascade": () => ({
    numberCascadeData: { stats: [{ label: "Revenue", value: "$14.8k", suffix: "", color: "#5a9a3c" }, { label: "Projects", value: "12", suffix: "", color: "#b07d4f" }, { label: "Clients", value: "8", suffix: "", color: "#5b7fa4" }] },
  }),
};
