"use client";

import { useState } from "react";
import styles from "./ServicesPage.module.css";

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  unit: string;
  hours: number;
  popular?: boolean;
  includes: string[];
}

interface Service {
  id: string;
  name: string;
  emoji: string;
  color: string;
  desc: string;
  category: string;
  tiers: ServiceTier[];
  timesUsed: number;
  totalEarned: number;
  avgRating: number;
  lastUsed: string;
}

interface InvoiceItem {
  id: number;
  service: string;
  tier: string;
  price: number;
  unit: string;
  qty: number;
}

const INITIAL_SERVICES: Service[] = [
  {
    id: "s1", name: "Brand Identity", emoji: "◆", color: "#b07d4f",
    desc: "Full brand identity system including logo, colors, typography, and guidelines",
    category: "Design",
    tiers: [
      { id: "t1", name: "Essential", price: 2400, unit: "flat", hours: 24, includes: ["Logo (2 concepts)", "Color palette", "Typography", "Basic guidelines PDF"] },
      { id: "t2", name: "Complete", price: 4800, unit: "flat", hours: 48, popular: true, includes: ["Logo (4 concepts)", "Color palette", "Typography scale", "Full guidelines doc", "Social templates", "Business card design"] },
      { id: "t3", name: "Premium", price: 8500, unit: "flat", hours: 80, includes: ["Everything in Complete", "Brand strategy workshop", "Competitor audit", "Brand voice guide", "Presentation template", "Ongoing support (30 days)"] },
    ],
    timesUsed: 8, totalEarned: 28600, avgRating: 4.9, lastUsed: "Mar 20",
  },
  {
    id: "s2", name: "Website Design", emoji: "◇", color: "#5b7fa4",
    desc: "Custom website design from wireframes to polished mockups, ready for development",
    category: "Design",
    tiers: [
      { id: "t4", name: "Landing Page", price: 1800, unit: "flat", hours: 16, includes: ["1 page design", "Mobile responsive", "2 rounds of revisions"] },
      { id: "t5", name: "Multi-page", price: 4200, unit: "flat", hours: 40, popular: true, includes: ["Up to 5 pages", "Mobile responsive", "Design system", "3 rounds of revisions"] },
      { id: "t6", name: "Full Site", price: 7500, unit: "flat", hours: 72, includes: ["Up to 12 pages", "Design system", "Interactive prototypes", "Developer handoff", "Unlimited revisions"] },
    ],
    timesUsed: 5, totalEarned: 21000, avgRating: 4.8, lastUsed: "Mar 15",
  },
  {
    id: "s3", name: "Content & Copy", emoji: "✎", color: "#5a9a3c",
    desc: "Strategic copywriting for websites, emails, and marketing materials",
    category: "Writing",
    tiers: [
      { id: "t7", name: "Per page", price: 350, unit: "per page", hours: 3, includes: ["SEO-optimized copy", "1 round of revisions", "Meta descriptions"] },
      { id: "t8", name: "Email sequence", price: 1200, unit: "flat", hours: 12, popular: true, includes: ["6-part email sequence", "Subject line variants", "A/B test suggestions"] },
      { id: "t9", name: "Full website", price: 3500, unit: "flat", hours: 32, includes: ["All page copy", "CTAs and microcopy", "SEO strategy", "Content calendar"] },
    ],
    timesUsed: 12, totalEarned: 18400, avgRating: 5.0, lastUsed: "Mar 28",
  },
  {
    id: "s4", name: "Strategy Session", emoji: "◎", color: "#7c6b9e",
    desc: "Deep-dive consulting on brand, marketing, or product strategy",
    category: "Consulting",
    tiers: [
      { id: "t10", name: "Discovery", price: 500, unit: "flat", hours: 2, includes: ["90-min call", "Summary doc", "3 action items"] },
      { id: "t11", name: "Half-day", price: 1500, unit: "flat", hours: 4, popular: true, includes: ["4-hour workshop", "Strategic brief", "Roadmap", "Follow-up call"] },
      { id: "t12", name: "Retainer", price: 3000, unit: "per month", hours: 12, includes: ["Weekly 1:1 calls", "Async support", "Monthly report", "Priority access"] },
    ],
    timesUsed: 15, totalEarned: 22500, avgRating: 4.7, lastUsed: "Mar 25",
  },
  {
    id: "s5", name: "Social Media Kit", emoji: "⬡", color: "#8a7e63",
    desc: "Template sets for Instagram, LinkedIn, and other platforms",
    category: "Design",
    tiers: [
      { id: "t13", name: "Starter", price: 600, unit: "flat", hours: 6, includes: ["5 templates", "1 platform", "Brand-matched"] },
      { id: "t14", name: "Pro", price: 1400, unit: "flat", hours: 14, popular: true, includes: ["15 templates", "2 platforms", "Story + feed", "Canva files"] },
    ],
    timesUsed: 6, totalEarned: 7800, avgRating: 4.9, lastUsed: "Mar 10",
  },
];

const CATEGORIES = ["All", "Design", "Writing", "Consulting"];

export default function ServicesPage() {
  const [services] = useState(INITIAL_SERVICES);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("earned");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceClient, setInvoiceClient] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  const filtered = services
    .filter(s => category === "All" || s.category === category)
    .sort((a, b) => {
      if (sortBy === "earned") return b.totalEarned - a.totalEarned;
      if (sortBy === "used") return b.timesUsed - a.timesUsed;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const totalEarned = services.reduce((s, sv) => s + sv.totalEarned, 0);
  const totalUsed = services.reduce((s, sv) => s + sv.timesUsed, 0);
  const topService = [...services].sort((a, b) => b.totalEarned - a.totalEarned)[0];

  const addToInvoice = (service: Service, tier: ServiceTier) => {
    setInvoiceItems(prev => [...prev, { id: Date.now(), service: service.name, tier: tier.name, price: tier.price, unit: tier.unit, qty: 1 }]);
    setShowInvoice(true);
  };

  const invoiceTotal = invoiceItems.reduce((s, i) => s + i.price * i.qty, 0);
  const selected = services.find(s => s.id === selectedService);

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
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
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
          <div className={`${styles.statVal} ${styles.statEmber}`}>${Math.round(totalEarned / totalUsed).toLocaleString()}</div>
          <div className={styles.statLabel}>avg deal size</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{topService?.name}</div>
          <div className={styles.statLabel}>top earner</div>
          <div className={styles.statSub}>${((topService?.totalEarned || 0) / 1000).toFixed(1)}k lifetime</div>
        </div>
      </div>

      {/* Earned bar */}
      <div className={styles.earnedBar}>
        {services.sort((a, b) => b.totalEarned - a.totalEarned).map(s => (
          <div key={s.id} className={styles.earnedSeg} style={{ width: `${(s.totalEarned / totalEarned) * 100}%`, background: s.color }} />
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          {CATEGORIES.map(c => (
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
          {filtered.map(svc => {
            const maxEarned = Math.max(...services.map(s => s.totalEarned));
            return (
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
                      <div className={styles.cardStatVal}>{svc.timesUsed}×</div>
                      <div className={styles.cardStatLabel}>used</div>
                    </div>
                    <div className={styles.cardStat}>
                      <div className={styles.cardStatVal}>{svc.lastUsed}</div>
                      <div className={styles.cardStatLabel}>last used</div>
                    </div>
                  </div>

                  <div className={styles.cardEarnBar}>
                    <div className={styles.cardEarnFill} style={{ width: `${(svc.totalEarned / maxEarned) * 100}%`, background: svc.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <>
          <div className={styles.overlay} onClick={() => setSelectedService(null)} />
          <div className={styles.detail}>
            <div className={styles.detailHead}>
              <div className={styles.detailIcon} style={{ background: selected.color + "0a", color: selected.color, border: `1px solid ${selected.color}15` }}>{selected.emoji}</div>
              <div className={styles.detailInfo}>
                <div className={styles.detailName}>{selected.name}</div>
                <div className={styles.detailCat}>{selected.category}</div>
                <div className={styles.detailDesc}>{selected.desc}</div>
              </div>
              <button className={styles.detailClose} onClick={() => setSelectedService(null)}>
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
                          <span className={styles.detailTierCheck}>✓</span>{inc}
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
                  <div className={`${styles.detailStatVal} ${styles.statEmber}`}>${Math.round(selected.totalEarned / selected.timesUsed).toLocaleString()}</div>
                  <div className={styles.detailStatLabel}>avg per invoice</div>
                </div>
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
          <input className={styles.invoiceClientInput} placeholder="Client name or email..." value={invoiceClient} onChange={e => setInvoiceClient(e.target.value)} />
          <div className={styles.invoiceItems}>
            {invoiceItems.map(item => (
              <div key={item.id} className={styles.invoiceItem}>
                <span className={styles.invoiceItemName}>{item.service}</span>
                <span className={styles.invoiceItemTier}>{item.tier}</span>
                <span className={styles.invoiceItemPrice}>${item.price.toLocaleString()}</span>
                <button className={styles.invoiceItemRemove} onClick={() => setInvoiceItems(prev => prev.filter(i => i.id !== item.id))}>×</button>
              </div>
            ))}
          </div>
          <div className={styles.invoiceTotal}>
            <span className={styles.invoiceTotalLabel}>total</span>
            <span className={styles.invoiceTotalVal}>${invoiceTotal.toLocaleString()}</span>
          </div>
          <div className={styles.invoiceActions}>
            <button className={`${styles.invoiceBtn} ${styles.invoiceBtnSend}`}>Send Invoice</button>
            <button className={`${styles.invoiceBtn} ${styles.invoiceBtnGhost}`}>Save Draft</button>
          </div>
          <div className={styles.invoiceHint}>Processed via Stripe · 2.9% fee · Client receives a payment link</div>
        </div>
      )}
    </div>
  );
}
