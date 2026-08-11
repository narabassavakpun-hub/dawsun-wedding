import { motion } from 'motion/react';
import { copy, couple, parents, type FamilySide } from '../config/site';
import { Divider, SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { revealOnScroll, staggerParent, reveal, DURATION, EASE, VIEWPORT } from '../lib/motion';

/** ตอนที่ 3 — คำเชิญ + บิดามารดา (prd.md ตอน 3) */
export function Invitation({ reduced }: { reduced: boolean }) {
  const family = (side: FamilySide) => (
    <motion.div variants={reveal(reduced)} className="text-center">
      {/* ข้อความไทย — ห้าม letter-spacing (สระจะหลุดจากพยัญชนะ) brand.md ข้อ 3.2 */}
      <p
        className="mb-2"
        style={{
          fontFamily: 'var(--font-th-display)',
          fontSize: '0.8rem',
          color: 'var(--dusty-blue)',
          letterSpacing: 0,
        }}
      >
        {side.label}
      </p>
      {side.names.map((name) => (
        // ชื่อไทยห้ามตัดบรรทัดกลางชื่อ — brand.md ข้อ 3.2
        <p
          key={name}
          className="thai-nowrap"
          style={{ fontSize: 'var(--fs-body)', color: 'var(--ink)', lineHeight: 1.9 }}
        >
          {name}
        </p>
      ))}
    </motion.div>
  );

  return (
    <section className="section" aria-label="คำเชิญ">

      <FlowerAccent corner="top-right" reduced={reduced} variant={1} width={26} opacity={0.3} color="var(--theme-lavender)" />
      <div className="container">
        <SectionHeading
          eyebrow={copy.invitation.eyebrow}
          heading={copy.invitation.heading}
          reduced={reduced}
        />

        <motion.div
          className="paper mt-8 px-6 py-9 sm:px-10"
          variants={staggerParent(reduced, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* บิดามารดาสองฝั่ง */}
          <div className="grid gap-7 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-4">
            {family(parents.bride)}
            <motion.p
              variants={reveal(reduced)}
              className="text-center"
              style={{
                fontFamily: 'var(--font-th-display)',
                fontSize: 'var(--fs-body)',
                color: 'var(--script-pink)',
              }}
            >
              {copy.invitation.conjunction}
            </motion.p>
            {family(parents.groom)}
          </div>

          <Divider className="my-7" />

          <motion.p
            variants={reveal(reduced)}
            className="text-center"
            style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-muted)', lineHeight: 1.9 }}
          >
            {copy.invitation.body}
          </motion.p>

          {/* ชื่อบ่าวสาว */}
          <motion.div
            variants={reveal(reduced)}
            className="mt-8 grid gap-6 sm:grid-cols-2 sm:gap-4"
          >
            {[couple.bride, couple.groom].map((person) => (
              <div key={person.firstNameEn} className="text-center">
                <p className="display-name" style={{ fontSize: 'var(--fs-display-lg)' }}>
                  {person.firstNameEn}
                </p>
                <p
                  className="mt-1"
                  style={{ fontSize: 'var(--fs-body)', color: 'var(--ink)' }}
                >
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
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          {...revealOnScroll(reduced)}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="mt-6 text-center"
          style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}
        >
          {copy.gift.note}
        </motion.p>
      </div>
    </section>
  );
}
