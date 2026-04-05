"use client";

import { useState, useCallback } from "react";
import { useSharedTerminal } from "../mounts/SharedTerminalProvider";
import TerminalProvider from "../TerminalProvider";
import TerminalOutput from "./TerminalOutput";
import TerminalInput from "./TerminalInput";
import TerminalPreview from "./TerminalPreview";
import styles from "./TerminalSurface.module.css";

export default function TerminalSurface() {
  const { sessionState, setSessionState, workstations, onOpenWorkstation } = useSharedTerminal();

  const [currentInput, setCurrentInput] = useState("");

  const handleTypeCommand = useCallback((cmd: string) => {
    setCurrentInput(cmd);
  }, []);

  return (
    <TerminalProvider
      workstations={workstations}
      activeProject=""
      editorBlocks={[]}
      onOpenWorkstation={onOpenWorkstation}
      sessionState={sessionState}
      onSessionStateChange={setSessionState}
    >
      <div className={styles.surface}>
        <div className={styles.terminalPane}>
          <div className={styles.terminalWindow}>
            <div className={styles.terminalChrome}>
              <span className={`${styles.chromeDot} ${styles.chromeDotRed}`} />
              <span className={`${styles.chromeDot} ${styles.chromeDotYellow}`} />
              <span className={`${styles.chromeDot} ${styles.chromeDotGreen}`} />
              <span className={styles.chromeTitle}>felmark terminal</span>
            </div>
            <TerminalOutput />
            <TerminalInput currentInput={currentInput} onInputChange={setCurrentInput} />
          </div>
        </div>
        <div className={styles.previewPane}>
          <TerminalPreview currentInput={currentInput} onTypeCommand={handleTypeCommand} />
        </div>
      </div>
    </TerminalProvider>
  );
}
