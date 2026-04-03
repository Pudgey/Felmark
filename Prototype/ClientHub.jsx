import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — CLIENT HUB
   Full-scale client PM inside Workspace.
   Meridian Studio — everything in one view.
   ═══════════════════════════════════════════ */

const TASKS = [
  { id:"t1", title:"Client review & revisions", status:"todo", pri:"urgent", due:"Apr 1", overdue:true, subs:[{t:"Address color feedback",d:false},{t:"Revise teal → warmer",d:false},{t:"CEO sign-off",d:false}], logged:1.5, est:4, entries:[{date:"Apr 1",desc:"Revision meeting",h:1.5,v:180}] },
  { id:"t2", title:"Color palette & typography", status:"active", pri:"high", due:"Apr 2", subs:[{t:"Primary palette",d:true},{t:"Secondary & accents",d:false},{t:"Heading fonts",d:true},{t:"Body & mono",d:false}], logged:3, est:6, timer:true, entries:[{date:"Apr 2",desc:"Palette exploration",h:2,v:240},{date:"Apr 1",desc:"Research",h:1,v:120}] },
  { id:"t3", title:"Brand guidelines document", status:"todo", pri:"medium", due:"Apr 5", subs:[{t:"Cover & TOC",d:false},{t:"Logo rules",d:false},{t:"Color specs",d:false},{t:"Typography",d:false},{t:"Photography",d:false},{t:"Social guidelines",d:false}], logged:0, est:16, entries:[] },
  { id:"t4", title:"Typography scale & pairings", status:"todo", pri:"medium", due:"Apr 5", subs:[], logged:0, est:4, entries:[] },
  { id:"t5", title:"Imagery direction", status:"todo", pri:"low", due:"Apr 7", subs:[], logged:0, est:6, entries:[] },
  { id:"t6", title:"Social media templates", status:"done", pri:"low", due:"Apr 10", subs:[], logged:8, est:8, entries:[{date:"Mar 20",desc:"Template design",h:8,v:960}] },
];

const COLUMNS = [
  { id:"todo", label:"To Do", color:"#4c525e" },
  { id:"active", label:"Active", color:"#26a69a" },
  { id:"review", label:"Review", color:"#ff9800" },
  { id:"done", label:"Done", color:"#787b86" },
];

const INVOICES = [
  { id:"046", amount:1800, status:"paid", date:"Mar 28", desc:"Phase 1 — Discovery" },
  { id:"048", amount:2400, status:"pending", date:"Apr 12", desc:"Phase 2 — Design system", viewed:3 },
  { id:"050", amount:4200, status:"draft", date:"—", desc:"Unbilled hours (14h)" },
];

const VIEWS = ["board","list","time","invoices","files"];

export default function ClientHub() {
  const [view, setView] = useState("board");
  const [selectedTask, setSelectedTask] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const task = selectedTask ? TASKS.find(t => t.id === selectedTask) : null;
  const totalLogged = TASKS.reduce((s,t) => s+t.logged, 0);
  const totalEst = TASKS.reduce((s,t) => s+t.est, 0);

  const priColor = p => p==="urgent"?"#ef5350":p==="high"?"#ff9800":p==="medium"?"#2962ff":"#4c525e";
  const statusColor = s => s==="overdue"||s==="urgent"?"#ef5350":s==="active"?"#26a69a":s==="review"?"#ff9800":s==="done"?"#787b86":"#4c525e";

  // ... Full prototype implementation
  // See the user's message for the complete JSX + CSS
  return null;
}
