import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { asset, assets, copy, couple } from '../config/site';
import { Heart, SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { GiftBox, type BoxState } from '../components/GiftBox';
import { useToast } from '../components/Toast';
import { celebrate } from '../lib/celebrate';
import { saveImage } from '../lib/saveImage';
import { submitSlip } from '../lib/submitSlip';
import { EASE, reveal, staggerParent, VIEWPORT } from '../lib/motion';

/**
 * ขนาดจริงของ public/images/promptpay-qr.png
 * ใช้จองพื้นที่ล่วงหน้ากัน layout ขยับตอนรูปโหลดเสร็จ (CLS)
 * ⚠️ ถ้าเปลี่ยนไฟล์ QR เป็นรูปใหม่ที่สัดส่วนต่างไป ต้องแก้สองค่านี้ให้ตรงด้วย
 */
const QR_SIZE = { width: 588, height: 652 } as const;

/**
 * เวลาห่อของขวัญขั้นต่ำ — ถึงอัปโหลดจะเสร็จเร็วกว่านี้ก็ยังห่อจนครบ
 * ไม่งั้นบนเน็ตเร็ว อนิเมชันผูกโบว์จะกระพริบผ่านไปจนดูไม่ทัน
 */
const MIN_WRAP_MS = 2000;
/** เวลาที่กล่องลอยขึ้นไปจนจางหาย ต้องตรงกับ duration ใน GiftBox */
const FLY_MS = 1400;

type Stage = 'closed' | 'qr' | 'wrapping' | 'flying' | 'sent';

/** ตอนที่ 11 — ร่วมมอบของขวัญ (prd.md ตอน 11) */
export function Gift({ reduced }: { reduced: boolean }) {
  const toast = useToast();
  const [stage, setStage] = useState<Stage>('closed');
  const [qrMissing, setQrMissing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const qrSrc = asset(assets.promptPayQr);

  // ล้าง object URL ของรูปตัวอย่างเมื่อเปลี่ยนไฟล์หรือออกจากหน้า กัน memory leak
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const boxState: BoxState =
    stage === 'closed'
      ? 'closed'
      : stage === 'wrapping'
        ? 'wrapping'
        : stage === 'flying'
          ? 'flying'
          : stage === 'sent'
            ? 'sent'
            : 'open';

  const busy = stage === 'wrapping' || stage === 'flying';

  // กันตั้ง state หลังคอมโพเนนต์ถูกถอด (ผู้ใช้เลื่อนออกไประหว่างรอส่ง)
  const aliveRef = useRef(true);
  const timerRef = useRef<number>(0);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleSaveQr = async () => {
    const result = await saveImage(qrSrc, 'dawsun-wedding-promptpay.png');
    if (!result.ok) toast(copy.gift.saveLongPress);
  };

  const handleSend = async () => {
    if (!file || busy) return;
    setStage('wrapping');
    setError('');

    // ฟอร์มยุบหายไปแล้ว เลื่อนจอมาที่กล่องของขวัญเพื่อให้เห็นอนิเมชันห่อเต็มๆ
    // รอ 1 เฟรมก่อน ให้ layout หลังฟอร์มยุบคำนวณเสร็จ ไม่งั้นจะเลื่อนไปผิดตำแหน่ง
    requestAnimationFrame(() => {
      boxRef.current?.scrollIntoView({
        block: 'center',
        behavior: reduced ? 'auto' : 'smooth',
      });
    });

    // เดินคู่กัน ไม่ใช่ต่อคิวกัน → เวลารวม = max(เวลาอัปโหลด, MIN_WRAP_MS)
    // เน็ตช้า 5 วิ → เห็นโบว์ผูกวนตลอด 5 วิ · เน็ตเร็ว 0.4 วิ → ยังห่อครบ 2 วิ
    const [result] = await Promise.all([
      submitSlip(file, senderName),
      new Promise((resolve) => setTimeout(resolve, reduced ? 0 : MIN_WRAP_MS)),
    ]);

    if (!aliveRef.current) return;

    if (!result.ok) {
      setStage('qr');
      setError(
        result.reason === 'too-large'
          ? copy.gift.slipTooLarge
          : result.reason === 'bad-image'
            ? copy.gift.slipBadImage
            : result.reason === 'rate-limit'
              ? copy.gift.slipTooSoon
              : copy.gift.slipError,
      );
      return;
    }

    const finish = () => {
      if (!aliveRef.current) return;
      setStage('sent');
      const rect = panelRef.current?.getBoundingClientRect();
      celebrate(
        rect
          ? {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight,
            }
          : { x: 0.5, y: 0.5 },
        reduced,
      );
    };

    if (reduced) {
      finish(); // ไม่มีอนิเมชันให้ดู ข้ามขั้นลอยไปเลย
    } else {
      setStage('flying');
      timerRef.current = window.setTimeout(finish, FLY_MS);
    }
  };

  const fieldStyle = {
    background: 'color-mix(in srgb, var(--paper) 96%, transparent)',
    border: '1px solid color-mix(in srgb, var(--theme-pink) 55%, transparent)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.7rem 1rem',
    width: '100%',
    fontSize: 'var(--fs-body)',
  } as const;

  return (
    <section className="section" aria-label="ร่วมมอบของขวัญ">

      <FlowerAccent corner="top-right" reduced={reduced} variant={0} width={24} opacity={0.26} color="var(--theme-pink)" />
      <div className="container">
        <SectionHeading eyebrow={copy.gift.eyebrow} heading={copy.gift.heading} reduced={reduced} />

        <motion.div
          className="mt-8 text-center"
          variants={staggerParent(reduced, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.p
            variants={reveal(reduced)}
            style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-muted)', lineHeight: 1.9 }}
          >
            {copy.gift.body}
          </motion.p>

          <motion.div variants={reveal(reduced)} className="mt-6" ref={panelRef}>
            {/* ---------- กล่องของขวัญ ---------- */}
            {stage !== 'sent' && (
              // overflow-x: clip กันหน้าเลื่อนแนวนอน แต่ยังปล่อยให้กล่องลอยพ้นกรอบด้านบนได้
              // (ใช้ hidden ไม่ได้ เพราะจะบังคับอีกแกนเป็น auto แล้วตัดกล่องตอนลอยขึ้นด้วย
              //  ส่วน visible + clip เป็นคู่ที่ CSS อนุญาต)
              <div
                ref={boxRef}
                className="flex justify-center"
                style={{ overflowX: 'clip', overflowY: 'visible' }}
              >
                <motion.button
                  type="button"
                  onClick={() => stage === 'closed' && setStage('qr')}
                  disabled={stage !== 'closed'}
                  aria-expanded={stage !== 'closed'}
                  aria-label={copy.gift.open}
                  className="rounded-[var(--radius-lg)]"
                  style={{ cursor: stage === 'closed' ? 'pointer' : 'default', background: 'none' }}
                  // ปิดอยู่ = ขยับเบาๆ เชิญชวนให้กด
                  // กำลังห่อ = ขยายขึ้นเล็กน้อย ดึงสายตามาที่กล่องหลังฟอร์มยุบหายไป
                  animate={
                    stage === 'closed' && !reduced
                      ? { y: [0, -6, 0], rotate: [0, -1.5, 1.5, 0], scale: 1 }
                      : { y: 0, rotate: 0, scale: stage === 'wrapping' && !reduced ? 1.08 : 1 }
                  }
                  transition={
                    stage === 'closed' && !reduced
                      ? { duration: 3, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }
                      : { duration: 0.3 }
                  }
                  whileTap={stage === 'closed' ? { scale: 0.96 } : undefined}
                >
                  <GiftBox state={boxState} reduced={reduced} size={210} />
                </motion.button>
              </div>
            )}

            {stage === 'closed' && (
              <motion.p
                className="mt-2 flex items-center justify-center gap-2"
                animate={reduced ? {} : { opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontFamily: 'var(--font-th-display)',
                  fontSize: 'var(--fs-body-lg)',
                  color: 'var(--seal-magenta)',
                }}
              >
                <Heart size={16} filled color="var(--seal-magenta)" />
                {copy.gift.open}
              </motion.p>
            )}

            {/* ---------- สถานะระหว่างห่อและส่ง ----------
                aria-live ให้ screen reader อ่านความคืบหน้าตามไปด้วย */}
            <div role="status" aria-live="polite">
              <AnimatePresence mode="wait">
                {busy && (
                  <motion.p
                    key={stage}
                    className="mt-3 flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduced ? 0 : -8 }}
                    transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                    style={{
                      fontFamily: 'var(--font-th-display)',
                      fontSize: 'var(--fs-body-lg)',
                      color: 'var(--seal-magenta)',
                    }}
                  >
                    <motion.span
                      animate={reduced ? {} : { scale: [1, 1.25, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      style={{ display: 'grid', placeItems: 'center' }}
                    >
                      <Heart size={16} filled color="var(--seal-magenta)" />
                    </motion.span>
                    {stage === 'wrapping' ? copy.gift.slipSending : copy.gift.slipDelivering}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* ---------- QR + แนบสลิป ----------
                พอกดส่ง ฟอร์มยุบหายทันที (stage ไม่ใช่ 'qr' แล้ว)
                เพื่อให้สายตาไปอยู่ที่กล่องของขวัญที่กำลังห่ออยู่ */}
            <AnimatePresence initial={false}>
              {stage === 'qr' && (
                <motion.div
                  key="qr-panel"
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
                >
                  <motion.div
                    initial={{ y: reduced ? 0 : 24, scale: reduced ? 1 : 0.94 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay: reduced ? 0 : 0.35 }}
                    className="paper mx-auto mt-4 max-w-[23rem] px-5 py-6"
                  >
                    <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}>
                      {copy.gift.qrHint}
                    </p>

                    <div className="mt-3 flex justify-center">
                      <div
                        className="grid place-items-center rounded-[var(--radius-md)] p-4"
                        style={{
                          // QR ต้องมีขอบขาวรอบ (quiet zone) ไม่งั้นสแกนไม่ติด
                          background: '#fff',
                          boxShadow: 'var(--shadow-soft)',
                          border: '1px solid color-mix(in srgb, var(--theme-pink) 45%, transparent)',
                        }}
                      >
                        {qrMissing ? (
                          <div className="flex flex-col items-center gap-3 px-6 py-12">
                            <svg width="48" height="48" viewBox="0 0 24 24" aria-hidden="true">
                              <g fill="none" stroke="var(--ink-muted)" strokeWidth="1.5" strokeLinejoin="round">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <path d="M14 14h3v3h-3zM19 14h2M14 19h3M19 19h2" strokeLinecap="round" />
                              </g>
                            </svg>
                            <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}>
                              {copy.gift.pending}
                            </p>
                          </div>
                        ) : (
                          <img
                            src={qrSrc}
                            alt="QR PromptPay สำหรับมอบของขวัญแก่บ่าวสาว"
                            {...QR_SIZE}
                            loading="lazy"
                            decoding="async"
                            onError={() => setQrMissing(true)}
                            className="h-auto w-[min(250px,62vw)]"
                          />
                        )}
                      </div>
                    </div>

                    {!qrMissing && (
                      <>
                        <button type="button" onClick={handleSaveQr} className="btn btn-soft mt-4">
                          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {copy.gift.save}
                        </button>
                        {/* ทางออกสำรองที่ผู้ใช้ทำเองได้เสมอ ไม่ว่าเบราว์เซอร์จะรองรับอะไร */}
                        <p
                          className="mt-2"
                          style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}
                        >
                          {copy.gift.saveHint}
                        </p>
                      </>
                    )}

                    <hr
                      className="my-6"
                      style={{
                        border: 0,
                        height: 1,
                        background: 'color-mix(in srgb, var(--theme-pink) 45%, transparent)',
                      }}
                    />

                    {/* ---- แนบสลิป ---- */}
                    <div className="text-left">
                      <label
                        htmlFor="gift-sender"
                        className="mb-1.5 block"
                        style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink)' }}
                      >
                        {copy.gift.slipNameLabel}
                      </label>
                      <input
                        id="gift-sender"
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder={copy.gift.slipNamePlaceholder}
                        maxLength={120}
                        autoComplete="name"
                        style={fieldStyle}
                      />
                    </div>

                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/*"
                      className="visually-hidden"
                      onChange={(e) => {
                        setError('');
                        setFile(e.target.files?.[0] ?? null);
                      }}
                    />

                    {preview && (
                      <div className="mt-4 flex justify-center">
                        <img
                          src={preview}
                          alt="ตัวอย่างสลิปที่เลือกไว้"
                          className="max-h-40 w-auto rounded-[var(--radius-sm)]"
                          style={{ border: '1px solid color-mix(in srgb, var(--theme-pink) 50%, transparent)' }}
                        />
                      </div>
                    )}

                    <div className="mt-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => fileInput.current?.click()}
                        className="btn btn-soft w-full"
                        disabled={busy}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 20h16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {file ? copy.gift.slipChange : copy.gift.slipPick}
                      </button>

                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!file || busy}
                        className="btn btn-primary w-full"
                      >
                        {busy ? (
                          copy.gift.slipSending
                        ) : (
                          <>
                            {copy.gift.slipSend}
                            <Heart size={16} filled color="#fff" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStage('closed')}
                        disabled={busy}
                        style={{
                          background: 'none',
                          border: 0,
                          fontSize: 'var(--fs-caption)',
                          color: 'var(--ink-muted)',
                          padding: '0.5rem',
                        }}
                      >
                        {copy.gift.slipSkip}
                      </button>
                    </div>

                    {error && (
                      <p
                        role="alert"
                        className="mt-3"
                        style={{ fontSize: 'var(--fs-caption)', color: 'var(--seal-magenta)' }}
                      >
                        {error}
                      </p>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ---------- ส่งสำเร็จ ---------- */}
            <AnimatePresence>
              {stage === 'sent' && (
                <motion.div
                  key="sent"
                  className="paper mx-auto max-w-[23rem] px-6 py-9"
                  initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE }}
                >
                  <motion.div
                    className="flex justify-center"
                    animate={reduced ? {} : { scale: [1, 1.16, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Heart size={44} filled color="var(--script-pink)" />
                  </motion.div>

                  <p
                    className="mt-4"
                    style={{
                      fontFamily: 'var(--font-th-display)',
                      fontSize: 'var(--fs-display-md)',
                      color: 'var(--ink)',
                      lineHeight: 1.6,
                    }}
                  >
                    {copy.gift.sentHeading}
                  </p>

                  <p
                    className="mt-3 whitespace-pre-line"
                    style={{ fontSize: 'var(--fs-body)', color: 'var(--ink-muted)', lineHeight: 1.95 }}
                  >
                    {copy.gift.sentBody}
                  </p>

                  <p
                    className="mt-5"
                    style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}
                  >
                    {copy.gift.sentSign}
                  </p>
                  <p
                    className="script mt-1"
                    style={{ fontSize: 'clamp(1.6rem, 7vw, 2.2rem)' }}
                  >
                    {couple.bride.nicknameTh} &amp; {couple.groom.nicknameTh}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.p
            variants={reveal(reduced)}
            className="mt-8"
            style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}
          >
            {copy.gift.note}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
