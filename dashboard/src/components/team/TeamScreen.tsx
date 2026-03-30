"use client";

import { useState } from "react";
import styles from "./TeamScreen.module.css";

// ── Data ──

interface Role { id: string; label: string; desc: string; color: string; }
interface Activity { text: string; time: string; }
interface Member {
  id: string; name: string; email: string; avatar: string; color: string;
  role: string; status: "online" | "offline"; joined: string; lastActive: string;
  projects: string[]; hoursThisWeek: number; hoursCapacity: number;
  activity: Activity[];
  stats: { projects: number; docsEdited: number; invoicesSent: number; earned: number };
}
interface PendingInvite { id: string; email: string; role: string; sent: string; expires: string; }
interface PermRow { perm: string; owner: boolean; editor: boolean; viewer: boolean; client: boolean; }

const ROLES: Role[] = [
  { id: "owner", label: "Owner", desc: "Full access to everything", color: "var(--ember)" },
  { id: "editor", label: "Editor", desc: "Edit projects & docs, can't manage billing", color: "#5b7fa4" },
  { id: "viewer", label: "Viewer", desc: "View only, can comment", color: "#5a9a3c" },
  { id: "client", label: "Client", desc: "See shared docs, approve, pay invoices", color: "#8a7e63" },
];

const MEMBERS: Member[] = [
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
    stats: { projects: 6, docsEdited: 34, invoicesSent: 12, earned: 14800 },
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
    stats: { projects: 2, docsEdited: 18, invoicesSent: 0, earned: 0 },
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
    stats: { projects: 2, docsEdited: 0, invoicesSent: 0, earned: 0 },
  },
  {
    id: "u4", name: "Nora Kim", email: "nora@coachkim.com", avatar: "N", color: "#a08472",
    role: "client", status: "offline", joined: "Feb 2026", lastActive: "1h ago",
    projects: ["Course Landing Page"],
    hoursThisWeek: 0, hoursCapacity: 0,
    activity: [
      { text: "Signed the Course Landing Page proposal", time: "3h ago" },
      { text: "Paid Invoice #046 — $1,800", time: "Mar 15" },
    ],
    stats: { projects: 1, docsEdited: 0, invoicesSent: 0, earned: 0 },
  },
];

const PENDING_INVITES: PendingInvite[] = [
  { id: "inv1", email: "taylor@design.co", role: "editor", sent: "Mar 28", expires: "Apr 4" },
];

const PERMS_MATRIX: PermRow[] = [
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

// ── Component ──

export default function TeamScreen() {
  const [selectedMember, setSelectedMember] = useState("u1");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [activeTab, setActiveTab] = useState<"members" | "clients" | "permissions">("members");
  const [showRoleMenu, setShowRoleMenu] = useState<string | null>(null);

  const selected = MEMBERS.find(m => m.id === selectedMember);
  const teamMembers = MEMBERS.filter(m => m.role !== "client");
  const clientMembers = MEMBERS.filter(m => m.role === "client");

  const sendInvite = () => {
    if (!inviteEmail.includes("@")) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInvite(false); setInviteEmail(""); setInviteMessage(""); }, 2000);
  };

  const getRole = (id: string) => ROLES.find(r => r.id === id) || ROLES[0];

  const renderMemberRow = (m: Member) => {
    const role = getRole(m.role);
    return (
      <div key={m.id} className={`${styles.member} ${selectedMember === m.id ? styles.memberOn : ""}`} onClick={() => setSelectedMember(m.id)}>
        <div className={styles.memberAv} style={{ background: m.color }}>
          {m.avatar}
          <div className={styles.memberStatus} style={{ background: m.status === "online" ? "#5a9a3c" : "var(--warm-300)" }} />
        </div>
        <div className={styles.memberInfo}>
          <div className={styles.memberName}>{m.name}</div>
          <div className={styles.memberMeta}>
            <span className={styles.memberRole} style={{ color: role.color, background: role.color + "08", border: `1px solid ${role.color}15` }}>{role.label}</span>
            <span className={styles.memberEmail}>{m.email}</span>
          </div>
        </div>
        <span className={styles.memberActive}>{m.status === "online" ? "●" : m.lastActive}</span>
      </div>
    );
  };

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.title}>Team</span>
          <span className={styles.count}>{MEMBERS.length} members · {PENDING_INVITES.length} pending</span>
        </div>
        <div className={styles.headRight}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowInvite(true)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Invite
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === "members" ? styles.tabOn : ""}`} onClick={() => setActiveTab("members")}>Members</button>
        <button className={`${styles.tab} ${activeTab === "clients" ? styles.tabOn : ""}`} onClick={() => setActiveTab("clients")}>Clients</button>
        <button className={`${styles.tab} ${activeTab === "permissions" ? styles.tabOn : ""}`} onClick={() => setActiveTab("permissions")}>Permissions</button>
      </div>

      {activeTab === "permissions" ? (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div className={styles.perms}>
            <div className={styles.permsTable}>
              <div className={styles.permsHeader}>
                <span>Permission</span>
                {ROLES.map(r => <span key={r.id} style={{ color: r.color }}>{r.label}</span>)}
              </div>
              {PERMS_MATRIX.map((row, i) => (
                <div key={i} className={styles.permsRow}>
                  <span>{row.perm}</span>
                  <span>{row.owner ? <span className={styles.permsCheck}>✓</span> : <span className={styles.permsX}>—</span>}</span>
                  <span>{row.editor ? <span className={styles.permsCheck}>✓</span> : <span className={styles.permsX}>—</span>}</span>
                  <span>{row.viewer ? <span className={styles.permsCheck}>✓</span> : <span className={styles.permsX}>—</span>}</span>
                  <span>{row.client ? <span className={styles.permsCheck}>✓</span> : <span className={styles.permsX}>—</span>}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.layout}>
          {/* Member list */}
          <div className={styles.list}>
            {activeTab === "members" && (
              <>
                <div className={styles.listLabel}>Team ({teamMembers.length})</div>
                {teamMembers.map(renderMemberRow)}
                {PENDING_INVITES.length > 0 && (
                  <>
                    <div className={styles.listLabel}>Pending ({PENDING_INVITES.length})</div>
                    {PENDING_INVITES.map(inv => {
                      const role = getRole(inv.role);
                      return (
                        <div key={inv.id} className={styles.pending}>
                          <div className={styles.pendingAv}>✉</div>
                          <div className={styles.pendingInfo}>
                            <div className={styles.pendingEmail}>{inv.email}</div>
                            <div className={styles.pendingMeta}>{role.label} · Sent {inv.sent} · Expires {inv.expires}</div>
                          </div>
                          <button className={styles.pendingCancel}>Revoke</button>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
            {activeTab === "clients" && (
              <>
                <div className={styles.listLabel}>Clients ({clientMembers.length})</div>
                {clientMembers.map(renderMemberRow)}
              </>
            )}
          </div>

          {/* Detail panel */}
          <div className={styles.detail}>
            {selected && (() => {
              const role = getRole(selected.role);
              const capPct = selected.hoursCapacity > 0 ? Math.round((selected.hoursThisWeek / selected.hoursCapacity) * 100) : 0;
              const capColor = capPct >= 90 ? "#c24b38" : capPct >= 70 ? "#c89360" : "#5a9a3c";

              return (
                <>
                  <div className={styles.dHead}>
                    <div className={styles.dAv} style={{ background: selected.color }}>
                      {selected.avatar}
                      <div className={styles.dStatus} style={{ background: selected.status === "online" ? "#5a9a3c" : "var(--warm-300)" }} />
                    </div>
                    <div className={styles.dInfo}>
                      <div className={styles.dName}>{selected.name}</div>
                      <div className={styles.dEmail}>{selected.email}</div>
                      <div className={styles.dBadges}>
                        <div className={styles.dRoleBadge} style={{ color: role.color, background: role.color + "08", border: `1px solid ${role.color}15` }}
                          onClick={() => setShowRoleMenu(showRoleMenu ? null : selected.id)}>
                          {role.label} ▾
                          {showRoleMenu === selected.id && (
                            <div className={styles.roleMenu} onClick={e => e.stopPropagation()}>
                              {ROLES.map(r => (
                                <div key={r.id} className={styles.roleOption} onClick={() => setShowRoleMenu(null)}>
                                  <span className={styles.roleOptionDot} style={{ background: r.color }} />
                                  <div className={styles.roleOptionInfo}>
                                    <div className={styles.roleOptionName}>{r.label}</div>
                                    <div className={styles.roleOptionDesc}>{r.desc}</div>
                                  </div>
                                  {selected.role === r.id && <span className={styles.roleCheck}>✓</span>}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={styles.dJoined}>Joined {selected.joined}</span>
                      </div>
                    </div>
                    <div className={styles.dActions}>
                      <button className={styles.btn} style={{ fontSize: 11, padding: "5px 12px" }}>Message</button>
                      {selected.role !== "owner" && (
                        <button className={styles.btn} style={{ fontSize: 11, padding: "5px 12px", color: "#c24b38", borderColor: "rgba(194,75,56,0.15)" }}>Remove</button>
                      )}
                    </div>
                  </div>

                  <div className={styles.dStats}>
                    <div className={styles.dStat}><div className={styles.dStatVal}>{selected.stats.projects}</div><div className={styles.dStatLabel}>Projects</div></div>
                    <div className={styles.dStat}><div className={styles.dStatVal}>{selected.stats.docsEdited}</div><div className={styles.dStatLabel}>Docs edited</div></div>
                    <div className={styles.dStat}><div className={styles.dStatVal}>{selected.stats.invoicesSent}</div><div className={styles.dStatLabel}>Invoices sent</div></div>
                    <div className={styles.dStat}><div className={`${styles.dStatVal} ${selected.stats.earned > 0 ? styles.dStatValGreen : ""}`}>{selected.stats.earned > 0 ? `$${(selected.stats.earned / 1000).toFixed(1)}k` : "—"}</div><div className={styles.dStatLabel}>Earned (month)</div></div>
                  </div>

                  {selected.hoursCapacity > 0 && (
                    <div className={styles.dCapacity}>
                      <div className={styles.dCapHead}>
                        <span className={styles.dCapLabel}>Weekly capacity</span>
                        <span className={styles.dCapVal} style={{ color: capColor }}>{selected.hoursThisWeek}h / {selected.hoursCapacity}h ({capPct}%)</span>
                      </div>
                      <div className={styles.dCapBar}>
                        <div className={styles.dCapFill} style={{ width: `${Math.min(capPct, 100)}%`, background: capColor }} />
                      </div>
                    </div>
                  )}

                  <div className={styles.dSection}>
                    <div className={styles.dSecLabel}>Assigned projects ({selected.projects.length})</div>
                    <div className={styles.dProjects}>
                      {selected.projects.map((p, i) => (
                        <div key={i} className={styles.dProject}>
                          <span className={styles.dProjectDot} style={{ background: i === 0 ? "#5a9a3c" : i === 3 ? "#c24b38" : "var(--ember)" }} />
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.dSection}>
                    <div className={styles.dSecLabel}>Recent activity</div>
                    <div className={styles.dActivity}>
                      {selected.activity.map((a, i) => (
                        <div key={i} className={styles.dAct}>
                          <span className={styles.dActDot} />
                          <span className={styles.dActText}>{a.text}</span>
                          <span className={styles.dActTime}>{a.time}</span>
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

      <div className={styles.foot}>
        <span>Felmark · {MEMBERS.length} members · {PENDING_INVITES.length} pending invites</span>
        <span>Roles manage what each person can access</span>
      </div>

      {/* Invite modal */}
      {showInvite && (
        <div className={styles.inviteOverlay} onClick={() => setShowInvite(false)}>
          <div className={styles.invite} onClick={e => e.stopPropagation()}>
            <div className={styles.inviteHead}>
              <span className={styles.inviteTitle}>Invite someone</span>
              <button className={styles.inviteClose} onClick={() => setShowInvite(false)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4.5 4.5l5 5M9.5 4.5l-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
              </button>
            </div>
            {inviteSent ? (
              <div className={styles.inviteSuccess}>
                <div className={styles.inviteSuccessIcon}>✓</div>
                <div className={styles.inviteSuccessTitle}>Invitation sent</div>
                <div className={styles.inviteSuccessSub}>{inviteEmail} will receive an email with a link to join</div>
              </div>
            ) : (
              <>
                <div className={styles.inviteBody}>
                  <div className={styles.inviteField}>
                    <label className={styles.inviteLabel}>Email address</label>
                    <input className={styles.inviteInput} type="email" placeholder="colleague@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} autoFocus />
                  </div>
                  <div className={styles.inviteField}>
                    <label className={styles.inviteLabel}>Role</label>
                    <div className={styles.inviteRoles}>
                      {ROLES.filter(r => r.id !== "owner").map(r => (
                        <div key={r.id} className={`${styles.inviteRole} ${inviteRole === r.id ? styles.inviteRoleOn : ""}`} onClick={() => setInviteRole(r.id)}>
                          <div className={styles.inviteRoleName}>{r.label}</div>
                          <div className={styles.inviteRoleDesc}>{r.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.inviteField}>
                    <label className={styles.inviteLabel}>Personal message <span style={{ color: "var(--ink-300)", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                    <textarea className={styles.inviteTextarea} placeholder="Hey! I'd love to collaborate with you on some projects..." rows={3} value={inviteMessage} onChange={e => setInviteMessage(e.target.value)} />
                  </div>
                </div>
                <div className={styles.inviteFooter}>
                  <button className={styles.inviteCancel} onClick={() => setShowInvite(false)}>Cancel</button>
                  <button className={styles.inviteSend} onClick={sendInvite} disabled={!inviteEmail.includes("@")}>Send Invitation</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
