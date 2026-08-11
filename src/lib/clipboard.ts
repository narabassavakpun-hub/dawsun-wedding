/**
 * คัดลอกข้อความ พร้อม fallback สำหรับ in-app browser ของ LINE/Facebook
 * ที่บางเวอร์ชันไม่รองรับ navigator.clipboard (หรือไม่ได้อยู่ใน secure context)
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* ตกไปใช้ fallback ด้านล่าง */
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length); // iOS ต้องระบุช่วงชัดเจน
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}
