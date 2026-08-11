import { useEffect, useRef } from 'react';

const COLORS = ['#F4A9BE', '#B9AEE8', '#9FD0EE', '#F8DFA8', '#F7BE94'];
type Kind = 'petal' | 'heart' | 'sparkle';

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  rotation: number;
  spin: number;
  opacity: number;
  color: string;
  kind: Kind;
};

/** สัดส่วนตาม prd.md ข้อ 5.2 — กลีบ 60% หัวใจ 25% ประกาย 15% */
function pickKind(r: number): Kind {
  if (r < 0.6) return 'petal';
  if (r < 0.85) return 'heart';
  return 'sparkle';
}

function makeParticle(w: number, h: number, seedAbove = false): Particle {
  return {
    x: Math.random() * w,
    y: seedAbove ? -Math.random() * h : Math.random() * h,
    size: 7 + Math.random() * 11,
    speed: 10 + Math.random() * 22, // px ต่อวินาที
    drift: 12 + Math.random() * 26,
    phase: Math.random() * Math.PI * 2,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.6,
    opacity: 0.35 + Math.random() * 0.35,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    kind: pickKind(Math.random()),
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;

  const s = p.size;
  ctx.beginPath();

  if (p.kind === 'petal') {
    // กลีบทรงหยดน้ำโค้ง
    ctx.moveTo(0, -s / 2);
    ctx.bezierCurveTo(s * 0.55, -s * 0.3, s * 0.45, s * 0.4, 0, s / 2);
    ctx.bezierCurveTo(-s * 0.45, s * 0.4, -s * 0.55, -s * 0.3, 0, -s / 2);
  } else if (p.kind === 'heart') {
    const k = s / 22;
    ctx.moveTo(0, 8 * k);
    ctx.bezierCurveTo(-11 * k, 0, -8 * k, -11 * k, 0, -5 * k);
    ctx.bezierCurveTo(8 * k, -11 * k, 11 * k, 0, 0, 8 * k);
  } else {
    // ประกาย 4 แฉก
    const a = s * 0.5;
    const b = s * 0.14;
    ctx.moveTo(0, -a);
    ctx.quadraticCurveTo(b, -b, a, 0);
    ctx.quadraticCurveTo(b, b, 0, a);
    ctx.quadraticCurveTo(-b, b, -a, 0);
    ctx.quadraticCurveTo(-b, -b, 0, -a);
  }

  ctx.fill();
  ctx.restore();
}

/**
 * ชั้นอนุภาคลอย — กลีบดอกไม้ / หัวใจ / ประกาย (prd.md ข้อ 5.2)
 *
 * ข้อควรระวังด้านประสิทธิภาพ:
 * - หยุด rAF เมื่อแท็บถูกซ่อน (ไม่งั้นกินแบตตลอดเวลา)
 * - ลดจำนวนอนุภาคบนเครื่องที่ CPU น้อย
 * - ไม่เรนเดอร์เลยเมื่อผู้ใช้ขอ reduced motion
 */
export function PetalCanvas({ enabled }: { enabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
    let count = isMobile ? 18 : 32;
    if (lowPower) count = Math.round(count / 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2); // จำกัดที่ 2 ไม่งั้น canvas ใหญ่เกินจำเป็น
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    particles = Array.from({ length: count }, () => makeParticle(w, h));

    let rafId = 0;
    let last = performance.now();

    const frame = (now: number) => {
      // clamp dt กันกระโดดตอนกลับมาจากแท็บอื่นหรือเครื่องหน่วง
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.y += p.speed * dt;
        p.phase += dt * 0.7;
        p.x += Math.sin(p.phase) * p.drift * dt;
        p.rotation += p.spin * dt;

        if (p.y - p.size > h) {
          Object.assign(p, makeParticle(w, h), { y: -p.size * 2 });
        }
        drawParticle(ctx, p);
      }

      rafId = requestAnimationFrame(frame);
    };

    const start = () => {
      last = performance.now();
      rafId = requestAnimationFrame(frame);
    };
    const stop = () => cancelAnimationFrame(rafId);

    start();

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        particles = Array.from({ length: count }, () => makeParticle(w, h));
      }, 200);
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
