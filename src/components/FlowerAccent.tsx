import { motion } from 'motion/react';
import { EASE, VIEWPORT } from '../lib/motion';
import { Blossom, Bud, Leaf, Rose, Star } from './botanicals';

export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type Props = {
  corner: Corner;
  reduced: boolean;
  /** ความกว้างเป็น % ของ container (ค่าเริ่มต้นพอดีสำหรับมุมหน้าจอมือถือ) */
  width?: number;
  opacity?: number;
  color?: string;
  /** สลับช่อให้แต่ละมุมไม่ซ้ำกัน (0-2) */
  variant?: 0 | 1 | 2;
};

/** ช่อดอกไม้ 3 แบบ วาดในกรอบ 200×200 โดยยึดมุมซ้ายบนเป็นจุดตั้งต้น */
function Spray({ variant, color }: { variant: 0 | 1 | 2; color: string }) {
  const stem = (d: string, w = 1.6) => (
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
  );

  if (variant === 0) {
    return (
      <>
        {stem('M6 6 C 40 22 62 48 78 84 M30 18 C 40 40 44 58 42 78 M14 34 C 34 46 52 62 66 82')}
        <Petal delay={0.05}>
          <Rose x={86} y={96} r={1.5} stroke={color} />
        </Petal>
        <Petal delay={0.14}>
          <Blossom x={44} y={86} r={1.5} stroke={color} />
        </Petal>
        <Petal delay={0.22}>
          <Blossom x={22} y={44} r={1.15} stroke={color} />
        </Petal>
        <Petal delay={0.3}>
          <Bud x={62} y={44} rotate={34} r={1.3} stroke={color} />
        </Petal>
        <Petal delay={0.36}>
          <Leaf x={36} y={62} rotate={36} r={1.35} stroke={color} />
        </Petal>
        <Petal delay={0.42}>
          <Leaf x={16} y={22} rotate={104} r={1.15} stroke={color} />
        </Petal>
        <Petal delay={0.5}>
          <Star x={104} y={54} r={0.9} fill={color} />
        </Petal>
      </>
    );
  }

  if (variant === 1) {
    return (
      <>
        {stem('M4 10 C 34 30 52 58 60 96 M22 26 C 44 34 62 44 78 60 M8 46 C 26 60 38 76 46 94')}
        <Petal delay={0.05}>
          <Blossom x={66} y={104} r={1.6} stroke={color} />
        </Petal>
        <Petal delay={0.14}>
          <Blossom x={86} y={64} r={1.2} stroke={color} />
        </Petal>
        <Petal delay={0.22}>
          <Rose x={30} y={72} r={1.2} stroke={color} />
        </Petal>
        <Petal delay={0.3}>
          <Bud x={16} y={34} rotate={-22} r={1.2} stroke={color} />
        </Petal>
        <Petal delay={0.38}>
          <Leaf x={48} y={44} rotate={22} r={1.25} stroke={color} />
        </Petal>
        <Petal delay={0.46}>
          <Star x={98} y={30} r={0.8} fill={color} />
        </Petal>
      </>
    );
  }

  return (
    <>
      {stem('M8 4 C 26 34 34 66 32 100 M14 24 C 40 34 62 44 84 44 M20 54 C 44 62 62 74 76 90')}
      <Petal delay={0.05}>
        <Blossom x={30} y={110} r={1.45} stroke={color} />
      </Petal>
      <Petal delay={0.13}>
        <Rose x={92} y={44} r={1.25} stroke={color} />
      </Petal>
      <Petal delay={0.21}>
        <Blossom x={82} y={96} r={1.1} stroke={color} />
      </Petal>
      <Petal delay={0.29}>
        <Bud x={52} y={26} rotate={48} r={1.15} stroke={color} />
      </Petal>
      <Petal delay={0.37}>
        <Leaf x={34} y={72} rotate={12} r={1.3} stroke={color} />
      </Petal>
      <Petal delay={0.45}>
        <Star x={70} y={16} r={0.85} fill={color} />
      </Petal>
    </>
  );
}

/** ดอกไม้แต่ละดอกบานออกมาทีละดอก */
function Petal({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <motion.g
      variants={{
        hidden: { opacity: 0, scale: 0, rotate: -28 },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: { duration: 0.85, ease: EASE, delay },
        },
      }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      {children}
    </motion.g>
  );
}

const CORNER_STYLE: Record<Corner, { pos: React.CSSProperties; flip: string }> = {
  'top-left': { pos: { top: 0, left: 0 }, flip: 'none' },
  'top-right': { pos: { top: 0, right: 0 }, flip: 'scaleX(-1)' },
  'bottom-left': { pos: { bottom: 0, left: 0 }, flip: 'scaleY(-1)' },
  'bottom-right': { pos: { bottom: 0, right: 0 }, flip: 'scale(-1, -1)' },
};

/**
 * ช่อดอกไม้ประดับมุมส่วนต่างๆ — บานทีละดอกตอนเลื่อนถึง
 *
 * เป็นของตกแต่งล้วน จึง aria-hidden และ pointer-events: none
 * ไม่ให้ไปบังการกดปุ่มหรือรบกวนคนที่ใช้ screen reader
 */
export function FlowerAccent({
  corner,
  reduced,
  width = 34,
  opacity = 0.38,
  color = 'var(--theme-pink)',
  variant = 0,
}: Props) {
  const { pos, flip } = CORNER_STYLE[corner];

  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 130 130"
      className="pointer-events-none absolute select-none"
      style={{
        ...pos,
        width: `${width}%`,
        maxWidth: 190,
        opacity,
        transform: flip,
        zIndex: 0,
      }}
      variants={{ hidden: {}, visible: {} }}
      initial={reduced ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <Spray variant={variant} color={color} />
    </motion.svg>
  );
}
