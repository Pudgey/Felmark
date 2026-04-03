"use client";

import { useState, useRef, useEffect } from "react";
import type { Notification } from "../../../../notifications/NotificationPanel";

interface UsePanelStateOptions {
  splitPickerRef: React.RefObject<HTMLDivElement | null>;
}

export function usePanelState({ splitPickerRef }: UsePanelStateOptions) {
  const [convoPanelOpen, setConvoPanelOpen] = useState(false);
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [commentHighlight, setCommentHighlight] = useState<string | null>(null);
  const [commentedBlocks, setCommentedBlocks] = useState<Set<string>>(new Set());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [cmdPalette, setCmdPalette] = useState(false);
  const cmdPaletteSourceBlockId = useRef<string | null>(null);
  const [breathe, setBreathe] = useState(false);
  const [splitPickerOpen, setSplitPickerOpen] = useState(false);
  const [templatePanelOpen, setTemplatePanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "n1", type: "payment", title: "Payment received \u2014 $1,800", desc: "Nora Kim paid Invoice #046 \u00b7 Retainer (March)", time: "32m ago", read: false, action: "View invoice", workstation: "Nora Kim" },
    { id: "n2", type: "comment", title: "Sarah commented on Brand Guidelines v2", desc: "\"Can we make the logo usage section more specific? I want exact minimum sizes.\"", time: "2h ago", read: false, action: "Reply", workstation: "Meridian Studio", avatar: "S", avatarBg: "#8a7e63" },
    { id: "n3", type: "view", title: "Sarah viewed Invoice #047", desc: "2nd view \u00b7 1m 45s on page \u00b7 Meridian Studio", time: "2h ago", read: false, action: "Track", workstation: "Meridian Studio" },
    { id: "n4", type: "signed", title: "Nora signed the Course Landing Page proposal", desc: "Proposal accepted \u00b7 $3,200 project value \u00b7 Ready to start", time: "3h ago", read: true, action: "Open project", workstation: "Nora Kim" },
    { id: "n5", type: "overdue", title: "Invoice #044 is 4 days overdue", desc: "Bolt Fitness \u00b7 $4,000 \u00b7 Sent Mar 25 \u00b7 No views in 48h", time: "Today", read: false, action: "Send reminder", workstation: "Bolt Fitness" },
    { id: "n6", type: "edit", title: "Jamie edited Typography section", desc: "Brand Guidelines v2 \u00b7 8 changes \u00b7 Typography Scale v3 updated", time: "6h ago", read: true, action: "Review changes", workstation: "Meridian Studio", avatar: "J", avatarBg: "#7c8594" },
    { id: "n7", type: "deadline", title: "Brand Guidelines v2 due in 5 days", desc: "65% complete \u00b7 3 deliverables remaining \u00b7 Meridian Studio", time: "Today", read: true, action: "Open project", workstation: "Meridian Studio" },
    { id: "n8", type: "proposal", title: "Proposal sent to Luna Boutique", desc: "E-commerce Rebrand \u00b7 $6,500 \u00b7 Awaiting response", time: "Yesterday", read: true, action: "Track", workstation: "Luna Boutique" },
    { id: "n9", type: "wire", title: "3 new signals on The Wire", desc: "Nora Kim raised $2M \u00b7 Meridian hiring \u00b7 Brand demand +34%", time: "Yesterday", read: true, action: "Open The Wire", pro: true },
    { id: "n10", type: "milestone", title: "Logo usage rules \u2014 approved by all", desc: "Brand Guidelines v2 \u00b7 Sarah \u2713 \u00b7 Jamie \u2713 \u00b7 Ready for next milestone", time: "2 days ago", read: true, action: "View deliverable", workstation: "Meridian Studio" },
  ]);

  // Close split picker on outside click
  useEffect(() => {
    if (!splitPickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (splitPickerRef.current && !splitPickerRef.current.contains(e.target as Node)) {
        setSplitPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [splitPickerOpen, splitPickerRef]);

  return {
    convoPanelOpen, setConvoPanelOpen,
    commentPanelOpen, setCommentPanelOpen,
    commentHighlight, setCommentHighlight,
    commentedBlocks, setCommentedBlocks,
    historyOpen, setHistoryOpen,
    shareOpen, setShareOpen,
    catOpen, setCatOpen,
    notifPanelOpen, setNotifPanelOpen,
    cmdPalette, setCmdPalette,
    cmdPaletteSourceBlockId,
    breathe, setBreathe,
    splitPickerOpen, setSplitPickerOpen,
    templatePanelOpen, setTemplatePanelOpen,
    notifications, setNotifications,
  };
}
