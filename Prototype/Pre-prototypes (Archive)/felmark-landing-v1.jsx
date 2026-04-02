import { useState, useEffect, useRef } from "react";

export default function FelmarkLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible((prev) => ({ ...prev, [entry.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, []);

  const registerSection = (key) => (el) => {
    if (el) {
      el.dataset.section = key;
      sectionRefs.current[key] = el;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --stone-950: #0f0f0e;
          --stone-900: #171715;
          --stone-850: #1c1c19;
          --stone-800: #232320;
          --stone-700: #2e2e2a;
          --stone-600: #3d3d37;
          --stone-500: #5c5c53;
          --stone-400: #7a7a6f;
          --stone-300: #a3a396;
          --stone-200: #c4c4b8;
          --stone-100: #e4e4da;
          --ember: #c8956c;
          --ember-dim: #a07450;
          --ember-glow: #d4a574;
        }

        body {
          background: var(--stone-950);
          color: var(--stone-300);
          font-family: 'Outfit', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ── Noise texture overlay ── */
        .noise {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px;
        }

        /* ── Nav ── */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 48px;
          backdrop-filter: blur(20px);
          background: rgba(15,15,14,0.7);
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logo-mark {
          width: 28px;
          height: 28px;
        }

        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--stone-100);
          letter-spacing: 0.04em;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-size: 13px;
          font-weight: 400;
          color: var(--stone-400);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }

        .nav-link:hover { color: var(--stone-200); }

        .nav-cta {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--stone-950);
          background: var(--stone-100);
          padding: 8px 20px;
          border-radius: 4px;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .nav-cta:hover { background: #fff; }

        /* ── Hero ── */
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 24px 80px;
          position: relative;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(200,149,108,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ember-dim);
          border: 1px solid rgba(200,149,108,0.15);
          padding: 6px 16px;
          border-radius: 2px;
          margin-bottom: 40px;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.2s forwards;
        }

        .hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 300;
          color: var(--stone-100);
          line-height: 1.05;
          letter-spacing: -0.02em;
          max-width: 800px;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.4s forwards;
        }

        .hero h1 em {
          font-style: italic;
          color: var(--ember);
        }

        .hero-sub {
          font-size: 17px;
          font-weight: 300;
          color: var(--stone-400);
          line-height: 1.65;
          max-width: 480px;
          margin-top: 28px;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.6s forwards;
        }

        .hero-form {
          display: flex;
          gap: 8px;
          margin-top: 44px;
          opacity: 0;
          animation: fadeUp 0.8s ease 0.8s forwards;
        }

        .hero-input {
          width: 280px;
          padding: 12px 18px;
          border: 1px solid var(--stone-700);
          border-radius: 4px;
          background: var(--stone-900);
          color: var(--stone-200);
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .hero-input:focus { border-color: var(--stone-500); }
        .hero-input::placeholder { color: var(--stone-600); }

        .hero-btn {
          padding: 12px 28px;
          background: var(--ember);
          color: var(--stone-950);
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: all 0.2s;
        }

        .hero-btn:hover { background: var(--ember-glow); }

        .hero-note {
          font-size: 12px;
          color: var(--stone-600);
          margin-top: 14px;
          opacity: 0;
          animation: fadeUp 0.8s ease 1s forwards;
        }

        .hero-confirmed {
          margin-top: 44px;
          padding: 14px 28px;
          background: rgba(200,149,108,0.06);
          border: 1px solid rgba(200,149,108,0.12);
          border-radius: 4px;
          color: var(--ember);
          font-size: 14px;
          font-weight: 400;
          opacity: 0;
          animation: fadeUp 0.5s ease forwards;
        }

        .scroll-line {
          position: absolute;
          bottom: 40px;
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, var(--stone-700), transparent);
          opacity: 0;
          animation: fadeUp 0.8s ease 1.2s forwards;
        }

        /* ── Divider ── */
        .divider {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--stone-800), transparent);
        }

        /* ── Philosophy ── */
        .philosophy {
          padding: 120px 48px;
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
        }

        .section-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--stone-600);
          margin-bottom: 28px;
        }

        .philosophy h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 400;
          color: var(--stone-200);
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .philosophy p {
          font-size: 15.5px;
          font-weight: 300;
          color: var(--stone-400);
          line-height: 1.75;
          margin-top: 24px;
        }

        /* ── Pillars ── */
        .pillars {
          padding: 80px 48px 120px;
          max-width: 1080px;
          margin: 0 auto;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--stone-800);
          border: 1px solid var(--stone-800);
          border-radius: 6px;
          overflow: hidden;
        }

        .pillar {
          background: var(--stone-900);
          padding: 44px 36px;
          transition: background 0.3s;
        }

        .pillar:hover { background: var(--stone-850); }

        .pillar-icon {
          width: 36px;
          height: 36px;
          border: 1px solid var(--stone-700);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          color: var(--ember-dim);
        }

        .pillar h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--stone-200);
          margin-bottom: 10px;
        }

        .pillar p {
          font-size: 13.5px;
          font-weight: 300;
          color: var(--stone-500);
          line-height: 1.65;
        }

        /* ── Features ── */
        .features {
          padding: 120px 48px;
          max-width: 900px;
          margin: 0 auto;
        }

        .feature-row {
          display: flex;
          align-items: flex-start;
          gap: 48px;
          padding: 40px 0;
          border-bottom: 1px solid var(--stone-800);
        }

        .feature-row:last-child { border-bottom: none; }

        .feature-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 300;
          color: var(--stone-800);
          line-height: 1;
          flex-shrink: 0;
          width: 56px;
        }

        .feature-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: var(--stone-200);
          margin-bottom: 8px;
        }

        .feature-content p {
          font-size: 14px;
          font-weight: 300;
          color: var(--stone-500);
          line-height: 1.65;
        }

        .feature-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ember-dim);
          background: rgba(200,149,108,0.06);
          border: 1px solid rgba(200,149,108,0.1);
          padding: 3px 10px;
          border-radius: 2px;
          margin-top: 12px;
        }

        /* ── Pricing ── */
        .pricing {
          padding: 120px 48px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .price-display {
          font-family: 'Cormorant Garamond', serif;
          font-size: 72px;
          font-weight: 300;
          color: var(--stone-100);
          line-height: 1;
          margin: 28px 0 8px;
        }

        .price-note {
          font-size: 15px;
          font-weight: 300;
          color: var(--stone-500);
          margin-bottom: 16px;
        }

        .price-detail {
          font-size: 13px;
          font-weight: 300;
          color: var(--stone-600);
          line-height: 1.7;
          max-width: 400px;
          margin: 0 auto;
        }

        /* ── Final CTA ── */
        .final-cta {
          padding: 120px 48px 160px;
          text-align: center;
        }

        .final-cta h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 300;
          color: var(--stone-200);
          line-height: 1.15;
          max-width: 600px;
          margin: 0 auto 36px;
        }

        .final-cta h2 em {
          font-style: italic;
          color: var(--ember);
        }

        /* ── Footer ── */
        footer {
          padding: 40px 48px;
          border-top: 1px solid var(--stone-800);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-left {
          font-size: 12px;
          color: var(--stone-600);
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-link {
          font-size: 12px;
          color: var(--stone-600);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-link:hover { color: var(--stone-400); }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          nav { padding: 16px 20px; }
          .nav-links { display: none; }
          .hero { padding: 100px 20px 60px; }
          .hero-form { flex-direction: column; align-items: center; }
          .hero-input { width: 100%; max-width: 320px; }
          .pillars-grid { grid-template-columns: 1fr; }
          .feature-row { flex-direction: column; gap: 16px; }
          .feature-num { width: auto; }
          .philosophy, .features, .pricing, .final-cta { padding-left: 20px; padding-right: 20px; }
          footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      <div className="noise" />

      {/* ═══ NAV ═══ */}
      <nav>
        <a href="#" className="nav-logo">
          <svg className="logo-mark" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.2" fill="none" style={{ color: "var(--ember)" }} />
            <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="var(--ember)" opacity="0.15" />
            <path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="var(--ember)" strokeWidth="0.8" />
          </svg>
          <span className="logo-text">Felmark</span>
        </a>
        <div className="nav-links">
          <a href="#philosophy" className="nav-link">Philosophy</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <button className="nav-cta" onClick={() => document.getElementById("waitlist").scrollIntoView({ behavior: "smooth" })}>Join Waitlist</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-badge">Coming 2026</div>
        <h1>Leave your <em>mark</em></h1>
        <p className="hero-sub">
          The free-forever workspace where freelancers build, manage, and grow their business. No subscriptions. No walls. Just work.
        </p>

        {!submitted ? (
          <>
            <form className="hero-form" onSubmit={handleSubmit}>
              <input
                className="hero-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="hero-btn" type="submit">Get Early Access</button>
            </form>
            <p className="hero-note">Free forever. No credit card. No catch.</p>
          </>
        ) : (
          <div className="hero-confirmed">
            You're on the list. We'll be in touch.
          </div>
        )}

        <div className="scroll-line" />
      </section>

      {/* ═══ PHILOSOPHY ═══ */}
      <div className="divider" />
      <section className="philosophy" id="philosophy" ref={registerSection("phil")} >
        <div className={`reveal ${visible.phil ? "visible" : ""}`}>
          <div className="section-label">Philosophy</div>
          <h2>Your tools should earn your trust before they earn your money</h2>
          <p>
            HoneyBook charges $39/month before you land your first client. We think that's backwards. Build your entire business on Felmark — proposals, contracts, invoices, client management — and pay nothing until you're ready. When money moves, we take a small cut. Your success is our success.
          </p>
        </div>
      </section>

      {/* ═══ PILLARS ═══ */}
      <section className="pillars" ref={registerSection("pillars")}>
        <div className={`pillars-grid reveal ${visible.pillars ? "visible" : ""}`}>
          <div className="pillar">
            <div className="pillar-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3h12v12H3z" stroke="currentColor" strokeWidth="1.2" /><path d="M3 7h12M7 3v12" stroke="currentColor" strokeWidth="0.8" /></svg>
            </div>
            <h3>Block-based workspace</h3>
            <p>Every note, proposal, and deliverable is a block you can drag, link, and reference. Build your business like building with stone — piece by piece.</p>
          </div>
          <div className="pillar">
            <div className="pillar-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" /></svg>
            </div>
            <h3>Client workspaces</h3>
            <p>Each client gets their own workspace with projects, notes, contracts, and invoices. Switch between clients like switching between worlds.</p>
          </div>
          <div className="pillar">
            <div className="pillar-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" /><path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3>Payments built in</h3>
            <p>Send an invoice. Get paid. No third-party apps, no copy-pasting. Payment processing lives inside the workspace, not bolted on.</p>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <div className="divider" />
      <section className="features" id="features" ref={registerSection("feat")}>
        <div className={`reveal ${visible.feat ? "visible" : ""}`}>
          <div className="section-label" style={{ marginBottom: 48 }}>What you get for free</div>
        </div>

        <div className={`feature-row reveal reveal-delay-1 ${visible.feat ? "visible" : ""}`}>
          <div className="feature-num">01</div>
          <div className="feature-content">
            <h3>Proposals that close</h3>
            <p>Write proposals inside the same editor where you take notes. Drag in scope blocks, pricing tables, and timelines. Send a link. Client signs. Done.</p>
            <span className="feature-tag">Free forever</span>
          </div>
        </div>

        <div className={`feature-row reveal reveal-delay-2 ${visible.feat ? "visible" : ""}`}>
          <div className="feature-num">02</div>
          <div className="feature-content">
            <h3>Contracts with e-signature</h3>
            <p>Templates that protect you. Customize once, reuse forever. Clients sign from their phone in thirty seconds.</p>
            <span className="feature-tag">Free forever</span>
          </div>
        </div>

        <div className={`feature-row reveal reveal-delay-3 ${visible.feat ? "visible" : ""}`}>
          <div className="feature-num">03</div>
          <div className="feature-content">
            <h3>Invoicing and payments</h3>
            <p>Generate invoices from project data already in your workspace. Accept card, bank transfer, or ACH. You pay nothing until your client pays you.</p>
            <span className="feature-tag">2.9% when money moves</span>
          </div>
        </div>

        <div className={`feature-row reveal reveal-delay-1 ${visible.feat ? "visible" : ""}`}>
          <div className="feature-num">04</div>
          <div className="feature-content">
            <h3>AI that knows your business</h3>
            <p>Draft proposals from past projects. Summarize client conversations. Generate scope documents from a three-line brief. The AI reads your workspace, not the internet.</p>
            <span className="feature-tag">Free forever</span>
          </div>
        </div>

        <div className={`feature-row reveal reveal-delay-2 ${visible.feat ? "visible" : ""}`}>
          <div className="feature-num">05</div>
          <div className="feature-content">
            <h3>Client portal</h3>
            <p>Your clients see what you want them to see — project status, deliverables, invoices. No more "just checking in" emails.</p>
            <span className="feature-tag">Free forever</span>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <div className="divider" />
      <section className="pricing" id="pricing" ref={registerSection("price")}>
        <div className={`reveal ${visible.price ? "visible" : ""}`}>
          <div className="section-label">Pricing</div>
          <div className="price-display">$0</div>
          <div className="price-note">Free forever. Not a trial.</div>
          <p className="price-detail">
            Every core feature — workspaces, proposals, contracts, invoicing, AI — is free. When a client pays you through Felmark, we take 2.9%. That's it. You succeed, we succeed.
          </p>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <div className="divider" />
      <section className="final-cta" id="waitlist" ref={registerSection("final")}>
        <div className={`reveal ${visible.final ? "visible" : ""}`}>
          <h2>Built for freelancers who are <em>done</em> paying for permission to work</h2>

          {!submitted ? (
            <>
              <form className="hero-form" onSubmit={handleSubmit} style={{ justifyContent: "center", opacity: 1, animation: "none" }}>
                <input
                  className="hero-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="hero-btn" type="submit">Join the Waitlist</button>
              </form>
              <p className="hero-note" style={{ opacity: 1, animation: "none" }}>We'll email you once, when it's ready. Nothing else.</p>
            </>
          ) : (
            <div className="hero-confirmed" style={{ display: "inline-block", opacity: 1, animation: "none" }}>
              You're on the list. We'll be in touch.
            </div>
          )}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-left">© 2026 Felmark</div>
        <div className="footer-links">
          <a href="#" className="footer-link">Twitter</a>
          <a href="#" className="footer-link">GitHub</a>
          <a href="mailto:hello@tryfelmark.com" className="footer-link">Contact</a>
        </div>
      </footer>
    </>
  );
}
