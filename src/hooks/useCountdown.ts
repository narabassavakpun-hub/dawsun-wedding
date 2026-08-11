import { useEffect, useState } from 'react';

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
};

const EMPTY: Countdown = { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };

function diff(targetMs: number): Countdown {
  const delta = targetMs - Date.now();
  if (delta <= 0) return EMPTY;

  const totalSeconds = Math.floor(delta / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    passed: false,
  };
}

/**
 * นับถอยหลังถึงเวลาเป้าหมาย
 *
 * @param targetIso ISO string ที่ **ต้องมี timezone offset** เช่น '2026-10-18T07:39:00+07:00'
 *   ห้ามส่ง '2026-10-18T07:39:00' เฉยๆ เพราะจะถูกตีความเป็นเวลาท้องถิ่นของผู้ใช้
 *   ทำให้แขกที่อยู่ต่างประเทศเห็นตัวเลขเพี้ยน (CLAUDE.md)
 */
export function useCountdown(targetIso: string): Countdown {
  const targetMs = Date.parse(targetIso);
  const [value, setValue] = useState<Countdown>(() => diff(targetMs));

  useEffect(() => {
    if (Number.isNaN(targetMs)) return;

    // ตั้ง tick ให้ตรงขอบวินาที เพื่อไม่ให้ตัวเลขกระตุกหรือข้าม
    let timer: number;
    const tick = () => {
      setValue(diff(targetMs));
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));

    // กลับมาที่แท็บแล้วอัปเดตทันที ไม่ต้องรอ tick ถัดไป
    const onVisible = () => {
      if (!document.hidden) setValue(diff(targetMs));
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [targetMs]);

  return value;
}
