import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { copy } from '../config/site';
import { Heart, SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { celebrate } from '../lib/celebrate';
import { submitWish } from '../lib/submitWish';
import { EASE, reveal, staggerParent, VIEWPORT } from '../lib/motion';

type Status = 'idle' | 'sending' | 'success' | 'error';

function PenHeart() {
  const s = {
    fill: 'none',
    stroke: 'var(--script-pink)',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" aria-hidden="true" className="mx-auto">
      <path
        {...s}
        d="M12 34c0-8 6-14 12-14 5 0 8 3 9 6 1-3 4-6 9-6 6 0 12 6 12 14 0 0-9 12-21 16C21 46 12 34 12 34Z"
        strokeDasharray="3 4"
      />
      <path {...s} d="M46 30l14-16" strokeWidth="3" stroke="var(--dusty-blue)" />
      <path {...s} d="M58 12l6-7 4 4-6 7z" fill="var(--theme-cream)" stroke="var(--dusty-blue)" />
    </svg>
  );
}

/** ตอนที่ 10 — สมุดเขียนคำอวยพร (prd.md ตอน 10) */
export function Guestbook({ reduced }: { reduced: boolean }) {
  const nameId = useId();
  const messageId = useId();
  const errorId = useId();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const max = copy.guestbook.maxLength;
  const canSubmit = name.trim().length > 0 && message.trim().length > 0 && status !== 'sending';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('sending');
    setErrorText('');

    const result = await submitWish({ name, message, website });

    if (result.ok) {
      setStatus('success');
      // ยิงคอนเฟตติจากตำแหน่งปุ่มส่ง
      const rect = buttonRef.current?.getBoundingClientRect();
      const origin = rect
        ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
        : { x: 0.5, y: 0.7 };
      celebrate(origin, reduced);
    } else {
      setStatus('error');
      setErrorText(
        result.reason === 'rate-limit' ? copy.guestbook.tooSoon : copy.guestbook.error,
      );
    }
  };

  const fieldStyle = {
    background: 'color-mix(in srgb, var(--paper) 96%, transparent)',
    border: '1px solid color-mix(in srgb, var(--theme-pink) 55%, transparent)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.75rem 1rem',
    width: '100%',
    fontSize: 'var(--fs-body)',
    lineHeight: 1.8,
  } as const;

  return (
    <section className="section" aria-label="เขียนคำอวยพร">

      <FlowerAccent corner="bottom-right" reduced={reduced} variant={2} width={26} opacity={0.26} color="var(--theme-lavender)" />
      <div className="container">
        <SectionHeading
          eyebrow={copy.guestbook.eyebrow}
          heading={copy.guestbook.heading}
          reduced={reduced}
        />

        <motion.div
          className="paper mt-8 px-6 py-8 sm:px-9"
          variants={staggerParent(reduced, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.div variants={reveal(reduced)}>
            <PenHeart />
          </motion.div>

          <motion.p
            variants={reveal(reduced)}
            className="mt-3 whitespace-pre-line text-center"
            style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-muted)', lineHeight: 1.9 }}
          >
            {copy.guestbook.body}
          </motion.p>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                className="mt-8 flex flex-col items-center gap-3 text-center"
                initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <motion.span
                  animate={reduced ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Heart size={40} filled color="var(--script-pink)" />
                </motion.span>
                <p
                  style={{
                    fontFamily: 'var(--font-th-display)',
                    fontSize: 'var(--fs-display-md)',
                    color: 'var(--ink)',
                  }}
                >
                  {copy.guestbook.success}
                </p>
                <p style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-muted)' }}>
                  {copy.guestbook.successBody}
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="mt-7 flex flex-col gap-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                transition={{ duration: 0.3 }}
                noValidate
              >
                {/* honeypot — ห้าม display:none (บอทตรวจจับได้) */}
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor={nameId}
                    className="mb-1.5 block"
                    style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink)' }}
                  >
                    {copy.guestbook.nameLabel}
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={copy.guestbook.namePlaceholder}
                    maxLength={120}
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <label
                      htmlFor={messageId}
                      style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink)' }}
                    >
                      {copy.guestbook.messageLabel}
                    </label>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: message.length > max * 0.9 ? 'var(--seal-magenta)' : 'var(--ink-muted)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {message.length} / {max}
                    </span>
                  </div>
                  <textarea
                    id={messageId}
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, max))}
                    placeholder={copy.guestbook.messagePlaceholder}
                    maxLength={max}
                    rows={4}
                    required
                    enterKeyHint="done"
                    style={{ ...fieldStyle, resize: 'vertical', minHeight: '7rem' }}
                  />
                </div>

                {status === 'error' && (
                  <p
                    id={errorId}
                    role="alert"
                    className="text-center"
                    style={{ fontSize: 'var(--fs-caption)', color: 'var(--seal-magenta)' }}
                  >
                    {errorText}
                  </p>
                )}

                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={!canSubmit}
                  className="btn btn-primary mt-1 w-full"
                  aria-describedby={status === 'error' ? errorId : undefined}
                >
                  {status === 'sending' ? (
                    copy.guestbook.sending
                  ) : (
                    <>
                      {status === 'error' ? copy.guestbook.retry : copy.guestbook.submit}
                      <Heart size={16} filled color="#fff" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
