import { useEffect, useState } from 'react';
import { ToastProvider } from './components/Toast';
import { MusicPlayer } from './components/MusicPlayer';
import { PetalCanvas } from './components/PetalCanvas';
import { ScrollProgress } from './components/ScrollProgress';
import { useLenis } from './hooks/useLenis';
import { useMotionPreference } from './hooks/useMotionPreference';

import { Envelope } from './sections/Envelope';
import { Hero } from './sections/Hero';
import { Invitation } from './sections/Invitation';
import { Profiles } from './sections/Profiles';
import { HeartCalendar } from './sections/HeartCalendar';
import { Timeline } from './sections/Timeline';
import { Gallery } from './sections/Gallery';
import { Location } from './sections/Location';
import { DressCode } from './sections/DressCode';
import { Guestbook } from './sections/Guestbook';
import { Gift } from './sections/Gift';
import { ShareSave } from './sections/ShareSave';
import { Footer } from './sections/Footer';

export default function App() {
  const reduced = useMotionPreference();
  const [opened, setOpened] = useState(false);

  useLenis(!reduced && opened);

  // ล็อกการเลื่อนจนกว่าจะเปิดซอง (prd.md ตอน 1)
  useEffect(() => {
    document.body.dataset.locked = opened ? 'false' : 'true';
    return () => {
      delete document.body.dataset.locked;
    };
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    // เลื่อนกลับบนสุดเผื่อเบราว์เซอร์จำตำแหน่งเดิมไว้ตอนรีเฟรช
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <ToastProvider>
      <div className="sky-backdrop" aria-hidden="true" />
      <PetalCanvas enabled={!reduced && opened} />
      <ScrollProgress visible={opened} reduced={reduced} />

      <Envelope onOpen={handleOpen} reduced={reduced} />

      <main className="relative z-[2]">
        <Hero reduced={reduced} started={opened} />
        <Invitation reduced={reduced} />
        <Profiles reduced={reduced} />
        <HeartCalendar reduced={reduced} />
        <Timeline reduced={reduced} />
        <Gallery reduced={reduced} />
        <Location reduced={reduced} />
        <DressCode reduced={reduced} />
        <Guestbook reduced={reduced} />
        <Gift reduced={reduced} />
        <ShareSave reduced={reduced} />
        <Footer reduced={reduced} />
      </main>

      <MusicPlayer shouldPlay={opened} reduced={reduced} />
    </ToastProvider>
  );
}
