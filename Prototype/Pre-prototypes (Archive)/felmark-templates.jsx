import { useState } from "react";

const CATEGORIES = [
  { id: "all", label: "All", icon: null },
  { id: "contracts", label: "Contracts", icon: "§", count: 5 },
  { id: "proposals", label: "Proposals", icon: "◆", count: 4 },
  { id: "invoices", label: "Invoices", icon: "$", count: 3 },
  { id: "scope", label: "Scope & Briefs", icon: "☰", count: 3 },
  { id: "onboarding", label: "Onboarding", icon: "→", count: 2 },
  { id: "reports", label: "Reports", icon: "◎", count: 2 },
];

const TEMPLATES = [
  // Contracts
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
        { title: "Scope of Services", desc: "What's included and excluded" },
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
        { title: "Definition of Confidential Information", desc: "What's protected" },
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
        { title: "Subcontractor Scope", desc: "What they're delivering" },
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
        { label: "Original Contract", type: "select", placeholder: "Service Agreement — Meridian" },
        { label: "Change Description", type: "textarea", placeholder: "Add animation guidelines..." },
        { label: "Additional Fee", type: "currency", placeholder: "$600" },
      ],
    },
  },

  // Proposals
  {
    id: "t6", name: "Project Proposal", category: "proposals", popular: true,
    desc: "Full proposal with problem statement, approach, scope, timeline, pricing, and terms. Client can accept inline.",
    fields: 14, pages: 4, signatureSlots: 1, lastUpdated: "Mar 2026",
    tags: ["Client-Facing", "Accept Button", "Pricing Table"],
    usedCount: 198, rating: 4.9,
    preview: {
      sections: [
        { title: "Executive Summary", desc: "The problem and your solution" },
        { title: "Approach", desc: "How you'll tackle the project" },
        { title: "Scope of Work", desc: "Deliverables checklist" },
        { title: "Timeline", desc: "Visual milestone timeline" },
        { title: "Investment", desc: "Pricing table with tiers" },
        { title: "Terms", desc: "Payment schedule and conditions" },
        { title: "Accept & Sign", desc: "Client accepts with one click" },
      ],
      fields: [
        { label: "Client Name", type: "text", placeholder: "Nora Kim" },
        { label: "Project Name", type: "text", placeholder: "Course Landing Page" },
        { label: "Service", type: "select", placeholder: "Website Design — Multi-page" },
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
        { label: "Tier", type: "select", placeholder: "Complete — $4,800" },
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
        { title: "Monthly Scope", desc: "What's included each month" },
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

  // Invoices
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

  // Scope & Briefs
  {
    id: "t13", name: "Creative Brief", category: "scope",
    desc: "Structured brief for design and creative projects. Captures goals, audience, tone, and constraints.",
    fields: 10, pages: 2, signatureSlots: 0, lastUpdated: "Feb 2026",
    tags: ["Discovery", "Client Fill-In"],
    usedCount: 98, rating: 4.8,
    preview: {
      sections: [
        { title: "Project Overview", desc: "What and why" },
        { title: "Target Audience", desc: "Who we're designing for" },
        { title: "Brand Voice & Tone", desc: "How it should feel" },
        { title: "Deliverables", desc: "What we're making" },
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
        { title: "Assumptions", desc: "What we're assuming is true" },
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

  // Onboarding
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

  // Reports
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

const FIELD_ICONS = { text: "Aa", date: "◇", currency: "$", select: "▾", number: "#", textarea: "¶", table: "⊞", checklist: "☐" };

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
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
        }
        .tpl { font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--ink-700); background: var(--parchment); height: 100vh; display: flex; flex-direction: column; }

        /* ── Header ── */
        .tpl-head { padding: 16px 24px; border-bottom: 1px solid var(--warm-200); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .tpl-head-left { display: flex; align-items: center; gap: 14px; }
        .tpl-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); }
        .tpl-count { font-family: var(--mono); font-size: 11px; color: var(--ink-300); }

        .tpl-search-wrap { position: relative; width: 260px; }
        .tpl-search { width: 100%; padding: 8px 12px 8px 32px; border: 1px solid var(--warm-200); border-radius: 7px; font-family: inherit; font-size: 13px; color: var(--ink-700); outline: none; background: #fff; }
        .tpl-search:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.04); }
        .tpl-search::placeholder { color: var(--warm-400); }
        .tpl-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--ink-300); }

        /* ── Layout ── */
        .tpl-layout { flex: 1; display: flex; overflow: hidden; }

        /* ── Sidebar categories ── */
        .tpl-sidebar { width: 200px; flex-shrink: 0; border-right: 1px solid var(--warm-100); padding: 12px 8px; overflow-y: auto; background: var(--warm-50); }
        .tpl-sidebar::-webkit-scrollbar { width: 3px; }
        .tpl-sidebar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }
        .tpl-cat-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.1em; padding: 8px 10px 6px; }
        .tpl-cat {
          display: flex; align-items: center; gap: 8px; padding: 7px 10px;
          border-radius: 6px; cursor: pointer; transition: all 0.06s;
          font-size: 13px; color: var(--ink-500); border: none; background: none;
          width: 100%; text-align: left; font-family: inherit;
        }
        .tpl-cat:hover { background: var(--warm-100); color: var(--ink-700); }
        .tpl-cat.on { background: var(--ink-900); color: var(--parchment); }
        .tpl-cat-icon { font-family: var(--mono); font-size: 12px; width: 18px; text-align: center; flex-shrink: 0; }
        .tpl-cat-count { font-family: var(--mono); font-size: 10px; margin-left: auto; opacity: 0.4; }

        /* ── Grid ── */
        .tpl-grid-area { flex: 1; overflow-y: auto; padding: 16px; }
        .tpl-grid-area::-webkit-scrollbar { width: 5px; }
        .tpl-grid-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }
        .tpl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }

        /* ── Template card ── */
        .tpl-card {
          background: #fff; border: 1px solid var(--warm-200); border-radius: 9px;
          padding: 16px; cursor: pointer; transition: all 0.12s; position: relative;
        }
        .tpl-card:hover { border-color: var(--warm-300); box-shadow: 0 2px 10px rgba(0,0,0,0.03); transform: translateY(-1px); }
        .tpl-card.on { border-color: var(--ember); box-shadow: 0 0 0 1px var(--ember); }
        .tpl-card-popular {
          position: absolute; top: 8px; right: 8px;
          font-family: var(--mono); font-size: 8px; font-weight: 500; color: var(--ember);
          background: var(--ember-bg); padding: 1px 6px; border-radius: 2px;
          border: 1px solid rgba(176,125,79,0.1); letter-spacing: 0.04em;
        }

        .tpl-card-cat { font-family: var(--mono); font-size: 9px; color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
        .tpl-card-name { font-size: 15px; font-weight: 500; color: var(--ink-800); margin-bottom: 4px; line-height: 1.3; }
        .tpl-card-desc { font-size: 12.5px; color: var(--ink-400); line-height: 1.5; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .tpl-card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 10px; }
        .tpl-card-tag { font-family: var(--mono); font-size: 9px; color: var(--ink-400); background: var(--warm-100); padding: 1px 6px; border-radius: 2px; }

        .tpl-card-footer { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .tpl-card-footer-sep { width: 1px; height: 10px; background: var(--warm-200); }
        .tpl-card-sig { display: flex; align-items: center; gap: 3px; }

        /* ── Preview panel ── */
        .tpl-preview { width: 380px; flex-shrink: 0; border-left: 1px solid var(--warm-100); overflow-y: auto; display: flex; flex-direction: column; background: var(--warm-50); }
        .tpl-preview::-webkit-scrollbar { width: 4px; }
        .tpl-preview::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .tpl-pv-empty { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--ink-300); font-size: 13px; }

        .tpl-pv-head { padding: 20px 22px 14px; border-bottom: 1px solid var(--warm-100); }
        .tpl-pv-cat { font-family: var(--mono); font-size: 9px; color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; display: flex; align-items: center; gap: 5px; }
        .tpl-pv-cat-dot { width: 5px; height: 5px; border-radius: 2px; background: var(--ember); }
        .tpl-pv-name { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: var(--ink-900); line-height: 1.2; margin-bottom: 4px; }
        .tpl-pv-desc { font-size: 14px; color: var(--ink-500); line-height: 1.5; margin-bottom: 10px; }

        .tpl-pv-stats { display: flex; gap: 12px; margin-bottom: 4px; }
        .tpl-pv-stat { display: flex; align-items: center; gap: 4px; font-family: var(--mono); font-size: 10px; color: var(--ink-400); }

        .tpl-pv-tags { display: flex; gap: 4px; flex-wrap: wrap; }
        .tpl-pv-tag { font-family: var(--mono); font-size: 9px; color: var(--ink-400); background: var(--warm-100); padding: 2px 7px; border-radius: 3px; border: 1px solid var(--warm-200); }

        .tpl-pv-body { flex: 1; padding: 16px 22px; }
        .tpl-pv-section { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.1em; margin: 16px 0 8px; display: flex; align-items: center; gap: 8px; }
        .tpl-pv-section::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        /* Document outline */
        .tpl-pv-outline { display: flex; flex-direction: column; gap: 4px; }
        .tpl-pv-outline-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 10px; border-radius: 5px; border: 1px solid var(--warm-100); background: var(--parchment); }
        .tpl-pv-outline-num { font-family: var(--mono); font-size: 10px; color: var(--ink-300); width: 18px; flex-shrink: 0; padding-top: 1px; }
        .tpl-pv-outline-body { flex: 1; }
        .tpl-pv-outline-title { font-size: 13px; font-weight: 500; color: var(--ink-700); }
        .tpl-pv-outline-desc { font-size: 11px; color: var(--ink-400); }

        /* Fields preview */
        .tpl-pv-fields { display: flex; flex-direction: column; gap: 6px; }
        .tpl-pv-field { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--warm-200); border-radius: 6px; background: #fff; }
        .tpl-pv-field-icon { font-family: var(--mono); font-size: 10px; color: var(--ink-300); width: 20px; height: 20px; border-radius: 4px; background: var(--warm-100); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tpl-pv-field-info { flex: 1; }
        .tpl-pv-field-label { font-size: 12px; font-weight: 500; color: var(--ink-700); }
        .tpl-pv-field-placeholder { font-family: var(--mono); font-size: 11px; color: var(--ink-300); }

        /* Signature preview */
        .tpl-pv-sig {
          margin-top: 8px; padding: 16px; border: 1px dashed var(--warm-300);
          border-radius: 8px; text-align: center;
        }
        .tpl-pv-sig-icon { font-size: 18px; color: var(--ink-300); margin-bottom: 4px; }
        .tpl-pv-sig-text { font-family: var(--mono); font-size: 11px; color: var(--ink-400); }
        .tpl-pv-sig-line { width: 160px; height: 1px; background: var(--warm-300); margin: 10px auto 4px; }
        .tpl-pv-sig-label { font-family: var(--mono); font-size: 9px; color: var(--ink-300); }

        /* Actions */
        .tpl-pv-actions { padding: 14px 22px; border-top: 1px solid var(--warm-100); display: flex; gap: 6px; flex-shrink: 0; }
        .tpl-pv-btn { flex: 1; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 500; font-family: inherit; cursor: pointer; text-align: center; transition: all 0.1s; }
        .tpl-pv-btn-primary { background: var(--ember); border: none; color: #fff; }
        .tpl-pv-btn-primary:hover { background: var(--ember-light); }
        .tpl-pv-btn-ghost { background: none; border: 1px solid var(--warm-200); color: var(--ink-600); }
        .tpl-pv-btn-ghost:hover { background: var(--warm-100); }
      `}</style>

      <div className="tpl">
        <div className="tpl-head">
          <div className="tpl-head-left">
            <span className="tpl-title">Templates</span>
            <span className="tpl-count">{TEMPLATES.length} templates</span>
          </div>
          <div className="tpl-search-wrap">
            <span className="tpl-search-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </span>
            <input className="tpl-search" placeholder="Search templates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div className="tpl-layout">
          {/* Sidebar */}
          <div className="tpl-sidebar">
            <div className="tpl-cat-label">categories</div>
            {CATEGORIES.map(c => (
              <button key={c.id} className={`tpl-cat${category === c.id ? " on" : ""}`} onClick={() => setCategory(c.id)}>
                {c.icon && <span className="tpl-cat-icon">{c.icon}</span>}
                {!c.icon && <span className="tpl-cat-icon">✦</span>}
                {c.label}
                {c.count && <span className="tpl-cat-count">{c.count}</span>}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="tpl-grid-area">
            <div className="tpl-grid">
              {filtered.map(t => (
                <div key={t.id} className={`tpl-card${selectedTemplate === t.id ? " on" : ""}`}
                  onClick={() => setSelectedTemplate(t.id)}
                  onMouseEnter={() => setHoveredCard(t.id)}
                  onMouseLeave={() => setHoveredCard(null)}>
                  {t.popular && <span className="tpl-card-popular">POPULAR</span>}
                  <div className="tpl-card-cat">{catLabel(t.category)}</div>
                  <div className="tpl-card-name">{t.name}</div>
                  <div className="tpl-card-desc">{t.desc}</div>
                  <div className="tpl-card-tags">
                    {t.tags.slice(0, 3).map((tag, i) => <span key={i} className="tpl-card-tag">{tag}</span>)}
                  </div>
                  <div className="tpl-card-footer">
                    <span>{t.fields} fields</span>
                    <span className="tpl-card-footer-sep" />
                    <span>{t.pages} {t.pages === 1 ? "page" : "pages"}</span>
                    {t.signatureSlots > 0 && (
                      <>
                        <span className="tpl-card-footer-sep" />
                        <span className="tpl-card-sig">✍ {t.signatureSlots} sig</span>
                      </>
                    )}
                    <span className="tpl-card-footer-sep" />
                    <span>{t.usedCount}× used</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="tpl-preview">
            {selected ? (
              <>
                <div className="tpl-pv-head">
                  <div className="tpl-pv-cat"><span className="tpl-pv-cat-dot" />{catLabel(selected.category)}</div>
                  <div className="tpl-pv-name">{selected.name}</div>
                  <div className="tpl-pv-desc">{selected.desc}</div>
                  <div className="tpl-pv-stats">
                    <span className="tpl-pv-stat">{selected.fields} fields</span>
                    <span className="tpl-pv-stat">{selected.pages} pages</span>
                    {selected.signatureSlots > 0 && <span className="tpl-pv-stat">✍ {selected.signatureSlots} signatures</span>}
                    <span className="tpl-pv-stat">★ {selected.rating}</span>
                    <span className="tpl-pv-stat">{selected.usedCount}× used</span>
                  </div>
                  <div className="tpl-pv-tags" style={{ marginTop: 8 }}>
                    {selected.tags.map((tag, i) => <span key={i} className="tpl-pv-tag">{tag}</span>)}
                  </div>
                </div>

                <div className="tpl-pv-body">
                  <div className="tpl-pv-section">document structure</div>
                  <div className="tpl-pv-outline">
                    {selected.preview.sections.map((s, i) => (
                      <div key={i} className="tpl-pv-outline-item">
                        <span className="tpl-pv-outline-num">{String(i + 1).padStart(2, "0")}</span>
                        <div className="tpl-pv-outline-body">
                          <div className="tpl-pv-outline-title">{s.title}</div>
                          <div className="tpl-pv-outline-desc">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="tpl-pv-section">fields to fill</div>
                  <div className="tpl-pv-fields">
                    {selected.preview.fields.map((f, i) => (
                      <div key={i} className="tpl-pv-field">
                        <span className="tpl-pv-field-icon">{FIELD_ICONS[f.type] || "?"}</span>
                        <div className="tpl-pv-field-info">
                          <div className="tpl-pv-field-label">{f.label}</div>
                          <div className="tpl-pv-field-placeholder">{f.placeholder}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selected.signatureSlots > 0 && (
                    <>
                      <div className="tpl-pv-section">e-signature</div>
                      <div className="tpl-pv-sig">
                        <div className="tpl-pv-sig-icon">✍</div>
                        <div className="tpl-pv-sig-text">{selected.signatureSlots === 1 ? "Client signs here" : "Both parties sign"}</div>
                        <div className="tpl-pv-sig-line" />
                        <div className="tpl-pv-sig-label">Legally binding digital signature · timestamped</div>
                      </div>
                    </>
                  )}
                </div>

                <div className="tpl-pv-actions">
                  <button className="tpl-pv-btn tpl-pv-btn-primary">Use Template</button>
                  <button className="tpl-pv-btn tpl-pv-btn-ghost">Preview</button>
                  <button className="tpl-pv-btn tpl-pv-btn-ghost">Duplicate</button>
                </div>
              </>
            ) : (
              <div className="tpl-pv-empty">Select a template to preview</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
