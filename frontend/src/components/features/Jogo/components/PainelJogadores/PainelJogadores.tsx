'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Jogador } from '@/src/types/jogo';
import { useStrings } from '@/src/contexts/LocaleContext';
import styles from './PainelJogadores.module.css';

interface Props {
  jogadores:      Jogador[];
  jogadorAtualId: number;
}

export default function PainelJogadores({ jogadores, jogadorAtualId }: Props) {
  const S = useStrings();

  return (
    <div className={styles.container}>
      {jogadores.map((j, i) => {
        const cor    = `var(--color-reino-${j.cor})`;
        const ativo  = j.id === jogadorAtualId;

        return (
          <motion.div
            key={`${j.id}-${ativo}`}
            className={`${styles.jogador} ${ativo ? styles.ativo : ''}`}
            style={ativo ? { borderColor: cor } : {}}
            initial={ativo
              ? { scale: 1.06, boxShadow: `0 0 28px ${cor}88` }
              : { x: -20, opacity: 0 }}
            animate={ativo
              ? { scale: 1, boxShadow: `0 0 14px ${cor}44` }
              : { x: 0,    opacity: 0.7, boxShadow: 'none' }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          >
            <motion.span
              className={styles.avatar}
              style={{ background: `${cor}22`, borderColor: cor, color: cor }}
              animate={ativo ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ repeat: ativo ? Infinity : 0, duration: 2 }}
            >
              {j.nome.charAt(0).toUpperCase()}
            </motion.span>

            <div className={styles.info}>
              <div className={styles.nomeRow}>
                <span className={styles.nome}>{j.nome}</span>
                {ativo && (
                  <motion.span
                    className={styles.badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    sua vez
                  </motion.span>
                )}
              </div>
              <span className={styles.sub}>
                {S.jogo.marcadores(j.marcadores_disponiveis)} · {S.jogo.cartasNaMao(j.mao.length)}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.span
                key={j.pontos_gloria}
                className={styles.pontos}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                exit={{ y: 8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {S.jogo.pontos(j.pontos_gloria)}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
