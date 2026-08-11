import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Smooth scroll — ปิดอัตโนมัติเมื่อผู้ใช้ขอ reduced motion (brand.md ข้อ 5.4)
 * และหยุด rAF เมื่อแท็บถูกซ่อน เพื่อประหยัดแบตบนมือถือ
 */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // ปล่อยให้ touch scroll เป็น native — ลื่นกว่าและไม่ชนกับ swipe ใน lightbox
      syncTouch: false,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
      lenis.destroy();
    };
  }, [enabled]);
}
