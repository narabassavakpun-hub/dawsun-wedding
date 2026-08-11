/**
 * สร้างไฟล์ปฏิทิน `public/dawsun-wedding.ics` ตอน build
 *
 * ทำไมต้องเป็นไฟล์นิ่ง ไม่สร้างในเบราว์เซอร์:
 *   เดิมสร้างเป็น blob แล้วใช้ <a download> ซึ่ง **iOS Safari และ in-app browser
 *   ของ LINE บล็อกทั้งคู่** กดปุ่มแล้วไม่เกิดอะไรเลย
 *   พอเป็นไฟล์จริงบนเซิร์ฟเวอร์ GitHub Pages จะส่งมาพร้อม Content-Type: text/calendar
 *   iOS จะเปิดหน้าตัวอย่างปฏิทินให้กด "เพิ่ม" ได้ทันที
 *
 * เนื้อหางานคงที่ (วันเดียว เวลาเดียว) จึงไม่มีเหตุผลต้องสร้างสดทุกครั้งที่เปิดเว็บ
 *
 * รัน: npm run ics   (ถูกเรียกอัตโนมัติจาก npm run build)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'dawsun-wedding.ics');

/* ---- ดึงข้อมูลงานจาก src/config/site.ts โดยไม่ต้อง import TypeScript ----
   อ่านเป็นข้อความแล้ว match เอา เพื่อให้สคริปต์รันด้วย node เปล่าๆ ได้
   ถ้าแก้ข้อมูลใน site.ts แล้วรูปแบบเปลี่ยนจนหาไม่เจอ สคริปต์จะหยุดพร้อมบอกทันที */
const siteSrc = readFileSync(join(ROOT, 'src', 'config', 'site.ts'), 'utf8');

const pick = (key, label) => {
  const m = siteSrc.match(new RegExp(`${key}:\\s*'([^']*)'`));
  if (!m) {
    console.error(`✗ หา ${label} (${key}) ใน src/config/site.ts ไม่เจอ — รูปแบบไฟล์เปลี่ยนไปหรือเปล่า`);
    process.exit(1);
  }
  return m[1];
};

const brideNick = pick('nicknameTh', 'ชื่อเล่นเจ้าสาว');
// nicknameTh มี 2 ที่ (เจ้าสาว/เจ้าบ่าว) — ตัวที่สองคือเจ้าบ่าว
const groomNick = [...siteSrc.matchAll(/nicknameTh:\s*'([^']*)'/g)][1]?.[1] ?? '';
const brideFull = pick('fullNameTh', 'ชื่อเต็มเจ้าสาว');
const groomFull = [...siteSrc.matchAll(/fullNameTh:\s*'([^']*)'/g)][1]?.[1] ?? '';
const hashtag = pick('hashtag', 'แฮชแท็ก');

const START = '20261018T073900';
const END = '20261018T140000';
const STAMP = '20260811T000000Z';

const VENUE =
  'ริมธารา RIMTARA พระราม 3 (ห้องริมธารา) ' +
  'อาคาร เอส วี ซิตี้ ชั้น G ติดแม่น้ำ ถนนพระราม 3 แขวงบางโพงพาง เขตยานนาวา กรุงเทพมหานคร';

/** escape ตาม RFC 5545 */
const esc = (s) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

/** พับบรรทัดยาวเกิน 75 octet ตาม RFC 5545 — สำคัญมากกับภาษาไทยที่กิน 3 byte ต่อตัว */
function fold(line) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out = [];
  let chunk = '';
  let size = 0;
  for (const ch of line) {
    const chSize = enc.encode(ch).length;
    if (size + chSize > (out.length === 0 ? 75 : 74)) {
      out.push(chunk);
      chunk = '';
      size = 0;
    }
    chunk += ch;
    size += chSize;
  }
  if (chunk) out.push(chunk);
  return out.join('\r\n ');
}

const summary = `งานฉลองมงคลสมรส ${brideNick} & ${groomNick}`;
const description = [
  `${brideFull} (${brideNick})`,
  `${groomFull} (${groomNick})`,
  '',
  '07.39 น. พิธีสงฆ์',
  '09.39 น. พิธีแห่ขันหมาก',
  '11.09 น. พิธีฉลองมงคลสมรส',
  '',
  hashtag,
].join('\n');

const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//DAWSUN Wedding//E-Card//TH',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  // ประกาศ timezone เองเพื่อให้ Apple/Google Calendar ตีความ 07:39 เป็นเวลาไทยแน่นอน
  'BEGIN:VTIMEZONE',
  'TZID:Asia/Bangkok',
  'BEGIN:STANDARD',
  'DTSTART:19700101T000000',
  'TZOFFSETFROM:+0700',
  'TZOFFSETTO:+0700',
  'TZNAME:+07',
  'END:STANDARD',
  'END:VTIMEZONE',
  'BEGIN:VEVENT',
  'UID:dawsun-wedding-18.10.2026@dawsunwedding',
  `DTSTAMP:${STAMP}`,
  `DTSTART;TZID=Asia/Bangkok:${START}`,
  `DTEND;TZID=Asia/Bangkok:${END}`,
  fold(`SUMMARY:${esc(summary)}`),
  fold(`LOCATION:${esc(VENUE)}`),
  fold(`DESCRIPTION:${esc(description)}`),
  'BEGIN:VALARM',
  'TRIGGER:-P1D',
  'ACTION:DISPLAY',
  fold(`DESCRIPTION:${esc(`พรุ่งนี้งานแต่งงาน ${brideNick} & ${groomNick}`)}`),
  'END:VALARM',
  'END:VEVENT',
  'END:VCALENDAR',
];

mkdirSync(dirname(OUT), { recursive: true });
// BOM ช่วยให้แอปปฏิทินบางตัวอ่านภาษาไทยได้ถูกต้อง
writeFileSync(OUT, '﻿' + lines.join('\r\n') + '\r\n', 'utf8');

console.log(`✓ public/dawsun-wedding.ics  (${summary})`);
