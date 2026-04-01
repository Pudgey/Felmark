"use client";

import { useState, useMemo } from "react";
import type { Service, ServiceTier, Workspace, Invoice, InvoiceItem } from "@/lib/types";
import { uid } from "@/lib/utils";
import styles from "./ServicesPage.module.css";
import ServiceModal from "./ServiceModal";

const CATEGORIES = ["All", "Design", "Writing", "Consulting", "Development", "Marketing", "Other"];

interface ServicesPageProps {
  services: Service[];
  invoices: Invoice[];
  workspaces: Workspace[];
  onAddService: (service: Service) => void;
  onUpdateService: (id: string, updates: Partial<Service>) => void;
  onDeleteService: (id: string) => void;
  onAddInvoice: (invoice: Invoice) => void;
}

export default function ServicesPage({ services, invoices, workspaces, onAddService, onUpdateService, onDeleteService, onAddInvoice }: ServicesPageProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("earned");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceWorkspaceId, setInvoiceWorkspaceId] = useState("");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceDropdownOpen, setInvoiceDropdownOpen] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() =>
    services
      .filter(s => category === "All" || s.category === category)
      .sort((a, b) => {
        if (sortBy === "earned") return b.totalEarned - a.totalEarned;
        if (sortBy === "used") return b.timesUsed - a.timesUsed;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      }),
    [services, category, sortBy]
  );

  const totalEarned = services.reduce((s, sv) => s + sv.totalEarned, 0);
  const totalUsed = services.reduce((s, sv) => s + sv.timesUsed, 0);
  const topService = useMemo(() => [...services].sort((a, b) => b.totalEarned - a.totalEarned)[0], [services]);
  // D1: guard division by zero
  const avgDealSize = totalUsed > 0 ? Math.round(totalEarned / totalUsed) : 0;
  // D1: compute maxEarned once before .map()
  const maxEarned = useMemo(() => Math.max(...services.map(s => s.totalEarned), 1), [services]);
  // D1: spread before sort for earned bar
  const sortedForBar = useMemo(() => [...services].sort((a, b) => b.totalEarned - a.totalEarned), [services]);

  const addToInvoice = (service: Service, tier: ServiceTier) => {
    setInvoiceItems(prev => [...prev, { id: Date.now(), service: service.name, tier: tier.name, price: tier.price, unit: tier.unit, qty: 1 }]);
    setShowInvoice(true);
  };

  const invoiceTotal = invoiceItems.reduce((s, i) => s + i.price * i.qty, 0);
  const selected = services.find(s => s.id === selectedService);

  // D4: workspace picker for invoices
  const personalWorkspaces = workspaces.filter(w => w.personal);
  const clientWorkspaces = workspaces.filter(w => !w.personal).sort((a, b) => a.client.localeCompare(b.client));
  const allPickerWorkspaces = [...personalWorkspaces, ...clientWorkspaces];
  const filteredWorkspaces = invoiceSearch
    ? allPickerWorkspaces.filter(w => w.client.toLowerCase().includes(invoiceSearch.toLowerCase()))
    : allPickerWorkspaces;
  const selectedWorkspace = workspaces.find(w => w.id === invoiceWorkspaceId);

  // D5: send invoice
  const handleSendInvoice = () => {
    if (!invoiceWorkspaceId || invoiceItems.length === 0) return;
    const invoice: Invoice = {
      id: uid(),
      client: selectedWorkspace?.client || "",
      workspaceId: invoiceWorkspaceId,
      items: invoiceItems,
      total: invoiceTotal,
      status: "sent",
      createdAt: new Date().toISOString(),
    };
    onAddInvoice(invoice);
    // Increment timesUsed on each service referenced
    const serviceNames = new Set(invoiceItems.map(i => i.service));
    services.forEach(svc => {
      if (serviceNames.has(svc.name)) {
        onUpdateService(svc.id, { timesUsed: svc.timesUsed + 1, totalEarned: svc.totalEarned + invoiceItems.filter(i => i.service === svc.name).reduce((s, i) => s + i.price * i.qty, 0), lastUsed: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
      }
    });
    setInvoiceItems([]);
    setShowInvoice(false);
    setInvoiceWorkspaceId("");
  };

  // D5: save draft
  const handleSaveDraft = () => {
    if (invoiceItems.length === 0) return;
    const invoice: Invoice = {
      id: uid(),
      client: selectedWorkspace?.client || "Draft",
      workspaceId: invoiceWorkspaceId,
      items: invoiceItems,
      total: invoiceTotal,
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    onAddInvoice(invoice);
    setInvoiceItems([]);
    setShowInvoice(false);
    setInvoiceWorkspaceId("");
  };

  // D3: save service (create or update)
  const handleSaveService = (service: Service) => {
    if (editingService) {
      onUpdateService(service.id, service);
    } else {
      onAddService(service);
    }
    setEditingService(null);
  };

  // D6: delete handler
  const handleDeleteConfirm = (id: string) => {
    const svc = services.find(s => s.id === id);
    if (svc?.builtIn) return;
    onDeleteService(id);
    setConfirmDelete(null);
    setSelectedService(null);
  };

  // Get active categories from services
  const activeCategories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return CATEGORIES.filter(c => c === "All" || cats.has(c));
  }, [services]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.head}>
        <span className={styles.title}>Services</span>
        <div className={styles.headRight}>
          {invoiceItems.length > 0 && (
            <button className={styles.btn} onClick={() => setShowInvoice(true)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2h6l2 2v6H2V2z" stroke="currentColor" strokeWidth="1" /></svg>
              Invoice ({invoiceItems.length})
            </button>
          )}
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => { setEditingService(null); setShowServiceModal(true); }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            New Service
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={`${styles.statVal} ${styles.statGreen}`}>${(totalEarned / 1000).toFixed(1)}k</div>
          <div className={styles.statLabel}>total earned</div>
          <div className={styles.statSub}>across {services.length} services</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{totalUsed}</div>
          <div className={styles.statLabel}>times invoiced</div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statVal} ${styles.statEmber}`}>${avgDealSize.toLocaleString()}</div>
          <div className={styles.statLabel}>avg deal size</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{topService?.name || "\u2014"}</div>
          <div className={styles.statLabel}>top earner</div>
          <div className={styles.statSub}>${((topService?.totalEarned || 0) / 1000).toFixed(1)}k lifetime</div>
        </div>
      </div>

      {/* D1: Earned bar — spread before sort */}
      <div className={styles.earnedBar}>
        {sortedForBar.map(s => (
          <div key={s.id} className={styles.earnedSeg} style={{ width: `${totalEarned > 0 ? (s.totalEarned / totalEarned) * 100 : 0}%`, background: s.color }} />
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {activeCategories.map(c => (
            <button key={c} className={`${styles.filter} ${category === c ? styles.filterOn : ""}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className={styles.sort}>
          <span className={styles.sortLabel}>Sort:</span>
          <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="earned">Most earned</option>
            <option value="used">Most used</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.content}>
        <div className={styles.grid}>
          {filtered.map(svc => (
              <div key={svc.id} className={`${styles.card} ${hoveredCard === svc.id ? styles.cardHovered : ""}`}
                onMouseEnter={() => setHoveredCard(svc.id)} onMouseLeave={() => setHoveredCard(null)}
                onClick={() => { setSelectedService(svc.id); setSelectedTier(svc.tiers.find(t => t.popular)?.id || svc.tiers[0]?.id); }}>
                <div className={styles.cardAccent} style={{ background: svc.color }} />
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <div className={styles.cardIcon} style={{ background: svc.color + "0a", color: svc.color, border: `1px solid ${svc.color}15` }}>{svc.emoji}</div>
                    <div>
                      <div className={styles.cardName}>{svc.name}</div>
                      <div className={styles.cardCat}>{svc.category}</div>
                    </div>
                  </div>
                  <div className={styles.cardDesc}>{svc.desc}</div>

                  {/* Tier previews */}
                  <div className={styles.cardTiers}>
                    {svc.tiers.map(t => (
                      <div key={t.id} className={`${styles.cardTier} ${t.popular ? styles.cardTierPopular : ""}`}
                        onClick={e => { e.stopPropagation(); addToInvoice(svc, t); }}>
                        {t.popular && <span className={styles.cardTierPop}>POPULAR</span>}
                        <div className={styles.cardTierName}>{t.name}</div>
                        <div className={styles.cardTierPrice}>${t.price.toLocaleString()}</div>
                        <div className={styles.cardTierUnit}>{t.unit}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className={styles.cardStats}>
                    <div className={styles.cardStat}>
                      <div className={`${styles.cardStatVal} ${styles.statGreen}`}>${(svc.totalEarned / 1000).toFixed(1)}k</div>
                      <div className={styles.cardStatLabel}>earned</div>
                    </div>
                    <div className={styles.cardStat}>
                      <div className={styles.cardStatVal}>{svc.timesUsed}&times;</div>
                      <div className={styles.cardStatLabel}>used</div>
                    </div>
                    <div className={styles.cardStat}>
                      <div className={styles.cardStatVal}>{svc.lastUsed}</div>
                      <div className={styles.cardStatLabel}>last used</div>
                    </div>
                  </div>

                  {/* D1: maxEarned computed once outside loop */}
                  <div className={styles.cardEarnBar}>
                    <div className={styles.cardEarnFill} style={{ width: `${(svc.totalEarned / maxEarned) * 100}%`, background: svc.color }} />
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <>
          <div className={styles.overlay} onClick={() => { setSelectedService(null); setConfirmDelete(null); }} />
          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <div className={styles.detailIcon} style={{ background: selected.color + "0a", color: selected.color, border: `1px solid ${selected.color}15` }}>{selected.emoji}</div>
              <div className={styles.detailInfo}>
                <div className={styles.detailName}>{selected.name}</div>
                <div className={styles.detailCat}>{selected.category}</div>
                <div className={styles.detailDesc}>{selected.desc}</div>
              </div>
              <button className={styles.detailClose} onClick={() => { setSelectedService(null); setConfirmDelete(null); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className={styles.detailBody}>
              <div className={styles.section}>choose a tier</div>
              <div className={styles.detailTiers}>
                {selected.tiers.map(t => (
                  <div key={t.id} className={`${styles.detailTier} ${selectedTier === t.id ? styles.detailTierOn : ""}`}
                    onClick={() => setSelectedTier(t.id)}>
                    {t.popular && <span className={styles.detailTierPop}>MOST POPULAR</span>}
                    <div className={styles.detailTierName}>{t.name}</div>
                    <div className={styles.detailTierPriceRow}>
                      <span className={styles.detailTierPrice}>${t.price.toLocaleString()}</span>
                      <span className={styles.detailTierUnit}>{t.unit}</span>
                    </div>
                    <div className={styles.detailTierHours}>~{t.hours} hours</div>
                    <div className={styles.detailTierIncludes}>
                      {t.includes.map((inc, i) => (
                        <div key={i} className={styles.detailTierInclude}>
                          <span className={styles.detailTierCheck}>{"\u2713"}</span>{inc}
                        </div>
                      ))}
                    </div>
                    <button className={`${styles.detailTierSelect} ${selectedTier === t.id ? styles.detailTierSelectActive : ""}`}
                      onClick={e => { e.stopPropagation(); addToInvoice(selected, t); }}>
                      {selectedTier === t.id ? "Add to Invoice" : "Select"}
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.section}>performance</div>
              <div className={styles.detailStats}>
                <div className={styles.detailStatCard}>
                  <div className={`${styles.detailStatVal} ${styles.statGreen}`}>${(selected.totalEarned / 1000).toFixed(1)}k</div>
                  <div className={styles.detailStatLabel}>lifetime earned</div>
                </div>
                <div className={styles.detailStatCard}>
                  <div className={styles.detailStatVal}>{selected.timesUsed}</div>
                  <div className={styles.detailStatLabel}>times invoiced</div>
                </div>
                <div className={styles.detailStatCard}>
                  {/* D1: guard division by zero */}
                  <div className={`${styles.detailStatVal} ${styles.statEmber}`}>${selected.timesUsed > 0 ? Math.round(selected.totalEarned / selected.timesUsed).toLocaleString() : "0"}</div>
                  <div className={styles.detailStatLabel}>avg per invoice</div>
                </div>
              </div>

              {/* D3: Edit button + D6: Delete button */}
              <div className={styles.section}>actions</div>
              <div className={styles.detailActions}>
                <button className={styles.detailEditBtn} onClick={() => { setEditingService(selected); setShowServiceModal(true); setSelectedService(null); }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Edit Service
                </button>
                {!selected.builtIn && (
                  confirmDelete === selected.id ? (
                    <div className={styles.deleteConfirm}>
                      <span className={styles.deleteConfirmText}>Delete this service?</span>
                      <button className={styles.deleteConfirmYes} onClick={() => handleDeleteConfirm(selected.id)}>Yes, delete</button>
                      <button className={styles.deleteConfirmNo} onClick={() => setConfirmDelete(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button className={styles.detailDeleteBtn} onClick={() => setConfirmDelete(selected.id)}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3.5h6M4.5 3.5V2.5h3v1M4.5 5v4M7.5 5v4M3.5 3.5l.5 7h4l.5-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      Delete
                    </button>
                  )
                )}
                {selected.builtIn && (
                  <span className={styles.builtInBadge}>Built-in service</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Invoice drawer */}
      {showInvoice && invoiceItems.length > 0 && (
        <div className={styles.invoiceDrawer}>
          <div className={styles.invoiceHead}>
            <span className={styles.invoiceTitle}>Quick Invoice</span>
            <button className={styles.invoiceClose} onClick={() => setShowInvoice(false)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </button>
          </div>

          {/* D4: workspace/client picker dropdown */}
          <div className={styles.invoiceClientPicker}>
            <div
              className={styles.invoiceClientSelected}
              onClick={() => setInvoiceDropdownOpen(!invoiceDropdownOpen)}
            >
              {selectedWorkspace ? (
                <span className={styles.invoiceClientName}>
                  <span className={styles.invoiceClientAvatar} style={{ background: selectedWorkspace.avatarBg }}>{selectedWorkspace.avatar}</span>
                  {selectedWorkspace.client}
                </span>
              ) : (
                <span className={styles.invoiceClientPlaceholder}>Select a client...</span>
              )}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: invoiceDropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            {invoiceDropdownOpen && (
              <div className={styles.invoiceDropdown}>
                <input
                  className={styles.invoiceSearchInput}
                  placeholder="Search clients..."
                  value={invoiceSearch}
                  onChange={e => setInvoiceSearch(e.target.value)}
                  autoFocus
                />
                <div className={styles.invoiceDropdownList}>
                  {filteredWorkspaces.map(w => (
                    <button
                      key={w.id}
                      className={`${styles.invoiceDropdownItem} ${invoiceWorkspaceId === w.id ? styles.invoiceDropdownItemOn : ""}`}
                      onClick={() => { setInvoiceWorkspaceId(w.id); setInvoiceDropdownOpen(false); setInvoiceSearch(""); }}
                    >
                      <span className={styles.invoiceClientAvatar} style={{ background: w.avatarBg }}>{w.avatar}</span>
                      {w.client}
                      {w.personal && <span className={styles.invoicePersonalBadge}>Personal</span>}
                    </button>
                  ))}
                  {filteredWorkspaces.length === 0 && (
                    <div className={styles.invoiceNoResults}>No clients found</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className={styles.invoiceItems}>
            {invoiceItems.map(item => (
              <div key={item.id} className={styles.invoiceItem}>
                <span className={styles.invoiceItemName}>{item.service}</span>
                <span className={styles.invoiceItemTier}>{item.tier}</span>
                <span className={styles.invoiceItemPrice}>${item.price.toLocaleString()}</span>
                <button className={styles.invoiceItemRemove} onClick={() => setInvoiceItems(prev => prev.filter(i => i.id !== item.id))}>&times;</button>
              </div>
            ))}
          </div>
          <div className={styles.invoiceTotal}>
            <span className={styles.invoiceTotalLabel}>total</span>
            <span className={styles.invoiceTotalVal}>${invoiceTotal.toLocaleString()}</span>
          </div>
          <div className={styles.invoiceActions}>
            <button className={`${styles.invoiceBtn} ${styles.invoiceBtnSend}`} onClick={handleSendInvoice}>Send Invoice</button>
            <button className={`${styles.invoiceBtn} ${styles.invoiceBtnGhost}`} onClick={handleSaveDraft}>Save Draft</button>
          </div>
          <div className={styles.invoiceHint}>Processed via Stripe &middot; 2.9% fee &middot; Client receives a payment link</div>
        </div>
      )}

      {/* D3: Service modal (create/edit) */}
      <ServiceModal
        open={showServiceModal}
        onClose={() => { setShowServiceModal(false); setEditingService(null); }}
        onSave={handleSaveService}
        editService={editingService}
      />
    </div>
  );
}
