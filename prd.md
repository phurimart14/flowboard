# PRD — Kanban Board App

## 1. Overview

A collaborative Kanban board web application for small teams to manage tasks and projects together in real-time.

---

## 2. Goals

- ให้ทีมเล็กๆ จัดการ task ร่วมกันได้ในที่เดียว
- แสดงสถานะงานแบบ visual ชัดเจน
- ใช้งานง่าย ไม่ต้องเรียนรู้นาน

---

## 3. Target Users

ทีมขนาดเล็ก (2–10 คน) ที่ต้องการเครื่องมือจัดการโปรเจกต์ร่วมกัน เช่น startup, freelance team, หรือทีมนักศึกษา

---

## 4. Features

### 4.1 Authentication
- สมัครสมาชิกด้วย Email + Password
- Login / Logout
- ระบบจำ session (Supabase Auth)

### 4.2 Board Management
- สร้าง Board ใหม่ได้หลาย Board (แต่ละทีม/โปรเจกต์มี Board ของตัวเอง)
- ตั้งชื่อ Board และแก้ไขได้
- ลบ Board ได้
- เชิญ member เข้า Board ด้วย email

### 4.3 Columns (ต่อ 1 Board)
- 5 columns default: **Backlog → Todo → In Progress → Review → Done**
- ลำดับ column คงที่ (ไม่ต้อง drag column ใน MVP)

### 4.4 Cards
แต่ละ Card มี field ดังนี้:

| Field | Detail |
|---|---|
| Title | ชื่อ task (required) |
| Description | รายละเอียด (optional, markdown support) |
| Due Date | วันกำหนดส่ง (date picker) |
| Priority | High / Mid / Low (badge สี) |

- สร้าง Card ใหม่ใน column ใดก็ได้
- แก้ไข Card ได้ใน modal
- ลบ Card ได้
- **Drag & Drop** ย้าย Card ระหว่าง column ได้

### 4.5 Real-time
- เมื่อ member คนอื่นย้าย card หรือเพิ่ม card จะ update ให้ทุกคนเห็นทันที (Supabase Realtime)

---

## 5. Out of Scope (MVP)

- ไม่มี comment ใน card
- ไม่มี file attachment
- ไม่มี notification / email alert
- ไม่มี custom column (ใช้ 5 columns ที่กำหนดไว้)
- ไม่มี role permission (ทุก member ทำได้เท่ากัน)
- ไม่มี mobile app (responsive web เท่านั้น)

---

## 6. User Stories

```
As a user, I want to sign up and log in so that my data is saved.
As a user, I want to create multiple boards so that I can separate projects.
As a user, I want to invite teammates to a board so that we can collaborate.
As a user, I want to create cards with title, description, due date, and priority.
As a user, I want to drag cards between columns so that I can update task status.
As a user, I want to see changes in real-time so that I don't need to refresh.
```

---

## 7. Acceptance Criteria

- [ ] User สมัคร/login ได้ และ session ยังอยู่หลัง refresh
- [ ] สร้าง Board ใหม่ได้ และเห็น 5 columns พร้อมกัน
- [ ] เพิ่ม Card ได้ในทุก column
- [ ] Drag & drop card ระหว่าง column ได้ และ order บันทึกอยู่
- [ ] แก้ไข/ลบ card ได้
- [ ] เชิญ member เข้า board ด้วย email ได้
- [ ] เมื่อ member คนอื่น move card จะเห็น update ทันทีโดยไม่ต้อง refresh
- [ ] รองรับ dark mode และ light mode toggle

---

## 8. Timeline (2 สัปดาห์)

| Week | งาน |
|---|---|
| Week 1 | Setup project, Auth, Board + Column UI, Card CRUD |
| Week 2 | Drag & Drop, Realtime, Dark/Light mode, Deploy, Polish |
