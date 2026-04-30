import type { CSSProperties } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
  label:   string;
  color?:  string;
  variant?: 'outline' | 'filled';
}

export default function Badge({ label, color, variant = 'filled' }: BadgeProps) {
  const style: CSSProperties = color ? { '--badge-color': color } as CSSProperties : {};
  return (
    <span className={`${styles.badge} ${styles[variant]}`} style={style}>
      {label}
    </span>
  );
}
