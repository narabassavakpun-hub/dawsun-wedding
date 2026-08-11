/**
 * ชิ้นส่วนดอกไม้ลายเส้น ใช้ร่วมกันระหว่างโมโนแกรม (Monogram.tsx)
 * และกล่องของขวัญ (GiftBox.tsx)
 *
 * สไตล์ตาม brand.md ข้อ 7 — เส้นบาง มุมมน ไม่มีรูปทึบ
 * ทุกชิ้นวาดโดยมีจุด (0,0) เป็นจุดยึด แล้ววางด้วย translate
 */

type Base = { x: number; y: number; r?: number; stroke: string };

/** ดอกยิปโซ — ดอกกลม 5 กลีบ ล้อมเกสรกลาง */
export function Blossom({ x, y, r = 1, stroke }: Base) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r})`}>
      {[0, 72, 144, 216, 288].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={(Math.cos(rad) * 4.1).toFixed(2)}
            cy={(Math.sin(rad) * 4.1).toFixed(2)}
            r="2.9"
            fill="none"
            stroke={stroke}
            strokeWidth="1.7"
          />
        );
      })}
      <circle r="1.6" fill={stroke} />
    </g>
  );
}

/** ตูมดอก — ทรงหยดน้ำบนก้านสั้น */
export function Bud({ x, y, rotate = 0, r = 1, stroke }: Base & { rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${r})`}>
      <path
        d="M0 0 C -4.2 -2.4 -4.2 -8.4 0 -11 C 4.2 -8.4 4.2 -2.4 0 0 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M0 -2.5 V -8.5" fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

/** ใบไม้ทรงเมล็ด มีเส้นกลางใบ */
export function Leaf({ x, y, rotate = 0, r = 1, stroke }: Base & { rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${r})`}>
      <path
        d="M0 0 C 7 -6 16 -5 19 0 C 16 5 7 6 0 0 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M1.5 0 H 17" fill="none" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
}

/**
 * เส้นหยักปิดวง ใช้ทำกลีบชั้นนอกของกุหลาบ
 * ต้องเป็นเส้นต่อเนื่องปิดวง ถ้าวาดเป็นเส้นโค้งแยกชิ้นจะมีช่องว่างคั่น
 * แล้วดอกจะดูเหมือนก้นหอยขาดๆ แทนที่จะเป็นกุหลาบ
 */
export function scallopPath(n: number, radius: number, bulge: number) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [radius * Math.cos(a), radius * Math.sin(a)] as const;
  });
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i <= n; i++) {
    d += ` A ${bulge} ${bulge} 0 0 1 ${pts[i % n][0].toFixed(2)} ${pts[i % n][1].toFixed(2)}`;
  }
  return `${d} Z`;
}

/** กุหลาบมองจากด้านบน — กลีบนอกซ้อน 2 ชั้น + ก้นหอยกลางดอก */
export function Rose({ x, y, r = 1, stroke, fill = 'none' }: Base & { fill?: string }) {
  const s = {
    fill: 'none',
    stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${r})`}>
      <path {...s} fill={fill} strokeWidth="1.8" d={scallopPath(5, 14, 8.6)} />
      <path {...s} strokeWidth="1.6" transform="rotate(36)" d={scallopPath(5, 8.4, 5.2)} />
      <path
        {...s}
        strokeWidth="1.6"
        d="M 1 -3.4 C 4.4 -3.4 6 0 4.8 2.8 C 3.6 5.8 -0.5 6.9 -3.6 5.4 C -7.2 3.7 -8.3 -1.1 -6.2 -4.8"
      />
    </g>
  );
}

/** ประกาย 4 แฉก */
export function Star({ x, y, r = 1, fill }: { x: number; y: number; r?: number; fill: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${r})`}
      d="M0 -9 C 1.1 -3.4 3.4 -1.1 9 0 C 3.4 1.1 1.1 3.4 0 9 C -1.1 3.4 -3.4 1.1 -9 0 C -3.4 -1.1 -1.1 -3.4 0 -9 Z"
      fill={fill}
    />
  );
}
