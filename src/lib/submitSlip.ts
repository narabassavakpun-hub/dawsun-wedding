import { wishEndpoint } from '../config/site';

const RATE_KEY = 'dawsun:last-slip';
const RATE_MS = 30_000;

/** ขนาดสูงสุดของไฟล์ที่ผู้ใช้เลือกได้ก่อนย่อ — กันไฟล์หลุดโลก */
const MAX_INPUT_BYTES = 25 * 1024 * 1024;
/** ด้านยาวสุดหลังย่อ — สลิปธนาคารอ่านออกสบายที่ขนาดนี้ */
const MAX_EDGE = 1400;
const JPEG_QUALITY = 0.82;

export type SlipResult =
  | { ok: true }
  | { ok: false; reason: 'rate-limit' | 'network' | 'config' | 'too-large' | 'bad-image' };

/** โหลดไฟล์เป็น ImageBitmap โดยมีทางสำรองสำหรับเบราว์เซอร์ที่ไม่รองรับ createImageBitmap */
async function loadImage(file: File): Promise<{ w: number; h: number; draw: CanvasImageSource }> {
  if ('createImageBitmap' in window) {
    try {
      const bmp = await createImageBitmap(file);
      return { w: bmp.width, h: bmp.height, draw: bmp };
    } catch {
      /* ตกไปใช้ทางสำรอง — บางเบราว์เซอร์ decode HEIC ไม่ได้ */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('decode failed'));
      el.src = url;
    });
    return { w: img.naturalWidth, h: img.naturalHeight, draw: img };
  } finally {
    // ปล่อยทีหลังเล็กน้อย ให้ canvas วาดเสร็จก่อน
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

/**
 * ย่อรูปสลิปฝั่งเบราว์เซอร์ก่อนส่ง
 * รูปจากกล้องมือถือมักใหญ่ 3-5 MB ถ้าส่งดิบๆ จะช้ามากบนเน็ตมือถือ
 * และ base64 ยังทำให้ข้อมูลบวมอีก 33%
 */
async function compress(file: File): Promise<{ base64: string; mime: string } | null> {
  try {
    const { w, h, draw } = await loadImage(file);
    if (!w || !h) return null;

    const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
    const cw = Math.max(1, Math.round(w * scale));
    const ch = Math.max(1, Math.round(h * scale));

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    // สลิปมีพื้นหลังขาว ถ้าไฟล์ต้นทางโปร่งใสจะได้พื้นดำเวลาแปลงเป็น JPEG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(draw, 0, 0, cw, ch);

    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    const base64 = dataUrl.split(',')[1];
    return base64 ? { base64, mime: 'image/jpeg' } : null;
  } catch {
    return null;
  }
}

export function canSendSlip(): boolean {
  try {
    return Date.now() - Number(localStorage.getItem(RATE_KEY) ?? 0) > RATE_MS;
  } catch {
    return true;
  }
}

/**
 * ส่งสลิปไป Google Apps Script → บันทึกไฟล์ลง Google Drive + เพิ่มแถวในชีต
 * ใช้ text/plain เหมือนคำอวยพร เพื่อเลี่ยง CORS preflight (ดู submitWish.ts)
 */
export async function submitSlip(file: File, name: string): Promise<SlipResult> {
  if (file.size > MAX_INPUT_BYTES) return { ok: false, reason: 'too-large' };
  if (!canSendSlip()) return { ok: false, reason: 'rate-limit' };
  if (!wishEndpoint) {
    console.warn('[gift] ยังไม่ได้ตั้ง VITE_WISH_ENDPOINT — ดู CLAUDE.md');
    return { ok: false, reason: 'config' };
  }

  const img = await compress(file);
  if (!img) return { ok: false, reason: 'bad-image' };

  try {
    const res = await fetch(wishEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        type: 'slip',
        name: name.trim().slice(0, 120),
        image: img.base64,
        mime: img.mime,
        ts: Date.now(),
      }),
      redirect: 'follow',
    });
    if (!res.ok) return { ok: false, reason: 'network' };

    try {
      localStorage.setItem(RATE_KEY, String(Date.now()));
    } catch {
      /* localStorage ปิดอยู่ — ไม่ใช่เหตุให้ล้มเหลว */
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
