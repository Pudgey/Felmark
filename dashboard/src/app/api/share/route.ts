import { NextRequest, NextResponse } from "next/server";

// In-memory store — swap with Supabase later
// Keyed by shareId, with a reverse lookup from projectId → shareId
const shares = new Map<string, {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
  blocks: unknown[];
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  pin: string | null;
  views: number;
  lastViewedAt: string | null;
}>();

const projectToShare = new Map<string, string>(); // projectId → shareId

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, projectName, clientName, clientAvatar, clientColor, blocks, pin, expiresInDays } = body;

    if (!blocks || !Array.isArray(blocks) || !projectId) {
      return NextResponse.json({ error: "Missing blocks or projectId" }, { status: 400 });
    }

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : null;

    const existingShareId = projectToShare.get(projectId);

    if (existingShareId && shares.has(existingShareId)) {
      // Update existing share
      const existing = shares.get(existingShareId)!;
      existing.projectName = projectName || existing.projectName;
      existing.clientName = clientName || existing.clientName;
      existing.clientAvatar = clientAvatar || existing.clientAvatar;
      existing.clientColor = clientColor || existing.clientColor;
      existing.blocks = blocks;
      existing.updatedAt = new Date().toISOString();
      existing.expiresAt = expiresAt;
      existing.pin = pin || null;

      return NextResponse.json({ id: existingShareId, url: `/share/${existingShareId}`, updated: true });
    }

    // Create new share
    const id = generateId();
    shares.set(id, {
      id,
      projectId,
      projectName: projectName || "Untitled",
      clientName: clientName || "",
      clientAvatar: clientAvatar || "",
      clientColor: clientColor || "#b07d4f",
      blocks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt,
      pin: pin || null,
      views: 0,
      lastViewedAt: null,
    });
    projectToShare.set(projectId, id);

    return NextResponse.json({ id, url: `/share/${id}`, updated: false });
  } catch {
    return NextResponse.json({ error: "Failed to create share" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const projectId = searchParams.get("projectId");
  const pin = searchParams.get("pin");

  // Lookup by projectId — returns share metadata (for the modal to check if share exists)
  if (projectId) {
    const shareId = projectToShare.get(projectId);
    if (!shareId || !shares.has(shareId)) {
      return NextResponse.json({ exists: false });
    }
    const share = shares.get(shareId)!;
    return NextResponse.json({
      exists: true,
      id: shareId,
      url: `/share/${shareId}`,
      views: share.views,
      lastViewedAt: share.lastViewedAt,
      createdAt: share.createdAt,
      updatedAt: share.updatedAt,
      hasPin: !!share.pin,
    });
  }

  // Lookup by shareId — returns full share data (for the share page)
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const share = shares.get(id);
  if (!share) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
    return NextResponse.json({ error: "expired" }, { status: 410 });
  }

  if (share.pin && share.pin !== pin) {
    return NextResponse.json({ error: "pin_required", needsPin: true }, { status: 403 });
  }

  share.views++;
  share.lastViewedAt = new Date().toISOString();

  return NextResponse.json({
    projectName: share.projectName,
    clientName: share.clientName,
    clientAvatar: share.clientAvatar,
    clientColor: share.clientColor,
    blocks: share.blocks,
    createdAt: share.createdAt,
  });
}
