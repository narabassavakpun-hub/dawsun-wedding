import { motion } from 'motion/react';
import { copy, weddingDate } from '../config/site';
import { SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { useCountdown } from '../hooks/useCountdown';
import { reveal, staggerParent, VIEWPORT } from '../lib/motion';

const WEEKDAYS_TH = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

/** สร้างช่องปฏิทินของเดือนที่กำหนด (ช่องว่างนำหน้าเป็น null) */
function buildMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 = อาทิตย์
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
}

/** หัวใจลายเส้นวาดมือที่ล้อมรอบวันแต่งงาน */
function HeartRing({ reduced }: { reduced: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 64 60"
      className="pointer-events-none absolute left-1/2 top-1/2 w-[150%]"
      style={{ x: '-50%', y: '-50%', overflow: 'visible' }}
      aria-hidden="true"
      animate={reduced ? { scale: 1, opacity: 1 } : { scale: [1, 1.08, 1], opacity: [0.72, 1, 0.72] }}
      transition={
        reduced ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <path
        d="M32 55C32 55 5 39.5 5 22.5C5 13 12 6 20.5 6C25.8 6 30 8.9 32 12.6C34 8.9 38.2 6 43.5 6C52 6 59 13 59 22.5C59 39.5 32 55 32 55Z"
        fill="none"
        stroke="var(--script-pink)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(232,96,142,.45))' }}
      />
    </motion.svg>
  );
}

function CountdownUnit({
  value,
  label,
  reduced,
}: {
  value: number;
  label: string;
  reduced: boolean;
}) {
  const text = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div
        className="grid min-w-[3.75rem] place-items-center rounded-[var(--radius-md)] px-2 py-3 sm:min-w-[4.5rem]"
        style={{
          background: 'color-mix(in srgb, var(--paper) 92%, transparent)',
          border: '1px solid rgba(255,255,255,.75)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {/* ⚠️ fontSize ต้องอยู่ที่ span ชั้นนอกนี้ ไม่ใช่ชั้นใน
            เพราะ height ที่เป็นหน่วย em คิดจาก font-size ของ element ตัวเอง
            ถ้าไปตั้ง fontSize ไว้ชั้นในอย่างเดียว กล่องจะสูงตาม font-size ที่สืบทอดมา (~16px)
            แล้ว overflow:hidden จะเฉือนตัวเลขขาด */}
        <span
          className="numeric relative block overflow-hidden"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 7vw, 2.3rem)',
            lineHeight: 1.25,
            height: '1.25em',
          }}
        >
          <motion.span
            key={text}
            initial={reduced ? false : { y: '-100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="block"
            style={{ fontWeight: 400, color: 'var(--dusty-blue)' }}
          >
            {text}
          </motion.span>
        </span>
      </div>
      <span className="mt-2" style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}>
        {label}
      </span>
    </div>
  );
}

/** ตอนที่ 5 — ปฏิทินหัวใจกระพริบ + นับถอยหลัง (prd.md ตอน 5) */
export function HeartCalendar({ reduced }: { reduced: boolean }) {
  const cells = buildMonthGrid(weddingDate.year, weddingDate.month);
  const { days, hours, minutes, seconds, passed } = useCountdown(weddingDate.iso);
  const labels = copy.calendar.countdownLabels;

  return (
    <section className="section" aria-label="วันแต่งงานและนับถอยหลัง">

      <FlowerAccent corner="top-left" reduced={reduced} variant={0} width={24} opacity={0.26} color="var(--theme-pink)" />
      <div className="container">
        <SectionHeading eyebrow={copy.calendar.eyebrow} reduced={reduced} />

        <motion.div
          className="paper mt-8 px-4 py-8 sm:px-8"
          variants={staggerParent(reduced, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          {/* หัวปฏิทิน */}
          <motion.p
            variants={reveal(reduced)}
            className="display-name text-center"
            style={{ fontSize: 'var(--fs-display-md)' }}
          >
            {weddingDate.monthEn}
          </motion.p>

          <motion.div
            variants={reveal(reduced)}
            className="mt-3 flex items-center justify-center gap-4 sm:gap-6"
          >
            <div className="text-right">
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-caption)',
                  letterSpacing: '0.16em',
                  color: 'var(--ink-muted)',
                }}
              >
                {weddingDate.dayOfWeekEn}
              </p>
              <p
                className="thai-nowrap"
                style={{ fontFamily: 'var(--font-th-display)', color: 'var(--ink)' }}
              >
                {weddingDate.dayOfWeekTh}
              </p>
            </div>

            <div
              aria-hidden="true"
              style={{ width: 1, height: 52, background: 'color-mix(in srgb, var(--theme-pink) 60%, transparent)' }}
            />

            <p
              className="numeric"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 15vw, 4.5rem)',
                fontWeight: 300,
                lineHeight: 1.05,
                color: 'var(--script-pink)',
              }}
            >
              {weddingDate.day}
            </p>

            <div
              aria-hidden="true"
              style={{ width: 1, height: 52, background: 'color-mix(in srgb, var(--theme-pink) 60%, transparent)' }}
            />

            <div className="text-left">
              <p
                className="numeric"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-display-md)',
                  color: 'var(--dusty-blue)',
                }}
              >
                {weddingDate.year}
              </p>
              <p
                className="thai-nowrap"
                style={{ fontFamily: 'var(--font-th-display)', color: 'var(--ink)' }}
              >
                {weddingDate.monthTh} {weddingDate.yearTh}
              </p>
            </div>
          </motion.div>

          {/* ตารางวัน */}
          <motion.div variants={reveal(reduced)} className="mt-7">
            <div className="grid grid-cols-7 gap-y-1">
              {WEEKDAYS_TH.map((d, i) => (
                <div
                  key={d}
                  className="text-center"
                  style={{
                    fontSize: 'var(--fs-caption)',
                    color: i === 0 ? 'var(--script-pink)' : 'var(--ink-muted)',
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-y-1.5">
              {cells.map((day, i) => {
                const isWedding = day === weddingDate.day;
                return (
                  <div
                    key={i}
                    className="relative grid aspect-square place-items-center"
                    aria-current={isWedding ? 'date' : undefined}
                  >
                    {isWedding && <HeartRing reduced={reduced} />}
                    {day !== null && (
                      <span
                        className="numeric relative z-10"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: isWedding ? 'clamp(1.05rem, 4.4vw, 1.25rem)' : 'var(--fs-body)',
                          fontWeight: isWedding ? 500 : 300,
                          color: isWedding ? 'var(--seal-magenta)' : 'var(--ink)',
                          lineHeight: 1,
                        }}
                      >
                        {day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* นับถอยหลัง */}
          <motion.div variants={reveal(reduced)} className="mt-9">
            {passed ? (
              <p
                className="text-center"
                style={{
                  fontFamily: 'var(--font-th-display)',
                  fontSize: 'var(--fs-display-md)',
                  color: 'var(--script-pink)',
                }}
              >
                {copy.calendar.passed} ♥
              </p>
            ) : (
              <div className="flex items-start justify-center gap-2 sm:gap-3">
                <CountdownUnit value={days} label={labels[0]} reduced={reduced} />
                <CountdownUnit value={hours} label={labels[1]} reduced={reduced} />
                <CountdownUnit value={minutes} label={labels[2]} reduced={reduced} />
                <CountdownUnit value={seconds} label={labels[3]} reduced={reduced} />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
