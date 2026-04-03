"use client";

import WorkspaceSidebar from "@/components/workspace/sidebar/WorkspaceSidebar";
import SplitPanes from "@/components/workspace/panes/SplitPanes";

export default function WorkspaceRouter() {
  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex" }}>
      <WorkspaceSidebar />
      <SplitPanes />
    </div>
  );
}
