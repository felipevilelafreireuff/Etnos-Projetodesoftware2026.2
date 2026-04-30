'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { EstadoPartida, Jogador } from '@/src/types/jogo';
import { useStrings } from '@/src/contexts/LocaleContext';
import styles from './StatusTurno.module.css';

interface Props {
  estado:       EstadoPartida;
  jogadorAtual: Jogador;
}

export default function StatusTurno({ estado, jogadorAtual }: Props) {
  const S = useStrings();
  const reinoColor = `var(--color-reino-${jogadorAtual.cor})`;
  const fimDeEra   = estado.estado === 'FIM_DE_ERA';
  const finalizado = estado.estado === 'FINALIZADO';

  return (
    <motion.div
      className={styles.container}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
    >
      <div className={styles.era}>
        {S.jogo.era(estado.era_atual)}
      </div>

      <motion.div
        key={jogadorAtual.id}
        className={styles.jogador}
        style={{ borderColor: reinoColor }}
        initial={{ scale: 0.85, opacity: 0, boxShadow: `0 0 0px ${reinoColor}00` }}
        animate={{ scale: 1,    opacity: 1, boxShadow: `0 0 18px ${reinoColor}55` }}
        transition={{ type: 'spring', stiffness: 380, damping: 18 }}
      >
        <motion.span
          className={styles.dot}
          style={{ background: reinoColor }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
        <span>{S.jogo.turnoAtual(jogadorAtual.nome)}</span>
      </motion.div>

      <motion.div
        className={`${styles.dragoes} ${fimDeEra ? styles.draoAlert : ''}`}
        animate={fimDeEra ? { scale: [1, 1.08, 1] } : {}}
        transition={{ repeat: fimDeEra ? Infinity : 0, duration: 0.9 }}
      >
        {S.jogo.dragoes(estado.dragoes_revelados)}
      </motion.div>

      <AnimatePresence>
        {fimDeEra && (
          <motion.div
            className={styles.alerta}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            🐉 {S.jogo.eraEncerrada}
          </motion.div>
        )}
        {finalizado && (
          <motion.div
            className={styles.vencedor}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {S.jogo.vencedor(estado.vencedor ?? '?')}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
