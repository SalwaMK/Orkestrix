# Orkestrix

> Track your SaaS subscriptions and AI spend in one place.
> Open source. Local-first. No Docker required.

---

![Demo](./public/assets/demo.gif)

## Quick start (local)

```bash
git clone https://github.com/SalwaMK/Orkestrix
cd Orkestrix
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

The API server starts automatically on port 3001 alongside the Vite dev server.
The SQLite database (`orkestrix.db`) is created automatically on first run.

---

## Optional: run migrations manually

```bash
npm run db:migrate   # apply schema migrations to orkestrix.db
npm run db:studio    # open Drizzle Studio to browse the DB
```

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable           | Default    | Description                          |
|--------------------|------------|--------------------------------------|
| `VITE_DB_MODE`     | `sqlite`   | `sqlite` (local) or `neon` (hosted)  |
| `VITE_DATABASE_URL`| —          | Neon connection string (hosted only) |
| `VITE_APP_NAME`    | `Orkestrix`| Application name                     |
| `VITE_GMAIL_CLIENT_ID` | —      | Google OAuth Client ID for Gmail     |
| `VITE_GMAIL_CLIENT_SECRET`| —   | Google OAuth Client Secret           |
| `VITE_GMAIL_REDIRECT_URI`| —    | Usually `http://localhost:3001/auth/gmail/callback` |
| `VITE_ANTHROPIC_API_KEY` | —    | Anthropic API key for AI Receipt Parsing |

---

## Features

- **Local-first SQLite Tracking**: Track your recurring SaaS subscriptions with total cost metrics without your data ever leaving your machine.
- **AI Spend Tracker**: Monitor real-time API token usage across OpenAI and Anthropic natively. Data is completely encrypted at rest via AES-256.
- **Gmail Receipt Scanner**: Connect via Google OAuth to automatically parse billing receipts utilizing Claude Haiku. Safely adds newly discovered subscriptions to your stack.
- **Reporting & Exports**: One-click downloadable CSV/PDF export generation and shareable social media cards.
- **Modern UI**: Polished glassmorphism interfaces built beautifully with Framer Motion, Tailwind V3, and customized SVG assets.

---

## Tech stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19 · TypeScript · Vite 6    |
| Styling    | Tailwind CSS v3 · shadcn/ui       |
| Forms      | react-hook-form · Zod             |
| Database   | SQLite (local) · Neon Postgres (hosted) |
| ORM        | Drizzle ORM · Drizzle Kit         |
| Server     | Express (local API server)        |
| Animation  | Motion (framer-motion)            |

---

## Project structure

```
src/
├── components/
│   ├── ui/          ← shadcn/ui components
│   ├── tools/       ← ToolForm, ToolCard
│   └── layout/      ← Navbar
├── pages/
│   ├── Dashboard.tsx
│   └── AddTool.tsx
├── db/
│   ├── schema.ts    ← Drizzle schema (SQLite)
│   └── index.ts     ← dual-mode DB client
├── hooks/
│   └── useTools.ts  ← fetch-based CRUD hook
├── lib/
│   └── utils.ts     ← formatCurrency, cn, etc.
└── types/
    └── index.ts     ← shared TypeScript types

server/
└── index.ts         ← Express API server (local mode)
```

---

## Scripts

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start Vite + API server concurrently     |
| `npm run build`   | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build             |
| `npm run db:migrate` | Apply Drizzle migrations to SQLite    |
| `npm run db:studio`  | Open Drizzle Studio UI                |

---

## Roadmap

- [x] Charts & spend trends (AI Tracker)
- [x] Renewal email reminders
- [x] CSV & PDF exports
- [x] Auto-discovery via Gmail Receipt Parsing
- [ ] Authentication (custom user models)
- [ ] Team / multi-user support

---

## License

MIT © Orkestrix Contributors
