export type SaveImageResult =
  | { ok: true; how: 'share' | 'download' }
  /** บันทึกให้อัตโนมัติไม่ได้ — เปิดรูปให้แล้ว ผู้ใช้ต้องกดค้างเอง */
  | { ok: false; how: 'long-press' };

/** มือถือหรือแท็บเล็ต (ใช้ตัดสินว่าจะลองแชร์ก่อนหรือดาวน์โหลดก่อน) */
function isTouchDevice() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
}

/**
 * บันทึกรูปลงเครื่อง โดยพยายามให้ลง **คลังภาพ** ให้ได้บนมือถือ
 *
 * ทำไมไม่ใช้ <a download> อย่างเดียว:
 *   บนมือถือ ถ้า `download` ทำงานเลย ไฟล์จะไปอยู่ใน "ไฟล์" ไม่ใช่ "รูปภาพ"
 *   และ in-app browser ของ LINE เมิน attribute นี้ กลายเป็นแค่เปิดรูปดูเฉยๆ
 *
 * ลำดับที่ลอง:
 *   1. Web Share API พร้อมไฟล์ — เปิด share sheet ให้กด "บันทึกภาพ" ลงคลังภาพได้จริง
 *      (ทางเดียวที่ลงคลังภาพได้บน iOS Safari และ Chrome Android)
 *   2. <a download> — สำหรับเดสก์ท็อป
 *   3. เปิดรูปในแท็บใหม่ แล้วบอกผู้ใช้ให้กดค้างเพื่อบันทึกเอง
 */
export async function saveImage(url: string, filename: string): Promise<SaveImageResult> {
  const touch = isTouchDevice();

  if (touch) {
    try {
      const res = await fetch(url, { cache: 'force-cache' });
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], filename, { type: blob.type || 'image/png' });
        // canShare ต้องเช็กก่อน — บางเบราว์เซอร์มี share แต่ไม่รับไฟล์
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          return { ok: true, how: 'share' };
        }
      }
    } catch (err) {
      // ผู้ใช้กดยกเลิก share sheet ก็มาเข้าทางนี้ — ถือว่าจบแล้ว ไม่ต้องเปิดแท็บใหม่ซ้อน
      if (err instanceof DOMException && err.name === 'AbortError') {
        return { ok: true, how: 'share' };
      }
    }
  }

  // เดสก์ท็อป: download ทำงานได้ตามปกติ
  if (!touch) {
    try {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return { ok: true, how: 'download' };
    } catch {
      /* ตกไปทางสำรอง */
    }
  }

  // ทางสำรองสุดท้าย — เปิดรูปให้ ผู้ใช้กดค้างบันทึกเอง
  window.open(url, '_blank', 'noopener');
  return { ok: false, how: 'long-press' };
}
