import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { asset, copy, galleryPhotos } from '../config/site';
import { SectionHeading } from '../components/Ornaments';
import { FlowerAccent } from '../components/FlowerAccent';
import { Lightbox } from '../components/Lightbox';
import { EASE, VIEWPORT } from '../lib/motion';

/** ตอนที่ 7 — แกลเลอรี Our Moments (prd.md ตอน 7) */
export function Gallery({ reduced }: { reduced: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const close = () => {
    setOpenIndex(null);
    // คืน focus กลับที่รูปที่กด — prd.md ตอน 7
    lastTrigger.current?.focus();
  };

  return (
    <section className="section" aria-label="ภาพความทรงจำ">

      <FlowerAccent corner="top-right" reduced={reduced} variant={2} width={24} opacity={0.26} color="var(--theme-pink)" />
      <div className="container">
        <SectionHeading
          eyebrow={copy.gallery.eyebrow}
          heading={copy.gallery.heading}
          reduced={reduced}
        />

        <p
          className="mt-4 text-center"
          style={{ fontSize: 'var(--fs-caption)', color: 'var(--ink-muted)' }}
        >
          {copy.gallery.hint}
        </p>

        {/* 2 คอลัมน์เสมอ — เนื้อหากว้างสุด 42rem แบ่ง 3 แล้วรูปเล็กเกินไป
            การจัดวางแต่ละใบกำหนดไว้ที่ src/config/site.ts → layoutOverrides
            (วางให้แถวเต็มพอดี จะได้ไม่มีช่องว่างค้างข้างๆ) */}
        <div className="mt-7 grid grid-cols-2 gap-3">
          {galleryPhotos.map((photo, i) => {
            const wide = photo.layout !== 'tile';
            const aspect =
              photo.layout === 'full'
                ? `${photo.width} / ${photo.height}` // สัดส่วนจริง → object-cover ไม่ตัดอะไรเลย
                : photo.layout === 'banner'
                  ? '3 / 2'
                  : '4 / 5';
            // รูปแนวตั้งที่ไม่ครอป ถ้าปล่อยเต็มความกว้างจะสูงเกินไปบนจอใหญ่
            // (กว้าง 672px → สูงกว่า 1000px) จึงจำกัดความกว้างแล้วจัดกึ่งกลาง
            const capPortrait = photo.layout === 'full' && photo.orientation === 'portrait';
            return (
              <motion.button
                key={photo.src}
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpenIndex(i);
                }}
                aria-label={`ดูรูปขนาดเต็ม: ${photo.alt}`}
                className={`block w-full overflow-hidden rounded-[var(--radius-md)] ${wide ? 'col-span-2' : ''} ${capPortrait ? 'mx-auto' : ''}`}
                style={{
                  aspectRatio: aspect,
                  maxWidth: capPortrait ? 'min(100%, 22rem)' : undefined,
                  boxShadow: 'var(--shadow-soft)',
                  border: '1px solid rgba(255,255,255,.6)',
                  // blur placeholder กันภาพกระพริบขาวระหว่างโหลด
                  backgroundImage: `url(${photo.blur})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                initial={{ opacity: 0, y: reduced ? 0 : 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: reduced ? 0.3 : 0.6, ease: EASE, delay: (i % 4) * 0.06 }}
              >
                <img
                  src={asset(`images/${photo.src}`)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                  // รูปสตูดิโอวางหน้าคนไว้ค่อนบน จึงเลื่อนจุดครอปขึ้นไม่ให้ตัดหัว
                  // ('full' สัดส่วนตรงกรอบอยู่แล้ว ค่านี้ไม่มีผล)
                  style={{ objectPosition: photo.layout === 'banner' ? '50% 30%' : '50% 22%' }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      <Lightbox index={openIndex} onClose={close} onNavigate={setOpenIndex} reduced={reduced} />
    </section>
  );
}
