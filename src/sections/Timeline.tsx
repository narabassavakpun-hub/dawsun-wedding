import { motion } from 'motion/react';
import { copy, schedule } from '../config/site';
import { SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { EASE, VIEWPORT } from '../lib/motion';

/** ไอคอนลายเส้นสไตล์สีน้ำ — brand.md ข้อ 7 (เส้น 1.5px มุมมน ไม่มีไอคอนทึบ) */
function ScheduleIcon({ kind }: { kind: string }) {
  const stroke = {
    fill: 'none',
    stroke: 'var(--dusty-blue)',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (kind === 'monk') {
    // บาตรพระ
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <path {...stroke} d="M12 26h32c0 10-7 17-16 17s-16-7-16-17Z" fill="var(--theme-cream)" fillOpacity=".35" />
        <ellipse {...stroke} cx="28" cy="26" rx="16" ry="4" fill="var(--theme-peach)" fillOpacity=".3" />
        <path {...stroke} d="M22 22c0-4 2-6 6-6s6 2 6 6" />
        <path {...stroke} d="M28 16v-4" />
        <path {...stroke} d="M20 13c2-2 5-3 8-3s6 1 8 3" strokeDasharray="2 3" />
      </svg>
    );
  }

  if (kind === 'khanmak') {
    // พานขันหมาก
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <path {...stroke} d="M28 8l6 9H22l6-9Z" fill="var(--theme-pink)" fillOpacity=".35" />
        <rect {...stroke} x="17" y="17" width="22" height="8" rx="2" fill="var(--theme-cream)" fillOpacity=".4" />
        <rect {...stroke} x="13" y="25" width="30" height="9" rx="2" fill="var(--theme-peach)" fillOpacity=".35" />
        <path {...stroke} d="M20 34h16l4 6H16l4-6Z" fill="var(--theme-lavender)" fillOpacity=".3" />
        <path {...stroke} d="M14 40h28" />
        <path {...stroke} d="M22 46h12" />
      </svg>
    );
  }

  // โต๊ะเลี้ยงฉลอง
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      <path {...stroke} d="M10 26h36c0 7-8 12-18 12s-18-5-18-12Z" fill="var(--theme-blue)" fillOpacity=".28" />
      <path {...stroke} d="M28 38v8" />
      <path {...stroke} d="M20 46h16" />
      <path {...stroke} d="M18 20c0-5 4-9 10-9s10 4 10 9" />
      <circle {...stroke} cx="28" cy="15" r="3" fill="var(--theme-pink)" fillOpacity=".5" />
      <path {...stroke} d="M13 14v8M13 14c-1.5 0-2 1-2 3s1 3 2 3" />
      <path {...stroke} d="M43 14v8" />
    </svg>
  );
}

/** ตอนที่ 6 — Wedding Timeline (prd.md ตอน 6) */
export function Timeline({ reduced }: { reduced: boolean }) {
  return (
    <section className="section" aria-label="กำหนดการ">

      <FlowerAccent corner="bottom-right" reduced={reduced} variant={1} width={26} opacity={0.26} color="var(--theme-blue)" />
      <div className="container">
        <SectionHeading
          eyebrow={copy.timeline.eyebrow}
          heading={copy.timeline.heading}
          reduced={reduced}
        />

        <div className="relative mt-10">
          {/* เส้นแนวตั้ง วาดจากบนลงล่างตอนเลื่อนถึง */}
          <motion.div
            aria-hidden="true"
            className="absolute left-1/2 top-0 w-px -translate-x-1/2 origin-top"
            style={{
              height: '100%',
              background:
                'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--theme-pink) 75%, transparent) 12%, color-mix(in srgb, var(--theme-lavender) 75%, transparent) 88%, transparent)',
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: reduced ? 0.3 : 1.4, ease: EASE }}
          />

          <ol className="relative space-y-8">
            {schedule.map((item, i) => {
              const alignRight = i % 2 === 1;
              return (
                <motion.li
                  key={item.time}
                  className={`flex w-full items-center gap-3 ${alignRight ? 'flex-row-reverse' : ''}`}
                  initial={{ opacity: 0, x: reduced ? 0 : alignRight ? 28 : -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: reduced ? 0.3 : 0.7, ease: EASE, delay: i * 0.12 }}
                >
                  <div
                    className={`paper flex flex-1 items-center gap-3 px-4 py-4 ${
                      alignRight ? 'flex-row-reverse text-right' : ''
                    }`}
                  >
                    <ScheduleIcon kind={item.icon} />
                    <div className={alignRight ? 'text-right' : ''}>
                      <p
                        className="numeric"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'var(--fs-display-md)',
                          color: 'var(--script-pink)',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.time}
                      </p>
                      <p
                        style={{
                          fontFamily: 'var(--font-th-display)',
                          fontSize: 'var(--fs-body-lg)',
                          color: 'var(--ink)',
                          lineHeight: 1.6,
                        }}
                      >
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {/* จุดบนเส้นกลาง */}
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full"
                    style={{
                      background: 'var(--paper)',
                      border: '2px solid var(--script-pink)',
                      boxShadow: '0 0 0 4px color-mix(in srgb, var(--theme-pink) 30%, transparent)',
                    }}
                  />

                  <div className="flex-1" aria-hidden="true" />
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
