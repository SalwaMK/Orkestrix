import { useState } from "react";
import { Link } from "react-router-dom";

// ─── Landing page — styled to match the Orkestrix app design system ──────────

export function Landing() {
  return (
    <div className="page-shell" style={{ minHeight: "100vh" }}>
      {/* Subtle grid backdrop */}
      <div className="page-backdrop" />

      <LandingNav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          padding: "100px 0 80px",
          position: "relative",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: "-8%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,211,238,0.13) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-6%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(15,118,110,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
          {/* Eyebrow pill */}
          <span className="eyebrow" style={{ marginBottom: 28, display: "inline-flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
            Open source · Local-first · MIT License
          </span>

          {/* Headline */}
          <h1
            style={{
              margin: "0 0 24px",
              fontSize: "clamp(3rem, 6.5vw, 5.4rem)",
              fontWeight: 800,
              lineHeight: 0.96,
              letterSpacing: "-0.055em",
            }}
          >
            <span className="brand-headline">
              Your entire software stack.
            </span>
            <br />
            <span
              style={{
                fontSize: "clamp(1.5rem, 3.2vw, 2.9rem)",
                color: "rgba(243,251,251,0.72)",
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
              }}
            >
              SaaS and AI, tracked in one place.
            </span>
          </h1>

          {/* Sub-line */}
          <p
            style={{
              margin: "0 0 40px",
              fontSize: "1.08rem",
              color: "rgba(219,243,244,0.65)",
              lineHeight: 1.75,
              maxWidth: 560,
            }}
          >
            Orkestrix tracks every subscription you pay for and every AI API
            token you spend. See where your money actually goes. No cloud required.
          </p>

          {/* CTAs */}
          <div className="hero-actions" style={{ marginBottom: 20 }}>
            <Link to="/app" className="btn btn-primary">
              Open app
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/SalwaMK/orkestrix"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              ★ Star on GitHub
            </a>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "0.82rem",
              color: "rgba(219,243,244,0.40)",
              letterSpacing: "0.04em",
            }}
          >
            Free and open source. Self-host in 2 minutes.
          </p>
        </div>

        {/* Hero code block — floated right on large screens */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            width: "min(440px, 42vw)",
          }}
          className="hero-code-block"
        >
          <HeroCodeBlock />
        </div>
      </section>

      {/* ── Problem stats ─────────────────────────────────────────────────── */}
      <section
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          padding: "48px 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 20,
          }}
          className="stats-grid"
        >
          <StatCard value="20–40" label="Tools per dev stack" />
          <StatCard value="3×" label="AI spend growth per year" />
          <StatCard value="43%" label="Subscriptions go unused" />
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: "0.75rem",
            color: "rgba(219,243,244,0.30)",
          }}
        >
          *Estimated industry averages
        </p>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          padding: "60px 0",
        }}
      >
        <div className="section-heading">
          <span className="cta-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            What you get
          </span>
          <h2>Everything you need to control your stack</h2>
        </div>

        <div className="feature-grid">
          <FeatureCard
            icon={<GridIcon />}
            title="Full stack registry"
            body="Every SaaS tool in one place. Auto-populate from our catalog of 100+ tools or import from CSV. Know exactly what you're running."
          />
          <FeatureCard
            icon={<SparkleIcon />}
            title="AI token spend tracking"
            body="Connect your OpenAI or Anthropic key. See token usage by model, by day. Know your real AI costs before they surprise you."
            badge="Unique to Orkestrix"
          />
          <FeatureCard
            icon={<BellIcon />}
            title="Renewal alerts"
            body="30, 7, and 1-day alerts for every subscription. Browser notifications—no email required."
          />
        </div>
      </section>

      {/* ── Open source callout ───────────────────────────────────────────── */}
      <section
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          padding: "60px 0",
        }}
      >
        <div className="architecture-layout">
          <div className="architecture-copy">
            <span className="eyebrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Fully open source
            </span>
            <h2 style={{ margin: 0, fontSize: "clamp(1.9rem, 3vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
              MIT licensed. Your data stays on your machine.
            </h2>
            <p style={{ margin: 0, color: "rgba(219,243,244,0.65)", lineHeight: 1.75 }}>
              Read the code, fork it, self-host it. Your financial data never has
              to leave your machine. Run it on localhost with a single command.
            </p>
            <a
              href="https://github.com/SalwaMK/orkestrix"
              target="_blank"
              rel="noreferrer"
              className="feature-link"
            >
              Read the source
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Layer diagram */}
          <div className="layer-diagram">
            <div className="layer-card active">
              <div className="layer-icon">
                <GridIcon />
              </div>
              <div>
                <h3>SaaS catalog</h3>
                <p>100+ tools, one click to add</p>
              </div>
            </div>
            <div className="layer-card" style={{ marginTop: 14 }}>
              <div className="layer-icon">
                <SparkleIcon />
              </div>
              <div>
                <h3>AI usage tracker</h3>
                <p>Token spend by model &amp; day</p>
              </div>
            </div>
            <div className="layer-card" style={{ marginTop: 14 }}>
              <div className="layer-icon">
                <BellIcon />
              </div>
              <div>
                <h3>Renewal alerts</h3>
                <p>Browser-native notifications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          padding: "60px 0",
        }}
      >
        <div className="section-heading" style={{ margin: "0 auto 44px", textAlign: "center", maxWidth: "100%" }}>
          <span className="cta-label" style={{ margin: "0 auto" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
            Up and running in minutes
          </span>
          <h2 style={{ textAlign: "center" }}>Three steps to full visibility</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: 22,
            position: "relative",
          }}
          className="feature-grid"
        >
          <Step number={1} title="Add your tools" body="Use the catalog to add tools in one click, import from CSV, or enter them manually." />
          <Step number={2} title="Connect AI providers" body="Paste your OpenAI or Anthropic API key. Token spend appears automatically." />
          <Step number={3} title="Stay in control" body="Get renewal alerts. Export reports. Share your stack summary." />
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────────────────── */}
      <section
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          padding: "40px 0 60px",
        }}
      >
        <div className="cta-panel">
          <div style={{ maxWidth: 520 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", letterSpacing: "-0.04em" }}>
              Ready to see where your money goes?
            </h2>
            <p style={{ margin: 0, color: "rgba(219,243,244,0.60)", lineHeight: 1.7 }}>
              Open the app now, no sign-up, no cloud, no vendor lock-in.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link to="/app" className="btn btn-primary">
              Open app →
            </Link>
            <a
              href="https://github.com/SalwaMK/orkestrix"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
        }}
      >
        <div className="site-footer">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img
              src="/assets/orkestrix_logo.svg"
              alt="Orkestrix"
              style={{ height: 26, width: "auto", filter: "drop-shadow(0 0 12px rgba(34,211,238,0.35))" }}
            />
            <p style={{ margin: 0, fontSize: "0.9rem" }}>Orkestrix</p>
          </Link>
          <div style={{ display: "flex", gap: 24 }}>
            <a href="https://github.com/SalwaMK/orkestrix" target="_blank" rel="noreferrer" style={{ color: "rgba(219,243,244,0.45)", fontSize: "0.85rem", transition: "color 0.2s" }}>GitHub</a>
            <Link to="/app" style={{ color: "rgba(219,243,244,0.45)", fontSize: "0.85rem" }}>Open app</Link>
          </div>
          <span style={{ color: "rgba(219,243,244,0.28)", fontSize: "0.78rem" }}>
            Open source under MIT License · Copyright © 2026 SalwaMK
          </span>
        </div>
      </footer>
    </div>
  );
}

// ── Navbar ──────────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(34,211,238,0.08)",
        background: "rgba(7,17,18,0.72)",
      }}
    >
      <div
        className="topbar"
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
        }}
      >
        <Link to="/" className="brand-mark" style={{ textDecoration: "none", color: "inherit" }}>
          <img
            src="/assets/orkestrix_logo.svg"
            alt="Orkestrix logo"
            className="brand-logo"
          />
          <span>Orkestrix</span>
        </Link>

        <div className="nav-menu">
          <a
            href="https://github.com/SalwaMK/orkestrix"
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://github.com/SalwaMK/orkestrix"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderRadius: 999,
              border: "1px solid rgba(34,211,238,0.18)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--text)",
              fontWeight: 600,
              fontSize: "0.875rem",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            ★ Star
          </a>
          <Link
            to="/app"
            className="btn btn-primary"
            style={{ minWidth: "auto", padding: "10px 20px", fontSize: "0.9rem" }}
          >
            Open app →
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ── Hero code block ──────────────────────────────────────────────────────────

function HeroCodeBlock() {
  const [copied, setCopied] = useState(false);
  const code = `git clone https://github.com/SalwaMK/Orkestrix
cd orkestrix && npm install
npm run db:migrate && npm run dev`;

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        borderRadius: 20,
        background:
          "linear-gradient(180deg, rgba(14,22,24,0.96), rgba(8,14,15,0.98))",
        border: "1px solid rgba(34,211,238,0.18)",
        boxShadow:
          "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
        overflow: "hidden",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(34,211,238,0.08)",
          background: "rgba(15,118,110,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 7 }}>
          {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
            <span
              key={c}
              style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.7 }}
            />
          ))}
        </div>
        <span style={{ fontSize: "0.72rem", color: "rgba(219,243,244,0.35)", letterSpacing: "0.06em" }}>
          terminal
        </span>
        <button
          onClick={copy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: "0.72rem",
            color: copied ? "#22d3ee" : "rgba(219,243,244,0.40)",
            background: "none",
            border: "none",
            cursor: "pointer",
            transition: "color 0.2s",
            fontFamily: "inherit",
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <pre
        style={{
          margin: 0,
          padding: "20px 20px",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: "0.82rem",
          lineHeight: 1.9,
          color: "#b6f6ef",
          whiteSpace: "pre",
          overflowX: "auto",
        }}
      >
        <CodeLine prompt="$" text="git clone https://github.com/SalwaMK/orkestrix" />
        <CodeLine prompt="$" text="cd orkestrix && npm install" />
        <CodeLine prompt="$" text="npm run db:migrate && npm run dev" />
        <span style={{ color: "rgba(34,211,238,0.45)", fontSize: "0.8rem" }}>
          ✓ Server running on localhost
        </span>
      </pre>
    </div>
  );
}

function CodeLine({ prompt, text }: { prompt: string; text: string }) {
  return (
    <div>
      <span style={{ color: "rgba(34,211,238,0.50)", userSelect: "none" }}>{prompt} </span>
      <span style={{ color: "#e2f8f6" }}>{text}</span>
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-card">
      <strong style={{ background: "linear-gradient(135deg, #22d3ee, #0f766e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {value}
      </strong>
      <span>{label}</span>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  body,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <div className="feature-card">
      {badge && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "3px 10px",
            borderRadius: 999,
            background: "rgba(34,211,238,0.08)",
            border: "1px solid rgba(34,211,238,0.22)",
            color: "#22d3ee",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600,
            width: "fit-content",
          }}
        >
          {badge}
        </span>
      )}
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

// ── Step card ────────────────────────────────────────────────────────────────

function Step({ number, title, body }: { number: number; title: string; body: string }) {
  return (
    <div className="feature-card" style={{ textAlign: "center", alignItems: "center" }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "1.2rem",
          color: "#041012",
          flexShrink: 0,
          boxShadow: "0 8px 24px rgba(34,211,238,0.22)",
        }}
      >
        {number}
      </div>
      <h3 style={{ margin: 0, fontSize: "1.15rem" }}>{title}</h3>
      <p style={{ margin: 0, textAlign: "center" }}>{body}</p>
    </div>
  );
}

// ── Inline icons ─────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l1.09 2.26L15.5 4.5l-2.41 1.09L12 8l-1.09-2.41L8.5 4.5l2.41-1.09L12 2z" />
      <path d="M19 9l.55 1.14L21 10.5l-1.45.55L19 12.5l-.55-1.45L17 10.5l1.45-.55L19 9z" />
      <path d="M5 9l.55 1.14L7 10.5l-1.45.55L5 12.5l-.55-1.45L3 10.5l1.45-.55L5 9z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}