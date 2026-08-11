import confetti from 'canvas-confetti';

const COLORS = ['#F4A9BE', '#B9AEE8', '#9FD0EE', '#F8DFA8', '#F7BE94', '#E8608E'];

/** รูปหัวใจสำหรับคอนเฟตติ (canvas-confetti รองรับ Path2D ผ่าน shapeFromPath) */
function heartShape() {
  try {
    return confetti.shapeFromPath({
      path: 'M12 21C12 21 3 14.5 3 8.5C3 5.5 5.4 3 8.4 3C10.2 3 11.5 4 12 5.2C12.5 4 13.8 3 15.6 3C18.6 3 21 5.5 21 8.5C21 14.5 12 21 12 21Z',
    });
  } catch {
    return undefined;
  }
}

/**
 * คอนเฟตติ + หัวใจพุ่งขึ้น ตอนส่งคำอวยพรสำเร็จ (prd.md ตอน 10)
 * @param origin จุดกำเนิดเป็นสัดส่วน 0-1 ของหน้าจอ (ปกติคือตำแหน่งปุ่มส่ง)
 */
export function celebrate(origin: { x: number; y: number }, reduced: boolean) {
  if (reduced) return; // brand.md ข้อ 5.4 — reduced motion ให้แสดงแค่ข้อความขอบคุณ

  const heart = heartShape();
  const shapes = heart ? [heart, 'circle' as const] : (['circle', 'square'] as const);

  // ระเบิดกลางจากจุดปุ่ม
  confetti({
    particleCount: 70,
    spread: 78,
    startVelocity: 42,
    origin,
    colors: COLORS,
    shapes: shapes as never,
    scalar: 1.1,
    ticks: 220,
    disableForReducedMotion: true,
  });

  // หัวใจพุ่งขึ้นสองข้าง หน่วงเล็กน้อยให้เป็นจังหวะ
  const side = (x: number, angle: number) =>
    confetti({
      particleCount: 26,
      angle,
      spread: 55,
      startVelocity: 48,
      origin: { x, y: origin.y },
      colors: COLORS,
      shapes: shapes as never,
      scalar: 1.3,
      gravity: 0.9,
      ticks: 260,
      disableForReducedMotion: true,
    });

  window.setTimeout(() => side(0.15, 62), 140);
  window.setTimeout(() => side(0.85, 118), 220);
}
