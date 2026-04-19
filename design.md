# Design Spec — Kanban Board App

## 1. Visual Direction

- **Style:** Soft / Friendly — พาสเทล ดูเป็นมิตร ไม่หนักตา
- **Reference:** Trello — card เต็ม column เลื่อนซ้าย-ขวา
- **Theme:** Light + Dark mode (toggle ได้)

---

## 2. Color Palette

### Light Mode
| Token | Hex | ใช้ทำอะไร |
|---|---|---|
| `--bg-base` | `#EFF6FF` | พื้นหลังหลัก (ฟ้าอ่อนมาก) |
| `--bg-surface` | `#FFFFFF` | Card, Modal, Sidebar |
| `--bg-column` | `#DBEAFE` | พื้นหลัง Column |
| `--accent` | `#2563EB` | Button หลัก, Link, Active state |
| `--accent-hover` | `#1D4ED8` | Button hover |
| `--accent-soft` | `#BFDBFE` | Badge, Highlight อ่อนๆ |
| `--text-primary` | `#1E293B` | ข้อความหลัก |
| `--text-secondary` | `#64748B` | ข้อความรอง, Placeholder |
| `--border` | `#CBD5E1` | เส้นขอบ Card, Input |

### Dark Mode
| Token | Hex | ใช้ทำอะไร |
|---|---|---|
| `--bg-base` | `#0F172A` | พื้นหลังหลัก |
| `--bg-surface` | `#1E293B` | Card, Modal |
| `--bg-column` | `#1E3A5F` | พื้นหลัง Column |
| `--accent` | `#3B82F6` | Button หลัก, Link |
| `--accent-hover` | `#2563EB` | Button hover |
| `--accent-soft` | `#1E3A5F` | Badge, Highlight |
| `--text-primary` | `#F1F5F9` | ข้อความหลัก |
| `--text-secondary` | `#94A3B8` | ข้อความรอง |
| `--border` | `#334155` | เส้นขอบ |

### Priority Colors (ใช้ทั้ง Light & Dark)
| Priority | Badge Color | Text |
|---|---|---|
| High | `#FEE2E2` / text `#DC2626` | สีแดงอ่อน |
| Mid | `#FEF3C7` / text `#D97706` | สีเหลืองอ่อน |
| Low | `#D1FAE5` / text `#059669` | สีเขียวอ่อน |

---

## 3. Typography

| ใช้ทำอะไร | Font | Weight | Size |
|---|---|---|---|
| App name / Heading ใหญ่ | `Nunito` | 700 | 20–24px |
| Board title | `Nunito` | 600 | 18px |
| Column header | `Nunito` | 600 | 14px |
| Card title | `Nunito` | 500 | 14px |
| Body / Description | `Nunito` | 400 | 13px |
| Badge / Label | `Nunito` | 600 | 11px |

> ใช้ `Nunito` จาก Google Fonts — ดูกลมเป็นมิตร เข้ากับ Soft/Friendly style

---

## 4. Layout

### Structure
```
┌─────────────────────────────────────────────┐
│  Top Navbar (logo | board dropdown | user)  │
├─────────────────────────────────────────────┤
│                                             │
│   [Backlog] [Todo] [In Progress] [Review] [Done]  ← scroll ซ้าย-ขวา
│                                             │
│   card  card  card  card  card              │
│   card        card                          │
│   + Add card                                │
└─────────────────────────────────────────────┘
```

### Top Navbar
- **ซ้าย:** Logo + ชื่อ App
- **กลาง:** Board Dropdown (เลือก/สร้าง board)
- **ขวา:** Dark/Light toggle + User avatar + Logout

### Board Area
- Column เรียงซ้าย-ขวา แบบ horizontal scroll
- แต่ละ Column กว้างคงที่ `280px`
- Column header แสดงชื่อ + จำนวน card
- ปุ่ม `+ Add card` อยู่ด้านล่างแต่ละ column

---

## 5. Components

### Card
```
┌─────────────────────────┐
│ 🔴 High          15 Mar │  ← priority badge + due date
│                         │
│ Card Title              │
│ Description text...     │
└─────────────────────────┘
```
- `border-radius: 10px`
- `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`
- padding: `12px`
- Hover: เงาเข้มขึ้นเล็กน้อย + cursor grab
- Dragging: opacity 50% + scale 1.02

### Button (Primary)
- `border-radius: 8px`
- Background: `--accent`
- Padding: `8px 16px`
- Hover: `--accent-hover`
- Transition: `150ms ease`

### Modal (Edit Card)
- Overlay backdrop blur เบาๆ
- `border-radius: 12px`
- Max width: `480px`
- Fields: Title input, Description textarea, Date picker, Priority select

### Column Header
- พื้นหลัง: `--bg-column`
- `border-radius: 10px 10px 0 0`
- แสดง: ชื่อ column + `(จำนวน card)`

---

## 6. Border Radius Summary

| Element | Radius |
|---|---|
| Card | `10px` |
| Button | `8px` |
| Input / Select | `8px` |
| Modal | `12px` |
| Badge (Priority) | `6px` |
| Column header | `10px 10px 0 0` |

---

## 7. Spacing System

ใช้ base unit `4px` — Tailwind spacing scale

| Token | Value | ใช้ทำอะไร |
|---|---|---|
| `space-1` | 4px | gap เล็กมาก |
| `space-2` | 8px | padding ใน badge |
| `space-3` | 12px | padding ใน card |
| `space-4` | 16px | gap ระหว่าง element |
| `space-6` | 24px | padding ใน modal |
| `space-8` | 32px | margin section |

---

## 8. Animation & Interaction

| Action | Effect |
|---|---|
| Card drag start | `opacity: 0.5`, `scale: 1.02` |
| Card drop | snap เข้าที่พร้อม `transition: 200ms` |
| Button click | `scale: 0.97` brief |
| Modal open | `fade in + slide up 8px`, `150ms` |
| Theme toggle | `transition: background 300ms ease` |
| Card hover | `box-shadow` เข้มขึ้น `150ms` |

---

## 9. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| ใช้ Nunito ทั้ง app | ใช้ Inter, Arial, system font |
| สีพาสเทลฟ้าเป็น base | ใช้ gradient ม่วง/ชมพู |
| Rounded corner ทุก element | ใช้ sharp corner 0px |
| Soft shadow บน card | ใช้ shadow เข้มหนัก |
| Animation เบาๆ subtle | Animation เยอะจนเสียสมาธิ |
