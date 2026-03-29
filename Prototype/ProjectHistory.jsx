import { useState } from "react";

const REVISIONS = [
  {
    id: "r1", hash: "a3f7c1", branch: "main", date: "Mar 29, 2026", time: "11:42am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Updated pricing — increased social template rate",
    status: "current",
    stats: { additions: 2, deletions: 1, files: 1 },
    changes: [
      {
        file: "Pricing",
        type: "modified",
        hunks: [
          { context: "Line Items", lines: [
            { type: "unchanged", text: "Brand Guidelines Document    1 × $1,800    $1,800" },
            { type: "deletion", text: "Social Media Template Kit    5 × $100      $500" },
            { type: "addition", text: "Social Media Template Kit    5 × $120      $600" },
            { type: "unchanged", text: "" },
            { type: "deletion", text: "Total                                      $2,300" },
            { type: "addition", text: "Total                                      $2,400" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r2", hash: "e8b2d4", branch: "main", date: "Mar 29, 2026", time: "10:15am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Added social media templates to scope",
    status: "approved",
    approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 1, deletions: 0, files: 2 },
    changes: [
      {
        file: "Scope of Work",
        type: "modified",
        hunks: [
          { context: "Deliverables", lines: [
            { type: "unchanged", text: "04  Imagery & photography direction" },
            { type: "addition", text: "05  Social media templates (IG, LinkedIn)" },
          ]}
        ]
      },
      {
        file: "Pricing",
        type: "modified",
        hunks: [
          { context: "Line Items", lines: [
            { type: "unchanged", text: "Brand Guidelines Document    1 × $1,800    $1,800" },
            { type: "addition", text: "Social Media Template Kit    5 × $100      $500" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r3", hash: "f41a09", branch: "main", date: "Mar 28, 2026", time: "4:30pm",
    author: { name: "Jamie Park", avatar: "J", color: "#7c8594" },
    message: "Revised typography section — switched to variable fonts",
    status: "approved",
    approvedBy: { name: "You", avatar: "A" },
    stats: { additions: 4, deletions: 3, files: 1 },
    changes: [
      {
        file: "Notes",
        type: "modified",
        hunks: [
          { context: "Typography", lines: [
            { type: "deletion", text: "Using static font files (Outfit Regular, Medium, Bold)" },
            { type: "deletion", text: "Font scale: 12 / 14 / 16 / 20 / 24 / 32" },
            { type: "deletion", text: "Line height: 1.5 across all sizes" },
            { type: "addition", text: "Using Outfit Variable (single file, full weight range)" },
            { type: "addition", text: "Font scale: 12 / 14 / 16 / 20 / 24 / 32 / 40" },
            { type: "addition", text: "Line height: 1.5 for body, 1.25 for headings" },
            { type: "addition", text: "Variable font supports weight 300–700 continuously" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r4", hash: "c92e5b", branch: "main", date: "Mar 28, 2026", time: "2:10pm",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Added timeline milestones",
    status: "approved",
    approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 4, deletions: 0, files: 1 },
    changes: [
      {
        file: "Timeline",
        type: "added",
        hunks: [
          { context: "Milestones", lines: [
            { type: "addition", text: "Week 1    Discovery & Research" },
            { type: "addition", text: "Week 2    Initial Concepts" },
            { type: "addition", text: "Week 3    Client Review" },
            { type: "addition", text: "Week 4    Final Delivery" },
          ]}
        ]
      }
    ]
  },
  {
    id: "r5", hash: "1d7f3a", branch: "main", date: "Mar 27, 2026", time: "9:00am",
    author: { name: "You", avatar: "A", color: "#b07d4f" },
    message: "Initial proposal created",
    status: "approved",
    approvedBy: { name: "Sarah Chen", avatar: "S" },
    stats: { additions: 12, deletions: 0, files: 4 },
    changes: [
      {
        file: "Introduction",
        type: "added",
        hunks: [
          { context: "", lines: [
            { type: "addition", text: "Hi Sarah — thanks for reaching out about the" },
            { type: "addition", text: "Brand Guidelines project. Based on our conversation," },
            { type: "addition", text: "here's what I'm proposing." },
          ]}
        ]
      },
      {
        file: "Scope of Work",
        type: "added",
        hunks: [
          { context: "Deliverables", lines: [
            { type: "addition", text: "01  Primary & secondary logo usage rules" },
            { type: "addition", text: "02  Color palette with hex/RGB/CMYK values" },
            { type: "addition", text: "03  Typography scale & font pairings" },
            { type: "addition", text: "04  Imagery & photography direction" },
          ]}
        ]
      }
    ]
  },
];

const STATUS_MAP = {
  current: { label: "HEAD", color: "#b07d4f", bg: "rgba(176,125,79,0.1)", border: "rgba(176,125,79,0.2)" },
  approved: { label: "Approved", color: "#5a9a3c", bg: "rgba(90,154,60,0.08)", border: "rgba(90,154,60,0.15)" },
  pending: { label: "Pending", color: "#8a7e63", bg: "rgba(138,126,99,0.08)", border: "rgba(138,126,99,0.15)" },
  rejected: { label: "Changes Req.", color: "#c24b38", bg: "rgba(194,75,56,0.08)", border: "rgba(194,75,56,0.15)" },
};

const FILE_TYPE_MAP = {
  added: { label: "A", color: "#5a9a3c" },
  modified: { label: "M", color: "#b07d4f" },
  deleted: { label: "D", color: "#c24b38" },
  renamed: { label: "R", color: "#7c8594" },
};

// ... full component exported as ProjectHistory
