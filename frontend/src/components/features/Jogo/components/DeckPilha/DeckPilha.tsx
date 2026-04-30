'use client';
import { motion } from 'framer-motion';
import styles from './DeckPilha.module.css';

interface Props {
  totalCartas: number;
  onClick:     () => void;
  disabled?:   boolean;
}

export default function DeckPilha({ totalCartas, onClick, disabled }: Props) {
  const vazio      = totalCartas === 0;
  const bloqueado  = disabled || vazio;
  const hintTexto  = vazio ? 'Vazio' : disabled ? 'Mão cheia' : 'Clique para sacar';

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Baralho</span>

      <motion.button
        className={`${styles.pilha} ${bloqueado ? styles.desabilitado : ''}`}
        onClick={!bloqueado ? onClick : undefined}
        whileHover={!bloqueado ? {
          y: -8,
          transition: { type: 'spring', stiffness: 380, damping: 16 },
        } : {}}
        whileTap={!bloqueado ? { scale: 0.93, y: -2 } : {}}
      >
        <span className={`${styles.cartaBase} ${styles.c3}`} />
        <span className={`${styles.cartaBase} ${styles.c2}`} />
        <span className={`${styles.cartaBase} ${styles.c1}`} />

        <span className={`${styles.cartaBase} ${styles.topo}`}>
          <span className={styles.topoDetalhe} />
        </span>

        <span className={styles.contador}>{totalCartas}</span>
      </motion.button>

      <span className={styles.hint}>{hintTexto}</span>
    </div>
  );
}
