import { Link } from "react-router-dom";

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <LandingNav />

      {/* Hero */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Open source · Local-first · MIT License
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Your entire software stack.<br />
            SaaS and AI, in one place.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Orkestrix tracks every subscription you pay for and every AI API token you spend.
            See where your money actually goes. No cloud required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/app"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Open app →
            </Link>
            <a
              href="https://github.com/SalwaMK/orkestrix"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-6 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-accent transition-colors"
            >
              View on GitHub
            </a>
          </div>

          {/* Muted text */}
          <p className="text-sm text-muted-foreground mb-6">
            Free and open source. Self-host in 2 minutes.
          </p>

          {/* Code block */}
          <CodeBlock />
        </div>
      </section>

      {/* Problem statement */}
      <section className="px-4 py-16 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl leading-relaxed mb-8">
            You're paying for tools you forgot about. Your AI API usage is invisible.
            Renewals sneak up on you. And nobody has a clear picture of what modern
            software actually costs to run.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-sm text-muted-foreground">
            <span>Average dev stack: 20–40 tools</span>
            <span>AI spend growing 3× per year</span>
            <span>43% of subscriptions go unused</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            *Estimated industry averages
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<GridIcon />}
              title="See your full stack"
              body="Every SaaS tool in one registry. Auto-populate from our catalog of 100+ tools or import from CSV. Know exactly what you're running."
            />
            <FeatureCard
              icon={<SparkleIcon />}
              title="Track AI token spend"
              body="Connect your OpenAI or Anthropic API key. See token usage by model, by day. Know your real AI costs before they surprise you."
              badge="Unique to Orkestrix"
            />
            <FeatureCard
              icon={<BellIcon />}
              title="Never miss a renewal"
              body="30, 7, and 1 day alerts for every subscription. Browser notifications. No email required."
            />
          </div>
        </div>
      </section>

      {/* Open source callout */}
      <section className="px-4 py-16 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Fully open source</h2>
              <p className="text-lg text-muted-foreground mb-6">
                MIT licensed. Read the code, fork it, self-host it. Your financial data never has to leave your machine.
                Run it on localhost with a single command.
              </p>
              <a
                href="https://github.com/SalwaMK/orkestrix"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Read the source →
              </a>
            </div>
            <CodeBlock />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Up and running in minutes</h2>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2 w-full max-w-md h-0.5 bg-border"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Step number={1} title="Add your tools" body="Use the catalog to add tools in one click, import from CSV, or enter them manually." />
              <Step number={2} title="Connect AI providers" body="Paste your OpenAI or Anthropic API key. Token spend appears automatically." />
              <Step number={3} title="Stay in control" body="Get renewal alerts. Export reports. Share your stack summary." />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="font-semibold text-lg mb-4">Orkestrix</div>
              <div className="space-x-6 text-sm">
                <a href="https://github.com/SalwaMK/orkestrix" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">GitHub</a>
                <Link to="/app" className="text-muted-foreground hover:text-foreground">Open app</Link>
                <a href="#" className="text-muted-foreground hover:text-foreground">Self-host docs</a>
              </div>
            </div>
            <div className="text-sm text-muted-foreground md:text-right">
              Open source under MIT License · Built in public
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="font-semibold text-foreground">Orkestrix</div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/SalwaMK/orkestrix"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            GitHub
            <ExternalLinkIcon />
          </a>
          <a
            href="https://github.com/SalwaMK/orkestrix"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-2 bg-muted text-muted-foreground font-medium rounded-lg hover:bg-muted/80 transition-colors"
          >
            ★ Star on GitHub
          </a>
          <Link
            to="/app"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            Open app →
          </Link>
        </div>
      </div>
    </nav>
  );
}

function CodeBlock() {
  const code = `git clone https://github.com/SalwaMK/orkestrix
cd orkestrix && npm install
npm run db:migrate && npm run dev`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative bg-[#0d1117] text-[#f0f6fc] p-4 rounded-lg border border-[#30363d] font-mono text-sm">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-1 text-[#f0f6fc] hover:bg-[#30363d] rounded"
        title="Copy to clipboard"
      >
        <CopyIcon />
      </button>
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  );
}

function FeatureCard({ icon, title, body, badge }: { icon: React.ReactNode; title: string; body: string; badge?: string }) {
  return (
    <div className={`p-6 rounded-lg border border-border ${badge ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800' : 'bg-card'}`}>
      {badge && (
        <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">{badge}</div>
      )}
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{body}</p>
    </div>
  );
}

function Step({ number, title, body }: { number: number; title: string; body: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{body}</p>
    </div>
  );
}

// Icons (inline SVGs)
function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l1.09 2.26L15.5 4.5l-2.41 1.09L12 8l-1.09-2.41L8.5 4.5l2.41-1.09L12 2z"></path>
      <path d="M19 9l.55 1.14L21 10.5l-1.45.55L19 12.5l-.55-1.45L17 10.5l1.45-.55L19 9z"></path>
      <path d="M5 9l.55 1.14L7 10.5l-1.45.55L5 12.5l-.55-1.45L3 10.5l1.45-.55L5 9z"></path>
      <path d="M12 16l1.09 2.26L15.5 18.5l-2.41 1.09L12 22l-1.09-2.41L8.5 18.5l2.41-1.09L12 16z"></path>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15,3 21,3 21,9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}