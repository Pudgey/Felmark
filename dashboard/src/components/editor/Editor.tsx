"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Block, BlockType, GraphType, MoneyBlockType, Tab, Workspace } from "@/lib/types";
import GraphBlockComponent, { getDefaultGraphData, GRAPH_TYPE_OPTIONS } from "./graphs/GraphBlock";
import GraphDataEditor from "./graphs/GraphDataEditor";
import graphStyles from "./graphs/GraphBlock.module.css";
import MoneyBlockComponent, { getDefaultMoneyData, MONEY_TYPE_OPTIONS } from "./money/MoneyBlock";
import moneyStyles from "./money/MoneyBlock.module.css";
import DeliverableBlockComponent from "./deliverable/DeliverableBlock";
import ServicesPage from "../services/ServicesPage";
import { STATUS } from "@/lib/constants";
import { uid, cursorTo } from "@/lib/utils";
import EditableBlock from "./EditableBlock";
import SlashMenu from "./SlashMenu";
import FormatBar from "./FormatBar";
import CommandBar from "./CommandBar";
import CommandPalette from "./CommandPalette";
import ConversationPanel from "./ConversationPanel";
import CommentPanel, { type Comment as CommentType } from "../comments/CommentPanel";
import ActivityMargin, { type BlockActivity } from "../activity/ActivityMargin";
import HistoryModal from "../history/HistoryModal";
import TerminalWelcome from "./TerminalWelcome";
import EditorMargin from "./margin/EditorMargin";
import WorkspaceHome from "../workspace/WorkspaceHome";
import CalendarFull from "../calendar/CalendarFull";
import SearchPage from "../search/SearchPage";
import type { Project } from "@/lib/types";
import styles from "./Editor.module.css";

interface EditorProps {
  workspaces: Workspace[];
  tabs: Tab[];
  activeProject: string;
  blocks: Block[];
  sidebarOpen: boolean;
  wordCount: number;
  charCount: number;
  onOpenSidebar: () => void;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
  onTabRename: (id: string, name: string) => void;
  onBlocksChange: (projectId: string, blocks: Block[]) => void;
  onWordCountChange: (words: number, chars: number) => void;
  activeWorkspaceId?: string | null;
  onSelectProject?: (project: Project, client: string) => void;
  onNewWorkspace?: () => void;
  railActive?: string;
  onCalendarOpenProject?: (workspaceId: string) => void;
  calendarScrollTarget?: string | null;
  onCalendarScrollComplete?: () => void;
  onRenameWorkspace?: (wsId: string, name: string) => void;
  comments: CommentType[];
  onCommentsChange: (comments: CommentType[]) => void;
  activities: BlockActivity[];
  onActivitiesChange: (activities: BlockActivity[]) => void;
}

export default function Editor({ workspaces, tabs, activeProject, blocks: blocksProp, sidebarOpen, wordCount, charCount, onOpenSidebar, onTabClick, onTabClose, onNewTab, onTabRename, onBlocksChange, onWordCountChange, activeWorkspaceId, onSelectProject, onNewWorkspace, railActive, onCalendarOpenProject, calendarScrollTarget, onCalendarScrollComplete, onRenameWorkspace, comments, onCommentsChange, activities, onActivitiesChange }: EditorProps) {
  const [blocks, setBlocksLocal] = useState<Block[]>(blocksProp);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState("");
  const [hoverBlock, setHoverBlock] = useState<string | null>(null);
  const [slashMenu, setSlashMenu] = useState<{ blockId: string; top: number; left: number } | null>(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [formatBar, setFormatBar] = useState<{ top: number; left: number } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropId, setDropId] = useState<string | null>(null);
  const [cmdPalette, setCmdPalette] = useState(false);
  const [convoPanelOpen, setConvoPanelOpen] = useState(false);
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [commentHighlight, setCommentHighlight] = useState<string | null>(null);
  const [commentedBlocks, setCommentedBlocks] = useState<Set<string>>(new Set());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [graphPicker, setGraphPicker] = useState<{ blockId: string } | null>(null);
  const [editingGraphId, setEditingGraphId] = useState<string | null>(null);
  const [moneyPicker, setMoneyPicker] = useState<{ blockId: string } | null>(null);

  const blockElMap = useRef<Record<string, HTMLDivElement>>({});
  const editorRef = useRef<HTMLDivElement>(null);
  const contentCache = useRef<Record<string, string>>({});
  const manuallyRenamed = useRef<Set<string>>(new Set());

  const registerRef = useCallback((id: string, el: HTMLDivElement) => { blockElMap.current[id] = el; }, []);

  // Track tabs opened with a real name (sidebar) — they skip auto-naming
  const knownTabs = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const tab of tabs) {
      if (!knownTabs.current.has(tab.id)) {
        knownTabs.current.add(tab.id);
        if (tab.name !== "Untitled") manuallyRenamed.current.add(tab.id);
      }
    }
  }, [tabs]);

  // Sync blocks only when switching tabs (activeProject changes)
  const prevProjectRef = useRef(activeProject);
  useEffect(() => {
    if (prevProjectRef.current !== activeProject) {
      setBlocksLocal(blocksProp);
      contentCache.current = {};
      blockElMap.current = {};
      prevProjectRef.current = activeProject;
    }
  }, [activeProject, blocksProp]);

  // Propagate block changes to parent (deferred to avoid setState-during-render)
  const setBlocks = useCallback((updater: Block[] | ((prev: Block[]) => Block[])) => {
    setBlocksLocal(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      queueMicrotask(() => onBlocksChange(activeProject, next));
      return next;
    });
  }, [activeProject, onBlocksChange]);

  // ⌘K listener + ⌘⇧⌫ delete block
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdPalette(p => !p);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Backspace") {
        e.preventDefault();
        // Find which block is focused
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return;
        const entries = Object.entries(blockElMap.current);
        for (const [id, el] of entries) {
          if (el && el.contains(sel.anchorNode)) {
            deleteBlock(id);
            break;
          }
        }
      }
      if (e.key === "Escape") setCmdPalette(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    let t = "";
    blocks.forEach(b => {
      const c = contentCache.current[b.id] || b.content || "";
      const d = document.createElement("div");
      d.innerHTML = c;
      t += " " + d.textContent;
    });
    const w = t.trim();
    onWordCountChange(
      w.split(/\s+/).filter(x => x).length,
      w.length
    );
  }, [blocks, onWordCountChange]);

  const onContentChange = useCallback((id: string, html: string, text: string) => {
    contentCache.current[id] = html;

    // Auto-name: mirror first h1 text as tab name, unless user manually renamed via tab UI
    if (manuallyRenamed.current.has(activeProject)) return;
    const firstH1 = blocks.find(b => b.type === "h1");
    if (!firstH1 || firstH1.id !== id) return;
    const trimmed = text.trim();
    const currentTab = tabs.find(t => t.id === activeProject);
    if (!currentTab) return;
    const newName = trimmed || "Untitled";
    if (currentTab.name !== newName) onTabRename(activeProject, newName);
  }, [activeProject, blocks, tabs, onTabRename]);

  const onEnter = useCallback((id: string, bH: string, aH: string) => {
    contentCache.current[id] = bH;
    const nid = uid();
    contentCache.current[nid] = aH;
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      const bl = prev[idx];
      const carry = (["bullet", "numbered", "todo"] as BlockType[]).includes(bl.type) ? bl.type : "paragraph";
      const n = [...prev];
      n[idx] = { ...bl, content: bH };
      n.splice(idx + 1, 0, { id: nid, type: carry, content: aH, checked: false });
      return n;
    });
    setTimeout(() => {
      const el = blockElMap.current[nid];
      if (el) { el.innerHTML = aH; cursorTo(el, false); }
    }, 20);
  }, []);

  const onBackspace = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      const block = prev[idx];

      // Last block — reset to empty paragraph, don't delete
      if (prev.length <= 1) {
        if (block.type !== "paragraph") {
          contentCache.current[id] = "";
          setTimeout(() => {
            const el = blockElMap.current[id];
            if (el) { el.textContent = ""; cursorTo(el, false); }
          }, 20);
          return [{ ...block, type: "paragraph" as const, content: "", checked: false }];
        }
        return prev;
      }

      // Non-paragraph empty block — convert to paragraph first, don't delete
      if (block.type !== "paragraph" && block.type !== "divider") {
        contentCache.current[id] = "";
        setTimeout(() => {
          const el = blockElMap.current[id];
          if (el) { el.textContent = ""; cursorTo(el, false); }
        }, 20);
        return prev.map(b => b.id === id ? { ...b, type: "paragraph" as const, content: "", checked: false } : b);
      }

      // Paragraph or divider — delete and focus previous
      const n = prev.filter(b => b.id !== id);
      delete contentCache.current[id];
      setTimeout(() => {
        const el = blockElMap.current[n[Math.max(0, idx - 1)].id];
        if (el) cursorTo(el, true);
      }, 20);
      return n;
    });
  }, []);

  const onSlash = useCallback((blockId: string, filter?: string) => {
    const el = blockElMap.current[blockId];
    if (!el || !editorRef.current) return;
    const rect = el.getBoundingClientRect();
    const sr = editorRef.current.getBoundingClientRect();
    setSlashMenu({ blockId, top: rect.bottom - sr.top + editorRef.current.scrollTop + 4, left: rect.left - sr.left });
    setSlashFilter(filter || "");
    setSlashIndex(0);
  }, []);

  const selectSlashItem = useCallback((type: BlockType) => {
    if (!slashMenu) return;
    const { blockId } = slashMenu;
    const el = blockElMap.current[blockId];
    if (el) el.textContent = "";
    contentCache.current[blockId] = "";
    if (type === "graph") {
      setGraphPicker({ blockId });
      setSlashMenu(null);
      return;
    }
    if (type === "money") {
      setMoneyPicker({ blockId });
      setSlashMenu(null);
      return;
    }
    if (type === "deliverable") {
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = {
          ...n[idx], type: "deliverable", content: "",
          deliverableData: {
            title: "New Deliverable", description: "Describe what needs to be delivered...",
            status: "todo", assignee: "You", assigneeAvatar: "A", assigneeColor: "#b07d4f",
            dueDate: "—", files: [], comments: [], approvals: [],
          },
        };
        const nid = uid();
        contentCache.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        setTimeout(() => { const ne = blockElMap.current[nid]; if (ne) cursorTo(ne, false); }, 20);
        return n;
      });
      setSlashMenu(null);
      return;
    }
    if (type === "divider") {
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = { ...n[idx], type: "divider", content: "" };
        const nid = uid();
        contentCache.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        setTimeout(() => { const ne = blockElMap.current[nid]; if (ne) cursorTo(ne, false); }, 20);
        return n;
      });
    } else {
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, type, content: "" } : b));
      setTimeout(() => { if (el) cursorTo(el, false); }, 20);
    }
    setSlashMenu(null);
  }, [slashMenu]);

  const selectGraphType = useCallback((graphType: GraphType) => {
    if (!graphPicker) return;
    const { blockId } = graphPicker;
    const graphData = getDefaultGraphData(graphType);
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === blockId);
      const n = [...prev];
      n[idx] = { ...n[idx], type: "graph" as BlockType, content: "", graphData };
      const nid = uid();
      contentCache.current[nid] = "";
      n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
      setTimeout(() => { const ne = blockElMap.current[nid]; if (ne) cursorTo(ne, false); }, 20);
      return n;
    });
    setGraphPicker(null);
  }, [graphPicker]);

  const selectMoneyType = useCallback((moneyType: MoneyBlockType) => {
    if (!moneyPicker) return;
    const { blockId } = moneyPicker;
    const moneyData = getDefaultMoneyData(moneyType);
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === blockId);
      const n = [...prev];
      n[idx] = { ...n[idx], type: "money" as BlockType, content: "", moneyData };
      const nid = uid();
      contentCache.current[nid] = "";
      n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
      setTimeout(() => { const ne = blockElMap.current[nid]; if (ne) cursorTo(ne, false); }, 20);
      return n;
    });
    setMoneyPicker(null);
  }, [moneyPicker]);

  const handleSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim() || !editorRef.current) {
      setFormatBar(null);
      return;
    }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const sr = editorRef.current.getBoundingClientRect();
    setFormatBar({ top: rect.top - sr.top + editorRef.current.scrollTop - 42, left: rect.left - sr.left + rect.width / 2 - 90 });
  };

  const addBlockAfter = (afterId: string) => {
    const nid = uid();
    contentCache.current[nid] = "";
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === afterId);
      const n = [...prev];
      n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
      return n;
    });
    setTimeout(() => { const el = blockElMap.current[nid]; if (el) cursorTo(el, false); }, 20);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(prev => {
      // Last block — reset to empty paragraph instead of removing
      if (prev.length <= 1) {
        delete contentCache.current[blockId];
        const el = blockElMap.current[blockId];
        if (el) { el.textContent = ""; }
        return [{ id: prev[0].id, type: "paragraph" as const, content: "", checked: false }];
      }
      const idx = prev.findIndex(b => b.id === blockId);
      const n = prev.filter(b => b.id !== blockId);
      delete contentCache.current[blockId];
      // Focus the previous block (or next if deleting first)
      const focusIdx = Math.max(0, idx - 1);
      setTimeout(() => {
        const el = blockElMap.current[n[focusIdx]?.id];
        if (el) cursorTo(el, true);
      }, 20);
      return n;
    });
    // Clear editing states if the deleted block was being edited
    if (editingGraphId === blockId) setEditingGraphId(null);
  };

  const getNum = (bid: string) => {
    let c = 0;
    for (const b of blocks) { if (b.type === "numbered") c++; if (b.id === bid) return c; }
    return 1;
  };

  // --- Tab overflow detection ---
  const tabZoneRef = useRef<HTMLDivElement>(null);
  const [overflowCount, setOverflowCount] = useState(0);
  const [overflowOpen, setOverflowOpen] = useState(false);

  // Measure which tabs fit in the zone
  const measureOverflow = useCallback(() => {
    const zone = tabZoneRef.current;
    if (!zone) return;
    // Available width = zone width minus new-tab button (36px) minus overflow pill space
    const children = Array.from(zone.querySelectorAll('[data-tab]')) as HTMLElement[];
    if (children.length === 0) { setOverflowCount(0); return; }

    const zoneWidth = zone.clientWidth;
    // Reserve space for the new tab button (36px) and potential overflow pill (50px)
    const newTabWidth = 36;
    let usedWidth = newTabWidth;
    let fittingCount = 0;

    for (const child of children) {
      // Use min-width as the compressed size estimate
      const minW = child.dataset.active === "true" ? 140 : 100;
      if (usedWidth + minW <= zoneWidth) {
        usedWidth += minW;
        fittingCount++;
      } else {
        break;
      }
    }

    // If not all fit, account for overflow pill width
    if (fittingCount < children.length) {
      const pillWidth = 50;
      // Recount with pill space reserved
      usedWidth = newTabWidth + pillWidth;
      fittingCount = 0;
      for (const child of children) {
        const minW = child.dataset.active === "true" ? 140 : 100;
        if (usedWidth + minW <= zoneWidth) {
          usedWidth += minW;
          fittingCount++;
        } else {
          break;
        }
      }
    }

    const hidden = Math.max(0, children.length - fittingCount);
    setOverflowCount(hidden);
  }, []);

  useEffect(() => {
    measureOverflow();
  }, [tabs, measureOverflow]);

  useEffect(() => {
    const zone = tabZoneRef.current;
    if (!zone) return;
    const ro = new ResizeObserver(() => measureOverflow());
    ro.observe(zone);
    return () => ro.disconnect();
  }, [measureOverflow]);

  // Close overflow dropdown on outside click
  useEffect(() => {
    if (!overflowOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.overflowPill}`) && !target.closest(`.${styles.overflowDropdown}`)) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [overflowOpen]);

  // Compute visible vs. overflowed tabs
  // Active tab is always visible — reorder so it's in the visible set
  const visibleTabs = (() => {
    if (overflowCount === 0) return { visible: tabs, overflow: [] as Tab[] };
    const visibleCount = tabs.length - overflowCount;

    // Ensure active tab is in visible set
    const activeIdx = tabs.findIndex(t => t.active);
    const ordered = [...tabs];
    if (activeIdx >= visibleCount) {
      // Swap active tab into last visible slot
      const [active] = ordered.splice(activeIdx, 1);
      ordered.splice(visibleCount - 1, 0, active);
    }
    return {
      visible: ordered.slice(0, visibleCount),
      overflow: ordered.slice(visibleCount),
    };
  })();

  const activeTab = tabs.find(t => t.active);
  const activeWs = workspaces.find(w => w.projects.some(p => p.id === activeProject));

  const renderBlock = (block: Block) => {
    // Graph block — click to select, double-click to edit data
    if (block.type === "graph" && block.graphData) {
      const isEditing = editingGraphId === block.id;
      return (
        <div key={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          <div className={styles.gutter} style={{ opacity: hoverBlock === block.id ? 1 : 0 }}>
            <button className={styles.gutterBtn} onClick={() => addBlockAfter(block.id)}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <div className={`${styles.gutterBtn} ${styles.grip}`}>
              <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
            </div>
            <button className={`${styles.gutterBtn} ${styles.gutterDelete}`} onClick={() => deleteBlock(block.id)} title="Delete block">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <div
              onClick={() => { if (!isEditing) setEditingGraphId(block.id); }}
              style={{ cursor: isEditing ? "default" : "pointer", borderRadius: 10, outline: isEditing ? "2px solid var(--ember)" : "2px solid transparent", outlineOffset: 2, transition: "outline-color 0.12s" }}
            >
              <GraphBlockComponent graphData={block.graphData} />
            </div>
            {isEditing && (
              <GraphDataEditor
                graphData={block.graphData}
                onUpdate={(updated) => {
                  setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, graphData: updated } : b));
                }}
                onClose={() => setEditingGraphId(null)}
                onDelete={() => {
                  setEditingGraphId(null);
                  setBlocks(prev => {
                    if (prev.length <= 1) return [{ ...prev[0], type: "paragraph" as const, content: "", checked: false, graphData: undefined }];
                    return prev.filter(b => b.id !== block.id);
                  });
                }}
              />
            )}
          </div>
        </div>
      );
    }

    // Deliverable block
    if (block.type === "deliverable" && block.deliverableData) {
      return (
        <div key={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          <div className={styles.gutter} style={{ opacity: hoverBlock === block.id ? 1 : 0 }}>
            <button className={styles.gutterBtn} onClick={() => addBlockAfter(block.id)}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <div className={`${styles.gutterBtn} ${styles.grip}`}>
              <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
            </div>
            <button className={`${styles.gutterBtn} ${styles.gutterDelete}`} onClick={() => deleteBlock(block.id)} title="Delete block">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <DeliverableBlockComponent
              data={block.deliverableData}
              onChange={(updated) => {
                setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, deliverableData: updated } : b));
              }}
              onCommentAdded={(text) => {
                const newActivity = { blockId: block.id, editedBy: "u1", editedAt: "now", comment: { user: "u1", text, time: "now" } };
                onActivitiesChange([newActivity, ...activities]);
              }}
            />
          </div>
        </div>
      );
    }

    // Graph sub-picker — shown when user selected "Graph" from slash menu
    if (graphPicker && graphPicker.blockId === block.id && block.type !== "graph") {
      return (
        <div key={block.id} className={styles.blockRow}>
          <div className={styles.gutter} style={{ opacity: 0 }} />
          <div style={{ flex: 1 }}>
            <div className={graphStyles.gb}>
              <div className={graphStyles.gbHead}>
                <span className={graphStyles.gbTitle}>Choose a chart type</span>
                <button onClick={() => setGraphPicker(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-300)", fontSize: 14 }}>&times;</button>
              </div>
              <div className={graphStyles.subPicker}>
                {GRAPH_TYPE_OPTIONS.map(opt => (
                  <button key={opt.type} className={graphStyles.subPickerItem} onClick={() => selectGraphType(opt.type)}>
                    <span className={graphStyles.subPickerIcon}>{opt.icon}</span>
                    <span className={graphStyles.subPickerLabel}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Money block
    if (block.type === "money" && block.moneyData) {
      return (
        <div key={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          <div className={styles.gutter} style={{ opacity: hoverBlock === block.id ? 1 : 0 }}>
            <button className={styles.gutterBtn} onClick={() => addBlockAfter(block.id)}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <div className={`${styles.gutterBtn} ${styles.grip}`}>
              <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
            </div>
            <button className={`${styles.gutterBtn} ${styles.gutterDelete}`} onClick={() => deleteBlock(block.id)} title="Delete block">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <MoneyBlockComponent
              moneyData={block.moneyData}
              onUpdate={(updated) => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, moneyData: updated } : b))}
            />
          </div>
        </div>
      );
    }

    // Money sub-picker
    if (moneyPicker && moneyPicker.blockId === block.id && block.type !== "money") {
      return (
        <div key={block.id} className={styles.blockRow}>
          <div className={styles.gutter} style={{ opacity: 0 }} />
          <div style={{ flex: 1 }}>
            <div className={moneyStyles.mb}>
              <div className={moneyStyles.head}>
                <span className={moneyStyles.label}>Choose a money block</span>
                <button onClick={() => setMoneyPicker(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-300)", fontSize: 14 }}>&times;</button>
              </div>
              <div className={moneyStyles.subPicker}>
                {MONEY_TYPE_OPTIONS.map(opt => (
                  <button key={opt.type} className={moneyStyles.subPickerItem} onClick={() => selectMoneyType(opt.type)}>
                    <span className={moneyStyles.subPickerIcon}>{opt.icon}</span>
                    <span className={moneyStyles.subPickerLabel}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (block.type === "divider") {
      return (
        <div key={block.id} className={styles.blockRow} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
          <div className={styles.gutter} style={{ opacity: hoverBlock === block.id ? 1 : 0 }}>
            <button className={styles.gutterBtn} onClick={() => addBlockAfter(block.id)}>
              <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <div className={`${styles.gutterBtn} ${styles.grip}`}>
              <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
            </div>
            <button className={`${styles.gutterBtn} ${styles.gutterDelete}`} onClick={() => deleteBlock(block.id)} title="Delete block">
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div style={{ flex: 1, padding: "6px 0" }}><div className={styles.dividerLine} /></div>
        </div>
      );
    }

    const isH = block.type.startsWith("h");
    const isHovered = hoverBlock === block.id;
    return (
      <div key={block.id} className={`${styles.blockRow} ${dropId === block.id ? styles.dropTarget : ""}`} onMouseEnter={() => setHoverBlock(block.id)} onMouseLeave={() => setHoverBlock(null)}>
        <div className={styles.gutter} style={{ opacity: isHovered ? 1 : 0, marginTop: isH ? (block.type === "h1" ? 32 : block.type === "h2" ? 24 : 18) : 2 }}>
          <button className={styles.gutterBtn} onClick={() => addBlockAfter(block.id)}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div
            className={`${styles.gutterBtn} ${styles.grip}`}
            draggable
            onDragStart={e => { setDragId(block.id); e.dataTransfer.effectAllowed = "move"; }}
            onDragEnd={() => { setDragId(null); setDropId(null); }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="2.5" r="1" fill="currentColor"/><circle cx="7" cy="2.5" r="1" fill="currentColor"/><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="3" cy="11.5" r="1" fill="currentColor"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>
          </div>
        </div>

        {/* Block accent line */}
        <div className={styles.blockAccent} />

        <div
          style={{ display: "flex", alignItems: "flex-start", flex: 1 }}
          onDragOver={e => { e.preventDefault(); if (dragId && dragId !== block.id) setDropId(block.id); }}
          onDrop={e => {
            e.preventDefault();
            if (!dragId || dragId === block.id) return;
            setBlocks(prev => {
              const fi = prev.findIndex(b => b.id === dragId);
              const ti = prev.findIndex(b => b.id === block.id);
              const n = [...prev];
              const [m] = n.splice(fi, 1);
              n.splice(ti, 0, m);
              return n;
            });
            setDragId(null);
            setDropId(null);
          }}
        >
          {block.type === "bullet" && <span className={styles.prefix}>•</span>}
          {block.type === "numbered" && <span className={`${styles.prefix} ${styles.prefixNum}`}>{getNum(block.id)}.</span>}
          {block.type === "todo" && (
            <label className={styles.todoCheck}>
              <input type="checkbox" checked={block.checked} onChange={() => setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, checked: !b.checked } : b))} />
            </label>
          )}
          <div style={{
            flex: 1,
            ...(block.type === "callout" ? { display: "flex", gap: 8, background: "rgba(176,125,79,0.04)", borderRadius: 5, padding: "10px 14px", border: "1px solid rgba(176,125,79,0.08)" } : {}),
            ...(block.type === "quote" ? { borderLeft: "2px solid var(--warm-300)", paddingLeft: 16 } : {}),
          }}>
            {block.type === "callout" && <span style={{ fontSize: 15, flexShrink: 0, marginTop: 2, color: "var(--ember)" }}>◆</span>}
            <EditableBlock
              block={block}
              onContentChange={onContentChange}
              onEnter={onEnter}
              onBackspace={onBackspace}
              onSlash={onSlash}
              onSlashClose={() => setSlashMenu(null)}
              onSelect={handleSelect}
              registerRef={registerRef}
            />
          </div>

          {/* Comment icon — always visible if block has comments, otherwise on hover */}
          {(isHovered || commentedBlocks.has(block.id)) && (
            <button
              className={`${styles.blockCommentBtn} ${commentedBlocks.has(block.id) ? styles.blockCommentBtnActive : ""}`}
              title={commentedBlocks.has(block.id) ? "View comments" : "Add comment"}
              onClick={e => {
                e.stopPropagation();
                const el = blockElMap.current[block.id];
                const text = el?.textContent?.trim() || block.content;
                setCommentHighlight(text.slice(0, 80) + (text.length > 80 ? "…" : ""));
                setCommentPanelOpen(true);
                setCommentedBlocks(prev => new Set(prev).add(block.id));
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.5 9c0 .5-.4 1-.8 1H4.5l-2.5 2V3.5c0-.5.4-1 .8-1h8.4c.4 0 .8.5.8 1V9z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M4.5 5.5h5M4.5 7.5h3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" /></svg>
              {commentedBlocks.has(block.id) && <span className={styles.blockCommentDot} />}
            </button>
          )}
        </div>
      </div>
    );
  };

  const unreadTotal = 0;

  return (
    <div className={styles.main}>
      {/* Tab bar */}
      <div className={styles.tabbar}>
        {!sidebarOpen && (
          <button className={styles.sidebarToggle} onClick={onOpenSidebar} aria-label="Open sidebar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        )}
        <button className={`${styles.toolsBtn} ${convoPanelOpen ? styles.toolsBtnActive : ""}`} onClick={() => setConvoPanelOpen(p => !p)} title="Conversations" aria-label="Conversations">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2.5 3h11a1 1 0 011 1v7a1 1 0 01-1 1H5l-2.5 2V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M5.5 7h5M5.5 9.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          {!convoPanelOpen && unreadTotal > 0 && <span className={styles.toolsBadge}>{unreadTotal}</span>}
        </button>

        {/* Tab zone — shrinks tabs, overflows into pill */}
        <div className={styles.tabZone} ref={tabZoneRef}>
          {visibleTabs.visible.map(tab => (
            <div key={tab.id} data-tab data-active={tab.active ? "true" : "false"} className={`${styles.tab} ${tab.active ? styles.tabActive : ""}`} onClick={() => onTabClick(tab.id)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" /></svg>
              {editingTabId === tab.id ? (
                <input
                  className={styles.tabRenameInput}
                  value={editingTabName}
                  autoFocus
                  onChange={e => setEditingTabName(e.target.value)}
                  onBlur={() => { const n = editingTabName.trim() || "Untitled"; onTabRename(tab.id, n); if (n !== "Untitled") manuallyRenamed.current.add(tab.id); setEditingTabId(null); }}
                  onKeyDown={e => {
                    if (e.key === "Enter") { const n = editingTabName.trim() || "Untitled"; onTabRename(tab.id, n); if (n !== "Untitled") manuallyRenamed.current.add(tab.id); setEditingTabId(null); }
                    if (e.key === "Escape") setEditingTabId(null);
                  }}
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <span
                  style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                  onDoubleClick={e => { e.stopPropagation(); setEditingTabId(tab.id); setEditingTabName(tab.name); }}
                >
                  {tab.name}
                </span>
              )}
              <button className={styles.tabClose} onClick={e => { e.stopPropagation(); onTabClose(tab.id); }}>×</button>
            </div>
          ))}

          {/* Overflow pill */}
          {visibleTabs.overflow.length > 0 && (
            <div className={styles.overflowPill} onClick={() => setOverflowOpen(p => !p)}>
              +{visibleTabs.overflow.length}
              {overflowOpen && (
                <div className={styles.overflowDropdown}>
                  {visibleTabs.overflow.map(tab => (
                    <button
                      key={tab.id}
                      className={`${styles.overflowItem} ${tab.active ? styles.overflowItemActive : ""}`}
                      onClick={e => { e.stopPropagation(); onTabClick(tab.id); setOverflowOpen(false); }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" /></svg>
                      {tab.name}
                      <span className={styles.overflowClient}>{tab.client}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button className={styles.tabNew} title="New tab" onClick={onNewTab}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Sacred right column — never pushed by tabs */}
        <div className={styles.tabBarRight}>
          <button className={styles.tabBarAction} title="Notifications" aria-label="Notifications">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6.5a4 4 0 018 0v2.5l1.5 2H2.5L4 9V6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className={styles.tabBarBadge}>3</span>
          </button>
          <button className={`${styles.tabBarAction} ${commentPanelOpen ? styles.tabBarActionActive : ""}`} title="Comments" aria-label="Comments" onClick={() => setCommentPanelOpen(p => !p)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 10.5c0 .7-.5 1.2-1 1.2H5l-3 3V4.5c0-.7.5-1.2 1-1.2h9.5c.5 0 1 .5 1 1.2v6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M5.5 6.5h5M5.5 9h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>
          <button className={styles.tabBarAction} title="History" aria-label="Version history" onClick={() => setHistoryOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 5.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2.5 5.5L4 3.5M2.5 5.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className={styles.profileAvatar} title="Profile">A</div>
        </div>
      </div>

      {/* Breadcrumb — only show when a tab is active */}
      {tabs.some(t => t.active) && (
        <div className={styles.bread}>
          <button className={styles.breadNav}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <button className={styles.breadNav}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <span style={{ color: "var(--ink-400)", margin: "0 4px" }}>{activeWs?.client || "Workspace"}</span>
          <span style={{ color: "var(--warm-300)" }}>/</span>
          <span style={{ color: "var(--ink-700)", margin: "0 4px", fontWeight: 500 }}>{activeTab?.name || "Untitled"}</span>
          {(() => {
            const pj = workspaces.flatMap(w => w.projects).find(p => p.id === activeProject);
            if (!pj) return null;
            const st = STATUS[pj.status];
            return <span className={styles.breadStatus} style={{ background: `${st.color}12`, color: st.color, border: `1px solid ${st.color}20` }}>{st.label}</span>;
          })()}
        </div>
      )}

      {/* Editor + Conversation panel */}
      <div className={styles.editorRow}>
        {/* Conversation panel (left) */}
        <ConversationPanel open={convoPanelOpen} onClose={() => setConvoPanelOpen(false)} />

        <div className={styles.editorCol}>
          {railActive === "calendar" && (
            <CalendarFull workspaces={workspaces} onOpenProject={onCalendarOpenProject} scrollToProjectId={calendarScrollTarget} onScrollComplete={onCalendarScrollComplete} />
          )}
          {railActive === "search" && (
            <SearchPage workspaces={workspaces} />
          )}
          {railActive === "services" && (
            <ServicesPage />
          )}
          {railActive !== "calendar" && railActive !== "search" && railActive !== "services" && activeWorkspaceId && (() => {
            const ws = workspaces.find(w => w.id === activeWorkspaceId);
            return ws && onSelectProject ? (
              <WorkspaceHome workspace={ws} onSelectProject={onSelectProject} onNewTab={onNewTab} onRenameWorkspace={onRenameWorkspace} />
            ) : null;
          })()}
          {railActive !== "calendar" && railActive !== "search" && railActive !== "services" && !activeWorkspaceId && !tabs.some(t => t.active) && (
            /* Terminal welcome — no active tab */
            <TerminalWelcome
              activeCount={workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "active").length, 0)}
              reviewCount={workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "review").length, 0)}
              overdueCount={workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "overdue").length, 0)}
              totalEarned={workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "completed").reduce((a, p) => { const m = p.amount.match(/[\d,]+/); return a + (m ? parseInt(m[0].replace(",", "")) : 0); }, 0), 0)}
              totalPending={workspaces.reduce((s, w) => s + w.projects.filter(p => p.status !== "completed").reduce((a, p) => { const m = p.amount.match(/[\d,]+/); return a + (m ? parseInt(m[0].replace(",", "")) : 0); }, 0), 0)}
              pipeline={workspaces.reduce((s, w) => s + w.projects.reduce((a, p) => { const m = p.amount.match(/[\d,]+/); return a + (m ? parseInt(m[0].replace(",", "")) : 0); }, 0), 0)}
              onOpenCmdPalette={() => setCmdPalette(true)}
              onNewWorkspace={onNewWorkspace}
            />
          )}
          {railActive !== "calendar" && railActive !== "search" && railActive !== "services" && !activeWorkspaceId && tabs.some(t => t.active) && (
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Left margin — document spine + block gutter */}
              <EditorMargin
                blocks={blocks}
                hoveredBlock={hoverBlock}
                onHoverBlock={setHoverBlock}
                onScrollTo={(id) => {
                  const el = blockElMap.current[id];
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              />
              {/* Editor area */}
              <div className={styles.editor} ref={editorRef} onMouseDown={() => { setConvoPanelOpen(false); setCommentPanelOpen(false); }} style={{ flex: 1 }}>
                <div className={styles.page}>{blocks.map(renderBlock)}</div>
                {slashMenu && (
                  <SlashMenu
                    top={slashMenu.top}
                    left={slashMenu.left}
                    filter={slashFilter}
                    selectedIndex={slashIndex}
                    onSelect={selectSlashItem}
                    onClose={() => setSlashMenu(null)}
                    onIndexChange={setSlashIndex}
                  />
                )}
                {formatBar && <FormatBar top={formatBar.top} left={formatBar.left} />}
              </div>
            </div>
          )}

          {/* Command bar — only show when not in workspace home */}
          {!activeWorkspaceId && <CommandBar charCount={charCount} />}
        </div>

        {/* Activity margin (right) */}
        <ActivityMargin
          open={commentPanelOpen}
          onClose={() => { setCommentPanelOpen(false); setCommentHighlight(null); }}
          blocks={blocks}
          activities={activities}
          onActivitiesChange={onActivitiesChange}
          hoveredBlock={hoverBlock}
          onHoverBlock={setHoverBlock}
          pendingHighlight={commentHighlight}
          onHighlightConsumed={() => setCommentHighlight(null)}
          onScrollToBlock={(blockId) => {
            const el = blockElMap.current[blockId];
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
        />
      </div>

      {/* Command palette */}
      {cmdPalette && <CommandPalette onClose={() => setCmdPalette(false)} />}

      {/* History modal */}
      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}
