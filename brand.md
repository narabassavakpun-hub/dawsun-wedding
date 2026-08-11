# Brand Guide — Wandee × Naruebet Wedding E-Card

> **#DAWSUNWEDDING** · 18 October 2026 · ริมธารา RIMTARA พระราม 3
> เอกสารนี้คือ **แหล่งความจริงเดียว** ของงานดีไซน์ทั้งหมด สีและฟอนต์ทุกตัวสกัดมาจากการ์ดเชิญและซองจริง
> โค้ดทุกบรรทัดต้องอ้างอิง token จากไฟล์นี้ ห้ามใส่ค่าสีดิบลงใน component

---

## 1. Brand Essence

| | |
|---|---|
| **Concept** | *Dreamy Pastel Sky* — ท้องฟ้ายามเช้าสีพาสเทลไล่เฉด อ่อนโยน โปร่ง มีประกาย |
| **Personality** | อ่อนหวาน · อบอุ่น · สะอาดตา · เล่นสนุกได้นิดๆ · ไม่หรูจนเกร็ง |
| **Feeling ที่ต้องได้** | เปิดลิงก์แล้ว "ว้าว" ภายใน 3 วินาที แล้วอยากเลื่อนดูต่อจนจบ |
| **สิ่งที่ต้องหลีกเลี่ยง** | โทนเข้ม/ดำ · เหลี่ยมคม · ฟอนต์หนาทึบ · อนิเมชันกระตุก · เอฟเฟกต์เยอะจนอ่านไม่ออก |

**Signature marks**
- **Monogram `W N`** — จากตราครั่งบนซองจริง ใช้เป็นโลโก้ · favicon · ตราปิดซอง · ลายน้ำท้ายหน้า
- **หัวใจ** — เป็นโมทีฟหลัก ใช้เป็น cursor ปุ่ม play, วงกลมรอบวันที่ในปฏิทิน, อนุภาคลอย, ลูกศรเลื่อนลง

---

## 2. Color Palette

### 2.1 Sky Gradient — พื้นหลังหลักของทั้งเว็บ

ไล่เฉดแนวทแยง 160° เลียนแบบพื้นหลังการ์ดจริง

| Stop | Token | Hex | ตำแหน่ง |
|---|---|---|---|
| 1 | `--sky-lavender` | `#C8BFE7` | 0% |
| 2 | `--sky-blush` | `#F3C6D6` | 35% |
| 3 | `--sky-peach` | `#F8D9C0` | 70% |
| 4 | `--sky-cream` | `#FDF6EE` | 100% |

```css
--gradient-sky: linear-gradient(160deg,
  var(--sky-lavender) 0%,
  var(--sky-blush) 35%,
  var(--sky-peach) 70%,
  var(--sky-cream) 100%);
```

> ใช้เป็น `background-attachment: fixed` บน `<body>` เพื่อให้เนื้อหาเลื่อนผ่านท้องฟ้าที่นิ่งอยู่ — ได้ความรู้สึกลอย
> **ยกเว้น iOS Safari** ที่ `fixed` มีบั๊ก → ใช้ `<div>` ชั้น `position: fixed; inset: 0; z-index: -1` แทน

### 2.2 Theme Colors — 5 สีจากแถบ "THEME COLOR" บนการ์ด

ใช้ในส่วน Dress Code, จุดตกแต่ง, สีอนุภาค, สีคอนเฟตติ

| Token | Hex | ชื่อไทย | ใช้กับ |
|---|---|---|---|
| `--theme-pink` | `#F4A9BE` | ชมพูหวาน | สีนำ ปุ่มหลัก คอนเฟตติ |
| `--theme-lavender` | `#B9AEE8` | ม่วงลาเวนเดอร์ | ไล่เฉดคู่ชมพู เงา |
| `--theme-blue` | `#9FD0EE` | ฟ้าใส | ไฮไลต์เย็น ประกาย |
| `--theme-cream` | `#F8DFA8` | ครีมทอง | ประกายทอง ตัวเลข countdown |
| `--theme-peach` | `#F7BE94` | พีชอบอุ่น | กลีบดอกไม้ พื้นการ์ดอุ่น |

### 2.3 Ink & Accent

| Token | Hex | ที่มา | ใช้กับ |
|---|---|---|---|
| `--script-pink` | `#E8608E` | ลายมือ "Wandee Naruebet" | โลโก้สคริปต์ หัวข้อรอง ลิงก์ |
| `--seal-magenta` | `#B5246B` | ตราครั่งบนซอง | ตราครั่ง W N, ปุ่ม CTA, hover |
| `--dusty-blue` | `#7FA6B5` | คำว่า WANDEE / NARUEBET | หัวข้อ serif ตัวใหญ่ ตัวเลขวันที่ |
| `--ink` | `#4A4550` | — | ตัวอักษรเนื้อหา |
| `--ink-muted` | `#8C8592` | — | คำอธิบาย caption ป้ายกำกับ |
| `--paper` | `#FFFCFA` | — | พื้นการ์ด/แผ่นกระดาษ |
| `--paper-warm` | `#FDF6EE` | — | พื้นการ์ดโทนอุ่น |

### 2.4 กติกาการใช้สี

1. **พื้นหลังท้องฟ้าคงที่ทั้งเว็บ** — เนื้อหาวางบน "แผ่นกระดาษ" สีขาวนวล `--paper` โปร่ง 82-92% + `backdrop-filter: blur(12px)` เพื่อให้เห็นท้องฟ้าเบลอผ่าน
2. **หนึ่งตอน = หนึ่งสีนำ** — ห้ามใช้ครบ 5 สีธีมพร้อมกันในตอนเดียว ยกเว้นตอน Dress Code เท่านั้น
3. **Contrast** — ตัวอักษรเนื้อหาต้องใช้ `--ink` บน `--paper` เสมอ (อัตราส่วน 9.2:1 ผ่าน WCAG AAA) ห้ามใช้สีพาสเทลเป็นสีตัวอักษรบนพื้นอ่อน
4. **สีพาสเทลใช้เป็นสี "ตกแต่ง" เท่านั้น** — เส้น ขอบ พื้นหลังปุ่ม ไอคอน อนุภาค ไม่ใช่สีข้อความ
5. **ปุ่ม CTA** ใช้ `--seal-magenta` พื้นทึบ ตัวอักษรขาว (5.8:1 ผ่าน AA) เป็นสีเดียวที่ "เข้ม" ได้ในเว็บนี้

---

## 3. Typography

โหลดจาก Google Fonts ทั้งหมด (ฟรี ใช้เชิงพาณิชย์ได้) — เรียก **ครั้งเดียว** ด้วย URL รวม + `display=swap` + `preconnect`

| Role | Font | Weight | ใช้กับ |
|---|---|---|---|
| **Script logotype** | `Great Vibes` | 400 | "Wandee Naruebet", "Daw & Sun" |
| **Display EN** | `Cormorant Garamond` | 300 / 400 | WANDEE · NARUEBET · SAVE THE DATE · LOCATION |
| **Display TH** | `Charm` | 400 / 700 | หัวข้อภาษาไทย "กำหนดการ" "คำอวยพร" |
| **Script TH** | `Charmonman` | 400 | คำโปรยลายมือไทย ใช้น้อยๆ เน้นบรรยากาศ |
| **Body TH/EN** | `Sarabun` | 300 / 400 / 600 | เนื้อหา ที่อยู่ ฟอร์ม ปุ่ม |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@300;400&family=Charm:wght@400;700&family=Charmonman&family=Sarabun:wght@300;400;600&display=swap">
```

### 3.1 Type Scale (mobile-first, หน่วย `clamp()` ปรับตามจอ)

| Token | ขนาด | Line-height | Letter-spacing | ตัวอย่าง |
|---|---|---|---|---|
| `--fs-script-hero` | `clamp(3rem, 14vw, 6rem)` | 1.1 | 0 | Wandee Naruebet |
| `--fs-display-xl` | `clamp(2.25rem, 9vw, 4rem)` | 1.15 | `0.14em` | WANDEE |
| `--fs-display-lg` | `clamp(1.75rem, 6.5vw, 2.75rem)` | 1.25 | `0.12em` | SAVE THE DATE |
| `--fs-display-md` | `clamp(1.35rem, 5vw, 1.9rem)` | 1.4 | `0.08em` | LOCATION |
| `--fs-body-lg` | `clamp(1.05rem, 4vw, 1.2rem)` | **1.85** | 0 | ข้อความเชิญ |
| `--fs-body` | `clamp(0.95rem, 3.6vw, 1.05rem)` | **1.8** | 0 | เนื้อหาทั่วไป |
| `--fs-caption` | `clamp(0.8rem, 3.2vw, 0.9rem)` | **1.7** | `0.04em` | caption, ป้ายกำกับ |

### 3.2 กติกาตัวอักษรไทย ⚠️

- **`line-height` ขั้นต่ำ 1.75** สำหรับเนื้อหาไทย — สระบน (ิ ี ึ ื ั ็ ์) และวรรณยุกต์ซ้อนกัน 2 ชั้น ถ้าบรรทัดชิดจะทับกัน
- **ห้าม `letter-spacing` > 0 กับข้อความไทย** — จะทำให้สระลอยหลุดจากพยัญชนะ ใช้ได้เฉพาะข้อความอังกฤษตัวพิมพ์ใหญ่
- **ห้าม `text-transform: uppercase`** กับข้อความไทย (ไม่มีผล แต่บางเบราว์เซอร์ทำ layout เพี้ยน)
- **ห้ามใช้ `Charmonman` กับข้อความยาว** — เป็นฟอนต์ลายมือ อ่านยาก จำกัดที่ 1 บรรทัดต่อการใช้งาน
- ชื่อคนไทยที่ยาว (เช่น "จ.ส.อ. เนตร เสวกพันธ์") ต้อง `white-space: nowrap` หรือกำหนดจุดตัดบรรทัดเอง อย่าให้เบราว์เซอร์ตัดกลางชื่อ
- ตัวเลขวันที่แบบไทย ใช้เลขอารบิก (18, 2569) ตามการ์ดจริง ไม่ใช้เลขไทย

---

## 4. Layout & Spacing

### 4.1 Grid

- **Mobile-first จริงจัง** — แขกเกิน 90% เปิดจาก LINE บนมือถือ ออกแบบที่ **375px** ก่อนเสมอ
- `--content-max: 42rem` (672px) — เนื้อหาไม่กว้างเกินนี้แม้บนเดสก์ท็อป เพื่อรักษาสัดส่วน "การ์ดเชิญ"
- `--page-gutter: clamp(1.25rem, 6vw, 2.5rem)`
- ทุก section สูงอย่างน้อย `min-height: 100svh` (ใช้ `svh` ไม่ใช่ `vh` — กัน address bar มือถือดันเนื้อหา)

### 4.2 Spacing Scale (8px base)

`--sp-1: 0.5rem` · `--sp-2: 1rem` · `--sp-3: 1.5rem` · `--sp-4: 2rem` · `--sp-6: 3rem` · `--sp-8: 4rem` · `--sp-12: 6rem`

ระยะห่างระหว่าง section: `--sp-12` บนมือถือ, `8rem` บนเดสก์ท็อป

### 4.3 Radius & Elevation

| Token | ค่า | ใช้กับ |
|---|---|---|
| `--radius-sm` | `12px` | ปุ่ม, input |
| `--radius-md` | `20px` | การ์ดเนื้อหา |
| `--radius-lg` | `28px` | การ์ดใหญ่, แผนที่ |
| `--radius-arch` | `999px 999px 20px 20px` | **กรอบรูปทรงโค้ง arch** — ลายเซ็นของงานนี้ |
| `--shadow-soft` | `0 8px 32px -12px rgba(184, 140, 170, 0.28)` | การ์ดทั่วไป |
| `--shadow-lift` | `0 20px 60px -20px rgba(160, 120, 150, 0.35)` | ซองจดหมาย, lightbox |

> **ห้ามใช้เงาสีดำ** — ใช้เงาโทนม่วง-ชมพูเสมอ เพื่อให้กลมกลืนกับท้องฟ้าพาสเทล

---

## 5. Motion Language

### 5.1 ค่ามาตรฐาน

```ts
export const EASE = [0.22, 1, 0.36, 1] as const;  // easeOutQuint — นุ่ม ไม่เด้ง
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const; // สำหรับ UI ทั่วไป

export const DURATION = {
  fast: 0.3,    // hover, ปุ่ม
  base: 0.6,    // เผยตัวเนื้อหา
  slow: 1.0,    // ภาพใหญ่, parallax
  reveal: 1.2,  // ซองเปิด, monogram วาดเส้น
};
```

### 5.2 Scroll Reveal — แพทเทิร์นเดียวใช้ทั้งเว็บ

```
initial:  { opacity: 0, y: 24 }
animate:  { opacity: 1, y: 0 }
viewport: { once: true, margin: '-12% 0px' }
stagger:  0.08s ต่อลูก
```

> `once: true` เสมอ — ห้ามให้เนื้อหาหายไปตอนเลื่อนกลับขึ้น เพราะทำให้แขกสับสน

### 5.3 กติกาการเคลื่อนไหว

1. **Parallax ไม่เกิน 15%** ของความสูง viewport — มากกว่านี้จะเวียนหัวบนมือถือ
2. **อนิเมชันวนซ้ำต้องช้าและเบา** — หัวใจกระพริบ 2s/รอบ, กลีบดอกไม้ลอยลง 12-20s/รอบ
3. **ห้ามอนิเมต `width` / `height` / `top` / `left`** — ใช้ `transform` และ `opacity` เท่านั้น (GPU compositing)
4. **หนึ่งจอ = หนึ่งจุดสนใจ** — อย่าให้มีอะไรขยับพร้อมกันเกิน 2 อย่างในสายตา
5. **ทุกอนิเมชันต้องข้ามได้** — แตะที่ใดก็ได้ระหว่างซองเปิด ให้ข้ามไปสถานะจบทันที

### 5.4 `prefers-reduced-motion: reduce` — บังคับทำ

| ปกติ | เมื่อ reduce |
|---|---|
| Parallax | ปิดทั้งหมด |
| กลีบ/หัวใจ/ประกายลอย | ปิด canvas ทั้งชั้น |
| หัวใจกระพริบในปฏิทิน | เป็นหัวใจนิ่ง ไม่ pulse |
| ซองเปิด 3D | fade เข้าหน้าเนื้อหาใน 0.3s |
| Scroll reveal `y: 24` | เหลือแค่ fade (`y: 0`) |
| คอนเฟตติ | แสดงข้อความขอบคุณเฉยๆ |
| Lenis smooth scroll | ปิด ใช้ native scroll |

---

## 6. Imagery

### 6.1 ลักษณะรูปที่มี

พรีเวดดิ้งถ่ายในสตูดิโอ พื้นหลังเทา-ขาวเรียบ แสงสว่างนวล มี 2 อารมณ์:
- **ทางการ** — ทักซิโด้ขาวปกดำ / ชุดเจ้าสาวลูกไม้ยาว + ผ้าคลุมหน้า
- **สบายๆ น่ารัก** — เสื้อยืดขาว กางเกงเขียวขี้ม้า แว่นกันแดด ท่าขี่หลัง

### 6.2 กติกาการใช้รูป

1. **Overlay พาสเทลบางๆ** ทับทุกรูป — `linear-gradient(to bottom, transparent 40%, rgba(243,198,214,0.18))` เพื่อผูกรูปสตูดิโอโทนเทาเข้ากับธีมท้องฟ้าชมพู
2. **กรอบ arch** (`--radius-arch`) สำหรับรูปโปรไฟล์บ่าวสาว — เป็นลายเซ็นของงาน
3. **รูปแนวตั้งเป็นหลัก** — 8 ใน 10 รูปเป็น portrait เข้ากับการดูบนมือถือพอดี
4. **ห้ามครอปหน้าคน** — ใช้ `object-position` ปรับให้ใบหน้าอยู่ในกรอบเสมอ
5. **ทุกรูปต้องมี `alt`** ภาษาไทยที่บรรยายจริง ไม่ใช่ "รูปภาพ 1"

### 6.3 การจัดสรรรูป

| ไฟล์ต้นฉบับ | ใช้ที่ | เหตุผล |
|---|---|---|
| `S__63914032` | **Hero** (ตอนที่ 2) | ใกล้ชิด หน้าชนหน้า ยิ้มมองตากัน — อารมณ์แรงสุด |
| `S__63914039` | **โปรไฟล์คู่บ่าวสาว** (ตอนที่ 4) | ยืนเต็มตัว ชุดทางการ ถือช่อดอกไม้พาสเทล ตรงธีม |
| `S__63914024` | Gallery — ใบเด่น | ท่าขี่หลัง สนุก น่ารัก แสดงบุคลิกคู่นี้ |
| `S__63914025` (แนวนอน) | Gallery — แถบกว้าง | ใส่แว่นหันหลังชนกัน เท่ ขี้เล่น |
| `S__63914030` (แนวนอน) | Gallery — แถบกว้าง | รูปแนวนอนอีกใบ ใช้คู่กับใบบน |
| `S__63914026/27/28/29/38` | Gallery — masonry | เติมกริดให้ครบ |

---

## 7. Ornament & Iconography

| องค์ประกอบ | รูปแบบ | ที่ใช้ |
|---|---|---|
| **Monogram W N** | ตัวอักษรเรนเดอร์ด้วยฟอนต์ `Great Vibes` จริง (ไม่วาดเป็น path เอง — เส้นคัดลายมือมีหนักเบาสลับกัน ซึ่ง stroke ความหนาคงที่ทำเลียนแบบไม่ได้ ออกมาเป็นเส้นหยึกหยัก) ล้อมด้วยดอกไม้วาดมือ: ช่อยิปโซขึ้นกลางระหว่าง W กับ N · กุหลาบขวาล่าง · ช่อเล็กซ้ายล่าง · ประกายสองข้าง | ตราครั่งบนซอง (ตอน 1), ตอน 4, footer |
| **ตราครั่ง** | วงกลม gradient `--seal-magenta` มีเงาใน ให้ดูเหมือนครั่งจริง ใส่ monogram สีขาวนวลไว้กลาง | ปิดซอง (ตอน 1) |
| **กลีบดอกไม้** | รูปหยดน้ำโค้ง 3 สี (pink/peach/lavender) โปร่ง 40-70% | canvas อนุภาคลอย |
| **หัวใจ** | เส้น outline หนา 2px มุมมนแบบวาดมือ | ปฏิทิน, ปุ่ม play, ลูกศรเลื่อนลง, คอนเฟตติ |
| **ประกาย ✦** | ดาว 4 แฉกก้านยาว สี `--theme-cream` | รอบ monogram, ตอนซองเปิด, hover ปุ่ม |
| **เส้นคั่น** | เส้น 1px ไล่เฉดจากใสไปพาสเทลไปใส + หัวใจเล็กตรงกลาง | คั่นระหว่างบล็อกเนื้อหา |
| **กรอบ arch** | ครึ่งวงกลมบน มุมล่างมน | รูปโปรไฟล์, การ์ดสถานที่ |
| **ไอคอนกำหนดการ** | ลายเส้นบางสไตล์สีน้ำ: ขันหมาก · บาตรพระ · โต๊ะจีน | ตอน Wedding Timeline |

**Icon style rule** — เส้นบาง 1.5px มุมมน (`stroke-linecap: round`) ไม่มีไอคอนทึบ ไม่ใช้ emoji ในเนื้อหาหลัก (ใช้ได้เฉพาะปุ่มแชร์)

---

## 8. Voice & Tone

| ทำ ✅ | ไม่ทำ ❌ |
|---|---|
| "เรียนเชิญร่วมเป็นเกียรติ" | "มางานเราหน่อยน้า~" |
| "ขออภัยหากมิได้เรียนเชิญด้วยตนเอง" (ตามการ์ดจริง) | ตัดข้อความสุภาพในการ์ดจริงทิ้ง |
| หัวข้ออังกฤษสั้น กระชับ: `SAVE THE DATE`, `OUR MOMENTS` | ประโยคอังกฤษยาวๆ ที่แขกไทยอ่านไม่ทั่วถึง |
| ชื่อเล่น "ดาว" · "ซัน" ใช้สร้างความใกล้ชิด | เรียกชื่อไม่ตรงกับการ์ด |

**โครงหัวข้อทุกตอน** = อังกฤษตัวใหญ่เว้นวรรคกว้าง (เล็ก) → หัวข้อไทย `Charm` (ใหญ่) → เนื้อหา `Sarabun`

ตัวอย่าง:
```
        L O C A T I O N          ← Cormorant, --dusty-blue, --fs-caption
         สถานที่จัดงาน            ← Charm, --ink, --fs-display-md
   ริมธารา RIMTARA พระราม 3      ← Sarabun, --ink, --fs-body-lg
```

---

## 9. Accessibility Baseline

- Contrast ตัวอักษรเนื้อหา ≥ 7:1 · ตัวอักษรใหญ่/ปุ่ม ≥ 4.5:1
- Focus ring มองเห็นชัด: `outline: 2px solid var(--seal-magenta); outline-offset: 3px` — **ห้าม `outline: none`**
- พื้นที่แตะขั้นต่ำ **44×44px** ทุกปุ่ม (นิ้วโป้งบนมือถือ)
- ปุ่มเพลงต้องมี `aria-label` และ `aria-pressed` บอกสถานะ
- Lightbox ต้อง trap focus + ปิดด้วย `Esc` + คืน focus กลับที่รูปเดิม
- ทุกรูป `alt` ภาษาไทย · รูปตกแต่งล้วน ใช้ `alt=""` + `aria-hidden="true"`
- เคารพ `prefers-reduced-motion` ตามตารางข้อ 5.4

---

## 10. Design Tokens (คัดลอกไปใช้ได้เลย)

```css
:root {
  /* Sky */
  --sky-lavender: #C8BFE7;
  --sky-blush:    #F3C6D6;
  --sky-peach:    #F8D9C0;
  --sky-cream:    #FDF6EE;
  --gradient-sky: linear-gradient(160deg, #C8BFE7 0%, #F3C6D6 35%, #F8D9C0 70%, #FDF6EE 100%);

  /* Theme 5 */
  --theme-pink:     #F4A9BE;
  --theme-lavender: #B9AEE8;
  --theme-blue:     #9FD0EE;
  --theme-cream:    #F8DFA8;
  --theme-peach:    #F7BE94;

  /* Ink & accent */
  --script-pink:   #E8608E;
  --seal-magenta:  #B5246B;
  --dusty-blue:    #7FA6B5;
  --ink:           #4A4550;
  --ink-muted:     #8C8592;
  --paper:         #FFFCFA;
  --paper-warm:    #FDF6EE;

  /* Type */
  --font-script:    'Great Vibes', cursive;
  --font-display:   'Cormorant Garamond', serif;
  --font-th-display:'Charm', serif;
  --font-th-script: 'Charmonman', cursive;
  --font-body:      'Sarabun', system-ui, sans-serif;

  /* Radius & shadow */
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 28px;
  --radius-arch: 999px 999px 20px 20px;
  --shadow-soft: 0 8px 32px -12px rgba(184,140,170,0.28);
  --shadow-lift: 0 20px 60px -20px rgba(160,120,150,0.35);

  /* Layout */
  --content-max: 42rem;
  --page-gutter: clamp(1.25rem, 6vw, 2.5rem);
}
```

> **หมายเหตุ theme** — e-card นี้เป็น *light-only by design* พื้นหลังท้องฟ้าพาสเทลคือตัวตนของแบรนด์
> ไม่ทำ dark mode แต่ต้องกำหนดสีพื้นและสีตัวอักษรอย่างชัดเจนบน `body` เสมอ เพื่อไม่ให้ระบบผู้ใช้ยัดสีมาเอง
