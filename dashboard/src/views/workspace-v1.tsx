"use client";

import Canvas from "@/components/workspace/canvas/Canvas";
import WorkspaceSidebar from "@/components/workspace/sidebar/WorkspaceSidebar";

export default function WorkspaceView() {
  return (
    <div style={{ display: "flex", flex: 1, width: "100%", minWidth: 0, height: "100%", overflow: "hidden" }}>
      <WorkspaceSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Canvas />
      </div>
    </div>
  );
}
