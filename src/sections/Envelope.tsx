import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { asset, copy, couple, weddingDate } from '../config/site';
import { Heart, Sparkle } from '../components/Ornaments';
import { Monogram } from '../components/Monogram';
import { FlowerAccent } from '../components/FlowerAccent';
import { DURATION, EASE } from '../lib/motion';

/**
 * ตอนที่ 1 — ซองจดหมาย (prd.md ตอน 1)
 *
 * มีสองหน้าที่:
 * 1. สร้างโมเมนต์ "เปิดซอง" ให้เหมือนได้รับการ์ดจริง
 * 2. เป็น user gesture ที่ปลดล็อกให้เพลงเล่นได้ (เบราว์เซอร์บล็อก autoplay ที่มีเสียง)
 */
export function Envelope({ onOpen, reduced }: { onOpen: () => void; reduced: boolean }) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  const handleOpen = () => {
    if (opening) {
      // แตะซ้ำระหว่างอนิเมชัน = ข้ามไปสถานะจบทันที (prd.md ตอน 1 ข้อ 3)
      setGone(true);
      return;
    }
    setOpening(true);
    onOpen(); // เรียกทันทีใน event handler — เบราว์เซอร์ถึงจะยอมให้เพลงเล่น
    window.setTimeout(() => setGone(true), reduced ? 300 : 1800);
  };

  const sparkleAngles = [0, 60, 120, 180, 240, 300];

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="envelope"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6"
          style={{ background: 'var(--gradient-sky)' }}
          exit={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
          transition={{ duration: reduced ? 0.3 : 0.6, ease: EASE }}
        >
          {/* ฝ้าเมฆ */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 45% at 20% 15%, rgba(255,255,255,.6), transparent 70%), radial-gradient(55% 40% at 82% 30%, rgba(255,255,255,.45), transparent 70%)',
            }}
          />

          {/* ดอกไม้ประดับมุม — บานทีละดอก */}
          <FlowerAccent corner="top-left" reduced={reduced} width={30} opacity={0.4} variant={0} />
          <FlowerAccent corner="top-right" reduced={reduced} width={26} opacity={0.32} variant={1} />
          <FlowerAccent
            corner="bottom-left"
            reduced={reduced}
            width={30}
            opacity={0.3}
            variant={2}
            color="var(--theme-peach)"
          />
          <FlowerAccent
            corner="bottom-right"
            reduced={reduced}
            width={28}
            opacity={0.3}
            variant={1}
            color="var(--theme-lavender)"
          />

          <motion.p
            className="eyebrow relative mb-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE, delay: 0.2 }}
          >
            {copy.envelope.eyebrow}
          </motion.p>

          <motion.p
            className="numeric relative mb-8 text-center"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-caption)',
              letterSpacing: '0.2em',
              color: 'var(--ink-muted)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATION.base, ease: EASE, delay: 0.35 }}
          >
            {weddingDate.dayOfWeekEn} · {weddingDate.day} {weddingDate.monthEn} {weddingDate.year}
          </motion.p>

          {/* ---------- ซอง ---------- */}
          <motion.button
            type="button"
            onClick={handleOpen}
            aria-label={copy.envelope.aria}
            className="relative block w-full max-w-[22rem] rounded-[10px]"
            style={{ perspective: '1400px', aspectRatio: '3 / 2' }}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: opening && !reduced ? 1.04 : 1,
            }}
            transition={{ duration: DURATION.slow, ease: EASE, delay: 0.15 }}
            whileTap={opening ? undefined : { scale: 0.98 }}
          >
            {/* ตัวซอง */}
            <div
              className="absolute inset-0 overflow-hidden rounded-[10px]"
              style={{
                background: 'linear-gradient(150deg, #FFFCFA 0%, #FDF2F1 55%, #FBE7E9 100%)',
                boxShadow: 'var(--shadow-lift)',
              }}
            >
              {/* รอยพับสามเหลี่ยมซ้าย-ขวา */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom right, rgba(0,0,0,.035) 49.6%, transparent 50%), linear-gradient(to bottom left, rgba(0,0,0,.035) 49.6%, transparent 50%)',
                }}
              />
              {/* รอยพับล่าง */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,.03), transparent)',
                  clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                }}
              />
            </div>

            {/* การ์ดด้านในเลื่อนขึ้น */}
            <motion.div
              className="absolute left-1/2 w-[84%] rounded-[6px]"
              style={{
                bottom: '10%',
                x: '-50%',
                aspectRatio: '5 / 3.4',
                background: 'var(--paper)',
                boxShadow: '0 -6px 18px -8px rgba(120,90,110,.35)',
                zIndex: 1,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={
                opening && !reduced
                  ? { y: '-58%', opacity: 1, transition: { duration: 0.9, ease: EASE, delay: 0.55 } }
                  : { y: 0, opacity: 0 }
              }
            >
              <div className="flex h-full flex-col items-center justify-center gap-1 px-3 text-center">
                <span
                  className="script"
                  style={{ fontSize: 'clamp(1.4rem, 6vw, 2rem)', lineHeight: 1 }}
                >
                  {couple.bride.firstNameEn.charAt(0) + couple.bride.firstNameEn.slice(1).toLowerCase()}
                </span>
                <span
                  className="script"
                  style={{ fontSize: 'clamp(1.4rem, 6vw, 2rem)', lineHeight: 1 }}
                >
                  {couple.groom.firstNameEn.charAt(0) +
                    couple.groom.firstNameEn.slice(1).toLowerCase()}
                </span>
              </div>
            </motion.div>

            {/* ฝาซองบน — พลิก 3D */}
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                height: '58%',
                transformStyle: 'preserve-3d',
                zIndex: 2,
              }}
              initial={{ rotateX: 0 }}
              animate={
                opening && !reduced
                  ? { rotateX: -178, transition: { duration: 0.9, ease: EASE, delay: 0.25 } }
                  : { rotateX: 0 }
              }
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(165deg, #FFFDFC 0%, #FBE9EC 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  filter: 'drop-shadow(0 3px 6px rgba(150,110,135,.18))',
                  backfaceVisibility: 'hidden',
                }}
              />
            </motion.div>

            {/* ตราครั่ง W N */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-[3]"
              style={{ x: '-50%', y: '-50%' }}
              animate={
                opening
                  ? reduced
                    ? { opacity: 0 }
                    : { scale: [1, 1.18, 0.4], opacity: [1, 1, 0], transition: { duration: 0.5, ease: EASE } }
                  : { scale: 1, opacity: 1 }
              }
            >
              <div
                className="grid size-[74px] place-items-center rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, #D6488C 0%, var(--seal-magenta) 55%, #8E1650 100%)',
                  boxShadow: 'inset 0 -2px 6px rgba(0,0,0,.25), 0 4px 12px -3px rgba(142,22,80,.5)',
                }}
              >
                <Monogram size={62} color="rgba(255,235,245,.94)" />
              </div>
            </motion.div>

            {/* ประกายกระจายตอนตราครั่งแตก */}
            {opening &&
              !reduced &&
              sparkleAngles.map((angle) => (
                <motion.div
                  key={angle}
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 z-[3]"
                  initial={{ x: '-50%', y: '-50%', opacity: 0, scale: 0.4 }}
                  animate={{
                    x: `calc(-50% + ${Math.cos((angle * Math.PI) / 180) * 90}px)`,
                    y: `calc(-50% + ${Math.sin((angle * Math.PI) / 180) * 90}px)`,
                    opacity: [0, 1, 0],
                    scale: [0.4, 1.1, 0.5],
                  }}
                  transition={{ duration: 0.75, ease: EASE, delay: 0.2 }}
                >
                  <Sparkle size={18} color="var(--theme-cream)" />
                </motion.div>
              ))}
          </motion.button>

          {/* ---------- คำใบ้ให้กด ---------- */}
          <motion.div
            className="relative mt-9 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ duration: DURATION.base, ease: EASE, delay: opening ? 0 : 0.7 }}
          >
            <motion.span
              animate={reduced ? {} : { scale: [1, 1.16, 1], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={20} filled color="var(--script-pink)" />
            </motion.span>
            <p
              style={{
                fontFamily: 'var(--font-th-display)',
                fontSize: 'var(--fs-body)',
                color: 'var(--ink)',
              }}
            >
              {copy.envelope.hint}
            </p>
          </motion.div>

          {/* ภาพวาดบ่าวสาว — วางต่อท้ายในสายลำดับเหมือนภาพตัวอย่างที่ 1
              ไม่ใช้ absolute เพราะจะไปทับข้อความ "กดที่ซองเพื่อเปิด" บนจอเตี้ย */}
          <motion.img
            src={asset('images/couple-illustration.webp')}
            alt=""
            aria-hidden="true"
            width={900}
            height={1350}
            fetchPriority="high"
            decoding="async"
            className="pointer-events-none relative mt-2 w-auto max-w-full select-none"
            style={{
              height: 'clamp(9rem, 26svh, 15rem)',
              objectFit: 'contain',
              objectPosition: 'bottom',
              // จางเพิ่มอีกชั้นด้านล่าง ให้จมกลืนไปกับพื้นหลังท้องฟ้า
              maskImage: 'linear-gradient(to bottom, #000 68%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 68%, transparent 100%)',
            }}
            initial={{ opacity: 0, y: reduced ? 0 : 22 }}
            animate={{ opacity: opening ? 0 : 0.92, y: 0 }}
            transition={{ duration: reduced ? 0.3 : 1.1, ease: EASE, delay: opening ? 0 : 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
