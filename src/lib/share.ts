export type ShareResult =
  /** เปิด share sheet สำเร็จ (รวมกรณีผู้ใช้กดยกเลิก — ถือว่าจบปกติ) */
  | 'shared'
  /** เบราว์เซอร์ไม่มี Web Share API */
  | 'unsupported'
  /** มี API แต่เรียกแล้วพัง — ให้ผู้เรียกไปใช้ทางสำรอง */
  | 'failed';

/** เบราว์เซอร์รองรับการแชร์ลิงก์ผ่าน share sheet ของระบบไหม */
export function canShareLink(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

/**
 * เปิด share sheet ของระบบ ให้ผู้ใช้เลือกแอปแล้วเด้งเข้าแอปนั้นได้เลย
 * (LINE / Messenger / Facebook / WhatsApp / Gmail / คัดลอกลิงก์ ฯลฯ)
 *
 * ⚠️ ต้องเรียกจาก event handler ของการกดโดยตรง ห้ามมี await คั่นก่อน
 * ไม่งั้นเบราว์เซอร์จะถือว่าไม่ได้มาจาก user gesture แล้วปฏิเสธ
 *
 * ⚠️ ผู้ใช้กดยกเลิก share sheet จะโยน AbortError ออกมา
 * ต้องถือว่าเป็นเรื่องปกติ ห้ามแสดงข้อความว่าล้มเหลว
 */
export async function shareLink(data: {
  title: string;
  text: string;
  url: string;
}): Promise<ShareResult> {
  if (!canShareLink()) return 'unsupported';

  try {
    await navigator.share(data);
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return 'shared';
    return 'failed';
  }
}
