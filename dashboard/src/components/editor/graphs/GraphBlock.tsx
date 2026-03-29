"use client";

import type { GraphBlockData, GraphType } from "@/lib/types";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import DonutChart from "./DonutChart";
import HorizontalBar from "./HorizontalBar";
import SparklineRow from "./SparklineRow";
import StackedArea from "./StackedArea";
import MetricCards from "./MetricCards";

interface GraphBlockProps {
  graphData: GraphBlockData;
}

export default function GraphBlock({ graphData }: GraphBlockProps) {
  const { graphType, title, data, height } = graphData;

  // Guard: no data or wrong shape — show placeholder
  if (!data) return <div style={{ padding: 16, color: "var(--ink-400)", fontStyle: "italic" }}>Click to add chart data</div>;

  const safeArray = Array.isArray(data) ? data : [];

  switch (graphType) {
    case "bar":
      return <BarChart title={title} data={safeArray as any} height={height} />;
    case "line":
      return <LineChart title={title} data={safeArray as any} height={height} />;
    case "donut":
      return <DonutChart title={title} data={safeArray as any} />;
    case "hbar":
      return <HorizontalBar title={title} data={safeArray as any} />;
    case "sparkline":
      return <SparklineRow title={title} data={safeArray as any} />;
    case "area": {
      const d = data as { labels?: string[]; series?: any[] };
      return <StackedArea title={title} labels={d?.labels || []} series={d?.series || []} height={height} />;
    }
    case "metrics":
      return <MetricCards metrics={safeArray as any} />;
    default:
      return <div style={{ padding: 16, color: "var(--ink-400)", fontStyle: "italic" }}>Unknown graph type: {graphType}</div>;
  }
}

// Default data for each graph type — used when inserting from slash menu
export function getDefaultGraphData(graphType: GraphType): GraphBlockData {
  switch (graphType) {
    case "bar":
      return {
        graphType: "bar",
        title: "Monthly Revenue",
        data: [
          { label: "Jan", value: 4200, color: "#b07d4f" },
          { label: "Feb", value: 5800, color: "#b07d4f" },
          { label: "Mar", value: 7400, color: "#b07d4f", current: true },
        ],
      };
    case "line":
      return {
        graphType: "line",
        title: "Growth Trend",
        data: [
          { label: "Oct", value: 3200 }, { label: "Nov", value: 5400 },
          { label: "Dec", value: 4800 }, { label: "Jan", value: 6200 },
          { label: "Feb", value: 5100 }, { label: "Mar", value: 7200 },
        ],
      };
    case "donut":
      return {
        graphType: "donut",
        title: "Revenue by Client",
        data: [
          { label: "Client A", value: 8400, color: "#7c8594" },
          { label: "Client B", value: 4800, color: "#8a7e63" },
          { label: "Client C", value: 3200, color: "#a08472" },
        ],
      };
    case "hbar":
      return {
        graphType: "hbar",
        title: "Hours by Project",
        data: [
          { label: "Brand Guidelines", value: 32, unit: "h", color: "#7c8594" },
          { label: "Website Redesign", value: 24, unit: "h", color: "#8a7e63" },
          { label: "Content Strategy", value: 18, unit: "h", color: "#a08472" },
        ],
      };
    case "sparkline":
      return {
        graphType: "sparkline",
        title: "This Week",
        data: [
          { label: "Revenue", values: [800, 1200, 900, 1400, 1800], current: "$6.1k", change: 22, color: "#5a9a3c" },
          { label: "Hours", values: [4, 6, 5, 7, 8], current: "30h", change: 12, color: "#b07d4f" },
        ],
      };
    case "area":
      return {
        graphType: "area",
        title: "Revenue Streams",
        data: {
          labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
          series: [
            { label: "Design", color: "#b07d4f", values: [4200, 5400, 4800, 6200, 5100, 7200] },
            { label: "Copy", color: "#5a9a3c", values: [1800, 2400, 2200, 3200, 2800, 3600] },
          ],
        },
      };
    case "metrics":
      return {
        graphType: "metrics",
        title: "Key Metrics",
        data: [
          { label: "Revenue", value: 14800, prefix: "$", color: "#5a9a3c", change: 40, sub: "this month" },
          { label: "Projects", value: 8, color: "var(--ink-900)", change: 12, sub: "active" },
          { label: "Avg Rate", value: 95, prefix: "$", suffix: "/hr", color: "var(--ember)", change: 5 },
        ],
      };
  }
}

export const GRAPH_TYPE_OPTIONS: { type: GraphType; icon: string; label: string }[] = [
  { type: "bar", icon: "\u2581\u2583\u2585\u2587", label: "Bar" },
  { type: "line", icon: "\u2571\u203E", label: "Line" },
  { type: "donut", icon: "\u25D4", label: "Donut" },
  { type: "hbar", icon: "\u2550", label: "H-Bar" },
  { type: "sparkline", icon: "\u223F", label: "Sparkline" },
  { type: "area", icon: "\u2592", label: "Area" },
  { type: "metrics", icon: "#", label: "Metrics" },
];
