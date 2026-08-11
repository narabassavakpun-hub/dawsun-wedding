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

/** เวลาเริ่ม-จบงาน ตามเวลาไทย (ใช้ร่วมกับลิงก์ Google Calendar) */
export const EVENT_START_LOCAL = '20261018T073900';
export const EVENT_END_LOCAL = '20261018T140000';
/** เวลาเดียวกันในรูป UTC — Google Calendar รับเฉพาะรูปแบบนี้ (ไทย = UTC+7) */
export const EVENT_START_UTC = '20261018T003900Z';
export const EVENT_END_UTC = '20261018T070000Z';

/**
 * สร้างเนื้อไฟล์ .ics — เวลาผูกกับ Asia/Bangkok เสมอ ไม่ขึ้นกับเครื่องผู้ใช้
 *
 * ฟังก์ชันนี้ถูกเรียกจาก `scripts/make-ics.mjs` ตอน build เพื่อเขียนเป็นไฟล์นิ่ง
 * `public/dawsun-wedding.ics` — **ไม่ได้สร้างในเบราว์เซอร์แล้ว**
 * เพราะ iOS Safari กับ in-app browser ของ LINE บล็อกทั้ง blob: URL และ attribute `download`
 * กดปุ่มแล้วเลยไม่เกิดอะไรขึ้นเลย
 */
export function buildIcs(): string {
  const start = EVENT_START_LOCAL;
  const end = EVENT_END_LOCAL;
  // ตรึงไว้ ไม่ใช้เวลาปัจจุบัน เพื่อให้ไฟล์ที่ build ออกมาเหมือนเดิมทุกครั้ง
  const stamp = '20260811T000000Z';

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

/**
 * ลิงก์เพิ่มกิจกรรมลง Google Calendar
 *
 * เป็นแค่หน้าเว็บธรรมดา จึงเปิดได้ทุกเบราว์เซอร์ **รวม in-app browser ของ LINE**
 * ต่างจากไฟล์ .ics ที่บางเบราว์เซอร์ปฏิเสธ
 */
export function googleCalendarUrl(): string {
  const summary = `งานฉลองมงคลสมรส ${couple.bride.nicknameTh} & ${couple.groom.nicknameTh}`;
  const location = `${venue.nameTh} ${venue.nameEn} ${venue.area} (${venue.room}) ${venue.addressLines.join(' ')}`;
  const details = [
    `${couple.bride.fullNameTh} (${couple.bride.nicknameTh})`,
    `${couple.groom.fullNameTh} (${couple.groom.nicknameTh})`,
    '',
    '07.39 น. พิธีสงฆ์',
    '09.39 น. พิธีแห่ขันหมาก',
    '11.09 น. พิธีฉลองมงคลสมรส',
    '',
    couple.hashtag,
  ].join('\n');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary,
    dates: `${EVENT_START_UTC}/${EVENT_END_UTC}`,
    details,
    location,
    ctz: 'Asia/Bangkok',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
