# Orkestrix
> Track your SaaS subscriptions and AI spend in one place.
> Open source. Local-first. No Docker required.

---

![Demo](public/assets/demo.gif)

---

## Quick start

git clone https://github.com/SalwaMK/Orkestrix
cd Orkestrix
npm install
npm run db:migrate
npm run dev

Open http://localhost:5173
The API server starts automatically on port 3001.
The SQLite database (orkestrix.db) is created on first run.

---

## Features

- **Stack tracking** — catalog of 100+ tools, one-click add,
  CSV import, manual entry
- **AI token spend** — connect OpenAI and Anthropic API keys,
  see real token costs by model by day, AES-256 encrypted at rest
- **Gmail receipt scanner** — connect Gmail (read-only) to
  auto-discover forgotten subscriptions using Claude Haiku
- **Renewal alerts** — 30, 7, and 1 day browser notifications
  before every renewal
- **Export** — one-click CSV and PDF stack report with share button

---

## Environment variables

Copy .env.example to .env.local and fill in the values:

| Variable                  | Default    | Description                              |
|---------------------------|------------|------------------------------------------|
| VITE_DB_MODE              | sqlite     | sqlite (local) or neon (hosted)          |
| VITE_DATABASE_URL         | —          | Neon connection string (hosted only)     |
| VITE_APP_NAME             | Orkestrix  | Application name                         |
| VITE_ENCRYPTION_SECRET    | —          | Secret for AES-256 key encryption        |
| VITE_ANTHROPIC_API_KEY    | —          | Anthropic API key for Gmail parsing      |
| VITE_GMAIL_CLIENT_ID      | —          | Google OAuth Client ID                   |
| VITE_GMAIL_CLIENT_SECRET  | —          | Google OAuth Client Secret               |
| VITE_GMAIL_REDIRECT_URI   | —          | http://localhost:3001/auth/gmail/callback|

---

## Project structure

```
src/
├── components/
│   ├── ui/           ← shadcn/ui components
│   ├── tools/        ← ToolForm, ToolCard
│   ├── charts/       ← SpendHistoryChart, CategoryBreakdownChart
│   ├── alerts/       ← RenewalAlertBanner, RenewalTimeline
│   ├── catalog/      ← CatalogToolCard
│   ├── import/       ← DropZone, ColumnMapper, ImportPreviewTable
│   ├── export/       ← ExportButton, ExportSummaryCard
│   ├── ai/           ← AddProviderForm, UsageChart, ModelBreakdown
│   ├── gmail/        ← DiscoveredSubCard
│   └── layout/       ← Navbar
├── pages/
│   ├── Landing.tsx
│   ├── Dashboard.tsx
│   ├── AddTool.tsx
│   ├── Catalog.tsx
│   ├── Import.tsx
│   ├── AITracker.tsx
│   └── Gmail.tsx
├── db/
│   ├── schema.ts     ← Drizzle schema
│   └── index.ts      ← dual-mode DB client (SQLite / Neon)
├── hooks/            ← useTools, useAITracker, useGmail
├── lib/              ← utils, encryption, aiSync, csvParser, exportUtils
├── data/             ← catalogTools, tokenPricing, seedData
└── types/            ← shared TypeScript types

server/
└── index.ts          ← Express API server (auth + sync proxy)
```

---

## Scripts

| Command             | Description                              |
|---------------------|------------------------------------------|
| npm run dev         | Start Vite + API server concurrently     |
| npm run build       | TypeScript check + Vite production build |
| npm run preview     | Preview the production build             |
| npm run db:migrate  | Apply Drizzle migrations to SQLite       |
| npm run db:studio   | Open Drizzle Studio UI                   |

---

## Tech stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19 · TypeScript · Vite 6          |
| Styling    | Tailwind CSS v3 · shadcn/ui             |
| Forms      | react-hook-form · Zod                   |
| Database   | SQLite (local) · Neon Postgres (hosted) |
| ORM        | Drizzle ORM · Drizzle Kit               |
| Server     | Express                                 |
| Charts     | Recharts                                |
| Animation  | Framer Motion                           |

---

## Roadmap

- [x] Stack tracking + tool catalog (100+ tools)
- [x] Dashboard charts + renewal alerts
- [x] CSV import + PDF/CSV export
- [x] AI token spend tracker (OpenAI + Anthropic)
- [x] Gmail receipt parsing
- [ ] Authentication + hosted version
- [ ] Renewal email reminders
- [ ] Team / multi-user support
- [ ] Mobile app

---

## Contributing

See CONTRIBUTING.md

---

## License

MIT License — Copyright (c) 2026 SalwaMK

