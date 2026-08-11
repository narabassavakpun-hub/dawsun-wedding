import { motion } from 'motion/react';
import { copy, couple, weddingDate } from '../config/site';
import { Monogram } from '../components/Monogram';
import { Divider } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { revealOnScroll } from '../lib/motion';

/** ตอนที่ 13 — Footer (prd.md ตอน 13) */
export function Footer({ reduced }: { reduced: boolean }) {
  return (
    <footer className="section pb-24 text-center" aria-label="ท้ายการ์ด">

      <FlowerAccent corner="bottom-left" reduced={reduced} variant={1} width={30} opacity={0.3} color="var(--theme-peach)" />
      <motion.div className="container" {...revealOnScroll(reduced)}>
        <div className="flex justify-center opacity-70">
          <Monogram size={120} color="var(--script-pink)" />
        </div>

        <Divider className="my-6" />

        <p
          className="whitespace-pre-line"
          style={{
            fontFamily: 'var(--font-th-display)',
            fontSize: 'var(--fs-body-lg)',
            color: 'var(--ink)',
            lineHeight: 1.9,
          }}
        >
          {copy.footer.thanks}
        </p>

        <p
          className="script mt-6"
          style={{ fontSize: 'clamp(2rem, 9vw, 3rem)' }}
        >
          {couple.bride.nicknameEn.charAt(0) + couple.bride.nicknameEn.slice(1).toLowerCase()} &amp;{' '}
          {couple.groom.nicknameEn.charAt(0) + couple.groom.nicknameEn.slice(1).toLowerCase()}
        </p>

        <p
          className="numeric mt-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--fs-caption)',
            letterSpacing: '0.3em',
            textIndent: '0.15em',
            color: 'var(--dusty-blue)',
          }}
        >
          {weddingDate.displayShort}
        </p>

        <p
          className="mt-4"
          style={{
            fontSize: 'var(--fs-caption)',
            letterSpacing: '0.1em',
            color: 'var(--script-pink)',
          }}
        >
          {couple.hashtag}
        </p>
      </motion.div>
    </footer>
  );
}
