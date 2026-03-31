"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTerminalContext } from "./TerminalProvider";
import { COMMAND_REGISTRY } from "@/lib/terminal/commands";
import type { TerminalBlock, NLResponseData } from "@/lib/terminal/types";
import styles from "./Terminal.module.css";

const AI_SUGGESTIONS: Record<string, string> = {
  "/status": "Try /rate to see your effective hourly rate",
  "/rate": "Use /client <name> to drill into a specific client",
  "/client": "Run /pipeline to see your project funnel",
  "/pipeline": "Check /wire for the latest market signals",
  "/wire": "Use /status for a full project overview",
  "": "Type / for commands, or ask a question in plain English",
};

function getAiSuggestion(lastCommand: string): string {
  for (const [prefix, suggestion] of Object.entries(AI_SUGGESTIONS)) {
    if (prefix && lastCommand.startsWith(prefix)) return suggestion;
  }
  return AI_SUGGESTIONS[""];
}

const WELCOME_HINTS = [
  { cmd: "/status", desc: "project overview" },
  { cmd: "/rate", desc: "effective rate" },
  { cmd: "/client", desc: "client lookup" },
  { cmd: "/pipeline", desc: "project pipeline" },
  { cmd: "/wire", desc: "Wire signals" },
];

interface TerminalProps {
  onClose?: () => void;
}

// ─── D4: Rich data sub-components for NL responses ──────────

function NLTable({ data }: { data: { headers: string[]; rows: string[][] } }) {
  return (
    <table className={styles.nlTable}>
      <thead>
        <tr>{data.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {data.rows.map((row, ri) => (
          <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

function NLList({ items }: { items: string[] }) {
  return (
    <ul className={styles.nlList}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  );
}

function NLMetric({ data }: { data: { label: string; value: string; change?: string } }) {
  return (
    <div className={styles.nlMetric}>
      <span className={styles.nlMetricValue}>{data.value}</span>
      <span className={styles.nlMetricLabel}>{data.label}</span>
      {data.change && <span className={styles.nlMetricChange}>{data.change}</span>}
    </div>
  );
}

function NLCard({ data }: { data: { title: string; body: string; tags?: string[] } }) {
  return (
    <div className={styles.nlCard}>
      <div className={styles.nlCardTitle}>{data.title}</div>
      <div className={styles.nlCardBody}>{data.body}</div>
      {data.tags && data.tags.length > 0 && (
        <div className={styles.nlCardTags}>
          {data.tags.map((tag, i) => <span key={i} className={styles.nlCardTag}>{tag}</span>)}
        </div>
      )}
    </div>
  );
}

function RichDataRenderer({ data }: { data: NLResponseData }) {
  if (!data || !data.content) return null;
  switch (data.type) {
    case "table":
      return <NLTable data={data.content as { headers: string[]; rows: string[][] }} />;
    case "list":
      return <NLList items={data.content as string[]} />;
    case "metric":
      return <NLMetric data={data.content as { label: string; value: string; change?: string }} />;
    case "card":
      return <NLCard data={data.content as { title: string; body: string; tags?: string[] }} />;
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────

export default function Terminal({ onClose }: TerminalProps) {
  const {
    blocks, executeCommand, inputHistory, clearBlocks,
    dismissInsight, executeAction, sendNLQuery,
  } = useTerminalContext();

  const [input, setInput] = useState("");
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("terminal");

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new blocks
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [blocks]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Filter commands for palette
  const paletteCommands = useMemo(() => {
    const query = input.startsWith("/") ? input.slice(1).toLowerCase() : "";
    return Object.entries(COMMAND_REGISTRY)
      .filter(([name, entry]) => {
        if (!query) return true;
        return name.includes(query) || entry.description.toLowerCase().includes(query);
      })
      .map(([name, entry]) => ({ name, ...entry }));
  }, [input]);

  // AI ghost suggestion
  const lastCommand = blocks.length > 0 ? (blocks[blocks.length - 1].command || "") : "";
  const aiSuggestion = getAiSuggestion(lastCommand);

  // D6: Determine if input is a natural language query (not a command)
  const isNLQuery = useCallback((text: string): boolean => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    if (trimmed.startsWith("/")) return false;
    if (trimmed.toLowerCase() === "clear") return false;
    return true;
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed === "clear") {
      clearBlocks();
      setInput("");
      setPaletteOpen(false);
      return;
    }

    // D6: Route natural language queries to the NL handler
    if (isNLQuery(trimmed)) {
      sendNLQuery(trimmed);
      setInput("");
      setHistoryIdx(-1);
      setPaletteOpen(false);
      return;
    }

    executeCommand(trimmed);
    setInput("");
    setHistoryIdx(-1);
    setPaletteOpen(false);
  }, [input, executeCommand, clearBlocks, isNLQuery, sendNLQuery]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Palette navigation
    if (paletteOpen && paletteCommands.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setPaletteIdx(prev => (prev + 1) % paletteCommands.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPaletteIdx(prev => (prev - 1 + paletteCommands.length) % paletteCommands.length);
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const cmd = paletteCommands[paletteIdx];
        if (cmd) {
          setInput(`/${cmd.name} `);
          setPaletteOpen(false);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setPaletteOpen(false);
        return;
      }
    }

    // Tab for AI suggestion
    if (e.key === "Tab" && !paletteOpen && aiSuggestion && !input) {
      e.preventDefault();
      const match = aiSuggestion.match(/\/\w+/);
      if (match) {
        setInput(match[0] + " ");
      }
      return;
    }

    // History navigation
    if (e.key === "ArrowUp" && !paletteOpen) {
      e.preventDefault();
      if (inputHistory.length > 0) {
        const newIdx = historyIdx === -1 ? inputHistory.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(inputHistory[newIdx]);
      }
      return;
    }
    if (e.key === "ArrowDown" && !paletteOpen) {
      e.preventDefault();
      if (historyIdx === -1) return;
      const newIdx = historyIdx + 1;
      if (newIdx >= inputHistory.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(newIdx);
        setInput(inputHistory[newIdx]);
      }
      return;
    }

    if (e.key === "Enter") {
      if (paletteOpen && paletteCommands.length > 0) {
        e.preventDefault();
        const cmd = paletteCommands[paletteIdx];
        if (cmd) {
          setInput(`/${cmd.name} `);
          setPaletteOpen(false);
        }
        return;
      }
      e.preventDefault();
      handleSubmit();
    }
  }, [paletteOpen, paletteCommands, paletteIdx, aiSuggestion, input, inputHistory, historyIdx, handleSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    // Open palette when typing /
    if (val.startsWith("/") && val.length >= 1) {
      setPaletteOpen(true);
      setPaletteIdx(0);
    } else {
      setPaletteOpen(false);
    }
  }, []);

  const handleCopy = useCallback((text: string, blockId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(blockId);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  const commandCount = inputHistory.length;

  // ─── D4: Block renderer ────────────────────────────

  function renderBlock(block: TerminalBlock) {
    // D4: Whisper rendering
    if (block.type === "whisper" && block.insight) {
      return (
        <div key={block.id} className={styles.whisper}>
          <span className={styles.whisperIcon}>~</span>
          {block.insight.text}
        </div>
      );
    }

    // D4: Nudge rendering
    if (block.type === "nudge" && block.insight) {
      return (
        <div key={block.id} className={styles.nudge}>
          <div className={styles.nudgeHeader}>
            <span className={styles.nudgeIcon}>*</span>
            <div className={styles.nudgeBody}>
              <div className={styles.nudgeText}>{block.insight.text}</div>
              {block.insight.reason && (
                <div className={styles.nudgeReason}>{block.insight.reason}</div>
              )}
              <div className={styles.nudgeActions}>
                {block.insight.action && (
                  <button
                    className={styles.nudgeAction}
                    onClick={(e) => {
                      e.stopPropagation();
                      executeAction(block.insight!.action!.command);
                    }}
                  >
                    {block.insight.action.label}
                  </button>
                )}
                <button
                  className={styles.nudgeDismiss}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (block.insightKey) dismissInsight(block.insightKey);
                  }}
                >
                  dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // D4: Alert rendering
    if (block.type === "alert" && block.insight) {
      return (
        <div key={block.id} className={styles.alert}>
          <div className={styles.alertHeader}>
            <span className={styles.alertIcon}>!</span>
            <div className={styles.alertBody}>
              <div className={styles.alertText}>{block.insight.text}</div>
              {block.insight.reason && (
                <div className={styles.alertReason}>{block.insight.reason}</div>
              )}
              <div className={styles.alertActions}>
                {block.insight.action && (
                  <button
                    className={styles.alertActionPrimary}
                    onClick={(e) => {
                      e.stopPropagation();
                      executeAction(block.insight!.action!.command);
                    }}
                  >
                    {block.insight.action.label}
                  </button>
                )}
                <button
                  className={styles.alertDismiss}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (block.insightKey) dismissInsight(block.insightKey);
                  }}
                >
                  dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // D6: Loading block
    if (block.type === "loading") {
      return (
        <div key={block.id} className={styles.loadingBlock}>
          <div className={styles.loadingSpinner} />
          <span>Thinking...</span>
        </div>
      );
    }

    // D6: NL Response block
    if (block.type === "nl-response") {
      const nlBlock = block as TerminalBlock & { nlData?: { text: string; data?: NLResponseData | null; model?: string } };
      const nlData = nlBlock.nlData;
      return (
        <div key={block.id} className={styles.nlResponse}>
          <div className={styles.nlResponseHeader}>
            <span className={styles.nlResponseBadge}>AI</span>
            <span className={styles.nlResponseQuery}>{block.command}</span>
            {nlData?.model && (
              <span className={styles.nlResponseModel}>
                {nlData.model.includes("sonnet") ? "sonnet" : "haiku"}
              </span>
            )}
          </div>
          <div className={styles.nlResponseBody}>
            {nlData?.text || "No response"}
            {nlData?.data && <RichDataRenderer data={nlData.data} />}
          </div>
        </div>
      );
    }

    // Existing: Error block
    if (block.type === "error") {
      return (
        <div key={block.id} className={styles.errorBlock}>
          <div className={styles.errorHeader}>
            <span className={styles.errorPrompt}>&#10095;</span>
            <span className={styles.commandText}>{block.command}</span>
          </div>
          <div className={styles.errorBody}>{block.content}</div>
        </div>
      );
    }

    // Existing: Command block (default)
    return (
      <div key={block.id} className={styles.commandBlock}>
        <div className={styles.commandHeader}>
          <span className={styles.commandPrompt}>&#10095;</span>
          <span className={styles.commandText}>{block.command}</span>
          <button
            className={`${styles.commandCopy} ${copiedId === block.id ? styles.commandCopied : ""}`}
            title={copiedId === block.id ? "Copied!" : "Copy command"}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(block.command || "", block.id);
            }}
          >
            {copiedId === block.id ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="1.5" width="6.5" height="8" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M1.5 3.5v6a1 1 0 001 1h5" stroke="currentColor" strokeWidth="1"/></svg>
            )}
          </button>
        </div>
        <div className={styles.commandBody}>{block.content}</div>
      </div>
    );
  }

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTabs}>
          <button
            className={`${styles.headerTab} ${activeTab === "terminal" ? styles.headerTabActive : ""}`}
            onClick={() => setActiveTab("terminal")}
          >
            Terminal
          </button>
          <button
            className={`${styles.headerTab} ${activeTab === "output" ? styles.headerTabActive : ""}`}
            onClick={() => setActiveTab("output")}
          >
            Output
          </button>
          <button
            className={`${styles.headerTab} ${activeTab === "ai" ? styles.headerTabActive : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            AI
          </button>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.headerBtn} title="Minimize" onClick={(e) => e.stopPropagation()}>&#8862;</button>
          <button className={styles.headerBtn} title="Maximize" onClick={(e) => e.stopPropagation()}>&#9633;</button>
          <button className={styles.headerBtn} title="Close" onClick={(e) => { e.stopPropagation(); onClose?.(); }}>&#10005;</button>
        </div>
      </div>

      {/* Scrollable output */}
      <div className={styles.output} ref={outputRef} onClick={(e) => e.stopPropagation()}>
        {/* Welcome block */}
        {blocks.length === 0 && (
          <div className={styles.welcomeBlock}>
            <div className={styles.welcomeLogo}>
              <span className={styles.welcomeLogoMark}>&#9670;</span>
              <span className={styles.welcomeTitle}>
                Felmark Terminal
                <span className={styles.welcomeVersion}>v1.0</span>
              </span>
            </div>
            <div className={styles.welcomeHints}>
              {WELCOME_HINTS.map(h => (
                <div key={h.cmd} className={styles.welcomeHint}>
                  <span className={styles.welcomeHintCmd}>{h.cmd}</span>
                  <span>{h.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All blocks — commands, insights, NL responses */}
        {blocks.map(block => renderBlock(block))}
      </div>

      {/* Slash command palette */}
      {paletteOpen && paletteCommands.length > 0 && (
        <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
          <div className={styles.paletteList}>
            {paletteCommands.map((cmd, idx) => (
              <button
                key={cmd.name}
                className={`${styles.paletteItem} ${idx === paletteIdx ? styles.paletteItemActive : ""}`}
                onMouseEnter={() => setPaletteIdx(idx)}
                onClick={() => {
                  setInput(`/${cmd.name} `);
                  setPaletteOpen(false);
                  inputRef.current?.focus();
                }}
              >
                <span className={styles.paletteIcon}>{cmd.icon}</span>
                <span className={styles.paletteCmd}>/{cmd.name}</span>
                <span className={styles.paletteDesc}>{cmd.description}</span>
                <span className={styles.paletteBadge}>{cmd.category}</span>
              </button>
            ))}
          </div>
          <div className={styles.paletteFooter}>
            <span><span className={styles.paletteKey}>&#8593;&#8595;</span> navigate</span>
            <span><span className={styles.paletteKey}>Tab</span> autocomplete</span>
            <span><span className={styles.paletteKey}>Enter</span> select</span>
            <span><span className={styles.paletteKey}>Esc</span> close</span>
          </div>
        </div>
      )}

      {/* AI ghost suggestion */}
      {!paletteOpen && aiSuggestion && (
        <div className={styles.aiSuggestion}>
          <span className={styles.aiBadge}>AI</span>
          <span className={styles.aiText}>{aiSuggestion}</span>
          <span className={styles.aiTabHint}>
            <span className={styles.aiTabKey}>Tab</span>
          </span>
        </div>
      )}

      {/* Input bar */}
      <div className={styles.inputBar} onClick={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}>
        <span className={styles.inputPrompt}>&#10095;</span>
        <input
          ref={inputRef}
          className={styles.inputField}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or ask a question..."
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Footer status bar */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.footerDot} />
          <span>ready</span>
          <span style={{ margin: "0 2px" }}>&middot;</span>
          <span>{activeTab}</span>
        </div>
        <div className={styles.footerRight}>
          {commandCount} command{commandCount !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
