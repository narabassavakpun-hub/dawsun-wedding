import { wishEndpoint, copy } from '../config/site';

const RATE_LIMIT_KEY = 'dawsun:last-wish';
const RATE_LIMIT_MS = 60_000;

export type WishPayload = {
  name: string;
  message: string;
  /** honeypot — ถ้ามีค่าแปลว่าเป็นบอท */
  website: string;
};

export type WishResult = { ok: true } | { ok: false; reason: 'rate-limit' | 'network' | 'config' };

export function canSubmitNow(): boolean {
  try {
    const last = Number(localStorage.getItem(RATE_LIMIT_KEY) ?? 0);
    return Date.now() - last > RATE_LIMIT_MS;
  } catch {
    return true; // localStorage ถูกปิด (โหมดส่วนตัว) — ปล่อยผ่าน
  }
}

/**
 * ส่งคำอวยพรไป Google Apps Script → Google Sheet
 *
 * ⚠️ ต้องส่งเป็น `text/plain` เท่านั้น
 * Apps Script Web App ไม่ตอบ CORS preflight (OPTIONS) — ถ้าส่ง `application/json`
 * เบราว์เซอร์จะยิง preflight ก่อนแล้วโดนบล็อกทั้งคำขอ
 * `text/plain` ทำให้เป็น simple request ที่ไม่เกิด preflight
 * ฝั่ง Apps Script อ่าน e.postData.contents แล้ว JSON.parse เอง (apps-script/Code.gs)
 */
export async function submitWish(payload: WishPayload): Promise<WishResult> {
  // บอทติดกับดัก — ทำเป็นสำเร็จเพื่อไม่ให้รู้ตัว แต่ไม่ส่งจริง
  if (payload.website.trim() !== '') return { ok: true };

  if (!canSubmitNow()) return { ok: false, reason: 'rate-limit' };

  if (!wishEndpoint) {
    console.warn(
      '[guestbook] ยังไม่ได้ตั้ง VITE_WISH_ENDPOINT — ดูวิธีตั้งค่าใน CLAUDE.md หัวข้อ "Backend: Google Sheet"',
    );
    return { ok: false, reason: 'config' };
  }

  try {
    const res = await fetch(wishEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name: payload.name.trim().slice(0, 120),
        message: payload.message.trim().slice(0, copy.guestbook.maxLength),
        userAgent: navigator.userAgent,
        ts: Date.now(),
      }),
      redirect: 'follow',
    });

    if (!res.ok) return { ok: false, reason: 'network' };

    try {
      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    } catch {
      /* localStorage ถูกปิด — ข้ามไป ไม่ใช่เหตุให้ล้มเหลว */
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
