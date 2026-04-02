import { useState, useRef } from "react";

const ROLES = [
  { id: "owner", label: "Owner", desc: "Full access to everything", color: "var(--ember)", perms: ["edit", "delete", "invite", "billing", "settings", "export"] },
  { id: "editor", label: "Editor", desc: "Edit projects & docs, can't manage billing", color: "#5b7fa4", perms: ["edit", "delete", "export"] },
  { id: "viewer", label: "Viewer", desc: "View only, can comment", color: "#5a9a3c", perms: ["view", "comment"] },
  { id: "client", label: "Client", desc: "See shared docs, approve, pay invoices", color: "#8a7e63", perms: ["view", "comment", "approve", "pay"] },
];

const MEMBERS = [
  {
    id: "u1", name: "Alex Mercer", email: "alex@felmark.co", avatar: "A", color: "#b07d4f",
    role: "owner", status: "online", joined: "Oct 2025", lastActive: "Now",
    projects: ["Brand Guidelines v2", "Website Copy", "Course Landing Page", "App Onboarding UX"],
    hoursThisWeek: 32, hoursCapacity: 40,
    activity: [
      { text: "Edited Brand Guidelines v2 — Typography section", time: "2m ago" },
      { text: "Sent Invoice #047 to Meridian Studio", time: "3h ago" },
      { text: "Created proposal for Luna Boutique", time: "5h ago" },
    ],
    stats: { projects: 6, invoicesSent: 12, earned: 14800, docsEdited: 34 },
  },
  {
    id: "u2", name: "Jamie Park", email: "jamie@parkdesign.co", avatar: "J", color: "#7c8594",
    role: "editor", status: "online", joined: "Jan 2026", lastActive: "15m ago",
    projects: ["Brand Guidelines v2", "App Onboarding UX"],
    hoursThisWeek: 18, hoursCapacity: 24,
    activity: [
      { text: "Editing Typography Scale v3", time: "15m ago" },
      { text: "Commented on Color Palette section", time: "2h ago" },
      { text: "Uploaded icon-set-draft.fig", time: "Yesterday" },
    ],
    stats: { projects: 2, invoicesSent: 0, earned: 0, docsEdited: 18 },
  },
  {
    id: "u3", name: "Sarah Chen", email: "sarah@meridianstudio.co", avatar: "S", color: "#8a7e63",
    role: "client", status: "offline", joined: "Oct 2025", lastActive: "2h ago",
    projects: ["Brand Guidelines v2", "Website Copy"],
    hoursThisWeek: 0, hoursCapacity: 0,
    activity: [
      { text: "Commented: \"Can we make the logo section more specific?\"", time: "2h ago" },
      { text: "Viewed Invoice #047", time: "3h ago" },
      { text: "Approved Mood Board direction", time: "Yesterday" },
    ],
    stats: { projects: 2, invoicesSent: 0, earned: 0, docsEdited: 0 },
  },
  {
    id: "u4", name: "Nora Kim", email: "nora@coachkim.com", avatar: "N", color: "#a08472",
    role: "client", status: "offline", joined: "Feb 2026", lastActive: "1h ago",
    projects: ["Course Landing Page"],
    activity: [
      { text: "Signed the Course Landing Page proposal", time: "3h ago" },
      { text: "Paid Invoice #046 — $1,800", time: "Mar 15" },
    ],
    stats: { projects: 1, invoicesSent: 0, earned: 0, docsEdited: 0 },
    hoursThisWeek: 0, hoursCapacity: 0,
  },
];

const PENDING_INVITES = [
  { id: "inv1", email: "taylor@design.co", role: "editor", sent: "Mar 28", expires: "Apr 4" },
];

const PERMISSIONS_MATRIX = [
  { perm: "Edit documents", owner: true, editor: true, viewer: false, client: false },
  { perm: "Delete documents", owner: true, editor: true, viewer: false, client: false },
  { perm: "View documents", owner: true, editor: true, viewer: true, client: true },
  { perm: "Comment & discuss", owner: true, editor: true, viewer: true, client: true },
  { perm: "Approve deliverables", owner: true, editor: true, viewer: false, client: true },
  { perm: "Send invoices", owner: true, editor: false, viewer: false, client: false },
  { perm: "Manage billing", owner: true, editor: false, viewer: false, client: false },
  { perm: "Invite members", owner: true, editor: false, viewer: false, client: false },
  { perm: "Access settings", owner: true, editor: false, viewer: false, client: false },
  { perm: "Export data", owner: true, editor: true, viewer: false, client: false },
  { perm: "Pay invoices", owner: false, editor: false, viewer: false, client: true },
];

export default function TeamScreen() {
  const [selectedMember, setSelectedMember] = useState("u1");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [showPerms, setShowPerms] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const [showRoleMenu, setShowRoleMenu] = useState(null);

  const selected = MEMBERS.find(m => m.id === selectedMember);
  const teamMembers = MEMBERS.filter(m => m.role !== "client");
  const clientMembers = MEMBERS.filter(m => m.role === "client");

  const sendInvite = () => {
    if (!inviteEmail.includes("@")) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInvite(false); setInviteEmail(""); setInviteMessage(""); }, 2000);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}
        .tm{font-family:'Outfit',sans-serif;font-size:14px;color:var(--ink-700);background:var(--parchment);height:100vh;display:flex;flex-direction:column}

        /* Header */
        .tm-head{padding:16px 24px;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
        .tm-head-left{display:flex;align-items:center;gap:14px}
        .tm-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900)}
        .tm-count{font-family:var(--mono);font-size:11px;color:var(--ink-300)}
        .tm-head-right{display:flex;align-items:center;gap:6px}
        .tm-btn{padding:7px 16px;border-radius:6px;font-size:12.5px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .08s;display:flex;align-items:center;gap:5px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-600)}
        .tm-btn:hover{background:var(--warm-50);border-color:var(--warm-300)}
        .tm-btn.primary{background:var(--ember);border-color:var(--ember);color:#fff}
        .tm-btn.primary:hover{background:var(--ember-light)}

        /* Tabs */
        .tm-tabs{display:flex;gap:0;border-bottom:1px solid var(--warm-200);padding:0 24px;flex-shrink:0}
        .tm-tab{padding:10px 18px;font-size:13px;cursor:pointer;border:none;background:none;font-family:inherit;color:var(--ink-400);border-bottom:2px solid transparent;transition:all .06s}
        .tm-tab:hover{color:var(--ink-600)}
        .tm-tab.on{color:var(--ink-800);font-weight:500;border-bottom-color:var(--ember)}

        /* Layout */
        .tm-layout{flex:1;display:flex;overflow:hidden}

        /* ── Member list ── */
        .tm-list{width:340px;flex-shrink:0;overflow-y:auto;border-right:1px solid var(--warm-100);padding:8px}
        .tm-list::-webkit-scrollbar{width:4px}.tm-list::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}
        .tm-list-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;padding:12px 10px 6px;display:flex;align-items:center;gap:8px}
        .tm-list-label::after{content:'';flex:1;height:1px;background:var(--warm-100)}

        .tm-member{display:flex;align-items:center;gap:12px;padding:12px 12px;border-radius:8px;cursor:pointer;transition:all .08s;border:1px solid transparent;position:relative}
        .tm-member:hover{background:var(--warm-50);border-color:var(--warm-200)}
        .tm-member.on{background:var(--ember-bg);border-color:rgba(176,125,79,0.1)}
        .tm-member-av{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
        .tm-member-status{position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-radius:50%;border:2px solid var(--parchment)}
        .tm-member-info{flex:1;min-width:0}
        .tm-member-name{font-size:14px;font-weight:500;color:var(--ink-800)}
        .tm-member-meta{display:flex;align-items:center;gap:6px;margin-top:2px}
        .tm-member-role{font-family:var(--mono);font-size:9px;font-weight:500;padding:1px 6px;border-radius:3px}
        .tm-member-email{font-family:var(--mono);font-size:10px;color:var(--ink-300);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .tm-member-active{font-family:var(--mono);font-size:10px;color:var(--ink-300);flex-shrink:0}

        /* Pending invite */
        .tm-pending{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:8px;border:1px dashed var(--warm-300);margin:4px 0}
        .tm-pending-av{width:38px;height:38px;border-radius:9px;background:var(--warm-100);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--ink-300);flex-shrink:0}
        .tm-pending-info{flex:1}
        .tm-pending-email{font-family:var(--mono);font-size:12px;color:var(--ink-500)}
        .tm-pending-meta{font-family:var(--mono);font-size:10px;color:var(--ink-300);margin-top:1px}
        .tm-pending-cancel{font-family:var(--mono);font-size:10px;color:#c24b38;background:none;border:none;cursor:pointer;flex-shrink:0}
        .tm-pending-cancel:hover{text-decoration:underline}

        /* ── Detail panel ── */
        .tm-detail{flex:1;overflow-y:auto;padding:0}
        .tm-detail::-webkit-scrollbar{width:4px}.tm-detail::-webkit-scrollbar-thumb{background:rgba(0,0,0,.04);border-radius:99px}

        .tm-d-head{padding:24px 28px;border-bottom:1px solid var(--warm-100);display:flex;align-items:flex-start;gap:18px}
        .tm-d-av{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:600;color:#fff;flex-shrink:0;position:relative}
        .tm-d-status{position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;border-radius:50%;border:2.5px solid var(--parchment)}
        .tm-d-info{flex:1}
        .tm-d-name{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--ink-900);line-height:1.2}
        .tm-d-email{font-family:var(--mono);font-size:12px;color:var(--ink-400);margin-top:2px}
        .tm-d-badges{display:flex;align-items:center;gap:6px;margin-top:8px}
        .tm-d-role-badge{font-family:var(--mono);font-size:10px;font-weight:500;padding:3px 10px;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:4px;position:relative}
        .tm-d-role-badge:hover{filter:brightness(0.95)}
        .tm-d-joined{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
        .tm-d-actions{display:flex;gap:5px;flex-shrink:0}

        /* Role dropdown */
        .tm-role-menu{position:absolute;top:calc(100% + 6px);left:0;width:220px;background:#fff;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.1),0 0 0 1px rgba(0,0,0,.04);padding:4px;z-index:50;animation:tmIn .12s ease}
        @keyframes tmIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .tm-role-option{display:flex;align-items:flex-start;gap:8px;padding:8px 10px;border-radius:6px;cursor:pointer;transition:background .06s}
        .tm-role-option:hover{background:var(--ember-bg)}
        .tm-role-option-dot{width:8px;height:8px;border-radius:2px;margin-top:4px;flex-shrink:0}
        .tm-role-option-info{flex:1}
        .tm-role-option-name{font-size:13px;font-weight:500;color:var(--ink-700)}
        .tm-role-option-desc{font-size:11px;color:var(--ink-400)}
        .tm-role-check{font-size:12px;color:#5a9a3c;flex-shrink:0;margin-top:2px}

        /* Stats */
        .tm-d-stats{display:flex;gap:0;border-bottom:1px solid var(--warm-100)}
        .tm-d-stat{flex:1;padding:14px 20px;border-right:1px solid var(--warm-100);text-align:center}
        .tm-d-stat:last-child{border-right:none}
        .tm-d-stat-val{font-family:var(--mono);font-size:18px;font-weight:600;color:var(--ink-800)}
        .tm-d-stat-val.green{color:#5a9a3c}
        .tm-d-stat-val.ember{color:var(--ember)}
        .tm-d-stat-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}

        /* Capacity bar */
        .tm-d-capacity{padding:16px 28px;border-bottom:1px solid var(--warm-100)}
        .tm-d-cap-head{display:flex;justify-content:space-between;margin-bottom:6px}
        .tm-d-cap-label{font-size:13px;color:var(--ink-500)}
        .tm-d-cap-val{font-family:var(--mono);font-size:12px;font-weight:500}
        .tm-d-cap-bar{height:6px;background:var(--warm-200);border-radius:3px;overflow:hidden}
        .tm-d-cap-fill{height:100%;border-radius:3px;transition:width .4s}

        /* Sections */
        .tm-d-section{padding:16px 28px}
        .tm-d-sec-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;display:flex;align-items:center;gap:8px}
        .tm-d-sec-label::after{content:'';flex:1;height:1px;background:var(--warm-200)}

        /* Projects */
        .tm-d-projects{display:flex;flex-wrap:wrap;gap:6px}
        .tm-d-project{padding:6px 12px;border:1px solid var(--warm-200);border-radius:6px;font-size:13px;color:var(--ink-600);cursor:pointer;transition:all .06s;display:flex;align-items:center;gap:5px}
        .tm-d-project:hover{border-color:var(--warm-300);background:var(--warm-50)}
        .tm-d-project-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

        /* Activity */
        .tm-d-activity{display:flex;flex-direction:column;gap:0}
        .tm-d-act{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--warm-100)}
        .tm-d-act:last-child{border-bottom:none}
        .tm-d-act-dot{width:6px;height:6px;border-radius:50%;background:var(--warm-300);flex-shrink:0;margin-top:6px}
        .tm-d-act-text{font-size:13px;color:var(--ink-600);line-height:1.45;flex:1}
        .tm-d-act-time{font-family:var(--mono);font-size:10px;color:var(--ink-300);flex-shrink:0}

        /* ── Permissions tab ── */
        .tm-perms{padding:20px 28px}
        .tm-perms-table{width:100%;border:1px solid var(--warm-200);border-radius:8px;overflow:hidden}
        .tm-perms-header{display:flex;padding:10px 16px;background:var(--warm-50);border-bottom:1px solid var(--warm-200)}
        .tm-perms-header span{flex:1;font-family:var(--mono);font-size:9px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;text-align:center}
        .tm-perms-header span:first-child{text-align:left;flex:2}
        .tm-perms-row{display:flex;padding:8px 16px;border-bottom:1px solid var(--warm-100);align-items:center}
        .tm-perms-row:last-child{border-bottom:none}
        .tm-perms-row:hover{background:var(--warm-50)}
        .tm-perms-row span{flex:1;text-align:center;font-size:13px}
        .tm-perms-row span:first-child{text-align:left;flex:2;color:var(--ink-600)}
        .tm-perms-check{color:#5a9a3c;font-size:13px}
        .tm-perms-x{color:var(--warm-300);font-size:11px}

        /* ── Invite modal ── */
        .tm-invite-overlay{position:fixed;inset:0;background:rgba(44,42,37,0.3);backdrop-filter:blur(2px);z-index:100;display:flex;align-items:center;justify-content:center}
        .tm-invite{width:480px;background:var(--parchment);border-radius:14px;box-shadow:0 16px 48px rgba(0,0,0,.12);overflow:hidden;animation:tmIn .2s ease}
        .tm-invite-head{padding:20px 24px;border-bottom:1px solid var(--warm-200);display:flex;align-items:center;justify-content:space-between}
        .tm-invite-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--ink-900)}
        .tm-invite-close{width:28px;height:28px;border-radius:6px;border:none;background:none;cursor:pointer;color:var(--ink-400);display:flex;align-items:center;justify-content:center}
        .tm-invite-close:hover{background:var(--warm-100);color:var(--ink-600)}
        .tm-invite-body{padding:24px}
        .tm-invite-field{margin-bottom:16px}
        .tm-invite-label{font-family:var(--mono);font-size:10px;color:var(--ink-400);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;display:block}
        .tm-invite-input{width:100%;padding:11px 14px;border:1px solid var(--warm-200);border-radius:8px;font-family:inherit;font-size:15px;color:var(--ink-800);outline:none}
        .tm-invite-input:focus{border-color:var(--ember);box-shadow:0 0 0 3px rgba(176,125,79,.04)}
        .tm-invite-input::placeholder{color:var(--warm-400)}
        .tm-invite-textarea{width:100%;padding:11px 14px;border:1px solid var(--warm-200);border-radius:8px;font-family:inherit;font-size:14px;color:var(--ink-700);outline:none;resize:none;line-height:1.5}
        .tm-invite-textarea:focus{border-color:var(--ember)}
        .tm-invite-textarea::placeholder{color:var(--warm-400)}

        .tm-invite-roles{display:flex;gap:6px}
        .tm-invite-role{flex:1;padding:12px;border:1px solid var(--warm-200);border-radius:8px;cursor:pointer;transition:all .08s;text-align:center}
        .tm-invite-role:hover{border-color:var(--warm-300);background:var(--warm-50)}
        .tm-invite-role.on{border-color:var(--ember);background:var(--ember-bg);box-shadow:0 0 0 1px var(--ember)}
        .tm-invite-role-name{font-size:14px;font-weight:500;color:var(--ink-700);margin-bottom:2px}
        .tm-invite-role.on .tm-invite-role-name{color:var(--ember)}
        .tm-invite-role-desc{font-size:11px;color:var(--ink-400)}

        .tm-invite-footer{padding:16px 24px;border-top:1px solid var(--warm-100);display:flex;gap:8px;justify-content:flex-end}
        .tm-invite-send{padding:10px 24px;border-radius:7px;border:none;background:var(--ember);color:#fff;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .1s;display:flex;align-items:center;gap:5px}
        .tm-invite-send:hover{background:var(--ember-light)}
        .tm-invite-send:disabled{opacity:.3;cursor:not-allowed}
        .tm-invite-cancel{padding:10px 20px;border-radius:7px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-500);font-size:14px;font-family:inherit;cursor:pointer}

        .tm-invite-success{padding:32px;text-align:center}
        .tm-invite-success-icon{width:48px;height:48px;border-radius:50%;background:rgba(90,154,60,.06);color:#5a9a3c;font-size:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;border:1px solid rgba(90,154,60,.1)}
        .tm-invite-success-title{font-size:16px;font-weight:500;color:var(--ink-800);margin-bottom:4px}
        .tm-invite-success-sub{font-size:13px;color:var(--ink-400)}

        /* Footer */
        .tm-foot{padding:6px 24px;border-top:1px solid var(--warm-100);font-family:var(--mono);font-size:10px;color:var(--ink-300);display:flex;justify-content:space-between;flex-shrink:0}
      `}</style>

      <div className="tm">
        {/* Header */}
        <div className="tm-head">
          <div className="tm-head-left">
            <span className="tm-title">Team</span>
            <span className="tm-count">{MEMBERS.length} members · {PENDING_INVITES.length} pending</span>
          </div>
          <div className="tm-head-right">
            <button className="tm-btn" onClick={() => setShowPerms(!showPerms)}>
              {showPerms ? "Hide" : "View"} Permissions
            </button>
            <button className="tm-btn primary" onClick={() => setShowInvite(true)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Invite
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tm-tabs">
          <button className={`tm-tab${activeTab === "members" ? " on" : ""}`} onClick={() => setActiveTab("members")}>Members</button>
          <button className={`tm-tab${activeTab === "clients" ? " on" : ""}`} onClick={() => setActiveTab("clients")}>Clients</button>
          <button className={`tm-tab${activeTab === "permissions" ? " on" : ""}`} onClick={() => setActiveTab("permissions")}>Permissions</button>
        </div>

        {activeTab === "permissions" ? (
          /* Permissions matrix */
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div className="tm-perms">
              <div className="tm-perms-table">
                <div className="tm-perms-header">
                  <span>Permission</span>
                  {ROLES.map(r => <span key={r.id} style={{ color: r.color }}>{r.label}</span>)}
                </div>
                {PERMISSIONS_MATRIX.map((row, i) => (
                  <div key={i} className="tm-perms-row">
                    <span>{row.perm}</span>
                    <span>{row.owner ? <span className="tm-perms-check">✓</span> : <span className="tm-perms-x">—</span>}</span>
                    <span>{row.editor ? <span className="tm-perms-check">✓</span> : <span className="tm-perms-x">—</span>}</span>
                    <span>{row.viewer ? <span className="tm-perms-check">✓</span> : <span className="tm-perms-x">—</span>}</span>
                    <span>{row.client ? <span className="tm-perms-check">✓</span> : <span className="tm-perms-x">—</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="tm-layout">
            {/* Member list */}
            <div className="tm-list">
              {activeTab === "members" && (
                <>
                  <div className="tm-list-label">Team ({teamMembers.length})</div>
                  {teamMembers.map(m => {
                    const role = ROLES.find(r => r.id === m.role);
                    return (
                      <div key={m.id} className={`tm-member${selectedMember === m.id ? " on" : ""}`}
                        onClick={() => setSelectedMember(m.id)}>
                        <div className="tm-member-av" style={{ background: m.color }}>
                          {m.avatar}
                          <div className="tm-member-status" style={{ background: m.status === "online" ? "#5a9a3c" : "var(--warm-300)" }} />
                        </div>
                        <div className="tm-member-info">
                          <div className="tm-member-name">{m.name}</div>
                          <div className="tm-member-meta">
                            <span className="tm-member-role" style={{ color: role.color, background: role.color + "08", border: `1px solid ${role.color}15` }}>{role.label}</span>
                            <span className="tm-member-email">{m.email}</span>
                          </div>
                        </div>
                        <span className="tm-member-active">{m.status === "online" ? "●" : m.lastActive}</span>
                      </div>
                    );
                  })}

                  {PENDING_INVITES.length > 0 && (
                    <>
                      <div className="tm-list-label">Pending ({PENDING_INVITES.length})</div>
                      {PENDING_INVITES.map(inv => {
                        const role = ROLES.find(r => r.id === inv.role);
                        return (
                          <div key={inv.id} className="tm-pending">
                            <div className="tm-pending-av">✉</div>
                            <div className="tm-pending-info">
                              <div className="tm-pending-email">{inv.email}</div>
                              <div className="tm-pending-meta">{role.label} · Sent {inv.sent} · Expires {inv.expires}</div>
                            </div>
                            <button className="tm-pending-cancel">Revoke</button>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              )}

              {activeTab === "clients" && (
                <>
                  <div className="tm-list-label">Clients ({clientMembers.length})</div>
                  {clientMembers.map(m => (
                    <div key={m.id} className={`tm-member${selectedMember === m.id ? " on" : ""}`}
                      onClick={() => setSelectedMember(m.id)}>
                      <div className="tm-member-av" style={{ background: m.color }}>
                        {m.avatar}
                        <div className="tm-member-status" style={{ background: m.status === "online" ? "#5a9a3c" : "var(--warm-300)" }} />
                      </div>
                      <div className="tm-member-info">
                        <div className="tm-member-name">{m.name}</div>
                        <div className="tm-member-meta">
                          <span className="tm-member-role" style={{ color: "#8a7e63", background: "rgba(138,126,99,0.06)", border: "1px solid rgba(138,126,99,0.1)" }}>Client</span>
                          <span className="tm-member-email">{m.email}</span>
                        </div>
                      </div>
                      <span className="tm-member-active">{m.lastActive}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Detail panel */}
            <div className="tm-detail">
              {selected && (() => {
                const role = ROLES.find(r => r.id === selected.role);
                const capPct = selected.hoursCapacity > 0 ? Math.round((selected.hoursThisWeek / selected.hoursCapacity) * 100) : 0;
                const capColor = capPct >= 90 ? "#c24b38" : capPct >= 70 ? "#c89360" : "#5a9a3c";

                return (
                  <>
                    <div className="tm-d-head">
                      <div className="tm-d-av" style={{ background: selected.color }}>
                        {selected.avatar}
                        <div className="tm-d-status" style={{ background: selected.status === "online" ? "#5a9a3c" : "var(--warm-300)" }} />
                      </div>
                      <div className="tm-d-info">
                        <div className="tm-d-name">{selected.name}</div>
                        <div className="tm-d-email">{selected.email}</div>
                        <div className="tm-d-badges">
                          <div className="tm-d-role-badge" style={{ color: role.color, background: role.color + "08", border: `1px solid ${role.color}15` }}
                            onClick={() => setShowRoleMenu(showRoleMenu ? null : selected.id)}>
                            {role.label} ▾
                            {showRoleMenu === selected.id && (
                              <div className="tm-role-menu" onClick={e => e.stopPropagation()}>
                                {ROLES.map(r => (
                                  <div key={r.id} className="tm-role-option" onClick={() => setShowRoleMenu(null)}>
                                    <span className="tm-role-option-dot" style={{ background: r.color }} />
                                    <div className="tm-role-option-info">
                                      <div className="tm-role-option-name">{r.label}</div>
                                      <div className="tm-role-option-desc">{r.desc}</div>
                                    </div>
                                    {selected.role === r.id && <span className="tm-role-check">✓</span>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="tm-d-joined">Joined {selected.joined}</span>
                        </div>
                      </div>
                      <div className="tm-d-actions">
                        <button className="tm-btn" style={{ fontSize: 11, padding: "5px 12px" }}>Message</button>
                        {selected.role !== "owner" && (
                          <button className="tm-btn" style={{ fontSize: 11, padding: "5px 12px", color: "#c24b38", borderColor: "rgba(194,75,56,0.15)" }}>Remove</button>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="tm-d-stats">
                      <div className="tm-d-stat">
                        <div className="tm-d-stat-val">{selected.stats.projects}</div>
                        <div className="tm-d-stat-label">Projects</div>
                      </div>
                      <div className="tm-d-stat">
                        <div className="tm-d-stat-val">{selected.stats.docsEdited}</div>
                        <div className="tm-d-stat-label">Docs edited</div>
                      </div>
                      <div className="tm-d-stat">
                        <div className="tm-d-stat-val">{selected.stats.invoicesSent}</div>
                        <div className="tm-d-stat-label">Invoices sent</div>
                      </div>
                      <div className="tm-d-stat">
                        <div className="tm-d-stat-val green">{selected.stats.earned > 0 ? `$${(selected.stats.earned / 1000).toFixed(1)}k` : "—"}</div>
                        <div className="tm-d-stat-label">Earned (month)</div>
                      </div>
                    </div>

                    {/* Capacity */}
                    {selected.hoursCapacity > 0 && (
                      <div className="tm-d-capacity">
                        <div className="tm-d-cap-head">
                          <span className="tm-d-cap-label">Weekly capacity</span>
                          <span className="tm-d-cap-val" style={{ color: capColor }}>{selected.hoursThisWeek}h / {selected.hoursCapacity}h ({capPct}%)</span>
                        </div>
                        <div className="tm-d-cap-bar">
                          <div className="tm-d-cap-fill" style={{ width: `${Math.min(capPct, 100)}%`, background: capColor }} />
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    <div className="tm-d-section">
                      <div className="tm-d-sec-label">Assigned projects ({selected.projects.length})</div>
                      <div className="tm-d-projects">
                        {selected.projects.map((p, i) => (
                          <div key={i} className="tm-d-project">
                            <span className="tm-d-project-dot" style={{ background: i === 0 ? "#5a9a3c" : i === 3 ? "#c24b38" : "var(--ember)" }} />
                            {p}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="tm-d-section">
                      <div className="tm-d-sec-label">Recent activity</div>
                      <div className="tm-d-activity">
                        {selected.activity.map((a, i) => (
                          <div key={i} className="tm-d-act">
                            <span className="tm-d-act-dot" />
                            <span className="tm-d-act-text">{a.text}</span>
                            <span className="tm-d-act-time">{a.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <div className="tm-foot">
          <span>Felmark · {MEMBERS.length} members · {PENDING_INVITES.length} pending invites</span>
          <span>Roles manage what each person can access</span>
        </div>

        {/* Invite modal */}
        {showInvite && (
          <div className="tm-invite-overlay" onClick={() => setShowInvite(false)}>
            <div className="tm-invite" onClick={e => e.stopPropagation()}>
              <div className="tm-invite-head">
                <span className="tm-invite-title">Invite someone</span>
                <button className="tm-invite-close" onClick={() => setShowInvite(false)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </button>
              </div>

              {inviteSent ? (
                <div className="tm-invite-success">
                  <div className="tm-invite-success-icon">✓</div>
                  <div className="tm-invite-success-title">Invitation sent</div>
                  <div className="tm-invite-success-sub">{inviteEmail} will receive an email with a link to join</div>
                </div>
              ) : (
                <>
                  <div className="tm-invite-body">
                    <div className="tm-invite-field">
                      <label className="tm-invite-label">Email address</label>
                      <input className="tm-invite-input" type="email" placeholder="colleague@example.com"
                        value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} autoFocus />
                    </div>

                    <div className="tm-invite-field">
                      <label className="tm-invite-label">Role</label>
                      <div className="tm-invite-roles">
                        {ROLES.filter(r => r.id !== "owner").map(r => (
                          <div key={r.id} className={`tm-invite-role${inviteRole === r.id ? " on" : ""}`}
                            onClick={() => setInviteRole(r.id)}>
                            <div className="tm-invite-role-name">{r.label}</div>
                            <div className="tm-invite-role-desc">{r.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="tm-invite-field">
                      <label className="tm-invite-label">Personal message <span style={{ color: "var(--ink-300)", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                      <textarea className="tm-invite-textarea" placeholder="Hey! I'd love to collaborate with you on some projects..." rows={3}
                        value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} />
                    </div>
                  </div>

                  <div className="tm-invite-footer">
                    <button className="tm-invite-cancel" onClick={() => setShowInvite(false)}>Cancel</button>
                    <button className="tm-invite-send" onClick={sendInvite} disabled={!inviteEmail.includes("@")}>
                      Send Invitation
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
