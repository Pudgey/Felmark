/* Canvas layout types — row-based model */

export interface CanvasBlock {
  id: string;
  type: string;
  label: string;
  color: string;
  w: number;           // requested width in grid units (may be adjusted by layout)
  value?: string;
  sub?: string;
  userSized?: boolean;
}

export interface CanvasRow {
  id: string;
  blockIds: string[];   // ordered block IDs, left to right
}

export interface BlockTypeDef {
  type: string;
  label: string;
  icon: string;
  color: string;
  defaultW: number;
  minW: number;
  maxW: number;
  defaultH: number;
  minH: number;
  expandAxis: "both" | "width" | "height" | "none";
}

export interface LayoutBlock {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GhostPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CellPosition {
  col: number;
  row: number;
}

export interface RenderBlock {
  id: string;
  type: string;
  label: string;
  color: string;
  w: number;
  h: number;
  value?: string;
  sub?: string;
}

export interface TargetRowResult {
  rowIdx: number;
  rowY: number;
  rowH: number;
  totalH: number;
}
