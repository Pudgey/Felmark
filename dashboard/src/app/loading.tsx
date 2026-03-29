export default function Loading() {
  return (
    <div style={{ display: "flex", height: "100dvh", background: "#faf9f7" }}>
      {/* Rail skeleton */}
      <div style={{ width: 48, background: "#353330", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0", gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.04)", marginTop: 8 }} />
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
        <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
      </div>

      {/* Sidebar skeleton */}
      <div style={{ width: 260, background: "#f2f1ed", borderRight: "1px solid rgba(0,0,0,0.05)", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Title */}
        <div className="skel" style={{ width: 80, height: 10, borderRadius: 3 }} />

        {/* Stats */}
        <div style={{ display: "flex", gap: 6 }}>
          <div className="skel" style={{ flex: 1, height: 52, borderRadius: 8 }} />
          <div className="skel" style={{ flex: 1, height: 52, borderRadius: 8 }} />
          <div className="skel" style={{ flex: 1, height: 52, borderRadius: 8 }} />
        </div>

        {/* Search */}
        <div className="skel" style={{ height: 32, borderRadius: 6 }} />

        {/* Workspace items */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <div className="skel" style={{ width: 24, height: 24, borderRadius: 5, flexShrink: 0 }} />
            <div className="skel" style={{ flex: 1, height: 12, borderRadius: 3 }} />
            <div className="skel" style={{ width: 20, height: 16, borderRadius: 8 }} />
          </div>
        ))}
      </div>

      {/* Editor skeleton */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Tab bar */}
        <div style={{ height: 38, background: "#f7f6f3", borderBottom: "1px solid #e5e2db", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
          <div className="skel" style={{ width: 32, height: 24, borderRadius: 4 }} />
          <div className="skel" style={{ width: 140, height: 24, borderRadius: 4 }} />
          <div className="skel" style={{ width: 100, height: 24, borderRadius: 4 }} />
        </div>

        {/* Editor content */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: 480, width: "100%", padding: "0 40px" }}>
            {/* Greeting skeleton */}
            <div className="skel" style={{ width: 240, height: 28, borderRadius: 4, marginBottom: 20 }} />

            {/* Stat lines */}
            <div className="skel" style={{ width: 60, height: 8, borderRadius: 3, marginBottom: 10 }} />
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                <div className="skel" style={{ width: 140, height: 10, borderRadius: 3 }} />
                <div className="skel" style={{ width: 40, height: 10, borderRadius: 3 }} />
              </div>
            ))}

            <div style={{ height: 16 }} />
            <div className="skel" style={{ width: 60, height: 8, borderRadius: 3, marginBottom: 10 }} />
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 6 }}>
                <div className="skel" style={{ width: 140, height: 10, borderRadius: 3 }} />
                <div className="skel" style={{ width: 60, height: 10, borderRadius: 3 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Command bar */}
        <div style={{ height: 36, background: "#f7f6f3", borderTop: "1px solid #e5e2db", display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
          <div className="skel" style={{ width: 12, height: 12, borderRadius: 3 }} />
          <div className="skel" style={{ flex: 1, height: 12, borderRadius: 3 }} />
        </div>
      </div>

      <style>{`
        .skel {
          background: linear-gradient(90deg, #f0eee9 25%, #e5e2db 50%, #f0eee9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
