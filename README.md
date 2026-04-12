# Orkestrix

> Track your SaaS subscriptions and AI spend in one place.
> Open source. Local-first. No Docker required.

---

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

- [ ] Authentication (session 2)
- [ ] Charts & spend trends
- [ ] CSV export
- [ ] Renewal email reminders
- [ ] Team / multi-user support

---

## License

MIT © Orkestrix Contributors
