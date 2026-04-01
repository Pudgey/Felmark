import type { Block } from "@/lib/types";
import { getDefaultPricingConfigData } from "@/components/workstation/editor/blocks/unique/PricingConfigBlock";
import { getDefaultScopeBoundaryData } from "@/components/workstation/editor/blocks/unique/ScopeBoundaryBlock";
import { getDefaultAssetChecklistData } from "@/components/workstation/editor/blocks/unique/AssetChecklistBlock";
import { getDefaultDecisionPickerData } from "@/components/workstation/editor/blocks/unique/DecisionPickerBlock";
import { getDefaultAvailabilityPickerData } from "@/components/workstation/editor/blocks/unique/AvailabilityPickerBlock";
import { getDefaultProgressStreamData } from "@/components/workstation/editor/blocks/unique/ProgressStreamBlock";
import { getDefaultDependencyMapData } from "@/components/workstation/editor/blocks/unique/DependencyMapBlock";
import { getDefaultRevisionHeatmapData } from "@/components/workstation/editor/blocks/unique/RevisionHeatmapBlock";

export const UNIQUE_DEFAULTS: Record<string, () => Partial<Block>> = {
  "pricing-config": () => ({ pricingConfigData: getDefaultPricingConfigData() }),
  "scope-boundary": () => ({ scopeBoundaryData: getDefaultScopeBoundaryData() }),
  "asset-checklist": () => ({ assetChecklistData: getDefaultAssetChecklistData() }),
  "decision-picker": () => ({ decisionPickerData: getDefaultDecisionPickerData() }),
  "availability-picker": () => ({ availabilityPickerData: getDefaultAvailabilityPickerData() }),
  "progress-stream": () => ({ progressStreamData: getDefaultProgressStreamData() }),
  "dependency-map": () => ({ dependencyMapData: getDefaultDependencyMapData() }),
  "revision-heatmap": () => ({ revisionHeatmapData: getDefaultRevisionHeatmapData() }),
};
