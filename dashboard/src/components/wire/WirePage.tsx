"use client";

import { useState, useEffect, useCallback } from "react";
import type { Workspace } from "@/lib/types";
import { buildWireContext, type WireService } from "@/lib/wire-context";
import styles from "./WirePage.module.css";

// ── Types ──

type SignalType = "rate" | "trend" | "insight" | "signal" | "alert" | "benchmark";

interface Signal {
  type: SignalType;
  title: string;
  body: string;
  relevance: number;
  source: string;
}

interface CachedWireData {
  signals: Signal[];
  timestamp: number;
}

// ── Constants ──

const CACHE_KEY = "felmark_wire_cache";
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const TYPE_META: Record<SignalType, { icon: string; color: string; label: string; bg: string }> = {
  rate:      { icon: "$", color: "#7c6b9e", label: "Rate",      bg: "rgba(124,107,158,0.06)" },
  trend:     { icon: "↗", color: "#5a9a3c", label: "Trend",     bg: "rgba(90,154,60,0.06)" },
  insight:   { icon: "◎", color: "#5b7fa4", label: "Insight",   bg: "rgba(91,127,164,0.06)" },
  signal:    { icon: "⚑", color: "#b07d4f", label: "Signal",    bg: "rgba(176,125,79,0.06)" },
  alert:     { icon: "!", color: "#c24b38", label: "Alert",      bg: "rgba(194,75,56,0.06)" },
  benchmark: { icon: "◆", color: "#8a7e63", label: "Benchmark", bg: "rgba(138,126,99,0.06)" },
};

const FILTER_TABS: { label: string; value: SignalType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Rates", value: "rate" },
  { label: "Trends", value: "trend" },
  { label: "Insights", value: "insight" },
  { label: "Signals", value: "signal" },
  { label: "Alerts", value: "alert" },
];

// ── Helpers ──

function getCache(): CachedWireData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: CachedWireData = JSON.parse(raw);
    if (Date.now() - data.timestamp > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function setCache(signals: Signal[]) {
  try {
    const data: CachedWireData = { signals, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch { /* storage full */ }
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── Skeleton ──

function SkeletonCards() {
  return (
    <div className={styles.skeletonWrap}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard} style={{ animationDelay: `${i * 0.08}s` }}>
          <div className={styles.skeletonBadge} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonBody} />
          <div className={styles.skeletonBody} style={{ width: "60%" }} />
          <div className={styles.skeletonFooter}>
            <div className={styles.skeletonDot} />
            <div className={styles.skeletonDot} style={{ width: "40px" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Signal Card ──

function SignalCard({ signal, onClick, selected }: { signal: Signal; onClick: () => void; selected: boolean }) {
  const meta = TYPE_META[signal.type] || TYPE_META.insight;
  return (
    <div className={`${styles.card} ${selected ? styles.cardSelected : ""}`} onClick={onClick}>
      <div className={styles.cardHead}>
        <span className={styles.cardIcon} style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.color}15` }}>
          {meta.icon}
        </span>
        <span className={styles.cardBadge} style={{ color: meta.color, background: meta.bg, borderColor: `${meta.color}15` }}>
          {meta.label}
        </span>
        <span className={styles.cardRelevance}>
          {signal.relevance}%
          <span className={styles.cardRelBar}>
            <span
              className={styles.cardRelFill}
              style={{
                width: `${signal.relevance}%`,
                background: signal.relevance >= 90 ? "#5a9a3c" : signal.relevance >= 75 ? "var(--ember)" : "var(--ink-400)",
              }}
            />
          </span>
        </span>
      </div>
      <div className={styles.cardTitle}>{signal.title}</div>
      <div className={styles.cardBody}>{signal.body}</div>
      <div className={styles.cardSource}>{signal.source}</div>
    </div>
  );
}

// ── Main Component ──

interface WirePageProps {
  workspaces?: Workspace[];
  services?: WireService[];
}

export default function WirePage({ workspaces = [], services = [] }: WirePageProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheTimestamp, setCacheTimestamp] = useState<number | null>(null);
  const [filter, setFilter] = useState<SignalType | "all">("all");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const hasData = services.length > 0 || workspaces.length > 0;

  const fetchSignals = useCallback(async (force = false) => {
    // Check cache first (unless forcing)
    if (!force) {
      const cached = getCache();
      if (cached) {
        setSignals(cached.signals);
        setCacheTimestamp(cached.timestamp);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const context = buildWireContext(workspaces, services);
      const res = await fetch("/api/wire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `API error ${res.status}`);
      }

      const data = await res.json();
      if (data.signals && Array.isArray(data.signals)) {
        setSignals(data.signals);
        setCache(data.signals);
        setCacheTimestamp(Date.now());
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      // Fall back to cached data if available
      const cached = getCache();
      if (cached) {
        setSignals(cached.signals);
        setCacheTimestamp(cached.timestamp);
      }
    } finally {
      setLoading(false);
    }
  }, [workspaces, services]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const filtered = filter === "all" ? signals : signals.filter(s => s.type === filter);
  const selected = selectedIdx !== null ? filtered[selectedIdx] : null;

  // ── Empty state: no services/clients ──
  if (!hasData && !loading && signals.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.title}>The Wire</span>
            <span className={styles.pro}>PRO</span>
          </div>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>◎</div>
          <div className={styles.emptyTitle}>Set up your services to unlock personalized insights</div>
          <div className={styles.emptySub}>
            The Wire uses AI to generate business intelligence tailored to your services, clients, and projects.
            Add your first service or create a workspace to get started.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.title}>The Wire</span>
          <span className={styles.pro}>PRO</span>
          {cacheTimestamp && !loading && (
            <span className={styles.updated}>Last updated: {timeAgo(cacheTimestamp)}</span>
          )}
        </div>
        <div className={styles.headerRight}>
          <button
            className={styles.refreshBtn}
            onClick={() => fetchSignals(true)}
            disabled={loading}
          >
            {loading ? "Generating..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className={styles.errorBanner}>
          <span>Couldn&apos;t generate insights. {signals.length > 0 ? "Showing cached results." : ""}</span>
          <button className={styles.retryBtn} onClick={() => fetchSignals(true)}>Retry</button>
        </div>
      )}

      {/* Filter tabs */}
      <div className={styles.filters}>
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            className={`${styles.filterBtn} ${filter === tab.value ? styles.filterOn : ""}`}
            onClick={() => { setFilter(tab.value); setSelectedIdx(null); }}
          >
            {tab.value !== "all" && <span className={styles.filterIcon} style={{ color: TYPE_META[tab.value as SignalType]?.color }}>{TYPE_META[tab.value as SignalType]?.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonCards />
      ) : (
        <div className={styles.layout}>
          {/* Cards grid */}
          <div className={styles.cardGrid}>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>No signals for this filter.</div>
            ) : (
              filtered.map((signal, i) => (
                <SignalCard
                  key={`${signal.type}-${i}`}
                  signal={signal}
                  selected={selectedIdx === i}
                  onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                />
              ))
            )}
          </div>

          {/* Detail preview */}
          {selected && (
            <div className={styles.preview}>
              <div className={styles.pvClose} onClick={() => setSelectedIdx(null)}>×</div>
              <div className={styles.pvTypeBadge} style={{
                color: TYPE_META[selected.type]?.color,
                background: TYPE_META[selected.type]?.bg,
                borderColor: `${TYPE_META[selected.type]?.color}15`,
              }}>
                {TYPE_META[selected.type]?.icon} {TYPE_META[selected.type]?.label}
              </div>
              <div className={styles.pvTitle}>{selected.title}</div>
              <div className={styles.pvBody}>{selected.body}</div>
              <div className={styles.pvMeta}>
                <span className={styles.pvSource}>{selected.source}</span>
                <span className={styles.pvRelevance}>
                  Relevance: {selected.relevance}%
                  <span className={styles.pvRelBar}>
                    <span className={styles.pvRelFill} style={{
                      width: `${selected.relevance}%`,
                      background: selected.relevance >= 90 ? "#5a9a3c" : selected.relevance >= 75 ? "var(--ember)" : "var(--ink-400)",
                    }} />
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        <span>{filtered.length} signal{filtered.length !== 1 ? "s" : ""}</span>
        <span>Powered by Felmark Intelligence</span>
      </div>
    </div>
  );
}
