"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          height: "100%", padding: 40, fontFamily: "var(--font-outfit), -apple-system, sans-serif",
          background: "var(--parchment, #faf9f7)", color: "var(--ink-600, #65625a)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: "rgba(194,75,56,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 16, color: "#c24b38", fontSize: 20, fontWeight: 700,
            fontFamily: "var(--mono, monospace)",
          }}>!</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink-800, #3d3a33)", marginBottom: 4 }}>
            Something went wrong
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-400, #9b988f)", marginBottom: 20, textAlign: "center", maxWidth: 320 }}>
            {this.state.error?.message || "An unexpected error occurred"}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "8px 20px", borderRadius: 6, border: "1px solid var(--warm-200, #e5e2db)",
              background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500,
              fontFamily: "inherit", color: "var(--ink-600, #65625a)", transition: "all 0.1s",
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = "var(--ember, #b07d4f)"; (e.target as HTMLElement).style.color = "var(--ember, #b07d4f)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = "var(--warm-200, #e5e2db)"; (e.target as HTMLElement).style.color = "var(--ink-600, #65625a)"; }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
