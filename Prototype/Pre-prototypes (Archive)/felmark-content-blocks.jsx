import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK CONTENT BLOCKS — all 14 types
   The building blocks of every document
   ═══════════════════════════════════════════ */

// ── 1-4. Headings + Paragraph (shown inline in document) ──

// ── 5. Callout variants ──
function Callout({ type = "info", children }) {
  const cfg = {
    info:    { icon: "ℹ", color: "#5b7fa4", bg: "rgba(91,127,164,0.03)", border: "rgba(91,127,164,0.1)" },
    warning: { icon: "⚠", color: "#c89360", bg: "rgba(200,147,96,0.03)", border: "rgba(200,147,96,0.1)" },
    success: { icon: "✓", color: "#5a9a3c", bg: "rgba(90,154,60,0.03)", border: "rgba(90,154,60,0.1)" },
    danger:  { icon: "✕", color: "#c24b38", bg: "rgba(194,75,56,0.03)", border: "rgba(194,75,56,0.1)" },
    quote:   { icon: "❝", color: "var(--ink-500)", bg: "var(--warm-50)", border: "var(--warm-300)" },
  }[type];
  const isQuote = type === "quote";

  return (
    <div className="cb-callout" style={{ background: cfg.bg, borderColor: cfg.border }}>
      <span className="cb-callout-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
      <div className={`cb-callout-body${isQuote ? " quote" : ""}`} style={isQuote ? { fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontStyle: "italic", color: "var(--ink-600)" } : {}}>
        {children}
      </div>
    </div>
  );
}

// ── 6. Code Block ──
function CodeBlock({ language = "css", code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const highlight = (line) => {
    return line
      .replace(/(--[\w-]+)/g, '<span class="cb-code-var">$1</span>')
      .replace(/(#[a-fA-F0-9]{3,8})/g, '<span class="cb-code-color">$1</span>')
      .replace(/('[^']*'|"[^"]*")/g, '<span class="cb-code-str">$1</span>')
      .replace(/\b(const|let|var|function|return|import|from|export)\b/g, '<span class="cb-code-kw">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="cb-code-comment">$1</span>');
  };

  return (
    <div className="cb-code">
      <div className="cb-code-head">
        <span className="cb-code-lang">{language}</span>
        <button className="cb-code-copy" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
      </div>
      <div className="cb-code-body">
        {code.split("\n").map((line, i) => (
          <div key={i} className="cb-code-line">
            <span className="cb-code-num">{i + 1}</span>
            <span className="cb-code-text" dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 7. Table ──
function TableBlock({ initialData }) {
  const [data, setData] = useState(initialData || [
    ["Deliverable", "Hours", "Rate", "Total"],
    ["Logo design", "16", "$95", "$1,520"],
    ["Brand guidelines", "24", "$95", "$2,280"],
    ["Social templates", "8", "$95", "$760"],
    ["Typography system", "12", "$95", "$1,140"],
  ]);
  const [editCell, setEditCell] = useState(null);

  const updateCell = (r, c, val) => {
    setData(prev => prev.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? val : cell) : row));
  };

  return (
    <div className="cb-table-wrap">
      <table className="cb-table">
        <thead>
          <tr>{data[0].map((h, ci) => <th key={ci}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}
                  className={editCell === `${ri+1}-${ci}` ? "editing" : ""}
                  onClick={() => setEditCell(`${ri+1}-${ci}`)}>
                  {editCell === `${ri+1}-${ci}` ? (
                    <input className="cb-table-input" value={cell} autoFocus
                      onChange={e => updateCell(ri + 1, ci, e.target.value)}
                      onBlur={() => setEditCell(null)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === "Tab") setEditCell(null); }} />
                  ) : (
                    <span className={ci >= 1 ? "mono" : ""}>{cell}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cb-table-footer">
        <span>Click any cell to edit</span>
        <span>4 rows × 4 columns</span>
      </div>
    </div>
  );
}

// ── 8. Accordion ──
function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className="cb-accordion">
      {items.map((item, i) => (
        <div key={i} className={`cb-acc-item${openIdx === i ? " open" : ""}`}>
          <button className="cb-acc-trigger" onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
            <span className="cb-acc-arrow">{openIdx === i ? "▾" : "▸"}</span>
            <span className="cb-acc-title">{item.title}</span>
          </button>
          {openIdx === i && (
            <div className="cb-acc-content">{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── 9. Divider variants ──
function Divider({ variant = "solid", label, timestamp }) {
  if (variant === "labeled") return (
    <div className="cb-divider-labeled"><span className="cb-divider-label-text">{label}</span></div>
  );
  if (variant === "timestamped") return (
    <div className="cb-divider-labeled"><span className="cb-divider-label-text">{timestamp}</span></div>
  );
  return <div className={`cb-divider cb-divider-${variant}`} />;
}

// ── 10. Math / Formula ──
function MathBlock({ formula, variables, result }) {
  return (
    <div className="cb-math">
      <div className="cb-math-head">
        <span className="cb-math-icon">∑</span>
        <span className="cb-math-label">Formula</span>
      </div>
      <div className="cb-math-formula">{formula}</div>
      {variables && (
        <div className="cb-math-vars">
          {variables.map((v, i) => (
            <div key={i} className="cb-math-var">
              <span className="cb-math-var-name">{v.name}</span>
              <span className="cb-math-var-eq">=</span>
              <span className="cb-math-var-val">{v.value}</span>
            </div>
          ))}
        </div>
      )}
      {result && (
        <div className="cb-math-result">
          <span className="cb-math-result-label">Result</span>
          <span className="cb-math-result-val">{result}</span>
        </div>
      )}
    </div>
  );
}

// ── 11. Image Gallery ──
function ImageGallery({ images }) {
  const [lightbox, setLightbox] = useState(null);
  const colors = ["#d5d1c8", "#e5e2db", "#b8b3a8", "#f0eee9", "#c8c3ba", "#ddd9d1"];

  return (
    <>
      <div className="cb-gallery">
        {images.map((img, i) => (
          <div key={i} className="cb-gallery-item" onClick={() => setLightbox(i)}
            style={{ background: colors[i % colors.length] }}>
            <div className="cb-gallery-placeholder">{img.icon || "◇"}</div>
            <div className="cb-gallery-caption">{img.caption}</div>
          </div>
        ))}
      </div>
      {lightbox !== null && (
        <div className="cb-lightbox" onClick={() => setLightbox(null)}>
          <div className="cb-lightbox-inner" onClick={e => e.stopPropagation()}>
            <div className="cb-lightbox-img" style={{ background: colors[lightbox % colors.length] }}>
              <span style={{ fontSize: 48, color: "var(--ink-300)" }}>{images[lightbox].icon || "◇"}</span>
            </div>
            <div className="cb-lightbox-info">
              <span className="cb-lightbox-caption">{images[lightbox].caption}</span>
              <span className="cb-lightbox-meta">{images[lightbox].meta}</span>
            </div>
            <button className="cb-lightbox-close" onClick={() => setLightbox(null)}>×</button>
            {lightbox > 0 && <button className="cb-lightbox-nav left" onClick={() => setLightbox(lightbox - 1)}>‹</button>}
            {lightbox < images.length - 1 && <button className="cb-lightbox-nav right" onClick={() => setLightbox(lightbox + 1)}>›</button>}
          </div>
        </div>
      )}
    </>
  );
}

// ── 12. Color Swatches with Contrast Checker ──
function ColorSwatches({ colors }) {
  const [selected, setSelected] = useState(null);
  const getLuminance = (hex) => {
    const rgb = hex.match(/[a-f\d]{2}/gi).map(v => { let c = parseInt(v, 16) / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  const getContrast = (hex1, hex2) => {
    const l1 = getLuminance(hex1), l2 = getLuminance(hex2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio.toFixed(2);
  };
  const sel = selected !== null ? colors[selected] : null;

  return (
    <div className="cb-swatches">
      <div className="cb-swatch-grid">
        {colors.map((c, i) => (
          <div key={i} className={`cb-swatch${selected === i ? " on" : ""}`} onClick={() => setSelected(selected === i ? null : i)}>
            <div className="cb-swatch-circle" style={{ background: c.hex }} />
            <span className="cb-swatch-name">{c.name}</span>
            <span className="cb-swatch-hex">{c.hex}</span>
          </div>
        ))}
      </div>
      {sel && (
        <div className="cb-contrast-panel">
          <div className="cb-contrast-label">Contrast against {sel.name}</div>
          <div className="cb-contrast-rows">
            {colors.filter((_, i) => i !== selected).map((c, i) => {
              const ratio = getContrast(sel.hex, c.hex);
              const pass = ratio >= 4.5;
              return (
                <div key={i} className="cb-contrast-row">
                  <div className="cb-contrast-pair">
                    <span className="cb-contrast-dot" style={{ background: sel.hex }} />
                    <span className="cb-contrast-dot" style={{ background: c.hex }} />
                  </div>
                  <span className="cb-contrast-name">{c.name}</span>
                  <span className="cb-contrast-ratio">{ratio}:1</span>
                  <span className={`cb-contrast-badge ${pass ? "pass" : "fail"}`}>{pass ? "AA ✓" : "Fail"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── 13. Before/After Slider ──
function BeforeAfter({ beforeLabel = "Before", afterLabel = "After" }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPos(pct);
  };

  return (
    <div className="cb-ba" ref={containerRef}
      onMouseDown={() => { dragging.current = true; }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onMouseMove={e => { if (dragging.current) handleMove(e.clientX); }}
      onTouchMove={e => handleMove(e.touches[0].clientX)}>
      <div className="cb-ba-before" style={{ background: "#e5e2db" }}>
        <span className="cb-ba-placeholder" style={{ color: "#9b988f" }}>Before state</span>
      </div>
      <div className="cb-ba-after" style={{ clipPath: `inset(0 0 0 ${pos}%)`, background: "#f0eee9" }}>
        <span className="cb-ba-placeholder" style={{ color: "#7d7a72" }}>After state</span>
      </div>
      <div className="cb-ba-slider" style={{ left: `${pos}%` }}>
        <div className="cb-ba-handle">
          <span>‹›</span>
        </div>
        <div className="cb-ba-line" />
      </div>
      <span className="cb-ba-label left">{beforeLabel}</span>
      <span className="cb-ba-label right">{afterLabel}</span>
    </div>
  );
}

// ── 14. Bookmark Card ──
function BookmarkCard({ url, title, description, source, favicon }) {
  return (
    <div className="cb-bookmark">
      <div className="cb-bookmark-body">
        <div className="cb-bookmark-source">
          <span className="cb-bookmark-favicon">{favicon}</span>
          <span>{source}</span>
        </div>
        <div className="cb-bookmark-title">{title}</div>
        <div className="cb-bookmark-desc">{description}</div>
        <div className="cb-bookmark-url">{url}</div>
      </div>
      <div className="cb-bookmark-arrow">↗</div>
    </div>
  );
}

// ── 15. Embed Block ──
function EmbedBlock({ type, title, url, meta }) {
  const cfg = {
    figma: { icon: "F", color: "#a259ff", label: "Figma" },
    loom: { icon: "▶", color: "#625df5", label: "Loom" },
    gdrive: { icon: "△", color: "#4285f4", label: "Google Drive" },
    notion: { icon: "N", color: "#2c2a25", label: "Notion" },
  }[type];
  return (
    <div className="cb-embed">
      <div className="cb-embed-preview">
        <span className="cb-embed-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
      </div>
      <div className="cb-embed-info">
        <div className="cb-embed-source" style={{ color: cfg.color }}>{cfg.label}</div>
        <div className="cb-embed-title">{title}</div>
        {meta && <div className="cb-embed-meta">{meta}</div>}
        <div className="cb-embed-url">{url}</div>
      </div>
      <div className="cb-embed-open">Open ↗</div>
    </div>
  );
}


/* ═══════════════════════════
   SHOWCASE DOCUMENT
   ═══════════════════════════ */
export default function ContentBlocks() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .page{font-family:'Outfit',sans-serif;font-size:15px;color:var(--ink-700);background:var(--parchment);min-height:100vh}
        .canvas{max-width:740px;margin:0 auto;padding:48px 40px 120px}
        .doc-h1{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:6px}
        .doc-h2{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900);margin:28px 0 8px}
        .doc-h3{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--ink-800);margin:20px 0 6px}
        .doc-p{font-size:15px;color:var(--ink-600);line-height:1.8;margin-bottom:10px}
        .doc-meta{font-family:var(--mono);font-size:11px;color:var(--ink-400);margin-bottom:24px;display:flex;gap:12px;align-items:center;padding-bottom:20px;border-bottom:1px solid var(--warm-200)}
        .doc-note{font-size:13px;color:var(--ink-400);font-style:italic;padding:10px 16px;border-left:2px solid var(--warm-300);margin:14px 0;line-height:1.6}
        .cat{font-family:var(--mono);font-size:9px;color:var(--ink-300);letter-spacing:.1em;text-transform:uppercase;margin:24px 0 8px;display:flex;align-items:center;gap:8px}.cat::after{content:'';flex:1;height:1px;background:var(--warm-200)}
        .block-label{font-family:var(--mono);font-size:10px;color:var(--ember);margin-bottom:6px;display:block}

        /* ══ CALLOUT ══ */
        .cb-callout{display:flex;align-items:flex-start;gap:12px;padding:14px 18px;border:1px solid;border-radius:8px;margin:10px 0;line-height:1.6;font-size:14px;color:var(--ink-600)}
        .cb-callout-icon{font-size:16px;flex-shrink:0;margin-top:1px}
        .cb-callout-body{flex:1}

        /* ══ CODE ══ */
        .cb-code{border-radius:10px;overflow:hidden;margin:12px 0;border:1px solid var(--warm-200)}
        .cb-code-head{display:flex;justify-content:space-between;align-items:center;padding:8px 16px;background:var(--warm-50);border-bottom:1px solid var(--warm-100)}
        .cb-code-lang{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em}
        .cb-code-copy{font-family:var(--mono);font-size:10px;color:var(--ink-400);background:none;border:1px solid var(--warm-200);border-radius:4px;padding:2px 10px;cursor:pointer;transition:all .08s}
        .cb-code-copy:hover{background:var(--warm-100);color:var(--ink-600)}
        .cb-code-body{background:var(--ink-900);padding:16px 0;overflow-x:auto}
        .cb-code-line{display:flex;padding:0 16px;min-height:22px}
        .cb-code-line:hover{background:rgba(255,255,255,0.02)}
        .cb-code-num{width:32px;text-align:right;padding-right:16px;font-family:var(--mono);font-size:12px;color:rgba(255,255,255,0.15);flex-shrink:0;user-select:none}
        .cb-code-text{font-family:var(--mono);font-size:12.5px;color:rgba(255,255,255,0.6);line-height:1.7;white-space:pre}
        .cb-code-var{color:#c89360}.cb-code-str{color:#98c379}.cb-code-kw{color:#7eb8da}.cb-code-color{color:#c89360}.cb-code-comment{color:rgba(255,255,255,0.2);font-style:italic}

        /* ══ TABLE ══ */
        .cb-table-wrap{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:12px 0}
        .cb-table{width:100%;border-collapse:collapse;font-size:13px}
        .cb-table th{text-align:left;padding:10px 14px;background:var(--warm-50);border-bottom:1px solid var(--warm-200);font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;font-weight:500}
        .cb-table td{padding:9px 14px;border-bottom:1px solid var(--warm-100);color:var(--ink-600);cursor:pointer;transition:background .06s}
        .cb-table td:hover{background:var(--warm-50)}
        .cb-table td.editing{background:var(--ember-bg);padding:4px 8px}
        .cb-table td .mono{font-family:var(--mono);font-size:12px}
        .cb-table-input{width:100%;padding:5px 6px;border:1px solid var(--ember);border-radius:4px;font-family:inherit;font-size:13px;color:var(--ink-800);outline:none;background:#fff}
        .cb-table-footer{display:flex;justify-content:space-between;padding:6px 14px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .cb-table tr:last-child td{border-bottom:none}

        /* ══ ACCORDION ══ */
        .cb-accordion{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:12px 0}
        .cb-acc-item{border-bottom:1px solid var(--warm-100)}
        .cb-acc-item:last-child{border-bottom:none}
        .cb-acc-trigger{width:100%;display:flex;align-items:center;gap:8px;padding:12px 16px;background:none;border:none;cursor:pointer;font-family:inherit;font-size:14px;color:var(--ink-700);font-weight:500;text-align:left;transition:background .06s}
        .cb-acc-trigger:hover{background:var(--warm-50)}
        .cb-acc-arrow{font-size:10px;color:var(--ink-300);width:14px;flex-shrink:0}
        .cb-acc-content{padding:0 16px 14px 38px;font-size:14px;color:var(--ink-500);line-height:1.6;animation:accIn .15s ease}
        @keyframes accIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}

        /* ══ DIVIDERS ══ */
        .cb-divider{margin:20px 0}
        .cb-divider-solid{border:none;height:1px;background:var(--warm-200)}
        .cb-divider-dotted{border:none;height:1px;background:repeating-linear-gradient(90deg,var(--warm-300),var(--warm-300) 4px,transparent 4px,transparent 10px)}
        .cb-divider-dashed{border:none;height:1px;background:repeating-linear-gradient(90deg,var(--warm-300),var(--warm-300) 8px,transparent 8px,transparent 16px)}
        .cb-divider-thick{border:none;height:3px;background:var(--warm-200);border-radius:2px}
        .cb-divider-labeled{display:flex;align-items:center;gap:12px;margin:20px 0}
        .cb-divider-labeled::before,.cb-divider-labeled::after{content:'';flex:1;height:1px;background:var(--warm-200)}
        .cb-divider-label-text{font-family:var(--mono);font-size:10px;color:var(--ink-300);white-space:nowrap}

        /* ══ MATH ══ */
        .cb-math{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:12px 0}
        .cb-math-head{display:flex;align-items:center;gap:6px;padding:8px 16px;background:var(--warm-50);border-bottom:1px solid var(--warm-100)}
        .cb-math-icon{font-size:14px;color:var(--ember)}
        .cb-math-label{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em}
        .cb-math-formula{padding:16px 20px;font-family:var(--mono);font-size:16px;color:var(--ink-800);letter-spacing:.02em}
        .cb-math-vars{padding:0 16px 12px;display:flex;gap:12px;flex-wrap:wrap}
        .cb-math-var{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:12px}
        .cb-math-var-name{color:var(--ink-500)}
        .cb-math-var-eq{color:var(--ink-300)}
        .cb-math-var-val{color:var(--ink-700);font-weight:500}
        .cb-math-result{padding:10px 16px;border-top:1px solid var(--warm-100);display:flex;justify-content:space-between;align-items:center;background:var(--warm-50)}
        .cb-math-result-label{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em}
        .cb-math-result-val{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ember)}

        /* ══ GALLERY ══ */
        .cb-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}
        .cb-gallery-item{aspect-ratio:4/3;border-radius:8px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:all .12s;border:1px solid var(--warm-200)}
        .cb-gallery-item:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.04)}
        .cb-gallery-placeholder{font-size:28px;color:var(--ink-300);margin-bottom:4px}
        .cb-gallery-caption{font-size:11px;color:var(--ink-400)}
        .cb-lightbox{position:fixed;inset:0;background:rgba(44,42,37,.8);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center}
        .cb-lightbox-inner{width:560px;background:var(--parchment);border-radius:12px;overflow:hidden;position:relative;box-shadow:0 16px 48px rgba(0,0,0,.2)}
        .cb-lightbox-img{height:320px;display:flex;align-items:center;justify-content:center}
        .cb-lightbox-info{padding:14px 20px;display:flex;justify-content:space-between;align-items:center}
        .cb-lightbox-caption{font-size:14px;font-weight:500;color:var(--ink-800)}
        .cb-lightbox-meta{font-family:var(--mono);font-size:11px;color:var(--ink-300)}
        .cb-lightbox-close{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:6px;border:none;background:rgba(0,0,0,.3);color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .cb-lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:6px;border:none;background:rgba(0,0,0,.2);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .cb-lightbox-nav.left{left:12px}.cb-lightbox-nav.right{right:12px}

        /* ══ COLOR SWATCHES ══ */
        .cb-swatches{margin:12px 0}
        .cb-swatch-grid{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}
        .cb-swatch{display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;padding:6px;border-radius:6px;transition:all .08s;border:1px solid transparent}
        .cb-swatch:hover{background:var(--warm-50)}
        .cb-swatch.on{border-color:var(--ember);background:var(--ember-bg)}
        .cb-swatch-circle{width:52px;height:52px;border-radius:10px;border:1px solid rgba(0,0,0,.06);box-shadow:0 2px 6px rgba(0,0,0,.04)}
        .cb-swatch-name{font-size:11px;color:var(--ink-500);font-weight:500}
        .cb-swatch-hex{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .cb-contrast-panel{border:1px solid var(--warm-200);border-radius:8px;padding:12px 14px;margin-top:8px}
        .cb-contrast-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
        .cb-contrast-rows{display:flex;flex-direction:column;gap:4px}
        .cb-contrast-row{display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px}
        .cb-contrast-pair{display:flex;gap:2px}.cb-contrast-dot{width:14px;height:14px;border-radius:3px;border:1px solid rgba(0,0,0,.06)}
        .cb-contrast-name{flex:1;color:var(--ink-500)}
        .cb-contrast-ratio{font-family:var(--mono);font-size:11px;color:var(--ink-700);font-weight:500;min-width:50px;text-align:right}
        .cb-contrast-badge{font-family:var(--mono);font-size:9px;font-weight:500;padding:1px 6px;border-radius:3px;min-width:40px;text-align:center}
        .cb-contrast-badge.pass{color:#5a9a3c;background:rgba(90,154,60,.06);border:1px solid rgba(90,154,60,.1)}
        .cb-contrast-badge.fail{color:#c24b38;background:rgba(194,75,56,.06);border:1px solid rgba(194,75,56,.1)}

        /* ══ BEFORE/AFTER ══ */
        .cb-ba{position:relative;height:240px;border-radius:10px;overflow:hidden;margin:12px 0;cursor:ew-resize;border:1px solid var(--warm-200);user-select:none}
        .cb-ba-before,.cb-ba-after{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
        .cb-ba-placeholder{font-family:var(--mono);font-size:14px}
        .cb-ba-slider{position:absolute;top:0;bottom:0;width:2px;background:var(--ember);z-index:5;transform:translateX(-50%)}
        .cb-ba-handle{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%;background:#fff;border:2px solid var(--ember);display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--ember);box-shadow:0 2px 8px rgba(0,0,0,.1)}
        .cb-ba-line{position:absolute;top:0;bottom:0;width:2px;background:var(--ember);left:50%;transform:translateX(-50%)}
        .cb-ba-label{position:absolute;top:10px;font-family:var(--mono);font-size:10px;padding:2px 8px;border-radius:3px;color:var(--ink-400);background:rgba(255,255,255,.8)}
        .cb-ba-label.left{left:10px}.cb-ba-label.right{right:10px}

        /* ══ BOOKMARK ══ */
        .cb-bookmark{display:flex;align-items:center;border:1px solid var(--warm-200);border-radius:8px;padding:14px 16px;margin:10px 0;cursor:pointer;transition:all .08s;gap:12px}
        .cb-bookmark:hover{border-color:var(--warm-300);box-shadow:0 2px 8px rgba(0,0,0,.03)}
        .cb-bookmark-body{flex:1;min-width:0}
        .cb-bookmark-source{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:10px;color:var(--ink-400);margin-bottom:3px}
        .cb-bookmark-favicon{width:14px;height:14px;border-radius:3px;background:var(--warm-200);display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--ink-500)}
        .cb-bookmark-title{font-size:14px;font-weight:500;color:var(--ink-800);margin-bottom:2px}
        .cb-bookmark-desc{font-size:12.5px;color:var(--ink-400);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .cb-bookmark-url{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-top:3px}
        .cb-bookmark-arrow{font-size:14px;color:var(--ink-300);flex-shrink:0}

        /* ══ EMBED ══ */
        .cb-embed{display:flex;border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:10px 0;cursor:pointer;transition:all .08s}
        .cb-embed:hover{border-color:var(--warm-300);box-shadow:0 2px 8px rgba(0,0,0,.03)}
        .cb-embed-preview{width:80px;background:var(--warm-50);display:flex;align-items:center;justify-content:center;flex-shrink:0;border-right:1px solid var(--warm-100)}
        .cb-embed-icon{font-size:22px;font-weight:700;font-family:var(--mono)}
        .cb-embed-info{flex:1;padding:12px 14px}
        .cb-embed-source{font-family:var(--mono);font-size:9px;font-weight:500;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px}
        .cb-embed-title{font-size:14px;font-weight:500;color:var(--ink-800);margin-bottom:2px}
        .cb-embed-meta{font-size:12px;color:var(--ink-400)}
        .cb-embed-url{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-top:2px}
        .cb-embed-open{padding:0 16px;display:flex;align-items:center;font-family:var(--mono);font-size:11px;color:var(--ink-400);flex-shrink:0;border-left:1px solid var(--warm-100);transition:color .08s}
        .cb-embed:hover .cb-embed-open{color:var(--ember)}
      `}</style>

      <div className="page"><div className="canvas">
        <h1 className="doc-h1">Content Blocks</h1>
        <div className="doc-meta"><span>Felmark Block Library</span><span>·</span><span>14 content block types</span><span>·</span><span>Type / to insert</span></div>

        {/* HEADINGS */}
        <div className="cat">headings & text</div>
        <h1 className="doc-h1">Heading 1 — Page Titles</h1>
        <h2 className="doc-h2">Heading 2 — Section Headers</h2>
        <h3 className="doc-h3">Heading 3 — Subsection Labels</h3>
        <p className="doc-p">Paragraph text flows in Outfit at 15px with generous 1.8 line height. Designed for long-form writing — proposals, scope documents, project notes. Every word has room to breathe.</p>

        {/* CALLOUTS */}
        <div className="cat">callout variants</div>
        <Callout type="info">This project is covered under the Freelance Service Agreement signed on March 15, 2026.</Callout>
        <Callout type="warning">Budget is 70% consumed with 35% of deliverables remaining. Consider discussing a change order with the client.</Callout>
        <Callout type="success">All color pairs pass WCAG AA contrast requirements. The palette is accessibility-compliant.</Callout>
        <Callout type="danger">This contract expires in 7 days. Renew before April 5 to avoid a gap in coverage.</Callout>
        <Callout type="quote">Design is not just what it looks like and feels like. Design is how it works. <span style={{ display: "block", fontStyle: "normal", fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-400)", marginTop: 6 }}>— Steve Jobs</span></Callout>

        {/* CODE */}
        <div className="cat">code block</div>
        <CodeBlock language="css" code={`--parchment: #faf9f7;
--warm-200: #e5e2db;
--ink-900: #2c2a25;
--ember: #b07d4f;

// Typography scale
--font-body: 'Outfit', sans-serif;
--font-heading: 'Cormorant Garamond', serif;
--scale-base: 16px;
--scale-xl: 24px;`} />

        {/* TABLE */}
        <div className="cat">table</div>
        <p className="doc-p">Click any cell to edit it inline.</p>
        <TableBlock />

        {/* ACCORDION */}
        <div className="cat">accordion / toggle</div>
        <Accordion items={[
          { title: "What's included in the brand guidelines?", content: "Logo usage rules, color palette (hex/RGB/CMYK), typography scale with font pairings, imagery direction, and social media templates for Instagram and LinkedIn." },
          { title: "How many revision rounds are included?", content: "Three rounds of revisions are included in the project fee. Additional rounds are billed at $95/hr." },
          { title: "Who owns the final deliverables?", content: "Full intellectual property rights transfer to the client upon final payment. Source files are included in the delivery." },
          { title: "What if the project scope changes?", content: "Scope changes are handled through a formal Change Order, which adjusts the timeline and budget with both parties' approval." },
        ]} />

        {/* DIVIDERS */}
        <div className="cat">divider variants</div>
        <span className="block-label">Solid</span>
        <Divider variant="solid" />
        <span className="block-label">Dotted</span>
        <Divider variant="dotted" />
        <span className="block-label">Dashed</span>
        <Divider variant="dashed" />
        <span className="block-label">Thick</span>
        <Divider variant="thick" />
        <span className="block-label">Labeled</span>
        <Divider variant="labeled" label="Section 2 of 5" />
        <span className="block-label">Timestamped</span>
        <Divider variant="timestamped" timestamp="Updated Mar 29, 2026 · 3:42 PM" />

        {/* MATH */}
        <div className="cat">math / formula</div>
        <MathBlock
          formula="Total = (Hours × Rate) + Expenses − Discount"
          variables={[
            { name: "Hours", value: "32" },
            { name: "Rate", value: "$95" },
            { name: "Expenses", value: "$320" },
            { name: "Discount", value: "$200" },
          ]}
          result="$3,160"
        />

        {/* GALLERY */}
        <div className="cat">image gallery</div>
        <p className="doc-p">Click any image to open lightbox. Navigate with arrows.</p>
        <ImageGallery images={[
          { caption: "Mood Board", meta: "1200 × 800 · PNG", icon: "◆" },
          { caption: "Logo Concepts", meta: "2400 × 1600 · PDF", icon: "✦" },
          { caption: "Color Exploration", meta: "1800 × 1200 · PNG", icon: "◎" },
          { caption: "Typography Tests", meta: "1600 × 1000 · FIG", icon: "Aa" },
          { caption: "Icon Set v1", meta: "800 × 800 · SVG", icon: "⬡" },
          { caption: "Social Mockup", meta: "1080 × 1080 · PNG", icon: "☰" },
        ]} />

        {/* COLOR SWATCHES */}
        <div className="cat">color swatches with contrast checker</div>
        <p className="doc-p">Click any swatch to check contrast ratios against all other colors.</p>
        <ColorSwatches colors={[
          { name: "Parchment", hex: "#faf9f7" },
          { name: "Warm 200", hex: "#e5e2db" },
          { name: "Ink 900", hex: "#2c2a25" },
          { name: "Ember", hex: "#b07d4f" },
          { name: "Green", hex: "#5a9a3c" },
          { name: "Blue", hex: "#5b7fa4" },
        ]} />

        {/* BEFORE / AFTER */}
        <div className="cat">before / after slider</div>
        <p className="doc-p">Drag the handle to compare. Perfect for design reviews.</p>
        <BeforeAfter beforeLabel="Current Site" afterLabel="Redesign" />

        {/* BOOKMARKS */}
        <div className="cat">bookmark cards</div>
        <BookmarkCard url="dribbble.com/shots/meridian-branding" title="Meridian Studio — Brand Case Study" description="Full branding case study showing logo development, color palette, and typography system." source="Dribbble" favicon="Dr" />
        <BookmarkCard url="figma.com/file/abc123" title="Brand Guidelines v2 — Design System" description="Master Figma file with components, styles, and auto-layout frames." source="Figma" favicon="F" />

        {/* EMBEDS */}
        <div className="cat">embed blocks</div>
        <EmbedBlock type="figma" title="Typography Scale — Master File" url="figma.com/file/abc123/Typography-Scale" meta="Last edited 2h ago · 12 frames" />
        <EmbedBlock type="loom" title="Brand Guidelines Walkthrough" url="loom.com/share/xyz789" meta="12:34 · Recorded Mar 28" />
        <EmbedBlock type="gdrive" title="Client Assets Folder" url="drive.google.com/drive/folders/abc" meta="24 files · Shared with Sarah" />
        <EmbedBlock type="notion" title="Project Brief — Original" url="notion.so/meridian/brief-abc" meta="Created Oct 2025" />

        <div className="doc-note">All 14 content block types are shown above. Type <span style={{ fontFamily: "var(--mono)", background: "var(--warm-100)", padding: "1px 6px", borderRadius: 3, fontSize: 13 }}>/</span> in the editor to insert any block.</div>
      </div></div>
    </>
  );
}
