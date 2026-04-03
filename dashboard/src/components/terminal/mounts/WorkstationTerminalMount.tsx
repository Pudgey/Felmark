"use client";

import type { Block } from "@/lib/types";
import Terminal from "../Terminal";
import TerminalProvider from "../TerminalProvider";
import { useSharedTerminal } from "./SharedTerminalProvider";

interface WorkstationTerminalMountProps {
  editorBlocks: Block[];
  onClose?: () => void;
}

export default function WorkstationTerminalMount({ editorBlocks, onClose }: WorkstationTerminalMountProps) {
  const {
    sessionState,
    setSessionState,
    workstations,
    activeProject,
    onOpenWorkstation,
  } = useSharedTerminal();

  return (
    <TerminalProvider
      workstations={workstations}
      activeProject={activeProject}
      editorBlocks={editorBlocks}
      onOpenWorkstation={onOpenWorkstation}
      sessionState={sessionState}
      onSessionStateChange={setSessionState}
    >
      <Terminal onClose={onClose} />
    </TerminalProvider>
  );
}
