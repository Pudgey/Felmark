import { useState, useEffect, useRef } from "react";

const INITIAL_MESSAGES = [
  {
    id: 1, role: "system", text: "Felmark AI · Ready to help with your projects, proposals, and business.",
    time: null,
  },
  {
    id: 2, role: "user", text: "Summarize where I stand with Meridian Studio",
    time: "11:24 AM",
  },
  {
    id: 3, role: "ai", text: null, time: "11:24 AM",
    blocks: [
      { type: "text", content: "Here's your Meridian Studio snapshot:" },
      { type: "data", rows: [
        { label: "Active projects", value: "3", color: "#5a9a3c" },
        { label: "Total earned", value: "$12,400", color: "#5a9a3c" },
        { label: "In progress", value: "$4,200", color: "var(--ember)" },
        { label: "Next deadline", value: "Apr 3 (5d)", color: "#c89360" },
        { label: "Pending payment", value: "$2,400", color: "#5b7fa4" },
      ]},
      { type: "text", content: "Brand Guidelines v2 is 65% complete and due in 5 days. Sarah commented 2 hours ago asking for more specific logo sizing rules. Invoice #047 ($2,400) was sent and viewed twice but not yet paid." },
      { type: "actions", items: [
        { label: "Open workspace", icon: "→" },
        { label: "View invoice", icon: "$" },
        { label: "Reply to Sarah", icon: "◎" },
      ]},
    ],
  },
  {
    id: 4, role: "user", text: "Draft a polite follow-up to Bolt Fitness about their overdue invoice",
    time: "11:26 AM",
  },
  {
    id: 5, role: "ai", text: null, time: "11:26 AM",
    blocks: [
      { type: "text", content: "Here's a draft follow-up for the overdue Invoice #044:" },
      { type: "draft",
        subject: "Quick follow-up: Invoice #044",
        to: "team@boltfit.co",
        body: "Hi team,\n\nHope the onboarding launch is going well! Just a quick note that Invoice #044 ($4,000) for the App Onboarding UX project is now 4 days past the due date.\n\nI've attached the invoice again for convenience. You can pay directly through the link below — it takes about 30 seconds.\n\nLet me know if you have any questions or if there's anything I can help with on the billing side.\n\nBest,\n[Your name]",
      },
      { type: "actions", items: [
        { label: "Send email", icon: "↗" },
        { label: "Edit draft", icon: "✎" },
        { label: "Adjust tone", icon: "◎" },
      ]},
    ],
  },
];

const SUGGESTIONS = [
  { text: "What's overdue this week?", icon: "!" },
  { text: "Draft a proposal for Luna Boutique", icon: "◆" },
  { text: "How much have I earned this quarter?", icon: "$" },
  { text: "Summarize Sarah's latest feedback", icon: "→" },
];

const SLASH_COMMANDS = [
  { cmd: "/summarize", desc: "Summarize a project or client", icon: "☰" },
  { cmd: "/draft", desc: "Draft an email, proposal, or message", icon: "✎" },
  { cmd: "/invoice", desc: "Create or check an invoice", icon: "$" },
  { cmd: "/analyze", desc: "Analyze revenue, rates, or trends", icon: "◎" },
  { cmd: "/scope", desc: "Review or write a project scope", icon: "◆" },
  { cmd: "/remind", desc: "Set a reminder or follow-up", icon: "⏱" },
];

export default function FelmarkChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const filteredCommands = slashFilter
    ? SLASH_COMMANDS.filter(c => c.cmd.includes(slashFilter) || c.desc.toLowerCase().includes(slashFilter))
    : SLASH_COMMANDS;

  const sendMessage = (text) => {
    if (!text?.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text: text.trim(), time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setShowSlash(false);
    setShowSuggestions(false);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        id: Date.now() + 1, role: "ai", time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        blocks: [
          { type: "text", content: "I'll look into that for you. Based on your workspace data:" },
          { type: "text", content: "This is a simulated response. In production, this connects to your Felmark workspace data and uses AI to generate contextual answers, draft documents, analyze trends, and take actions on your behalf." },
          { type: "actions", items: [{ label: "Continue", icon: "→" }] },
        ],
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
    if (e.key === "Escape") {
      setShowSlash(false);
    }
  };

  const handleInput = (val) => {
    setInput(val);
    if (val.startsWith("/")) {
      setShowSlash(true);
      setSlashFilter(val);
    } else {
      setShowSlash(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

        .chat{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);height:100vh;display:flex;flex-direction:column;max-width:800px;margin:0 auto;border-left:1px solid var(--warm-200);border-right:1px solid var(--warm-200)}

        /* ── Header ── */
        .chat-head{padding:14px 24px;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;gap:12px;flex-shrink:0}
        .chat-head-icon{width:32px;height:32px;border-radius:8px;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .chat-head-icon svg{color:var(--ember)}
        .chat-head-info{flex:1}
        .chat-head-title{font-size:15px;font-weight:500;color:var(--ink-800);display:flex;align-items:center;gap:6px}
        .chat-head-badge{font-family:var(--mono);font-size:8px;color:var(--ember);background:var(--ember-bg);padding:1px 6px;border-radius:2px;border:1px solid rgba(176,125,79,0.08);letter-spacing:.03em}
        .chat-head-sub{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-top:1px}
        .chat-head-status{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:10px;color:#5a9a3c}
        .chat-head-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c;animation:pulse 2s ease infinite}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}

        /* ── Messages ── */
        .chat-messages{flex:1;overflow-y:auto;padding:16px 0}
        .chat-messages::-webkit-scrollbar{width:4px}
        .chat-messages::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.04);border-radius:99px}

        /* System message */
        .msg-system{text-align:center;padding:8px 24px;font-family:var(--mono);font-size:10px;color:var(--ink-300)}

        /* User message */
        .msg-user{padding:6px 24px;display:flex;justify-content:flex-end}
        .msg-user-bubble{max-width:480px;padding:10px 16px;background:var(--ink-900);color:rgba(255,255,255,0.9);border-radius:12px 12px 4px 12px;font-size:14px;line-height:1.5;position:relative}
        .msg-user-time{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-align:right;padding:3px 24px 0;margin-top:-2px}

        /* AI message */
        .msg-ai{padding:8px 24px;display:flex;gap:10px;align-items:flex-start}
        .msg-ai-avatar{width:28px;height:28px;border-radius:7px;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
        .msg-ai-avatar svg{width:14px;height:14px;color:var(--ember)}
        .msg-ai-body{flex:1;min-width:0;max-width:560px}
        .msg-ai-time{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-bottom:4px}

        /* AI content blocks */
        .ai-text{font-size:14px;color:var(--ink-600);line-height:1.65;margin-bottom:8px}
        .ai-text:last-child{margin-bottom:0}

        /* Data block */
        .ai-data{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:8px 0}
        .ai-data-row{display:flex;justify-content:space-between;align-items:center;padding:7px 14px;border-bottom:1px solid var(--warm-100);font-size:13px}
        .ai-data-row:last-child{border-bottom:none}
        .ai-data-label{color:var(--ink-500)}
        .ai-data-val{font-family:var(--mono);font-size:12px;font-weight:500}

        /* Draft block */
        .ai-draft{border:1px solid var(--warm-200);border-radius:8px;overflow:hidden;margin:8px 0}
        .ai-draft-head{padding:10px 14px;background:var(--warm-50);border-bottom:1px solid var(--warm-100);display:flex;flex-direction:column;gap:2px}
        .ai-draft-meta{font-family:var(--mono);font-size:10px;color:var(--ink-400);display:flex;gap:10px}
        .ai-draft-meta-label{color:var(--ink-300)}
        .ai-draft-subject{font-size:14px;font-weight:500;color:var(--ink-800)}
        .ai-draft-body{padding:14px 16px;font-size:13.5px;color:var(--ink-600);line-height:1.7;white-space:pre-wrap;font-family:'Outfit',sans-serif;max-height:200px;overflow-y:auto}
        .ai-draft-body::-webkit-scrollbar{width:3px}
        .ai-draft-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.04);border-radius:99px}

        /* Action buttons */
        .ai-actions{display:flex;gap:5px;margin:8px 0 4px;flex-wrap:wrap}
        .ai-action{display:flex;align-items:center;gap:5px;padding:6px 14px;border:1px solid var(--warm-200);border-radius:6px;font-size:12.5px;color:var(--ink-600);cursor:pointer;transition:all .08s;background:#fff;font-family:inherit}
        .ai-action:hover{border-color:var(--warm-300);background:var(--warm-50)}
        .ai-action:first-child{background:var(--ember);border-color:var(--ember);color:#fff}
        .ai-action:first-child:hover{background:var(--ember-light)}
        .ai-action-icon{font-size:11px;flex-shrink:0}

        /* Typing indicator */
        .msg-typing{padding:8px 24px;display:flex;gap:10px;align-items:flex-start}
        .typing-dots{display:flex;gap:3px;padding:12px 16px}
        .typing-dots span{width:5px;height:5px;border-radius:50%;background:var(--ink-300);animation:typeDot 1.2s ease infinite}
        .typing-dots span:nth-child(2){animation-delay:.2s}
        .typing-dots span:nth-child(3){animation-delay:.4s}
        @keyframes typeDot{0%,60%,100%{opacity:.2;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}

        /* ── Suggestions ── */
        .chat-suggestions{padding:8px 24px 4px 62px;display:flex;gap:5px;flex-wrap:wrap}
        .chat-sug{display:flex;align-items:center;gap:5px;padding:6px 12px;border:1px solid var(--warm-200);border-radius:6px;font-size:12px;color:var(--ink-500);cursor:pointer;transition:all .08s;background:#fff}
        .chat-sug:hover{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}
        .chat-sug-icon{font-size:11px;color:var(--ink-300)}
        .chat-sug:hover .chat-sug-icon{color:var(--ember)}

        /* ── Input area ── */
        .chat-input-area{padding:12px 24px 16px;border-top:1px solid var(--warm-200);flex-shrink:0;position:relative}

        /* Slash commands */
        .slash-menu{position:absolute;bottom:calc(100% + 4px);left:24px;right:24px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;box-shadow:0 -4px 20px rgba(0,0,0,0.06);padding:4px;z-index:10;animation:slashIn .12s ease}
        @keyframes slashIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .slash-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.08em;padding:6px 10px 4px}
        .slash-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;cursor:pointer;transition:background .06s}
        .slash-item:hover{background:var(--ember-bg)}
        .slash-item-icon{width:26px;height:26px;border-radius:6px;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--ink-500);flex-shrink:0}
        .slash-item:hover .slash-item-icon{background:var(--ember-bg);border-color:rgba(176,125,79,0.1);color:var(--ember)}
        .slash-item-info{flex:1}
        .slash-item-cmd{font-family:var(--mono);font-size:12.5px;color:var(--ink-700);font-weight:500}
        .slash-item-desc{font-size:11px;color:var(--ink-400)}

        .chat-input-row{display:flex;align-items:flex-end;gap:8px}
        .chat-input-wrap{flex:1;border:1px solid var(--warm-200);border-radius:10px;background:#fff;transition:all .12s;overflow:hidden;display:flex;align-items:flex-end}
        .chat-input-wrap.focused{border-color:var(--ember);box-shadow:0 0 0 3px rgba(176,125,79,0.04)}
        .chat-prompt{font-family:var(--mono);font-size:14px;color:var(--ember);font-weight:600;padding:11px 0 11px 14px;flex-shrink:0;line-height:1.4}
        .chat-input{flex:1;border:none;outline:none;font-family:inherit;font-size:14px;color:var(--ink-800);padding:11px 14px 11px 8px;resize:none;line-height:1.4;max-height:120px;min-height:20px;background:transparent}
        .chat-input::placeholder{color:var(--warm-400)}
        .chat-send{width:36px;height:36px;border-radius:8px;border:none;background:var(--ink-900);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .1s;flex-shrink:0}
        .chat-send:hover{background:var(--ink-800)}
        .chat-send:disabled{opacity:.2;cursor:not-allowed}
        .chat-send svg{width:16px;height:16px}

        /* ── Footer ── */
        .chat-footer{padding:6px 24px;display:flex;align-items:center;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0}
        .chat-footer-left{display:flex;align-items:center;gap:8px}
        .chat-footer-hints{display:flex;gap:6px}
        .chat-footer-hint{display:flex;align-items:center;gap:3px}
        .chat-kbd{background:var(--warm-100);border:1px solid var(--warm-200);border-radius:2px;padding:0 4px;font-size:9px}
      `}</style>

      <div className="chat">
        {/* Header */}
        <div className="chat-head">
          <div className="chat-head-icon">
            <svg viewBox="0 0 28 28" fill="none" width="16" height="16"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.5"/><path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="currentColor" strokeWidth="1" opacity="0.5"/></svg>
          </div>
          <div className="chat-head-info">
            <div className="chat-head-title">
              Felmark AI
              <span className="chat-head-badge">BETA</span>
            </div>
            <div className="chat-head-sub">Knows your projects, clients, and business</div>
          </div>
          <div className="chat-head-status">
            <span className="chat-head-dot" />
            Online
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" ref={scrollRef}>
          {messages.map(msg => {
            if (msg.role === "system") {
              return <div key={msg.id} className="msg-system">{msg.text}</div>;
            }

            if (msg.role === "user") {
              return (
                <div key={msg.id}>
                  <div className="msg-user">
                    <div className="msg-user-bubble">{msg.text}</div>
                  </div>
                  <div className="msg-user-time">{msg.time}</div>
                </div>
              );
            }

            if (msg.role === "ai") {
              return (
                <div key={msg.id} className="msg-ai">
                  <div className="msg-ai-avatar">
                    <svg viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </div>
                  <div className="msg-ai-body">
                    <div className="msg-ai-time">{msg.time}</div>
                    {msg.blocks?.map((block, bi) => {
                      if (block.type === "text") {
                        return <div key={bi} className="ai-text">{block.content}</div>;
                      }
                      if (block.type === "data") {
                        return (
                          <div key={bi} className="ai-data">
                            {block.rows.map((r, ri) => (
                              <div key={ri} className="ai-data-row">
                                <span className="ai-data-label">{r.label}</span>
                                <span className="ai-data-val" style={{ color: r.color }}>{r.value}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      if (block.type === "draft") {
                        return (
                          <div key={bi} className="ai-draft">
                            <div className="ai-draft-head">
                              <div className="ai-draft-subject">{block.subject}</div>
                              <div className="ai-draft-meta">
                                <span><span className="ai-draft-meta-label">To:</span> {block.to}</span>
                              </div>
                            </div>
                            <div className="ai-draft-body">{block.body}</div>
                          </div>
                        );
                      }
                      if (block.type === "actions") {
                        return (
                          <div key={bi} className="ai-actions">
                            {block.items.map((a, ai) => (
                              <button key={ai} className="ai-action">
                                <span className="ai-action-icon">{a.icon}</span>
                                {a.label}
                              </button>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })}

          {/* Typing */}
          {isTyping && (
            <div className="msg-typing">
              <div className="msg-ai-avatar">
                <svg viewBox="0 0 28 28" fill="none" width="14" height="14"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
              </div>
              <div className="typing-dots"><span /><span /><span /></div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && !isTyping && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="chat-sug" onClick={() => sendMessage(s.text)}>
                  <span className="chat-sug-icon">{s.icon}</span>
                  {s.text}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="chat-input-area">
          {showSlash && filteredCommands.length > 0 && (
            <div className="slash-menu">
              <div className="slash-label">Commands</div>
              {filteredCommands.map((c, i) => (
                <div key={i} className="slash-item" onClick={() => { setInput(c.cmd + " "); setShowSlash(false); inputRef.current?.focus(); }}>
                  <div className="slash-item-icon">{c.icon}</div>
                  <div className="slash-item-info">
                    <div className="slash-item-cmd">{c.cmd}</div>
                    <div className="slash-item-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <div className={`chat-input-wrap${input ? " focused" : ""}`}>
              <span className="chat-prompt">❯</span>
              <textarea ref={inputRef} className="chat-input" rows={1} placeholder="Ask anything about your business..."
                value={input}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (input.startsWith("/")) setShowSlash(true); }}
              />
            </div>
            <button className="chat-send" onClick={() => sendMessage(input)} disabled={!input.trim()}>
              <svg viewBox="0 0 16 16" fill="none"><path d="M2 8l12-5-5 12-2-5-5-2z" fill="currentColor"/></svg>
            </button>
          </div>
        </div>

        <div className="chat-footer">
          <div className="chat-footer-left">
            <svg width="10" height="10" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
            Felmark AI · Contextual to your workspace
          </div>
          <div className="chat-footer-hints">
            <span className="chat-footer-hint"><span className="chat-kbd">/</span> commands</span>
            <span className="chat-footer-hint"><span className="chat-kbd">⏎</span> send</span>
            <span className="chat-footer-hint"><span className="chat-kbd">⇧⏎</span> newline</span>
          </div>
        </div>
      </div>
    </>
  );
}
