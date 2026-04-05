"use client";

import { useEffect, useRef } from "react";
import { useTerminalContext } from "../TerminalProvider";
import { COMMAND_REGISTRY } from "@/lib/terminal/commands";
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
  const { blocks } = useTerminalContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [blocks]);

  if (blocks.length === 0) {
    const commandNames = Object.keys(COMMAND_REGISTRY);
    return (
      <div className={styles.container} ref={scrollRef}>
        <div className={styles.welcome}>
          <div className={styles.welcomeTitle}>Felmark Terminal</div>
          <div className={styles.welcomeDesc}>Type a slash command or ask a question in natural language.</div>
          <div className={styles.welcomeCommands}>
            {commandNames.map((name) => (
              <span key={name} className={styles.commandTag}>
                /{name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} ref={scrollRef}>
      {blocks.map((block) => (
        <div key={block.id} className={blockStyle(block.type)}>
          {block.type === "command" && <span className={styles.prompt}>&gt; </span>}
          {block.type === "command" ? block.command : null}
          {block.type === "loading" && <span className={styles.dots}>thinking...</span>}
          {block.type !== "command" && block.type !== "loading" && block.content}
          {block.type === "nl-response" && block.nlData && <div className={styles.nlText}>{block.nlData.text}</div>}
        </div>
      ))}
    </div>
  );
}
