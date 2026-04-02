import { useState, useEffect, useRef } from "react";

function useOnScreen(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [ref, threshold]);
  return visible;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref, 0.1);
  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [email2, setEmail2] = useState("");
  const [submitted2, setSubmitted2] = useState(false);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const submit = (e, which) => {
    e.preventDefault();
    if (which === 1 && email.includes("@")) setSubmitted(true);
    if (which === 2 && email2.includes("@")) setSubmitted2(true);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
        }
        html { scroll-behavior: smooth; }

        .lp { font-family: 'Outfit', sans-serif; font-size: 16px; color: var(--ink-700); background: var(--parchment); overflow-x: hidden; }

        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* ── Nav ── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 48px; transition: all 0.3s;
          background: rgba(250,249,247,0.8); backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled { border-bottom-color: var(--warm-200); }
        .nav-logo {
          font-family: 'Cormorant Garamond', serif; font-size: 22px;
          font-weight: 600; color: var(--ink-900); display: flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .nav-links { display: flex; align-items: center; gap: 24px; }
        .nav-link { font-size: 14px; color: var(--ink-500); text-decoration: none; transition: color 0.1s; }
        .nav-link:hover { color: var(--ink-800); }
        .nav-cta {
          padding: 8px 20px; border-radius: 6px; background: var(--ember);
          color: #fff; font-size: 14px; font-weight: 500; text-decoration: none;
          border: none; cursor: pointer; font-family: inherit; transition: background 0.1s;
        }
        .nav-cta:hover { background: var(--ember-light); }

        /* ── Hero ── */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 120px 48px 80px; text-align: center; position: relative;
        }
        .hero-badge {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          color: var(--ember); letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
        }
        .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ember); animation: pulse 2s ease infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }

        .hero h1 {
          font-family: 'Cormorant Garamond', serif; font-size: 72px;
          font-weight: 500; color: var(--ink-900); line-height: 1.08;
          letter-spacing: -0.03em; max-width: 800px; margin-bottom: 20px;
        }
        .hero h1 em { font-style: italic; color: var(--ember); }
        .hero-sub { font-size: 19px; color: var(--ink-500); max-width: 520px; line-height: 1.6; margin-bottom: 36px; font-weight: 300; }

        .hero-form { display: flex; gap: 8px; width: 100%; max-width: 420px; }
        .hero-input {
          flex: 1; padding: 14px 18px; border: 1px solid var(--warm-300);
          border-radius: 8px; font-family: inherit; font-size: 15px;
          color: var(--ink-800); outline: none; background: #fff;
        }
        .hero-input:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .hero-input::placeholder { color: var(--warm-400); }
        .hero-submit {
          padding: 14px 28px; border-radius: 8px; border: none;
          background: var(--ink-900); color: #fff; font-size: 15px;
          font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.1s; flex-shrink: 0;
        }
        .hero-submit:hover { background: var(--ink-800); }
        .hero-success { font-family: var(--mono); font-size: 13px; color: #5a9a3c; display: flex; align-items: center; gap: 6px; }
        .hero-note { font-size: 13px; color: var(--ink-300); margin-top: 12px; }
        .hero-note strong { color: var(--ink-500); font-weight: 500; }

        .hero-scroll {
          position: absolute; bottom: 32px;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: var(--ink-300); font-size: 11px; font-family: var(--mono);
          animation: float 2s ease infinite;
        }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }

        /* ── Philosophy ── */
        .phil { padding: 120px 48px; max-width: 900px; margin: 0 auto; }
        .sec-label { font-family: var(--mono); font-size: 10px; color: var(--ember); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 16px; }
        .phil-headline {
          font-family: 'Cormorant Garamond', serif; font-size: 44px;
          font-weight: 500; color: var(--ink-900); line-height: 1.2;
          letter-spacing: -0.02em; margin-bottom: 28px; max-width: 700px;
        }
        .phil-body { font-size: 17px; color: var(--ink-500); line-height: 1.8; max-width: 600px; }
        .phil-body strong { color: var(--ink-800); font-weight: 500; }

        .phil-callout {
          margin-top: 40px; padding: 28px 32px;
          background: var(--ink-900); border-radius: 12px;
          font-family: 'Cormorant Garamond', serif; font-size: 24px;
          font-style: italic; color: rgba(255,255,255,0.7); line-height: 1.5;
        }
        .phil-callout em { color: var(--ember-light); }
        .phil-callout-attr {
          font-family: var(--mono); font-size: 10px; font-style: normal;
          color: rgba(255,255,255,0.25); margin-top: 12px; display: block; letter-spacing: 0.06em;
        }

        /* ── Pillars ── */
        .pillars { padding: 80px 48px 120px; max-width: 1000px; margin: 0 auto; }
        .pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
        .pillar {
          padding: 32px 28px; border: 1px solid var(--warm-200);
          border-radius: 12px; transition: all 0.2s; background: #fff;
        }
        .pillar:hover { border-color: var(--warm-300); box-shadow: 0 4px 20px rgba(0,0,0,0.03); transform: translateY(-2px); }
        .pillar-icon {
          width: 44px; height: 44px; border-radius: 10px;
          background: var(--ember-bg); border: 1px solid rgba(176,125,79,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; color: var(--ember); margin-bottom: 16px;
        }
        .pillar-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); margin-bottom: 8px; }
        .pillar-desc { font-size: 14px; color: var(--ink-500); line-height: 1.6; }

        /* ── Features ── */
        .features { padding: 80px 48px 120px; max-width: 900px; margin: 0 auto; }
        .feat-headline {
          font-family: 'Cormorant Garamond', serif; font-size: 40px;
          font-weight: 500; color: var(--ink-900); line-height: 1.2;
          margin-bottom: 48px; max-width: 600px;
        }
        .feat {
          display: flex; gap: 20px; padding: 28px 0;
          border-bottom: 1px solid var(--warm-100); align-items: flex-start;
        }
        .feat:last-child { border-bottom: none; }
        .feat-num { font-family: var(--mono); font-size: 12px; color: var(--warm-300); flex-shrink: 0; padding-top: 4px; width: 28px; }
        .feat-body { flex: 1; }
        .feat-title { font-size: 18px; font-weight: 500; color: var(--ink-900); margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
        .feat-desc { font-size: 14px; color: var(--ink-500); line-height: 1.6; }
        .feat-tag {
          font-family: var(--mono); font-size: 9px; color: #5a9a3c;
          background: rgba(90,154,60,0.06); padding: 2px 7px; border-radius: 3px;
          border: 1px solid rgba(90,154,60,0.1); font-weight: 500; letter-spacing: 0.04em;
        }

        /* ── Pricing ── */
        .pricing {
          padding: 120px 48px; text-align: center;
          background: var(--warm-50); border-top: 1px solid var(--warm-200);
          border-bottom: 1px solid var(--warm-200);
        }
        .pricing-headline { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 500; color: var(--ink-900); margin-bottom: 12px; }
        .pricing-sub { font-size: 17px; color: var(--ink-400); margin-bottom: 48px; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.6; }

        .pricing-card {
          max-width: 440px; margin: 0 auto; background: #fff;
          border: 1px solid var(--warm-200); border-radius: 16px;
          padding: 40px; text-align: left; box-shadow: 0 4px 24px rgba(0,0,0,0.03);
        }
        .pricing-amount { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
        .pricing-dollar { font-family: 'Cormorant Garamond', serif; font-size: 64px; font-weight: 600; color: var(--ink-900); line-height: 1; }
        .pricing-period { font-size: 16px; color: var(--ink-400); }
        .pricing-tagline { font-size: 15px; color: var(--ink-500); margin-bottom: 24px; }

        .pricing-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .pf { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--ink-600); }
        .pf-check { color: #5a9a3c; font-size: 14px; flex-shrink: 0; margin-top: 2px; }

        .pricing-divider { height: 1px; background: var(--warm-200); margin: 20px 0; }
        .pricing-note { font-family: var(--mono); font-size: 12px; color: var(--ink-400); margin-bottom: 24px; line-height: 1.6; }
        .pricing-note strong { color: var(--ember); font-weight: 500; }

        .pricing-cta {
          width: 100%; padding: 14px; border-radius: 8px; border: none;
          background: var(--ink-900); color: #fff; font-size: 16px;
          font-weight: 500; cursor: pointer; font-family: inherit; transition: background 0.1s;
        }
        .pricing-cta:hover { background: var(--ink-800); }

        /* ── Final CTA ── */
        .final { padding: 120px 48px; text-align: center; }
        .final-headline {
          font-family: 'Cormorant Garamond', serif; font-size: 48px;
          font-weight: 500; color: var(--ink-900); margin-bottom: 16px;
          line-height: 1.15; letter-spacing: -0.02em;
        }
        .final-headline em { font-style: italic; color: var(--ember); }
        .final-sub { font-size: 17px; color: var(--ink-400); margin-bottom: 32px; }
        .final-form { display: flex; gap: 8px; max-width: 420px; margin: 0 auto; }

        /* ── Footer ── */
        .foot {
          padding: 32px 48px; border-top: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: space-between;
          font-size: 13px; color: var(--ink-300);
        }
        .foot-logo { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--ink-800); display: flex; align-items: center; gap: 6px; }
        .foot-links { display: flex; gap: 20px; }
        .foot-link { color: var(--ink-400); text-decoration: none; font-size: 13px; }
        .foot-link:hover { color: var(--ink-600); }
      `}</style>

      <div className="lp">
        {/* Nav */}
        <nav className={`nav${scrollY > 40 ? " scrolled" : ""}`}>
          <a className="nav-logo" href="#">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="#b07d4f" strokeWidth="1.5"/><path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="#b07d4f" strokeWidth="1" opacity="0.5"/></svg>
            Felmark
          </a>
          <div className="nav-links">
            <a className="nav-link" href="#philosophy">Philosophy</a>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#pricing">Pricing</a>
            <button className="nav-cta">Join Waitlist</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <Reveal><div className="hero-badge"><span className="hero-badge-dot" /> Now accepting early access</div></Reveal>
          <Reveal delay={100}><h1>The workspace where freelancers <em>leave their mark</em></h1></Reveal>
          <Reveal delay={200}><p className="hero-sub">Proposals, invoices, projects, and payments — in one free-forever workspace that feels like a forge, not a spreadsheet.</p></Reveal>
          <Reveal delay={300}>
            {!submitted ? (
              <form className="hero-form" onSubmit={e => submit(e, 1)}>
                <input className="hero-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="hero-submit" type="submit">Join Waitlist</button>
              </form>
            ) : <div className="hero-success">✓ You're in. We'll be in touch.</div>}
          </Reveal>
          <Reveal delay={400}><p className="hero-note"><strong>Free forever.</strong> We only make money when you do — 2.9% when clients pay through Felmark.</p></Reveal>
          <div className="hero-scroll">scroll<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        </section>

        {/* Philosophy */}
        <section className="phil" id="philosophy">
          <Reveal><div className="sec-label">Philosophy</div></Reveal>
          <Reveal delay={100}><h2 className="phil-headline">Freelancers built the internet. Their tools should respect that.</h2></Reveal>
          <Reveal delay={200}>
            <p className="phil-body">
              HoneyBook charges <strong>$39/month</strong> before you've earned a dollar. Notion gives you blocks but no invoicing. Google Docs can't track a deadline. Wave does accounting but can't hold a proposal.
              <br /><br />
              You end up with <strong>seven tabs, three subscriptions, and a system that breaks the moment a client asks for a change order</strong>.
              <br /><br />
              Felmark is one workspace. Proposals, scope, timelines, invoices, contracts, and payments — together, where the work happens. Free forever.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="phil-callout">
              "We asked 200 freelancers what they'd pay for an all-in-one workspace. <em>68% said they currently pay nothing</em> — they cobble together free tools and hope nothing falls through the cracks."
              <span className="phil-callout-attr">— Felmark founding research, 2026</span>
            </div>
          </Reveal>
        </section>

        {/* Pillars */}
        <section className="pillars">
          <Reveal>
            <div className="pillars-grid">
              <div className="pillar">
                <div className="pillar-icon">✎</div>
                <div className="pillar-title">Write & Build</div>
                <div className="pillar-desc">Block editor for proposals, scopes, contracts, and notes. Smart blocks pull live data — revenue, deadlines, client messages — into your documents.</div>
              </div>
              <div className="pillar">
                <div className="pillar-icon">$</div>
                <div className="pillar-title">Invoice & Get Paid</div>
                <div className="pillar-desc">Send invoices in two clicks. Clients pay through Stripe. You see when they open, view, and pay — in real-time on The Wire.</div>
              </div>
              <div className="pillar">
                <div className="pillar-icon">◆</div>
                <div className="pillar-title">Track & Grow</div>
                <div className="pillar-desc">Project history with version control. Revenue landscape. Deadline pressure. Every metric a freelancer needs, none they don't.</div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Features */}
        <section className="features" id="features">
          <Reveal><div className="sec-label">Features</div><h2 className="feat-headline">Everything you need. Nothing you don't.</h2></Reveal>
          {[
            { t: "Terminal Welcome", d: "Open Felmark and it tells you what happened, what's due, what needs attention, and what to focus on. Like a morning briefing that writes itself." },
            { t: "Block Editor", d: "Notion-style blocks with Felmark superpowers. Type { to insert live data — revenue counters, deadline timers, client messages — right in your documents." },
            { t: "Smart Proposals", d: "Drag sections into a client-ready proposal with scope, timeline, pricing tables, and e-signatures. The client sees a beautiful document. You see a living workspace." },
            { t: "Project History", d: "Git-style version control for your documents. See exactly what changed, when, and who approved it. Diff view shows additions and deletions line by line." },
            { t: "The Wire", d: "Bloomberg-terminal-style real-time feed. Invoice viewed. Proposal signed. Payment received. Every business event, streaming live." },
            { t: "Command Palette", d: "⌘K to do anything. Open projects, create invoices, switch workspaces, send reminders. Keyboard-first, mouse-optional." },
            { t: "Revenue Landscape", d: "Your earnings history rendered as topographic terrain. Mountains for high months, valleys for slow ones. Hover to explore." },
            { t: "Chrome Extension", d: "Capture ideas while browsing. Quick notes auto-tag to workspaces. Your Felmark is always one click away." },
            { t: "Stripe Payments", d: "Clients pay through your invoices. You get paid via Stripe. We take 2.9% — no monthly fee, no hidden charges, no contracts." },
          ].map((f, i) => (
            <Reveal key={i} delay={i * 40}>
              <div className="feat">
                <span className="feat-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="feat-body">
                  <div className="feat-title">{f.t} <span className="feat-tag">FREE FOREVER</span></div>
                  <div className="feat-desc">{f.d}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Pricing */}
        <section className="pricing" id="pricing">
          <Reveal><div className="sec-label">Pricing</div><h2 className="pricing-headline">Radically simple.</h2><p className="pricing-sub">No tiers. No upgrades. No "premium" features locked behind a paywall. One plan. Free.</p></Reveal>
          <Reveal delay={200}>
            <div className="pricing-card">
              <div className="pricing-amount"><span className="pricing-dollar">$0</span><span className="pricing-period">/ forever</span></div>
              <div className="pricing-tagline">Everything. Always. Free.</div>
              <div className="pricing-features">
                {["Unlimited workspaces & projects","Block editor with smart blocks","Proposals, invoices, contracts","Project history & version control","The Wire — real-time business feed","Command palette & keyboard shortcuts","Chrome extension for quick capture","Collaboration & client portals","Revenue analytics & dashboards"].map((f, i) => (
                  <div key={i} className="pf"><span className="pf-check">✓</span>{f}</div>
                ))}
              </div>
              <div className="pricing-divider" />
              <div className="pricing-note"><strong>2.9% processing fee</strong> only when clients pay through Felmark via Stripe. Never use Felmark payments? You never pay us a cent.</div>
              <button className="pricing-cta">Join the Waitlist</button>
            </div>
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="final">
          <Reveal><h2 className="final-headline">Ready to leave your <em>mark</em>?</h2></Reveal>
          <Reveal delay={100}><p className="final-sub">Join hundreds of freelancers building a better way to work.</p></Reveal>
          <Reveal delay={200}>
            {!submitted2 ? (
              <form className="final-form hero-form" onSubmit={e => submit(e, 2)}>
                <input className="hero-input" type="email" placeholder="you@example.com" value={email2} onChange={e => setEmail2(e.target.value)} />
                <button className="hero-submit" type="submit">Join Waitlist</button>
              </form>
            ) : <div className="hero-success" style={{ justifyContent: "center" }}>✓ You're in. We'll be in touch.</div>}
          </Reveal>
        </section>

        {/* Footer */}
        <footer className="foot">
          <div className="foot-logo">
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="#b07d4f" strokeWidth="1.5"/></svg>
            Felmark
          </div>
          <div className="foot-links"><a className="foot-link" href="#">Twitter</a><a className="foot-link" href="#">Discord</a><a className="foot-link" href="#">GitHub</a></div>
          <span>© 2026 Felmark · tryfelmark.com</span>
        </footer>
      </div>
    </>
  );
}
