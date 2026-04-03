"use client";

import Terminal from "../Terminal";
import TerminalProvider from "../TerminalProvider";
import { useSharedTerminal } from "./SharedTerminalProvider";

export default function WorkspaceTerminalMount() {
  const {
    sessionState,
    setSessionState,
    workstations,
    onOpenWorkstation,
  } = useSharedTerminal();

  return (
    <TerminalProvider
      workstations={workstations}
      activeProject=""
      editorBlocks={[]}
      onOpenWorkstation={onOpenWorkstation}
      sessionState={sessionState}
      onSessionStateChange={setSessionState}
    >
      <Terminal />
    </TerminalProvider>
  );
}
