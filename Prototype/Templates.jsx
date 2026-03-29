import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "All", icon: null },
  { id: "contracts", label: "Contracts", icon: "S", count: 5 },
  { id: "proposals", label: "Proposals", icon: "*", count: 4 },
  { id: "invoices", label: "Invoices", icon: "$", count: 3 },
  { id: "scope", label: "Scope & Briefs", icon: "=", count: 3 },
  { id: "onboarding", label: "Onboarding", icon: ">", count: 2 },
  { id: "reports", label: "Reports", icon: "o", count: 2 },
];

const TEMPLATES = [
  {
    id: "t1", name: "Freelance Service Agreement", category: "contracts", popular: true,
    desc: "Standard contract for project-based work. Covers scope, timeline, payment terms, IP ownership, and termination.",
    fields: 12, pages: 3, signatureSlots: 2, lastUpdated: "Mar 2026",
    tags: ["E-Signature", "IP Clause", "Payment Terms"],
    usedCount: 142, rating: 4.9,
    preview: {
      sections: [
        { title: "Parties", desc: "Client and contractor identification" },
        { title: "Scope of Work", desc: "Detailed deliverables and timeline" },
        { title: "Compensation", desc: "Payment schedule, rates, and terms" },
        { title: "Intellectual Property", desc: "IP transfer on final payment" },
        { title: "Confidentiality", desc: "NDA clause for project materials" },
        { title: "Termination", desc: "Kill fee and notice period" },
        { title: "Signatures", desc: "Digital signature with date stamps" },
      ],
      fields: [
        { label: "Client Name", type: "text", placeholder: "Meridian Studio" },
        { label: "Project Name", type: "text", placeholder: "Brand Guidelines v2" },
        { label: "Start Date", type: "date", placeholder: "Apr 1, 2026" },
        { label: "End Date", type: "date", placeholder: "May 1, 2026" },
        { label: "Total Fee", type: "currency", placeholder: "$4,800" },
        { label: "Payment Schedule", type: "select", placeholder: "50/25/25" },
      ],
    },
  },
  {
    id: "t2", name: "Retainer Agreement", category: "contracts",
    desc: "Monthly retainer contract with rolling terms. Includes hours allocation, overage rates, and renewal.",
    fields: 10, pages: 2, signatureSlots: 2, lastUpdated: "Mar 2026",
    tags: ["Monthly", "Auto-Renew", "Hours Bank"],
    usedCount: 89, rating: 4.8,
    preview: {
      sections: [
        { title: "Retainer Terms", desc: "Monthly hours, rate, and billing cycle" },
        { title: "Scope of Services", desc: "What is included and excluded" },
        { title: "Overage & Rollover", desc: "Unused hours and extra work" },
        { title: "Renewal & Termination", desc: "30-day notice, auto-renew" },
        { title: "Signatures", desc: "Digital signature with date stamps" },
      ],
      fields: [
        { label: "Client Name", type: "text", placeholder: "Nora Kim" },
        { label: "Monthly Hours", type: "number", placeholder: "20" },
        { label: "Monthly Rate", type: "currency", placeholder: "$3,000" },
        { label: "Start Date", type: "date", placeholder: "Apr 1, 2026" },
      ],
    },
  },
  {
    id: "t3", name: "Non-Disclosure Agreement", category: "contracts",
    desc: "Mutual NDA for protecting confidential information shared during project discovery and execution.",
    fields: 6, pages: 2, signatureSlots: 2, lastUpdated: "Feb 2026",
    tags: ["Mutual NDA", "2-Year Term"],
    usedCount: 67, rating: 4.7,
    preview: {
      sections: [
        { title: "Definition of Confidential Information", desc: "What is protected" },
        { title: "Obligations", desc: "How information must be handled" },
        { title: "Exclusions", desc: "Public domain, prior knowledge" },
        { title: "Term & Survival", desc: "Duration and post-term obligations" },
        { title: "Signatures", desc: "Both parties sign digitally" },
      ],
      fields: [
        { label: "Disclosing Party", type: "text", placeholder: "Meridian Studio" },
        { label: "Receiving Party", type: "text", placeholder: "Your Name" },
        { label: "Effective Date", type: "date", placeholder: "Apr 1, 2026" },
      ],
    },
  },
  {
    id: "t4", name: "Subcontractor Agreement", category: "contracts",
    desc: "Hire a subcontractor for part of your project. Covers deliverables, payment, and IP assignment back to you.",
    fields: 10, pages: 2, signatureSlots: 2, lastUpdated: "Feb 2026",
    tags: ["Subcontractor", "IP Assignment"],
    usedCount: 34, rating: 4.6,
    preview: {
      sections: [
        { title: "Subcontractor Scope", desc: "What they are delivering" },
        { title: "Compensation", desc: "Flat fee or hourly" },
        { title: "IP & Work Product", desc: "All work assigned to you" },
        { title: "Confidentiality", desc: "Client info protection" },
        { title: "Signatures", desc: "Digital signature" },
      ],
      fields: [
        { label: "Subcontractor Name", type: "text", placeholder: "Jamie Park" },
        { label: "Project", type: "text", placeholder: "Typography Scale" },
        { label: "Fee", type: "currency", placeholder: "$800" },
      ],
    },
  },
  {
    id: "t5", name: "Project Change Order", category: "contracts",
    desc: "Amend an existing contract when scope changes. Adds new deliverables, adjusts timeline and budget.",
    fields: 8, pages: 1, signatureSlots: 2, lastUpdated: "Mar 2026",
    tags: ["Amendment", "Scope Change"],
    usedCount: 56, rating: 4.8,
    preview: {
      sections: [
        { title: "Original Agreement Reference", desc: "Link to existing contract" },
        { title: "Changes to Scope", desc: "New deliverables or modifications" },
        { title: "Adjusted Timeline", desc: "New deadlines" },
        { title: "Adjusted Compensation", desc: "Additional fees" },
        { title: "Signatures", desc: "Both parties approve changes" },
      ],
      fields: [
        { label: "Original Contract", type: "select", placeholder: "Service Agreement - Meridian" },
        { label: "Change Description", type: "textarea", placeholder: "Add animation guidelines..." },
        { label: "Additional Fee", type: "currency", placeholder: "$600" },
      ],
    },
  },
  {
    id: "t6", name: "Project Proposal", category: "proposals", popular: true,
    desc: "Full proposal with problem statement, approach, scope, timeline, pricing, and terms. Client can accept inline.",
    fields: 14, pages: 4, signatureSlots: 1, lastUpdated: "Mar 2026",
    tags: ["Client-Facing", "Accept Button", "Pricing Table"],
    usedCount: 198, rating: 4.9,
    preview: {
      sections: [
        { title: "Executive Summary", desc: "The problem and your solution" },
        { title: "Approach", desc: "How you will tackle the project" },
        { title: "Scope of Work", desc: "Deliverables checklist" },
        { title: "Timeline", desc: "Visual milestone timeline" },
        { title: "Investment", desc: "Pricing table with tiers" },
        { title: "Terms", desc: "Payment schedule and conditions" },
        { title: "Accept & Sign", desc: "Client accepts with one click" },
      ],
      fields: [
        { label: "Client Name", type: "text", placeholder: "Nora Kim" },
        { label: "Project Name", type: "text", placeholder: "Course Landing Page" },
        { label: "Service", type: "select", placeholder: "Website Design - Multi-page" },
        { label: "Total Investment", type: "currency", placeholder: "$4,200" },
      ],
    },
  },
  {
    id: "t7", name: "Quick Estimate", category: "proposals",
    desc: "Lightweight one-page estimate with line items. Send fast, follow up with a full proposal if they bite.",
    fields: 6, pages: 1, signatureSlots: 0, lastUpdated: "Mar 2026",
    tags: ["One Page", "Fast Send"],
    usedCount: 124, rating: 4.7,
    preview: {
      sections: [
        { title: "Overview", desc: "Brief project description" },
        { title: "Line Items", desc: "Itemized cost breakdown" },
        { title: "Total & Timeline", desc: "Bottom line and when" },
      ],
      fields: [
        { label: "Client", type: "text", placeholder: "Luna Boutique" },
        { label: "Line Items", type: "table", placeholder: "3 items" },
      ],
    },
  },
  {
    id: "t8", name: "Brand & Identity Proposal", category: "proposals",
    desc: "Specialized for brand identity projects. Includes discovery, strategy, design phases, and mood board section.",
    fields: 12, pages: 5, signatureSlots: 1, lastUpdated: "Feb 2026",
    tags: ["Brand", "Discovery Phase", "Mood Board"],
    usedCount: 76, rating: 4.9,
    preview: {
      sections: [
        { title: "Discovery", desc: "Research and brand audit" },
        { title: "Strategy", desc: "Positioning and voice" },
        { title: "Visual Identity", desc: "Logo, colors, typography" },
        { title: "Deliverables", desc: "Full asset list" },
        { title: "Mood Board", desc: "Visual direction preview" },
        { title: "Investment", desc: "Tiered pricing" },
        { title: "Next Steps", desc: "Accept and schedule kickoff" },
      ],
      fields: [
        { label: "Client", type: "text", placeholder: "Meridian Studio" },
        { label: "Tier", type: "select", placeholder: "Complete - $4,800" },
      ],
    },
  },
  {
    id: "t9", name: "Retainer Proposal", category: "proposals",
    desc: "Propose an ongoing retainer relationship. Shows monthly scope, hours, and value over time.",
    fields: 8, pages: 2, signatureSlots: 1, lastUpdated: "Mar 2026",
    tags: ["Monthly", "Recurring"],
    usedCount: 45, rating: 4.6,
    preview: {
      sections: [
        { title: "The Opportunity", desc: "Why ongoing support makes sense" },
        { title: "Monthly Scope", desc: "What is included each month" },
        { title: "Investment", desc: "Monthly rate and terms" },
        { title: "Getting Started", desc: "Accept and sign retainer" },
      ],
      fields: [
        { label: "Client", type: "text", placeholder: "Nora Kim" },
        { label: "Monthly Rate", type: "currency", placeholder: "$3,000" },
        { label: "Monthly Hours", type: "number", placeholder: "20" },
      ],
    },
  },
  {
    id: "t10", name: "Standard Invoice", category: "invoices", popular: true,
    desc: "Clean invoice with line items, payment terms, and Stripe checkout. Client pays in one click.",
    fields: 8, pages: 1, signatureSlots: 0, lastUpdated: "Mar 2026",
    tags: ["Stripe", "Auto-Calculate", "Payment Link"],
    usedCount: 312, rating: 5.0,
    preview: {
      sections: [
        { title: "Invoice Details", desc: "Number, date, due date" },
        { title: "Line Items", desc: "Services with quantities and rates" },
        { title: "Total", desc: "Subtotal, tax, grand total" },
        { title: "Payment", desc: "Stripe checkout button" },
      ],
      fields: [
        { label: "Client", type: "select", placeholder: "Meridian Studio" },
        { label: "Services", type: "select", placeholder: "From service catalog" },
        { label: "Due Date", type: "date", placeholder: "Net 15" },
      ],
    },
  },
  {
    id: "t11", name: "Milestone Invoice", category: "invoices",
    desc: "Invoice tied to a specific project milestone. Auto-references the deliverable and contract.",
    fields: 6, pages: 1, signatureSlots: 0, lastUpdated: "Mar 2026",
    tags: ["Milestone", "Auto-Link"],
    usedCount: 87, rating: 4.8,
    preview: {
      sections: [
        { title: "Milestone Reference", desc: "Links to deliverable" },
        { title: "Amount Due", desc: "As per payment schedule" },
        { title: "Payment", desc: "Stripe checkout" },
      ],
      fields: [
        { label: "Project", type: "select", placeholder: "Brand Guidelines v2" },
        { label: "Milestone", type: "select", placeholder: "Deliverable #2" },
      ],
    },
  },
  {
    id: "t12", name: "Recurring Invoice", category: "invoices",
    desc: "Monthly retainer invoice. Auto-generates on the 1st, sends to client, tracks payment.",
    fields: 4, pages: 1, signatureSlots: 0, lastUpdated: "Feb 2026",
    tags: ["Auto-Send", "Recurring"],
    usedCount: 54, rating: 4.7,
    preview: {
      sections: [
        { title: "Retainer Period", desc: "Month and hours" },
        { title: "Hours Used", desc: "Auto-tracked from timer" },
        { title: "Payment", desc: "Stripe checkout" },
      ],
      fields: [
        { label: "Client", type: "select", placeholder: "Nora Kim" },
        { label: "Period", type: "date", placeholder: "April 2026" },
      ],
    },
  },
  {
    id: "t13", name: "Creative Brief", category: "scope",
    desc: "Structured brief for design and creative projects. Captures goals, audience, tone, and constraints.",
    fields: 10, pages: 2, signatureSlots: 0, lastUpdated: "Feb 2026",
    tags: ["Discovery", "Client Fill-In"],
    usedCount: 98, rating: 4.8,
    preview: {
      sections: [
        { title: "Project Overview", desc: "What and why" },
        { title: "Target Audience", desc: "Who we are designing for" },
        { title: "Brand Voice & Tone", desc: "How it should feel" },
        { title: "Deliverables", desc: "What we are making" },
        { title: "Constraints", desc: "Budget, timeline, technical" },
        { title: "References", desc: "Inspiration and anti-references" },
      ],
      fields: [
        { label: "Project Name", type: "text", placeholder: "Brand Identity" },
        { label: "Client Goals", type: "textarea", placeholder: "Describe goals..." },
      ],
    },
  },
  {
    id: "t14", name: "Project Scope Document", category: "scope",
    desc: "Detailed scope with deliverables, acceptance criteria, exclusions, and assumptions.",
    fields: 12, pages: 3, signatureSlots: 1, lastUpdated: "Mar 2026",
    tags: ["Deliverables", "Acceptance Criteria"],
    usedCount: 76, rating: 4.7,
    preview: {
      sections: [
        { title: "Objectives", desc: "What success looks like" },
        { title: "In Scope", desc: "Deliverables with acceptance criteria" },
        { title: "Out of Scope", desc: "Explicit exclusions" },
        { title: "Assumptions", desc: "What we are assuming is true" },
        { title: "Sign-Off", desc: "Client approves scope" },
      ],
      fields: [
        { label: "Project", type: "text", placeholder: "Website Redesign" },
        { label: "Deliverables", type: "checklist", placeholder: "5 items" },
      ],
    },
  },
  {
    id: "t15", name: "Meeting Notes", category: "scope",
    desc: "Structured notes from client calls. Action items auto-create tasks in the project workspace.",
    fields: 4, pages: 1, signatureSlots: 0, lastUpdated: "Mar 2026",
    tags: ["Auto-Tasks", "Quick Capture"],
    usedCount: 156, rating: 4.6,
    preview: {
      sections: [
        { title: "Attendees & Date", desc: "Who was there" },
        { title: "Discussion Points", desc: "What was covered" },
        { title: "Decisions Made", desc: "What was agreed" },
        { title: "Action Items", desc: "Tasks with owners and dates" },
      ],
      fields: [
        { label: "Meeting Title", type: "text", placeholder: "Kickoff Call" },
        { label: "Client", type: "select", placeholder: "Nora Kim" },
      ],
    },
  },
  {
    id: "t16", name: "Client Welcome Kit", category: "onboarding",
    desc: "Send to new clients after signing. Covers how you work, communication norms, tools, and next steps.",
    fields: 6, pages: 2, signatureSlots: 0, lastUpdated: "Feb 2026",
    tags: ["Client-Facing", "First Impression"],
    usedCount: 67, rating: 4.9,
    preview: {
      sections: [
        { title: "Welcome", desc: "Warm intro and excitement" },
        { title: "How I Work", desc: "Process, tools, availability" },
        { title: "Communication", desc: "Response times, preferred channels" },
        { title: "What I Need From You", desc: "Assets, access, timelines" },
        { title: "Next Steps", desc: "Kickoff call scheduling" },
      ],
      fields: [
        { label: "Client Name", type: "text", placeholder: "Nora Kim" },
        { label: "Project", type: "text", placeholder: "Course Landing Page" },
      ],
    },
  },
  {
    id: "t17", name: "Client Questionnaire", category: "onboarding",
    desc: "Discovery questionnaire for new projects. Client fills it in before the kickoff call.",
    fields: 15, pages: 2, signatureSlots: 0, lastUpdated: "Mar 2026",
    tags: ["Client Fill-In", "Discovery"],
    usedCount: 89, rating: 4.7,
    preview: {
      sections: [
        { title: "About Your Business", desc: "Company, audience, goals" },
        { title: "Project Goals", desc: "What does success look like" },
        { title: "Visual Preferences", desc: "Styles, colors, references" },
        { title: "Technical Requirements", desc: "Platforms, integrations" },
        { title: "Budget & Timeline", desc: "Constraints and expectations" },
      ],
      fields: [
        { label: "Business Name", type: "text", placeholder: "Luna Boutique" },
        { label: "Industry", type: "text", placeholder: "E-commerce" },
      ],
    },
  },
  {
    id: "t18", name: "Project Wrap-Up Report", category: "reports",
    desc: "End-of-project summary with deliverables, timeline, budget review, and testimonial request.",
    fields: 8, pages: 2, signatureSlots: 0, lastUpdated: "Mar 2026",
    tags: ["Testimonial", "Final Delivery"],
    usedCount: 45, rating: 4.8,
    preview: {
      sections: [
        { title: "Project Summary", desc: "What we accomplished" },
        { title: "Deliverables Recap", desc: "Everything delivered" },
        { title: "Budget Review", desc: "Estimated vs actual" },
        { title: "Timeline Review", desc: "Planned vs actual" },
        { title: "Testimonial Request", desc: "Ask for a review" },
        { title: "Next Steps", desc: "Future recommendations" },
      ],
      fields: [
        { label: "Project", type: "select", placeholder: "Brand Guidelines v2" },
      ],
    },
  },
  {
    id: "t19", name: "Monthly Retainer Report", category: "reports",
    desc: "Monthly summary for retainer clients. Hours used, tasks completed, upcoming priorities.",
    fields: 6, pages: 1, signatureSlots: 0, lastUpdated: "Mar 2026",
    tags: ["Monthly", "Auto-Fill"],
    usedCount: 34, rating: 4.6,
    preview: {
      sections: [
        { title: "Month Summary", desc: "Key accomplishments" },
        { title: "Hours Breakdown", desc: "Auto-pulled from timer" },
        { title: "Tasks Completed", desc: "From workspace" },
        { title: "Upcoming Priorities", desc: "Next month focus" },
      ],
      fields: [
        { label: "Client", type: "select", placeholder: "Nora Kim" },
        { label: "Period", type: "date", placeholder: "March 2026" },
      ],
    },
  },
];

const FIELD_ICONS = { text: "Aa", date: "D", currency: "$", select: "v", number: "#", textarea: "P", table: "+", checklist: "[]" };

export default function Templates() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("t1");
  const [hoveredCard, setHoveredCard] = useState(null);

  const filtered = TEMPLATES
    .filter(t => category === "all" || t.category === category)
    .filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()));

  const selected = TEMPLATES.find(t => t.id === selectedTemplate);
  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;

  return (
    <div>
      <h1>Templates Prototype</h1>
      <p>{TEMPLATES.length} templates across {CATEGORIES.length - 1} categories</p>
      <p>See Prototype/Templates.jsx for full design reference</p>
    </div>
  );
}
