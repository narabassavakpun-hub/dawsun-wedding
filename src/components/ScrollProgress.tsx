import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Heart } from './Ornaments';

function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 0 : window.innerWidth));
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

/**
 * แถบความคืบหน้าการเลื่อน — ไล่เฉด 5 สีธีม + หัวใจวิ่งตามปลายแถบ (prd.md ข้อ 5.3)
 * ซ่อนตอนซองยังไม่เปิด
 */
export function ScrollProgress({ visible, reduced }: { visible: boolean; reduced: boolean }) {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  const progress = reduced ? scrollYProgress : smooth;

  const width = useViewportWidth();
  const heartX = useTransform(progress, (v) => v * width);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 overflow-hidden"
      aria-hidden="true"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="relative h-[3px]">
        <motion.div
          className="h-full w-full origin-left"
          style={{
            scaleX: progress,
            background:
              'linear-gradient(90deg, var(--theme-pink), var(--theme-lavender), var(--theme-blue), var(--theme-cream), var(--theme-peach))',
          }}
        />
        <motion.div
          className="absolute top-0 left-0 -translate-x-1/2 -translate-y-[3px]"
          style={{ x: heartX }}
        >
          <Heart size={13} filled color="var(--script-pink)" />
        </motion.div>
      </div>
    </div>
  );
}
