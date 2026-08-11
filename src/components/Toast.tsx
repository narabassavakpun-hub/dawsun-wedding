import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DURATION, EASE } from '../lib/motion';

const ToastContext = createContext<(msg: string) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number>(0);

  const show = useCallback((msg: string) => {
    window.clearTimeout(timer.current);
    setMessage(msg);
    timer.current = window.setTimeout(() => setMessage(null), 2200);
  }, []);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* aria-live ให้ screen reader อ่านข้อความยืนยันด้วย */}
      <div
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5.5rem)' }}
        role="status"
        aria-live="polite"
      >
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: DURATION.fast, ease: EASE }}
              className="rounded-full px-5 py-2.5 text-sm"
              style={{
                background: 'var(--ink)',
                color: 'var(--paper)',
                boxShadow: 'var(--shadow-lift)',
              }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
