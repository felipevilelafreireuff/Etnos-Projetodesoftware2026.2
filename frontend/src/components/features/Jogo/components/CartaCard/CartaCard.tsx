'use client';
import type { CSSProperties } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import type { Carta } from '@/src/types/jogo';
import { useStrings } from '@/src/contexts/LocaleContext';
import styles from './CartaCard.module.css';

interface CartaCardProps {
  carta:        Carta;
  selecionada?: boolean;
  ehLider?:     boolean;
  onClick?:     () => void;
  pequena?:     boolean;
  index?:       number;
}

export default function CartaCard({ carta, selecionada, ehLider, onClick, pequena, index = 0 }: CartaCardProps) {
  const S = useStrings();
  const reinoColor = `var(--color-reino-${carta.cor_reino})`;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 400, damping: 30 });
  const glowX   = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glowY   = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pequena) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className={`
        ${styles.carta}
        ${selecionada   ? styles.selecionada : ''}
        ${ehLider       ? styles.lider       : ''}
        ${carta.eh_dragao ? styles.dragao    : ''}
        ${pequena       ? styles.pequena     : ''}
      `}
      style={{
        '--reino-color': reinoColor,
        rotateX,
        rotateY,
        transformPerspective: 600,
      } as CSSProperties}
      initial={{ y: -80, opacity: 0, scale: 0.8 }}
      animate={{ y: 0,   opacity: 1, scale: 1   }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 220, damping: 22 }}
      whileTap={{ scale: 0.96 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Sheen que segue o mouse */}
      <motion.div
        className={styles.sheen}
        style={{ backgroundImage: `radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.14) 0%, transparent 65%)` }}
      />

      {/* Faixa de cor do reino (topo) */}
      <div className={styles.faixaReino} />

      <div className={styles.top}>
        <span className={styles.tribo}>
          {carta.eh_dragao ? '🐉' : S.jogo.tribos[carta.tribo]}
        </span>
        {ehLider && <span className={styles.liderBadge}>👑</span>}
      </div>

      <div className={styles.bottom}>
        <span className={styles.reino}>
          {carta.eh_dragao ? S.jogo.tribos['DRAGAO'] : S.jogo.reinos[carta.cor_reino]}
        </span>
      </div>

    </motion.div>
  );
}
