"use client";

import Canvas from "@/components/workspace/canvas/Canvas";
import WorkspaceSidebar from "@/components/workspace/sidebar/WorkspaceSidebar";

export default function WorkspaceView() {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <WorkspaceSidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Canvas />
      </div>
    </div>
  );
}
