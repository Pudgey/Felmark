import type { CanvasElement } from "@/lib/types";
import type { Box } from "./geometry";
import { sketchyRect, sketchyEllipse, sketchyDiamond, sketchyLine, arrowHead, smoothPath } from "./sketchy";
import { type HandleId, HANDLE_SIZE, HANDLE_CURSORS, getHandlePositions } from "./resize";

export function renderEl(el: CanvasElement) {
  const s = { stroke: el.strokeColor, strokeWidth: el.strokeWidth, fill: el.fillColor || "transparent" };
  const seed = el.id * 137;
  if (el.type === "rect") return <path key={el.id} d={sketchyRect(Math.min(el.x,el.x+(el.w||0)),Math.min(el.y,el.y+(el.h||0)),Math.abs(el.w||0),Math.abs(el.h||0),seed)} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "circle") return <path key={el.id} d={sketchyEllipse(el.x+(el.w||0)/2,el.y+(el.h||0)/2,Math.abs((el.w||0)/2),Math.abs((el.h||0)/2),seed)} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "diamond") return <path key={el.id} d={sketchyDiamond(el.x+(el.w||0)/2,el.y+(el.h||0)/2,Math.abs(el.w||0),Math.abs(el.h||0),seed)} {...s} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "line" || el.type === "arrow") {
    const x2 = el.x+(el.w||0), y2 = el.y+(el.h||0);
    return <g key={el.id}><path d={sketchyLine(el.x,el.y,x2,y2,seed)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" />{el.type === "arrow" && <path d={arrowHead(x2,y2,el.x,el.y,10+el.strokeWidth*2)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />}</g>;
  }
  if (el.type === "draw" && el.points) return <path key={el.id} d={smoothPath(el.points)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
  if (el.type === "text") return <text key={el.id} x={el.x} y={el.y} fill={el.strokeColor} fontSize={el.fontSize||16} fontFamily="'Outfit',sans-serif" dominantBaseline="hanging">{el.text}</text>;
  return null;
}

export function renderSelectionUI(bb: Box, showHandles: boolean) {
  const pad = 4;
  const elems = [
    <rect
      key="sel-box"
      x={bb.x - pad} y={bb.y - pad}
      width={bb.w + pad * 2} height={bb.h + pad * 2}
      fill="none" stroke="var(--ember)" strokeWidth="1" strokeDasharray="4 3" pointerEvents="none"
    />,
  ];
  if (showHandles) {
    const handles = getHandlePositions(bb);
    for (const [id, hp] of Object.entries(handles)) {
      elems.push(
        <rect
          key={`h-${id}`}
          x={hp.x - HANDLE_SIZE / 2} y={hp.y - HANDLE_SIZE / 2}
          width={HANDLE_SIZE} height={HANDLE_SIZE}
          fill="#fff" stroke="var(--ember)" strokeWidth="1.5" rx="1"
          style={{ cursor: HANDLE_CURSORS[id as HandleId] }}
          pointerEvents="all"
          data-handle={id}
        />
      );
    }
  }
  return <g key="sel-ui">{elems}</g>;
}
