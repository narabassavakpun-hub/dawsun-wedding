import { motion } from 'motion/react';
import { EASE } from '../lib/motion';
import { Blossom, Bud, Leaf, Rose, Star } from './botanicals';

const PINK = 'var(--theme-pink)';
const SEAL = 'var(--seal-magenta)';
const CREAM = 'var(--theme-cream)';
const LAV = 'var(--theme-lavender)';

export type BoxState = 'closed' | 'open' | 'wrapping' | 'sent';

/** ช่อดอกไม้บนฝากล่อง */
function LidFlowers() {
  return (
    <g>
      <Rose x={100} y={26} r={1.15} stroke={SEAL} fill="rgba(255,255,255,.55)" />
      <Blossom x={70} y={20} r={1} stroke={SEAL} />
      <Blossom x={128} y={18} r={0.9} stroke={SEAL} />
      <Blossom x={54} y={34} r={0.7} stroke={SEAL} />
      <Bud x={140} y={36} rotate={26} r={0.9} stroke={SEAL} />
      <Bud x={60} y={44} rotate={-24} r={0.8} stroke={SEAL} />
      <Leaf x={118} y={40} rotate={18} r={0.9} stroke={SEAL} />
      <Leaf x={82} y={42} rotate={158} r={0.85} stroke={SEAL} />
      <Star x={44} y={16} r={0.6} fill={CREAM} />
      <Star x={152} y={22} r={0.5} fill={CREAM} />
    </g>
  );
}

/**
 * กล่องของขวัญมีอนิเมชันเปิด-ห่อ-ส่ง
 *
 *  closed   → ฝาปิด ขยับเบาๆ เชิญให้กด
 *  open     → ฝาเปิดลอยขึ้นเอียง มีประกายพุ่งออก
 *  wrapping → ฝากลับมาปิด โบว์รัดแน่น
 *  sent     → กล่องเลื่อนออกไปทางขวาแล้วจางหาย
 */
export function GiftBox({
  state,
  reduced,
  size = 220,
}: {
  state: BoxState;
  reduced: boolean;
  size?: number;
}) {
  const opened = state === 'open';
  const sent = state === 'sent';

  // ฝากล่อง — ยกลอยขึ้นและเอียงตอนเปิด
  const lidAnim = reduced
    ? { y: opened ? -18 : 0, opacity: opened ? 0.25 : 1 }
    : {
        y: opened ? -74 : 0,
        rotate: opened ? -16 : 0,
        x: opened ? -14 : 0,
        opacity: opened ? 0.9 : 1,
      };

  // ทั้งกล่องเลื่อนออกตอนส่ง
  const boxAnim = sent
    ? reduced
      ? { opacity: 0 }
      : { x: 160, y: -34, scale: 0.55, opacity: 0, rotate: 10 }
    : { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 };

  return (
    <motion.svg
      width={size}
      height={size * (200 / 200)}
      viewBox="0 0 200 200"
      aria-hidden="true"
      animate={boxAnim}
      transition={{ duration: reduced ? 0.25 : 0.9, ease: EASE }}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="giftBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6F8" />
          <stop offset="100%" stopColor="#FBDCE5" />
        </linearGradient>
        <linearGradient id="giftLid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFDFC" />
          <stop offset="100%" stopColor="#F8CFDD" />
        </linearGradient>
      </defs>

      {/* เงาใต้กล่อง */}
      <ellipse cx="100" cy="182" rx="58" ry="7" fill="rgba(160,120,150,.18)" />

      {/* ---------- ตัวกล่อง ---------- */}
      <g>
        <rect
          x="42"
          y="82"
          width="116"
          height="96"
          rx="10"
          fill="url(#giftBody)"
          stroke={PINK}
          strokeWidth="2"
        />
        {/* ริบบิ้นแนวตั้ง */}
        <rect x="92" y="82" width="16" height="96" fill={LAV} opacity="0.55" />
        <path d="M92 82 V178 M108 82 V178" stroke={SEAL} strokeWidth="1.2" opacity=".5" fill="none" />
        {/* ริบบิ้นแนวนอน */}
        <rect x="42" y="118" width="116" height="14" fill={LAV} opacity="0.4" />
      </g>

      {/* ---------- ของข้างในโผล่ตอนเปิด ---------- */}
      {opened && !reduced && (
        <motion.g
          initial={{ y: 20, opacity: 0, scale: 0.7 }}
          animate={{ y: -8, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          style={{ transformOrigin: '100px 90px' }}
        >
          <Star x={100} y={64} r={1.1} fill={CREAM} />
          <Star x={74} y={74} r={0.7} fill={PINK} />
          <Star x={126} y={72} r={0.75} fill={LAV} />
          <Star x={88} y={54} r={0.5} fill={CREAM} />
          <Star x={116} y={56} r={0.55} fill={PINK} />
        </motion.g>
      )}

      {/* ---------- ฝากล่อง + ดอกไม้ ---------- */}
      <motion.g
        animate={lidAnim}
        transition={{ duration: reduced ? 0.2 : 0.75, ease: EASE }}
        style={{ transformOrigin: '100px 78px' }}
      >
        <rect
          x="32"
          y="62"
          width="136"
          height="30"
          rx="8"
          fill="url(#giftLid)"
          stroke={PINK}
          strokeWidth="2"
        />
        <rect x="92" y="62" width="16" height="30" fill={LAV} opacity="0.55" />

        {/* โบว์ */}
        <motion.g
          animate={
            state === 'wrapping' && !reduced ? { scale: [1, 1.28, 1] } : { scale: 1 }
          }
          transition={{ duration: 0.6, ease: EASE }}
          style={{ transformOrigin: '100px 58px' }}
        >
          <path
            d="M100 58 C 86 40 62 40 62 54 C 62 64 82 64 100 58 Z"
            fill="#FCE3EB"
            stroke={SEAL}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M100 58 C 114 40 138 40 138 54 C 138 64 118 64 100 58 Z"
            fill="#FCE3EB"
            stroke={SEAL}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="58" r="7" fill="#FBD3E0" stroke={SEAL} strokeWidth="1.8" />
        </motion.g>

        <LidFlowers />
      </motion.g>

      {/* ประกายพุ่งออกตอนเปิด */}
      {opened &&
        !reduced &&
        [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <motion.g
            key={a}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.cos((a * Math.PI) / 180) * 78,
              y: Math.sin((a * Math.PI) / 180) * 62 - 10,
              scale: [0.4, 1, 0.5],
            }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            <Star x={100} y={78} r={0.6} fill={a % 90 === 0 ? CREAM : PINK} />
          </motion.g>
        ))}
    </motion.svg>
  );
}
