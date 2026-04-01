"use client";

import type { RenderBlock } from "../types";
import MetricBlock from "./MetricBlock";
import WhisperBlock from "./WhisperBlock";
import PlaceholderBlock from "./PlaceholderBlock";

export default function BlockContent({ block }: { block: RenderBlock }) {
  if (block.type === "whisper") {
    return <WhisperBlock block={block} />;
  }

  if (block.value) {
    return <MetricBlock block={block} />;
  }

  return <PlaceholderBlock block={block} />;
}
