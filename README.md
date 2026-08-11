# 💌 Wedding E-Card — Wandee × Naruebet

การ์ดเชิญงานแต่งงานออนไลน์ เลื่อนลงอ่านต่อเนื่อง 13 ตอน · รันฟรี 100% บน GitHub Pages

**#DAWSUNWEDDING** · วันอาทิตย์ที่ 18 ตุลาคม 2569 · ริมธารา RIMTARA พระราม 3

| เอกสาร | เนื้อหา |
|---|---|
| [brand.md](brand.md) | ระบบดีไซน์ — สี ฟอนต์ อนิเมชัน โทนเสียง (สกัดจากการ์ดเชิญจริง) |
| [prd.md](prd.md) | สเปกฟีเจอร์ 13 ตอน + เกณฑ์ผ่านแต่ละตอน |
| [CLAUDE.md](CLAUDE.md) | คู่มือ repo สำหรับคนที่มาแก้ต่อ |

---

## เริ่มใช้งาน

```bash
npm install
npm run dev          # → http://localhost:5173
```

> ครั้งแรกที่ clone repo มาใหม่ ให้รัน `npm run optimize` ก่อน
> เพื่อสร้างไฟล์รูป `public/images/couple-*.webp` จากรูปต้นฉบับ

---

## คำสั่งทั้งหมด

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | เปิด dev server |
| `npm run build` | ตรวจ type แล้ว build ลง `dist/` |
| `npm run preview` | ดูผลลัพธ์ที่ build แล้ว (**ทดสอบ base path ที่นี่ก่อน deploy**) |
| `npm run lint` | ตรวจ type อย่างเดียว |
| `npm run optimize` | แปลงรูปต้นฉบับ → WebP + สร้าง manifest |
| `npm run og` | สร้างรูปพรีวิว 1200×630 สำหรับแชร์ลง LINE |

---

## ✅ สิ่งที่ต้องทำก่อนส่งลิงก์จริง

### 1. ใส่ไฟล์เพลง
วาง `theme.mp3` (เพลงบรรเลง royalty-free) ใน `public/audio/`
→ วิธีหาเพลงและข้อกำหนด: [public/audio/README.md](public/audio/README.md)

### 2. ใส่ QR PromptPay
วาง `promptpay-qr.png` ใน `public/images/`
→ ข้อกำหนดและวิธีทดสอบ: [public/images/README.md](public/images/README.md)

### 3. ต่อ Google Sheet สำหรับเก็บคำอวยพร
1. สร้าง Google Sheet ใหม่
2. **ส่วนขยาย → Apps Script** → วางโค้ดจาก [`apps-script/Code.gs`](apps-script/Code.gs)
3. **Deploy → New deployment → Web app**
   - Execute as: `Me`
   - Who has access: **`Anyone`** ← ถ้าเลือกผิด เว็บจะเรียกไม่ได้
4. คัดลอก URL → สร้างไฟล์ `.env.local`:
   ```
   VITE_WISH_ENDPOINT=https://script.google.com/macros/s/xxxxx/exec
   ```
5. บน GitHub: **Settings → Secrets and variables → Actions** → เพิ่ม secret ชื่อเดียวกัน

### 4. ใส่ลิงก์ Google Maps ตัวจริง
แก้ [`src/config/site.ts`](src/config/site.ts) → `venue.mapUrl`
(ตอนนี้ใช้ลิงก์ค้นหาชื่อสถานที่ ซึ่งเปิดใช้งานได้แล้ว แต่ปักหมุดตรงกว่าถ้าใส่ลิงก์จริงจาก QR บนการ์ด)

### 5. ตรวจข้อมูลให้ตรงการ์ดเชิญ
เทียบ `src/config/site.ts` กับ `รูปจริง/รูปการ์ดเชิญ.jpg` — **ให้เจ้าของงานตรวจอีกรอบ**

---

## Deploy ขึ้น GitHub Pages

```bash
git init
git add .
git commit -m "wedding e-card"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

จากนั้นบน GitHub: **Settings → Pages → Source: `GitHub Actions`**

ทุกครั้งที่ push เข้า `main` จะ build และขึ้นเว็บอัตโนมัติ
ได้ลิงก์เป็น `https://<username>.github.io/<repo>/`

> **base path** — workflow ตั้ง `VITE_BASE` ให้อัตโนมัติตามชื่อ repo
> ถ้าตั้งชื่อ repo เป็น `<username>.github.io` ต้องแก้ `VITE_BASE` เป็น `/`
> ใน [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## โครงสร้าง 13 ตอน

| # | ตอน | ลูกเล่น |
|---|---|---|
| 1 | ซองจดหมาย | ตราครั่ง W N · แตะเปิด · ฝาซองพลิก 3D · ปลดล็อกเพลง |
| 2 | Hero | รูปเต็มจอ + parallax + ลูกศรหัวใจ |
| 3 | คำเชิญ + บิดามารดา | ข้อความจากการ์ดจริง |
| 4 | Monogram + บ่าวสาว | W N วาดเส้นทีละเส้น · กรอบโค้ง arch · แหวนคู่ |
| 5 | ปฏิทิน + Countdown | **หัวใจกระพริบรอบวันที่ 18** · นับถอยหลังรายวินาที |
| 6 | กำหนดการ | 3 พิธี · เส้นไทม์ไลน์วาดตาม scroll |
| 7 | แกลเลอรี | masonry 10 รูป · lightbox ปัดเปลี่ยนรูป |
| 8 | สถานที่ | แผนที่ · ปุ่มเปิด Google Maps · แตะที่อยู่เพื่อคัดลอก |
| 9 | Dress Code | 5 สีธีม · แตะคัดลอกรหัสสี |
| 10 | เขียนคำอวยพร | ส่งลง Google Sheet · **คอนเฟตติหัวใจ** ตอนสำเร็จ |
| 11 | ร่วมมอบของขวัญ | QR PromptPay + ปุ่มบันทึกรูป |
| 12 | แชร์และบันทึก | แชร์ LINE · คัดลอกลิงก์ · เพิ่มลงปฏิทิน `.ics` |
| 13 | Footer | Monogram · #DAWSUNWEDDING |

**ลอยทับทุกตอน** — ปุ่มเพลงหัวใจ · กลีบดอกไม้/หัวใจ/ประกายลอย · แถบ scroll progress

---

## Stack

Vite · React · TypeScript · Tailwind CSS v4 · Motion (Framer Motion) · Lenis · canvas-confetti
ไม่มีเซิร์ฟเวอร์ ไม่มีฐานข้อมูล ไม่มีค่าใช้จ่าย

## Accessibility

รองรับ `prefers-reduced-motion` ครบทุกอนิเมชัน · เข้าถึงด้วยคีย์บอร์ดได้ทั้งหมด
พื้นที่แตะ ≥ 44px · contrast ตัวอักษร ≥ 7:1 · ไม่มี tracker หรือ cookie
