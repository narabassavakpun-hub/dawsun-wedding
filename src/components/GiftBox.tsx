import { motion } from 'motion/react';
import { EASE } from '../lib/motion';
import { Blossom, Bud, Leaf, Rose, Star } from './botanicals';

const PINK = 'var(--theme-pink)';
const SEAL = 'var(--seal-magenta)';
const CREAM = 'var(--theme-cream)';
const LAV = 'var(--theme-lavender)';

export type BoxState = 'closed' | 'open' | 'wrapping' | 'flying' | 'sent';

/** หนึ่งรอบของอนิเมชันผูกโบว์ (วินาที) */
const WRAP_CYCLE = 1.8;

/**
 * SVG ใช้ transformOrigin อ้างอิงจากมุมของ viewport ไม่ใช่ตัว element
 * ต้องสั่ง transformBox: 'fill-box' ทุกครั้งที่จะหมุน/ย่อรอบตัวเอง
 */
const originOf = (origin: string) => ({ transformBox: 'fill-box' as const, transformOrigin: origin });

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

/** หัวใจดวงเล็กสำหรับรอยทิ้งท้ายตอนกล่องลอยไป */
function TinyHeart({ x, y, r = 1, fill }: { x: number; y: number; r?: number; fill: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${r})`}
      d="M0 7 C -9 1 -7 -8 0 -4 C 7 -8 9 1 0 7 Z"
      fill={fill}
    />
  );
}

/**
 * กล่องของขวัญ 5 สถานะ
 *
 *  closed   → ฝาปิด ขยับเบาๆ เชิญให้กด
 *  open     → ฝาเปิดลอยขึ้นเอียง มีประกายพุ่งออก
 *  wrapping → ริบบิ้นรัดลงมาแล้วผูกเป็นโบว์ **วนซ้ำไม่สิ้นสุด** ระหว่างรออัปโหลด
 *  flying   → กล่องลอยขึ้นไปหาบ่าวสาว ทิ้งรอยหัวใจไว้ แล้วจางหาย
 *  sent     → ซ่อน (ให้การ์ดขอบคุณขึ้นแทน)
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
  const wrapping = state === 'wrapping';
  const flying = state === 'flying';
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

  // ทั้งกล่องลอยขึ้นไปตอนส่ง
  // จำกัด x ไว้แค่ 60 ตั้งใจให้ลอย "ขึ้น" เป็นหลัก ไม่พุ่งออกข้าง
  // เพราะ container ครอบด้วย overflow-x: clip ถ้าไปไกลกว่านี้จะโดนตัดกลางคัน
  const boxAnim =
    flying || sent
      ? reduced
        ? { opacity: 0 }
        : {
            x: [0, 14, 60],
            y: [0, -24, -190],
            scale: [1, 1.06, 0.28],
            rotate: [0, -5, 12],
            opacity: [1, 1, 0],
          }
      : { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 };

  /** คีย์เฟรมวนซ้ำระหว่างห่อ — ถ้าไม่ได้ห่ออยู่ให้อยู่สถานะผูกเสร็จแล้วนิ่งๆ */
  const loop = (keyframes: Record<string, number[]>, rest: Record<string, number>, times: number[]) =>
    wrapping && !reduced
      ? {
          animate: keyframes,
          transition: { duration: WRAP_CYCLE, times, repeat: Infinity, ease: EASE },
        }
      : { animate: rest, transition: { duration: 0.35, ease: EASE } };

  const vRibbon = loop({ scaleY: [0, 1, 1, 1] }, { scaleY: 1 }, [0, 0.3, 0.95, 1]);
  const hRibbon = loop({ scaleX: [0, 0, 1, 1] }, { scaleX: 1 }, [0, 0.2, 0.5, 1]);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      aria-hidden="true"
      animate={boxAnim}
      transition={{ duration: reduced ? 0.25 : 1.4, ease: EASE, times: [0, 0.25, 1] }}
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

      {/* เงาใต้กล่อง — หดลงตอนกล่องลอยขึ้น */}
      <motion.ellipse
        cx="100"
        cy="182"
        rx="58"
        ry="7"
        fill="rgba(160,120,150,.18)"
        animate={flying && !reduced ? { scaleX: 0.3, opacity: 0 } : { scaleX: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.2 : 1, ease: EASE }}
        style={originOf('center')}
      />

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
        {/* ริบบิ้นแนวตั้ง — รัดลงมาจากด้านบน */}
        <motion.rect
          x="92"
          y="82"
          width="16"
          height="96"
          fill={LAV}
          opacity="0.55"
          {...vRibbon}
          style={originOf('top')}
        />
        {/* ริบบิ้นแนวนอน — รัดจากซ้ายไปขวา */}
        <motion.rect
          x="42"
          y="118"
          width="116"
          height="14"
          fill={LAV}
          opacity="0.4"
          {...hRibbon}
          style={originOf('left')}
        />
      </g>

      {/* ---------- ของข้างในโผล่ตอนเปิด ---------- */}
      {opened && !reduced && (
        <motion.g
          initial={{ y: 20, opacity: 0, scale: 0.7 }}
          animate={{ y: -8, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}
          style={originOf('center')}
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
        style={originOf('center')}
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
        <motion.rect
          x="92"
          y="62"
          width="16"
          height="30"
          fill={LAV}
          opacity="0.55"
          {...vRibbon}
          style={originOf('top')}
        />

        {/* โบว์ — ผูกเป็นปมท้ายรอบ */}
        <motion.g
          {...loop(
            { scale: [0.2, 0.2, 1.15, 1], rotate: [-30, -30, 8, 0] },
            { scale: 1, rotate: 0 },
            [0, 0.45, 0.78, 0.95],
          )}
          style={originOf('center')}
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

      {/* ---------- หัวใจโคจรรอบกล่อง บอกว่ากำลังทำงานอยู่ ---------- */}
      {wrapping && !reduced && (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 128px' }}
        >
          {[0, 120, 240].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <TinyHeart
                key={a}
                x={100 + Math.cos(rad) * 82}
                y={128 + Math.sin(rad) * 62}
                r={0.85}
                fill={a === 0 ? SEAL : PINK}
              />
            );
          })}
        </motion.g>
      )}

      {/* ---------- ประกายพุ่งออกตอนเปิด ---------- */}
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

      {/* ---------- รอยหัวใจทิ้งท้ายตอนลอยไป ---------- */}
      {flying &&
        !reduced &&
        [0, 1, 2, 3].map((i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0], y: [0, 26, 62], x: [0, -8 + i * 6, -16 + i * 10], scale: [0.5, 1, 0.4] }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: i * 0.12 }}
          >
            <TinyHeart x={100} y={140} r={0.9} fill={i % 2 ? PINK : SEAL} />
          </motion.g>
        ))}
    </motion.svg>
  );
}
