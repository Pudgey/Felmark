import type { Block } from "@/lib/types";

export const MONEY_DEFAULTS: Record<string, () => Partial<Block>> = {
  money: () => ({
    moneyData: { moneyType: "rate-calc", data: { hours: 32, rate: 95 } },
  }),
  "pricing-config": () => ({
    pricingConfigData: {
      options: [
        { id: "logo", name: "Logo Design", desc: "Primary + secondary + icon mark", price: 1200, required: true, category: "Core" },
        { id: "colors", name: "Color Palette", desc: "Primary, secondary, accent, semantic", price: 400, required: true, category: "Core" },
        { id: "typography", name: "Typography System", desc: "Font pairings, scale, hierarchy", price: 400, required: true, category: "Core" },
        { id: "guidelines", name: "Brand Guidelines Doc", desc: "40+ page PDF with usage rules", price: 800, category: "Deliverables" },
        { id: "social", name: "Social Media Kit", desc: "IG, LinkedIn, X templates", price: 600, category: "Deliverables" },
      ],
      selected: ["logo", "colors", "typography"],
    },
  }),
};
