"use client";

import { useState, useRef, useEffect } from "react";
import type { CommentThreadData, MentionData, QuestionData, FeedbackData, DecisionData, PollData, HandoffData, SignoffData, AnnotationData } from "@/lib/types";
import styles from "./CollabBlocks.module.css";

// ── Default data factories ──

export function getDefaultCommentThread(): CommentThreadData {
  return { messages: [{ id: "m1", author: "You", text: "Starting a new thread here...", time: "Just now" }], resolved: false };
}
export function getDefaultMention(): MentionData {
  return { person: "", message: "", notified: false };
}
export function getDefaultQuestion(): QuestionData {
  return { question: "", assignee: "", answered: false, answer: "" };
}
export function getDefaultFeedback(): FeedbackData {
  return { description: "", reviewer: "", dueDate: null, status: "pending", comments: "" };
}
export function getDefaultDecision(): DecisionData {
  return { title: "", decision: "", alternatives: [], context: "", decidedBy: "", decidedAt: null };
}
export function getDefaultPoll(): PollData {
  return { question: "", options: [{ id: "o1", label: "Option A", votes: 0 }, { id: "o2", label: "Option B", votes: 0 }], closed: false, totalVotes: 0 };
}
export function getDefaultHandoff(): HandoffData {
  return { from: "You", to: "", notes: "", status: "pending", items: [] };
}
export function getDefaultSignoff(): SignoffData {
  return {
    section: "", signer: "", signed: false, signedAt: null, locked: false,
    parties: [
      { name: "", role: "freelancer", signed: false, signedAt: null },
      { name: "", role: "client", signed: false, signedAt: null },
    ],
  };
}
export function getDefaultAnnotation(): AnnotationData {
  return { imageUrl: "", pins: [] };
}

// ══════════════════════════════════════
// 1. COMMENT THREAD
// ══════════════════════════════════════

export function CommentThreadBlock({ data, onChange }: { data: CommentThreadData; onChange: (d: CommentThreadData) => void }) {
  const [draft, setDraft] = useState("");

  const addMessage = () => {
    if (!draft.trim()) return;
    onChange({ ...data, messages: [...data.messages, { id: `m${Date.now()}`, author: "You", text: draft.trim(), time: "Just now" }] });
    setDraft("");
  };

  return (
    <div className={`${styles.thread} ${data.resolved ? styles.threadResolved : ""}`}>
      <div className={styles.threadHeader}>
        <div className={styles.threadIcon}>💬</div>
        <span className={styles.blockLabel} style={{ color: "var(--ember)" }}>Thread</span>
        <span className={styles.blockMeta}>{data.messages.length} message{data.messages.length !== 1 ? "s" : ""}</span>
        <button className={styles.blockBtnSmall} style={{ marginLeft: "auto" }} onClick={() => onChange({ ...data, resolved: !data.resolved })}>
          {data.resolved ? "Reopen" : "Resolve"}
        </button>
      </div>
      {data.messages.map(msg => (
        <div key={msg.id} className={styles.threadMsg}>
          <div className={styles.threadAvatar}>{msg.author[0]}</div>
          <div>
            <span className={styles.threadAuthor}>{msg.author}</span>
            <span className={styles.threadTime}>{msg.time}</span>
            <div className={styles.threadText}>{msg.text}</div>
          </div>
        </div>
      ))}
      {!data.resolved && (
        <div className={styles.threadCompose}>
          <input className={styles.threadComposeInput} placeholder="Reply..." value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addMessage(); }} />
          <button className={styles.threadSendBtn} onClick={addMessage}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7L2 2v4l5 1-5 1v4l10-5z" fill="currentColor" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════
// 2. MENTION
// ══════════════════════════════════════

export function MentionBlock({ data, onChange }: { data: MentionData; onChange: (d: MentionData) => void }) {
  return (
    <div className={styles.mention}>
      <div className={styles.mentionHeader}>
        <div className={styles.mentionIcon}>@</div>
        <span className={styles.blockLabel} style={{ color: "var(--ember)" }}>Mention</span>
        {data.notified && <span className={styles.mentionNotified}>Notified</span>}
      </div>
      <div className={styles.blockBody}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input className={styles.blockInput} placeholder="@person" value={data.person} onChange={e => onChange({ ...data, person: e.target.value })} style={{ flex: 1 }} />
          <button className={`${styles.blockBtn} ${styles.blockBtnPrimary} ${styles.blockBtnSmall}`} onClick={() => onChange({ ...data, notified: true })}>
            Notify
          </button>
        </div>
        <textarea className={styles.blockTextarea} placeholder="Add a message..." value={data.message} onChange={e => onChange({ ...data, message: e.target.value })} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 3. QUESTION
// ══════════════════════════════════════

export function QuestionBlock({ data, onChange }: { data: QuestionData; onChange: (d: QuestionData) => void }) {
  return (
    <div className={`${styles.question} ${data.answered ? styles.questionAnswered : ""}`}>
      <div className={styles.questionHeader}>
        <div className={styles.questionIcon}>?</div>
        <span className={styles.questionLabel}>Question</span>
        {data.assignee && <span className={styles.questionAssignee}>for {data.assignee}</span>}
        {data.answered && <span className={styles.questionAnswerBadge}>Answered</span>}
      </div>
      <div className={styles.blockBody}>
        <input className={styles.blockInput} placeholder="What's the question?" value={data.question} onChange={e => onChange({ ...data, question: e.target.value })} style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }} />
        <input className={styles.blockInput} placeholder="Assign to (e.g. client name)" value={data.assignee} onChange={e => onChange({ ...data, assignee: e.target.value })} style={{ fontSize: 13 }} />
        {data.answered && data.answer && (
          <div className={styles.questionAnswer}>
            <div className={styles.questionAnswerLabel}>Answer</div>
            <div style={{ fontSize: 14, color: "var(--ink-700)" }}>{data.answer}</div>
          </div>
        )}
        {!data.answered && (
          <div className={styles.blockActions}>
            <textarea className={styles.blockTextarea} placeholder="Type an answer..." value={data.answer} onChange={e => onChange({ ...data, answer: e.target.value })} />
          </div>
        )}
        <div className={styles.blockActions}>
          <button className={styles.blockBtn} onClick={() => onChange({ ...data, answered: !data.answered })}>
            {data.answered ? "Reopen" : "Mark Answered"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 4. FEEDBACK REQUEST
// ══════════════════════════════════════

const FEEDBACK_STATUSES: { value: FeedbackData["status"]; label: string; style: string }[] = [
  { value: "pending", label: "Pending", style: styles.feedbackStatusPending },
  { value: "in-progress", label: "In Progress", style: styles.feedbackStatusInProgress },
  { value: "approved", label: "Approved", style: styles.feedbackStatusApproved },
  { value: "changes-requested", label: "Changes Requested", style: styles.feedbackStatusChanges },
];

export function FeedbackBlock({ data, onChange }: { data: FeedbackData; onChange: (d: FeedbackData) => void }) {
  const statusCfg = FEEDBACK_STATUSES.find(s => s.value === data.status) || FEEDBACK_STATUSES[0];

  return (
    <div className={styles.feedback}>
      <div className={styles.feedbackHeader}>
        <div className={styles.feedbackIcon}>↺</div>
        <span className={styles.feedbackLabel}>Feedback Request</span>
        <span className={`${styles.feedbackStatus} ${statusCfg.style}`}>{statusCfg.label}</span>
      </div>
      <div className={styles.blockBody}>
        <div className={styles.feedbackRow}>
          <div className={styles.feedbackField}>
            <span className={styles.feedbackFieldLabel}>Reviewer</span>
            <input className={styles.blockInput} placeholder="Who should review?" value={data.reviewer} onChange={e => onChange({ ...data, reviewer: e.target.value })} />
          </div>
          <div className={styles.feedbackField}>
            <span className={styles.feedbackFieldLabel}>Due</span>
            <input className={styles.blockInput} type="date" value={data.dueDate || ""} onChange={e => onChange({ ...data, dueDate: e.target.value || null })} />
          </div>
        </div>
        <textarea className={styles.blockTextarea} placeholder="What needs feedback?" value={data.description} onChange={e => onChange({ ...data, description: e.target.value })} />
        <div className={styles.blockActions}>
          {FEEDBACK_STATUSES.map(s => (
            <button key={s.value} className={`${styles.blockBtn} ${styles.blockBtnSmall} ${data.status === s.value ? styles.blockBtnPrimary : ""}`} onClick={() => onChange({ ...data, status: s.value })}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 5. DECISION
// ══════════════════════════════════════

export function DecisionBlock({ data, onChange }: { data: DecisionData; onChange: (d: DecisionData) => void }) {
  const addAlt = () => onChange({ ...data, alternatives: [...data.alternatives, { label: "", reason: "" }] });
  const updateAlt = (i: number, field: "label" | "reason", val: string) => {
    const alts = [...data.alternatives];
    alts[i] = { ...alts[i], [field]: val };
    onChange({ ...data, alternatives: alts });
  };
  const removeAlt = (i: number) => onChange({ ...data, alternatives: data.alternatives.filter((_, idx) => idx !== i) });

  return (
    <div className={styles.decision}>
      <div className={styles.decisionHeader}>
        <div className={styles.decisionIcon}>⚖</div>
        <span className={styles.decisionLabel}>Decision</span>
        {data.decidedBy && <span className={styles.blockMeta}>by {data.decidedBy}</span>}
      </div>
      <div className={styles.blockBody}>
        <input className={styles.blockInput} placeholder="Decision title" value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }} />
        <div className={styles.decisionResult}>
          <div className={styles.decisionResultLabel}>Decision</div>
          <textarea className={styles.blockTextarea} placeholder="What was decided?" value={data.decision} onChange={e => onChange({ ...data, decision: e.target.value })} style={{ background: "transparent", border: "none", padding: 0, minHeight: 36 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <span className={styles.feedbackFieldLabel}>Alternatives considered</span>
          {data.alternatives.map((alt, i) => (
            <div key={i} className={styles.decisionAlt}>
              <div className={styles.decisionAltDot} />
              <div style={{ flex: 1 }}>
                <input className={styles.blockInput} placeholder="Alternative" value={alt.label} onChange={e => updateAlt(i, "label", e.target.value)} style={{ fontSize: 13, marginBottom: 4 }} />
                <input className={styles.blockInput} placeholder="Why not chosen" value={alt.reason} onChange={e => updateAlt(i, "reason", e.target.value)} style={{ fontSize: 12, color: "var(--ink-400)" }} />
              </div>
              <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={() => removeAlt(i)}>×</button>
            </div>
          ))}
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={addAlt} style={{ marginTop: 6 }}>+ Add alternative</button>
        </div>
        <textarea className={styles.blockTextarea} placeholder="Context and reasoning..." value={data.context} onChange={e => onChange({ ...data, context: e.target.value })} />
        <div className={styles.blockActions}>
          <input className={styles.blockInput} placeholder="Decided by" value={data.decidedBy} onChange={e => onChange({ ...data, decidedBy: e.target.value })} style={{ flex: 1, fontSize: 13 }} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 6. POLL
// ══════════════════════════════════════

export function PollBlock({ data, onChange }: { data: PollData; onChange: (d: PollData) => void }) {
  const [voted, setVoted] = useState<string | null>(null);
  const maxVotes = Math.max(...data.options.map(o => o.votes), 1);

  const vote = (id: string) => {
    if (data.closed || voted) return;
    setVoted(id);
    const opts = data.options.map(o => o.id === id ? { ...o, votes: o.votes + 1 } : o);
    onChange({ ...data, options: opts, totalVotes: data.totalVotes + 1 });
  };

  const addOption = () => {
    onChange({ ...data, options: [...data.options, { id: `o${Date.now()}`, label: "", votes: 0 }] });
  };

  const updateLabel = (id: string, label: string) => {
    onChange({ ...data, options: data.options.map(o => o.id === id ? { ...o, label } : o) });
  };

  return (
    <div className={styles.poll}>
      <div className={styles.pollHeader}>
        <div className={styles.pollIcon}>▣</div>
        <span className={styles.blockLabel} style={{ color: "var(--ember)" }}>Poll</span>
        {data.closed && <span className={styles.pollClosed}>Closed</span>}
        <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} style={{ marginLeft: "auto" }} onClick={() => onChange({ ...data, closed: !data.closed })}>
          {data.closed ? "Reopen" : "Close Poll"}
        </button>
      </div>
      <div className={styles.blockBody}>
        <input className={styles.blockInput} placeholder="What's the question?" value={data.question} onChange={e => onChange({ ...data, question: e.target.value })} style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }} />
        {data.options.map(opt => {
          const pct = data.totalVotes > 0 ? Math.round((opt.votes / data.totalVotes) * 100) : 0;
          const isVoted = voted === opt.id;
          return (
            <div key={opt.id} className={styles.pollOption} onClick={() => vote(opt.id)}>
              <div className={`${styles.pollCheck} ${isVoted ? styles.pollCheckVoted : ""}`}>
                {isVoted && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <input className={styles.blockInput} placeholder="Option..." value={opt.label} onChange={e => { e.stopPropagation(); updateLabel(opt.id, e.target.value); }} onClick={e => e.stopPropagation()} style={{ flex: 1, fontSize: 14, padding: "6px 10px" }} />
              <div className={styles.pollBar}>
                <div className={styles.pollBarFill} style={{ width: `${pct}%`, background: isVoted ? "var(--ember)" : "var(--warm-200)" }} />
                {data.totalVotes > 0 && <span className={styles.pollBarPct}>{pct}%</span>}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={addOption}>+ Add option</button>
          <span className={styles.pollTotal}>{data.totalVotes} vote{data.totalVotes !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 7. HANDOFF
// ══════════════════════════════════════

export function HandoffBlock({ data, onChange }: { data: HandoffData; onChange: (d: HandoffData) => void }) {
  const [newItem, setNewItem] = useState("");
  const statusStyle = data.status === "completed" ? styles.handoffStatusCompleted : data.status === "accepted" ? styles.handoffStatusAccepted : styles.handoffStatusPending;

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange({ ...data, items: [...data.items, newItem.trim()] });
    setNewItem("");
  };

  return (
    <div className={styles.handoff}>
      <div className={styles.handoffHeader}>
        <div className={styles.handoffIcon}>→</div>
        <span className={styles.handoffLabel}>Handoff</span>
        <span className={statusStyle}>{data.status}</span>
      </div>
      <div className={styles.blockBody}>
        <div className={styles.handoffFlow}>
          <input className={styles.blockInput} placeholder="From" value={data.from} onChange={e => onChange({ ...data, from: e.target.value })} style={{ flex: 1 }} />
          <span className={styles.handoffArrow}>→</span>
          <input className={styles.blockInput} placeholder="To" value={data.to} onChange={e => onChange({ ...data, to: e.target.value })} style={{ flex: 1 }} />
        </div>
        <textarea className={styles.blockTextarea} placeholder="Handoff notes..." value={data.notes} onChange={e => onChange({ ...data, notes: e.target.value })} />
        {data.items.length > 0 && (
          <div className={styles.handoffItems}>
            {data.items.map((item, i) => (
              <div key={i} className={styles.handoffItem}>
                <div className={styles.handoffItemDot} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input className={styles.blockInput} placeholder="Add checklist item..." value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addItem(); }} style={{ flex: 1, fontSize: 13 }} />
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={addItem}>Add</button>
        </div>
        <div className={styles.blockActions}>
          {(["pending", "accepted", "completed"] as const).map(s => (
            <button key={s} className={`${styles.blockBtn} ${styles.blockBtnSmall} ${data.status === s ? styles.blockBtnPrimary : ""}`} onClick={() => onChange({ ...data, status: s })}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 8. SIGN-OFF (E-Signature with Draw/Type)
// ══════════════════════════════════════

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
        <div className={styles.esBaseX}>✕</div>
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

export function SignoffBlock({ data, onChange }: { data: SignoffData; onChange: (d: SignoffData) => void }) {
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

    // Save freelancer signature for reuse
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
            <div className={styles.esCelebCheck}>✓</div>
            <div className={styles.esCelebTitle}>Signed.</div>
            <div className={styles.esCelebSub}>The project is official.</div>
          </div>
        </div>
      )}

      <div className={styles.signoffHeader}>
        <div className={styles.signoffHeaderIcon}>✍</div>
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
                {party.signed ? "✓" : signingIdx === i ? "◎" : "○"}
              </div>
              <div className={styles.esPartyInfo}>
                {party.signed ? (
                  <div className={styles.esPartyName}>{party.name || party.role}</div>
                ) : (
                  <input className={styles.blockInput} placeholder={party.role === "freelancer" ? "Your name" : "Client name"} value={party.name} onChange={e => updatePartyField(i, "name", e.target.value)} style={{ fontSize: 14, padding: "4px 8px", fontWeight: 500 }} />
                )}
                <div className={styles.esPartyRole}>
                  {party.role === "freelancer" ? "Freelancer (you)" : "Client"}
                  {party.email && !party.signed && <span className={styles.esPartyEmail}> · {party.email}</span>}
                </div>
              </div>
              {party.signed && <span className={styles.esPartyBadge}>Signed</span>}
              {party.requestSent && !party.signed && <span className={styles.esPartyBadgeRequest}>Request sent</span>}
              {signingIdx === i && <span className={styles.esPartyBadgeViewing}>Signing...</span>}
            </div>

            {/* Signed — show signature */}
            {party.signed && party.sigData && (
              <div className={styles.esSigArea}>
                {party.sigData.startsWith("data:") ? (
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

            {/* Freelancer — unsigned, not signing */}
            {!party.signed && party.role === "freelancer" && signingIdx !== i && (
              <div className={styles.esPartyPending}>
                {savedSig ? (
                  <div className={styles.esSavedSig}>
                    <div className={styles.esSavedSigPreview}>
                      {savedSig.sigData.startsWith("data:") ? (
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

            {/* Client — unsigned, not signing — show request flow */}
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

            {/* Client — request modal */}
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

            {/* Active signing (freelancer only — clients sign via link) */}
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
        Legally binding digital signatures · Timestamped · Compliant with ESIGN Act and UETA
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// 9. ANNOTATION
// ══════════════════════════════════════

export function AnnotationBlock({ data, onChange }: { data: AnnotationData; onChange: (d: AnnotationData) => void }) {
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [pinComment, setPinComment] = useState("");

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pendingPin) return; // Don't place new pin while composing
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPin({ x, y });
    setPinComment("");
  };

  const confirmPin = () => {
    if (!pendingPin || !pinComment.trim()) return;
    onChange({
      ...data,
      pins: [...data.pins, { id: `pin${Date.now()}`, x: pendingPin.x, y: pendingPin.y, comment: pinComment.trim(), author: "You", resolved: false }],
    });
    setPendingPin(null);
    setPinComment("");
  };

  const cancelPin = () => {
    setPendingPin(null);
    setPinComment("");
  };

  const resolvePin = (id: string) => {
    onChange({ ...data, pins: data.pins.map(p => p.id === id ? { ...p, resolved: !p.resolved } : p) });
  };

  return (
    <div className={styles.annotation}>
      <div className={styles.annotationHeader}>
        <div className={styles.annotationIcon}>📌</div>
        <span className={styles.annotationLabel}>Annotation</span>
        <span className={styles.blockMeta}>{data.pins.length} pin{data.pins.length !== 1 ? "s" : ""}</span>
      </div>
      <div className={styles.annotationCanvas} onClick={handleCanvasClick}>
        {data.imageUrl ? (
          <img className={styles.annotationImg} src={data.imageUrl} alt="Annotated" />
        ) : (
          <div className={styles.annotationPlaceholder}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="11" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M3 22l7-7 5 5 4-3 10 8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            <span>Click to add pins — paste an image URL below</span>
          </div>
        )}
        {data.pins.map((pin, i) => (
          <div
            key={pin.id}
            className={`${styles.annotationPin} ${pin.resolved ? styles.annotationPinResolved : ""}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onClick={e => e.stopPropagation()}
            title={pin.comment}
          >
            {i + 1}
          </div>
        ))}
        {pendingPin && (
          <div className={styles.annotationPin} style={{ left: `${pendingPin.x}%`, top: `${pendingPin.y}%`, opacity: 0.6 }} onClick={e => e.stopPropagation()}>
            ?
          </div>
        )}
      </div>
      {pendingPin && (
        <div className={styles.annotationCompose}>
          <input className={styles.blockInput} placeholder="Add a comment for this pin..." value={pinComment} onChange={e => setPinComment(e.target.value)} onKeyDown={e => { if (e.key === "Enter") confirmPin(); if (e.key === "Escape") cancelPin(); }} autoFocus />
          <button className={`${styles.blockBtn} ${styles.blockBtnPrimary} ${styles.blockBtnSmall}`} onClick={confirmPin}>Add</button>
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={cancelPin}>Cancel</button>
        </div>
      )}
      <div style={{ padding: "8px 16px" }}>
        <input className={styles.blockInput} placeholder="Image URL..." value={data.imageUrl} onChange={e => onChange({ ...data, imageUrl: e.target.value })} style={{ fontSize: 12 }} />
      </div>
      {data.pins.length > 0 && (
        <div className={styles.annotationPinList}>
          {data.pins.map((pin, i) => (
            <div key={pin.id} className={styles.annotationPinItem}>
              <div className={`${styles.annotationPinNum} ${pin.resolved ? styles.annotationPinNumResolved : ""}`}>{i + 1}</div>
              <div className={styles.annotationPinBody}>
                <div className={styles.annotationPinAuthor}>{pin.author}</div>
                <div className={styles.annotationPinComment}>{pin.comment}</div>
                <button className={styles.annotationPinResolve} onClick={() => resolvePin(pin.id)}>
                  {pin.resolved ? "Unresolve" : "Resolve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
