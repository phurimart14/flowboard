# Architecture — Kanban Board App

## 1. Tech Stack

| Layer | Technology | เหตุผล |
|---|---|---|
| Framework | Next.js 14 (App Router) | ตลาดต้องการ, SSR, file-based routing |
| Language | TypeScript | type-safe, อ่านง่าย, resume-friendly |
| Styling | Tailwind CSS | เร็ว, consistent, ไม่ต้องเขียน CSS เอง |
| UI Components | shadcn/ui | สวย, customizable, บน Tailwind |
| Drag & Drop | dnd-kit | lightweight, รองรับ touch, ใช้กับ React ได้ดี |
| State | Zustand | เรียบง่าย boilerplate น้อย เหมาะ project นี้ |
| Backend | Supabase | Auth + PostgreSQL + Realtime ในตัวเดียว |
| Deploy | Vercel | ง่ายที่สุด ผูกกับ GitHub ได้เลย |

---

## 2. Folder Structure

```
kanban-app/
├── app/                          # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # หน้า Login
│   │   └── register/
│   │       └── page.tsx          # หน้า Register
│   ├── (main)/
│   │   ├── layout.tsx            # Layout หลัก (navbar)
│   │   └── board/
│   │       └── [boardId]/
│   │           └── page.tsx      # หน้า Board
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Redirect → /login หรือ /board
│
├── components/
│   ├── ui/                       # shadcn/ui components (auto-generated)
│   ├── board/
│   │   ├── BoardHeader.tsx       # Navbar + board dropdown
│   │   ├── BoardCanvas.tsx       # พื้นที่ columns ทั้งหมด
│   │   ├── Column.tsx            # Column เดี่ยว
│   │   ├── ColumnHeader.tsx      # Header ของ column
│   │   └── AddCardButton.tsx     # ปุ่ม + Add card
│   ├── card/
│   │   ├── KanbanCard.tsx        # Card ที่แสดงใน column
│   │   ├── CardModal.tsx         # Modal แก้ไข card
│   │   └── PriorityBadge.tsx     # Badge High/Mid/Low
│   └── shared/
│       ├── ThemeToggle.tsx       # Dark/Light toggle
│       ├── UserAvatar.tsx        # Avatar + logout
│       └── LoadingSpinner.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase browser client
│   │   ├── server.ts             # Supabase server client
│   │   └── middleware.ts         # Auth middleware
│   └── utils.ts                  # Helper functions
│
├── stores/
│   ├── boardStore.ts             # Zustand — board & column state
│   └── cardStore.ts              # Zustand — card state
│
├── types/
│   └── index.ts                  # TypeScript interfaces ทั้งหมด
│
├── hooks/
│   ├── useBoards.ts              # fetch boards
│   ├── useCards.ts               # fetch + realtime cards
│   └── useAuth.ts                # auth state
│
├── middleware.ts                  # Next.js middleware (auth guard)
├── .env.local                    # Supabase keys (ไม่ commit)
└── README.md
```

---

## 3. Database Schema (Supabase / PostgreSQL)

### Table: `profiles`
```sql
id          uuid  PRIMARY KEY (references auth.users)
email       text
full_name   text
avatar_url  text
created_at  timestamp
```

### Table: `boards`
```sql
id          uuid  PRIMARY KEY DEFAULT gen_random_uuid()
name        text  NOT NULL
owner_id    uuid  REFERENCES profiles(id)
created_at  timestamp DEFAULT now()
```

### Table: `board_members`
```sql
id          uuid  PRIMARY KEY DEFAULT gen_random_uuid()
board_id    uuid  REFERENCES boards(id) ON DELETE CASCADE
user_id     uuid  REFERENCES profiles(id)
joined_at   timestamp DEFAULT now()
```

### Table: `cards`
```sql
id          uuid     PRIMARY KEY DEFAULT gen_random_uuid()
board_id    uuid     REFERENCES boards(id) ON DELETE CASCADE
column_id   text     NOT NULL  -- 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
title       text     NOT NULL
description text
due_date    date
priority    text     -- 'high' | 'mid' | 'low'
position    integer  NOT NULL DEFAULT 0  -- ลำดับใน column
created_by  uuid     REFERENCES profiles(id)
created_at  timestamp DEFAULT now()
updated_at  timestamp DEFAULT now()
```

---

## 4. TypeScript Interfaces

```ts
// types/index.ts

export type Priority = 'high' | 'mid' | 'low'
export type ColumnId = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'

export interface Board {
  id: string
  name: string
  owner_id: string
  created_at: string
}

export interface Card {
  id: string
  board_id: string
  column_id: ColumnId
  title: string
  description?: string
  due_date?: string
  priority?: Priority
  position: number
  created_by: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}
```

---

## 5. Data Flow

```
User Action (drag card)
    │
    ▼
Zustand Store (optimistic update — UI เปลี่ยนทันที)
    │
    ▼
Supabase Client (update column_id + position)
    │
    ▼
Supabase Realtime (broadcast ให้ member คนอื่น)
    │
    ▼
Member อื่นๆ รับ event → update Zustand Store → UI เปลี่ยน
```

---

## 6. Auth Flow

```
เข้า app
    │
    ▼
middleware.ts ตรวจ session
    │
    ├── มี session → ไปหน้า board
    └── ไม่มี session → redirect /login
```

- ใช้ Supabase Auth (Email + Password)
- Session เก็บใน cookie ผ่าน `@supabase/ssr`
- Middleware ป้องกันทุก route ใน `(main)/`

---

## 7. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
