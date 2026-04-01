import type { Block } from "@/lib/types";
import { getDefaultPricingConfigData } from "@/components/editor/unique/PricingConfigBlock";
import { getDefaultScopeBoundaryData } from "@/components/editor/unique/ScopeBoundaryBlock";
import { getDefaultAssetChecklistData } from "@/components/editor/unique/AssetChecklistBlock";
import { getDefaultDecisionPickerData } from "@/components/editor/unique/DecisionPickerBlock";
import { getDefaultAvailabilityPickerData } from "@/components/editor/unique/AvailabilityPickerBlock";
import { getDefaultProgressStreamData } from "@/components/editor/unique/ProgressStreamBlock";
import { getDefaultDependencyMapData } from "@/components/editor/unique/DependencyMapBlock";
import { getDefaultRevisionHeatmapData } from "@/components/editor/unique/RevisionHeatmapBlock";

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
