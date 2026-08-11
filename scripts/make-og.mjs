/**
 * สร้าง OG image 1200×630 สำหรับพรีวิวตอนแชร์ลงไลน์/เฟซบุ๊ก
 * ครอปจากรูป hero + วางแถบข้อความชื่อและวันที่
 *
 * รัน: node scripts/make-og.mjs   (รันหลัง npm run optimize)
 */
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'public', 'images', 'couple-01.webp');
const OUT = join(ROOT, 'public', 'images', 'og.jpg');

const W = 1200;
const H = 630;

// ใช้ฟอนต์ระบบใน SVG overlay — ไม่พึ่ง Google Fonts ตอน build
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#C8BFE7" stop-opacity="0.30"/>
      <stop offset="45%" stop-color="#4A4550" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#4A4550" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <g text-anchor="middle" fill="#ffffff" font-family="Georgia, 'Times New Roman', serif">
    <text x="${W / 2}" y="452" font-size="34" letter-spacing="14" fill="#F4A9BE">WEDDING INVITATION</text>
    <text x="${W / 2}" y="530" font-size="66" letter-spacing="10">WANDEE &#38; NARUEBET</text>
    <text x="${W / 2}" y="582" font-size="30" letter-spacing="8" fill="#F8DFA8">18 . 10 . 2026</text>
  </g>
</svg>`);

await sharp(SRC)
  .resize(W, H, { fit: 'cover', position: 'top' })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);

console.log(`✓ og.jpg → public/images/og.jpg (${W}×${H})`);
