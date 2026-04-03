"use client";

import { useState } from "react";
import styles from "./ProductsTab.module.css";

interface Product {
  id: string; name: string; emoji: string; category: string;
  price: number; priceType: "fixed" | "hourly"; currency: string;
  description: string; deliverables: string[];
  timeline: string; revisions: number;
  sold: number; revenue: number; lastSold: string | null;
  tags: string[]; status: "active" | "draft";
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Brand Identity System", emoji: "\u25c6", category: "design", price: 4800, priceType: "fixed", currency: "$", description: "Complete visual identity including logo, color system, typography, and brand guidelines document.", deliverables: ["Logo (3 concepts \u2192 1 final)", "Color palette (primary + secondary)", "Typography system", "Brand guidelines PDF", "Social media templates"], timeline: "2-3 weeks", revisions: 2, sold: 8, revenue: 38400, lastSold: "Mar 15", tags: ["popular", "featured"], status: "active" },
  { id: "p2", name: "Website Design", emoji: "\u25c7", category: "design", price: 120, priceType: "hourly", currency: "$", description: "Custom website design from wireframes to high-fidelity mockups. Figma deliverables with developer handoff.", deliverables: ["Wireframes (mobile + desktop)", "High-fidelity mockups", "Interactive prototype", "Design system components", "Developer handoff (Figma)"], timeline: "3-4 weeks", revisions: 3, sold: 5, revenue: 14400, lastSold: "Feb 28", tags: [], status: "active" },
  { id: "p3", name: "Content Strategy", emoji: "\u270e", category: "content", price: 2400, priceType: "fixed", currency: "$", description: "6-month content roadmap with editorial calendar, topic clusters, and distribution strategy.", deliverables: ["Content audit", "Editorial calendar (6mo)", "Topic cluster map", "Distribution playbook", "Monthly analytics template"], timeline: "1-2 weeks", revisions: 1, sold: 3, revenue: 7200, lastSold: "Jan 20", tags: [], status: "active" },
  { id: "p4", name: "Blog Post", emoji: "\u25a4", category: "content", price: 450, priceType: "fixed", currency: "$", description: "SEO-optimized long-form blog post (1500-2500 words) with research, outline, draft, and final copy.", deliverables: ["Keyword research", "Outline", "First draft", "Final copy", "Meta description + title tags"], timeline: "3-5 days", revisions: 2, sold: 24, revenue: 10800, lastSold: "Apr 1", tags: ["popular"], status: "active" },
  { id: "p5", name: "UX Audit", emoji: "\u25ce", category: "consulting", price: 1800, priceType: "fixed", currency: "$", description: "Comprehensive usability review of your product with heuristic analysis, user flow mapping, and prioritized recommendations.", deliverables: ["Heuristic evaluation", "User flow analysis", "Competitive benchmark", "Recommendations deck", "Priority matrix"], timeline: "1 week", revisions: 1, sold: 6, revenue: 10800, lastSold: "Mar 8", tags: [], status: "active" },
  { id: "p6", name: "Discovery Session", emoji: "\u25b6", category: "consulting", price: 350, priceType: "fixed", currency: "$", description: "90-minute deep-dive session to understand your business, goals, and design needs. Includes summary document.", deliverables: ["90-min video call", "Discovery questionnaire", "Summary & recommendations doc", "Next steps roadmap"], timeline: "1 day", revisions: 0, sold: 14, revenue: 4900, lastSold: "Mar 30", tags: ["starter"], status: "active" },
  { id: "p7", name: "Social Media Kit", emoji: "\u229e", category: "design", price: 1200, priceType: "fixed", currency: "$", description: "Template pack for Instagram, LinkedIn, and Twitter. 12 layouts in Figma with brand customization.", deliverables: ["12 post templates", "4 story templates", "Cover/banner templates", "Figma source files", "Usage guide"], timeline: "1 week", revisions: 2, sold: 4, revenue: 4800, lastSold: "Feb 10", tags: [], status: "draft" },
  { id: "p8", name: "Pitch Deck Design", emoji: "\u2192", category: "design", price: 2000, priceType: "fixed", currency: "$", description: "10-15 slide investor or sales deck. Custom designed with your brand, data visualization, and narrative flow.", deliverables: ["Narrative structure", "10-15 custom slides", "Data visualizations", "Speaker notes", "PDF + Keynote export"], timeline: "1-2 weeks", revisions: 2, sold: 0, revenue: 0, lastSold: null, tags: ["new"], status: "active" },
];

const CATEGORIES = [
  { id: "all", label: "All Products", count: PRODUCTS.length },
  { id: "design", label: "Design", count: PRODUCTS.filter(p => p.category === "design").length },
  { id: "content", label: "Content", count: PRODUCTS.filter(p => p.category === "content").length },
  { id: "consulting", label: "Consulting", count: PRODUCTS.filter(p => p.category === "consulting").length },
];

export default function ProductsTab() {
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string | null>("p1");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS
    .filter(p => category === "all" || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const product = selected ? PRODUCTS.find(p => p.id === selected) ?? null : null;
  const totalRevenue = PRODUCTS.reduce((s, p) => s + p.revenue, 0);
  const totalSold = PRODUCTS.reduce((s, p) => s + p.sold, 0);

  return (
    <div className={styles.products}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <div className={styles.title}>Products</div>
            <div className={styles.subtitle}>Your services as shippable products. Attach to proposals, contracts, and invoices.</div>
          </div>
          <div className={styles.headerActions}>
            <button className={`${styles.btn} ${styles.btnGhost}`}>Import</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>+ New Product</button>
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}><span className={styles.metricVal}>{PRODUCTS.filter(p => p.status === "active").length}</span><span className={styles.metricLabel}>Active products</span></div>
          <div className={styles.metric}><span className={styles.metricVal}>{totalSold}</span><span className={styles.metricLabel}>Total sold</span></div>
          <div className={styles.metric}><span className={`${styles.metricVal} ${styles.metricGreen}`}>${(totalRevenue / 1000).toFixed(1)}k</span><span className={styles.metricLabel}>Lifetime revenue</span></div>
          <div className={styles.metric}><span className={styles.metricVal}>${totalSold > 0 ? Math.round(totalRevenue / totalSold) : 0}</span><span className={styles.metricLabel}>Avg order value</span></div>
        </div>

        <div className={styles.filters}>
          <div className={styles.cats}>
            {CATEGORIES.map(c => (
              <div key={c.id} className={`${styles.cat} ${category === c.id ? styles.catOn : ""}`} onClick={() => setCategory(c.id)}>
                {c.label}<span className={styles.catCount}>{c.count}</span>
              </div>
            ))}
          </div>
          <div className={styles.search}>
            <span className={styles.searchIcon}>{"\u2315"}</span>
            <input className={styles.searchInput} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className={styles.viewToggle}>
            <button className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnOn : ""}`} onClick={() => setViewMode("grid")}>{"\u229e"}</button>
            <button className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnOn : ""}`} onClick={() => setViewMode("list")}>{"\u2261"}</button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className={styles.main}>
        <div className={styles.gridArea}>
          {viewMode === "grid" ? (
            <div className={styles.grid}>
              {filtered.map(p => (
                <div key={p.id} className={`${styles.card} ${selected === p.id ? styles.cardSelected : ""} ${p.status === "draft" ? styles.cardDraft : ""}`} onClick={() => setSelected(p.id)}>
                  <div className={styles.cardTags}>
                    {p.tags.map(t => <span key={t} className={`${styles.tag} ${styles[`tag${t.charAt(0).toUpperCase() + t.slice(1)}`] || ""}`}>{t}</span>)}
                    {p.status === "draft" && <span className={`${styles.tag} ${styles.tagDraftLabel}`}>draft</span>}
                  </div>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardEmoji}>{p.emoji}</div>
                    <div className={styles.cardInfo}><div className={styles.cardName}>{p.name}</div><div className={styles.cardCat}>{p.category}</div></div>
                  </div>
                  <div className={styles.cardBody}><div className={styles.cardDesc}>{p.description}</div></div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{p.currency}{p.price.toLocaleString()}<span className={styles.cardPriceType}>{p.priceType === "hourly" ? "/hr" : " fixed"}</span></span>
                    <div className={styles.cardStats}><span>{p.sold} sold</span><span className={styles.cardStatDot} /><span>${(p.revenue / 1000).toFixed(1)}k</span></div>
                  </div>
                </div>
              ))}
              <div className={styles.addCard}>
                <span className={styles.addIcon}>+</span>
                <span className={styles.addLabel}>New Product</span>
                <span className={styles.addDesc}>Define a service you offer</span>
              </div>
            </div>
          ) : (
            <div className={styles.list}>
              <div className={styles.listHd}><span style={{ width: 32 }} /><span style={{ flex: 1 }}>Product</span><span style={{ width: 80, textAlign: "right" }}>Price</span><span style={{ width: 50, textAlign: "right" }}>Sold</span><span style={{ width: 60, textAlign: "right" }}>Revenue</span><span style={{ width: 60, textAlign: "right" }}>Status</span></div>
              {filtered.map(p => (
                <div key={p.id} className={`${styles.listRow} ${selected === p.id ? styles.listRowSelected : ""}`} onClick={() => setSelected(p.id)}>
                  <div className={`${styles.listEmoji} ${selected === p.id ? styles.listEmojiSelected : ""}`}>{p.emoji}</div>
                  <div className={styles.listInfo}><div className={styles.listName}>{p.name}</div><div className={styles.listCat}>{p.category}{p.tags.length > 0 ? ` \u00b7 ${p.tags.join(", ")}` : ""}</div></div>
                  <div className={styles.listPrice}>${p.price.toLocaleString()}<div className={styles.listPriceType}>{p.priceType === "hourly" ? "/hr" : "fixed"}</div></div>
                  <div className={styles.listSold}>{p.sold}{"\u00d7"}</div>
                  <div className={styles.listRev}>${(p.revenue / 1000).toFixed(1)}k</div>
                  <div className={styles.listStatus}><span className={`${styles.statusDot} ${p.status === "active" ? styles.statusActive : styles.statusDraftDot}`}>{p.status}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {product && (
          <div className={styles.detail}>
            <div className={styles.detailHd}>
              <div className={styles.detailEmoji}>{product.emoji}</div>
              <div className={styles.detailInfo}><div className={styles.detailName}>{product.name}</div><div className={styles.detailCat}>{product.category}{product.tags.length > 0 ? ` \u00b7 ${product.tags.join(", ")}` : ""}</div></div>
              <div className={styles.detailClose} onClick={() => setSelected(null)}>{"\u00d7"}</div>
            </div>
            <div className={styles.detailBody}>
              <div className={styles.sec}><div className={styles.priceDisplay}><span className={styles.priceVal}>{product.currency}{product.price.toLocaleString()}</span><span className={styles.priceType}>{product.priceType === "hourly" ? "per hour" : "fixed price"}</span></div></div>
              <div className={styles.sec}>
                <div className={styles.statGrid}>
                  <div className={styles.stat}><div className={styles.statVal}>{product.sold}</div><div className={styles.statLabel}>Sold</div></div>
                  <div className={styles.stat}><div className={`${styles.statVal} ${styles.metricGreen}`}>${(product.revenue / 1000).toFixed(1)}k</div><div className={styles.statLabel}>Revenue</div></div>
                  <div className={styles.stat}><div className={styles.statVal}>{product.lastSold || "\u2014"}</div><div className={styles.statLabel}>Last sold</div></div>
                </div>
                {product.revenue > 0 && <div className={styles.revBar}><div className={styles.revFill} style={{ width: `${(product.revenue / totalRevenue) * 100}%` }} /></div>}
                {product.revenue > 0 && <div className={styles.revPct}>{Math.round((product.revenue / totalRevenue) * 100)}% of lifetime revenue</div>}
              </div>
              <div className={styles.sec}><div className={styles.secLabel}>Description</div><div className={styles.desc}>{product.description}</div></div>
              <div className={styles.sec}>
                <div className={styles.secLabel}>Deliverables {"\u00b7"} {product.deliverables.length} items</div>
                {product.deliverables.map((d, i) => (<div key={i} className={styles.deliverable}><div className={styles.delCheck}>{"\u2713"}</div><span>{d}</span></div>))}
              </div>
              <div className={styles.sec}>
                <div className={styles.secLabel}>Details</div>
                <div className={styles.metaGrid}>
                  <div><div className={styles.metaLabel}>Timeline</div><div className={styles.metaVal}>{product.timeline}</div></div>
                  <div><div className={styles.metaLabel}>Revisions</div><div className={styles.metaVal}>{product.revisions} included</div></div>
                  <div><div className={styles.metaLabel}>Category</div><div className={styles.metaVal} style={{ textTransform: "capitalize" }}>{product.category}</div></div>
                  <div><div className={styles.metaLabel}>Status</div><div className={styles.metaVal} style={{ textTransform: "capitalize", color: product.status === "active" ? "#26a69a" : "#a5a49f" }}>{product.status}</div></div>
                </div>
              </div>
              <div className={styles.sec}>
                <div className={styles.actions}>
                  <button className={`${styles.actionBtn} ${styles.actionSend}`}>$ Send as Invoice</button>
                  <button className={`${styles.actionBtn} ${styles.actionPrimary}`}>{"\u2192"} Add to Proposal</button>
                  <button className={`${styles.actionBtn} ${styles.actionGhost}`}>Copy Checkout Link</button>
                  <button className={`${styles.actionBtn} ${styles.actionGhost}`}>Edit Product</button>
                  <button className={`${styles.actionBtn} ${styles.actionGhost}`}>Duplicate</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
