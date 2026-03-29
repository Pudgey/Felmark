import { useState, useRef, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am - 8pm
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DATES = [24, 25, 26, 27, 28, 29, 30]; // Mar 24-30
const TODAY_IDX = 5; // Saturday Mar 29
const NOW_HOUR = 11;
const NOW_MIN = 30;

const WORKSPACES = [
  { id: "w1", name: "Meridian Studio", color: "#7c8594", light: "rgba(124,133,148,0.08)", border: "rgba(124,133,148,0.2)" },
  { id: "w2", name: "Nora Kim", color: "#a08472", light: "rgba(160,132,114,0.08)", border: "rgba(160,132,114,0.2)" },
  { id: "w3", name: "Bolt Fitness", color: "#8a7e63", light: "rgba(138,126,99,0.08)", border: "rgba(138,126,99,0.2)" },
  { id: "w4", name: "Personal", color: "#b07d4f", light: "rgba(176,125,79,0.08)", border: "rgba(176,125,79,0.2)" },
];

const INITIAL_EVENTS = [
  { id: uid(), title: "Brand review call", workspace: "w1", day: 0, startHour: 9, startMin: 0, duration: 60, type: "meeting" },
  { id: uid(), title: "Logo guidelines draft", workspace: "w1", day: 0, startHour: 10, startMin: 30, duration: 120, type: "work" },
  { id: uid(), title: "Typography research", workspace: "w1", day: 1, startHour: 9, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Nora kickoff call", workspace: "w2", day: 1, startHour: 14, startMin: 0, duration: 45, type: "meeting" },
  { id: uid(), title: "Landing page wireframe", workspace: "w2", day: 2, startHour: 10, startMin: 0, duration: 150, type: "work" },
  { id: uid(), title: "Bolt onboarding review", workspace: "w3", day: 2, startHour: 15, startMin: 0, duration: 60, type: "meeting" },
  { id: uid(), title: "Color palette finalize", workspace: "w1", day: 3, startHour: 9, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Social templates — IG", workspace: "w1", day: 3, startHour: 13, startMin: 0, duration: 120, type: "work" },
  { id: uid(), title: "Email sequence outline", workspace: "w2", day: 4, startHour: 10, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Blog post draft", workspace: "w3", day: 4, startHour: 14, startMin: 0, duration: 90, type: "work" },
  { id: uid(), title: "Weekly review", workspace: "w4", day: 4, startHour: 16, startMin: 30, duration: 30, type: "personal" },
  { id: uid(), title: "Client delivery — Meridian", workspace: "w1", day: 5, startHour: 11, startMin: 0, duration: 60, type: "deadline" },
];

const EVENT_TYPES = {
  meeting: { icon: "◎" },
  work: { icon: "◆" },
  deadline: { icon: "⚑" },
  personal: { icon: "✦" },
};

const MINI_MONTH = [
  [null, null, null, null, null, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
  [31, null, null, null, null, null, null],
];

export default function FelmarkCalendar() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [view, setView] = useState("week");
  const [showCreate, setShowCreate] = useState(false);
  const [createData, setCreateData] = useState({ title: "", workspace: "w1", day: TODAY_IDX, startHour: 9, startMin: 0, duration: 60, type: "work" });
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [wsFilter, setWsFilter] = useState("all");
  const gridRef = useRef(null);

  const HOUR_H = 64;

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = (NOW_HOUR - 7.5) * HOUR_H;
    }
  }, []);

  const filtered = wsFilter === "all" ? events : events.filter(e => e.workspace === wsFilter);

  const openCreate = (day, hour) => {
    setCreateData({ title: "", workspace: "w1", day, startHour: hour, startMin: 0, duration: 60, type: "work" });
    setShowCreate(true);
  };

  const saveEvent = () => {
    if (!createData.title.trim()) return;
    setEvents(prev => [...prev, { ...createData, id: uid() }]);
    setShowCreate(false);
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
  };

  const getWs = (id) => WORKSPACES.find(w => w.id === id) || WORKSPACES[0];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      {/* Calendar component renders here — see full prototype for CSS + JSX */}
    </>
  );
}
