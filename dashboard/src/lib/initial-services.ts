import type { WireService } from "./wire-context";

/**
 * Initial services data shared between ServicesPage and WirePage.
 * ServicesPage has its own richer Service interface with emoji, color, etc.
 * This is the minimal shape The Wire needs.
 */
export const WIRE_SERVICES: WireService[] = [
  {
    id: "s1",
    name: "Brand Identity",
    category: "Design",
    tiers: [
      { name: "Essential", price: 2400, unit: "flat" },
      { name: "Complete", price: 4800, unit: "flat" },
      { name: "Premium", price: 8500, unit: "flat" },
    ],
    timesUsed: 8,
    totalEarned: 28600,
  },
  {
    id: "s2",
    name: "Website Design",
    category: "Design",
    tiers: [
      { name: "Landing Page", price: 1800, unit: "flat" },
      { name: "Multi-page", price: 4200, unit: "flat" },
      { name: "Full Site", price: 7500, unit: "flat" },
    ],
    timesUsed: 5,
    totalEarned: 21000,
  },
  {
    id: "s3",
    name: "Content & Copy",
    category: "Writing",
    tiers: [
      { name: "Per page", price: 350, unit: "per page" },
      { name: "Email sequence", price: 1200, unit: "flat" },
      { name: "Full website", price: 3500, unit: "flat" },
    ],
    timesUsed: 12,
    totalEarned: 18400,
  },
  {
    id: "s4",
    name: "Strategy Session",
    category: "Consulting",
    tiers: [
      { name: "Discovery", price: 500, unit: "flat" },
      { name: "Half-day", price: 1500, unit: "flat" },
      { name: "Retainer", price: 3000, unit: "per month" },
    ],
    timesUsed: 15,
    totalEarned: 22500,
  },
  {
    id: "s5",
    name: "Social Media Kit",
    category: "Design",
    tiers: [
      { name: "Starter", price: 600, unit: "flat" },
      { name: "Pro", price: 1400, unit: "flat" },
    ],
    timesUsed: 6,
    totalEarned: 7800,
  },
];
