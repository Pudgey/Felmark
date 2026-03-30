"use client";

import { useState } from "react";
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
  return { section: "", signer: "", signed: false, signedAt: null, locked: false };
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
// 8. SIGN-OFF
// ══════════════════════════════════════

export function SignoffBlock({ data, onChange }: { data: SignoffData; onChange: (d: SignoffData) => void }) {
  const handleSign = () => {
    if (data.signed) {
      onChange({ ...data, signed: false, signedAt: null, locked: false });
    } else {
      onChange({ ...data, signed: true, signedAt: new Date().toISOString(), locked: true });
    }
  };

  return (
    <div className={`${styles.signoff} ${data.locked ? styles.signoffLocked : ""}`}>
      <div className={`${styles.signoffHeader} ${data.locked ? styles.signoffLockedHeader : ""}`}>
        <div className={`${styles.signoffIcon} ${data.locked ? styles.signoffIconLocked : ""}`}>
          {data.locked ? "🔒" : "✓"}
        </div>
        <span className={styles.blockLabel} style={{ color: data.locked ? "#5a9a3c" : "var(--ink-500)" }}>Sign-off</span>
        {data.locked && <span className={styles.signoffLockBadge}>Locked</span>}
      </div>
      <div className={styles.blockBody}>
        <input className={styles.blockInput} placeholder="Section name (e.g. Final Copy)" value={data.section} onChange={e => onChange({ ...data, section: e.target.value })} style={{ fontSize: 15, fontWeight: 500, marginBottom: 10 }} disabled={data.locked} />
        <div className={`${styles.signoffSignature} ${data.signed ? styles.signoffSignatureSigned : ""}`}>
          <div className={`${styles.signoffCheck} ${data.signed ? styles.signoffCheckSigned : ""}`} onClick={handleSign}>
            {data.signed && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          <div>
            <div className={styles.signoffSigner}>
              {data.signed ? (
                <><span className={styles.signoffSignerName}>{data.signer || "Signer"}</span> approved</>
              ) : (
                <input className={styles.blockInput} placeholder="Signer name" value={data.signer} onChange={e => onChange({ ...data, signer: e.target.value })} style={{ fontSize: 13, padding: "4px 8px" }} />
              )}
            </div>
          </div>
          {data.signedAt && <span className={styles.signoffDate}>{new Date(data.signedAt).toLocaleDateString()}</span>}
        </div>
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
