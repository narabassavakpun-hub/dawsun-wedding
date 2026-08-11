import { motion } from 'motion/react';
import { asset, copy, couple, profilePhoto, type Person } from '../config/site';
import { Monogram } from '../components/Monogram';
import { SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { reveal, staggerParent, VIEWPORT } from '../lib/motion';

/** แหวนคู่ */
function Rings() {
  return (
    <svg width="58" height="38" viewBox="0 0 58 38" aria-hidden="true">
      <g fill="none" strokeWidth="2.2">
        <circle cx="22" cy="23" r="12" stroke="var(--theme-cream)" />
        <circle cx="36" cy="23" r="12" stroke="var(--theme-peach)" />
      </g>
      <path
        d="M22 11 l-3.4 -5.6 h6.8 z"
        fill="var(--theme-cream)"
        stroke="var(--theme-cream)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** ตอนที่ 4 — Monogram + คู่บ่าวสาว (prd.md ตอน 4) */
export function Profiles({ reduced }: { reduced: boolean }) {
  const nameBlock = (person: Person, align: 'right' | 'left') => (
    <motion.div
      variants={reveal(reduced)}
      className={align === 'right' ? 'text-center sm:text-right' : 'text-center sm:text-left'}
    >
      <p className="display-name" style={{ fontSize: 'var(--fs-display-md)' }}>
        {person.nicknameEn}
      </p>
      <p style={{ fontSize: 'var(--fs-body)', color: 'var(--ink)', lineHeight: 1.7 }}>
        {person.fullNameTh}
      </p>
      <p
        style={{
          fontFamily: 'var(--font-th-script)',
          fontSize: 'var(--fs-body-lg)',
          color: 'var(--script-pink)',
          lineHeight: 1.9,
        }}
      >
        ( {person.nicknameTh} )
      </p>
    </motion.div>
  );

  return (
    <section className="section" aria-label="เจ้าบ่าว เจ้าสาว">

      <FlowerAccent corner="bottom-left" reduced={reduced} variant={2} width={28} opacity={0.28} color="var(--theme-peach)" />
      <div className="container">
        <SectionHeading
          eyebrow={copy.profiles.eyebrow}
          heading={copy.profiles.heading}
          reduced={reduced}
        />

        {/* Monogram วาดเส้นทีละเส้นตอนเลื่อนถึง */}
        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4 }}
        >
          <Monogram size={reduced ? 150 : 175} animate={!reduced} />
        </motion.div>

        <motion.div
          className="mt-8"
          variants={staggerParent(reduced, 0.14)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* กรอบโค้ง arch — ลายเซ็นของงาน (brand.md ข้อ 6.2)
              รูปทั้ง 10 ใบเป็นภาพคู่ จึงใช้กรอบเดียวใบใหญ่
              ไม่ครอปแยกคน เพราะสัดส่วนต้นฉบับ 2:3 ครอปแนวนอนแยกหน้าไม่ได้จริง */}
          <motion.div variants={reveal(reduced)} className="mx-auto max-w-[20rem]">
            <div
              className="overflow-hidden"
              style={{
                borderRadius: 'var(--radius-arch)',
                aspectRatio: '4 / 5',
                border: '1px solid rgba(255,255,255,.75)',
                boxShadow: 'var(--shadow-soft)',
                backgroundImage: `url(${profilePhoto.blur})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img
                src={asset(`images/${profilePhoto.src}`)}
                alt={`${couple.bride.fullNameTh} และ ${couple.groom.fullNameTh} ในชุดแต่งงาน`}
                width={profilePhoto.width}
                height={profilePhoto.height}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
                style={{ objectPosition: '50% 22%' }}
              />
            </div>
          </motion.div>

          {/* แหวนคู่คั่นกลาง */}
          <motion.div variants={reveal(reduced)} className="mt-6 flex justify-center">
            <Rings />
          </motion.div>

          {/* ชื่อเรียงคู่กันแบบเดียวกับการ์ดจริง */}
          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-6">
            {nameBlock(couple.bride, 'right')}
            <motion.p
              variants={reveal(reduced)}
              className="hidden text-center sm:block"
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'var(--fs-display-md)',
                color: 'var(--script-pink)',
                lineHeight: 1.2,
              }}
            >
              &amp;
            </motion.p>
            {nameBlock(couple.groom, 'left')}
          </div>

          <motion.p
            variants={reveal(reduced)}
            className="mt-7 text-center"
            style={{
              fontSize: 'var(--fs-caption)',
              letterSpacing: '0.12em',
              color: 'var(--script-pink)',
            }}
          >
            {couple.hashtag}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
