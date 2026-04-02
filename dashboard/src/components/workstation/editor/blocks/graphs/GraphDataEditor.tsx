"use client";

import { useState, useEffect, useRef } from "react";
import type { GraphBlockData, GraphType } from "@/lib/types";
import { GRAPH_TYPE_OPTIONS, getDefaultGraphData } from "./GraphBlock";
import { PALETTE } from "./palette";
import styles from "./GraphDataEditor.module.css";

interface GraphDataEditorProps {
  graphData: GraphBlockData;
  onUpdate: (graphData: GraphBlockData) => void;
  onClose: () => void;
  onDelete: () => void;
}

// ── Simple types: bar, line, donut, hbar — array of { label, value, ... } ──

interface SimpleRow { label: string; value: number; color?: string; unit?: string; current?: boolean }

function dataToSimpleRows(data: unknown): SimpleRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((d: any) => ({ label: d.label || "", value: d.value || 0, color: d.color, unit: d.unit, current: d.current }));
}

// ── Sparkline: array of { label, values[], current, change, color? } ──

interface SparkRow { label: string; values: number[]; current: string; change: number; color?: string }

function dataToSparkRows(data: unknown): SparkRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((d: any) => ({ label: d.label || "", values: d.values || [], current: d.current || "", change: d.change || 0, color: d.color }));
}

// ── Stacked area: { labels[], series[{ label, color?, values[] }] } ──

interface AreaData { labels: string[]; series: { label: string; color?: string; values: number[] }[] }

function dataToArea(data: unknown): AreaData {
  const d = data as any;
  if (d && d.labels && d.series) return { labels: d.labels, series: d.series };
  return { labels: ["A", "B", "C"], series: [{ label: "Series 1", values: [10, 20, 30] }] };
}

// ── Metrics: array of { label, value, prefix?, suffix?, color?, change?, sub?, sparkline? } ──

interface MetricRow { label: string; value: number; prefix?: string; suffix?: string; color?: string; change?: number; sub?: string }

function dataToMetrics(data: unknown): MetricRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((d: any) => ({ label: d.label || "", value: d.value || 0, prefix: d.prefix, suffix: d.suffix, color: d.color, change: d.change, sub: d.sub }));
}

// ═════════════════════════════════════
// SIMPLE TABLE EDITOR (bar, line, donut, hbar)
// ═════════════════════════════════════

function SimpleEditor({ data, graphType, onChange }: { data: unknown; graphType: GraphType; onChange: (d: unknown) => void }) {
  const [rows, setRows] = useState(() => dataToSimpleRows(data));
  const showUnit = graphType === "hbar";

  const commit = (next: SimpleRow[]) => {
    setRows(next);
    onChange(next.map(r => ({ label: r.label, value: r.value, ...(r.color ? { color: r.color } : {}), ...(r.unit ? { unit: r.unit } : {}), ...(r.current ? { current: true } : {}) })));
  };

  const update = (idx: number, field: string, val: string) => {
    const next = [...rows];
    if (field === "value") next[idx] = { ...next[idx], value: parseFloat(val) || 0 };
    else if (field === "label") next[idx] = { ...next[idx], label: val };
    else if (field === "unit") next[idx] = { ...next[idx], unit: val };
    commit(next);
  };

  const addRow = () => commit([...rows, { label: `Item ${rows.length + 1}`, value: 0, color: PALETTE[rows.length % PALETTE.length] }]);
  const removeRow = (idx: number) => { if (rows.length > 1) commit(rows.filter((_, i) => i !== idx)); };

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span className={styles.tableHeadCell} style={{ flex: 1 }}>Label</span>
        <span className={styles.tableHeadCell} style={{ width: 100 }}>Value</span>
        {showUnit && <span className={styles.tableHeadCell} style={{ width: 50 }}>Unit</span>}
        <span className={styles.tableHeadCell} style={{ width: 32 }} />
      </div>
      {rows.map((row, i) => (
        <div key={i} className={styles.tableRow}>
          <input className={styles.tableCell} style={{ flex: 1 }} value={row.label}
            onChange={e => update(i, "label", e.target.value)} spellCheck={false} />
          <input className={`${styles.tableCell} ${styles.tableCellNum}`} style={{ width: 100 }}
            type="number" value={row.value} onChange={e => update(i, "value", e.target.value)} />
          {showUnit && <input className={styles.tableCell} style={{ width: 50 }} value={row.unit || ""}
            onChange={e => update(i, "unit", e.target.value)} placeholder="h" spellCheck={false} />}
          <button className={styles.rowRemove} onClick={() => removeRow(i)} title="Remove">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>
      ))}
      <button className={styles.addRow} onClick={addRow}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
        Add row
      </button>
    </div>
  );
}

// ═════════════════════════════════════
// SPARKLINE EDITOR
// ═════════════════════════════════════

function SparklineEditor({ data, onChange }: { data: unknown; onChange: (d: unknown) => void }) {
  const [rows, setRows] = useState(() => dataToSparkRows(data));

  const commit = (next: SparkRow[]) => { setRows(next); onChange(next); };

  const updateField = (idx: number, field: string, val: string) => {
    const next = [...rows];
    if (field === "label") next[idx] = { ...next[idx], label: val };
    else if (field === "current") next[idx] = { ...next[idx], current: val };
    else if (field === "change") next[idx] = { ...next[idx], change: parseFloat(val) || 0 };
    else if (field === "values") next[idx] = { ...next[idx], values: val.split(",").map(v => parseFloat(v.trim()) || 0) };
    commit(next);
  };

  const addRow = () => commit([...rows, { label: `Metric ${rows.length + 1}`, values: [1, 2, 3, 4, 5], current: "0", change: 0, color: PALETTE[rows.length % PALETTE.length] }]);
  const removeRow = (idx: number) => { if (rows.length > 1) commit(rows.filter((_, i) => i !== idx)); };

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span className={styles.tableHeadCell} style={{ width: 80 }}>Label</span>
        <span className={styles.tableHeadCell} style={{ flex: 1 }}>Values (comma-separated)</span>
        <span className={styles.tableHeadCell} style={{ width: 60 }}>Current</span>
        <span className={styles.tableHeadCell} style={{ width: 50 }}>+/-%</span>
        <span className={styles.tableHeadCell} style={{ width: 32 }} />
      </div>
      {rows.map((row, i) => (
        <div key={i} className={styles.tableRow}>
          <input className={styles.tableCell} style={{ width: 80 }} value={row.label}
            onChange={e => updateField(i, "label", e.target.value)} spellCheck={false} />
          <input className={styles.tableCell} style={{ flex: 1 }} value={row.values.join(", ")}
            onChange={e => updateField(i, "values", e.target.value)} spellCheck={false} placeholder="1, 2, 3..." />
          <input className={styles.tableCell} style={{ width: 60 }} value={row.current}
            onChange={e => updateField(i, "current", e.target.value)} spellCheck={false} />
          <input className={`${styles.tableCell} ${styles.tableCellNum}`} style={{ width: 50 }}
            type="number" value={row.change} onChange={e => updateField(i, "change", e.target.value)} />
          <button className={styles.rowRemove} onClick={() => removeRow(i)} title="Remove">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>
      ))}
      <button className={styles.addRow} onClick={addRow}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
        Add row
      </button>
    </div>
  );
}

// ═════════════════════════════════════
// STACKED AREA EDITOR
// ═════════════════════════════════════

function AreaEditor({ data, onChange }: { data: unknown; onChange: (d: unknown) => void }) {
  const [areaData, setAreaData] = useState(() => dataToArea(data));

  const commit = (next: AreaData) => { setAreaData(next); onChange(next); };

  const updateLabel = (idx: number, val: string) => {
    const next = { ...areaData, labels: [...areaData.labels] };
    next.labels[idx] = val;
    commit(next);
  };

  const updateSeriesName = (si: number, val: string) => {
    const next = { ...areaData, series: areaData.series.map((s, i) => i === si ? { ...s, label: val } : s) };
    commit(next);
  };

  const updateSeriesValue = (si: number, vi: number, val: string) => {
    const next = {
      ...areaData,
      series: areaData.series.map((s, i) => i === si ? { ...s, values: s.values.map((v, j) => j === vi ? (parseFloat(val) || 0) : v) } : s),
    };
    commit(next);
  };

  const addLabel = () => {
    const next = {
      labels: [...areaData.labels, `P${areaData.labels.length + 1}`],
      series: areaData.series.map(s => ({ ...s, values: [...s.values, 0] })),
    };
    commit(next);
  };

  const addSeries = () => {
    const next = {
      ...areaData,
      series: [...areaData.series, { label: `Series ${areaData.series.length + 1}`, color: PALETTE[areaData.series.length % PALETTE.length], values: areaData.labels.map(() => 0) }],
    };
    commit(next);
  };

  const removeSeries = (idx: number) => {
    if (areaData.series.length <= 1) return;
    commit({ ...areaData, series: areaData.series.filter((_, i) => i !== idx) });
  };

  return (
    <div className={styles.table}>
      {/* Column headers = labels */}
      <div className={styles.tableHead}>
        <span className={styles.tableHeadCell} style={{ width: 80 }}>Series</span>
        {areaData.labels.map((l, i) => (
          <span key={i} className={styles.tableHeadCell} style={{ flex: 1, position: "relative" }}>
            <input className={styles.tableCellMini} value={l} onChange={e => updateLabel(i, e.target.value)} spellCheck={false} />
          </span>
        ))}
        <span className={styles.tableHeadCell} style={{ width: 32 }} />
      </div>
      {/* One row per series */}
      {areaData.series.map((series, si) => (
        <div key={si} className={styles.tableRow}>
          <input className={styles.tableCell} style={{ width: 80 }} value={series.label}
            onChange={e => updateSeriesName(si, e.target.value)} spellCheck={false} />
          {series.values.map((v, vi) => (
            <input key={vi} className={`${styles.tableCell} ${styles.tableCellNum}`} style={{ flex: 1 }}
              type="number" value={v} onChange={e => updateSeriesValue(si, vi, e.target.value)} />
          ))}
          <button className={styles.rowRemove} onClick={() => removeSeries(si)} title="Remove series">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>
      ))}
      <div className={styles.tableActions}>
        <button className={styles.addRow} onClick={addSeries}>+ Series</button>
        <button className={styles.addRow} onClick={addLabel}>+ Column</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════
// METRICS EDITOR
// ═════════════════════════════════════

function MetricsEditor({ data, onChange }: { data: unknown; onChange: (d: unknown) => void }) {
  const [metrics, setMetrics] = useState(() => dataToMetrics(data));

  const commit = (next: MetricRow[]) => { setMetrics(next); onChange(next); };

  const update = (idx: number, field: string, val: string) => {
    const next = [...metrics];
    if (field === "value" || field === "change") next[idx] = { ...next[idx], [field]: parseFloat(val) || 0 };
    else next[idx] = { ...next[idx], [field]: val };
    commit(next);
  };

  const addMetric = () => commit([...metrics, { label: "Metric", value: 0, prefix: "$" }]);
  const removeMetric = (idx: number) => { if (metrics.length > 1) commit(metrics.filter((_, i) => i !== idx)); };

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span className={styles.tableHeadCell} style={{ width: 80 }}>Label</span>
        <span className={styles.tableHeadCell} style={{ width: 30 }}>Pre</span>
        <span className={styles.tableHeadCell} style={{ width: 80 }}>Value</span>
        <span className={styles.tableHeadCell} style={{ width: 36 }}>Suf</span>
        <span className={styles.tableHeadCell} style={{ width: 50 }}>+/-%</span>
        <span className={styles.tableHeadCell} style={{ flex: 1 }}>Subtitle</span>
        <span className={styles.tableHeadCell} style={{ width: 32 }} />
      </div>
      {metrics.map((m, i) => (
        <div key={i} className={styles.tableRow}>
          <input className={styles.tableCell} style={{ width: 80 }} value={m.label}
            onChange={e => update(i, "label", e.target.value)} spellCheck={false} />
          <input className={styles.tableCell} style={{ width: 30 }} value={m.prefix || ""}
            onChange={e => update(i, "prefix", e.target.value)} placeholder="$" spellCheck={false} />
          <input className={`${styles.tableCell} ${styles.tableCellNum}`} style={{ width: 80 }}
            type="number" value={m.value} onChange={e => update(i, "value", e.target.value)} />
          <input className={styles.tableCell} style={{ width: 36 }} value={m.suffix || ""}
            onChange={e => update(i, "suffix", e.target.value)} placeholder="/hr" spellCheck={false} />
          <input className={`${styles.tableCell} ${styles.tableCellNum}`} style={{ width: 50 }}
            type="number" value={m.change ?? ""} onChange={e => update(i, "change", e.target.value)} placeholder="%" />
          <input className={styles.tableCell} style={{ flex: 1 }} value={m.sub || ""}
            onChange={e => update(i, "sub", e.target.value)} placeholder="subtitle" spellCheck={false} />
          <button className={styles.rowRemove} onClick={() => removeMetric(i)} title="Remove">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>
      ))}
      <button className={styles.addRow} onClick={addMetric}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
        Add metric
      </button>
    </div>
  );
}

// ═════════════════════════════════════
// MAIN EDITOR WRAPPER
// ═════════════════════════════════════

const SIMPLE_TYPES: GraphType[] = ["bar", "line", "donut", "hbar"];

export default function GraphDataEditor({ graphData, onUpdate, onClose, onDelete }: GraphDataEditorProps) {
  const [title, setTitle] = useState(graphData.title);
  const [graphType, setGraphType] = useState(graphData.graphType);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Group types by compatible data shape
  const dataGroup = (t: GraphType) => {
    if (["bar", "line", "donut", "hbar"].includes(t)) return "simple";
    return t; // sparkline, area, metrics each have unique shapes
  };

  // Sync title/type changes — reset data when switching to incompatible shape
  useEffect(() => {
    if (graphType !== graphData.graphType && dataGroup(graphType) !== dataGroup(graphData.graphType)) {
      // Incompatible shape — reset to defaults for the new type
      const defaults = getDefaultGraphData(graphType);
      onUpdate({ ...defaults, title });
    } else {
      onUpdate({ ...graphData, graphType, title });
    }
  }, [title, graphType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close type picker on outside click
  useEffect(() => {
    if (!showTypePicker) return;
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${styles.typeSwitcher}`)) setShowTypePicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTypePicker]);

  const handleDataChange = (data: unknown) => {
    onUpdate({ ...graphData, graphType, title, data });
  };

  const renderEditor = () => {
    if (SIMPLE_TYPES.includes(graphData.graphType)) {
      return <SimpleEditor data={graphData.data} graphType={graphData.graphType} onChange={handleDataChange} />;
    }
    if (graphData.graphType === "sparkline") {
      return <SparklineEditor data={graphData.data} onChange={handleDataChange} />;
    }
    if (graphData.graphType === "area") {
      return <AreaEditor data={graphData.data} onChange={handleDataChange} />;
    }
    if (graphData.graphType === "metrics") {
      return <MetricsEditor data={graphData.data} onChange={handleDataChange} />;
    }
    return null;
  };

  return (
    <div className={styles.editor} ref={editorRef}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <input
          className={styles.titleInput}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Chart title..."
          spellCheck={false}
        />
        <div className={styles.toolbarRight}>
          <div className={styles.typeSwitcher}>
            <button className={styles.toolBtn} onClick={() => setShowTypePicker(p => !p)}>
              {GRAPH_TYPE_OPTIONS.find(o => o.type === graphType)?.icon || "\u25a5"}{" "}
              {GRAPH_TYPE_OPTIONS.find(o => o.type === graphType)?.label || "Chart"}
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ marginLeft: 4 }}><path d="M2 3l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </button>
            {showTypePicker && (
              <div className={styles.typeDropdown}>
                {GRAPH_TYPE_OPTIONS.map(opt => (
                  <button key={opt.type}
                    className={`${styles.typeOption}${opt.type === graphType ? ` ${styles.typeOptionOn}` : ""}`}
                    onClick={() => { setGraphType(opt.type); setShowTypePicker(false); }}>
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className={styles.toolBtn} onClick={onDelete} title="Delete graph">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 3.5h7M4.5 3.5V2.5h3v1M3.5 3.5v6h5v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button className={styles.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>

      {renderEditor()}
    </div>
  );
}
