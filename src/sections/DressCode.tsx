import { motion } from 'motion/react';
import { copy, themeColors } from '../config/site';
import { SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { useToast } from '../components/Toast';
import { copyText } from '../lib/clipboard';
import { EASE, reveal, staggerParent, VIEWPORT } from '../lib/motion';

function Outfits() {
  const stroke = {
    fill: 'none',
    stroke: 'var(--dusty-blue)',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <svg width="200" height="130" viewBox="0 0 200 130" aria-hidden="true" className="mx-auto">
      {/* สูท */}
      <g>
        <path {...stroke} d="M46 34c-10 3-16 9-16 18v62h56V52c0-9-6-15-16-18" fill="var(--paper)" />
        <path {...stroke} d="M46 34l12 22 12-22" fill="var(--theme-lavender)" fillOpacity=".22" />
        <path {...stroke} d="M46 34l12 22-4 58M70 34L58 56l4 58" />
        <path {...stroke} d="M55 36h6l-3 6z" fill="var(--ink)" fillOpacity=".55" />
        <path {...stroke} d="M52 30c0-4 3-6 6-6s6 2 6 6" />
      </g>
      {/* ชุดเจ้าสาว */}
      <g transform="translate(88,0)">
        <path {...stroke} d="M46 18v6" />
        <path {...stroke} d="M38 26h16" />
        <path {...stroke} d="M38 26c0 6 3 10 8 10s8-4 8-10" fill="var(--paper)" />
        <path
          {...stroke}
          d="M46 36c-3 12-6 20-16 32-8 10-12 20-12 30h56c0-10-4-20-12-30-10-12-13-20-16-32Z"
          fill="var(--theme-pink)"
          fillOpacity=".16"
        />
        <path {...stroke} d="M30 82c8 6 24 6 32 0M26 92c10 7 26 7 36 0" strokeOpacity=".5" />
      </g>
    </svg>
  );
}

/** ตอนที่ 9 — Dress Code (prd.md ตอน 9) */
export function DressCode({ reduced }: { reduced: boolean }) {
  const toast = useToast();

  const handleCopy = async (hex: string) => {
    const ok = await copyText(hex);
    toast(ok ? `${copy.toast.copiedColor} ${hex}` : copy.toast.copyFailed);
  };

  return (
    <section className="section" aria-label="ธีมสีของงาน">

      <FlowerAccent corner="top-left" reduced={reduced} variant={1} width={24} opacity={0.26} color="var(--theme-peach)" />
      <div className="container">
        <SectionHeading
          eyebrow={copy.dressCode.eyebrow}
          heading={copy.dressCode.heading}
          reduced={reduced}
        />

        <motion.div
          className="paper mt-8 px-6 py-8 text-center"
          variants={staggerParent(reduced, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={reveal(reduced)}>
            <Outfits />
          </motion.div>

          <motion.div
            variants={reveal(reduced)}
            className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            {themeColors.map((color, i) => (
              <motion.button
                key={color.hex}
                type="button"
                onClick={() => handleCopy(color.hex)}
                aria-label={`คัดลอกรหัสสี ${color.name} ${color.hex}`}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                whileTap={{ scale: 0.92 }}
              >
                {/* พื้นที่แตะ ≥ 44px — brand.md ข้อ 9 */}
                <span
                  className="grid size-12 place-items-center rounded-full sm:size-14"
                  style={{
                    background: color.hex,
                    border: '2px solid rgba(255,255,255,.85)',
                    boxShadow: `0 6px 18px -6px ${color.hex}`,
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
                  {color.name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          <motion.p
            variants={reveal(reduced)}
            className="mt-7 whitespace-pre-line"
            style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-muted)', lineHeight: 1.9 }}
          >
            {copy.dressCode.body}
          </motion.p>

          <motion.p
            variants={reveal(reduced)}
            className="mt-3"
            style={{ fontSize: 'var(--fs-caption)', color: 'var(--script-pink)' }}
          >
            {copy.dressCode.hint}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
