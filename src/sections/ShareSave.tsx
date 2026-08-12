import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { asset, copy } from '../config/site';
import { SectionHeading } from '../components/Ornaments';
import { useToast } from '../components/Toast';
import { copyText } from '../lib/clipboard';
import { googleCalendarUrl } from '../lib/ics';
import { canShareLink, shareLink } from '../lib/share';
import { reveal, staggerParent, VIEWPORT } from '../lib/motion';

/** ลูกศรแชร์มาตรฐาน — สื่อว่าเลือกปลายทางได้เอง ไม่ผูกกับแอปใดแอปหนึ่ง */
function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v13M12 3L8 7M12 3l4 4" />
        <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </g>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M3 10h18M8 3v4M16 3v4M12 14v4M10 16h4" />
      </g>
    </svg>
  );
}

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

  // เช็กหลัง mount ไม่ใช่ตอน render เพื่อให้ผลตรงกันทุกครั้งที่วาดครั้งแรก
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(canShareLink()), []);

  const handleShare = async () => {
    const result = await shareLink({
      title: copy.share.shareTitle,
      text: copy.share.shareText,
      url: pageUrl,
    });
    // 'shared' รวมกรณีผู้ใช้กดยกเลิกด้วย — ต้องเงียบ ห้ามเด้งข้อความว่าล้มเหลว
    if (result === 'failed') await handleCopyLink();
  };

  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`;

  /**
   * ใช้แค่จัดลำดับปุ่มปฏิทินให้ตรงกับเครื่องผู้ใช้ ไม่ได้ตัดฟีเจอร์ทิ้ง
   * ถ้าเดาผิดก็ยังเห็นทั้งสองปุ่มอยู่ดี จึงไม่เสียหาย
   *
   * (เว็บไม่มี API เพิ่มกิจกรรมลงปฏิทินเครื่องโดยตรง — บน Android ต้องผ่าน
   *  Google ปฏิทิน ซึ่งซิงก์เข้าแอปปฏิทินของเครื่องให้เองอยู่แล้ว)
   */
  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      // iPadOS รายงานตัวเป็น Mac ต้องดูว่ามีจอสัมผัสด้วย
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const calendarButtons = [
    <motion.a
      key="google"
      variants={reveal(reduced)}
      href={googleCalendarUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-soft"
    >
      <CalendarIcon />
      {copy.share.calendarGoogle}
    </motion.a>,
    <motion.a
      key="ics"
      variants={reveal(reduced)}
      href={asset('dawsun-wedding.ics')}
      className="btn btn-soft"
    >
      <CalendarIcon />
      {copy.share.calendarApple}
    </motion.a>,
  ];

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
          {/* รองรับ Web Share = เปิด share sheet ของระบบ เลือกแอปแล้วเด้งเข้าแอปนั้นเลย
              ไม่รองรับ (Firefox เดสก์ท็อป ฯลฯ) = คงปุ่ม LINE แบบเดิมไว้
              จะได้ไม่กลายเป็นปุ่มตายที่กดแล้วไม่มีอะไรเกิดขึ้น */}
          {canShare ? (
            <motion.button
              variants={reveal(reduced)}
              type="button"
              onClick={handleShare}
              className="btn btn-primary"
            >
              <ShareIcon />
              {copy.share.shareCard}
            </motion.button>
          ) : (
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
          )}

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

          {/* ปฏิทินแยก 2 ปุ่ม เรียงให้ตัวที่ตรงกับเครื่องขึ้นก่อน
              · Google = หน้าเว็บธรรมดา เปิดได้ทุกเบราว์เซอร์รวม in-app ของ LINE
                บน Android ถือเป็นทางเดียวที่เชื่อถือได้ เพราะไฟล์ .ics จะถูกดาวน์โหลด
                แล้วผู้ใช้ต้องไปเปิดเองอีก 3 ขั้น (และมักล้มเหลวใน LINE)
              · .ics = ไฟล์จริงบนเซิร์ฟเวอร์ iOS เปิดหน้าตัวอย่างปฏิทินให้กดเพิ่มได้เลย */}
          {isIOS ? [calendarButtons[1], calendarButtons[0]] : calendarButtons}
        </motion.div>

        <motion.p
          className="mt-4 text-center"
          style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)', lineHeight: 1.8 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: reduced ? 0.2 : 0.6, delay: 0.2 }}
        >
          {copy.share.calendarHint}
        </motion.p>
      </div>
    </section>
  );
}
