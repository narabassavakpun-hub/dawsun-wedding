/**
 * ค่ากลางของอนิเมชันทั้งเว็บ — brand.md ข้อ 5
 * ห้ามกำหนด easing/duration เองใน component ให้ใช้จากที่นี่
 */
import type { Variants } from 'motion/react';

/** easeOutQuint — นุ่ม ไม่เด้ง */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
  reveal: 1.2,
} as const;

/** viewport config มาตรฐาน — once: true เสมอ ห้ามให้เนื้อหาหายตอนเลื่อนกลับขึ้น */
export const VIEWPORT = { once: true, margin: '-12% 0px' } as const;

/** scroll reveal มาตรฐาน: ขึ้นจากล่าง 24px + fade */
export const reveal = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, y: reduced ? 0 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? DURATION.fast : DURATION.base, ease: EASE },
  },
});

/** container ที่ทยอยเผยลูกทีละชิ้น (stagger 80ms) */
export const staggerParent = (reduced: boolean, stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : stagger,
      delayChildren: reduced ? 0 : 0.05,
    },
  },
});

/** props สำเร็จรูปสำหรับบล็อกที่เผยตัวตอนเลื่อนถึง */
export const revealOnScroll = (reduced: boolean) => ({
  variants: reveal(reduced),
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: VIEWPORT,
});
