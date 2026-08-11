import { motion } from 'motion/react';
import { DURATION, EASE, VIEWPORT } from '../lib/motion';
import {
  MONO_ANCHORS,
  MONO_PATH_N,
  MONO_PATH_W,
  MONO_RATIO,
  MONO_VB_H,
  MONO_VB_W,
} from './monogramPaths';
import { Blossom, Bud, Leaf, Rose, Star } from './botanicals';

type Props = {
  size?: number;
  /** เผยตัวแบบค่อยๆ เขียนตอนเลื่อนถึง (ใช้ในตอนที่ 4) */
  animate?: boolean;
  className?: string;
  color?: string;
};

export { MONO_RATIO };

// จุดอ้างอิงวางดอกไม้ อิงจากตำแหน่งตัวอักษรจริง
const { baseline, leftEdge, rightW, rightN, overlap } = MONO_ANCHORS;
const SX = Math.round(rightW - overlap / 2); // ช่อกลาง อยู่ตรงรอยต่อ W กับ N
const SY = baseline - 30;
const RX = Math.round(rightN - 22); // กุหลาบ ขวาล่าง พ้นขาขวาของ N
const RY = baseline - 4;
const LX = leftEdge + 6; // ช่อเล็ก ซ้ายล่าง
const LY = baseline + 20;

/**
 * Monogram W N — วาดตามตราครั่งบนซองจริง (`รูปจริง/รูปซอง.jpg`)
 *
 * ตัวอักษรเป็น SVG path ที่แปลงจากฟอนต์ Great Vibes ไว้ล่วงหน้า (ดู monogramPaths.ts)
 * ไม่ใช้ <text> เพราะหางตวัดของฟอนต์ยื่นเกิน em box จนถูก viewBox ตัดขาด
 * และไม่ได้วาด path เองด้วยมือ เพราะลายมือคัดมีเส้นหนัก-บางสลับกัน
 * ซึ่ง stroke ความหนาคงที่เลียนแบบไม่ได้
 */
export function Monogram({ size = 170, animate = false, className, color = 'var(--seal-magenta)' }: Props) {
  const letterReveal = animate
    ? {
        initial: { opacity: 0, scale: 0.94 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: VIEWPORT,
        transition: { duration: DURATION.reveal, ease: EASE },
      }
    : {};

  const bloomIn = (i: number) =>
    animate
      ? {
          initial: { opacity: 0, scale: 0.5 },
          whileInView: { opacity: 1, scale: 1 },
          viewport: VIEWPORT,
          transition: { duration: DURATION.base, ease: EASE, delay: 0.5 + i * 0.09 },
        }
      : {};

  const G = animate ? motion.g : 'g';

  return (
    <svg
      width={size}
      height={size * MONO_RATIO}
      viewBox={`0 0 ${MONO_VB_W} ${MONO_VB_H}`}
      className={className}
      role="img"
      aria-label="ตราสัญลักษณ์ W N ประดับดอกไม้"
    >
      {/* ---------- ตัวอักษร ---------- */}
      <G {...letterReveal} style={{ transformOrigin: '50% 60%' }}>
        <path d={MONO_PATH_W} fill={color} />
        <path d={MONO_PATH_N} fill={color} />
      </G>

      {/* ---------- ช่อยิปโซกลาง ---------- */}
      <G {...bloomIn(0)} style={{ transformOrigin: `${SX}px ${SY}px` }}>
        <path
          d={`M${SX} ${SY} C ${SX - 6} ${SY - 70} ${SX + 2} ${SY - 120} ${SX - 8} ${SY - 175} M${SX - 2} ${SY - 60} C ${SX + 22} ${SY - 82} ${SX + 38} ${SY - 96} ${SX + 52} ${SY - 118} M${SX - 3} ${SY - 72} C ${SX - 26} ${SY - 92} ${SX - 40} ${SY - 106} ${SX - 52} ${SY - 126} M${SX - 5} ${SY - 122} C ${SX + 14} ${SY - 140} ${SX + 24} ${SY - 152} ${SX + 30} ${SY - 168} M${SX - 6} ${SY - 130} C ${SX - 22} ${SY - 146} ${SX - 30} ${SY - 158} ${SX - 34} ${SY - 172}`}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Blossom x={SX - 9} y={SY - 184} r={1.25} stroke={color} />
        <Blossom x={SX + 56} y={SY - 126} r={1.05} stroke={color} />
        <Blossom x={SX - 56} y={SY - 134} r={1.05} stroke={color} />
        <Blossom x={SX + 33} y={SY - 176} r={0.85} stroke={color} />
        <Blossom x={SX - 37} y={SY - 180} r={0.85} stroke={color} />
        <Bud x={SX + 20} y={SY - 100} rotate={22} stroke={color} />
        <Bud x={SX - 22} y={SY - 112} rotate={-20} r={0.95} stroke={color} />
        <Leaf x={SX + 3} y={SY - 44} rotate={-40} r={0.95} stroke={color} />
        <Leaf x={SX - 4} y={SY - 34} rotate={-152} r={0.9} stroke={color} />
      </G>

      {/* ---------- กุหลาบขวาล่าง ---------- */}
      <G {...bloomIn(1)} style={{ transformOrigin: `${RX}px ${RY}px` }}>
        <Rose x={RX} y={RY} r={1.25} stroke={color} />
        <path
          d={`M${RX - 20} ${RY + 14} C ${RX - 44} ${RY + 28} ${RX - 74} ${RY + 32} ${RX - 102} ${RY + 28} M${RX - 4} ${RY - 20} C ${RX + 2} ${RY - 36} ${RX + 4} ${RY - 50} ${RX + 2} ${RY - 62}`}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Leaf x={RX - 86} y={RY + 30} rotate={168} r={1.05} stroke={color} />
        <Bud x={RX + 2} y={RY - 64} rotate={6} r={0.95} stroke={color} />
        <Blossom x={RX - 58} y={RY + 34} r={0.8} stroke={color} />
      </G>

      {/* ---------- ช่อเล็กซ้ายล่าง ---------- */}
      <G {...bloomIn(2)} style={{ transformOrigin: `${LX}px ${LY}px` }}>
        <path
          d={`M${LX + 54} ${LY} C ${LX + 30} ${LY + 10} ${LX + 4} ${LY + 12} ${LX - 20} ${LY + 6} M${LX + 18} ${LY + 8} C ${LX + 8} ${LY - 6} ${LX + 2} ${LY - 20} ${LX + 2} ${LY - 34}`}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <Blossom x={LX - 28} y={LY + 4} r={1.05} stroke={color} />
        <Blossom x={LX + 1} y={LY - 40} r={0.85} stroke={color} />
        <Bud x={LX + 34} y={LY + 16} rotate={-166} stroke={color} />
        <Leaf x={LX + 46} y={LY + 2} rotate={152} r={0.95} stroke={color} />
      </G>

      {/* ---------- ประกาย ---------- */}
      <G {...bloomIn(3)}>
        <Star x={leftEdge - 34} y={baseline - 40} r={1.3} fill={color} />
        <Star x={leftEdge - 14} y={baseline - 6} r={0.7} fill={color} />
        <Star x={leftEdge - 44} y={baseline - 4} r={0.5} fill={color} />
        <Star x={MONO_VB_W - 26} y={baseline - 150} r={1.2} fill={color} />
        <Star x={MONO_VB_W - 46} y={baseline - 178} r={0.62} fill={color} />
        <Star x={MONO_VB_W - 18} y={baseline - 116} r={0.5} fill={color} />
      </G>
    </svg>
  );
}
