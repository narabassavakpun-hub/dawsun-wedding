import { motion } from 'motion/react';
import { copy } from '../config/site';
import { SectionHeading } from '../components/Ornaments';
import { useToast } from '../components/Toast';
import { copyText } from '../lib/clipboard';
import { downloadIcs } from '../lib/ics';
import { reveal, staggerParent, VIEWPORT } from '../lib/motion';

function LineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3C6.5 3 2 6.6 2 11c0 4 3.6 7.3 8.4 7.9.3.07.8.22.9.5.1.26.07.66.03.92l-.14.87c-.04.26-.2 1.02.9.56 1.1-.46 5.9-3.5 8.06-6C21.5 14.1 22 12.6 22 11c0-4.4-4.5-8-10-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** ตอนที่ 12 — แชร์และบันทึก (prd.md ตอน 12) */
export function ShareSave({ reduced }: { reduced: boolean }) {
  const toast = useToast();
  const pageUrl = typeof window === 'undefined' ? '' : window.location.href;

  const handleCopyLink = async () => {
    const ok = await copyText(pageUrl);
    toast(ok ? copy.toast.copiedLink : copy.toast.copyFailed);
  };

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`;

  return (
    <section className="section" aria-label="แชร์และบันทึก">
      <div className="container">
        <SectionHeading eyebrow={copy.share.eyebrow} heading={copy.share.heading} reduced={reduced} />

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          variants={staggerParent(reduced, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.a
            variants={reveal(reduced)}
            href={lineShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-soft"
            style={{ color: '#06C755' }}
          >
            <LineIcon />
            <span style={{ color: 'var(--ink)' }}>{copy.share.line}</span>
          </motion.a>

          <motion.button
            variants={reveal(reduced)}
            type="button"
            onClick={handleCopyLink}
            className="btn btn-soft"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="12" height="12" rx="2.5" />
                <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" />
              </g>
            </svg>
            {copy.share.copy}
          </motion.button>

          <motion.button
            variants={reveal(reduced)}
            type="button"
            onClick={downloadIcs}
            className="btn btn-soft"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2.5" />
                <path d="M3 10h18M8 3v4M16 3v4M12 14v4M10 16h4" />
              </g>
            </svg>
            {copy.share.calendar}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
