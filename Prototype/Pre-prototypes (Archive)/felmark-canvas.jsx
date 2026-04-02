import { useState, useRef, useCallback } from "react";

const CELL = 80;
const COLS = 8;
const GAP = 10;
const GRID_W = COLS * CELL + (COLS - 1) * GAP;

const INITIAL_BLOCKS = [
  { id: "b1", x: 0, y: 0, w: 2, h: 2, type: "revenue", label: "Revenue", color: "#6b9a6b", value: "$14,800", sub: "+12% this month" },
  { id: "b2", x: 2, y: 0, w: 2, h: 2, type: "outstanding", label: "Outstanding", color: "#c07a6a", value: "$9,600", sub: "3 invoices" },
  { id: "b3", x: 4, y: 0, w: 2, h: 2, type: "rate", label: "Effective Rate", color: "#8b8bba", value: "$108/hr", sub: "Target: $150" },
  { id: "b4", x: 6, y: 0, w: 2, h: 2, type: "goal", label: "Monthly Goal", color: "#b07d4f", value: "74%", sub: "of $20,000" },
  { id: "b5", x: 0, y: 2, w: 8, h: 1, type: "whisper", label: "AI Whisper", color: "#b07d4f" },
  { id: "b6", x: 0, y: 3, w: 4, h: 3, type: "tasks", label: "Active Tasks", color: "#8b8bba" },
  { id: "b7", x: 4, y: 3, w: 2, h: 3, type: "activity", label: "Activity Feed", color: "#b07d4f" },
  { id: "b8", x: 6, y: 3, w: 2, h: 3, type: "health", label: "Client Health", color: "#8b8bba" },
];

const BLOCK_TYPES = [
  { type: "revenue", label: "Revenue Counter", icon: "$", color: "#6b9a6b", defaultW: 2, defaultH: 2 },
  { type: "outstanding", label: "Outstanding", icon: "!", color: "#c07a6a", defaultW: 2, defaultH: 2 },
  { type: "tasks", label: "Task Board", icon: "⊞", color: "#8b8bba", defaultW: 3, defaultH: 3 },
  { type: "activity", label: "Activity Feed", icon: "◇", color: "#b07d4f", defaultW: 2, defaultH: 3 },
  { type: "health", label: "Client Health", icon: "♥", color: "#8b8bba", defaultW: 2, defaultH: 3 },
  { type: "timer", label: "Active Timer", icon: "▶", color: "#6b9a6b", defaultW: 2, defaultH: 2 },
  { type: "calendar", label: "Calendar", icon: "◎", color: "#8b8bba", defaultW: 3, defaultH: 3 },
  { type: "chat", label: "Quick Chat", icon: "✉", color: "#8b8bba", defaultW: 2, defaultH: 3 },
  { type: "invoices", label: "Invoice List", icon: "☰", color: "#6b9a6b", defaultW: 3, defaultH: 2 },
  { type: "files", label: "File Gallery", icon: "◻", color: "#b07d4f", defaultW: 2, defaultH: 2 },
  { type: "pipeline", label: "Pipeline", icon: "→", color: "#8b8bba", defaultW: 4, defaultH: 3 },
  { type: "automation", label: "Automations", icon: "⚡", color: "#b07d4f", defaultW: 3, defaultH: 2 },
  { type: "whisper", label: "AI Whisper", icon: "✦", color: "#b07d4f", defaultW: 8, defaultH: 1 },
  { type: "rate", label: "Rate Tracker", icon: "↗", color: "#8b8bba", defaultW: 2, defaultH: 2 },
  { type: "goal", label: "Goal Ring", icon: "◉", color: "#b07d4f", defaultW: 2, defaultH: 2 },
  { type: "note", label: "Sticky Note", icon: "◻", color: "#b5b2a9", defaultW: 2, defaultH: 2 },
];

function BlockContent({ block }) {
  const t = block.type;
  if (t === "whisper") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", height: "100%" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 500, color: "var(--ember)", background: "rgba(176,125,79,0.04)", padding: "3px 8px", borderRadius: 5, border: "1px solid rgba(176,125,79,0.04)" }}>✦ AI</span>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--ember)", flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "var(--ink-500)", flex: 1, lineHeight: 1.4 }}>Sarah hasn't responded to color palette in 2 days</span>
        <button style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "#fff", fontSize: 11, fontWeight: 500, fontFamily: "inherit", color: "var(--ink-600)", cursor: "pointer" }}>Send Nudge</button>
      </div>
    );
  }
  if (block.value) {
    const pct = t === "goal" ? parseInt(block.value) : t === "rate" ? 72 : null;
    return (
      <div style={{ padding: "20px 22px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)", textTransform: "uppercase", letterSpacing: ".06em" }}>{block.label}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: block.w >= 2 ? 34 : 24, fontWeight: 700, color: block.color, lineHeight: 1, marginTop: 6 }}>{block.value}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)", marginTop: 6 }}>{block.sub}</div>
        {pct && <div style={{ marginTop: 8, height: 4, background: "var(--border-light)", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: block.color, borderRadius: 2 }} /></div>}
      </div>
    );
  }
  const lines = t === "tasks" ? 5 : t === "activity" ? 6 : t === "health" ? 4 : 3;
  return (
    <div style={{ padding: "16px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-300)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>{block.label}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: block.color, opacity: 0.25 + (i < 2 ? 0.2 : 0), flexShrink: 0 }} />
            <div style={{ height: 4, borderRadius: 2, background: "var(--border-light)", flex: 1 }}><div style={{ height: "100%", borderRadius: 2, background: block.color, opacity: 0.08, width: `${65 + Math.sin(i * 1.8) * 25}%` }} /></div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", width: 24, textAlign: "right", flexShrink: 0 }}>{["2m", "3h", "1d", "2d", "5d", "1w"][i % 6]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Canvas() {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [editing, setEditing] = useState(false);
  const [ghostPos, setGhostPos] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [placingBlock, setPlacingBlock] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const canvasRef = useRef(null);

  const pixToGrid = useCallback((px, py) => {
    const col = Math.round(px / (CELL + GAP));
    const row = Math.round(py / (CELL + GAP));
    return { col: Math.max(0, Math.min(COLS - 1, col)), row: Math.max(0, row) };
  }, []);

  const blockRect = (b) => ({
    left: b.x * (CELL + GAP),
    top: b.y * (CELL + GAP),
    width: b.w * CELL + (b.w - 1) * GAP,
    height: b.h * CELL + (b.h - 1) * GAP,
  });

  const handleCanvasMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + canvasRef.current.scrollLeft;
    const y = e.clientY - rect.top + canvasRef.current.scrollTop;
    const cell = pixToGrid(x, y);
    setHoverCell(cell);
    if (placingBlock) {
      const def = BLOCK_TYPES.find(bt => bt.type === placingBlock);
      if (def) setGhostPos({ x: Math.min(cell.col, COLS - def.defaultW), y: cell.row, w: def.defaultW, h: def.defaultH });
    }
  };

  const handleCanvasClick = (e) => {
    if (placingBlock && ghostPos) {
      const def = BLOCK_TYPES.find(bt => bt.type === placingBlock);
      setBlocks(prev => [...prev, { id: `b${Date.now()}`, x: ghostPos.x, y: ghostPos.y, w: ghostPos.w, h: ghostPos.h, type: placingBlock, label: def?.label || placingBlock, color: def?.color || "#8b8bba" }]);
      setPlacingBlock(null);
      setGhostPos(null);
    }
  };

  const startPlacing = (type) => { setPlacingBlock(type); setShowLibrary(false); };
  const removeBlock = (id) => { setBlocks(prev => prev.filter(b => b.id !== id)); setSelectedBlock(null); };
  const maxRow = blocks.reduce((max, b) => Math.max(max, b.y + b.h), 0);
  const gridRows = Math.max(maxRow + 3, 10);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f2f0ec;--card:#fff;--card-tint:#f9f8fc;--border:#e8e5df;--border-light:#f0ede8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ink-200:#d0cdc6;--ember:#b07d4f;--ember-bg:rgba(176,125,79,0.04);--sage:#6b9a6b;--lavender:#8b8bba;--lavender-bg:rgba(139,139,186,0.04);--rose:#c07a6a;--mono:'JetBrains Mono',monospace}
.cv{font-family:'Outfit',sans-serif;background:var(--bg);height:100vh;display:flex;flex-direction:column;overflow:hidden}
.cv-top{height:48px;padding:0 20px;background:var(--card);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-shrink:0;z-index:20}
.cv-logo{display:flex;align-items:center;gap:7px}
.cv-mark{width:26px;height:26px;border-radius:7px;background:var(--ink-900);display:flex;align-items:center;justify-content:center;color:var(--ember);font-size:11px}
.cv-name{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900)}
.cv-sep{width:1px;height:18px;background:var(--border);margin:0 4px}
.cv-spaces{display:flex;gap:2px;flex:1}
.cv-space{padding:7px 16px;border-radius:7px;border:none;font-size:12px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:none;display:flex;align-items:center;gap:5px}
.cv-space:hover{background:var(--ember-bg);color:var(--ink-600)}
.cv-space.on{background:var(--ember-bg);color:var(--ink-900);font-weight:500}
.cv-space-add{padding:7px 12px;border-radius:7px;border:1px dashed var(--border);background:none;font-size:11px;color:var(--ink-300);cursor:pointer;font-family:inherit}
.cv-space-add:hover{border-color:var(--ember);color:var(--ember)}
.cv-actions{display:flex;gap:6px;flex-shrink:0}
.cv-btn{padding:7px 18px;border-radius:8px;border:1px solid var(--border);background:var(--card);font-size:12px;font-family:inherit;color:var(--ink-500);cursor:pointer;transition:all .1s;display:flex;align-items:center;gap:5px}
.cv-btn:hover{background:var(--border-light)}
.cv-btn.on{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.cv-btn.primary{background:var(--ember);color:#fff;border-color:var(--ember)}
.cv-btn.primary:hover{background:#c89360}
.cv-av{width:28px;height:28px;border-radius:7px;background:var(--ember);color:var(--card);font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;opacity:.7}
.cv-canvas{flex:1;overflow:auto;position:relative}
.cv-canvas::-webkit-scrollbar{width:8px;height:8px}
.cv-canvas::-webkit-scrollbar-thumb{background:var(--ink-200);border-radius:4px}
.cv-grid-container{position:relative;margin:24px auto;padding:0 24px}
.cv-dots{position:absolute;inset:0;pointer-events:none;z-index:0}
.cv-dot{position:absolute;border-radius:50%;transition:opacity .2s,transform .2s,background .2s}
.cv-block{position:absolute;border-radius:14px;background:var(--card);border:1px solid var(--border);overflow:hidden;transition:box-shadow .2s;z-index:2}
.cv-block:hover{box-shadow:0 8px 28px rgba(0,0,0,0.03)}
.cv-block.selected{border-color:var(--lavender);box-shadow:0 0 0 3px rgba(139,139,186,0.06)}
.cv-block.editing-block{border-style:dashed;border-color:var(--ink-200)}
.cv-block.editing-block:hover{border-color:var(--lavender)}
.cv-block-line{position:absolute;bottom:0;left:0;height:2px;width:0;z-index:5;transition:width .3s cubic-bezier(.16,1,.3,1);border-radius:0 0 14px 14px}
.cv-block:hover .cv-block-line{width:100%}
.cv-block-chrome{position:absolute;top:0;left:0;right:0;height:28px;background:rgba(255,255,255,.92);backdrop-filter:blur(6px);border-bottom:1px solid var(--border-light);display:flex;align-items:center;gap:4px;padding:0 8px;z-index:6;opacity:0;transition:opacity .1s}
.cv-block.editing-block .cv-block-chrome{opacity:1}
.cv-block-handle{cursor:grab;font-size:10px;color:var(--ink-300);padding:2px}
.cv-block-type{font-family:var(--mono);font-size:8px;color:var(--ink-400);flex:1}
.cv-block-size{font-family:var(--mono);font-size:8px;color:var(--ink-300);background:var(--border-light);padding:1px 5px;border-radius:3px}
.cv-block-edit-btn{width:20px;height:20px;border-radius:5px;border:1px solid var(--border);background:var(--card);color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px}
.cv-block-edit-btn:hover{background:var(--border-light);color:var(--ink-600)}
.cv-block-edit-btn.danger:hover{background:rgba(192,122,106,.04);color:var(--rose);border-color:rgba(192,122,106,.12)}
.cv-resize{position:absolute;z-index:7;opacity:0;transition:opacity .1s}
.cv-block.editing-block:hover .cv-resize{opacity:1}
.cv-resize-r{right:-4px;top:20%;bottom:20%;width:8px;cursor:ew-resize}
.cv-resize-b{bottom:-4px;left:20%;right:20%;height:8px;cursor:ns-resize}
.cv-resize-br{right:-4px;bottom:-4px;width:14px;height:14px;cursor:nwse-resize}
.cv-resize-dot{position:absolute;width:6px;height:6px;border-radius:50%;background:var(--lavender);border:2px solid var(--card);box-shadow:0 1px 3px rgba(0,0,0,0.08)}
.cv-resize-r .cv-resize-dot{right:1px;top:50%;transform:translateY(-50%)}
.cv-resize-b .cv-resize-dot{bottom:1px;left:50%;transform:translateX(-50%)}
.cv-resize-br .cv-resize-dot{right:1px;bottom:1px}
.cv-ghost{position:absolute;border-radius:14px;border:2px dashed var(--lavender);background:rgba(139,139,186,0.04);z-index:3;pointer-events:none;transition:left .08s,top .08s}
.cv-cell-hl{position:absolute;border-radius:8px;background:rgba(139,139,186,0.03);border:1px solid rgba(139,139,186,0.06);z-index:1;pointer-events:none;transition:left .06s,top .06s}
.cv-lib{position:fixed;top:48px;right:0;width:280px;height:calc(100vh - 48px);background:var(--card);border-left:1px solid var(--border);z-index:30;display:flex;flex-direction:column;box-shadow:-8px 0 30px rgba(0,0,0,0.03);animation:libIn .15s ease}
@keyframes libIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
.cv-lib-head{padding:16px 18px 12px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center}
.cv-lib-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900)}
.cv-lib-close{width:26px;height:26px;border-radius:6px;border:1px solid var(--border);background:var(--card);color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px}
.cv-lib-close:hover{background:var(--border-light)}
.cv-lib-hint{padding:8px 18px;font-size:11px;color:var(--ink-400);background:var(--lavender-bg);border-bottom:1px solid var(--border-light);line-height:1.5}
.cv-lib-list{flex:1;overflow-y:auto;padding:8px}
.cv-lib-list::-webkit-scrollbar{width:4px}
.cv-lib-list::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.cv-lib-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:all .1s;margin-bottom:2px}
.cv-lib-item:hover{background:var(--lavender-bg);transform:translateX(2px)}
.cv-lib-item-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;border:1px solid}
.cv-lib-item-name{font-size:13px;font-weight:500;color:var(--ink-700)}
.cv-lib-item-meta{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.cv-placing{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 20px;background:var(--ink-900);color:#fff;border-radius:10px;font-size:12px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 30px rgba(0,0,0,0.12);z-index:40;animation:plIn .15s ease}
@keyframes plIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.cv-placing-cancel{padding:4px 12px;border-radius:5px;border:1px solid rgba(255,255,255,.15);background:transparent;color:rgba(255,255,255,.6);font-size:11px;font-family:inherit;cursor:pointer}
.cv-foot{height:28px;padding:0 20px;border-top:1px solid var(--border);background:var(--card);display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0;z-index:20}
      `}</style>

      <div className="cv">
        <div className="cv-top">
          <div className="cv-logo"><div className="cv-mark">◆</div><span className="cv-name">Felmark</span></div>
          <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink-300)", background: "var(--border-light)", padding: "2px 8px", borderRadius: 4, border: "1px solid var(--border)" }}>WORKSPACE</span>
          <span className="cv-sep" />
          <div className="cv-spaces">
            <button className="cv-space on"><span>◆</span> Dashboard</button>
            <button className="cv-space"><span>◎</span> Triage</button>
            <button className="cv-space"><span>$</span> Revenue</button>
            <button className="cv-space-add">+ New Space</button>
          </div>
          <div className="cv-actions">
            <button className={`cv-btn${editing ? " on" : ""}`} onClick={() => { setEditing(!editing); setPlacingBlock(null); setGhostPos(null); setSelectedBlock(null); }}>{editing ? "✓ Done" : "✎ Edit Canvas"}</button>
            {editing && <button className="cv-btn primary" onClick={() => setShowLibrary(!showLibrary)}>+ Add Block</button>}
            <div className="cv-av">A</div>
          </div>
        </div>

        <div className="cv-canvas" ref={canvasRef} onMouseMove={handleCanvasMove} onClick={handleCanvasClick} style={{ cursor: placingBlock ? "crosshair" : "default" }}>
          <div className="cv-grid-container" style={{ width: GRID_W + 48, minHeight: gridRows * (CELL + GAP) + 48 }}>

            {/* Dot grid */}
            <div className="cv-dots">
              {Array.from({ length: (COLS + 1) * (gridRows + 1) }).map((_, i) => {
                const col = i % (COLS + 1);
                const row = Math.floor(i / (COLS + 1));
                const isEditing = editing || placingBlock;
                const isOccupied = blocks.some(b => col >= b.x && col <= b.x + b.w && row >= b.y && row <= b.y + b.h);
                return (
                  <div key={i} className="cv-dot" style={{
                    left: col * (CELL + GAP) - 1.5, top: row * (CELL + GAP) - 1.5,
                    width: isEditing ? 3 : 2, height: isEditing ? 3 : 2,
                    background: isEditing ? (isOccupied ? "rgba(139,139,186,0.06)" : "rgba(139,139,186,0.18)") : "rgba(0,0,0,0.04)",
                    transform: isEditing ? "scale(1)" : "scale(0.7)",
                  }} />
                );
              })}
            </div>

            {/* Cell highlight */}
            {(editing || placingBlock) && hoverCell && !placingBlock && (
              <div className="cv-cell-hl" style={{ left: hoverCell.col * (CELL + GAP), top: hoverCell.row * (CELL + GAP), width: CELL, height: CELL }} />
            )}

            {/* Ghost */}
            {placingBlock && ghostPos && (
              <div className="cv-ghost" style={{
                left: ghostPos.x * (CELL + GAP), top: ghostPos.y * (CELL + GAP),
                width: ghostPos.w * CELL + (ghostPos.w - 1) * GAP,
                height: ghostPos.h * CELL + (ghostPos.h - 1) * GAP,
              }}>
                <div style={{ padding: 12, fontFamily: "var(--mono)", fontSize: 10, color: "var(--lavender)" }}>
                  {BLOCK_TYPES.find(bt => bt.type === placingBlock)?.label}
                  <div style={{ fontSize: 8, color: "var(--ink-300)", marginTop: 2 }}>{ghostPos.w}×{ghostPos.h} · Click to place</div>
                </div>
              </div>
            )}

            {/* Blocks */}
            {blocks.map(block => {
              const rect = blockRect(block);
              const isSelected = selectedBlock === block.id;
              return (
                <div key={block.id} className={`cv-block${isSelected ? " selected" : ""}${editing ? " editing-block" : ""}`} style={rect}
                  onClick={(e) => { e.stopPropagation(); if (!placingBlock) setSelectedBlock(isSelected ? null : block.id); }}
                  onMouseEnter={() => setHoveredBlock(block.id)} onMouseLeave={() => setHoveredBlock(null)}>
                  {editing && (
                    <div className="cv-block-chrome">
                      <span className="cv-block-handle">⋮⋮</span>
                      <span className="cv-block-type">{block.label}</span>
                      <span className="cv-block-size">{block.w}×{block.h}</span>
                      <button className="cv-block-edit-btn" title="Configure">⚙</button>
                      <button className="cv-block-edit-btn danger" title="Remove" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}>✕</button>
                    </div>
                  )}
                  {editing && <>
                    <div className="cv-resize cv-resize-r"><div className="cv-resize-dot" /></div>
                    <div className="cv-resize cv-resize-b"><div className="cv-resize-dot" /></div>
                    <div className="cv-resize cv-resize-br"><div className="cv-resize-dot" /></div>
                  </>}
                  <BlockContent block={block} />
                  {!editing && <div className="cv-block-line" style={{ background: block.color }} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="cv-foot">
          <span>◆ {blocks.length} blocks · {COLS}-column grid · Dashboard</span>
          <span>{editing ? "✎ Editing — drag, resize, + to add" : "Powered by @felmark/forge"}</span>
        </div>
      </div>

      {showLibrary && (
        <div className="cv-lib">
          <div className="cv-lib-head"><span className="cv-lib-title">Space Blocks</span><button className="cv-lib-close" onClick={() => setShowLibrary(false)}>✕</button></div>
          <div className="cv-lib-hint">Click a block, then click on the canvas to place it.</div>
          <div className="cv-lib-list">
            {BLOCK_TYPES.map(bt => (
              <div key={bt.type} className="cv-lib-item" onClick={() => startPlacing(bt.type)}>
                <div className="cv-lib-item-icon" style={{ color: bt.color, background: bt.color + "06", borderColor: bt.color + "12" }}>{bt.icon}</div>
                <div><div className="cv-lib-item-name">{bt.label}</div><div className="cv-lib-item-meta">{bt.defaultW}×{bt.defaultH}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {placingBlock && (
        <div className="cv-placing">
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, opacity: .5 }}>PLACING</span>
          <span>{BLOCK_TYPES.find(bt => bt.type === placingBlock)?.label}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 10, opacity: .3 }}>Click grid to drop</span>
          <button className="cv-placing-cancel" onClick={() => { setPlacingBlock(null); setGhostPos(null); }}>Cancel</button>
        </div>
      )}
    </>
  );
}
