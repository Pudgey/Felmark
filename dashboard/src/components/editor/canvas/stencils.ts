import type { CanvasElement } from "@/lib/types";

export interface StencilDef {
  id: string;
  name: string;
  category: string;
  elements: Omit<CanvasElement, "id">[];
}

export interface StencilCategory {
  id: string;
  name: string;
  icon: string;
}

export const STENCIL_CATEGORIES: StencilCategory[] = [
  { id: "wireframe", name: "Wireframe", icon: "▦" },
  { id: "flowchart", name: "Flowchart", icon: "◆" },
  { id: "sitemap", name: "Site Map", icon: "🗺" },
  { id: "devices", name: "Devices", icon: "📱" },
  { id: "stickies", name: "Stickies", icon: "▧" },
  { id: "journey", name: "Journey", icon: "⤳" },
  { id: "icons", name: "Icons", icon: "★" },
  { id: "orgchart", name: "Org Chart", icon: "⊞" },
];

const S = "#2c2a25";       // primary stroke
const TAN = "#b07d4f";
const CORAL = "#c24b38";
const GREEN = "#5a9a3c";
const BLUE = "#5b7fa4";
const PURPLE = "#7c6b9e";
const T = "transparent";

// Sticky note fills
const YELLOW_FILL = "#f5e6b8";
const PINK_FILL = "#f0c4c4";
const BLUE_FILL = "#c4daf0";
const GREEN_FILL = "#c4f0c4";

function r(x: number, y: number, w: number, h: number, extra?: Partial<Omit<CanvasElement, "id">>): Omit<CanvasElement, "id"> {
  return { type: "rect", x, y, w, h, strokeColor: S, fillColor: T, strokeWidth: 1.5, ...extra };
}

function c(x: number, y: number, w: number, h: number, extra?: Partial<Omit<CanvasElement, "id">>): Omit<CanvasElement, "id"> {
  return { type: "circle", x, y, w, h, strokeColor: S, fillColor: T, strokeWidth: 1.5, ...extra };
}

function dia(x: number, y: number, w: number, h: number, extra?: Partial<Omit<CanvasElement, "id">>): Omit<CanvasElement, "id"> {
  return { type: "diamond", x, y, w, h, strokeColor: S, fillColor: T, strokeWidth: 1.5, ...extra };
}

function ln(x1: number, y1: number, x2: number, y2: number, extra?: Partial<Omit<CanvasElement, "id">>): Omit<CanvasElement, "id"> {
  return { type: "line", x: x1, y: y1, w: x2 - x1, h: y2 - y1, strokeColor: S, fillColor: T, strokeWidth: 1.5, ...extra };
}

function arr(x1: number, y1: number, x2: number, y2: number, extra?: Partial<Omit<CanvasElement, "id">>): Omit<CanvasElement, "id"> {
  return { type: "arrow", x: x1, y: y1, w: x2 - x1, h: y2 - y1, strokeColor: S, fillColor: T, strokeWidth: 1.5, ...extra };
}

function txt(x: number, y: number, text: string, extra?: Partial<Omit<CanvasElement, "id">>): Omit<CanvasElement, "id"> {
  return { type: "text", x, y, strokeColor: S, fillColor: T, strokeWidth: 0, text, fontSize: 11, ...extra };
}

export const STENCILS: StencilDef[] = [
  // ── Wireframe ──
  {
    id: "button", name: "Button", category: "wireframe",
    elements: [
      r(0, 0, 90, 30, { strokeColor: TAN }),
      txt(22, 8, "Button", { strokeColor: TAN }),
    ],
  },
  {
    id: "input", name: "Input", category: "wireframe",
    elements: [
      r(0, 0, 140, 30),
      txt(8, 8, "Text input...", { strokeColor: "#8a7e63", fontSize: 10 }),
    ],
  },
  {
    id: "card", name: "Card", category: "wireframe",
    elements: [
      r(0, 0, 120, 90),
      ln(0, 24, 120, 24),
      ln(10, 40, 100, 40, { strokeWidth: 1 }),
      ln(10, 54, 80, 54, { strokeWidth: 1 }),
    ],
  },
  {
    id: "modal", name: "Modal", category: "wireframe",
    elements: [
      r(0, 0, 160, 120),
      r(0, 0, 160, 24, { fillColor: "#f0ece4" }),
      txt(8, 6, "Modal Title", { fontSize: 10 }),
      txt(146, 5, "✕", { fontSize: 10 }),
      ln(16, 50, 140, 50, { strokeWidth: 1 }),
      ln(16, 64, 120, 64, { strokeWidth: 1 }),
      r(62, 90, 42, 20, { strokeColor: TAN }),
      txt(68, 94, "OK", { strokeColor: TAN, fontSize: 9 }),
      r(110, 90, 42, 20),
      txt(113, 94, "Cancel", { fontSize: 9 }),
    ],
  },
  {
    id: "navbar", name: "Navbar", category: "wireframe",
    elements: [
      r(0, 0, 160, 28),
      r(4, 6, 24, 16, { fillColor: "#f0ece4" }),
      txt(34, 8, "Home", { fontSize: 9 }),
      txt(60, 8, "About", { fontSize: 9 }),
      txt(90, 8, "Work", { fontSize: 9 }),
      r(120, 5, 34, 18, { strokeColor: TAN, fillColor: TAN }),
      txt(125, 8, "CTA", { strokeColor: "#fff", fontSize: 9 }),
    ],
  },
  {
    id: "dropdown", name: "Dropdown", category: "wireframe",
    elements: [
      r(0, 0, 110, 26),
      txt(8, 7, "Select...", { fontSize: 10 }),
      txt(92, 6, "▾", { fontSize: 10 }),
      r(0, 28, 110, 60),
      txt(8, 34, "Option A", { fontSize: 10 }),
      txt(8, 50, "Option B", { fontSize: 10 }),
      txt(8, 66, "Option C", { fontSize: 10 }),
    ],
  },
  {
    id: "toggle", name: "Toggle", category: "wireframe",
    elements: [
      c(0, 0, 44, 22, { strokeColor: GREEN }),
      c(22, 2, 18, 18, { strokeColor: GREEN, fillColor: GREEN }),
    ],
  },
  {
    id: "checkbox", name: "Checkbox", category: "wireframe",
    elements: [
      r(0, 0, 18, 18),
      ln(4, 9, 8, 14, { strokeWidth: 2 }),
      ln(8, 14, 14, 4, { strokeWidth: 2 }),
    ],
  },

  // ── Flowchart ──
  {
    id: "process", name: "Process", category: "flowchart",
    elements: [
      r(0, 0, 100, 40),
      txt(22, 12, "Process", { fontSize: 12 }),
    ],
  },
  {
    id: "decision", name: "Decision", category: "flowchart",
    elements: [
      dia(0, 0, 100, 60),
      txt(24, 22, "Yes/No?", { fontSize: 11 }),
    ],
  },
  {
    id: "start-end", name: "Start / End", category: "flowchart",
    elements: [
      c(0, 0, 90, 36),
      txt(28, 10, "Start", { fontSize: 12 }),
    ],
  },
  {
    id: "connector", name: "Connector", category: "flowchart",
    elements: [
      arr(0, 20, 100, 20),
    ],
  },
  {
    id: "data-io", name: "Data I/O", category: "flowchart",
    elements: [
      // Parallelogram approximated with 4 lines
      ln(16, 40, 0, 0),
      ln(0, 0, 100, 0),
      ln(100, 0, 84, 40),
      ln(84, 40, 16, 40),
      txt(32, 14, "Data", { fontSize: 12 }),
    ],
  },
  {
    id: "subprocess", name: "Sub-process", category: "flowchart",
    elements: [
      r(0, 0, 110, 40),
      r(6, 0, 98, 40),
      txt(22, 12, "Sub-process", { fontSize: 11 }),
    ],
  },

  // ── Site Map ──
  {
    id: "page", name: "Page", category: "sitemap",
    elements: [
      r(0, 0, 80, 50),
      ln(8, 12, 32, 12, { strokeWidth: 1 }),
      ln(8, 20, 50, 20, { strokeWidth: 1 }),
      ln(8, 28, 40, 28, { strokeWidth: 1 }),
      txt(8, 36, "Page", { fontSize: 10 }),
    ],
  },
  {
    id: "homepage", name: "Homepage", category: "sitemap",
    elements: [
      r(0, 0, 100, 60),
      // house icon
      ln(20, 20, 32, 8, { strokeWidth: 1.5 }),
      ln(32, 8, 44, 20, { strokeWidth: 1.5 }),
      r(24, 20, 16, 14, { strokeWidth: 1 }),
      txt(28, 42, "Home", { fontSize: 11 }),
    ],
  },
  {
    id: "section-group", name: "Section", category: "sitemap",
    elements: [
      // Dashed border simulated with multiple short lines
      r(0, 0, 120, 70, { strokeWidth: 1 }),
      txt(8, 4, "Section", { fontSize: 9, strokeColor: "#8a7e63" }),
    ],
  },
  {
    id: "nav-link", name: "Nav Link", category: "sitemap",
    elements: [
      arr(0, 0, 0, 60, { strokeColor: BLUE }),
    ],
  },

  // ── Devices ──
  {
    id: "phone", name: "Phone", category: "devices",
    elements: [
      r(0, 0, 56, 110),
      ln(16, 6, 40, 6, { strokeWidth: 1 }),   // notch
      ln(22, 102, 34, 102, { strokeWidth: 2 }),// home bar
    ],
  },
  {
    id: "tablet", name: "Tablet", category: "devices",
    elements: [
      r(0, 0, 100, 130),
      c(46, 2, 8, 6, { strokeWidth: 1 }), // camera dot
    ],
  },
  {
    id: "laptop", name: "Laptop", category: "devices",
    elements: [
      r(10, 0, 120, 80),                 // screen
      // base trapezoid
      ln(0, 84, 10, 80),
      ln(0, 84, 140, 84),
      ln(140, 84, 130, 80),
    ],
  },
  {
    id: "desktop", name: "Desktop", category: "devices",
    elements: [
      r(0, 0, 140, 90),                 // monitor
      r(55, 92, 30, 20),                // stand neck
      r(40, 112, 60, 6),                // stand base
    ],
  },

  // ── Sticky Notes ──
  {
    id: "yellow-note", name: "Yellow Note", category: "stickies",
    elements: [
      r(0, 0, 90, 80, { fillColor: YELLOW_FILL, strokeColor: TAN }),
      ln(10, 20, 70, 20, { strokeWidth: 1, strokeColor: TAN }),
      ln(10, 34, 60, 34, { strokeWidth: 1, strokeColor: TAN }),
      ln(10, 48, 50, 48, { strokeWidth: 1, strokeColor: TAN }),
    ],
  },
  {
    id: "pink-note", name: "Pink Note", category: "stickies",
    elements: [
      r(0, 0, 90, 80, { fillColor: PINK_FILL, strokeColor: CORAL }),
      ln(10, 20, 70, 20, { strokeWidth: 1, strokeColor: CORAL }),
      ln(10, 34, 60, 34, { strokeWidth: 1, strokeColor: CORAL }),
      ln(10, 48, 50, 48, { strokeWidth: 1, strokeColor: CORAL }),
    ],
  },
  {
    id: "blue-note", name: "Blue Note", category: "stickies",
    elements: [
      r(0, 0, 90, 80, { fillColor: BLUE_FILL, strokeColor: BLUE }),
      ln(10, 20, 70, 20, { strokeWidth: 1, strokeColor: BLUE }),
      ln(10, 34, 60, 34, { strokeWidth: 1, strokeColor: BLUE }),
      ln(10, 48, 50, 48, { strokeWidth: 1, strokeColor: BLUE }),
    ],
  },
  {
    id: "green-note", name: "Green Note", category: "stickies",
    elements: [
      r(0, 0, 90, 80, { fillColor: GREEN_FILL, strokeColor: GREEN }),
      ln(10, 20, 70, 20, { strokeWidth: 1, strokeColor: GREEN }),
      ln(10, 34, 60, 34, { strokeWidth: 1, strokeColor: GREEN }),
      ln(10, 48, 50, 48, { strokeWidth: 1, strokeColor: GREEN }),
    ],
  },

  // ── Journey Map ──
  {
    id: "touchpoint", name: "Touchpoint", category: "journey",
    elements: [
      c(0, 0, 50, 50, { strokeColor: BLUE }),
      txt(10, 18, "Touch", { strokeColor: BLUE, fontSize: 11 }),
    ],
  },
  {
    id: "emotion-high", name: "Happy", category: "journey",
    elements: [
      c(0, 0, 40, 40, { strokeColor: GREEN }),
      // eyes
      c(11, 12, 4, 4, { strokeColor: GREEN, fillColor: GREEN }),
      c(25, 12, 4, 4, { strokeColor: GREEN, fillColor: GREEN }),
      // smile arc (line approximation)
      ln(12, 24, 20, 28, { strokeColor: GREEN, strokeWidth: 1.5 }),
      ln(20, 28, 28, 24, { strokeColor: GREEN, strokeWidth: 1.5 }),
    ],
  },
  {
    id: "emotion-low", name: "Sad", category: "journey",
    elements: [
      c(0, 0, 40, 40, { strokeColor: CORAL }),
      c(11, 12, 4, 4, { strokeColor: CORAL, fillColor: CORAL }),
      c(25, 12, 4, 4, { strokeColor: CORAL, fillColor: CORAL }),
      // frown
      ln(12, 28, 20, 24, { strokeColor: CORAL, strokeWidth: 1.5 }),
      ln(20, 24, 28, 28, { strokeColor: CORAL, strokeWidth: 1.5 }),
    ],
  },
  {
    id: "channel", name: "Channel", category: "journey",
    elements: [
      r(0, 0, 90, 34, { strokeColor: PURPLE }),
      txt(16, 10, "Channel", { strokeColor: PURPLE, fontSize: 11 }),
    ],
  },
  {
    id: "phase-divider", name: "Phase Divider", category: "journey",
    elements: [
      ln(30, 0, 30, 100, { strokeWidth: 1, strokeColor: "#8a7e63" }),
      txt(0, 104, "Phase", { strokeColor: "#8a7e63", fontSize: 9 }),
    ],
  },

  // ── Icons ──
  {
    id: "user", name: "User", category: "icons",
    elements: [
      c(8, 0, 16, 16, { strokeWidth: 1.5 }),
      // body arc
      ln(0, 32, 8, 22, { strokeWidth: 1.5 }),
      ln(8, 22, 24, 22, { strokeWidth: 1.5 }),
      ln(24, 22, 32, 32, { strokeWidth: 1.5 }),
    ],
  },
  {
    id: "mail", name: "Mail", category: "icons",
    elements: [
      r(0, 4, 36, 24),
      ln(0, 4, 18, 18, { strokeWidth: 1.5 }),
      ln(18, 18, 36, 4, { strokeWidth: 1.5 }),
    ],
  },
  {
    id: "search", name: "Search", category: "icons",
    elements: [
      c(0, 0, 22, 22, { strokeWidth: 1.5 }),
      ln(20, 20, 30, 30, { strokeWidth: 2.5 }),
    ],
  },
  {
    id: "settings", name: "Settings", category: "icons",
    elements: [
      c(4, 4, 24, 24, { strokeWidth: 1.5 }),
      ln(16, 0, 16, 6, { strokeWidth: 2 }),
      ln(16, 26, 16, 32, { strokeWidth: 2 }),
      ln(0, 16, 6, 16, { strokeWidth: 2 }),
      ln(26, 16, 32, 16, { strokeWidth: 2 }),
    ],
  },
  {
    id: "notification", name: "Bell", category: "icons",
    elements: [
      // bell body
      r(4, 6, 24, 20, { strokeWidth: 1.5 }),
      c(4, 0, 24, 14, { strokeWidth: 1.5 }),
      ln(0, 26, 32, 26, { strokeWidth: 1.5 }),
      // clapper
      c(12, 28, 8, 6, { fillColor: S }),
    ],
  },
  {
    id: "heart", name: "Heart", category: "icons",
    elements: [
      // two arcs forming a heart shape
      c(0, 0, 16, 14, { strokeColor: CORAL, strokeWidth: 1.5 }),
      c(14, 0, 16, 14, { strokeColor: CORAL, strokeWidth: 1.5 }),
      ln(0, 10, 15, 26, { strokeColor: CORAL, strokeWidth: 1.5 }),
      ln(30, 10, 15, 26, { strokeColor: CORAL, strokeWidth: 1.5 }),
    ],
  },
  {
    id: "star", name: "Star", category: "icons",
    elements: [
      // 5-point star via lines
      ln(16, 0, 20, 10, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(20, 10, 32, 12, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(32, 12, 22, 20, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(22, 20, 26, 32, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(26, 32, 16, 24, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(16, 24, 6, 32, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(6, 32, 10, 20, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(10, 20, 0, 12, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(0, 12, 12, 10, { strokeColor: TAN, strokeWidth: 1.5 }),
      ln(12, 10, 16, 0, { strokeColor: TAN, strokeWidth: 1.5 }),
    ],
  },
  {
    id: "check-circle", name: "Check", category: "icons",
    elements: [
      c(0, 0, 32, 32, { strokeColor: GREEN, strokeWidth: 1.5 }),
      ln(9, 16, 14, 22, { strokeColor: GREEN, strokeWidth: 2.5 }),
      ln(14, 22, 24, 10, { strokeColor: GREEN, strokeWidth: 2.5 }),
    ],
  },

  // ── Org Chart ──
  {
    id: "role-box", name: "Role Box", category: "orgchart",
    elements: [
      r(0, 0, 100, 44),
      txt(10, 8, "Name", { fontSize: 11 }),
      ln(10, 22, 90, 22, { strokeWidth: 0.5 }),
      txt(10, 26, "Title", { fontSize: 9, strokeColor: "#8a7e63" }),
    ],
  },
  {
    id: "hierarchy-line", name: "Hierarchy", category: "orgchart",
    elements: [
      ln(40, 0, 40, 30),
      ln(0, 30, 80, 30),
      ln(0, 30, 0, 40),
      ln(80, 30, 80, 40),
    ],
  },
  {
    id: "team-group", name: "Team Group", category: "orgchart",
    elements: [
      r(0, 0, 130, 60, { strokeWidth: 1 }),
      txt(8, 4, "Team", { fontSize: 9, strokeColor: "#8a7e63" }),
    ],
  },
];
