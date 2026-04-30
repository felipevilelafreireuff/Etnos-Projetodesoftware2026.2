'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Carta } from '@/src/types/jogo';
import { useStrings } from '@/src/contexts/LocaleContext';
import CartaCard from '../CartaCard/CartaCard';
import styles from './MaoDoJogador.module.css';

interface Props {
  cartas:             Carta[];
  cartasSelecionadas: number[];
  liderId:            number | null;
  onSelecionar:       (id: number) => void;
  onLider:            (id: number) => void;
}

export default function MaoDoJogador({ cartas, cartasSelecionadas, liderId, onSelecionar, onLider }: Props) {
  const S     = useStrings();
  const total = cartas.length;
  const maxAngle = Math.min(6, 48 / Math.max(total, 1));

  const cartasNoBando = cartas.filter(c => cartasSelecionadas.includes(c.id) && !c.eh_dragao);

  return (
    <div className={styles.container}>
      <h3 className={styles.titulo}>{S.jogo.maoContador(total)}</h3>

      <div className={styles.fan}>
        {cartas.map((carta, index) => {
          const mid       = (total - 1) / 2;
          const angle     = (index - mid) * maxAngle;
          const yOffset   = Math.abs(index - mid) * 4;
          const selecionada = cartasSelecionadas.includes(carta.id);
          const ehLider     = liderId === carta.id;

          return (
            <motion.div
              key={carta.id}
              className={styles.cartaSlot}
              style={{ '--fan-angle': `${angle}deg`, '--fan-y': `${yOffset}px` } as React.CSSProperties}
              initial={{ y: -100, opacity: 0 }}
              animate={{
                y: selecionada ? -20 : 0,
                opacity: 1,
                zIndex: selecionada ? 20 : index,
              }}
              transition={{ delay: index * 0.04, type: 'spring', stiffness: 220, damping: 22 }}
              whileHover={{ y: selecionada ? -28 : -14, zIndex: 30 }}
            >
              <CartaCard
                carta={carta}
                selecionada={selecionada}
                ehLider={ehLider}
                onClick={() => onSelecionar(carta.id)}
                index={index}
              />

              <AnimatePresence>
                {selecionada && !carta.eh_dragao && (
                  <motion.button
                    className={`${styles.btnLiderSlot} ${ehLider ? styles.btnLiderAtivo : ''}`}
                    onClick={e => { e.stopPropagation(); onLider(carta.id); }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                  >
                    {ehLider ? '★ Líder' : 'Líder'}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {total === 0 && (
          <motion.span
            className={styles.vazia}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {S.jogo.maoVazia}
          </motion.span>
        )}
      </div>

      {/* Seletor de líder — aparece quando há cartas selecionadas */}
      <AnimatePresence>
        {cartasNoBando.length > 0 && (
          <motion.div
            className={styles.liderZona}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <span className={styles.liderLabel}>👑 Líder:</span>
            <div className={styles.liderOpcoes}>
              {cartasNoBando.map(carta => {
                const cor   = `var(--color-reino-${carta.cor_reino})`;
                const ativo = liderId === carta.id;
                return (
                  <button
                    key={carta.id}
                    className={`${styles.liderPill} ${ativo ? styles.liderPillAtivo : ''}`}
                    onClick={() => onLider(carta.id)}
                  >
                    <span className={styles.liderDot} style={{ background: cor }} />
                    {ativo && '★ '}{S.jogo.tribos[carta.tribo]}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
