"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Block, BlockType, Workspace } from "@/lib/types";
import { convertBlock, insertAfter, removeBlock, needsPicker } from "@/forge";
import SlashMenu from "@/components/editor/slash-menu/SlashMenu";
import styles from "./ForgePaper.module.css";

interface ForgePaperProps {
  blocks: Block[];
  workspace?: Workspace | null;
  projectName: string;
  onClose: () => void;
  onBlocksChange?: (blocks: Block[]) => void;
}

function numberSections(blocks: Block[]): Map<string, number> {
  const map = new Map<string, number>();
  let n = 0;
  for (const b of blocks) { if (b.type === "h2") { n++; map.set(b.id, n); } }
  return map;
}

// Uses the shared SlashMenu component from the editor

// ── Paper block renderer ──
function PaperBlock({ block, sectionNum, isFocused, onFocus, onInput }: {
  block: Block; sectionNum?: number; isFocused: boolean; onFocus: () => void;
  onInput: (html: string, text: string) => void;
}) {
  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const el = e.currentTarget;
    onInput(el.innerHTML, el.textContent || "");
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    // Save content on blur — this is how typing persists
    onInput(e.currentTarget.innerHTML, e.currentTarget.textContent || "");
  };

  const editProps = { contentEditable: true, suppressContentEditableWarning: true, onFocus, onInput: handleInput, onBlur: handleBlur };

  switch (block.type) {
    case "h1": return <h1 className={styles.h1} {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "h2": return <h2 className={styles.h2} onFocus={onFocus}>{sectionNum !== undefined && <span className={styles.sectionNum}>{sectionNum}.</span>}<span {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} /></h2>;
    case "h3": return <h3 className={styles.h3} {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "paragraph": return <p className={styles.para} {...editProps} data-placeholder="Type / for blocks..." dangerouslySetInnerHTML={{ __html: block.content || "" }} />;
    case "bullet": return <div className={styles.bullet}><span className={styles.bulletDot} /><span {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} /></div>;
    case "numbered": return <div className={styles.numbered}><span {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} /></div>;
    case "todo": return <div className={`${styles.todo} ${block.checked ? styles.todoDone : ""}`}><span className={`${styles.todoCheck} ${block.checked ? styles.todoChecked : ""}`}>{block.checked && "✓"}</span><span {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} /></div>;
    case "quote": return <blockquote className={styles.quote} onFocus={onFocus}><div className={styles.quoteMark}>❝</div><div {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} /></blockquote>;
    case "callout": return <div className={styles.callout} {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "code": return <pre className={styles.code} {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} />;
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
      return block.content ? <p className={styles.para} {...editProps} dangerouslySetInnerHTML={{ __html: block.content }} /> : null;
  }
}

export default function ForgePaper({ blocks, workspace, projectName, onClose, onBlocksChange }: ForgePaperProps) {
  const [sent, setSent] = useState(false);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  const [draftLineY, setDraftLineY] = useState(-1);
  const [draftLineOn, setDraftLineOn] = useState(true);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [slashMenu, setSlashMenu] = useState<{ blockId: string; top: number; left: number } | null>(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const paperRef = useRef<HTMLDivElement>(null);

  const sectionNums = numberSections(blocks);
  const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const docId = useRef(`FM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`).current;

  // ── Draft line ──
  const updateDraftLine = useCallback(() => {
    if (!focusedBlock || !draftLineOn || !paperRef.current) { setDraftLineY(-1); return; }
    const el = paperRef.current.querySelector(`[data-block-id="${focusedBlock}"]`);
    if (!el) { setDraftLineY(-1); return; }
    const paperRect = paperRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setDraftLineY(elRect.bottom - paperRect.top);
  }, [focusedBlock, draftLineOn]);

  useEffect(() => { updateDraftLine(); }, [updateDraftLine, blocks]);

  useEffect(() => {
    if (!draftLineOn || !paperRef.current) return;
    const observer = new MutationObserver(updateDraftLine);
    observer.observe(paperRef.current, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [draftLineOn, updateDraftLine]);

  // ── Block operations (shared via forge) ──
  const addBlockAfter = (afterId: string, type: BlockType = "paragraph") => {
    const result = insertAfter(blocks, afterId, type);
    onBlocksChange?.(result.blocks);
    setTimeout(() => {
      setFocusedBlock(result.newBlockId);
      const el = paperRef.current?.querySelector(`[data-block-id="${result.newBlockId}"] [contenteditable]`) as HTMLElement;
      if (el) el.focus();
    }, 50);
  };

  const handleDeleteBlock = (blockId: string) => {
    const result = removeBlock(blocks, blockId);
    onBlocksChange?.(result.blocks);
    if (result.focusId) setFocusedBlock(result.focusId);
  };

  const handleBlockInput = (blockId: string, html: string, text: string) => {
    // Save content to blocks
    const updated = blocks.map(b => b.id === blockId ? { ...b, content: html } : b);
    onBlocksChange?.(updated);

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

    // Skip picker types — those need the full Editor UI
    if (needsPicker(type)) { setSlashMenu(null); return; }

    // Clear the slash text
    const el = paperRef.current?.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement;
    if (el) el.textContent = "";

    // Convert block using shared forge logic
    const result = convertBlock(blocks, blockId, type);
    onBlocksChange?.(result.blocks);
    if (result.newBlockId) {
      setTimeout(() => {
        setFocusedBlock(result.newBlockId!);
        const newEl = paperRef.current?.querySelector(`[data-block-id="${result.newBlockId}"] [contenteditable]`) as HTMLElement;
        if (newEl) newEl.focus();
      }, 50);
    }
    setSlashMenu(null);
  };

  // ── Keyboard: Enter to add block, Backspace to delete empty ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (slashMenu) return; // Let slash menu handle keys
      if (!focusedBlock) return;

      if (e.key === "Enter" && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (!target.closest?.("[contenteditable]")) return;
        // Don't intercept Enter in non-paragraph types that need it
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
  }, [focusedBlock, blocks, slashMenu]);

  // ── Outline ──
  const headings = blocks.filter(b => b.type === "h1" || b.type === "h2" || b.type === "h3");

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className={styles.topInfo}>
          <div className={styles.topTitle}>{projectName}<span className={styles.topBadge}>FORGE PAPER</span></div>
          <div className={styles.topSub}>{workspace?.client || "Document"} · {dateStr}</div>
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
        {/* Outline */}
        <div className={styles.outline}>
          <div className={styles.outlineLabel}>Outline</div>
          {headings.map(h => (
            <button key={h.id} className={`${styles.outlineItem} ${styles[`outlineItem_${h.type}`]} ${focusedBlock === h.id ? styles.outlineItemOn : ""}`}
              onClick={() => { setFocusedBlock(h.id); paperRef.current?.querySelector(`[data-block-id="${h.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>
              {sectionNums.has(h.id) && <span className={styles.outlineNum}>{sectionNums.get(h.id)}</span>}
              <span className={styles.outlineText} dangerouslySetInnerHTML={{ __html: h.content || "(empty)" }} />
            </button>
          ))}
          {headings.length === 0 && <div className={styles.outlineEmpty}>No headings yet</div>}
        </div>

        {/* Paper */}
        <div className={styles.scroll}>
          <div className={styles.paper} ref={paperRef}>
            {sent && <div className={styles.sentOverlay}><div className={styles.sentInner}><div className={styles.sentCheck}>✓</div><div className={styles.sentTitle}>Forge Paper sent</div><div className={styles.sentSub}>Your client will receive this document</div></div></div>}

            <div className={styles.header}>
              <div className={styles.headerGrid}>
                <div className={styles.headerLeft}><div className={styles.headerLogo}>{workspace?.avatar && <span className={styles.headerLogoMark} style={{ background: workspace.avatarBg }}>{workspace.avatar}</span>}<span className={styles.headerLogoText}>{workspace?.client || "Felmark"}</span></div></div>
                <div className={styles.headerRight}><div className={styles.headerMeta}><span>Date: {dateStr}</span><span>Document: {docId}</span></div></div>
              </div>
              <div className={styles.headerDivider} />
            </div>

            <div className={styles.body}>
              {blocks.map(block => {
                const isFocused = focusedBlock === block.id;
                const isHovered = hoveredBlock === block.id;
                return (
                  <div key={block.id} data-block-id={block.id}
                    className={`${styles.blockWrap} ${isFocused ? styles.blockWrapFocused : ""} ${isHovered && !isFocused ? styles.blockWrapHovered : ""}`}
                    onMouseEnter={() => setHoveredBlock(block.id)}
                    onMouseLeave={() => setHoveredBlock(null)}>
                    <div className={`${styles.blockChrome} ${isHovered || isFocused ? styles.blockChromeVisible : ""}`}>
                      <button className={styles.blockChromeBtn} title="Add block below" onClick={(e) => { e.stopPropagation(); addBlockAfter(block.id); }}>+</button>
                      <button className={styles.blockChromeBtn} title="Delete block" onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}>×</button>
                    </div>
                    <PaperBlock block={block} sectionNum={sectionNums.get(block.id)} isFocused={isFocused} onFocus={() => setFocusedBlock(block.id)} onInput={(html, text) => handleBlockInput(block.id, html, text)} />
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
