import { useEffect, useState } from 'react';

/**
 * true = ผู้ใช้ขอให้ลดการเคลื่อนไหว
 * ดูตารางพฤติกรรมที่ต้องปรับใน brand.md ข้อ 5.4
 *
 * (แยกจาก useReducedMotion ของ motion/react เพื่อให้ใช้ค่านี้กับโค้ดที่ไม่ใช่อนิเมชันได้ด้วย
 *  เช่น ปิด canvas อนุภาค หรือปิด Lenis)
 */
export function useMotionPreference(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
