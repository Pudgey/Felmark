"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTerminalContext } from "../TerminalProvider";
import WelcomeSetup from "../debrief/WelcomeSetup";
import DebriefAgenda from "../debrief/DebriefAgenda";
import DebriefPulse from "../debrief/DebriefPulse";
import styles from "./TerminalOutput.module.css";

function blockStyle(type: string): string {
  switch (type) {
    case "command":
      return styles.command;
    case "error":
      return styles.error;
    case "whisper":
      return styles.whisper;
    case "nudge":
      return styles.nudge;
    case "alert":
      return styles.alert;
    case "loading":
      return styles.loading;
    case "nl-response":
      return styles.nlResponse;
    default:
      return styles.output;
  }
}

export default function TerminalOutput() {
  const { blocks, executeCommand } = useTerminalContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [blocks]);

  const handleRunCommand = useCallback(
    (cmd: string) => {
      executeCommand(cmd);
    },
    [executeCommand],
  );

  if (blocks.length === 0) {
    const welcomed =
      typeof window !== "undefined" &&
      localStorage.getItem("felmark_terminal_welcomed") === "true";
    const today = new Date().toISOString().slice(0, 10);
    const lastDebrief =
      typeof window !== "undefined"
        ? localStorage.getItem("felmark_terminal_last_debrief")
        : null;

    if (!welcomed) {
      return (
        <div className={styles.container} ref={scrollRef}>
          <WelcomeSetup onRunCommand={handleRunCommand} />
        </div>
      );
    }

    if (lastDebrief === today) {
      return (
        <div className={styles.container} ref={scrollRef}>
          <DebriefPulse onRunCommand={handleRunCommand} />
        </div>
      );
    }

    // First visit today
    if (typeof window !== "undefined") {
      localStorage.setItem("felmark_terminal_last_debrief", today);
    }

    return (
      <div className={styles.container} ref={scrollRef}>
        <DebriefAgenda onRunCommand={handleRunCommand} />
      </div>
    );
  }

  return (
    <div className={styles.container} ref={scrollRef}>
      {blocks.map((block) => (
        <div key={block.id} className={blockStyle(block.type)}>
          {block.type === "command" && (
            <span className={styles.prompt}>&gt; </span>
          )}
          {block.type === "command" ? block.command : null}
          {block.type === "loading" && (
            <span className={styles.dots}>thinking...</span>
          )}
          {block.type !== "command" && block.type !== "loading" && block.content}
          {block.type === "nl-response" && block.nlData && (
            <div className={styles.nlText}>{block.nlData.text}</div>
          )}
        </div>
      ))}
    </div>
  );
}
