import { useState, useRef } from "react";

const INITIAL_SERVICES = [
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

export default function Services() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("grid"); // grid | list
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceClient, setInvoiceClient] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [sortBy, setSortBy] = useState("earned"); // earned | used | name | recent
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const addToInvoice = (service, tier) => {
    setInvoiceItems(prev => [...prev, { id: Date.now(), service: service.name, tier: tier.name, price: tier.price, unit: tier.unit, qty: 1 }]);
    setShowInvoice(true);
  };

  const removeInvoiceItem = (id) => setInvoiceItems(prev => prev.filter(i => i.id !== id));
  const invoiceTotal = invoiceItems.reduce((s, i) => s + i.price * i.qty, 0);

  const selected = services.find(s => s.id === selectedService);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
        }

        .svc {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
        }

        /* ── Header ── */
        .svc-head {
          padding: 16px 32px; border-bottom: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .svc-head-left { display: flex; align-items: center; gap: 16px; }
        .svc-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); }
        .svc-head-right { display: flex; align-items: center; gap: 8px; }
        .svc-btn { padding: 7px 16px; border-radius: 6px; font-size: 12.5px; font-weight: 500; font-family: inherit; cursor: pointer; transition: all 0.1s; border: 1px solid var(--warm-200); background: #fff; color: var(--ink-600); display: flex; align-items: center; gap: 5px; }
        .svc-btn:hover { background: var(--warm-50); border-color: var(--warm-300); }
        .svc-btn.primary { background: var(--ember); border-color: var(--ember); color: #fff; }
        .svc-btn.primary:hover { background: var(--ember-light); }

        /* ── Stats ── */
        .svc-stats {
          display: flex; gap: 0; border-bottom: 1px solid var(--warm-200);
          flex-shrink: 0;
        }
        .svc-stat {
          flex: 1; padding: 16px 24px; border-right: 1px solid var(--warm-100);
          transition: background 0.06s;
        }
        .svc-stat:last-child { border-right: none; }
        .svc-stat:hover { background: var(--warm-50); }
        .svc-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--ink-900); line-height: 1; }
        .svc-stat-val.green { color: #5a9a3c; }
        .svc-stat-val.ember { color: var(--ember); }
        .svc-stat-label { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 4px; }
        .svc-stat-sub { font-size: 11px; color: var(--ink-300); margin-top: 2px; }

        /* ── Earned bar ── */
        .svc-earned-bar { display: flex; height: 4px; flex-shrink: 0; }
        .svc-earned-seg { transition: width 0.4s ease; min-width: 2px; }

        /* ── Toolbar ── */
        .svc-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 32px; border-bottom: 1px solid var(--warm-100);
          flex-shrink: 0;
        }
        .svc-filters { display: flex; gap: 2px; }
        .svc-filter {
          padding: 5px 12px; border-radius: 4px; font-size: 12px;
          border: none; cursor: pointer; font-family: inherit;
          color: var(--ink-400); background: none; transition: all 0.08s;
        }
        .svc-filter:hover { background: var(--warm-100); }
        .svc-filter.on { background: var(--ink-900); color: var(--parchment); }
        .svc-sort { display: flex; align-items: center; gap: 6px; }
        .svc-sort-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); }
        .svc-sort-select {
          padding: 4px 8px; border: 1px solid var(--warm-200); border-radius: 4px;
          font-family: var(--mono); font-size: 11px; color: var(--ink-600);
          background: #fff; cursor: pointer; outline: none;
        }

        /* ── Grid ── */
        .svc-content { flex: 1; overflow-y: auto; padding: 24px 32px; }
        .svc-content::-webkit-scrollbar { width: 5px; }
        .svc-content::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .svc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }

        /* ── Service card ── */
        .svc-card {
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 12px; overflow: hidden; cursor: pointer;
          transition: all 0.15s; position: relative;
        }
        .svc-card:hover { border-color: var(--warm-300); box-shadow: 0 4px 20px rgba(0,0,0,0.04); transform: translateY(-2px); }
        .svc-card.hovered { border-color: var(--ember); box-shadow: 0 4px 24px rgba(176,125,79,0.08); }

        .svc-card-accent { height: 3px; }

        .svc-card-body { padding: 20px 22px 16px; }

        .svc-card-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px; }
        .svc-card-icon {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .svc-card-info { flex: 1; }
        .svc-card-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: var(--ink-900); line-height: 1.2; }
        .svc-card-cat { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-top: 2px; }
        .svc-card-desc { font-size: 13px; color: var(--ink-500); line-height: 1.5; margin-bottom: 14px; }

        /* Tiers preview */
        .svc-card-tiers { display: flex; gap: 6px; margin-bottom: 14px; }
        .svc-card-tier {
          flex: 1; padding: 10px; border: 1px solid var(--warm-200);
          border-radius: 7px; text-align: center; transition: all 0.1s;
          cursor: pointer; position: relative;
        }
        .svc-card-tier:hover { border-color: var(--warm-300); background: var(--warm-50); }
        .svc-card-tier.popular { border-color: rgba(176,125,79,0.2); background: var(--ember-bg); }
        .svc-card-tier-pop {
          position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
          font-family: var(--mono); font-size: 8px; color: var(--ember);
          background: var(--parchment); border: 1px solid rgba(176,125,79,0.15);
          padding: 0 5px; border-radius: 2px; letter-spacing: 0.04em; white-space: nowrap;
        }
        .svc-card-tier-name { font-size: 11px; color: var(--ink-500); margin-bottom: 2px; }
        .svc-card-tier-price { font-family: var(--mono); font-size: 15px; font-weight: 600; color: var(--ink-800); }
        .svc-card-tier-unit { font-family: var(--mono); font-size: 9px; color: var(--ink-300); }

        /* Stats row */
        .svc-card-stats {
          display: flex; align-items: center; gap: 0; padding-top: 12px;
          border-top: 1px solid var(--warm-100);
        }
        .svc-card-stat {
          flex: 1; text-align: center;
          border-right: 1px solid var(--warm-100); padding: 0 4px;
        }
        .svc-card-stat:last-child { border-right: none; }
        .svc-card-stat-val { font-family: var(--mono); font-size: 13px; font-weight: 500; color: var(--ink-700); }
        .svc-card-stat-val.green { color: #5a9a3c; }
        .svc-card-stat-label { font-family: var(--mono); font-size: 8px; color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.04em; }

        /* ── Earning bar per card ── */
        .svc-card-earn-bar { height: 2px; background: var(--warm-100); margin: 10px 0 0; border-radius: 1px; overflow: hidden; }
        .svc-card-earn-fill { height: 100%; border-radius: 1px; transition: width 0.4s ease; }

        /* ── Detail panel ── */
        .svc-detail-overlay { position: fixed; inset: 0; background: rgba(44,42,37,0.2); backdrop-filter: blur(2px); z-index: 50; }
        .svc-detail {
          position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 680px; max-height: 88vh; background: var(--parchment);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 16px 48px rgba(0,0,0,0.12);
          z-index: 51; display: flex; flex-direction: column;
          animation: modalIn 0.2s ease;
        }
        @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

        .sd-head { padding: 24px 28px 18px; display: flex; align-items: flex-start; gap: 16px; border-bottom: 1px solid var(--warm-200); }
        .sd-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
        .sd-info { flex: 1; }
        .sd-name { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--ink-900); line-height: 1.15; }
        .sd-cat { font-family: var(--mono); font-size: 10px; color: var(--ink-400); margin-top: 2px; }
        .sd-desc { font-size: 14px; color: var(--ink-500); margin-top: 6px; line-height: 1.5; }
        .sd-close { width: 32px; height: 32px; border-radius: 6px; border: none; background: none; cursor: pointer; color: var(--ink-300); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sd-close:hover { background: var(--warm-100); color: var(--ink-600); }

        .sd-body { flex: 1; overflow-y: auto; padding: 20px 28px 28px; }
        .sd-body::-webkit-scrollbar { width: 4px; }
        .sd-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .sd-section { font-family: var(--mono); font-size: 9px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.1em; margin: 20px 0 10px; display: flex; align-items: center; gap: 8px; }
        .sd-section::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        /* Tier cards in detail */
        .sd-tiers { display: flex; gap: 10px; }
        .sd-tier {
          flex: 1; border: 1px solid var(--warm-200); border-radius: 10px;
          padding: 18px 16px; cursor: pointer; transition: all 0.12s;
          position: relative; background: #fff;
        }
        .sd-tier:hover { border-color: var(--warm-300); box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
        .sd-tier.on { border-color: var(--ember); box-shadow: 0 0 0 1px var(--ember); background: var(--ember-bg); }
        .sd-tier.popular { }
        .sd-tier-pop {
          position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
          font-family: var(--mono); font-size: 8px; font-weight: 500; color: var(--ember);
          background: var(--parchment); border: 1px solid rgba(176,125,79,0.15);
          padding: 1px 8px; border-radius: 3px; letter-spacing: 0.04em;
        }
        .sd-tier-name { font-size: 14px; font-weight: 500; color: var(--ink-800); margin-bottom: 4px; }
        .sd-tier-price-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
        .sd-tier-price { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: var(--ink-900); }
        .sd-tier-unit { font-family: var(--mono); font-size: 10px; color: var(--ink-400); }
        .sd-tier-hours { font-family: var(--mono); font-size: 11px; color: var(--ink-300); margin-bottom: 10px; }
        .sd-tier-includes { display: flex; flex-direction: column; gap: 4px; }
        .sd-tier-include { display: flex; align-items: flex-start; gap: 6px; font-size: 12.5px; color: var(--ink-600); line-height: 1.4; }
        .sd-tier-check { color: #5a9a3c; font-size: 11px; flex-shrink: 0; margin-top: 2px; }

        .sd-tier-select {
          margin-top: 14px; width: 100%; padding: 8px; border-radius: 6px;
          font-size: 12px; font-weight: 500; font-family: inherit;
          cursor: pointer; transition: all 0.1s; text-align: center;
        }
        .sd-tier-select.ghost { border: 1px solid var(--warm-200); background: #fff; color: var(--ink-600); }
        .sd-tier-select.ghost:hover { background: var(--warm-50); }
        .sd-tier-select.active { border: none; background: var(--ember); color: #fff; }
        .sd-tier-select.active:hover { background: var(--ember-light); }

        /* Stats in detail */
        .sd-stats { display: flex; gap: 8px; }
        .sd-stat-card {
          flex: 1; padding: 12px 14px; background: var(--warm-50);
          border: 1px solid var(--warm-100); border-radius: 8px; text-align: center;
        }
        .sd-stat-val { font-family: var(--mono); font-size: 16px; font-weight: 600; color: var(--ink-800); }
        .sd-stat-val.green { color: #5a9a3c; }
        .sd-stat-val.ember { color: var(--ember); }
        .sd-stat-label { font-family: var(--mono); font-size: 8px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }

        /* ── Invoice builder drawer ── */
        .inv-drawer {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--ink-900); border-radius: 16px 16px 0 0;
          box-shadow: 0 -8px 32px rgba(0,0,0,0.15); z-index: 40;
          padding: 20px 32px 24px; color: rgba(255,255,255,0.7);
          animation: drawerUp 0.25s ease;
        }
        @keyframes drawerUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

        .inv-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .inv-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: rgba(255,255,255,0.9); }
        .inv-close { width: 28px; height: 28px; border-radius: 5px; border: none; background: rgba(255,255,255,0.06); cursor: pointer; color: rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; }
        .inv-close:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }

        .inv-client-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .inv-client-input {
          flex: 1; padding: 9px 14px; border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px; font-family: inherit; font-size: 14px;
          color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.04); outline: none;
        }
        .inv-client-input:focus { border-color: var(--ember); }
        .inv-client-input::placeholder { color: rgba(255,255,255,0.2); }

        .inv-items { margin-bottom: 14px; }
        .inv-item {
          display: flex; align-items: center; gap: 12px; padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-family: var(--mono); font-size: 13px;
        }
        .inv-item-name { flex: 1; color: rgba(255,255,255,0.7); }
        .inv-item-tier { color: rgba(255,255,255,0.3); font-size: 11px; }
        .inv-item-price { color: var(--ember-light); font-weight: 500; min-width: 80px; text-align: right; }
        .inv-item-remove {
          width: 22px; height: 22px; border-radius: 4px; border: none;
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.3);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 11px;
        }
        .inv-item-remove:hover { background: rgba(194,75,56,0.15); color: #c24b38; }

        .inv-total-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.06);
        }
        .inv-total-label { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.06em; }
        .inv-total-val { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: var(--ember-light); }

        .inv-actions { display: flex; gap: 8px; margin-top: 4px; }
        .inv-btn {
          flex: 1; padding: 11px; border-radius: 8px; font-size: 14px;
          font-weight: 500; font-family: inherit; cursor: pointer;
          text-align: center; transition: all 0.1s;
        }
        .inv-btn-send { background: var(--ember); border: none; color: #fff; }
        .inv-btn-send:hover { background: var(--ember-light); }
        .inv-btn-ghost { background: none; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
        .inv-btn-ghost:hover { border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); }

        .inv-hint { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.15); text-align: center; margin-top: 8px; }
      `}</style>

      <div className="svc">
        {/* ── Header ── */}
        <div className="svc-head">
          <div className="svc-head-left">
            <span className="svc-title">Services</span>
          </div>
          <div className="svc-head-right">
            {invoiceItems.length > 0 && (
              <button className="svc-btn" onClick={() => setShowInvoice(true)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2h6l2 2v6H2V2z" stroke="currentColor" strokeWidth="1"/></svg>
                Invoice ({invoiceItems.length})
              </button>
            )}
            <button className="svc-btn primary">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              New Service
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="svc-stats">
          <div className="svc-stat">
            <div className="svc-stat-val green">${(totalEarned / 1000).toFixed(1)}k</div>
            <div className="svc-stat-label">total earned</div>
            <div className="svc-stat-sub">across {services.length} services</div>
          </div>
          <div className="svc-stat">
            <div className="svc-stat-val">{totalUsed}</div>
            <div className="svc-stat-label">times invoiced</div>
            <div className="svc-stat-sub">{(totalUsed / 12).toFixed(1)}/month avg</div>
          </div>
          <div className="svc-stat">
            <div className="svc-stat-val ember">${Math.round(totalEarned / totalUsed).toLocaleString()}</div>
            <div className="svc-stat-label">avg deal size</div>
          </div>
          <div className="svc-stat">
            <div className="svc-stat-val">{topService?.name}</div>
            <div className="svc-stat-label">top earner</div>
            <div className="svc-stat-sub">${(topService?.totalEarned / 1000).toFixed(1)}k lifetime</div>
          </div>
        </div>

        {/* Earned bar */}
        <div className="svc-earned-bar">
          {services.sort((a, b) => b.totalEarned - a.totalEarned).map(s => (
            <div key={s.id} className="svc-earned-seg" style={{ width: `${(s.totalEarned / totalEarned) * 100}%`, background: s.color }} />
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="svc-toolbar">
          <div className="svc-filters">
            {CATEGORIES.map(c => (
              <button key={c} className={`svc-filter${category === c ? " on" : ""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div className="svc-sort">
            <span className="svc-sort-label">Sort:</span>
            <select className="svc-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="earned">Most earned</option>
              <option value="used">Most used</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="svc-content">
          <div className="svc-grid">
            {filtered.map(svc => {
              const maxEarned = Math.max(...services.map(s => s.totalEarned));
              return (
                <div key={svc.id} className={`svc-card${hoveredCard === svc.id ? " hovered" : ""}`}
                  onMouseEnter={() => setHoveredCard(svc.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => { setSelectedService(svc.id); setSelectedTier(svc.tiers.find(t => t.popular)?.id || svc.tiers[0]?.id); }}>

                  <div className="svc-card-accent" style={{ background: svc.color }} />

                  <div className="svc-card-body">
                    <div className="svc-card-top">
                      <div className="svc-card-icon" style={{ background: svc.color + "0a", color: svc.color, border: `1px solid ${svc.color}15` }}>{svc.emoji}</div>
                      <div className="svc-card-info">
                        <div className="svc-card-name">{svc.name}</div>
                        <div className="svc-card-cat">{svc.category}</div>
                      </div>
                    </div>

                    <div className="svc-card-desc">{svc.desc}</div>

                    {/* Tier previews */}
                    <div className="svc-card-tiers">
                      {svc.tiers.map(t => (
                        <div key={t.id} className={`svc-card-tier${t.popular ? " popular" : ""}`}
                          onClick={e => { e.stopPropagation(); addToInvoice(svc, t); }}>
                          {t.popular && <span className="svc-card-tier-pop">POPULAR</span>}
                          <div className="svc-card-tier-name">{t.name}</div>
                          <div className="svc-card-tier-price">${t.price.toLocaleString()}</div>
                          <div className="svc-card-tier-unit">{t.unit}</div>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="svc-card-stats">
                      <div className="svc-card-stat">
                        <div className="svc-card-stat-val green">${(svc.totalEarned / 1000).toFixed(1)}k</div>
                        <div className="svc-card-stat-label">earned</div>
                      </div>
                      <div className="svc-card-stat">
                        <div className="svc-card-stat-val">{svc.timesUsed}×</div>
                        <div className="svc-card-stat-label">used</div>
                      </div>
                      <div className="svc-card-stat">
                        <div className="svc-card-stat-val">★ {svc.avgRating}</div>
                        <div className="svc-card-stat-label">rating</div>
                      </div>
                      <div className="svc-card-stat">
                        <div className="svc-card-stat-val">{svc.lastUsed}</div>
                        <div className="svc-card-stat-label">last used</div>
                      </div>
                    </div>

                    <div className="svc-card-earn-bar">
                      <div className="svc-card-earn-fill" style={{ width: `${(svc.totalEarned / maxEarned) * 100}%`, background: svc.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detail modal ── */}
        {selected && (
          <>
            <div className="svc-detail-overlay" onClick={() => setSelectedService(null)} />
            <div className="svc-detail">
              <div className="sd-head">
                <div className="sd-icon" style={{ background: selected.color + "0a", color: selected.color, border: `1px solid ${selected.color}15` }}>{selected.emoji}</div>
                <div className="sd-info">
                  <div className="sd-name">{selected.name}</div>
                  <div className="sd-cat">{selected.category}</div>
                  <div className="sd-desc">{selected.desc}</div>
                </div>
                <button className="sd-close" onClick={() => setSelectedService(null)}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </button>
              </div>

              <div className="sd-body">
                <div className="sd-section">choose a tier</div>
                <div className="sd-tiers">
                  {selected.tiers.map(t => (
                    <div key={t.id} className={`sd-tier${selectedTier === t.id ? " on" : ""}${t.popular ? " popular" : ""}`}
                      onClick={() => setSelectedTier(t.id)}>
                      {t.popular && <span className="sd-tier-pop">MOST POPULAR</span>}
                      <div className="sd-tier-name">{t.name}</div>
                      <div className="sd-tier-price-row">
                        <span className="sd-tier-price">${t.price.toLocaleString()}</span>
                        <span className="sd-tier-unit">{t.unit}</span>
                      </div>
                      <div className="sd-tier-hours">~{t.hours} hours</div>
                      <div className="sd-tier-includes">
                        {t.includes.map((inc, i) => (
                          <div key={i} className="sd-tier-include">
                            <span className="sd-tier-check">✓</span>
                            {inc}
                          </div>
                        ))}
                      </div>
                      <button className={`sd-tier-select ${selectedTier === t.id ? "active" : "ghost"}`}
                        onClick={e => { e.stopPropagation(); addToInvoice(selected, t); }}>
                        {selectedTier === t.id ? "Add to Invoice" : "Select"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="sd-section">performance</div>
                <div className="sd-stats">
                  <div className="sd-stat-card">
                    <div className="sd-stat-val green">${(selected.totalEarned / 1000).toFixed(1)}k</div>
                    <div className="sd-stat-label">lifetime earned</div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-val">{selected.timesUsed}</div>
                    <div className="sd-stat-label">times invoiced</div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-val ember">${Math.round(selected.totalEarned / selected.timesUsed).toLocaleString()}</div>
                    <div className="sd-stat-label">avg per invoice</div>
                  </div>
                  <div className="sd-stat-card">
                    <div className="sd-stat-val">★ {selected.avgRating}</div>
                    <div className="sd-stat-label">avg rating</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Invoice drawer ── */}
        {showInvoice && invoiceItems.length > 0 && (
          <div className="inv-drawer">
            <div className="inv-head">
              <span className="inv-title">Quick Invoice</span>
              <button className="inv-close" onClick={() => setShowInvoice(false)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="inv-client-row">
              <input className="inv-client-input" placeholder="Client name or email..."
                value={invoiceClient} onChange={e => setInvoiceClient(e.target.value)} />
            </div>

            <div className="inv-items">
              {invoiceItems.map(item => (
                <div key={item.id} className="inv-item">
                  <span className="inv-item-name">{item.service}</span>
                  <span className="inv-item-tier">{item.tier}</span>
                  <span className="inv-item-price">${item.price.toLocaleString()}</span>
                  <button className="inv-item-remove" onClick={() => removeInvoiceItem(item.id)}>×</button>
                </div>
              ))}
            </div>

            <div className="inv-total-row">
              <span className="inv-total-label">total</span>
              <span className="inv-total-val">${invoiceTotal.toLocaleString()}</span>
            </div>

            <div className="inv-actions">
              <button className="inv-btn inv-btn-send">Send Invoice</button>
              <button className="inv-btn inv-btn-ghost">Save Draft</button>
            </div>
            <div className="inv-hint">Processed via Stripe · 2.9% fee · Client receives a payment link</div>
          </div>
        )}
      </div>
    </>
  );
}
