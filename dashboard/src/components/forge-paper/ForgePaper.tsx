"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Block, BlockType, Workstation } from "@/lib/types";
import { uid } from "@/lib/utils";
import { convertBlock, insertAfter, removeBlock } from "@/forge";
import AiBlock from "@/components/editor/ai/AiBlock";
import SlashMenu from "@/components/editor/slash-menu/SlashMenu";
import ForgePaperOutline from "./ForgePaperOutline";
import styles from "./ForgePaper.module.css";

const FORGE_PAPER_SLASH_TYPES: BlockType[] = [
  "paragraph",
  "h1",
  "h2",
  "h3",
  "bullet",
  "numbered",
  "todo",
  "quote",
  "code",
  "callout",
  "divider",
  "ai",
  "deliverable",
  "table",
  "signoff",
];

interface ForgePaperProps {
  initialBlocks: Block[];
  workstation?: Workstation | null;
  projectName: string;
  onClose: () => void;
  onSave: (blocks: Block[]) => void;
}

function mergeCachedContent(blocks: Block[], cache: Record<string, string>): Block[] {
  if (Object.keys(cache).length === 0) return blocks;
  return blocks.map(block => cache[block.id] !== undefined ? { ...block, content: cache[block.id] } : block);
}

function numberSections(blocks: Block[]): Map<string, number> {
  const map = new Map<string, number>();
  let n = 0;
  for (const b of blocks) { if (b.type === "h2") { n++; map.set(b.id, n); } }
  return map;
}

// ── Paper block renderer ──
// Uses ref-based content management to prevent dangerouslySetInnerHTML from
// overwriting live typing during React re-renders (Bug 1 fix).
function PaperBlock({ block, sectionNum, isFocused, onFocus, onInput, onBlurFlush }: {
  block: Block; sectionNum?: number; isFocused: boolean; onFocus: () => void;
  onInput: (html: string, text: string) => void;
  onBlurFlush: () => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elRef = useRef<any>(null);

  // Sync content from props ONLY when the block is not focused.
  // When focused, the user's live DOM is the source of truth.
  useEffect(() => {
    if (!elRef.current) return;
    if (isFocused) return;
    const newHtml = block.content || "";
    if (elRef.current.innerHTML !== newHtml) {
      elRef.current.innerHTML = newHtml;
    }
  }, [block.content, isFocused]);

  // Set initial content on mount
  useEffect(() => {
    if (elRef.current && !elRef.current.innerHTML && block.content) {
      elRef.current.innerHTML = block.content;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const el = e.currentTarget;
    onInput(el.innerHTML, el.textContent || "");
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    onInput(e.currentTarget.innerHTML, e.currentTarget.textContent || "");
    onBlurFlush();
  };

  const editProps = {
    ref: elRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onFocus,
    onInput: handleInput,
    onBlur: handleBlur,
  };

  switch (block.type) {
    case "h1": return <h1 className={styles.h1} {...editProps} />;
    case "h2": return <h2 className={styles.h2} data-section={sectionNum !== undefined ? `${sectionNum}` : undefined} {...editProps} />;
    case "h3": return <h3 className={styles.h3} {...editProps} />;
    case "paragraph": return <p className={styles.para} data-placeholder="Type / for blocks..." {...editProps} />;
    case "bullet": return <div className={styles.bullet}><span className={styles.bulletDot} /><span {...editProps} /></div>;
    case "numbered": return <div className={styles.numbered}><span {...editProps} /></div>;
    case "todo": return <div className={`${styles.todo} ${block.checked ? styles.todoDone : ""}`}><span className={`${styles.todoCheck} ${block.checked ? styles.todoChecked : ""}`}>{block.checked && "✓"}</span><span {...editProps} /></div>;
    case "quote": return <blockquote className={styles.quote}><div className={styles.quoteMark}>❝</div><div {...editProps} /></blockquote>;
    case "callout": return <div className={styles.callout} {...editProps} />;
    case "code": return <pre className={styles.code} {...editProps} />;
    case "divider": return block.content ? <div className={styles.labeledDivider}><span className={styles.labeledDividerText}>{block.content}</span></div> : <hr className={styles.divider} />;
    case "table":
      if (!block.tableData?.rows?.length) return null;
      const [header, ...body] = block.tableData.rows;
      return <div className={styles.tableWrap}><table className={styles.table}><thead><tr>{header.map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{body.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>)}</tbody></table></div>;
    case "deliverable":
      if (!block.deliverableData) return null;
      const d = block.deliverableData;
      return <div className={styles.deliverable}><div className={styles.deliverableHead}><span className={styles.deliverableStatus} style={{ color: d.status === "approved" ? "#5a9a3c" : "var(--ember)" }}>{d.status === "approved" ? "✓" : "○"}</span><span className={styles.deliverableTitle}>{d.title}</span>{d.dueDate && <span className={styles.deliverableDue}>{d.dueDate}</span>}</div>{d.description && <p className={styles.deliverableDesc}>{d.description}</p>}</div>;
    case "signoff":
      if (!block.signoffData) return null;
      const parties = block.signoffData.parties || [{ name: block.signoffData.signer || "Signer", role: "Party", signed: block.signoffData.signed, signedAt: block.signoffData.signedAt }];
      return <div className={styles.sigArea}><div className={styles.sigTitle}>Signatures</div><div className={styles.sigParties}>{parties.map((p, i) => <div key={i} className={styles.sigParty}><div className={styles.sigRole}>{p.role}</div>{p.signed ? <><div className={styles.sigSigned}>{p.name}</div><div className={styles.sigLine} /><div className={styles.sigName}>{p.name}</div><span className={styles.sigBadge}>✓ Signed</span></> : <div className={styles.sigPending}><div className={styles.sigPendingLine} /><div className={styles.sigPendingText}>Awaiting signature</div></div>}</div>)}</div></div>;
    default:
      return block.content ? <p className={styles.para} {...editProps} /> : null;
  }
}

export default function ForgePaper({ initialBlocks, workstation, projectName, onClose, onSave }: ForgePaperProps) {
  // ── ForgePaper owns its blocks state ──
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [sent, setSent] = useState(false);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  const [draftLineY, setDraftLineY] = useState(-1);
  const [draftLineOn, setDraftLineOn] = useState(true);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [slashMenu, setSlashMenu] = useState<{ blockId: string; top: number; left: number } | null>(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [docId] = useState(() => `FM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`);
  const paperRef = useRef<HTMLDivElement>(null);
  const contentCache = useRef<Record<string, string>>({});
  const outlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tracks content changes for the outline — debounced so it doesn't fire every keystroke
  const [contentVersion, setContentVersion] = useState(0);

  const sectionNums = numberSections(blocks);
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // ── Merge cache into blocks (local helper) ──
  const getWorkingBlocks = useCallback(() => mergeCachedContent(blocks, contentCache.current), [blocks]);

  // Outline reads cache-merged blocks, recomputed when blocks change OR content version ticks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const outlineBlocks = useMemo(() => mergeCachedContent(blocks, contentCache.current), [blocks, contentVersion]);

  // Flush cached content into local state
  const flushContent = useCallback(() => {
    const cache = contentCache.current;
    if (Object.keys(cache).length === 0) return;
    setBlocks(prev => mergeCachedContent(prev, cache));
    contentCache.current = {};
  }, []);

  // Auto-flush every 2 seconds while typing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Object.keys(contentCache.current).length > 0) flushContent();
    }, 2000);
    return () => clearInterval(interval);
  }, [flushContent]);

  // Clean up outline debounce timer
  useEffect(() => {
    return () => { if (outlineTimer.current) clearTimeout(outlineTimer.current); };
  }, []);

  // ── Save & close ──
  const handleSaveAndClose = useCallback(() => {
    const final = mergeCachedContent(blocks, contentCache.current);
    contentCache.current = {};
    onSave(final);
    onClose();
  }, [blocks, onClose, onSave]);

  // ── Draft line ──
  const updateDraftLine = useCallback(() => {
    if (!focusedBlock || !draftLineOn || !paperRef.current) { setDraftLineY(-1); return; }
    const el = paperRef.current.querySelector(`[data-block-id="${focusedBlock}"]`);
    if (!el) { setDraftLineY(-1); return; }
    const paperRect = paperRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setDraftLineY(elRect.bottom - paperRect.top);
  }, [focusedBlock, draftLineOn]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateDraftLine);
    return () => window.cancelAnimationFrame(frame);
  }, [updateDraftLine, blocks]);

  useEffect(() => {
    if (!draftLineOn || !paperRef.current) return;
    const observer = new MutationObserver(updateDraftLine);
    observer.observe(paperRef.current, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [draftLineOn, updateDraftLine]);

  const focusEditableBlock = useCallback((blockId: string) => {
    setFocusedBlock(blockId);
    const el = paperRef.current?.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement | null;
    if (!el) return;
    el.focus();
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  // ── Block operations (all local state) ──
  const addBlockAfter = useCallback((afterId: string, type: BlockType = "paragraph") => {
    flushContent();
    const result = insertAfter(getWorkingBlocks(), afterId, type);
    setBlocks(result.blocks);
    setTimeout(() => focusEditableBlock(result.newBlockId), 50);
  }, [flushContent, focusEditableBlock, getWorkingBlocks]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    flushContent();
    const result = removeBlock(getWorkingBlocks(), blockId);
    delete contentCache.current[blockId];
    setBlocks(result.blocks);
    if (result.focusId) setFocusedBlock(result.focusId);
  }, [flushContent, getWorkingBlocks]);

  const handleAiGenerate = useCallback((blockId: string, generatedBlocks: Block[]) => {
    delete contentCache.current[blockId];
    setBlocks(prev => {
      const idx = prev.findIndex(block => block.id === blockId);
      if (idx === -1) return prev;
      const next = [...prev];

      if (generatedBlocks.length === 0) {
        next[idx] = { ...next[idx], type: "paragraph", content: "" };
        setTimeout(() => focusEditableBlock(blockId), 50);
        return next;
      }

      next.splice(idx, 1, ...generatedBlocks);
      const trailingId = uid();
      contentCache.current[trailingId] = "";
      next.splice(idx + generatedBlocks.length, 0, {
        id: trailingId,
        type: "paragraph",
        content: "",
        checked: false,
      });
      setTimeout(() => focusEditableBlock(trailingId), 50);
      return next;
    });
  }, [focusEditableBlock]);

  const handleBlockInput = (blockId: string, html: string, text: string) => {
    contentCache.current[blockId] = html;

    // Debounced outline refresh — 300ms after last keystroke
    if (outlineTimer.current) clearTimeout(outlineTimer.current);
    outlineTimer.current = setTimeout(() => setContentVersion(v => v + 1), 300);

    // Detect slash command
    const rawText = text.replace(/[\u200B\uFEFF\xA0]/g, "").trim();
    if (rawText === "/" || (rawText.startsWith("/") && rawText.length <= 20)) {
      const el = paperRef.current?.querySelector(`[data-block-id="${blockId}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setSlashMenu({ blockId, top: rect.bottom + 4, left: rect.left });
        setSlashFilter(rawText === "/" ? "" : rawText.slice(1));
        setSlashIndex(0);
      }
    } else {
      if (slashMenu) setSlashMenu(null);
    }
  };

  const handleSlashSelect = (type: BlockType) => {
    if (!slashMenu) return;
    const { blockId } = slashMenu;

    if (!FORGE_PAPER_SLASH_TYPES.includes(type)) {
      setSlashMenu(null);
      return;
    }

    // Clear the slash text
    const el = paperRef.current?.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement;
    if (el) el.innerHTML = "";
    delete contentCache.current[blockId];

    // Convert block using shared forge logic
    const slashClearedBlocks = getWorkingBlocks().map(b => b.id === blockId ? { ...b, content: "" } : b);
    const result = convertBlock(slashClearedBlocks, blockId, type);
    setBlocks(result.blocks);
    const focusId = result.newBlockId ?? blockId;
    setTimeout(() => focusEditableBlock(focusId), 50);
    setSlashMenu(null);
  };

  // ── Keyboard: Enter to add block, Backspace to delete empty ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (slashMenu) return;
      if (!focusedBlock) return;

      if (e.key === "Enter" && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (!target.closest?.("[contenteditable]")) return;
        const block = blocks.find(b => b.id === focusedBlock);
        if (block && block.type === "code") return;
        e.preventDefault();
        addBlockAfter(focusedBlock);
      }

      if (e.key === "Backspace") {
        const target = e.target as HTMLElement;
        if (!target.closest?.("[contenteditable]")) return;
        const text = (target.textContent || "").replace(/[\u200B\uFEFF\xA0]/g, "").trim();
        if (text === "" && blocks.length > 1) {
          e.preventDefault();
          handleDeleteBlock(focusedBlock);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [addBlockAfter, blocks, focusedBlock, handleDeleteBlock, slashMenu]);

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={handleSaveAndClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className={styles.topInfo}>
          <div className={styles.topTitle}>{projectName}<span className={styles.topBadge}>FORGE PAPER</span></div>
          <div className={styles.topSub}>{workstation?.client || "Document"} · {dateStr}</div>
        </div>
        <div className={styles.topRight}>
          <div className={styles.draftToggle}>
            <span className={styles.draftToggleLabel}>Draft line</span>
            <button className={`${styles.draftToggleBtn} ${draftLineOn ? styles.draftToggleBtnOn : ""}`} onClick={() => setDraftLineOn(p => !p)}>
              <div className={styles.draftToggleDot} />
            </button>
          </div>
          <button className={styles.topBtn}>↓ PDF</button>
          {!sent ? <button className={`${styles.topBtn} ${styles.topBtnEmber}`} onClick={() => setSent(true)}>Send to Client →</button> : <button className={`${styles.topBtn} ${styles.topBtnSent}`}>✓ Sent</button>}
        </div>
      </div>

      <div className={styles.layout}>
        {/* Forge Paper dedicated outline */}
        <ForgePaperOutline
          blocks={outlineBlocks}
          focusedBlock={focusedBlock}
          hoveredBlock={hoveredBlock}
          onScrollTo={(id) => {
            setFocusedBlock(id);
            paperRef.current?.querySelector(`[data-block-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          onHoverSection={(id) => setHoveredBlock(id)}
          clientName={workstation?.client || "Client"}
        />

        {/* Paper */}
        <div className={styles.scroll}>
          <div className={styles.paper} ref={paperRef}>
            {sent && <div className={styles.sentOverlay}><div className={styles.sentInner}><div className={styles.sentCheck}>✓</div><div className={styles.sentTitle}>Forge Paper sent</div><div className={styles.sentSub}>Your client will receive this document</div></div></div>}

            <div className={styles.header}>
              <div className={styles.headerGrid}>
                <div className={styles.headerLeft}><div className={styles.headerLogo}>{workstation?.avatar && <span className={styles.headerLogoMark} style={{ background: workstation.avatarBg }}>{workstation.avatar}</span>}<span className={styles.headerLogoText}>{workstation?.client || "Felmark"}</span></div></div>
                <div className={styles.headerRight}><div className={styles.headerMeta}><span>Date: {dateStr}</span><span>Document: {docId}</span></div></div>
              </div>
              <div className={styles.headerDivider} />
            </div>

            <div className={styles.body}>
              {blocks.map((block, blockIdx) => {
                const isFocused = focusedBlock === block.id;
                const isHovered = hoveredBlock === block.id;
                // Insert page break every ~25 blocks (rough estimate for page height)
                const pageBreak = blockIdx > 0 && blockIdx % 25 === 0;
                if (block.type === "ai") {
                  return (
                    <div key={block.id}>
                      {pageBreak && (
                        <div className={styles.pageBreak}>
                          <span className={styles.pageBreakLabel}>Page {Math.floor(blockIdx / 25) + 1}</span>
                        </div>
                      )}
                      <div
                        data-block-id={block.id}
                        className={`${styles.blockWrap} ${isFocused ? styles.blockWrapFocused : ""} ${isHovered && !isFocused ? styles.blockWrapHovered : ""}`}
                        onMouseEnter={() => setHoveredBlock(block.id)}
                        onMouseLeave={() => setHoveredBlock(null)}
                      >
                        <div className={`${styles.blockChrome} ${isHovered || isFocused ? styles.blockChromeVisible : ""}`}>
                          <button className={styles.blockChromeBtn} title="Add block below" onClick={(e) => { e.stopPropagation(); addBlockAfter(block.id); }}>+</button>
                          <button className={styles.blockChromeBtn} title="Delete block" onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}>×</button>
                        </div>
                        <AiBlock blockId={block.id} onGenerate={handleAiGenerate} />
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={block.id}>
                    {pageBreak && (
                      <div className={styles.pageBreak}>
                        <span className={styles.pageBreakLabel}>Page {Math.floor(blockIdx / 25) + 1}</span>
                      </div>
                    )}
                    <div data-block-id={block.id}
                      className={`${styles.blockWrap} ${isFocused ? styles.blockWrapFocused : ""} ${isHovered && !isFocused ? styles.blockWrapHovered : ""}`}
                      onMouseEnter={() => setHoveredBlock(block.id)}
                      onMouseLeave={() => setHoveredBlock(null)}>
                      <div className={`${styles.blockChrome} ${isHovered || isFocused ? styles.blockChromeVisible : ""}`}>
                        <button className={styles.blockChromeBtn} title="Add block below" onClick={(e) => { e.stopPropagation(); addBlockAfter(block.id); }}>+</button>
                        <button className={styles.blockChromeBtn} title="Delete block" onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}>×</button>
                      </div>
                      <PaperBlock block={block} sectionNum={sectionNums.get(block.id)} isFocused={isFocused} onFocus={() => setFocusedBlock(block.id)} onInput={(html, text) => handleBlockInput(block.id, html, text)} onBlurFlush={flushContent} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerDivider} />
              <div className={styles.footerGrid}><span className={styles.footerForge}>⚒ Powered by @felmark/forge</span><span className={styles.footerDoc}>{docId} · {dateStr}</span></div>
            </div>

            {draftLineOn && draftLineY > 0 && <div className={styles.draftLine} style={{ top: draftLineY }}><div className={styles.draftLineInner} /><div className={styles.draftLineMarker}>▸</div></div>}
          </div>
        </div>
      </div>

      {/* Slash menu */}
      {slashMenu && (
        <SlashMenu
          top={slashMenu.top}
          left={slashMenu.left}
          filter={slashFilter}
          selectedIndex={slashIndex}
          allowedTypes={FORGE_PAPER_SLASH_TYPES}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenu(null)}
          onIndexChange={setSlashIndex}
        />
      )}

      <div className={styles.bottomBar}>
        <div className={styles.bottomLeft}><span className={styles.bottomDot} /><span>Forge Paper · {blocks.length} blocks</span></div>
        <span className={styles.bottomRight}>⚒ @felmark/forge</span>
      </div>
    </div>
  );
}
