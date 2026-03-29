import { useState, useRef, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);

const TEAM_MEMBERS = [
  { id: "u1", name: "You", avatar: "A", color: "#b07d4f", online: true },
  { id: "u2", name: "Jamie Park", avatar: "J", color: "#7c8594", online: true },
  { id: "u3", name: "Priya Sharma", avatar: "P", color: "#a08472", online: false },
  { id: "u4", name: "Marcus Cole", avatar: "M", color: "#5a9a3c", online: true },
  { id: "u5", name: "Sarah Chen", avatar: "S", color: "#8a7e63", online: false },
];

const CONVERSATIONS = [
  {
    id: "c-team", type: "team", name: "Team", icon: "◆", unread: 3,
    messages: [
      { id: "m1", user: "u4", text: "Meridian just approved the mood board direction — we're good to move forward", time: "10:42am" },
      { id: "m2", user: "u2", text: "Nice! I'll start the typography system today", time: "10:45am" },
      { id: "m3", user: "u3", text: "Can someone share the latest color palette file? Need it for the social templates", time: "11:01am" },
      { id: "m4", user: "u4", text: "Just dropped it in the Brand Guidelines workspace", time: "11:03am" },
      { id: "m5", user: "u1", text: "Thanks Marcus. Priya check the callout block in the doc — linked it there too", time: "11:15am" },
    ],
  },
  {
    id: "c-p1", type: "project", name: "Brand Guidelines v2", workspace: "Meridian Studio", icon: "●", unread: 1,
    messages: [
      { id: "m6", user: "u2", text: "Should we go with variable fonts or static? Variable gives us more flexibility but file size is bigger", time: "9:30am" },
      { id: "m7", user: "u1", text: "Variable. The client wants web + print from the same system", time: "9:34am" },
      { id: "m8", user: "u2", text: "Got it, I'll set up the scale with Outfit variable then", time: "9:35am" },
    ],
  },
  {
    id: "c-p4", type: "project", name: "Course Landing Page", workspace: "Nora Kim", icon: "●", unread: 0,
    messages: [
      { id: "m9", user: "u3", text: "Nora wants the hero section to feel 'warm but professional' — her words", time: "Yesterday" },
      { id: "m10", user: "u1", text: "I'll pull some reference screenshots. That's basically our whole Felmark palette lol", time: "Yesterday" },
    ],
  },
  {
    id: "c-p6", type: "project", name: "App Onboarding UX", workspace: "Bolt Fitness", icon: "●", unread: 0,
    messages: [
      { id: "m11", user: "u4", text: "This one is overdue — client pinged me twice. What's the blocker?", time: "Yesterday" },
      { id: "m12", user: "u1", text: "Waiting on their API docs. I'll follow up today", time: "Yesterday" },
    ],
  },
  {
    id: "c-dm1", type: "dm", name: "Jamie Park", userId: "u2", unread: 0,
    messages: [
      { id: "m13", user: "u2", text: "Hey, can you review my type scale before I send it to the client?", time: "8:20am" },
      { id: "m14", user: "u1", text: "Yeah send it over, I'll look at lunch", time: "8:25am" },
    ],
  },
  {
    id: "c-dm2", type: "dm", name: "Sarah Chen", userId: "u5", unread: 2,
    messages: [
      { id: "m15", user: "u5", text: "Quick question — is the proposal for the brand guidelines sent yet?", time: "10:50am" },
      { id: "m16", user: "u5", text: "I want to review before it goes out", time: "10:51am" },
    ],
  },
];

export default function ConversationsPanel() {
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeConvo, setActiveConvo] = useState("c-team");
  const [draft, setDraft] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showNewDm, setShowNewDm] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const active = conversations.find(c => c.id === activeConvo);
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo, active?.messages?.length]);

  useEffect(() => {
    if (activeConvo && inputRef.current) inputRef.current.focus();
  }, [activeConvo]);

  const sendMessage = () => {
    if (!draft.trim()) return;
    const newMsg = { id: uid(), user: "u1", text: draft.trim(), time: "now" };
    setConversations(prev => prev.map(c =>
      c.id === activeConvo ? { ...c, messages: [...c.messages, newMsg], unread: 0 } : c
    ));
    setDraft("");
  };

  const selectConvo = (id) => {
    setActiveConvo(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const createProjectConvo = () => {
    const newConvo = {
      id: uid(), type: "project", name: "New Conversation",
      workspace: "Personal", icon: "●", unread: 0, messages: [],
    };
    setConversations(prev => [...prev, newConvo]);
    setActiveConvo(newConvo.id);
    setShowNewMenu(false);
  };

  const createDm = (userId) => {
    const user = TEAM_MEMBERS.find(u => u.id === userId);
    const existing = conversations.find(c => c.type === "dm" && c.userId === userId);
    if (existing) { selectConvo(existing.id); setShowNewDm(false); return; }
    const newConvo = {
      id: uid(), type: "dm", name: user.name, userId, unread: 0, messages: [],
    };
    setConversations(prev => [...prev, newConvo]);
    setActiveConvo(newConvo.id);
    setShowNewDm(false);
    setShowNewMenu(false);
  };

  const teamConvos = conversations.filter(c => c.type === "team");
  const projectConvos = conversations.filter(c => c.type === "project");
  const dmConvos = conversations.filter(c => c.type === "dm");

  const getUser = (id) => TEAM_MEMBERS.find(u => u.id === id) || { name: "Unknown", avatar: "?", color: "#999" };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`/* ... full CSS from prototype ... */`}</style>
      <div className="conv-wrapper">
        {/* Full prototype renders here — see prototype file for complete JSX */}
      </div>
    </>
  );
}
