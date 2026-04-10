import {
  ArrowRight,
  Bot,
  Boxes,
  ChevronRight,
  Cpu,
  Eye,
  LayoutPanelTop,
  Radar,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

const navItems = ["Platform", "Architecture", "Security", "Pricing"];

const features = [
  {
    icon: Radar,
    title: "Stack Discovery",
    description:
      "Continuously map licenses, owners, spend, and data flows across your SaaS estate with live organizational context.",
  },
  {
    icon: Workflow,
    title: "Agent Orchestration",
    description:
      "Coordinate specialized agents that triage requests, automate workflows, and enforce operating policies from one control plane.",
  },
  {
    icon: ShieldCheck,
    title: "Security & Compliance",
    description:
      "Monitor access, risky drift, and compliance posture with policy-aware guardrails built for security and IT teams.",
  },
];

const stats = [
  { value: "40%", label: "cost reduction" },
  { value: "24/7", label: "monitoring" },
  { value: "200+", label: "integrations" },
];

const architectureLayers = [
  {
    title: "Intelligence",
    subtitle: "Decisioning, policy evaluation, and task routing",
    icon: Bot,
  },
  {
    title: "Operating Agent Layer",
    subtitle: "Specialized agents for procurement, security, and IT ops",
    icon: Cpu,
    active: true,
  },
  {
    title: "SaaS Fabric",
    subtitle: "Apps, identity systems, finance tools, and telemetry streams",
    icon: Boxes,
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

function App() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -140]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.94]);
  const orbitX = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const orbitY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const logoSrc = "/assets/orkestrix_logo.svg";

  return (
    <div className="page-shell">
      <div className="page-backdrop" />
      <header className="topbar">
        <motion.a
          href="#hero"
          className="brand-mark"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img className="brand-logo" src={logoSrc} alt="Orkestrix logo" />
          <span>Orkestrix</span>
        </motion.a>
        <nav className="nav-menu">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * index, duration: 0.65 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
      </header>

      <main>
        <section className="hero-section" id="hero">
          <motion.div
            className="hero-visual"
            style={{ y: heroY, scale: heroScale }}
          >
            <div className="hero-grid" />
            <motion.div className="orbital-node node-a" style={{ x: orbitX }} />
            <motion.div className="orbital-node node-b" style={{ y: orbitY }} />
            <div className="server-cluster">
              <div className="server-stack stack-left" />
              <div className="server-stack stack-center" />
              <div className="server-stack stack-right" />
            </div>
            <div className="signal-routes">
              <span />
              <span />
              <span />
            </div>
          </motion.div>

          <motion.div className="hero-copy" {...fadeInUp}>
            <div className="eyebrow">
              <LayoutPanelTop size={16} />
              SaaS Operating System
            </div>
            <h1>
              <span className="brand-headline">Orkestrix</span>
              <span>master your SaaS stack with intelligent agents.</span>
            </h1>
            <p>
              Unified orchestration for application visibility, policy-aware
              automation, and always-on operational control across the tools
              your business depends on.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#cta">
                Start Free Trial
                <ArrowRight size={18} />
              </a>
              <a className="btn btn-secondary" href="#platform">
                Watch Demo
                <Eye size={18} />
              </a>
            </div>
          </motion.div>
        </section>

        <motion.section className="features-section" id="platform" {...fadeInUp}>
          <div className="section-heading">
            <span>Platform</span>
            <h2>One control surface for discovery, automation, and governance</h2>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, description }) => (
              <motion.article
                key={title}
                className="feature-card"
                whileHover={{ y: -10, borderColor: "rgba(34, 211, 238, 0.35)" }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              >
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="feature-link">
                  Learn more
                  <ChevronRight size={16} />
                </span>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section className="architecture-section" id="architecture" {...fadeInUp}>
          <div className="section-heading split-heading">
            <span>Platform Architecture</span>
            <h2>The operating agent layer that keeps the stack in sync</h2>
          </div>
          <div className="architecture-layout">
            <div className="architecture-copy">
              <p>
                Orkestrix sits above your SaaS fabric as an operational layer that
                interprets activity, assigns work to specialized agents, and keeps
                every action aligned with policy.
              </p>
              <p>
                The result is a measured command-center workflow: discovery feeds
                insight, agents execute with traceability, and security teams stay
                in control of the blast radius.
              </p>
            </div>

            <motion.div
              className="layer-diagram"
              whileHover={{ rotateX: 2, rotateY: -4 }}
              transition={{ duration: 0.4 }}
            >
              {architectureLayers.map(({ title, subtitle, icon: Icon, active }) => (
                <div
                  key={title}
                  className={`layer-card${active ? " active" : ""}`}
                >
                  <div className="layer-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3>{title}</h3>
                    <p>{subtitle}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <motion.section className="stats-section" id="security" {...fadeInUp}>
          <div className="stats-grid">
            {stats.map(({ value, label }) => (
              <motion.div
                key={label}
                className="stat-card"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
              >
                <strong>{value}</strong>
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="cta-section" id="cta" {...fadeInUp}>
          <div className="cta-panel">
            <div>
              <span className="cta-label">Deploy your command center</span>
              <h2>Bring stack intelligence and agent orchestration into one system.</h2>
            </div>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#hero">
                Start Free Trial
                <ArrowRight size={18} />
              </a>
              <a className="btn btn-secondary" href="#architecture">
                Explore Architecture
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="site-footer" id="pricing">
        <p>Orkestrix</p>
        <span>Unified stack management and agent orchestration for modern operators.</span>
      </footer>
    </div>
  );
}

export default App;
