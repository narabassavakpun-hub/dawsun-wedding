import { couple, venue, weddingDate } from '../config/site';

/** escape ตามข้อกำหนด RFC 5545 — comma / semicolon / backslash / newline */
const esc = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

/** พับบรรทัดที่ยาวเกิน 75 octet ตาม RFC 5545 (สำคัญกับภาษาไทยที่กินหลาย byte ต่อตัว) */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;

  const out: string[] = [];
  let chunk = '';
  let size = 0;
  for (const ch of line) {
    const chSize = new TextEncoder().encode(ch).length;
    // บรรทัดต่อเนื่องขึ้นต้นด้วย space จึงเหลือพื้นที่ 74
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

/**
 * สร้างไฟล์ .ics ฝั่ง client (ไม่ต้องมีเซิร์ฟเวอร์)
 * เวลาผูกกับ Asia/Bangkok เสมอ ไม่ขึ้นกับ timezone ของเครื่องผู้ใช้
 */
export function buildIcs(): string {
  const start = '20261018T073900';
  const end = '20261018T140000';
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const summary = `งานฉลองมงคลสมรส ${couple.bride.nicknameTh} & ${couple.groom.nicknameTh}`;
  const location = `${venue.nameTh} ${venue.nameEn} ${venue.area} (${venue.room}) ${venue.addressLines.join(' ')}`;
  const description = [
    `${couple.bride.fullNameTh} (${couple.bride.nicknameTh})`,
    `${couple.groom.fullNameTh} (${couple.groom.nicknameTh})`,
    '',
    '07.39 น. พิธีสงฆ์',
    '09.39 น. พิธีแห่ขันหมาก',
    '11.09 น. พิธีฉลองมงคลสมรส',
    '',
    couple.hashtag,
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
    `UID:dawsun-wedding-${weddingDate.displayShort}@dawsunwedding`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Bangkok:${start}`,
    `DTEND;TZID=Asia/Bangkok:${end}`,
    fold(`SUMMARY:${esc(summary)}`),
    fold(`LOCATION:${esc(location)}`),
    fold(`DESCRIPTION:${esc(description)}`),
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    fold(`DESCRIPTION:${esc('พรุ่งนี้งานแต่งงาน ' + couple.bride.nicknameTh + ' & ' + couple.groom.nicknameTh)}`),
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

export function downloadIcs() {
  // ﻿ (BOM) ช่วยให้แอปปฏิทินบางตัวอ่านภาษาไทยได้ถูกต้อง
  const blob = new Blob(['﻿' + buildIcs()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dawsun-wedding-2026.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // ปล่อย URL หลังจากเบราว์เซอร์เริ่มดาวน์โหลดแล้ว
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
