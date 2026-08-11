import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { asset, assets, copy } from '../config/site';
import { Heart } from './Ornaments';

/** ค่อยๆ ดังขึ้นตอนเปิดซองครั้งแรก */
const FADE_MS = 2000;
/** ตอนกลับเข้าเว็บ ต้องได้ยินเพลงเกือบทันที ไม่ต้องค่อยๆ ดังนาน */
const RESUME_FADE_MS = 500;
const TARGET_VOLUME = 0.55;

/**
 * Mini music player — prd.md ข้อ 5.1
 *
 * ⚠️ ห้ามเรียก play() ใน useEffect ตอน mount
 * เบราว์เซอร์บล็อก autoplay ที่มีเสียง ต้องเริ่มจาก user gesture เท่านั้น
 * ที่นี่ใช้ `shouldPlay` ที่เปลี่ยนเป็น true ตอนผู้ใช้ "แตะซอง" (ตอนที่ 1)
 * ซึ่ง React ยังอยู่ใน call stack ของ event handler นั้น — เบราว์เซอร์จึงอนุญาต
 */
export function MusicPlayer({ shouldPlay, reduced }: { shouldPlay: boolean; reduced: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<number>(0);
  /**
   * เจตนาของผู้ใช้ ("อยากให้เพลงเล่นอยู่") — แยกจาก state `playing` ที่สะท้อนของจริง
   * ต้องแยกกัน เพราะระบบอาจหยุดเพลงเองโดยที่ผู้ใช้ไม่ได้สั่ง (สลับแอป สายเข้า)
   * ถ้าเอามาปนกันจะทำให้พอกลับเข้าเว็บแล้วเพลงหายไปเลยแทนที่จะเล่นต่อ
   */
  const wantPlayRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [visible, setVisible] = useState(false);

  const fadeTo = (target: number, done?: () => void, durationMs = FADE_MS) => {
    const audio = audioRef.current;
    if (!audio) return;
    window.clearInterval(fadeRef.current);

    const step = 50;
    const delta = (target - audio.volume) / (durationMs / step);
    fadeRef.current = window.setInterval(() => {
      const next = audio.volume + delta;
      if ((delta > 0 && next >= target) || (delta < 0 && next <= target)) {
        audio.volume = Math.min(1, Math.max(0, target));
        window.clearInterval(fadeRef.current);
        done?.();
      } else {
        audio.volume = Math.min(1, Math.max(0, next));
      }
    }, step);
  };

  // เริ่มเล่นครั้งแรกตอนซองเปิด
  useEffect(() => {
    if (!shouldPlay) return;
    setVisible(true);

    const audio = audioRef.current;
    if (!audio) return;

    wantPlayRef.current = true; // ผู้ใช้แตะซอง = ตั้งใจให้เพลงเล่น
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        setBlocked(false);
        fadeTo(TARGET_VOLUME);
      })
      .catch(() => {
        // เบราว์เซอร์ยังบล็อก (บาง in-app browser เข้มกว่าปกติ) — เชิญให้กดปุ่มเอง
        // ไม่ล้าง wantPlayRef เพื่อให้ยังพยายามเล่นต่อได้เมื่อมีโอกาส
        setBlocked(true);
      });
  }, [shouldPlay]);

  /**
   * หยุดเพลงเมื่อออกจากหน้า/พักจอ แล้วเล่นต่อเมื่อกลับเข้ามา
   *
   * ต้องหยุดเอง เพราะ Chrome บน Android ปล่อยให้เสียงเล่นต่อเบื้องหลังแม้ปิดจอ
   *
   * ⚠️ ห้ามล้าง `wantPlayRef` ตอนหยุด — เก็บเจตนาผู้ใช้ไว้เสมอ
   * ตอนกลับมาถึงจะรู้ว่าควรเล่นต่อ
   *
   * ⚠️ **iOS และ Chrome ปฏิเสธ `play()` ที่ไม่ได้มาจากการแตะของผู้ใช้**
   * การเรียก play() ตอน visibilitychange จึงล้มเหลวบ่อยมาก เพลงเลยไม่กลับมา
   * ทางแก้: ถ้าเรียกแล้วไม่ผ่าน ให้ **ดักการแตะจอครั้งถัดไป** แล้วค่อยเล่น
   * ผู้ใช้กลับมาก็ต้องแตะหรือเลื่อนจออยู่แล้ว เพลงจึงกลับมาเหมือนอัตโนมัติ
   */
  useEffect(() => {
    const GESTURES = ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'] as const;

    const disarm = () => {
      GESTURES.forEach((e) => window.removeEventListener(e, onGesture));
    };

    const start = () => {
      const audio = audioRef.current;
      if (!audio || document.hidden) return false;
      if (!wantPlayRef.current || !audio.paused) return false;

      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setBlocked(false);
          disarm();
          fadeTo(TARGET_VOLUME, undefined, RESUME_FADE_MS);
        })
        .catch(() => setBlocked(true));
      return true;
    };

    function onGesture() {
      const audio = audioRef.current;
      // เพลงกลับมาเล่นแล้ว หรือผู้ใช้สั่งหยุดเอง — เลิกดัก
      if (!wantPlayRef.current || (audio && !audio.paused)) {
        disarm();
        return;
      }
      start();
    }

    const arm = () => {
      disarm(); // กันผูกซ้ำ
      GESTURES.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    };

    const pauseForBackground = () => {
      const audio = audioRef.current;
      if (!audio || audio.paused) return;
      // ต้องหยุด fade ที่ค้างอยู่ด้วย ไม่งั้น interval จะไล่ volume ต่อจนเสียงเพี้ยนตอนกลับมา
      window.clearInterval(fadeRef.current);
      audio.pause();
    };

    const resumeIfWanted = () => {
      start();
      // ผูกตัวดักไว้เสมอ เพราะ play() ด้านบนเป็น async
      // กว่าจะรู้ว่าถูกปฏิเสธก็สายไปแล้ว ถ้าสำเร็จ start() จะ disarm ให้เอง
      if (wantPlayRef.current) arm();
    };

    const onVisibility = () => (document.hidden ? pauseForBackground() : resumeIfWanted());

    document.addEventListener('visibilitychange', onVisibility);
    // ครอบกรณีที่ iOS ไม่ยิง visibilitychange (bfcache / กลับจากแอปอื่นบางจังหวะ)
    window.addEventListener('pagehide', pauseForBackground);
    window.addEventListener('pageshow', resumeIfWanted);
    window.addEventListener('focus', resumeIfWanted);

    return () => {
      disarm();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', pauseForBackground);
      window.removeEventListener('pageshow', resumeIfWanted);
      window.removeEventListener('focus', resumeIfWanted);
    };
  }, []);

  // ผูกสถานะปุ่มกับสถานะจริงของ <audio> ไม่ใช่เดาเอง
  // ถ้าระบบหยุดเพลงเอง (สายเข้า สลับแอป) ปุ่มจะเปลี่ยนตามทันที
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  useEffect(() => () => window.clearInterval(fadeRef.current), []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      wantPlayRef.current = false; // ผู้ใช้สั่งหยุดเอง — อย่าไปเล่นต่อให้ตอนกลับมา
      fadeTo(0, () => audio.pause()); // setPlaying มาจาก event 'pause' ของ audio เอง
    } else {
      wantPlayRef.current = true;
      audio.volume = 0;
      void audio
        .play()
        .then(() => {
          setBlocked(false);
          fadeTo(TARGET_VOLUME);
        })
        .catch(() => setBlocked(true));
    }
  };

  return (
    <>
      <audio ref={audioRef} src={asset(assets.audio)} loop preload="none" playsInline />

      {visible && (
        <motion.button
          type="button"
          onClick={toggle}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            // ปุ่มกระพริบเชิญกดเมื่อเบราว์เซอร์บล็อก autoplay
            ...(blocked && !reduced ? { boxShadow: ['0 0 0 0px rgba(232,96,142,0.5)', '0 0 0 14px rgba(232,96,142,0)'] } : {}),
          }}
          transition={
            blocked && !reduced
              ? { boxShadow: { duration: 1.4, repeat: 3, ease: 'easeOut' }, default: { duration: 0.4 } }
              : { duration: 0.4 }
          }
          aria-label={playing ? copy.music.pause : copy.music.play}
          aria-pressed={playing}
          className="fixed right-4 z-50 grid size-12 place-items-center rounded-full"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
            background: 'color-mix(in srgb, var(--paper) 90%, transparent)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid color-mix(in srgb, var(--theme-pink) 60%, transparent)',
            boxShadow: 'var(--shadow-soft)',
            color: 'var(--script-pink)',
          }}
        >
          {/* วงแหวนหมุนช้าตอนเล่นอยู่ */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-1 rounded-full"
            style={{
              border: '1.5px dashed color-mix(in srgb, var(--theme-pink) 70%, transparent)',
            }}
            animate={playing && !reduced ? { rotate: 360 } : { rotate: 0 }}
            transition={
              playing && !reduced
                ? { duration: 12, repeat: Infinity, ease: 'linear' }
                : { duration: 0.3 }
            }
          />
          <motion.span
            aria-hidden="true"
            animate={playing && !reduced ? { scale: [1, 1.14, 1] } : { scale: 1 }}
            transition={
              playing && !reduced
                ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.3 }
            }
            style={{ display: 'grid', placeItems: 'center' }}
          >
            <Heart size={20} filled={playing} color="var(--script-pink)" strokeWidth={1.8} />
          </motion.span>
        </motion.button>
      )}
    </>
  );
}
