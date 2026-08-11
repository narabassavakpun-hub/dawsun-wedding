import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { asset, photos } from '../config/site';
import { EASE } from '../lib/motion';

type Props = {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  reduced: boolean;
};

const SWIPE_THRESHOLD = 60;

export function Lightbox({ index, onClose, onNavigate, reduced }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const open = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + photos.length) % photos.length);
    },
    [index, onNavigate],
  );

  // คีย์บอร์ด: Esc ปิด, ลูกศรเปลี่ยนรูป, Tab วนอยู่ใน dialog (focus trap)
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        go(1);
      } else if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === 'Tab') {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, go, onClose]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center"
          style={{ background: 'rgba(46,40,52,.88)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
        >
          <div ref={panelRef} className="contents">
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="ปิด"
              className="absolute right-4 grid size-11 place-items-center rounded-full"
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
                background: 'rgba(255,255,255,.16)',
                color: '#fff',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <motion.img
              key={photo.src}
              src={asset(`images/${photo.src}`)}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="max-h-[78svh] w-auto max-w-[92vw] rounded-[var(--radius-md)] object-contain"
              onClick={(e) => e.stopPropagation()}
              drag={reduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -SWIPE_THRESHOLD) go(1);
                else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
              }}
              initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
            />

            <div
              className="absolute inset-x-0 flex items-center justify-center gap-6"
              style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="รูปก่อนหน้า"
                className="grid size-11 place-items-center rounded-full"
                style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <span style={{ color: 'rgba(255,255,255,.85)', fontVariantNumeric: 'tabular-nums' }}>
                {(index ?? 0) + 1} / {photos.length}
              </span>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label="รูปถัดไป"
                className="grid size-11 place-items-center rounded-full"
                style={{ background: 'rgba(255,255,255,.16)', color: '#fff' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
