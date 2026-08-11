import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { asset, copy, couple, heroPhoto, weddingDate } from '../config/site';
import { Heart } from '../components/Ornaments';
import { DURATION, EASE } from '../lib/motion';

/** ตอนที่ 2 — Hero: Welcome to our love story (prd.md ตอน 2) */
export function Hero({ reduced, started }: { reduced: boolean; started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // parallax ไม่เกิน 15% ของ viewport — brand.md ข้อ 5.3
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '14%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-6%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  const item = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
      aria-label="ยินดีต้อนรับสู่เรื่องราวความรักของเรา"
    >
      {/* รูป hero — LCP element ห้าม lazy */}
      <motion.div className="absolute inset-0" style={{ y: imageY }}>
        <img
          src={asset(`images/${heroPhoto.src}`)}
          alt={heroPhoto.alt}
          width={heroPhoto.width}
          height={heroPhoto.height}
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover"
          style={{ objectPosition: '50% 28%' }}
        />
      </motion.div>

      {/* overlay พาสเทล — ผูกรูปสตูดิโอโทนเทาเข้ากับธีมท้องฟ้า + รองรับ contrast ข้อความ */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          opacity: overlayOpacity,
          background:
            'linear-gradient(to bottom, rgba(200,191,231,.28) 0%, rgba(243,198,214,.12) 35%, rgba(74,69,80,.45) 78%, rgba(74,69,80,.72) 100%)',
        }}
      />

      <motion.div
        className="container relative z-10 pb-20 text-center"
        style={{ y: contentY, paddingInline: 'var(--page-gutter)' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: 0.25 } },
        }}
        initial="hidden"
        animate={started ? 'visible' : 'hidden'}
      >
        <motion.p
          variants={item}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="eyebrow"
          style={{ color: 'rgba(255,255,255,.9)' }}
        >
          {copy.hero.eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          transition={{ duration: DURATION.slow, ease: EASE }}
          className="script mt-1"
          style={{ fontSize: 'var(--fs-script-hero)', color: '#fff' }}
        >
          {copy.hero.script}
        </motion.h1>

        <motion.p
          variants={item}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="display-name mt-4"
          style={{ fontSize: 'var(--fs-display-md)', color: 'rgba(255,255,255,.95)' }}
        >
          {couple.bride.firstNameEn} &nbsp;&amp;&nbsp; {couple.groom.firstNameEn}
        </motion.p>

        <motion.p
          variants={item}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="numeric mt-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-caption)',
            letterSpacing: '0.28em',
            textIndent: '0.14em',
            color: 'rgba(255,255,255,.82)',
          }}
        >
          {weddingDate.day}.{String(weddingDate.month).padStart(2, '0')}.{weddingDate.year}
        </motion.p>

        <motion.p
          variants={item}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="mt-1"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--fs-caption)',
            letterSpacing: '0.12em',
            color: 'var(--theme-pink)',
          }}
        >
          {couple.hashtag}
        </motion.p>

        {/* ลูกศรหัวใจเชิญให้เลื่อนลง */}
        <motion.div
          variants={item}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <p style={{ fontSize: 'var(--fs-caption)', color: 'rgba(255,255,255,.85)' }}>
            {copy.hero.scrollHint}
          </p>
          <motion.span
            animate={reduced ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart size={22} filled color="var(--theme-pink)" />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
