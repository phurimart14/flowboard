# Tasks — Kanban Board App

> แบ่งตาม 2 สัปดาห์ | เช็ค ✅ เมื่อทำเสร็จ

---

## Week 1 — Foundation & Core Features

### Day 1 — Project Setup
- [ ] `npx create-next-app@latest` เลือก TypeScript + Tailwind + App Router
- [ ] ติดตั้ง dependencies: `shadcn/ui`, `zustand`, `dnd-kit`, `@supabase/ssr`
- [ ] ตั้งค่า `CLAUDE.md`, `prd.md`, `design.md`, `architecture.md` ไว้ใน root
- [ ] สร้าง folder structure ตาม `architecture.md`
- [ ] ตั้งค่า Supabase project + copy keys ไปใน `.env.local`
- [ ] ตั้งค่า font Nunito ใน `layout.tsx`
- [ ] ตั้งค่า Tailwind theme (CSS variables สำหรับ dark/light mode)
- [ ] Init Git + push ขึ้น GitHub

### Day 2 — Database & Auth
- [ ] สร้าง table ทั้งหมดใน Supabase ตาม schema ใน `architecture.md`
  - `profiles`, `boards`, `board_members`, `cards`
- [ ] เปิด Row Level Security (RLS) ทุก table
- [ ] เขียน RLS policy: user เห็นเฉพาะ board ที่ตัวเองเป็น member
- [ ] สร้าง `lib/supabase/client.ts` และ `lib/supabase/server.ts`
- [ ] สร้าง `middleware.ts` — redirect ถ้าไม่มี session
- [ ] สร้างหน้า `/login` และ `/register` ด้วย shadcn/ui Form
- [ ] ทดสอบ signup/login/logout ทำงานได้

### Day 3 — Board Management
- [ ] สร้าง `hooks/useBoards.ts` — fetch boards ที่ user เป็น member
- [ ] สร้าง `boardStore.ts` ด้วย Zustand
- [ ] สร้าง `BoardHeader.tsx` — navbar + board dropdown + theme toggle
- [ ] ทำ dropdown แสดง board list + ปุ่มสร้าง board ใหม่
- [ ] สร้าง modal สำหรับสร้าง board ใหม่ (ใส่ชื่อ board)
- [ ] ทดสอบสร้าง board ได้ + เห็นใน dropdown

### Day 4 — Column & Card UI
- [ ] สร้าง `BoardCanvas.tsx` — layout columns แนวนอน + horizontal scroll
- [ ] สร้าง `Column.tsx` และ `ColumnHeader.tsx`
- [ ] สร้าง `KanbanCard.tsx` — แสดง title, priority badge, due date
- [ ] สร้าง `PriorityBadge.tsx` — High/Mid/Low สีตาม `design.md`
- [ ] สร้าง `AddCardButton.tsx` — ปุ่ม + Add card ด้านล่าง column
- [ ] ทดสอบ UI แสดงผลถูกต้องทั้ง light/dark mode

### Day 5 — Card CRUD
- [ ] สร้าง `hooks/useCards.ts` — fetch cards ของ board
- [ ] สร้าง `cardStore.ts` ด้วย Zustand
- [ ] สร้าง `CardModal.tsx` — form แก้ไข card (title, description, due date, priority)
- [ ] เพิ่ม card ใหม่ได้ใน column ใดก็ได้
- [ ] แก้ไข card ได้ผ่าน modal (คลิกที่ card)
- [ ] ลบ card ได้จากใน modal
- [ ] ทดสอบ create / edit / delete card ทำงานครบ

---

## Week 2 — Drag & Drop, Realtime, Polish

### Day 6 — Drag & Drop
- [ ] ติดตั้งและ setup `dnd-kit` ใน `BoardCanvas.tsx`
- [ ] ใส่ `DndContext` ครอบ columns ทั้งหมด
- [ ] ใส่ `SortableContext` ในแต่ละ `Column.tsx`
- [ ] เขียน `handleDragEnd` — อัปเดต `column_id` และ `position`
- [ ] Optimistic update ใน Zustand ก่อน call Supabase
- [ ] ทดสอบ drag card ระหว่าง column ได้ และ order ถูกต้อง

### Day 7 — Realtime
- [ ] เพิ่ม Supabase Realtime subscription ใน `hooks/useCards.ts`
- [ ] subscribe event: `INSERT`, `UPDATE`, `DELETE` บน table `cards`
- [ ] อัปเดต Zustand store เมื่อได้รับ realtime event
- [ ] cleanup subscription ใน useEffect return
- [ ] ทดสอบเปิด 2 browser — move card ฝั่งนึง อีกฝั่งเห็นทันที

### Day 8 — Invite Member
- [ ] สร้าง UI invite member ใน board settings (กรอก email)
- [ ] เขียน logic ค้นหา user จาก email ใน `profiles`
- [ ] เพิ่ม record ใน `board_members`
- [ ] ทดสอบ invite + member เห็น board ใน dropdown

### Day 9 — Dark/Light Mode & Responsive
- [ ] ตรวจสอบ dark mode ทุก component ทำงานถูกต้อง
- [ ] `ThemeToggle.tsx` — toggle และ persist ใน localStorage
- [ ] ทำให้ responsive — มือถือดู board ได้ (horizontal scroll)
- [ ] ตรวจสอบ font Nunito โหลดครบทุกหน้า
- [ ] ตรวจ color ทุกจุดตรงกับ `design.md`

### Day 10 — Polish & Deploy
- [ ] เพิ่ม loading state (skeleton) ตอน fetch boards/cards
- [ ] เพิ่ม empty state เมื่อยังไม่มี card ใน column
- [ ] เพิ่ม error handling ที่ user เห็นได้ (toast notification)
- [ ] เขียน `README.md` — project overview, tech stack, วิธี run local, Vercel URL
- [ ] Deploy บน Vercel — ผูก GitHub repo
- [ ] ใส่ Supabase environment variables ใน Vercel dashboard
- [ ] ทดสอบ production build ทำงานได้ครบ
- [ ] เก็บ Vercel URL สำหรับใส่ใน Resume

---

## Definition of Done

project นี้ถือว่าเสร็จเมื่อ:
- [ ] Deploy บน Vercel มี public URL
- [ ] Login / สร้าง board / เพิ่ม card / drag card ได้ครบ
- [ ] Realtime ทำงานได้เมื่อเปิด 2 tab
- [ ] Dark/Light mode toggle ได้
- [ ] README.md อธิบาย project ชัดเจน
- [ ] Code push ขึ้น GitHub ครบ พร้อม commit history ที่อ่านได้
