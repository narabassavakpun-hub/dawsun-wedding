# CLAUDE.md — คู่มือ repo

เว็บ e-card งานแต่งงาน **Wandee × Naruebet** (#DAWSUNWEDDING) · หน้าเดียว เลื่อนลงดู 13 ตอน · static ล้วน รันฟรีบน GitHub Pages

**อ่านก่อนเริ่มงานเสมอ** — [brand.md](brand.md) ระบบดีไซน์ · [prd.md](prd.md) สเปกฟีเจอร์และเกณฑ์ผ่าน

---

## Stack

| | |
|---|---|
| Build | Vite 7 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + CSS custom properties |
| Animation | `motion` (Framer Motion v12) · `lenis` (smooth scroll) · `canvas-confetti` |
| Backend | Google Apps Script → Google Sheet (เขียนอย่างเดียว) |
| Hosting | GitHub Pages ผ่าน GitHub Actions |

---

## คำสั่ง

```bash
npm install            # ติดตั้ง
npm run dev            # dev server → http://localhost:5173
npm run build          # build → dist/
npm run preview        # ดู build ก่อน deploy (ทดสอบ base path ที่นี่)
npm run lint           # ตรวจ type ด้วย tsc (ไม่ได้ใช้ ESLint)
npm run optimize       # แปลงรูปจาก รูปจริง/ → public/images/*.webp + สร้าง manifest
npm run og             # สร้างรูปพรีวิว 1200×630 สำหรับแชร์ LINE
```

---

## โครงไฟล์

```
├─ src/
│  ├─ App.tsx                 ประกอบ 13 ตอน + global layers + สถานะ "เปิดซองแล้ว"
│  ├─ config/site.ts        ⭐ ข้อมูลงาน ข้อความ รูป ลิงก์ — ทั้งหมดอยู่ที่นี่
│  ├─ config/images.generated.ts  สร้างจาก npm run optimize (อย่าแก้มือ)
│  ├─ styles/theme.css        design tokens จาก brand.md
│  ├─ sections/               Envelope · Hero · Invitation · Profiles · HeartCalendar
│  │                          Timeline · Gallery · Location · DressCode · Guestbook
│  │                          Gift · ShareSave · Footer   (เรียงตามลำดับบนหน้าเว็บ)
│  ├─ components/             Monogram · Ornaments · Toast · Lightbox
│  │                          MusicPlayer · PetalCanvas · ScrollProgress
│  ├─ hooks/                  useCountdown · useMotionPreference · useLenis
│  └─ lib/                    motion (ค่ากลาง) · submitWish · ics · clipboard · celebrate
├─ public/images/           couple-01..10.webp · og.jpg · promptpay-qr.png(⏳ ต้องใส่เอง)
├─ public/audio/            theme.mp3 (⏳ ต้องใส่เอง)
├─ scripts/                 optimize-images.mjs · make-og.mjs
├─ apps-script/Code.gs      คัดลอกไปวางใน Google Apps Script
├─ รูปจริง/                  ต้นฉบับรูป (อย่าลบ — scripts/optimize อ่านจากที่นี่)
└─ ภาพตัวอย่าง/               reference ดีไซน์ ไม่ได้ใช้ในเว็บ
```

> โฟลเดอร์ที่มี ⏳ ยังไม่มีไฟล์จริง — มี `README.md` อธิบายข้อกำหนดอยู่ในโฟลเดอร์นั้น
> เว็บทำงานได้ปกติแม้ไฟล์ยังไม่มา (แสดง placeholder แทน)

---

## กติกาสำคัญ

### 1. ⭐ ห้าม hardcode เนื้อหาลง component
ข้อความ ชื่อคน วันที่ ที่อยู่ พาธรูป ลิงก์ — **ทุกอย่างอยู่ใน `src/config/site.ts`** เท่านั้น
เจ้าของงานต้องแก้ข้อมูลได้โดยเปิดไฟล์เดียว ไม่ต้องไล่หาใน component

### 2. ⭐ ห้ามใส่ค่าสีดิบ
ใช้ CSS variable จาก `theme.css` เสมอ (`var(--script-pink)`) ไม่ใช่ `#E8608E`
สีทุกตัวสกัดจากการ์ดเชิญจริง เปลี่ยนต้องเปลี่ยนที่ [brand.md](brand.md) ก่อน

### 3. ⭐ ข้อมูลงานต้องตรงการ์ดเชิญ 100%
ชื่อ ยศ วันที่ เวลา (07.39 / 09.39 / 11.09) สถานที่ — ห้ามเดา ห้ามปัดเศษ
ต้นฉบับอยู่ที่ `รูปจริง/รูปการ์ดเชิญ.jpg` และสรุปไว้ใน [prd.md](prd.md) ข้อ 3

### 4. อนิเมชันใช้ `transform` / `opacity` เท่านั้น
ห้ามอนิเมต `width` `height` `top` `left` `margin` — ทำให้กระตุกบนมือถือ

### 5. ทุกอนิเมชันต้องเคารพ `prefers-reduced-motion`
ทุก section รับ prop `reduced` ที่มาจาก `useMotionPreference()` ใน `App.tsx`
ดูตารางพฤติกรรมที่ต้องปรับใน [brand.md](brand.md) ข้อ 5.4

### 6. Mobile-first จริงจัง
ออกแบบและทดสอบที่ **375px** ก่อน แขกเกิน 90% เปิดจาก LINE บนมือถือ
ใช้ `svh` ไม่ใช่ `vh` (กัน address bar มือถือดันเนื้อหา)

### 7. ข้อความไทย
- `line-height` ขั้นต่ำ **1.75** (สระบน-ล่างซ้อนกัน)
- **ห้าม `letter-spacing`** กับข้อความไทย (สระจะหลุดจากพยัญชนะ)
- ใช้ได้เฉพาะกับข้อความอังกฤษตัวพิมพ์ใหญ่

### 8. อย่าอ้างพาธโฟลเดอร์ภาษาไทยในโค้ด
`รูปจริง/` ใช้ได้เฉพาะใน `scripts/optimize-images.mjs` เท่านั้น
โค้ดฝั่งเว็บอ้าง `public/images/couple-XX.webp` เสมอ

---

## วิธีแก้ของที่แก้บ่อย

| อยากทำ | ทำที่ไหน |
|---|---|
| แก้ชื่อ/วันที่/ที่อยู่/เวลา | `src/config/site.ts` |
| เปลี่ยนเพลง | วางไฟล์ทับ `public/audio/theme.mp3` (mp3, < 4 MB) |
| ใส่ QR PromptPay | วางไฟล์ทับ `public/images/promptpay-qr.png` (≥ 600×600 มีขอบขาว) |
| ใส่ลิงก์ Google Maps จริง | `site.ts` → `venue.mapUrl` |
| เพิ่ม/เปลี่ยนรูปแกลเลอรี | วางรูปใน `รูปจริง/รูปเจ้าบ่าว เจ้าสาว/` → `npm run optimize` → แก้ `site.ts` → `gallery` |
| เปลี่ยนสีธีม | `brand.md` ก่อน แล้วค่อยแก้ `src/styles/theme.css` |
| เปลี่ยน URL Apps Script | `.env.local` (dev) และ GitHub secret `VITE_WISH_ENDPOINT` (prod) |

---

## Backend: Google Sheet + Drive

หลังบ้านตัวเดียวรับ 2 อย่าง แยกด้วยฟิลด์ `type` ใน payload:

| ส่งอะไร | `type` | ปลายทาง |
|---|---|---|
| คำอวยพร | (ไม่ระบุ) | ชีต `Sheet1` |
| สลิปของขวัญ | `'slip'` | ไฟล์ลง Google Drive + ชีต `Slips` |

> ทั้งสองชีตและโฟลเดอร์ Drive สคริปต์สร้างให้อัตโนมัติครั้งแรกที่มีข้อมูลเข้า

1. สร้าง Google Sheet ใหม่ (ไม่ต้องใส่หัวคอลัมน์เอง)
2. เมนู **ส่วนขยาย → Apps Script** → วางโค้ดจาก `apps-script/Code.gs`
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** ← สำคัญ ถ้าเป็น "Anyone with Google account" จะใช้ไม่ได้
   - ครั้งแรกจะขออนุญาตเข้าถึง **Google Drive** → ต้องกดอนุญาต (ใช้เก็บไฟล์สลิป)
4. คัดลอก URL ที่ได้ → ใส่ `.env.local`:
   ```
   VITE_WISH_ENDPOINT=https://script.google.com/macros/s/xxxxx/exec
   ```
5. บน GitHub: **Settings → Secrets and variables → Actions** → เพิ่ม secret ชื่อเดียวกัน

> **ทำไมส่งเป็น `text/plain`** — Apps Script ไม่ตอบ CORS preflight ถ้าส่ง `application/json` จะโดนเบราว์เซอร์บล็อก
> การส่ง `text/plain` ทำให้เป็น simple request ที่ไม่เกิด preflight — **อย่าเปลี่ยนกลับเป็น JSON**

> ⚠️ URL นี้เปิดสาธารณะใน JS bundle → validation และ rate limit ต้องมีฝั่ง Apps Script ด้วย ไม่พึ่ง client อย่างเดียว

> ⚠️ **แก้ `Code.gs` แล้วต้อง Deploy ใหม่ทุกครั้ง** — Deploy → Manage deployments → Edit → Version: **New version**
> ถ้าไม่ทำ URL เดิมจะยังรันโค้ดเก่า อาการที่เจอคือส่งสลิปแล้วได้ `{"ok":false,"error":"invalid"}`
> เพราะสคริปต์เก่ายังไม่รู้จัก `type: 'slip'` แล้วเอาไปเข้าเส้นทางคำอวยพรซึ่งบังคับต้องมีข้อความ

---

## Deploy

Push เข้า `main` → GitHub Actions build แล้วขึ้น Pages อัตโนมัติ

**ตั้งครั้งแรก** — Settings → Pages → Source: **GitHub Actions**

**Base path** — ตั้งใน `vite.config.ts`:
- repo ชื่อ `e-card` → `base: '/e-card/'`
- repo ชื่อ `<username>.github.io` → `base: '/'`

ผิดตรงนี้ = รูปกับ CSS จะ 404 ทั้งเว็บ **ทดสอบด้วย `npm run preview` ก่อนเสมอ**

---

## Checklist ก่อน push

- [ ] `npm run build` ผ่าน ไม่มี error
- [ ] `npm run preview` แล้วรูป/เพลง/ฟอนต์โหลดครบ (ไม่ 404)
- [ ] ดูที่ 375px แล้วไม่มีอะไรล้นขอบจอ
- [ ] เปิดใหม่แล้วซองปิดอยู่ · แตะแล้วเปิดได้ · เพลงเล่น · scroll ปลดล็อก
- [ ] Countdown ตรงกับ 18 ต.ค. 2026 07:39 น. (ลองสลับ timezone เครื่อง)
- [ ] ส่งคำอวยพรทดสอบ → เข้า Google Sheet
- [ ] DevTools → Rendering → emulate `prefers-reduced-motion` → ยังใช้งานได้ครบ
- [ ] ข้อมูลตรงการ์ดเชิญ (เทียบกับ `รูปจริง/รูปการ์ดเชิญ.jpg`)

---

## ข้อควรระวังที่เจอบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| **ไฟล์ที่เพิ่งวางหายไปเอง** | วางลง `dist/images/` แทน `public/images/` — **`dist/` ถูกล้างทิ้งทั้งโฟลเดอร์ทุกครั้งที่ `npm run build`** สองโฟลเดอร์นี้หน้าตาเหมือนกันใน VS Code ให้วางที่ **`public/`** เสมอ แล้ว build จะคัดลอกไป `dist/` ให้เอง |
| เพลงไม่เล่น | เบราว์เซอร์บล็อก autoplay — ต้องเริ่มเล่นใน event handler ของ "แตะซอง" เท่านั้น ห้ามเรียก `play()` ใน `useEffect` |
| รูป 404 บน Pages | `base` ใน `vite.config.ts` ไม่ตรงชื่อ repo |
| พื้นหลังท้องฟ้าไม่ fixed บน iOS | iOS Safari มีบั๊ก `background-attachment: fixed` — ใช้ `<div>` ชั้น `position: fixed; inset: 0; z-index: -1` แทน |
| Countdown เพี้ยนข้ามโซนเวลา | ต้องตรึง `2026-10-18T07:39:00+07:00` ห้ามใช้ `new Date(2026, 9, 18)` |
| เว็บกระตุก/ร้อนเครื่อง | canvas ไม่หยุดตอนแท็บถูกซ่อน — ต้องเช็ก `document.hidden` |
| ฟอนต์ไทยกระโดดตอนโหลด | ขาด `preconnect` หรือ `display=swap` |
| ปฏิทินวางวันผิด | 1 ต.ค. 2026 = วันพฤหัสบดี · 18 ต.ค. 2026 = **วันอาทิตย์** |
