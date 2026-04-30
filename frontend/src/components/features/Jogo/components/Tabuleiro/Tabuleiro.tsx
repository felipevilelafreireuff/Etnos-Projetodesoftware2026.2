'use client';
import { motion } from 'framer-motion';
import type { Reino } from '@/src/types/jogo';
import { useStrings } from '@/src/contexts/LocaleContext';
import styles from './Tabuleiro.module.css';

interface Props { reinos: Reino[] }

export default function Tabuleiro({ reinos }: Props) {
  const S = useStrings();

  return (
    <div className={styles.tabuleiro}>
      {reinos.map((reino, i) => {
        const cor = `var(--color-reino-${reino.cor})`;
        return (
          <motion.div
            key={reino.cor}
            className={styles.reino}
            style={{ '--reino-color': cor } as React.CSSProperties}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 22 }}
            whileHover={{ scale: 1.04, zIndex: 5 }}
          >
            <div className={styles.faixa} />
            <div className={styles.cabecalho}>
              <span className={styles.nome}>{S.jogo.reinos[reino.cor]}</span>
              <span className={styles.escudos}>
                {'🛡'.repeat(Math.min(reino.total_marcadores, 5))}
                {reino.total_marcadores > 5 ? ` +${reino.total_marcadores - 5}` : ''}
              </span>
            </div>
            <div className={styles.fichas}>
              {reino.fichas_gloria.map((v, j) => (
                <motion.span
                  key={j}
                  className={styles.ficha}
                  whileHover={{ scale: 1.15 }}
                >
                  {v}
                </motion.span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
