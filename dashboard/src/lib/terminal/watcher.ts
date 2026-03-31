/**
 * D1 — Document Context Watcher
 * Extracts a compressed document context from editor blocks for ambient AI analysis.
 * Keeps output under 500 tokens. Terminal NEVER modifies the document — observe only.
 */

export interface DocumentContext {
  docType: "proposal" | "contract" | "invoice" | "brief" | "notes";
  blockTypes: string[];
  textSummary: string;
  amounts: string[];
  clientName: string | null;
  projectName: string | null;
  projectStatus: string | null;
  projectDue: string | null;
  blocksUsed: string[];
  blocksMissing: string[];
}

/** Heuristic templates — what a "complete" document should contain */
const DOC_TEMPLATES: Record<string, string[]> = {
  proposal: ["h1", "paragraph", "money", "deliverable", "deadline", "signoff"],
  contract: ["h1", "paragraph", "money", "deadline", "signoff", "scope-boundary"],
  invoice: ["h1", "money", "table", "deadline"],
  brief: ["h1", "paragraph", "deliverable", "deadline", "todo"],
  notes: ["h1", "paragraph"],
};

/** Keywords that hint at document type from the first heading or content */
const DOC_TYPE_SIGNALS: Record<string, string[]> = {
  proposal: ["proposal", "quote", "estimate", "pricing", "scope of work"],
  contract: ["contract", "agreement", "terms", "binding", "clause"],
  invoice: ["invoice", "bill", "payment due", "remittance", "amount due"],
  brief: ["brief", "requirements", "objectives", "deliverables", "project plan"],
};

interface BlockLike {
  type?: string;
  content?: string;
  props?: Record<string, unknown>;
}

interface WorkspaceLike {
  client?: string;
}

interface ProjectLike {
  name?: string;
  status?: string;
  due?: string;
}

/**
 * Extract a tight context payload from editor blocks + workspace metadata.
 */
export function extractDocumentContext(
  blocks: BlockLike[],
  workspace: WorkspaceLike | null,
  project: ProjectLike | null
): DocumentContext {
  // Collect block types
  const blockTypes = [...new Set(blocks.map(b => b.type || "paragraph"))];

  // Extract all text content
  const textParts: string[] = [];
  for (const block of blocks) {
    if (block.content && typeof block.content === "string") {
      textParts.push(block.content);
    }
  }
  const fullText = textParts.join(" ");
  const textSummary = fullText.slice(0, 200);

  // Detect document type from h1 + content heuristics
  const h1Block = blocks.find(b => b.type === "h1");
  const h1Text = (h1Block?.content || "").toLowerCase();
  const firstChunk = fullText.slice(0, 500).toLowerCase();

  let docType: DocumentContext["docType"] = "notes";
  let bestScore = 0;
  for (const [type, keywords] of Object.entries(DOC_TYPE_SIGNALS)) {
    const score = keywords.filter(
      kw => h1Text.includes(kw) || firstChunk.includes(kw)
    ).length;
    if (score > bestScore) {
      bestScore = score;
      docType = type as DocumentContext["docType"];
    }
  }

  // If we have money/deliverable blocks but no keyword match, infer proposal
  if (bestScore === 0) {
    const hasMoneyBlocks = blockTypes.includes("money") || blockTypes.includes("pricing-config");
    const hasDeliverables = blockTypes.includes("deliverable");
    if (hasMoneyBlocks && hasDeliverables) docType = "proposal";
    else if (hasMoneyBlocks) docType = "invoice";
    else if (hasDeliverables) docType = "brief";
  }

  // Extract dollar amounts via regex
  const amountRegex = /\$[\d,]+(?:\.\d{2})?/g;
  const amounts = fullText.match(amountRegex) || [];

  // Figure out what blocks are used vs missing for this doc type
  const blocksUsed = blockTypes;
  const template = DOC_TEMPLATES[docType] || DOC_TEMPLATES.notes;
  const blocksMissing = template.filter(t => !blockTypes.includes(t));

  return {
    docType,
    blockTypes,
    textSummary,
    amounts: amounts.slice(0, 10), // cap at 10
    clientName: workspace?.client || null,
    projectName: project?.name || null,
    projectStatus: project?.status || null,
    projectDue: project?.due || null,
    blocksUsed,
    blocksMissing,
  };
}

/**
 * Hash a DocumentContext for change detection.
 * Returns a simple string hash — if two hashes match, the context hasn't changed.
 */
export function hashContext(ctx: DocumentContext): string {
  const key = [
    ctx.docType,
    ctx.blockTypes.join(","),
    ctx.textSummary.slice(0, 100),
    ctx.amounts.join(","),
    ctx.clientName || "",
    ctx.projectName || "",
    ctx.projectStatus || "",
    ctx.blocksMissing.join(","),
  ].join("|");

  // Simple djb2 hash
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) + hash + key.charCodeAt(i)) | 0;
  }
  return hash.toString(36);
}
