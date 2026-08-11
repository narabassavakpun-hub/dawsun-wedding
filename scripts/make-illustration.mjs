/**
 * แปลงรูปถ่ายบ่าวสาวให้เป็นแนวภาพวาดสีน้ำ ขอบฟุ้งกลืนกับพื้นหลัง
 * ใช้บนหน้าซอง (ตอนที่ 1) ตามภาพตัวอย่างที่ 1
 *
 *   public/images/couple-02.webp  →  public/images/couple-illustration.webp
 *
 * เทคนิค:
 *   median()   ลบรายละเอียดย่อยให้เหลือเป็นระนาบสี เหมือนฝีแปรงสีน้ำ
 *   modulate() ดันความสดและความสว่างให้ดูโปร่ง ไม่ทึบเหมือนรูปถ่าย
 *   mask       ไล่โปร่งใสรอบขอบ เพื่อให้ภาพจมกลืนไปกับพื้นหลังท้องฟ้า
 *
 * รัน: npm run illustration   (ต้องรัน npm run optimize ก่อน)
 */
import sharp from 'sharp';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'public', 'images', 'couple-02.webp');
const OUT = join(ROOT, 'public', 'images', 'couple-illustration.webp');

const W = 900;

const src = sharp(SRC);
const meta = await src.metadata();
const H = Math.round((meta.height / meta.width) * W);

// หน้ากากไล่โปร่งใส: ทึบตรงกลางตัวคน จางลงจนใสที่ขอบ
const mask = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="soft" cx="50%" cy="42%" r="62%">
      <stop offset="0%"   stop-color="#fff" stop-opacity="1"/>
      <stop offset="62%"  stop-color="#fff" stop-opacity="1"/>
      <stop offset="86%"  stop-color="#fff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#fff" stop-opacity="1"/>
      <stop offset="72%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="m">
      <rect width="${W}" height="${H}" fill="url(#fadeBottom)"/>
    </mask>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#soft)" mask="url(#m)"/>
</svg>`);

const painted = await src
  .clone()
  .resize(W)
  .median(5) // ฝีแปรงสีน้ำ — ลบรายละเอียดย่อยให้เหลือระนาบสี
  .modulate({ saturation: 1.18, brightness: 1.07 })
  .blur(0.7)
  .sharpen({ sigma: 1.1 })
  .toColourspace('srgb')
  .ensureAlpha()
  .toBuffer();

await sharp(painted)
  .composite([{ input: mask, blend: 'dest-in' }])
  .webp({ quality: 82, alphaQuality: 90 })
  .toFile(OUT);

const out = await sharp(OUT).metadata();
console.log(`✓ couple-illustration.webp  ${out.width}×${out.height}  ${(out.size / 1024).toFixed(0)} KB`);
