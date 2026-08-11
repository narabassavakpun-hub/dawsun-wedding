/**
 * แปลงรูปต้นฉบับ → WebP พร้อม blur placeholder
 *
 *   รูปจริง/รูปเจ้าบ่าว เจ้าสาว/*.jpg  →  public/images/couple-XX.webp
 *
 * ทำไมต้อง copy+rename: โค้ดฝั่งเว็บห้ามอ้างพาธโฟลเดอร์ภาษาไทย (ดู CLAUDE.md ข้อ 8)
 * ผลลัพธ์: ~1.9 MB → ~400 KB  พร้อม blur data URI สำหรับกัน layout shift
 *
 * รัน: npm run optimize
 */
import sharp from 'sharp';
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(ROOT, 'รูปจริง', 'รูปเจ้าบ่าว เจ้าสาว');
const OUT_DIR = join(ROOT, 'public', 'images');
const MANIFEST = join(ROOT, 'src', 'config', 'images.generated.ts');

const MAX_EDGE = 1600;
const QUALITY = 80;
const BLUR_WIDTH = 16;

/** ลำดับรูปกำหนดตาม brand.md ข้อ 6.3 — hero และโปรไฟล์ต้องมาก่อน */
const ORDER = [
  'S__63914032_0.jpg', // 01 · hero — ใกล้ชิด หน้าชนหน้า
  'S__63914039_0.jpg', // 02 · โปรไฟล์คู่ — ยืนเต็มตัวชุดทางการ
  'S__63914024_0.jpg', // 03 · ขี่หลัง สนุก
  'S__63914025_0.jpg', // 04 · แนวนอน แว่นกันแดด
  'S__63914030_0.jpg', // 05 · แนวนอน
  'S__63914026_0.jpg', // 06
  'S__63914027_0.jpg', // 07
  'S__63914028_0.jpg', // 08
  'S__63914029_0.jpg', // 09
  'S__63914038_0.jpg', // 10
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const present = new Set(
    (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f)),
  );

  // ไฟล์ที่อยู่ใน ORDER มาก่อน ที่เหลือต่อท้ายตามชื่อ
  const files = [
    ...ORDER.filter((f) => present.has(f)),
    ...[...present].filter((f) => !ORDER.includes(f)).sort(),
  ];

  if (files.length === 0) {
    console.error(`✗ ไม่พบรูปใน ${SRC_DIR}`);
    process.exit(1);
  }

  const entries = [];
  let totalIn = 0;
  let totalOut = 0;

  for (const [i, file] of files.entries()) {
    const id = String(i + 1).padStart(2, '0');
    const outName = `couple-${id}.webp`;
    const input = sharp(join(SRC_DIR, file));
    const meta = await input.metadata();

    const resized = input.clone().resize({
      width: meta.width >= meta.height ? MAX_EDGE : undefined,
      height: meta.height > meta.width ? MAX_EDGE : undefined,
      withoutEnlargement: true,
    });

    const buf = await resized.clone().webp({ quality: QUALITY, effort: 5 }).toBuffer();
    await writeFile(join(OUT_DIR, outName), buf);

    // blur placeholder จิ๋วๆ ฝังเป็น data URI (~400 bytes)
    const blurBuf = await input
      .clone()
      .resize({ width: BLUR_WIDTH })
      .webp({ quality: 30 })
      .toBuffer();

    const outMeta = await sharp(buf).metadata();
    entries.push({
      src: outName,
      width: outMeta.width,
      height: outMeta.height,
      orientation: outMeta.width >= outMeta.height ? 'landscape' : 'portrait',
      blur: `data:image/webp;base64,${blurBuf.toString('base64')}`,
      source: file,
    });

    // sharp ไม่คืน size เมื่ออ่านจากพาธ จึงต้องถามระบบไฟล์เอง
    totalIn += (await stat(join(SRC_DIR, file))).size;
    totalOut += buf.length;
    console.log(
      `  ${outName}  ${outMeta.width}×${outMeta.height}  ${(buf.length / 1024).toFixed(0)} KB   ← ${file}`,
    );
  }

  const manifest = `/**
 * ไฟล์นี้สร้างอัตโนมัติจาก \`npm run optimize\` — อย่าแก้ด้วยมือ
 * ต้นฉบับ: รูปจริง/รูปเจ้าบ่าว เจ้าสาว/
 */
export type GeneratedImage = {
  src: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  blur: string;
};

export const generatedImages: GeneratedImage[] = ${JSON.stringify(
    entries.map(({ source: _source, ...rest }) => rest),
    null,
    2,
  )};
`;

  await mkdir(dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, manifest, 'utf8');

  console.log(
    `\n✓ ${entries.length} รูป · ${(totalIn / 1024 / 1024).toFixed(2)} MB → ${(totalOut / 1024).toFixed(0)} KB`,
  );
  console.log(`✓ manifest → src/config/images.generated.ts`);
}

main().catch((err) => {
  console.error('✗ optimize ล้มเหลว:', err);
  process.exit(1);
});
