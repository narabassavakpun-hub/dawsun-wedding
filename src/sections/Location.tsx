import { motion } from 'motion/react';
import { copy, venue } from '../config/site';
import { SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { useToast } from '../components/Toast';
import { copyText } from '../lib/clipboard';
import { reveal, staggerParent, VIEWPORT } from '../lib/motion';

const fullAddress = `${venue.nameTh} ${venue.nameEn} ${venue.area} (${venue.room}) ${venue.addressLines.join(' ')}`;

function MapPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 22s7-6.2 7-11.5A7 7 0 0 0 5 10.5C5 15.8 12 22 12 22Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.3" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/** ตอนที่ 8 — สถานที่จัดงาน (prd.md ตอน 8) */
export function Location({ reduced }: { reduced: boolean }) {
  const toast = useToast();

  const handleCopyAddress = async () => {
    const ok = await copyText(fullAddress);
    toast(ok ? copy.toast.copiedAddress : copy.toast.copyFailed);
  };

  return (
    <section className="section" aria-label="สถานที่จัดงาน">

      <FlowerAccent corner="bottom-left" reduced={reduced} variant={0} width={26} opacity={0.26} color="var(--theme-blue)" />
      <div className="container">
        <SectionHeading
          eyebrow={copy.location.eyebrow}
          heading={copy.location.heading}
          reduced={reduced}
        />

        <motion.div
          className="paper mt-8 px-6 py-8 text-center sm:px-9"
          variants={staggerParent(reduced, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p
            variants={reveal(reduced)}
            style={{
              fontFamily: 'var(--font-th-display)',
              fontSize: 'var(--fs-display-md)',
              fontWeight: 700,
              color: 'var(--ink)',
              lineHeight: 1.5,
            }}
          >
            {venue.nameTh}{' '}
            <span className="display-name" style={{ fontSize: 'inherit' }}>
              {venue.nameEn}
            </span>{' '}
            {venue.area}
          </motion.p>

          <motion.p
            variants={reveal(reduced)}
            style={{ fontSize: 'var(--fs-body)', color: 'var(--script-pink)' }}
          >
            ({venue.room})
          </motion.p>

          {/* แตะที่อยู่เพื่อคัดลอก */}
          <motion.button
            variants={reveal(reduced)}
            type="button"
            onClick={handleCopyAddress}
            className="mt-4 block w-full rounded-[var(--radius-sm)] px-3 py-2 text-center"
            style={{ background: 'transparent' }}
          >
            {venue.addressLines.map((line) => (
              <span
                key={line}
                className="block"
                style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-muted)', lineHeight: 1.9 }}
              >
                {line}
              </span>
            ))}
            <span
              className="mt-2 block"
              style={{ fontSize: 'var(--fs-caption)', color: 'var(--script-pink)' }}
            >
              {copy.location.copyHint}
            </span>
          </motion.button>

          {/* การ์ดแผนที่แบบเรียบ (ไม่ฝัง iframe — เลี่ยง third-party tracker ตาม prd.md ข้อ 7.4) */}
          <motion.a
            variants={reveal(reduced)}
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block overflow-hidden rounded-[var(--radius-md)]"
            style={{
              border: '1px solid color-mix(in srgb, var(--theme-blue) 55%, transparent)',
              background:
                'linear-gradient(150deg, color-mix(in srgb, var(--theme-blue) 22%, var(--paper)), color-mix(in srgb, var(--theme-cream) 30%, var(--paper)))',
            }}
          >
            <div className="relative grid h-40 place-items-center sm:h-48">
              {/* ลายเส้นถนน + แม่น้ำ ตกแต่ง */}
              <svg
                className="absolute inset-0 size-full"
                viewBox="0 0 400 200"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 150 C 80 130, 140 170, 220 150 S 340 120, 400 140"
                  fill="none"
                  stroke="color-mix(in srgb, var(--theme-blue) 70%, transparent)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path d="M0 70 H400 M120 0 V200 M280 0 V200" stroke="rgba(255,255,255,.75)" strokeWidth="7" />
                <path d="M0 105 H400" stroke="rgba(255,255,255,.5)" strokeWidth="4" />
              </svg>

              <div className="relative flex flex-col items-center gap-1" style={{ color: 'var(--seal-magenta)' }}>
                <motion.span
                  animate={reduced ? {} : { y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MapPin />
                </motion.span>
                <span
                  style={{
                    fontFamily: 'var(--font-th-display)',
                    fontSize: 'var(--fs-body)',
                    color: 'var(--ink)',
                  }}
                >
                  {venue.nameTh} {venue.area}
                </span>
              </div>
            </div>
          </motion.a>

          <motion.a
            variants={reveal(reduced)}
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-5 w-full sm:w-auto"
          >
            <MapPin />
            {copy.location.button}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
