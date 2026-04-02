"use client";

import { useState } from "react";
import type { RenderBlock } from "../types";
import styles from "./ChatBlock.module.css";

interface Message {
  sender: string;
  text: string;
  time: string;
  sent: boolean;
  isNew?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { sender: "You", text: "I'll have the revised color palette ready by end of day.", time: "2:14 PM", sent: true },
  { sender: "Sarah", text: "That works! Can you also include the dark mode variants?", time: "2:16 PM", sent: false, isNew: true },
  { sender: "You", text: "Already on it. I'll package both in the handoff.", time: "2:18 PM", sent: true },
  { sender: "Sarah", text: "Perfect, thank you!", time: "2:19 PM", sent: false, isNew: true },
];

export default function ChatBlock({ block: _block }: { block: RenderBlock }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { sender: "You", text, time: "Now", sent: true },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.avatar} style={{ background: "#7c8594" }}>M</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>Meridian Studio</div>
          <div className={styles.headerStatus}>
            <span className={styles.onlineDot} />
            Online
          </div>
        </div>
        <button className={styles.expandBtn}>Expand</button>
      </div>

      <div className={styles.messages}>
        {[...messages].reverse().map((m, i) => (
          <div
            key={i}
            className={`${styles.msg} ${m.sent ? styles.msgSent : styles.msgReceived}`}
          >
            <div className={styles.msgRow}>
              {!m.sent && (
                <div className={styles.msgAvatar} style={{ background: "#7c8594" }}>
                  S
                </div>
              )}
              <div
                className={`${styles.bubble} ${m.sent ? styles.bubbleSent : styles.bubbleReceived}`}
              >
                {m.text}
              </div>
            </div>
            <div className={styles.msgMeta}>
              <span className={styles.msgSender}>{m.sender}</span>
              <span className={styles.msgTime}>{m.time}</span>
              {m.isNew && <span className={styles.msgNew}>New</span>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.inputBar}>
        <input
          className={styles.input}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`${styles.sendBtn} ${input.trim() ? styles.sendBtnActive : ""}`}
          onClick={handleSend}
        >
          {"\u2191"}
        </button>
      </div>
    </div>
  );
}
