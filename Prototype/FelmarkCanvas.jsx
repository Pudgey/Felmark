import { useState, useRef, useEffect, useCallback } from "react";

const COLORS = [
  { id: "ink", hex: "#2c2a25", label: "Ink" },
  { id: "ember", hex: "#b07d4f", label: "Ember" },
  { id: "red", hex: "#c24b38", label: "Red" },
  { id: "green", hex: "#5a9a3c", label: "Green" },
  { id: "blue", hex: "#5b7fa4", label: "Blue" },
  { id: "purple", hex: "#7c6b9e", label: "Purple" },
  { id: "brown", hex: "#8a7e63", label: "Brown" },
  { id: "warm", hex: "#b8b3a8", label: "Warm" },
];

const FILL_COLORS = [
  { id: "none", hex: "transparent", label: "None" },
  { id: "ember-bg", hex: "rgba(176,125,79,0.08)", label: "Ember" },
  { id: "red-bg", hex: "rgba(194,75,56,0.06)", label: "Red" },
  { id: "green-bg", hex: "rgba(90,154,60,0.06)", label: "Green" },
  { id: "blue-bg", hex: "rgba(91,127,164,0.06)", label: "Blue" },
  { id: "purple-bg", hex: "rgba(124,107,158,0.06)", label: "Purple" },
  { id: "warm-bg", hex: "rgba(184,179,168,0.1)", label: "Warm" },
  { id: "white", hex: "#ffffff", label: "White" },
];

const TOOLS = [
  { id: "select", label: "Select", icon: "↖", shortcut: "V" },
  { id: "hand", label: "Hand", icon: "✋", shortcut: "H" },
  { id: "rect", label: "Rectangle", icon: "□", shortcut: "R" },
  { id: "circle", label: "Ellipse", icon: "○", shortcut: "O" },
  { id: "diamond", label: "Diamond", icon: "◇", shortcut: "D" },
  { id: "line", label: "Line", icon: "╱", shortcut: "L" },
  { id: "arrow", label: "Arrow", icon: "→", shortcut: "A" },
  { id: "draw", label: "Draw", icon: "✎", shortcut: "P" },
  { id: "text", label: "Text", icon: "T", shortcut: "T" },
];

const STROKE_WIDTHS = [1, 2, 3, 5];

let nextId = 1;

function jitter(v, amount = 1.5) {
  return v + (Math.random() - 0.5) * amount;
}

function sketchyRect(x, y, w, h, roughness = 1.5) {
  const pts = [
    [jitter(x, roughness), jitter(y, roughness)],
    [jitter(x + w, roughness), jitter(y, roughness)],
    [jitter(x + w, roughness), jitter(y + h, roughness)],
    [jitter(x, roughness), jitter(y + h, roughness)],
  ];
  return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]} Z`;
}

function sketchyEllipse(cx, cy, rx, ry, roughness = 1.5) {
  const segments = 36;
  let d = "";
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const px = cx + Math.cos(angle) * rx + (Math.random() - 0.5) * roughness;
    const py = cy + Math.sin(angle) * ry + (Math.random() - 0.5) * roughness;
    d += (i === 0 ? "M" : "L") + `${px},${py} `;
  }
  return d + "Z";
}

function sketchyDiamond(cx, cy, w, h, roughness = 1.5) {
  const pts = [
    [jitter(cx, roughness), jitter(cy - h / 2, roughness)],
    [jitter(cx + w / 2, roughness), jitter(cy, roughness)],
    [jitter(cx, roughness), jitter(cy + h / 2, roughness)],
    [jitter(cx - w / 2, roughness), jitter(cy, roughness)],
  ];
  return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]} L${pts[2][0]},${pts[2][1]} L${pts[3][0]},${pts[3][1]} Z`;
}

function sketchyLine(x1, y1, x2, y2, roughness = 1) {
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * roughness * 2;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * roughness * 2;
  return `M${jitter(x1, roughness)},${jitter(y1, roughness)} Q${mx},${my} ${jitter(x2, roughness)},${jitter(y2, roughness)}`;
}

function arrowHead(x2, y2, x1, y1, size = 12) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  return `M${x2 + Math.cos(a1) * size},${y2 + Math.sin(a1) * size} L${x2},${y2} L${x2 + Math.cos(a2) * size},${y2 + Math.sin(a2) * size}`;
}

function smoothPath(points) {
  if (points.length < 2) return "";
  let d = `M${points[0][0]},${points[0][1]}`;
  if (points.length === 2) {
    d += ` L${points[1][0]},${points[1][1]}`;
    return d;
  }
  for (let i = 1; i < points.length - 1; i++) {
    const cx = (points[i][0] + points[i + 1][0]) / 2;
    const cy = (points[i][1] + points[i + 1][1]) / 2;
    d += ` Q${points[i][0]},${points[i][1]} ${cx},${cy}`;
  }
  const last = points[points.length - 1];
  d += ` L${last[0]},${last[1]}`;
  return d;
}

function renderElement(el) {
  const style = { stroke: el.strokeColor, strokeWidth: el.strokeWidth, fill: el.fillColor || "transparent" };

  if (el.type === "rect") {
    const x = Math.min(el.x, el.x + el.w);
    const y = Math.min(el.y, el.y + el.h);
    const w = Math.abs(el.w);
    const h = Math.abs(el.h);
    return <path key={el.id} d={sketchyRect(x, y, w, h)} {...style} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (el.type === "circle") {
    const cx = el.x + el.w / 2;
    const cy = el.y + el.h / 2;
    return <path key={el.id} d={sketchyEllipse(cx, cy, Math.abs(el.w / 2), Math.abs(el.h / 2))} {...style} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (el.type === "diamond") {
    const cx = el.x + el.w / 2;
    const cy = el.y + el.h / 2;
    return <path key={el.id} d={sketchyDiamond(cx, cy, Math.abs(el.w), Math.abs(el.h))} {...style} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (el.type === "line" || el.type === "arrow") {
    const x2 = el.x + el.w;
    const y2 = el.y + el.h;
    return (
      <g key={el.id}>
        <path d={sketchyLine(el.x, el.y, x2, y2)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" />
        {el.type === "arrow" && (
          <path d={arrowHead(x2, y2, el.x, el.y, 10 + el.strokeWidth * 2)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        )}
      </g>
    );
  }
  if (el.type === "draw" && el.points) {
    return <path key={el.id} d={smoothPath(el.points)} fill="none" stroke={el.strokeColor} strokeWidth={el.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />;
  }
  if (el.type === "text") {
    return (
      <text key={el.id} x={el.x} y={el.y} fill={el.strokeColor} fontSize={el.fontSize || 20} fontFamily="'Outfit', sans-serif" fontWeight="400" dominantBaseline="hanging">
        {el.text}
      </text>
    );
  }
  return null;
}

export default function FelmarkCanvas() {
  const [tool, setTool] = useState("select");
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [strokeColor, setStrokeColor] = useState("#2c2a25");
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState(null);
  const [textInput, setTextInput] = useState(null);
  const [textValue, setTextValue] = useState("");
  const svgRef = useRef(null);
  const textRef = useRef(null);

  const pushHistory = useCallback((newElements) => {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  }, [history, historyIdx]);

  const undo = useCallback(() => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setElements([...history[historyIdx - 1]]);
      setSelectedId(null);
    }
  }, [history, historyIdx]);

  const redo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setElements([...history[historyIdx + 1]]);
    }
  }, [history, historyIdx]);

  const getCanvasPos = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offset.x) / zoom,
      y: (e.clientY - rect.top - offset.y) / zoom,
    };
  };

  const handlePointerDown = (e) => {
    if (tool === "hand") {
      setPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }

    const pos = getCanvasPos(e);

    if (tool === "text") {
      setTextInput({ x: pos.x, y: pos.y });
      setTextValue("");
      setTimeout(() => textRef.current?.focus(), 50);
      return;
    }

    if (tool === "select") {
      let found = null;
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        const ex = el.type === "draw" ? Math.min(...(el.points || []).map(p => p[0])) : Math.min(el.x, el.x + (el.w || 0));
        const ey = el.type === "draw" ? Math.min(...(el.points || []).map(p => p[1])) : Math.min(el.y, el.y + (el.h || 0));
        const ew = el.type === "draw" ? Math.max(...(el.points || []).map(p => p[0])) - ex : Math.abs(el.w || 0);
        const eh = el.type === "draw" ? Math.max(...(el.points || []).map(p => p[1])) - ey : Math.abs(el.h || 0);
        if (pos.x >= ex - 8 && pos.x <= ex + ew + 8 && pos.y >= ey - 8 && pos.y <= ey + eh + 8) {
          found = el.id;
          break;
        }
      }
      setSelectedId(found);
      if (found) {
        const el = elements.find(e => e.id === found);
        setDrawing(true);
        setCurrentElement({ ...el, dragStart: pos, origX: el.x, origY: el.y });
      }
      return;
    }

    setDrawing(true);
    const id = nextId++;
    if (tool === "draw") {
      setCurrentElement({ id, type: "draw", points: [[pos.x, pos.y]], strokeColor, fillColor: "transparent", strokeWidth });
    } else {
      setCurrentElement({ id, type: tool, x: pos.x, y: pos.y, w: 0, h: 0, strokeColor, fillColor, strokeWidth });
    }
  };

  const handlePointerMove = (e) => {
    if (panning && panStart) {
      setOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (!drawing || !currentElement) return;
    const pos = getCanvasPos(e);

    if (tool === "select" && currentElement.dragStart) {
      const dx = pos.x - currentElement.dragStart.x;
      const dy = pos.y - currentElement.dragStart.y;
      setElements(prev => prev.map(el =>
        el.id === currentElement.id ? { ...el, x: currentElement.origX + dx, y: currentElement.origY + dy, points: el.points?.map(p => [p[0] + dx - (currentElement.lastDx || 0), p[1] + dy - (currentElement.lastDy || 0)]) } : el
      ));
      setCurrentElement(prev => ({ ...prev, lastDx: dx, lastDy: dy }));
      return;
    }

    if (currentElement.type === "draw") {
      setCurrentElement(prev => ({ ...prev, points: [...prev.points, [pos.x, pos.y]] }));
    } else {
      setCurrentElement(prev => ({ ...prev, w: pos.x - prev.x, h: pos.y - prev.y }));
    }
  };

  const handlePointerUp = () => {
    if (panning) { setPanning(false); setPanStart(null); return; }
    if (!drawing) return;
    setDrawing(false);

    if (tool === "select" && currentElement?.dragStart) {
      pushHistory(elements);
      setCurrentElement(null);
      return;
    }

    if (currentElement) {
      if (currentElement.type === "draw" && currentElement.points?.length < 3) { setCurrentElement(null); return; }
      if (currentElement.type !== "draw" && Math.abs(currentElement.w || 0) < 4 && Math.abs(currentElement.h || 0) < 4) { setCurrentElement(null); return; }
      const newElements = [...elements, currentElement];
      setElements(newElements);
      pushHistory(newElements);
      setSelectedId(currentElement.id);
    }
    setCurrentElement(null);
  };

  const submitText = () => {
    if (textValue.trim() && textInput) {
      const el = { id: nextId++, type: "text", x: textInput.x, y: textInput.y, text: textValue.trim(), strokeColor, fontSize: 20, strokeWidth: 0, fillColor: "transparent" };
      const newElements = [...elements, el];
      setElements(newElements);
      pushHistory(newElements);
    }
    setTextInput(null);
    setTextValue("");
  };

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    const newElements = elements.filter(e => e.id !== selectedId);
    setElements(newElements);
    pushHistory(newElements);
    setSelectedId(null);
  }, [selectedId, elements, pushHistory]);

  useEffect(() => {
    const handleKey = (e) => {
      if (textInput) return;
      if (e.key === "v" || e.key === "V") setTool("select");
      if (e.key === "h" || e.key === "H") setTool("hand");
      if (e.key === "r" || e.key === "R") setTool("rect");
      if (e.key === "o" || e.key === "O") setTool("circle");
      if (e.key === "d" || e.key === "D") setTool("diamond");
      if (e.key === "l" || e.key === "L") setTool("line");
      if (e.key === "a" || e.key === "A") setTool("arrow");
      if (e.key === "p" || e.key === "P") setTool("draw");
      if (e.key === "t") setTool("text");
      if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [textInput, deleteSelected, undo, redo]);

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setZoom(prev => Math.max(0.2, Math.min(5, prev * delta)));
  };

  const selectedEl = elements.find(e => e.id === selectedId);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .fc{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);height:100vh;display:flex;flex-direction:column;overflow:hidden;position:relative}
        .fc-canvas{flex:1;cursor:crosshair;overflow:hidden;position:relative}
        .fc-canvas.hand{cursor:grab}.fc-canvas.hand.panning{cursor:grabbing}.fc-canvas.selecting{cursor:default}
        .fc-grid{position:absolute;inset:0;pointer-events:none;opacity:0.3}
        .fc-toolbar{position:absolute;top:16px;left:50%;transform:translateX(-50%);display:flex;gap:2px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;padding:4px;box-shadow:0 2px 12px rgba(0,0,0,0.04);z-index:10}
        .fc-tool{width:34px;height:34px;border-radius:7px;border:none;cursor:pointer;font-size:14px;color:var(--ink-500);background:none;display:flex;align-items:center;justify-content:center;transition:all .06s;position:relative}
        .fc-tool:hover{background:var(--warm-100);color:var(--ink-700)}
        .fc-tool.on{background:var(--ink-900);color:#fff}
        .fc-tool-key{position:absolute;bottom:1px;right:2px;font-family:var(--mono);font-size:7px;color:var(--ink-300);opacity:0}
        .fc-tool:hover .fc-tool-key{opacity:1}.fc-tool.on .fc-tool-key{color:rgba(255,255,255,0.3)}
        .fc-tool-sep{width:1px;background:var(--warm-200);margin:4px 2px}
        .fc-panel{position:absolute;top:16px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;padding:10px;box-shadow:0 2px 12px rgba(0,0,0,0.04);z-index:10}
        .fc-panel-left{left:16px}.fc-panel-right{right:16px}
        .fc-panel-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
        .fc-colors{display:flex;gap:3px;flex-wrap:wrap;max-width:120px}
        .fc-color{width:22px;height:22px;border-radius:5px;border:2px solid transparent;cursor:pointer;transition:all .06s}
        .fc-color:hover{transform:scale(1.1)}.fc-color.on{border-color:var(--ink-900);box-shadow:0 0 0 1px #fff inset}
        .fc-strokes{display:flex;gap:3px;margin-top:8px}
        .fc-stroke{width:26px;height:26px;border-radius:5px;border:1px solid var(--warm-200);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .06s;background:#fff}
        .fc-stroke:hover{background:var(--warm-100)}.fc-stroke.on{border-color:var(--ink-900);background:var(--warm-100)}
        .fc-stroke-line{background:var(--ink-900);border-radius:1px}
        .fc-actions{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:4px;background:#fff;border:1px solid var(--warm-200);border-radius:8px;padding:4px;box-shadow:0 2px 12px rgba(0,0,0,0.04);z-index:10}
        .fc-act{padding:5px 12px;border-radius:5px;border:none;cursor:pointer;font-family:var(--mono);font-size:10px;color:var(--ink-500);background:none;transition:all .06s;display:flex;align-items:center;gap:4px}
        .fc-act:hover{background:var(--warm-100);color:var(--ink-700)}
        .fc-act-sep{width:1px;background:var(--warm-200);margin:2px 0}
        .fc-zoom{position:absolute;bottom:16px;right:16px;display:flex;align-items:center;gap:4px;background:#fff;border:1px solid var(--warm-200);border-radius:6px;padding:3px;box-shadow:0 2px 8px rgba(0,0,0,0.03);z-index:10}
        .fc-zoom-btn{width:26px;height:26px;border-radius:4px;border:none;cursor:pointer;font-size:14px;color:var(--ink-400);background:none;display:flex;align-items:center;justify-content:center;transition:all .06s}
        .fc-zoom-btn:hover{background:var(--warm-100);color:var(--ink-700)}
        .fc-zoom-val{font-family:var(--mono);font-size:10px;color:var(--ink-400);min-width:36px;text-align:center;cursor:pointer}
        .fc-sel-box{stroke:var(--ember);stroke-width:1;stroke-dasharray:4 3;fill:none;pointer-events:none}
        .fc-sel-handle{fill:#fff;stroke:var(--ember);stroke-width:1.5;cursor:pointer}
        .fc-text-input{position:absolute;z-index:20;background:transparent;border:1px dashed var(--ember);border-radius:4px;padding:4px 8px;font-family:'Outfit',sans-serif;font-size:20px;color:var(--ink-900);outline:none;min-width:100px}
        .fc-title{position:absolute;bottom:16px;left:16px;font-family:var(--mono);font-size:10px;color:var(--ink-300);z-index:10;display:flex;align-items:center;gap:6px}
        .fc-sel-info{position:absolute;top:62px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid var(--warm-200);border-radius:6px;padding:4px 10px;box-shadow:0 2px 8px rgba(0,0,0,0.03);z-index:11;font-family:var(--mono);font-size:10px;color:var(--ink-400);display:flex;align-items:center;gap:8px}
        .fc-sel-info-del{color:#c24b38;cursor:pointer;background:none;border:none;font-family:var(--mono);font-size:10px}
        .fc-sel-info-del:hover{text-decoration:underline}
      `}</style>

      <div className="fc">
        <div className="fc-toolbar">
          {TOOLS.map((t, i) => (
            <span key={t.id}>
              {(i === 2 || i === 5 || i === 7) && <span className="fc-tool-sep" />}
              <button className={`fc-tool${tool === t.id ? " on" : ""}`} onClick={() => setTool(t.id)} title={`${t.label} (${t.shortcut})`}>
                {t.icon}<span className="fc-tool-key">{t.shortcut}</span>
              </button>
            </span>
          ))}
        </div>

        <div className="fc-panel fc-panel-left">
          <div className="fc-panel-label">Stroke</div>
          <div className="fc-colors">
            {COLORS.map(c => <div key={c.id} className={`fc-color${strokeColor === c.hex ? " on" : ""}`} style={{ background: c.hex }} onClick={() => setStrokeColor(c.hex)} title={c.label} />)}
          </div>
          <div className="fc-panel-label" style={{ marginTop: 10 }}>Fill</div>
          <div className="fc-colors">
            {FILL_COLORS.map(c => <div key={c.id} className={`fc-color${fillColor === c.hex ? " on" : ""}`} style={{ background: c.hex === "transparent" ? "#fff" : c.hex, border: c.hex === "transparent" ? "2px dashed var(--warm-300)" : undefined, borderColor: fillColor === c.hex ? "var(--ink-900)" : undefined }} onClick={() => setFillColor(c.hex)} title={c.label} />)}
          </div>
          <div className="fc-panel-label" style={{ marginTop: 10 }}>Width</div>
          <div className="fc-strokes">
            {STROKE_WIDTHS.map(w => <div key={w} className={`fc-stroke${strokeWidth === w ? " on" : ""}`} onClick={() => setStrokeWidth(w)} title={`${w}px`}><div className="fc-stroke-line" style={{ width: 14, height: Math.max(w, 1) }} /></div>)}
          </div>
        </div>

        {selectedEl && (
          <div className="fc-sel-info">
            <span>{selectedEl.type}</span><span>·</span>
            <span>{Math.round(selectedEl.x)}, {Math.round(selectedEl.y)}</span>
            {selectedEl.w !== undefined && <><span>·</span><span>{Math.abs(Math.round(selectedEl.w))}×{Math.abs(Math.round(selectedEl.h))}</span></>}
            <span>·</span><button className="fc-sel-info-del" onClick={deleteSelected}>Delete</button>
          </div>
        )}

        <div className={`fc-canvas${tool === "hand" ? " hand" : ""}${panning ? " panning" : ""}${tool === "select" ? " selecting" : ""}`}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onWheel={handleWheel}>
          <svg className="fc-grid" width="100%" height="100%">
            <defs><pattern id="grid" width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse" x={offset.x % (20 * zoom)} y={offset.y % (20 * zoom)}><circle cx={1} cy={1} r={0.5} fill="var(--ink-300)" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <svg ref={svgRef} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
            <g transform={`translate(${offset.x},${offset.y}) scale(${zoom})`}>
              {elements.map(el => renderElement(el))}
              {currentElement && !currentElement.dragStart && renderElement(currentElement)}
              {selectedEl && selectedEl.type !== "text" && selectedEl.type !== "draw" && (() => {
                const sx = Math.min(selectedEl.x, selectedEl.x + (selectedEl.w || 0)) - 6;
                const sy = Math.min(selectedEl.y, selectedEl.y + (selectedEl.h || 0)) - 6;
                const sw = Math.abs(selectedEl.w || 0) + 12;
                const sh = Math.abs(selectedEl.h || 0) + 12;
                return <g><rect x={sx} y={sy} width={sw} height={sh} className="fc-sel-box" /><rect x={sx - 3} y={sy - 3} width={7} height={7} rx={2} className="fc-sel-handle" /><rect x={sx + sw - 4} y={sy - 3} width={7} height={7} rx={2} className="fc-sel-handle" /><rect x={sx - 3} y={sy + sh - 4} width={7} height={7} rx={2} className="fc-sel-handle" /><rect x={sx + sw - 4} y={sy + sh - 4} width={7} height={7} rx={2} className="fc-sel-handle" /></g>;
              })()}
            </g>
          </svg>
          {textInput && <input ref={textRef} className="fc-text-input" style={{ left: textInput.x * zoom + offset.x, top: textInput.y * zoom + offset.y }} value={textValue} onChange={e => setTextValue(e.target.value)} onKeyDown={e => { if (e.key === "Enter") submitText(); if (e.key === "Escape") { setTextInput(null); setTextValue(""); } }} onBlur={submitText} placeholder="Type here..." />}
        </div>

        <div className="fc-actions">
          <button className="fc-act" onClick={undo}>↶ Undo</button>
          <button className="fc-act" onClick={redo}>↷ Redo</button>
          <span className="fc-act-sep" />
          <button className="fc-act" onClick={() => { setElements([]); pushHistory([]); }}>Clear</button>
          <span className="fc-act-sep" />
          <button className="fc-act">{elements.length} elements</button>
        </div>

        <div className="fc-zoom">
          <button className="fc-zoom-btn" onClick={() => setZoom(prev => Math.max(0.2, prev * 0.85))}>−</button>
          <span className="fc-zoom-val" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</span>
          <button className="fc-zoom-btn" onClick={() => setZoom(prev => Math.min(5, prev * 1.15))}>+</button>
        </div>

        <div className="fc-title">
          <svg width="12" height="12" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
          Felmark Canvas
        </div>
      </div>
    </>
  );
}
