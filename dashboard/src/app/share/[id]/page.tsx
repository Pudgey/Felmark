"use client";

import { useState, useEffect } from "react";
import ShareView from "@/components/share/ShareView";

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<{
    projectName: string;
    clientName: string;
    clientAvatar: string;
    clientColor: string;
    blocks: unknown[];
    createdAt: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsPin, setNeedsPin] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [shareId, setShareId] = useState<string>("");

  const fetchShare = async (id: string, pinCode?: string) => {
    setLoading(true);
    try {
      const url = pinCode
        ? `/api/share?id=${id}&pin=${pinCode}`
        : `/api/share?id=${id}`;
      const res = await fetch(url);

      if (res.status === 403) {
        setNeedsPin(true);
        setLoading(false);
        return;
      }

      if (res.status === 404) {
        setError("This shared document could not be found.");
        setLoading(false);
        return;
      }

      if (res.status === 410) {
        setError("This shared link has expired.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Something went wrong.");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setData(json);
      setNeedsPin(false);
    } catch {
      setError("Failed to load document.");
    }
    setLoading(false);
  };

  useEffect(() => {
    params.then(p => {
      setShareId(p.id);
      fetchShare(p.id);
    });
  }, [params]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity: 0.2, marginBottom: 12 }}>
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="currentColor" opacity="0.15" />
          </svg>
          <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#b5b2a9" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (needsPin) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#fff" }}>
        <div style={{ textAlign: "center", maxWidth: 300 }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity: 0.3, marginBottom: 16 }}>
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="currentColor" opacity="0.15" />
          </svg>
          <div style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#2c2a25", marginBottom: 8 }}>Protected Document</div>
          <div style={{ fontSize: 14, color: "#7d7a72", marginBottom: 20 }}>Enter the PIN to view this document.</div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchShare(shareId, pin)}
              style={{ flex: 1, padding: "10px 14px", border: "1px solid #e5e2db", borderRadius: 6, fontSize: 14, outline: "none", textAlign: "center", letterSpacing: "0.2em", fontFamily: "var(--font-mono), monospace" }}
            />
            <button
              onClick={() => fetchShare(shareId, pin)}
              style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: "#b07d4f", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            >
              View
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh", background: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ opacity: 0.2, marginBottom: 12 }}>
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <div style={{ fontFamily: "var(--font-heading), 'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: "#2c2a25", marginBottom: 6 }}>{error}</div>
          <div style={{ fontSize: 13, color: "#9b988f" }}>Contact the person who shared this link.</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <ShareView
      projectName={data.projectName}
      clientName={data.clientName}
      clientAvatar={data.clientAvatar}
      clientColor={data.clientColor}
      blocks={data.blocks as import("@/lib/types").Block[]}
      createdAt={data.createdAt}
    />
  );
}
