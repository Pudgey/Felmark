"use client";

import { useState } from "react";
import styles from "./PipelineBoard.module.css";

type LostReason = "budget" | "timing" | "ghosted" | "competitor" | "scope" | "other";

const LOST_REASONS: { id: LostReason; label: string }[] = [
  { id: "budget", label: "Budget" },
  { id: "timing", label: "Timing" },
  { id: "ghosted", label: "Ghosted" },
  { id: "competitor", label: "Went with competitor" },
  { id: "scope", label: "Scope mismatch" },
  { id: "other", label: "Other" },
];

interface Deal {
  id: string;
  stage: string;
  name: string;
  client: string;
  value: number;
  probability: number;
  daysInStage: number;
  avatar: string;
  avatarBg: string;
  progress?: number;
  dueIn?: number;
  overdue?: boolean;
  proposalViews?: number;
  invoiceViews?: number;
  invoiceDate?: string;
  paidDate?: string;
  notes?: string;
  source?: string;
  contact?: string;
  lost?: boolean;
  lostReason?: LostReason;
  lostDate?: string;
}

const STAGES = [
  { id: "lead", label: "Lead", icon: "◇", color: "#5b7fa4", desc: "New opportunity" },
  { id: "proposed", label: "Proposed", icon: "◆", color: "#b07d4f", desc: "Sent proposal" },
  { id: "active", label: "Active", icon: "●", color: "#5a9a3c", desc: "Work in progress" },
  { id: "payment", label: "Awaiting Payment", icon: "$", color: "#8a7e63", desc: "Invoice sent" },
  { id: "completed", label: "Completed", icon: "✓", color: "#7c8594", desc: "Paid & delivered" },
];

const INITIAL_DEALS: Deal[] = [
  { id: "d1", stage: "lead", name: "E-commerce Rebrand", client: "Luna Boutique", contact: "maria@lunaboutique.co", value: 6500, probability: 40, daysInStage: 3, source: "Referral", avatar: "L", avatarBg: "#7c6b9e" },
  { id: "d2", stage: "lead", name: "App UI Audit", client: "HealthTrack", value: 3200, probability: 25, daysInStage: 7, source: "Cold outreach", avatar: "H", avatarBg: "#5b7fa4" },
  { id: "d3", stage: "lead", name: "Newsletter Design", client: "The Daily Brief", value: 1200, probability: 60, daysInStage: 1, source: "Inbound", avatar: "D", avatarBg: "#3d6b52" },
  { id: "d4", stage: "proposed", name: "Course Landing Page", client: "Nora Kim", value: 3200, probability: 85, daysInStage: 2, avatar: "N", avatarBg: "#a08472", proposalViews: 3 },
  { id: "d5", stage: "proposed", name: "Brand Strategy Sprint", client: "Finch & Co", value: 8000, probability: 50, daysInStage: 5, avatar: "F", avatarBg: "#8b5c3a" },
  { id: "d6", stage: "active", name: "Brand Guidelines v2", client: "Meridian Studio", value: 2400, probability: 95, daysInStage: 12, progress: 65, dueIn: 5, avatar: "M", avatarBg: "#7c8594" },
  { id: "d7", stage: "active", name: "Website Copy", client: "Meridian Studio", value: 1800, probability: 90, daysInStage: 8, progress: 40, dueIn: 10, avatar: "M", avatarBg: "#7c8594" },
  { id: "d8", stage: "active", name: "App Onboarding UX", client: "Bolt Fitness", value: 4000, probability: 85, daysInStage: 18, progress: 70, dueIn: -4, overdue: true, avatar: "B", avatarBg: "#8a7e63" },
  { id: "d9", stage: "payment", name: "Invoice #047", client: "Meridian Studio", value: 2400, probability: 98, daysInStage: 1, invoiceDate: "Mar 29", invoiceViews: 2, avatar: "M", avatarBg: "#7c8594" },
  { id: "d10", stage: "payment", name: "Invoice #044", client: "Bolt Fitness", value: 4000, probability: 80, daysInStage: 4, invoiceDate: "Mar 25", overdue: true, avatar: "B", avatarBg: "#8a7e63" },
  { id: "d11", stage: "completed", name: "Social Media Kit", client: "Meridian Studio", value: 950, paidDate: "Mar 20", probability: 100, daysInStage: 0, avatar: "M", avatarBg: "#7c8594" },
  { id: "d12", stage: "completed", name: "Retainer (March)", client: "Nora Kim", value: 1800, paidDate: "Mar 15", probability: 100, daysInStage: 0, avatar: "N", avatarBg: "#a08472" },
  { id: "d13", stage: "completed", name: "Logo Refresh", client: "Meridian Studio", value: 3200, paidDate: "Dec 15", probability: 100, daysInStage: 0, avatar: "M", avatarBg: "#7c8594" },
];

export default function PipelineBoard() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [dragDeal, setDragDeal] = useState<string | null>(null);
  const [dropStage, setDropStage] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState<string | null>(null);
  const [newDeal, setNewDeal] = useState({ name: "", client: "", value: "" });
  const [showLostPicker, setShowLostPicker] = useState<string | null>(null);
  const [showLostDrawer, setShowLostDrawer] = useState(false);

  const moveDeal = (dealId: string, newStage: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, daysInStage: 0 } : d));
    setDragDeal(null);
    setDropStage(null);
  };

  const markAsLost = (dealId: string, reason: LostReason) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, lost: true, lostReason: reason, lostDate: "Just now" } : d));
    setShowLostPicker(null);
    setSelectedDeal(null);
    setShowLostDrawer(true);
  };

  const reopenDeal = (dealId: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, lost: false, lostReason: undefined, lostDate: undefined, stage: "lead", daysInStage: 0 } : d));
  };

  const addDeal = (stage: string) => {
    if (!newDeal.name.trim()) return;
    const colors = ["#7c6b9e", "#5b7fa4", "#a08472", "#3d6b52", "#8b5c3a"];
    setDeals(prev => [...prev, {
      id: `d${Date.now()}`, stage, name: newDeal.name, client: newDeal.client || "Unknown",
      value: parseInt(newDeal.value) || 0, probability: stage === "lead" ? 30 : 70,
      daysInStage: 0, avatar: (newDeal.client || "?")[0].toUpperCase(),
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
    }]);
    setNewDeal({ name: "", client: "", value: "" });
    setShowAdd(null);
  };

  const activeDeals = deals.filter(d => !d.lost);
  const lostDeals = deals.filter(d => d.lost);
  const totalPipeline = activeDeals.filter(d => d.stage !== "completed").reduce((s, d) => s + d.value, 0);
  const weightedPipeline = activeDeals.filter(d => d.stage !== "completed").reduce((s, d) => s + d.value * (d.probability || 50) / 100, 0);
  const completedTotal = activeDeals.filter(d => d.stage === "completed").reduce((s, d) => s + d.value, 0);
  const lostTotal = lostDeals.reduce((s, d) => s + d.value, 0);
  const openCount = activeDeals.filter(d => d.stage !== "completed").length;
  const conversionRate = activeDeals.length > 0 ? Math.round((activeDeals.filter(d => d.stage === "completed").length / activeDeals.length) * 100) : 0;

  const selected = deals.find(d => d.id === selectedDeal);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.head}>
        <span className={styles.title}>Pipeline</span>
        <button className={styles.addBtn}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          New Deal
        </button>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}><div className={styles.statVal}>${(totalPipeline / 1000).toFixed(1)}k</div><div className={styles.statLabel}>pipeline</div></div>
        <div className={styles.stat}><div className={`${styles.statVal} ${styles.statEmber}`}>${(weightedPipeline / 1000).toFixed(1)}k</div><div className={styles.statLabel}>weighted</div></div>
        <div className={styles.stat}><div className={`${styles.statVal} ${styles.statGreen}`}>${(completedTotal / 1000).toFixed(1)}k</div><div className={styles.statLabel}>won</div></div>
        <div className={styles.stat}><div className={styles.statVal}>{openCount}</div><div className={styles.statLabel}>open</div></div>
        <div className={styles.stat}><div className={styles.statVal}>{conversionRate}%</div><div className={styles.statLabel}>conv rate</div></div>
      </div>

      {/* Funnel bar */}
      <div className={styles.funnel}>
        {STAGES.map(stage => {
          const val = deals.filter(d => d.stage === stage.id).reduce((s, d) => s + d.value, 0);
          const pct = totalPipeline + completedTotal > 0 ? (val / (totalPipeline + completedTotal)) * 100 : 0;
          return <div key={stage.id} className={styles.funnelSeg} style={{ width: `${Math.max(pct, 1)}%`, background: stage.color }} />;
        })}
      </div>

      {/* Board */}
      <div className={styles.board}>
        {STAGES.map(stage => {
          const stageDeals = activeDeals.filter(d => d.stage === stage.id);
          const stageVal = stageDeals.reduce((s, d) => s + d.value, 0);

          return (
            <div key={stage.id}
              className={`${styles.col} ${dropStage === stage.id ? styles.colDrop : ""}`}
              onDragOver={e => { e.preventDefault(); if (dragDeal) setDropStage(stage.id); }}
              onDragLeave={() => { if (dropStage === stage.id) setDropStage(null); }}
              onDrop={() => { if (dragDeal) moveDeal(dragDeal, stage.id); }}>

              {/* Column header */}
              <div className={styles.colHead}>
                <div className={styles.colIcon} style={{ color: stage.color }}>{stage.icon}</div>
                <span className={styles.colLabel}>{stage.label}</span>
                <span className={styles.colCount}>{stageDeals.length}</span>
                <span className={styles.colVal}>${(stageVal / 1000).toFixed(1)}k</span>
              </div>

              {/* Cards */}
              <div className={styles.colCards}>
                {stageDeals.map(deal => (
                  <div key={deal.id}
                    className={`${styles.deal} ${dragDeal === deal.id ? styles.dealDragging : ""} ${deal.overdue ? styles.dealOverdue : ""}`}
                    draggable
                    onDragStart={() => setDragDeal(deal.id)}
                    onDragEnd={() => { setDragDeal(null); setDropStage(null); }}
                    onClick={() => setSelectedDeal(deal.id)}>
                    <div className={styles.dealTop}>
                      <div className={styles.dealAv} style={{ background: deal.avatarBg }}>{deal.avatar}</div>
                      <div className={styles.dealInfo}>
                        <div className={styles.dealName}>{deal.name}</div>
                        <div className={styles.dealClient}>{deal.client}</div>
                      </div>
                    </div>
                    <div className={styles.dealBottom}>
                      <span className={styles.dealValue}>${deal.value.toLocaleString()}</span>
                      {deal.probability < 100 && <span className={styles.dealProb}>{deal.probability}%</span>}
                      {deal.daysInStage > 0 && stage.id !== "completed" && <span className={styles.dealDays}>{deal.daysInStage}d</span>}
                    </div>
                    {deal.progress !== undefined && (
                      <div className={styles.dealProgress}><div className={styles.dealProgressFill} style={{ width: `${deal.progress}%`, background: deal.overdue ? "#c24b38" : stage.color }} /></div>
                    )}
                    {deal.dueIn !== undefined && (
                      <div className={styles.dealDue} style={{ color: deal.overdue ? "#c24b38" : deal.dueIn <= 3 ? "#c89360" : "var(--ink-300)" }}>
                        {deal.overdue ? `${Math.abs(deal.dueIn)}d overdue` : `${deal.dueIn}d left`}
                      </div>
                    )}
                    {deal.paidDate && <div className={styles.dealPaid}>Paid {deal.paidDate}</div>}
                  </div>
                ))}

                {/* Add deal */}
                {showAdd === stage.id ? (
                  <div className={styles.addForm}>
                    <input className={styles.addInput} placeholder="Deal name..." value={newDeal.name} autoFocus
                      onChange={e => setNewDeal(p => ({ ...p, name: e.target.value }))}
                      onKeyDown={e => { if (e.key === "Enter") addDeal(stage.id); if (e.key === "Escape") setShowAdd(null); }} />
                    <input className={styles.addInput} placeholder="Client" value={newDeal.client}
                      onChange={e => setNewDeal(p => ({ ...p, client: e.target.value }))} />
                    <input className={styles.addInput} placeholder="$0" value={newDeal.value}
                      onChange={e => setNewDeal(p => ({ ...p, value: e.target.value }))} />
                    <div className={styles.addActions}>
                      <button className={styles.addSave} onClick={() => addDeal(stage.id)}>Add</button>
                      <button className={styles.addCancel} onClick={() => setShowAdd(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className={styles.addRow} onClick={() => { setShowAdd(stage.id); setNewDeal({ name: "", client: "", value: "" }); }}>
                    + Add deal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lost drawer */}
      {lostDeals.length > 0 && (
        <div className={styles.lostDrawer}>
          <div className={styles.lostDrawerHead} onClick={() => setShowLostDrawer(!showLostDrawer)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
            <span className={styles.lostDrawerLabel}>lost</span>
            <span className={styles.lostDrawerCount}>{lostDeals.length} deals · ${(lostTotal / 1000).toFixed(1)}k</span>
            <span className={styles.lostDrawerArrow} style={{ transform: showLostDrawer ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
          </div>
          {showLostDrawer && (
            <div className={styles.lostDrawerItems}>
              {lostDeals.map(d => (
                <div key={d.id} className={styles.lostItem}>
                  <div className={styles.lostItemAv} style={{ background: d.avatarBg }}>{d.avatar}</div>
                  <div className={styles.lostItemInfo}>
                    <span className={styles.lostItemName}>{d.name}</span>
                    <span className={styles.lostItemMeta}>{d.client} · ${d.value.toLocaleString()} · {LOST_REASONS.find(r => r.id === d.lostReason)?.label || "Unknown"}</span>
                  </div>
                  <button className={styles.lostItemReopen} onClick={() => reopenDeal(d.id)}>Reopen</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <>
          <div className={styles.overlay} onClick={() => setSelectedDeal(null)} />
          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <div className={styles.detailAv} style={{ background: selected.avatarBg }}>{selected.avatar}</div>
              <div className={styles.detailInfo}>
                <div className={styles.detailName}>{selected.name}</div>
                <div className={styles.detailClient}>{selected.client}</div>
              </div>
              <button className={styles.detailClose} onClick={() => setSelectedDeal(null)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className={styles.detailBody}>
              {/* Stage selector */}
              <div className={styles.detailStages}>
                {STAGES.map(s => (
                  <button key={s.id}
                    className={`${styles.detailStage} ${selected.stage === s.id ? styles.detailStageOn : ""}`}
                    style={selected.stage === s.id ? { borderColor: s.color, color: s.color, background: s.color + "08" } : {}}
                    onClick={() => { moveDeal(selected.id, s.id); }}>
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>

              <div className={styles.detailSection}>details</div>
              <div className={styles.detailGrid}>
                <div className={styles.detailField}><span className={styles.detailFieldLabel}>Value</span><span className={styles.detailFieldVal}>${selected.value.toLocaleString()}</span></div>
                <div className={styles.detailField}><span className={styles.detailFieldLabel}>Probability</span><span className={styles.detailFieldVal}>{selected.probability}%</span></div>
                <div className={styles.detailField}><span className={styles.detailFieldLabel}>Weighted</span><span className={styles.detailFieldVal}>${Math.round(selected.value * selected.probability / 100).toLocaleString()}</span></div>
                <div className={styles.detailField}><span className={styles.detailFieldLabel}>Days in stage</span><span className={styles.detailFieldVal}>{selected.daysInStage}</span></div>
                {selected.contact && <div className={styles.detailField}><span className={styles.detailFieldLabel}>Contact</span><span className={styles.detailFieldVal}>{selected.contact}</span></div>}
                {selected.source && <div className={styles.detailField}><span className={styles.detailFieldLabel}>Source</span><span className={styles.detailFieldVal}>{selected.source}</span></div>}
              </div>

              {selected.notes && (
                <>
                  <div className={styles.detailSection}>notes</div>
                  <div className={styles.detailNotes}>{selected.notes}</div>
                </>
              )}

              {/* Mark as Lost */}
              {selected.stage !== "completed" && !selected.lost && (
                <>
                  <div className={styles.detailSection}>actions</div>
                  {showLostPicker === selected.id ? (
                    <div className={styles.lostPicker}>
                      <div className={styles.lostPickerLabel}>Why was this deal lost?</div>
                      {LOST_REASONS.map(r => (
                        <button key={r.id} className={styles.lostPickerOption} onClick={() => markAsLost(selected.id, r.id)}>
                          {r.label}
                        </button>
                      ))}
                      <button className={styles.lostPickerCancel} onClick={() => setShowLostPicker(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button className={styles.lostBtn} onClick={() => setShowLostPicker(selected.id)}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                      Mark as Lost
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
