# CLAUDE.md — Kanban Board App

> ไฟล์นี้คือ rules สำหรับ Claude ทุกครั้งที่ช่วย code project นี้
> อ่านทุกข้อก่อนเขียนโค้ดเสมอ

---

## 1. Project Overview

Kanban Board สำหรับทีมเล็กๆ ใช้ร่วมกัน
- Framework: Next.js 14 App Router + TypeScript
- UI: shadcn/ui + Tailwind CSS
- Backend: Supabase (Auth + PostgreSQL + Realtime)
- State: Zustand
- Deploy: Vercel

---

## 2. Code Style Rules

### ทั่วไป
- ใช้ **TypeScript เสมอ** — ห้ามใช้ `any` เด็ดขาด
- ใช้ **arrow function** สำหรับ component และ handler
- ใช้ **named export** ทุกที่ ยกเว้น page.tsx ใช้ default export
- เขียน **interface** ทุกตัวไว้ใน `types/index.ts` ห้ามนิยาม type inline ใน component

### Naming Conventions
| สิ่งที่ตั้งชื่อ | รูปแบบ | ตัวอย่าง |
|---|---|---|
| Component | PascalCase | `KanbanCard.tsx` |
| Hook | camelCase + use | `useBoards.ts` |
| Store | camelCase + Store | `boardStore.ts` |
| Function | camelCase | `handleDragEnd` |
| Type/Interface | PascalCase | `CardProps` |
| CSS class | Tailwind only | ห้ามเขียน CSS แยก |
| Constant | UPPER_SNAKE_CASE | `COLUMN_IDS` |

### Component Rules
- 1 file = 1 component เสมอ
- Component ต้องมี Props interface เสมอ แม้จะไม่มี props
- ห้าม fetch data ใน component โดยตรง — ใช้ custom hook เสมอ
- ห้าม logic ซับซ้อนใน JSX — แยกออกมาเป็น variable หรือ function ก่อน

```ts
// ✅ Good
const isOverdue = card.due_date && new Date(card.due_date) < new Date()
return <div className={isOverdue ? 'text-red-500' : ''}>{card.title}</div>

// ❌ Bad
return <div className={card.due_date && new Date(card.due_date) < new Date() ? 'text-red-500' : ''}>{card.title}</div>
```

---

## 3. Folder Rules

- **ห้ามแก้ไขไฟล์ใน `components/ui/`** — นี่คือ shadcn/ui auto-generated
- **ทุก component** อยู่ใน `components/board/` หรือ `components/card/` หรือ `components/shared/`
- **ทุก type** อยู่ใน `types/index.ts` เท่านั้น
- **ทุก Supabase call** อยู่ใน `hooks/` เท่านั้น — ห้าม call Supabase ตรงใน component

---

## 4. Styling Rules

- ใช้ **Tailwind CSS เท่านั้น** — ห้ามเขียน inline style หรือ CSS module
- ใช้ **CSS variables** สำหรับ theme (dark/light) ตาม `design.md`
- Font: **Nunito** จาก Google Fonts เท่านั้น
- Border radius: ดู `design.md` section 6 — ห้ามใช้ค่าอื่น
- ห้ามใช้ gradient สี purple/pink

```tsx
// ✅ Good
<div className="rounded-[10px] bg-white dark:bg-slate-800 p-3 shadow-sm">

// ❌ Bad
<div style={{ borderRadius: 10, background: 'white' }}>
```

---

## 5. Supabase Rules

- ใช้ **server client** (`lib/supabase/server.ts`) ใน Server Component และ Route Handler
- ใช้ **browser client** (`lib/supabase/client.ts`) ใน Client Component
- **Realtime subscription** ต้องมี cleanup (unsubscribe) ใน useEffect return เสมอ
- **Error handling** ทุก Supabase call ต้องมี try/catch หรือตรวจ `error` จาก response

```ts
// ✅ Good
const { data, error } = await supabase.from('cards').select('*')
if (error) throw new Error(error.message)

// ❌ Bad
const { data } = await supabase.from('cards').select('*')
```

---

## 6. Zustand Rules

- แต่ละ store แยกไฟล์ใน `stores/`
- ใช้ **immer** ถ้า state ซับซ้อน (nested object)
- **Optimistic update** — อัปเดต store ก่อน แล้วค่อย call Supabase
- ถ้า Supabase error ให้ rollback state กลับ

---

## 7. Drag & Drop Rules (dnd-kit)

- ใช้ `DndContext` ครอบที่ `BoardCanvas.tsx` เท่านั้น
- `SortableContext` ใช้ใน `Column.tsx` แต่ละ column
- `handleDragEnd` logic อยู่ใน `BoardCanvas.tsx` — ห้ามแยกออกไป
- อัปเดต `position` ของ card ใน Supabase ทุกครั้งที่ drag

---

## 8. ห้ามทำ (Hard Rules)

- ❌ ห้ามใช้ `any` ใน TypeScript
- ❌ ห้ามเขียน CSS แยกไฟล์หรือ inline style
- ❌ ห้าม call Supabase ตรงใน component
- ❌ ห้ามแก้ไขไฟล์ใน `components/ui/`
- ❌ ห้าม commit ไฟล์ `.env.local`
- ❌ ห้ามใช้ `console.log` ใน production code — ใช้ `console.error` เฉพาะ error
- ❌ ห้ามสร้าง component ใหม่โดยไม่มี TypeScript interface

---

## 9. Git Workflow

- ก่อนเริ่มทำแต่ละ Day ให้แยก branch ใหม่เสมอ
  - format: `feat/day-X-description` เช่น `feat/day-4-column-card-ui`
- ระหว่าง Day ทำงาน commit ทุกครั้งที่ feature สำคัญเสร็จ
  - format: `feat: description` เช่น `feat: add KanbanCard component`
- พอจบแต่ละ Day ให้ push branch ขึ้น GitHub
- ก่อนเริ่ม Day ใหม่ให้ merge branch เดิมเข้า main ก่อน แล้วค่อยแยก branch ใหม่
- ❌ ห้าม commit ไฟล์ `.env.local` เด็ดขาด

---

## 10. ก่อน Code ทุกครั้ง ให้ตรวจ

1. อ่าน `prd.md` — feature นี้อยู่ใน scope ไหม?
2. อ่าน `design.md` — สี, font, radius ถูกต้องไหม?
3. อ่าน `architecture.md` — วางไฟล์ถูก folder ไหม?
4. Type อยู่ใน `types/index.ts` แล้วหรือยัง?