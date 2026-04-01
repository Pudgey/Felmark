"use client";

import type { PricingConfigData } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: PricingConfigData;
  onUpdate: (data: PricingConfigData) => void;
}

export function getDefaultPricingConfigData(): PricingConfigData {
  return {
    options: [
      { id: "logo", name: "Logo Design", desc: "Primary + secondary + icon mark", price: 1200, required: true, category: "Core" },
      { id: "colors", name: "Color Palette", desc: "Primary, secondary, accent, semantic", price: 400, required: true, category: "Core" },
      { id: "typography", name: "Typography System", desc: "Font pairings, scale, hierarchy", price: 400, required: true, category: "Core" },
      { id: "guidelines", name: "Brand Guidelines Doc", desc: "40+ page PDF with usage rules", price: 800, category: "Deliverables" },
      { id: "social", name: "Social Media Kit", desc: "IG, LinkedIn, X templates (12 total)", price: 600, category: "Deliverables" },
      { id: "stationery", name: "Stationery Suite", desc: "Business card, letterhead, envelope", price: 500, category: "Deliverables" },
      { id: "iconset", name: "Custom Icon Set", desc: "24 icons matching brand style", price: 900, category: "Extras" },
      { id: "animation", name: "Logo Animation", desc: "5-second animated logo mark", price: 700, category: "Extras" },
      { id: "strategy", name: "Brand Strategy Session", desc: "2-hour workshop + positioning doc", price: 1500, category: "Extras" },
    ],
    selected: ["logo", "colors", "typography"],
  };
}

export default function PricingConfigBlock({ data, onUpdate }: Props) {
  const toggle = (id: string) => {
    const opt = data.options.find(o => o.id === id);
    if (opt?.required) return;
    const selected = data.selected.includes(id)
      ? data.selected.filter(s => s !== id)
      : [...data.selected, id];
    onUpdate({ ...data, selected });
  };

  const total = data.options.filter(o => data.selected.includes(o.id)).reduce((s, o) => s + o.price, 0);
  const categories = [...new Set(data.options.map(o => o.category))];

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge} style={{ color: "#b07d4f", background: "rgba(176,125,79,0.06)", borderColor: "rgba(176,125,79,0.1)" }}>Interactive</span>
        <span className={styles.title}>Build your package</span>
        <span className={styles.subtitle}>Toggle options on/off — price updates live</span>
      </div>
      <div className={styles.configBody}>
        <div className={styles.configOptions}>
          {categories.map(cat => (
            <div key={cat}>
              <div className={styles.configCat}>{cat}</div>
              {data.options.filter(o => o.category === cat).map(opt => {
                const isOn = data.selected.includes(opt.id);
                return (
                  <div key={opt.id} className={`${styles.configOpt} ${isOn ? styles.configOptOn : ""}`} onClick={() => toggle(opt.id)}>
                    <div className={`${styles.toggle} ${isOn ? styles.toggleOn : ""}`}><div className={styles.toggleDot} /></div>
                    <div className={styles.configOptInfo}>
                      <div className={styles.configOptName}>
                        {opt.name}
                        {opt.required && <span className={styles.configRequired}>Required</span>}
                      </div>
                      <div className={styles.configOptDesc}>{opt.desc}</div>
                    </div>
                    <div className={`${styles.configOptPrice} ${isOn ? styles.configOptPriceOn : ""}`}>${opt.price.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className={styles.configSummary}>
          <div className={styles.configSummaryLabel}>Your package</div>
          <div className={styles.configSummaryItems}>
            {data.options.filter(o => data.selected.includes(o.id)).map(o => (
              <div key={o.id} className={styles.configSummaryItem}>
                <span>✓ {o.name}</span>
                <span>${o.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className={styles.configSummaryTotal}>
            <span>Total investment</span>
            <span className={styles.configTotalVal}>${total.toLocaleString()}</span>
          </div>
          <div className={styles.configSummaryNote}>{data.selected.length} of {data.options.length} options selected</div>
          <button className={styles.configAccept}>Accept Package →</button>
        </div>
      </div>
    </div>
  );
}
