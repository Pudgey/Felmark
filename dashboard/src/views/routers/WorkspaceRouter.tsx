"use client";

import WorkspaceView from "../workspace";

export default function WorkspaceRouter() {
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex" }}>
      <WorkspaceView />
    </div>
  );
}
