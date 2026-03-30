"use client";

import { useState, useRef, useEffect } from "react";
import type { Block, BlockType, MoneyBlockType } from "@/lib/types";
import { uid } from "@/lib/utils";
import styles from "./AiBlock.module.css";

// ── Demo responses — structured block arrays keyed by pattern match ──

interface BlockDef {
  type: BlockType;
  content: string;
  checked?: boolean;
  deliverableData?: Block["deliverableData"];
  tableData?: Block["tableData"];
  accordionData?: Block["accordionData"];
}

const RESPONSES: { pattern: RegExp; blocks: BlockDef[] }[] = [
  {
    pattern: /payment\s*schedule|invoice\s*schedule|billing/i,
    blocks: [
      { type: "h2", content: "Payment Schedule" },
      { type: "callout", content: "Project total based on scope — milestone-based billing, net 15 terms." },
      { type: "table", content: "", tableData: { rows: [["Milestone", "Amount", "Due", "Status"], ["Discovery & Strategy", "$3,000", "Week 2", "Pending"], ["Design Concepts", "$3,500", "Week 4", "Pending"], ["Development Sprint", "$4,000", "Week 8", "Pending"], ["Launch & Handoff", "$1,500", "Week 10", "Pending"]] } },
      { type: "callout", content: "Late payments subject to 1.5% monthly interest. All amounts in USD." },
    ],
  },
  {
    pattern: /timeline|roadmap|project\s*plan|rebrand/i,
    blocks: [
      { type: "h2", content: "Project Timeline" },
      { type: "callout", content: "Estimated 10-week engagement. Dates shift based on client feedback turnaround." },
      { type: "h3", content: "Phase 1 — Discovery" },
      { type: "todo", content: "Stakeholder interviews & brand audit", checked: false },
      { type: "todo", content: "Competitive landscape analysis", checked: false },
      { type: "todo", content: "Strategy brief & positioning", checked: false },
      { type: "h3", content: "Phase 2 — Creative" },
      { type: "todo", content: "Moodboard & direction exploration", checked: false },
      { type: "todo", content: "Logo concepts (3 directions)", checked: false },
      { type: "todo", content: "Color palette & typography", checked: false },
      { type: "todo", content: "Brand guidelines v1", checked: false },
      { type: "h3", content: "Phase 3 — Execution" },
      { type: "todo", content: "Collateral templates", checked: false },
      { type: "todo", content: "Social media kit", checked: false },
      { type: "todo", content: "Website style guide", checked: false },
      { type: "h3", content: "Phase 4 — Handoff" },
      { type: "todo", content: "Final asset package", checked: false },
      { type: "todo", content: "Brand guidelines v2 (final)", checked: false },
      { type: "todo", content: "Team walkthrough session", checked: false },
    ],
  },
  {
    pattern: /proposal|pitch|scope\s*of\s*work|sow/i,
    blocks: [
      { type: "h1", content: "Project Proposal" },
      { type: "paragraph", content: "Thank you for the opportunity to work together. Below is a summary of scope, deliverables, and investment." },
      { type: "h2", content: "Objective" },
      { type: "paragraph", content: "Define and execute a cohesive brand identity that positions your company for growth in the next 12 months." },
      { type: "h2", content: "Scope" },
      { type: "bullet", content: "Brand strategy & positioning" },
      { type: "bullet", content: "Visual identity system (logo, color, typography)" },
      { type: "bullet", content: "Brand guidelines document" },
      { type: "bullet", content: "Collateral templates (business card, letterhead, deck)" },
      { type: "bullet", content: "Social media templates (5 formats)" },
      { type: "h2", content: "Timeline" },
      { type: "paragraph", content: "8–10 weeks from kickoff, subject to feedback turnaround." },
      { type: "h2", content: "Investment" },
      { type: "table", content: "", tableData: { rows: [["Phase", "Deliverable", "Cost"], ["Discovery", "Strategy & positioning", "$3,000"], ["Creative", "Identity system", "$4,500"], ["Execution", "Templates & collateral", "$2,500"], ["", "Total", "$10,000"]] } },
      { type: "h2", content: "Terms" },
      { type: "bullet", content: "50% deposit to begin, 50% on delivery" },
      { type: "bullet", content: "2 rounds of revisions included per phase" },
      { type: "bullet", content: "Additional revisions billed at $125/hr" },
      { type: "divider", content: "" },
      { type: "paragraph", content: "Looking forward to creating something great together." },
    ],
  },
  {
    pattern: /meeting\s*notes|standup|recap|retro/i,
    blocks: [
      { type: "h2", content: "Meeting Notes" },
      { type: "callout", content: "Date: [today] · Attendees: [names] · Duration: [time]" },
      { type: "h3", content: "Agenda" },
      { type: "numbered", content: "Project status update" },
      { type: "numbered", content: "Blockers & dependencies" },
      { type: "numbered", content: "Next steps & action items" },
      { type: "h3", content: "Discussion" },
      { type: "paragraph", content: "" },
      { type: "h3", content: "Action Items" },
      { type: "todo", content: "[Action] — Owner: [name] — Due: [date]", checked: false },
      { type: "todo", content: "[Action] — Owner: [name] — Due: [date]", checked: false },
      { type: "todo", content: "[Action] — Owner: [name] — Due: [date]", checked: false },
      { type: "h3", content: "Next Meeting" },
      { type: "paragraph", content: "[Date & time] — [Topic]" },
    ],
  },
  {
    pattern: /contract|agreement|terms|nda/i,
    blocks: [
      { type: "h1", content: "Service Agreement" },
      { type: "paragraph", content: "This agreement is entered into between [Your Name/Company] (\"Provider\") and [Client Name] (\"Client\")." },
      { type: "h2", content: "1. Scope of Services" },
      { type: "paragraph", content: "Provider agrees to deliver the following services as outlined in the attached project proposal:" },
      { type: "bullet", content: "[Service 1]" },
      { type: "bullet", content: "[Service 2]" },
      { type: "bullet", content: "[Service 3]" },
      { type: "h2", content: "2. Compensation" },
      { type: "paragraph", content: "Client agrees to pay Provider a total of $[amount], payable in milestones as defined in the payment schedule." },
      { type: "h2", content: "3. Timeline" },
      { type: "paragraph", content: "Work begins on [date] with an estimated completion of [date]. Delays caused by Client feedback extend the timeline accordingly." },
      { type: "h2", content: "4. Revisions" },
      { type: "paragraph", content: "Two (2) rounds of revisions are included per deliverable. Additional revisions billed at $[rate]/hour." },
      { type: "h2", content: "5. Ownership & IP" },
      { type: "paragraph", content: "Upon full payment, all deliverables and intellectual property transfer to Client. Provider retains the right to display work in portfolio." },
      { type: "h2", content: "6. Termination" },
      { type: "paragraph", content: "Either party may terminate with 14 days written notice. Client pays for all completed work up to termination date." },
      { type: "divider", content: "" },
      { type: "paragraph", content: "Agreed and accepted:" },
      { type: "paragraph", content: "Provider: _____________________ Date: _________" },
      { type: "paragraph", content: "Client: _______________________ Date: _________" },
    ],
  },
];

// Fallback — build a contextual scaffold from the prompt
function getFallbackBlocks(prompt: string): BlockDef[] {
  const p = prompt.toLowerCase();
  const title = prompt.charAt(0).toUpperCase() + prompt.slice(1);
  const blocks: BlockDef[] = [{ type: "h1", content: title }];

  // Detect intent keywords and build appropriate structure
  const hasClient = /for\s+(\w[\w\s]*?)(?:\s*[-–—]|\s*$|,)/i.exec(prompt);
  const hasAmount = /\$[\d,]+/.exec(prompt);

  if (hasClient) {
    blocks.push({ type: "callout", content: `Client: ${hasClient[1].trim()}${hasAmount ? ` · Budget: ${hasAmount[0]}` : ""}` });
  }

  // Graph/chart requests
  if (p.includes("graph") || p.includes("chart") || p.includes("visualization") || p.includes("plot") || p.includes("visualize")) {
    const graphType = p.includes("line") || p.includes("trend") ? "line"
      : p.includes("donut") || p.includes("pie") || p.includes("breakdown") || p.includes("distribution") ? "donut"
      : p.includes("horizontal") || p.includes("compare") ? "horizontal-bar"
      : p.includes("metric") || p.includes("kpi") || p.includes("stats") || p.includes("dashboard") ? "metric-cards"
      : "bar";

    blocks.push(
      { type: "graph" as BlockType, content: "", graphType, graphTitle: title, graphData: [
        { label: "Week 1", value: 12 }, { label: "Week 2", value: 18 },
        { label: "Week 3", value: 15 }, { label: "Week 4", value: 22 },
        { label: "Week 5", value: 28 }, { label: "Week 6", value: 20 },
      ] } as unknown as BlockDef,
      { type: "paragraph", content: "Sample data shown — replace with your actual values by clicking the chart." }
    );
    return blocks;
  }

  // Rate/pricing requests
  if (p.includes("rate") || p.includes("pricing") || p.includes("hourly")) {
    blocks.push(
      { type: "money" as BlockType, content: "", moneyType: "rate-calc" } as unknown as BlockDef,
      { type: "paragraph", content: "Adjust the values above to calculate your ideal rate." }
    );
    return blocks;
  }

  // Expense requests
  if (p.includes("expense") || p.includes("cost") || p.includes("spending")) {
    blocks.push(
      { type: "money" as BlockType, content: "", moneyType: "expense" } as unknown as BlockDef
    );
    return blocks;
  }

  // Tax requests
  if (p.includes("tax") || p.includes("quarterly")) {
    blocks.push(
      { type: "money" as BlockType, content: "", moneyType: "tax-estimate" } as unknown as BlockDef
    );
    return blocks;
  }

  if (p.includes("email") || p.includes("message") || p.includes("reply") || p.includes("follow up")) {
    blocks.push(
      { type: "paragraph", content: "Hi [Name]," },
      { type: "paragraph", content: "" },
      { type: "paragraph", content: "Thank you for [context]. I wanted to follow up on [topic]." },
      { type: "paragraph", content: "" },
      { type: "paragraph", content: "Here's what I'm thinking for next steps:" },
      { type: "bullet", content: "[Next step 1]" },
      { type: "bullet", content: "[Next step 2]" },
      { type: "paragraph", content: "" },
      { type: "paragraph", content: "Let me know your thoughts. Happy to jump on a quick call if easier." },
      { type: "paragraph", content: "" },
      { type: "paragraph", content: "Best," },
      { type: "paragraph", content: "[Your name]" },
    );
  } else if (p.includes("checklist") || p.includes("list") || p.includes("tasks")) {
    blocks.push(
      { type: "callout", content: "Check off items as you complete them." },
      { type: "h3", content: "Priority" },
      { type: "todo", content: "", checked: false },
      { type: "todo", content: "", checked: false },
      { type: "todo", content: "", checked: false },
      { type: "h3", content: "Secondary" },
      { type: "todo", content: "", checked: false },
      { type: "todo", content: "", checked: false },
      { type: "todo", content: "", checked: false },
      { type: "h3", content: "Nice to Have" },
      { type: "todo", content: "", checked: false },
      { type: "todo", content: "", checked: false },
    );
  } else if (p.includes("brief") || p.includes("spec") || p.includes("requirements")) {
    blocks.push(
      { type: "h2", content: "Background" },
      { type: "paragraph", content: "" },
      { type: "h2", content: "Objectives" },
      { type: "numbered", content: "" },
      { type: "numbered", content: "" },
      { type: "numbered", content: "" },
      { type: "h2", content: "Requirements" },
      { type: "h3", content: "Must Have" },
      { type: "bullet", content: "" },
      { type: "bullet", content: "" },
      { type: "h3", content: "Nice to Have" },
      { type: "bullet", content: "" },
      { type: "h2", content: "Timeline" },
      { type: "paragraph", content: "" },
      { type: "h2", content: "Budget" },
      { type: "paragraph", content: hasAmount ? hasAmount[0] : "" },
    );
  } else if (p.includes("onboarding") || p.includes("welcome") || p.includes("kickoff")) {
    blocks.push(
      { type: "callout", content: "Welcome! This doc covers everything you need to get started." },
      { type: "h2", content: "About Us" },
      { type: "paragraph", content: "" },
      { type: "h2", content: "How We Work" },
      { type: "bullet", content: "Communication: [Slack/Email/etc.]" },
      { type: "bullet", content: "Meetings: [frequency]" },
      { type: "bullet", content: "Deliverables: [where/how]" },
      { type: "h2", content: "What We Need From You" },
      { type: "todo", content: "Brand assets (logos, fonts, colors)", checked: false },
      { type: "todo", content: "Access credentials", checked: false },
      { type: "todo", content: "Point of contact", checked: false },
      { type: "h2", content: "Next Steps" },
      { type: "numbered", content: "Kick-off call — [date]" },
      { type: "numbered", content: "Review first deliverable — [date]" },
      { type: "numbered", content: "Feedback round — [date]" },
    );
  } else if (p.includes("invoice") || p.includes("receipt")) {
    blocks.push(
      { type: "table", content: "", tableData: { rows: [["Description", "Qty", "Rate", "Amount"], ["[Service]", "1", hasAmount ? hasAmount[0] : "$0", hasAmount ? hasAmount[0] : "$0"]] } },
      { type: "divider", content: "" },
      { type: "paragraph", content: "Payment due within 15 days of receipt." },
      { type: "paragraph", content: "Payment methods: Bank transfer, Stripe, PayPal." },
    );
  } else {
    // Generic but useful scaffold
    blocks.push(
      { type: "paragraph", content: "" },
      { type: "h2", content: "Overview" },
      { type: "paragraph", content: "" },
      { type: "h2", content: "Details" },
      { type: "bullet", content: "" },
      { type: "bullet", content: "" },
      { type: "bullet", content: "" },
      { type: "h2", content: "Action Items" },
      { type: "todo", content: "", checked: false },
      { type: "todo", content: "", checked: false },
      { type: "todo", content: "", checked: false },
      { type: "divider", content: "" },
      { type: "paragraph", content: "" },
    );
  }

  return blocks;
}

function matchResponse(prompt: string): BlockDef[] {
  for (const r of RESPONSES) {
    if (r.pattern.test(prompt)) return r.blocks;
  }
  return getFallbackBlocks(prompt);
}

interface AiBlockProps {
  blockId: string;
  onGenerate: (blockId: string, blocks: Block[]) => void;
}

export default function AiBlock({ blockId, onGenerate }: AiBlockProps) {
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<"input" | "thinking" | "streaming">("input");
  const [thinkLines, setThinkLines] = useState<string[]>([]);
  const [streamedCount, setStreamedCount] = useState(0);
  const [generatedBlocks, setGeneratedBlocks] = useState<BlockDef[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const thinkRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const THINK_LINES = [
    "analyzing prompt...",
    "identifying structure...",
    "selecting block types...",
    "composing content...",
    "formatting output...",
  ];

  const streamBlocks = (blockDefs: BlockDef[]) => {
    setGeneratedBlocks(blockDefs);
    setPhase("streaming");
    let blockIdx = 0;
    const streamInterval = setInterval(() => {
      if (blockIdx < blockDefs.length) {
        setStreamedCount(blockIdx + 1);
        blockIdx++;
      } else {
        clearInterval(streamInterval);
        setTimeout(() => {
          const realBlocks: Block[] = blockDefs.map(def => {
            const block: Block = {
              id: uid(),
              type: def.type,
              content: def.content,
              checked: def.checked || false,
              tableData: def.tableData,
              accordionData: def.accordionData,
              deliverableData: def.deliverableData,
            };

            // Map graph blocks from API response
            const d = def as unknown as Record<string, unknown>;
            if (def.type === "graph" && d.graphType) {
              // Map API graphType names to internal GraphType
              const typeMap: Record<string, string> = {
                "bar": "bar", "line": "line", "donut": "donut",
                "horizontal-bar": "hbar", "hbar": "hbar",
                "sparkline": "sparkline", "stacked-area": "area", "area": "area",
                "metric-cards": "metrics", "metrics": "metrics",
              };
              block.graphData = {
                graphType: (typeMap[d.graphType as string] || "bar") as Block["graphData"] extends { graphType: infer T } ? T : never,
                title: (d.graphTitle as string) || (d.title as string) || "Chart",
                data: d.graphData || d.data || [],
              };
            }

            // Map money blocks from API response
            if (def.type === "money" && d.moneyType) {
              const moneyTypeMap: Record<string, string> = {
                "rate-calc": "rate-calc", "rate-calculator": "rate-calc", "rate": "rate-calc",
                "pay-schedule": "pay-schedule", "payment-schedule": "pay-schedule",
                "expense": "expense", "expenses": "expense",
                "milestone": "milestone", "milestone-payment": "milestone",
                "tax-estimate": "tax", "tax": "tax",
                "payment": "payment", "payment-button": "payment",
              };
              block.moneyData = { moneyType: (moneyTypeMap[d.moneyType as string] || "rate-calc") as MoneyBlockType, data: {} };
            }

            // Map deadline blocks
            if (def.type === "deadline" && d.deadlineData) {
              block.deadlineData = d.deadlineData as Block["deadlineData"];
            }

            // Map deliverable blocks
            if (def.type === "deliverable" && d.deliverableData) {
              block.deliverableData = d.deliverableData as Block["deliverableData"];
            }

            // Map accordion blocks
            if (def.type === "accordion" && d.accordionData) {
              block.accordionData = d.accordionData as Block["accordionData"];
            }

            // Map other data blocks
            if (d.mathData) block.mathData = d.mathData as Block["mathData"];
            if (d.swatchesData) block.swatchesData = d.swatchesData as Block["swatchesData"];
            if (d.bookmarkData) block.bookmarkData = d.bookmarkData as Block["bookmarkData"];
            if (d.pollData) block.pollData = d.pollData as Block["pollData"];
            if (d.handoffData) block.handoffData = d.handoffData as Block["handoffData"];

            return block;
          });
          onGenerate(blockId, realBlocks);
        }, 400);
      }
    }, 120);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setPhase("thinking");

    // Thinking animation
    let lineIdx = 0;
    thinkRef.current = setInterval(() => {
      if (lineIdx < THINK_LINES.length) {
        setThinkLines(prev => [...prev, THINK_LINES[lineIdx]]);
        lineIdx++;
      }
    }, 350);

    // Call the API
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (thinkRef.current) clearInterval(thinkRef.current);
      // Fill remaining think lines
      setThinkLines(THINK_LINES);

      if (res.ok) {
        const data = await res.json();
        if (data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
          streamBlocks(data.blocks as BlockDef[]);
          return;
        }
      }
      // API failed — fall back to local demo
      streamBlocks(matchResponse(prompt.trim()));
    } catch {
      // Network error — fall back to local demo
      if (thinkRef.current) clearInterval(thinkRef.current);
      setThinkLines(THINK_LINES);
      streamBlocks(matchResponse(prompt.trim()));
    }
  };

  useEffect(() => {
    return () => { if (thinkRef.current) clearInterval(thinkRef.current); };
  }, []);

  // ── Input phase ──
  if (phase === "input") {
    return (
      <div className={styles.block}>
        <div className={styles.inputWrap}>
          <div className={styles.inputHead}>
            <span className={styles.inputIcon}>◈</span>
            <span className={styles.inputLabel}>AI Generate</span>
          </div>
          <div className={styles.inputRow}>
            <span className={styles.prompt}>❯</span>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Describe what you need... (e.g. &quot;proposal for a $10k rebrand&quot;)"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") onGenerate(blockId, []);
              }}
            />
            <button className={styles.goBtn} onClick={handleSubmit} disabled={!prompt.trim()}>
              Generate
            </button>
          </div>
          <div className={styles.suggestions}>
            {["proposal for a rebrand", "payment schedule for $12k", "meeting notes", "project timeline", "service agreement", "client onboarding doc", "follow-up email", "project brief"].map(s => (
              <button key={s} className={styles.chip} onClick={() => { setPrompt(s); setTimeout(handleSubmit, 0); }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Thinking + Streaming phase ──
  return (
    <div className={styles.block}>
      <div className={styles.terminal}>
        <div className={styles.termHead}>
          <span className={styles.termIcon}>◈</span>
          <span className={styles.termLabel}>
            {phase === "thinking" ? "Generating..." : `Inserting ${streamedCount}/${generatedBlocks.length} blocks`}
          </span>
          {phase === "streaming" && (
            <div className={styles.termProgress}>
              <div className={styles.termProgressFill} style={{ width: `${(streamedCount / generatedBlocks.length) * 100}%` }} />
            </div>
          )}
        </div>
        <div className={styles.termPrompt}>
          <span className={styles.prompt}>❯</span>
          <span className={styles.termPromptText}>{prompt}</span>
        </div>
        <div className={styles.termOutput}>
          {thinkLines.map((line, i) => (
            <div key={i} className={styles.termLine}>
              <span className={styles.termCheck}>✓</span>
              <span>{line}</span>
            </div>
          ))}
          {phase === "streaming" && generatedBlocks.slice(0, streamedCount).map((b, i) => (
            <div key={i} className={styles.termBlock}>
              <span className={styles.termBlockType}>{b.type}</span>
              <span className={styles.termBlockContent}>{b.content ? (b.content.length > 60 ? b.content.slice(0, 60) + "..." : b.content) : "(data block)"}</span>
            </div>
          ))}
          {phase === "thinking" && <span className={styles.cursor}>_</span>}
        </div>
      </div>
    </div>
  );
}
