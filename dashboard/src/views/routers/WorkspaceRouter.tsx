"use client";

import { useEffect } from "react";

interface WorkspaceRouterProps {
  onNavigateHome: () => void;
}

export default function WorkspaceRouter({ onNavigateHome }: WorkspaceRouterProps) {
  useEffect(() => {
    onNavigateHome();
  }, [onNavigateHome]);

  return null;
}
