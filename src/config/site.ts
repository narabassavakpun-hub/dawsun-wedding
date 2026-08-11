/**
 * ⭐ ข้อมูลงานทั้งหมดอยู่ที่ไฟล์นี้ไฟล์เดียว
 *
 * ทุกค่าสกัดจาก `รูปจริง/รูปการ์ดเชิญ.jpg` และ `รูปจริง/รูปซอง.jpg`
 * แก้ที่นี่แล้วทั้งเว็บเปลี่ยนตาม — ห้าม hardcode ข้อความลง component (CLAUDE.md ข้อ 1)
 */
import { generatedImages } from './images.generated';

/* ---------- คู่บ่าวสาว ---------- */
export type Person = {
  nicknameEn: string;
  nicknameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  fullNameTh: string;
  initial: string;
};

export const couple: {
  bride: Person;
  groom: Person;
  hashtag: string;
  monogram: string;
} = {
  bride: {
    nicknameEn: 'DAW',
    nicknameTh: 'ดาว',
    firstNameEn: 'WANDEE',
    lastNameEn: 'Rodsawai',
    fullNameTh: 'นางสาววันดี รอดไสว',
    initial: 'W',
  },
  groom: {
    nicknameEn: 'SUN',
    nicknameTh: 'ซัน',
    firstNameEn: 'NARUEBET',
    lastNameEn: 'Savakpun',
    fullNameTh: 'นายนฤเบศร์ เสวกพันธ์',
    initial: 'N',
  },
  hashtag: '#DAWSUNWEDDING',
  monogram: 'WN',
};

/* ---------- บิดามารดา ---------- */
export type FamilySide = { label: string; names: string[] };

export const parents: { bride: FamilySide; groom: FamilySide } = {
  bride: {
    label: 'บิดามารดาเจ้าสาว',
    names: ['นายทรงศักดิ์ รอดไสว', 'นางบุญเพียร อุทานันท์'],
  },
  groom: {
    label: 'บิดามารดาเจ้าบ่าว',
    names: ['จ.ส.อ. เนตร เสวกพันธ์', 'นางวัชรี เสวกพันธ์'],
  },
};

/* ---------- วันเวลา ----------
 * ตรึง timezone ไทย (+07:00) เสมอ — ห้ามใช้ new Date(2026, 9, 18)
 * ไม่งั้น countdown จะเพี้ยนเมื่อผู้ใช้อยู่คนละโซนเวลา (CLAUDE.md)
 */
export const weddingDate = {
  iso: '2026-10-18T07:39:00+07:00',
  year: 2026,
  yearTh: 2569,
  month: 10, // ตุลาคม
  day: 18,
  monthEn: 'OCTOBER',
  monthTh: 'ตุลาคม',
  dayOfWeekEn: 'SUNDAY',
  dayOfWeekTh: 'วันอาทิตย์',
  displayShort: '18.10.2026',
} as const;

/* ---------- กำหนดการ ---------- */
export const schedule = [
  { time: '07.39 น.', title: 'พิธีสงฆ์', icon: 'monk' },
  { time: '09.39 น.', title: 'พิธีแห่ขันหมาก', icon: 'khanmak' },
  { time: '11.09 น.', title: 'พิธีฉลองมงคลสมรส', icon: 'banquet' },
] as const;

/* ---------- สถานที่ ---------- */
export const venue = {
  nameTh: 'ริมธารา',
  nameEn: 'RIMTARA',
  room: 'ห้องริมธารา',
  area: 'พระราม 3',
  addressLines: [
    'อาคาร เอส วี ซิตี้ ชั้น G ติดแม่น้ำ',
    'ถนนพระราม 3 แขวงบางโพงพาง',
    'เขตยานนาวา กรุงเทพมหานคร',
  ],
  /** TODO: แทนที่ด้วยลิงก์ Google Maps ตัวจริงจาก QR บนการ์ดเชิญ
   *  ระหว่างนี้ใช้ URL ค้นหาชื่อสถานที่ ซึ่งเปิดใช้งานได้ทันทีทั้ง iOS/Android */
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('ริมธารา RIMTARA พระราม 3 อาคารเอสวีซิตี้'),
} as const;

/* ---------- ธีมสี (แถบ THEME COLOR บนการ์ด) ---------- */
export const themeColors = [
  { name: 'ชมพูหวาน', hex: '#F4A9BE', token: 'theme-pink' },
  { name: 'ม่วงลาเวนเดอร์', hex: '#B9AEE8', token: 'theme-lavender' },
  { name: 'ฟ้าใส', hex: '#9FD0EE', token: 'theme-blue' },
  { name: 'ครีมทอง', hex: '#F8DFA8', token: 'theme-cream' },
  { name: 'พีชอบอุ่น', hex: '#F7BE94', token: 'theme-peach' },
] as const;

/* ---------- รูปภาพ ----------
 * รายการรูปมาจาก npm run optimize (src/config/images.generated.ts)
 * ลำดับกำหนดไว้ใน scripts/optimize-images.mjs → ORDER
 */
const alts = [
  'เจ้าบ่าวและเจ้าสาวยิ้มมองหน้ากันอย่างมีความสุข',
  'เจ้าบ่าวและเจ้าสาวยืนคู่กันในชุดแต่งงาน ถือช่อดอกไม้',
  'เจ้าสาวขี่หลังเจ้าบ่าวอย่างสนุกสนาน',
  'เจ้าบ่าวและเจ้าสาวใส่แว่นกันแดดยืนหันหลังชนกัน',
  'เจ้าบ่าวและเจ้าสาวเอามือปิดตาข้างหนึ่ง โชว์แหวนแต่งงาน',
  'ภาพคู่บ่าวสาวในสตูดิโอ',
  'ภาพคู่บ่าวสาวในสตูดิโอ',
  'ภาพคู่บ่าวสาวในสตูดิโอ',
  'ภาพคู่บ่าวสาวในสตูดิโอ',
  'ภาพคู่บ่าวสาวในสตูดิโอ',
];

/**
 * การจัดวางแต่ละรูปในกริดแกลเลอรี 2 คอลัมน์
 *
 *  tile   — กรอบมาตรฐาน 4:5 ครอปได้ (ค่าเริ่มต้น)
 *  full   — กินเต็มแถว ใช้สัดส่วนจริงของไฟล์ จึง **ไม่ครอปเลย**
 *           รูปแนวตั้งจะถูกจำกัดความกว้างและจัดกึ่งกลาง ไม่งั้นบนจอใหญ่จะสูงเกินไป
 *  banner — กินเต็มแถว ครอปเป็น 3:2
 *
 * ทำไมต้องกำหนดเอง: `full`/`banner` กินสองคอลัมน์ ถ้าไปตกกลางแถว
 * จะดันให้ช่องข้างๆ ว่าง เลยต้องวางให้ลงตัวพอดี
 *
 *   แถว 1  01 02      แถว 4  06 07
 *   แถว 2  03 04      แถว 5  08 09
 *   แถว 3  05 (full)  แถว 6  10 (banner)
 *
 * ผล: 8 กรอบปกติ + 2 แถวเต็ม = ไม่มีช่องว่างค้างเลย
 */
export type PhotoLayout = 'tile' | 'full' | 'banner';

const layoutOverrides: Record<string, PhotoLayout> = {
  // แนวนอน ปิดตาโชว์แหวน — ห้ามครอป คนจะโดนตัดขอบทั้งสองฝั่ง
  'couple-05.webp': 'full',
  // ใบปิดท้าย — ห้ามครอปเช่นกัน ครอปเป็นแบนเนอร์แล้วตัดทั้งหัวและตัว
  'couple-10.webp': 'full',
};

export const photos = generatedImages.map((img, i) => ({
  ...img,
  alt: alts[i] ?? 'ภาพคู่บ่าวสาว',
  layout: layoutOverrides[img.src] ?? ('tile' as PhotoLayout),
}));

export const heroPhoto = photos[0];
export const profilePhoto = photos[1] ?? photos[0];
export const galleryPhotos = photos;

/* ---------- ข้อความ ---------- */
export const copy = {
  envelope: {
    eyebrow: 'Wedding Invitation',
    hint: 'กดที่ซองเพื่อเปิด',
    aria: 'เปิดซองการ์ดเชิญงานแต่งงาน',
  },
  hero: {
    eyebrow: 'Welcome to our',
    script: 'love story',
    scrollHint: 'เลื่อนลงเพื่ออ่านต่อ',
  },
  invitation: {
    eyebrow: 'Wedding Invitation',
    heading: 'เรียนเชิญ',
    body: 'มีความยินดีขอเรียนเชิญท่านเพื่อเป็นเกียรติเนื่องในพิธีฉลองมงคลสมรส ระหว่าง',
    conjunction: 'และ',
  },
  profiles: {
    eyebrow: 'The Couple',
    heading: 'เจ้าบ่าว เจ้าสาว',
  },
  calendar: {
    eyebrow: 'Save the Date',
    heading: 'วันแห่งความสุขของเรา',
    countdownLabels: ['วัน', 'ชั่วโมง', 'นาที', 'วินาที'],
    passed: 'วันแห่งความสุขของเรา',
  },
  timeline: {
    eyebrow: 'Wedding Timeline',
    heading: 'กำหนดการ',
  },
  gallery: {
    eyebrow: 'Our Moments',
    heading: 'ช่วงเวลาของเรา',
    hint: 'แตะที่รูปเพื่อดูขนาดเต็ม',
  },
  location: {
    eyebrow: 'Location',
    heading: 'สถานที่จัดงาน',
    button: 'เปิดใน Google Maps',
    copyHint: 'แตะที่อยู่เพื่อคัดลอก',
  },
  dressCode: {
    eyebrow: 'Dress Code',
    heading: 'ธีมสีของงาน',
    body: 'ขอเรียนเชิญร่วมแต่งกายด้วยโทนสีพาสเทลตามธีมของงาน\nเพื่อความสวยงามและกลมกลืนในภาพความทรงจำของเรา',
    hint: 'แตะวงกลมเพื่อคัดลอกรหัสสี',
  },
  guestbook: {
    eyebrow: 'Wishes',
    heading: 'เขียนคำอวยพร',
    body: 'ขอเรียนเชิญร่วมเขียนคำอวยพรให้กับบ่าวสาว\nเพื่อเป็นกำลังใจให้แก่ชีวิตคู่ต่อไป',
    nameLabel: 'ชื่อของคุณ',
    namePlaceholder: 'เช่น คุณสมชาย',
    messageLabel: 'คำอวยพร',
    messagePlaceholder: 'เขียนคำอวยพรถึงบ่าวสาว...',
    submit: 'ส่งคำอวยพร',
    sending: 'กำลังส่ง...',
    success: 'ขอบคุณสำหรับคำอวยพรนะคะ',
    successBody: 'บ่าวสาวได้รับคำอวยพรของคุณเรียบร้อยแล้ว',
    error: 'ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะคะ',
    retry: 'ลองอีกครั้ง',
    tooSoon: 'เพิ่งส่งคำอวยพรไป รอสักครู่แล้วลองใหม่นะคะ',
    maxLength: 500,
  },
  gift: {
    eyebrow: 'A Special Gift',
    heading: 'ร่วมมอบของขวัญ',
    body: 'ร่วมแสดงความยินดีด้วยการมอบของขวัญแด่เจ้าบ่าวเจ้าสาว',
    save: 'บันทึกรูป QR',
    note: '( ขออภัยหากมิได้เรียนเชิญด้วยตนเอง )',
    pending: 'กำลังจัดเตรียม QR PromptPay',

    /* ---- กล่องของขวัญ ---- */
    open: 'คลิกเพื่อส่งของขวัญให้บ่าวสาว',
    close: 'ปิดกล่อง',
    qrHint: 'สแกน QR เพื่อโอนของขวัญ',
    slipNameLabel: 'ชื่อของคุณ',
    slipNamePlaceholder: 'เพื่อให้บ่าวสาวรู้ว่าใครส่งมา',
    slipPick: 'เลือกรูปสลิป',
    slipChange: 'เปลี่ยนรูป',
    slipSend: 'ส่งของขวัญ',
    slipSending: 'กำลังห่อของขวัญ...',
    slipDelivering: 'กำลังส่งถึงบ่าวสาว...',
    slipSkip: 'ไว้ทีหลัง',

    /* ---- ส่งสำเร็จ ---- */
    sentHeading: 'บ่าวสาวได้รับของขวัญเรียบร้อยแล้ว',
    sentBody:
      'ขอบคุณจากใจจริงสำหรับน้ำใจและความปรารถนาดีของคุณนะคะ\nสำหรับเราสองคน การที่คุณอยู่ร่วมยินดีในวันเริ่มต้นนี้ คือของขวัญที่มีค่าที่สุดแล้ว\nขอให้ความสุขที่คุณมอบให้ ย้อนกลับไปหาคุณทวีคูณนะคะ',
    sentSign: 'ด้วยรักและขอบคุณ',

    /* ---- ข้อผิดพลาด ---- */
    slipError: 'ส่งไม่สำเร็จ ลองใหม่อีกครั้งนะคะ',
    slipTooLarge: 'ไฟล์ใหญ่เกินไป ลองเลือกรูปอื่นนะคะ',
    slipBadImage: 'อ่านไฟล์รูปไม่ได้ ลองบันทึกเป็น JPG หรือ PNG แล้วแนบใหม่นะคะ',
    slipTooSoon: 'เพิ่งส่งไปเมื่อครู่ รอสักครู่แล้วลองใหม่นะคะ',
  },
  share: {
    eyebrow: 'Share & Save',
    heading: 'บันทึกและแบ่งปัน',
    line: 'แชร์ผ่าน LINE',
    copy: 'คัดลอกลิงก์',
    copied: 'คัดลอกแล้ว',
    calendar: 'เพิ่มลงปฏิทิน',
  },
  footer: {
    thanks: 'ขอบคุณที่มาร่วมเป็นส่วนหนึ่ง\nในวันสำคัญของเรา',
  },
  toast: {
    copiedAddress: 'คัดลอกที่อยู่แล้ว',
    copiedColor: 'คัดลอกรหัสสีแล้ว',
    copiedLink: 'คัดลอกลิงก์แล้ว',
    copyFailed: 'คัดลอกไม่สำเร็จ',
  },
  music: {
    play: 'เล่นเพลง',
    pause: 'หยุดเพลง',
  },
} as const;

/* ---------- ไฟล์ assets ---------- */
export const assets = {
  audio: 'audio/theme.mp3',
  promptPayQr: 'images/promptpay-qr.png',
} as const;

/* ---------- ปลายทางบันทึกคำอวยพร ---------- */
export const wishEndpoint = import.meta.env.VITE_WISH_ENDPOINT ?? '';

/** ต่อ base path ของ Vite เข้ากับพาธ asset (สำคัญบน GitHub Pages ที่ base ไม่ใช่ '/') */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
