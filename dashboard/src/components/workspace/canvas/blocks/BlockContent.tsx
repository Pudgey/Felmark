"use client";

import type { ComponentType } from "react";
import type { RenderBlock } from "../types";
import MetricBlock from "./MetricBlock";
import WhisperBlock from "./WhisperBlock";
import PlaceholderBlock from "./PlaceholderBlock";
import PipelineBlock from "./PipelineBlock";
import CalendarBlock from "./CalendarBlock";
import AutomationBlock from "./AutomationBlock";
import ChatBlock from "./ChatBlock";
import FileBlock from "./FileBlock";
import RevenueChartBlock from "./RevenueChartBlock";
import { CommandSurfaceBlock, ProjectSummaryBlock } from "./ProjectSpotlightBlock";
import { ClientPulseBlock, InvoiceSurfaceBlock } from "./PulseInvoiceBlocks";

const RENDERERS: Record<string, ComponentType<{ block: RenderBlock }>> = {
  whisper: WhisperBlock,
  pipeline: PipelineBlock,
  calendar: CalendarBlock,
  automation: AutomationBlock,
  chat: ChatBlock,
  files: FileBlock,
  "revenue-chart": RevenueChartBlock,
  "project-summary": ProjectSummaryBlock,
  "command-surface": CommandSurfaceBlock,
  "client-pulse": ClientPulseBlock,
  "invoice-surface": InvoiceSurfaceBlock,
};

export default function BlockContent({ block }: { block: RenderBlock }) {
  const Renderer = RENDERERS[block.type];
  if (Renderer) return <Renderer block={block} />;
  if (block.value) return <MetricBlock block={block} />;
  return <PlaceholderBlock block={block} />;
}
