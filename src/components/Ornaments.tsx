import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import { revealOnScroll } from '../lib/motion';

/** หัวใจลายเส้นวาดมือ — โมทีฟหลักของงาน (brand.md ข้อ 7) */
export function Heart({
  size = 24,
  filled = false,
  strokeWidth = 2,
  color = 'currentColor',
  className,
  style,
}: {
  size?: number;
  filled?: boolean;
  strokeWidth?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 20.5C12 20.5 3.5 15.2 3.5 9.2C3.5 6.3 5.7 4.2 8.3 4.2C10 4.2 11.3 5.1 12 6.3C12.7 5.1 14 4.2 15.7 4.2C18.3 4.2 20.5 6.3 20.5 9.2C20.5 15.2 12 20.5 12 20.5Z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** ประกาย 4 แฉก */
export function Sparkle({
  size = 16,
  color = 'var(--theme-cream)',
  className,
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 1.5C12.6 7.4 16.6 11.4 22.5 12C16.6 12.6 12.6 16.6 12 22.5C11.4 16.6 7.4 12.6 1.5 12C7.4 11.4 11.4 7.4 12 1.5Z"
        fill={color}
      />
    </svg>
  );
}

/** เส้นคั่นไล่เฉด มีหัวใจตรงกลาง */
export function Divider({ className }: { className?: string }) {
  return (
    <div className={`divider ${className ?? ''}`} aria-hidden="true">
      <Heart size={14} color="var(--theme-pink)" strokeWidth={1.8} />
    </div>
  );
}

/**
 * หัวข้อมาตรฐานของทุกตอน — brand.md ข้อ 8
 * อังกฤษตัวเล็กเว้นวรรคกว้าง → หัวข้อไทยตัวใหญ่
 */
export function SectionHeading({
  eyebrow,
  heading,
  reduced,
  children,
}: {
  eyebrow: string;
  heading?: string;
  reduced: boolean;
  children?: ReactNode;
}) {
  return (
    <motion.div className="text-center" {...revealOnScroll(reduced)}>
      <p className="eyebrow">{eyebrow}</p>
      {heading && <h2 className="heading-th mt-2">{heading}</h2>}
      {children}
      <Divider className="mt-5 mb-1" />
    </motion.div>
  );
}
