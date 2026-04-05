# contractorOS

Contractor management platform for HC Ventures real estate operations.

## Modules

- **Dashboard** — KPIs, recent activity, project status overview
- **Contractors** — Manage profiles, trades, ratings, license info
- **Projects** — Track renovation/construction with budgets & timelines
- **Invoices** — Create/track payments with status workflows
- **Estimates** — Proposals with line items and approval workflow
- **Compliance** — Insurance certs, licenses, W-9s, expiration tracking

## Tech Stack

- Next.js 16 (App Router, React 19, TypeScript)
- Prisma 7 + SQLite
- Tailwind CSS v4
- lucide-react icons

## Getting Started

```bash
cd contractor-os-app
npm install
npx prisma db push
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
