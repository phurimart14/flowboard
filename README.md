# FlowBoard

A collaborative Kanban board for small teams — built with Next.js 14, Supabase, and dnd-kit.

🔗 **Live Demo:** [flowboard-five-pi.vercel.app](https://flowboard-five-pi.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| UI | shadcn/ui (base-ui) + Tailwind CSS |
| Font | Nunito (Google Fonts) |
| Auth & DB | Supabase (PostgreSQL + Row Level Security) |
| Realtime | Supabase Realtime (postgres_changes) |
| State | Zustand |
| Drag & Drop | dnd-kit |
| Deploy | Vercel |

---

## Features

- **Board management** — create multiple boards, switch between them
- **Card CRUD** — add, edit, delete cards with title, description, due date, and priority
- **Drag & drop** — move cards between columns and reorder within a column
- **Realtime sync** — changes appear instantly across all open tabs/browsers
- **Invite members** — share boards with teammates by email
- **Dark / Light mode** — persisted in localStorage, no flash on reload

---

## Running Locally

**Prerequisites:** Node.js 18+, a Supabase project

1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd flowboard
   npm install
   ```

2. Copy the environment template and fill in your Supabase keys:
   ```bash
   cp .env.example .env.local
   ```
   Keys are in **Supabase Dashboard → Settings → API**.

3. Run the database schema in **Supabase SQL Editor**:
   ```
   supabase/schema.sql
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add the three environment variables from `.env.example` in the Vercel dashboard
4. Deploy — Vercel auto-detects Next.js and builds correctly

---

## Project Structure

```
app/
  (auth)/          # Login & Register pages + actions
  (main)/          # Board pages + server actions
    actions/       # card.ts, board.ts, member.ts
    board/
      [boardId]/   # Board canvas page
components/
  board/           # BoardHeader, BoardCanvas, Column, modals
  card/            # KanbanCard, CardModal, PriorityBadge, etc.
  shared/          # UserAvatar, ThemeToggle, LoginForm
hooks/             # useBoards, useCards
stores/            # boardStore, cardStore (Zustand)
lib/supabase/      # client.ts, server.ts, admin.ts
types/             # index.ts — all TypeScript interfaces
supabase/          # schema.sql
```

---

## AI-Assisted Development

This project was built using a fully documented AI-assisted workflow:

- **Requirements** — defined with Claude (`prd.md`)
- **Design** — UI/UX spec written with Claude (`design.md`)
- **Architecture** — tech stack and DB schema planned with Claude (`architecture.md`)
- **Rules** — coding conventions enforced via Claude (`CLAUDE.md`)
- **Tasks** — sprint broken down day-by-day with Claude (`tasks.md`)
- **Code** — written and debugged with Claude Code
