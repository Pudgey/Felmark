/** Deterministic pseudo-random from seed — stable across re-renders */
export function srand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function jitter(v: number, amount: number, seed: number) { return v + (srand(seed) - 0.5) * amount; }

export function sketchyRect(x: number, y: number, w: number, h: number, seed: number) {
  const r = 1.5;
  const pts = [[jitter(x,r,seed),jitter(y,r,seed+1)],[jitter(x+w,r,seed+2),jitter(y,r,seed+3)],[jitter(x+w,r,seed+4),jitter(y+h,r,seed+5)],[jitter(x,r,seed+6),jitter(y+h,r,seed+7)]];
  return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]} Z`;
}

export function sketchyEllipse(cx: number, cy: number, rx: number, ry: number, seed: number) {
  let d = "";
  for (let i = 0; i <= 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const px = cx + Math.cos(a) * rx + (srand(seed + i * 2) - 0.5) * 1.5;
    const py = cy + Math.sin(a) * ry + (srand(seed + i * 2 + 1) - 0.5) * 1.5;
    d += (i === 0 ? "M" : "L") + `${px},${py} `;
  }
  return d + "Z";
}

export function sketchyDiamond(cx: number, cy: number, w: number, h: number, seed: number) {
  const r = 1.5;
  const pts = [[jitter(cx,r,seed),jitter(cy-h/2,r,seed+1)],[jitter(cx+w/2,r,seed+2),jitter(cy,r,seed+3)],[jitter(cx,r,seed+4),jitter(cy+h/2,r,seed+5)],[jitter(cx-w/2,r,seed+6),jitter(cy,r,seed+7)]];
  return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]} Z`;
}

export function sketchyLine(x1: number, y1: number, x2: number, y2: number, seed: number) {
  const mx = (x1+x2)/2 + (srand(seed)-0.5)*2, my = (y1+y2)/2 + (srand(seed+1)-0.5)*2;
  return `M${jitter(x1,1,seed+2)},${jitter(y1,1,seed+3)} Q${mx},${my} ${jitter(x2,1,seed+4)},${jitter(y2,1,seed+5)}`;
}

export function arrowHead(x2: number, y2: number, x1: number, y1: number, size = 12) {
  const a = Math.atan2(y2-y1,x2-x1);
  return `M${x2+Math.cos(a+Math.PI*0.82)*size},${y2+Math.sin(a+Math.PI*0.82)*size} L${x2},${y2} L${x2+Math.cos(a-Math.PI*0.82)*size},${y2+Math.sin(a-Math.PI*0.82)*size}`;
}

export function smoothPath(pts: number[][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const cx = (pts[i][0]+pts[i+1][0])/2, cy = (pts[i][1]+pts[i+1][1])/2;
    d += ` Q${pts[i][0]},${pts[i][1]} ${cx},${cy}`;
  }
  d += ` L${pts[pts.length-1][0]},${pts[pts.length-1][1]}`;
  return d;
}
