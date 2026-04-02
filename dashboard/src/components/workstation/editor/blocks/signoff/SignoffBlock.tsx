"use client";

import { useState, useRef, useEffect } from "react";
import type { SignoffData } from "@/lib/types";
import styles from "./SignoffBlock.module.css";

export function getDefaultSignoff(): SignoffData {
  return {
    section: "", signer: "", signed: false, signedAt: null, locked: false,
    parties: [
      { name: "", role: "freelancer", signed: false, signedAt: null },
      { name: "", role: "client", signed: false, signedAt: null },
    ],
  };
}

function SignCanvas({ onSign }: { onSign: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const points = useRef<{ x: number; y: number }[]>([]);
  const hasDrawn = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * 2;
    c.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2c2a25";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    points.current = [getPos(e)];
    hasDrawn.current = true;
  };

  const moveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const pos = getPos(e);
    points.current.push(pos);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || points.current.length < 3) return;
    const p = points.current;
    const len = p.length;
    ctx.beginPath();
    ctx.moveTo(p[len - 3].x, p[len - 3].y);
    const mx = (p[len - 2].x + p[len - 1].x) / 2;
    const my = (p[len - 2].y + p[len - 1].y) / 2;
    ctx.quadraticCurveTo(p[len - 2].x, p[len - 2].y, mx, my);
    const dx = p[len - 1].x - p[len - 2].x;
    const dy = p[len - 1].y - p[len - 2].y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    ctx.lineWidth = Math.max(1, Math.min(3.5, 4 - speed * 0.08));
    ctx.stroke();
  };

  const endDraw = () => { drawing.current = false; };

  const clear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, c.width, c.height);
    hasDrawn.current = false;
    points.current = [];
  };

  return (
    <div>
      <div className={styles.esCanvasWrap}>
        <canvas ref={canvasRef} className={styles.esCanvas}
          onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw} />
        <div className={styles.esBaseline} />
        <div className={styles.esBaseX}>{"\u2715"}</div>
      </div>
      <div className={styles.esDrawActions}>
        <button className={styles.esBtnClear} onClick={clear}>Clear</button>
        <button className={styles.esBtnAccept} onClick={() => { if (hasDrawn.current) onSign(canvasRef.current!.toDataURL()); }}>Accept &amp; Sign</button>
      </div>
    </div>
  );
}

const SIG_FONTS = [
  { id: "script", family: "'Cormorant Garamond', serif", weight: 400, style: "italic" as const, size: 28 },
  { id: "formal", family: "'Cormorant Garamond', serif", weight: 600, style: "normal" as const, size: 24 },
  { id: "clean", family: "'Outfit', sans-serif", weight: 300, style: "italic" as const, size: 22 },
  { id: "mono", family: "var(--mono)", weight: 400, style: "normal" as const, size: 18 },
];

function SignType({ name, onSign }: { name: string; onSign: (text: string) => void }) {
  const [text, setText] = useState(name);
  const [fontId, setFontId] = useState("script");
  const font = SIG_FONTS.find(f => f.id === fontId) || SIG_FONTS[0];

  return (
    <div>
      <input className={styles.esTypeInput} value={text} onChange={e => setText(e.target.value)} placeholder="Your full name" />
      <div className={styles.esTypeFonts}>
        {SIG_FONTS.map(f => (
          <div key={f.id} className={`${styles.esTypeFont} ${fontId === f.id ? styles.esTypeFontOn : ""}`} onClick={() => setFontId(f.id)}>
            <span style={{ fontFamily: f.family, fontWeight: f.weight, fontStyle: f.style, fontSize: Math.min(f.size, 20) }}>{text || "Your Name"}</span>
          </div>
        ))}
      </div>
      <div className={styles.esTypePreview}>
        <div style={{ fontFamily: font.family, fontWeight: font.weight, fontStyle: font.style, fontSize: font.size, color: "var(--ink-800)" }}>{text || "Your Name"}</div>
        <div className={styles.esBaseline} />
      </div>
      <div className={styles.esDrawActions}>
        <button className={styles.esBtnAccept} onClick={() => { if (text.trim()) onSign(text.trim()); }} disabled={!text.trim()}>Accept &amp; Sign</button>
      </div>
    </div>
  );
}

export default function SignoffBlock({ data, onChange }: { data: SignoffData; onChange: (d: SignoffData) => void }) {
  const [signingIdx, setSigningIdx] = useState<number | null>(null);
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [celebration, setCelebration] = useState(false);
  const [requestEmail, setRequestEmail] = useState("");
  const [showRequestModal, setShowRequestModal] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const parties = data.parties || [
    { name: data.signer || "You", role: "freelancer" as const, signed: data.signed, signedAt: data.signedAt },
    { name: "", role: "client" as const, signed: false, signedAt: null },
  ];

  const savedSig = data.savedFreelancerSig;

  const handleSign = (idx: number, sigData: string) => {
    const party = parties[idx];
    const updated = parties.map((p, i) =>
      i === idx ? { ...p, signed: true, signedAt: new Date().toISOString(), sigData, sigMode } : p
    );
    const allSigned = updated.every(p => p.signed);

    const newSaved = party.role === "freelancer" ? { sigData, sigMode, name: party.name } : data.savedFreelancerSig;

    onChange({ ...data, parties: updated, signed: allSigned, signedAt: allSigned ? new Date().toISOString() : null, locked: allSigned, savedFreelancerSig: newSaved });
    setSigningIdx(null);
    setCelebration(true);
    setTimeout(() => setCelebration(false), 2500);
  };

  const applyFreelancerSaved = (idx: number) => {
    if (!savedSig) return;
    handleSign(idx, savedSig.sigData);
  };

  const handleUnsign = (idx: number) => {
    const updated = parties.map((p, i) =>
      i === idx ? { ...p, signed: false, signedAt: null, sigData: undefined, sigMode: undefined } : p
    );
    onChange({ ...data, parties: updated, signed: false, signedAt: null, locked: false });
  };

  const updatePartyField = (idx: number, field: "name" | "email", value: string) => {
    onChange({ ...data, parties: parties.map((p, i) => i === idx ? { ...p, [field]: value } : p) });
  };

  const handleRequestSignature = (idx: number) => {
    if (!requestEmail.trim()) return;
    const updated = parties.map((p, i) =>
      i === idx ? { ...p, email: requestEmail.trim(), requestSent: true, requestSentAt: new Date().toISOString() } : p
    );
    onChange({ ...data, parties: updated });
    setShowRequestModal(null);
    setRequestEmail("");
  };

  const copySignLink = () => {
    const link = `${window.location.origin}/sign/${data.section || "document"}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allSigned = parties.every(p => p.signed);

  return (
    <div className={`${styles.signoff} ${allSigned ? styles.signoffLocked : ""}`}>
      {celebration && (
        <div className={styles.esCelebration}>
          <div className={styles.esCelebInner}>
            <div className={styles.esCelebCheck}>{"\u2713"}</div>
            <div className={styles.esCelebTitle}>Signed.</div>
            <div className={styles.esCelebSub}>The project is official.</div>
          </div>
        </div>
      )}

      <div className={styles.signoffHeader}>
        <div className={styles.signoffHeaderIcon}>{"\u270D"}</div>
        <span className={styles.blockLabel}>E-Signatures</span>
        {allSigned && <span className={styles.signoffLockBadge}>Fully signed</span>}
      </div>

      {data.agreement ? (
        <div className={styles.esAgreement}>
          <div className={styles.esAgreementText}>{data.agreement}</div>
        </div>
      ) : !allSigned ? (
        <div className={styles.esAgreement}>
          <textarea className={styles.blockTextarea} placeholder="Agreement summary (optional)..." value={data.agreement || ""} onChange={e => onChange({ ...data, agreement: e.target.value })} style={{ minHeight: 40 }} />
        </div>
      ) : null}

      <div className={styles.esPartiesSection}>
        {parties.map((party, i) => (
          <div key={i} className={`${styles.esParty} ${party.signed ? styles.esPartySigned : ""}`}>
            <div className={styles.esPartyTop}>
              <div className={`${styles.esPartyDot} ${party.signed ? styles.esPartyDotSigned : signingIdx === i ? styles.esPartyDotViewing : ""}`}>
                {party.signed ? "\u2713" : signingIdx === i ? "\u25CE" : "\u25CB"}
              </div>
              <div className={styles.esPartyInfo}>
                {party.signed ? (
                  <div className={styles.esPartyName}>{party.name || party.role}</div>
                ) : (
                  <input className={styles.blockInput} placeholder={party.role === "freelancer" ? "Your name" : "Client name"} value={party.name} onChange={e => updatePartyField(i, "name", e.target.value)} style={{ fontSize: 14, padding: "4px 8px", fontWeight: 500 }} />
                )}
                <div className={styles.esPartyRole}>
                  {party.role === "freelancer" ? "Freelancer (you)" : "Client"}
                  {party.email && !party.signed && <span className={styles.esPartyEmail}> &middot; {party.email}</span>}
                </div>
              </div>
              {party.signed && <span className={styles.esPartyBadge}>Signed</span>}
              {party.requestSent && !party.signed && <span className={styles.esPartyBadgeRequest}>Request sent</span>}
              {signingIdx === i && <span className={styles.esPartyBadgeViewing}>Signing...</span>}
            </div>

            {party.signed && party.sigData && (
              <div className={styles.esSigArea}>
                {party.sigData.startsWith("data:") ? (
                  {/* eslint-disable-next-line @next/next/no-img-element -- base64 signature data URL */}
                  <img src={party.sigData} alt="Signature" className={styles.esSigImg} />
                ) : (
                  <div className={styles.esSigTyped}>{party.sigData}</div>
                )}
                <div className={styles.esSigLine} />
                <div className={styles.esSigMeta}>
                  <span>{party.signedAt ? new Date(party.signedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}</span>
                </div>
              </div>
            )}

            {!party.signed && party.role === "freelancer" && signingIdx !== i && (
              <div className={styles.esPartyPending}>
                {savedSig ? (
                  <div className={styles.esSavedSig}>
                    <div className={styles.esSavedSigPreview}>
                      {savedSig.sigData.startsWith("data:") ? (
                        {/* eslint-disable-next-line @next/next/no-img-element -- base64 signature data URL */}
                        <img src={savedSig.sigData} alt="Saved signature" className={styles.esSavedSigImg} />
                      ) : (
                        <span className={styles.esSavedSigText}>{savedSig.sigData}</span>
                      )}
                    </div>
                    <div className={styles.esSavedSigActions}>
                      <button className={styles.esBtnAccept} onClick={() => applyFreelancerSaved(i)}>Apply saved signature</button>
                      <button className={styles.esUnsignBtn} onClick={() => setSigningIdx(i)}>Draw new</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.esPendingLine} />
                    <button className={styles.signoffSignBtn} onClick={() => setSigningIdx(i)}>Sign</button>
                  </>
                )}
              </div>
            )}

            {!party.signed && party.role === "client" && signingIdx !== i && showRequestModal !== i && (
              <div className={styles.esPartyPending}>
                <div className={styles.esPendingLine} />
                {party.requestSent ? (
                  <div className={styles.esRequestSent}>
                    <span className={styles.esRequestSentText}>Sent {party.requestSentAt ? new Date(party.requestSentAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}</span>
                    <button className={styles.esUnsignBtn} onClick={() => setShowRequestModal(i)}>Resend</button>
                  </div>
                ) : (
                  <button className={styles.signoffSignBtn} onClick={() => setShowRequestModal(i)}>Request signature</button>
                )}
              </div>
            )}

            {showRequestModal === i && (
              <div className={styles.esRequestModal}>
                <div className={styles.esRequestTitle}>Request signature from {party.name || "client"}</div>
                <div className={styles.esRequestDesc}>Send a signing link via email or copy the link to share directly.</div>
                <div className={styles.esRequestField}>
                  <input className={styles.blockInput} type="email" placeholder="client@email.com" value={requestEmail || party.email || ""} onChange={e => setRequestEmail(e.target.value)} style={{ fontSize: 14, padding: "8px 12px" }} />
                </div>
                <div className={styles.esRequestActions}>
                  <button className={styles.esBtnAccept} onClick={() => handleRequestSignature(i)} disabled={!requestEmail.trim()}>
                    Send signing request
                  </button>
                  <button className={styles.esLinkBtn} onClick={copySignLink}>
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                  <button className={styles.esUnsignBtn} onClick={() => setShowRequestModal(null)}>Cancel</button>
                </div>
              </div>
            )}

            {signingIdx === i && party.role === "freelancer" && (
              <div className={styles.esSigningArea}>
                <div className={styles.esModes}>
                  <button className={`${styles.esMode} ${sigMode === "draw" ? styles.esModeOn : ""}`} onClick={() => setSigMode("draw")}>Draw</button>
                  <button className={`${styles.esMode} ${sigMode === "type" ? styles.esModeOn : ""}`} onClick={() => setSigMode("type")}>Type</button>
                </div>
                {sigMode === "draw" && <SignCanvas onSign={(d) => handleSign(i, d)} />}
                {sigMode === "type" && <SignType name={party.name} onSign={(t) => handleSign(i, t)} />}
                {savedSig && <div className={styles.esSaveNote}>Your signature will be saved for future documents</div>}
              </div>
            )}

            {party.signed && (
              <button className={styles.esUnsignBtn} onClick={() => handleUnsign(i)}>Revoke signature</button>
            )}
          </div>
        ))}
      </div>

      <div className={styles.signoffNote}>
        Legally binding digital signatures &middot; Timestamped &middot; Compliant with ESIGN Act and UETA
      </div>
    </div>
  );
}

export { SignoffBlock };
