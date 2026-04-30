'use client';
import { motion } from 'framer-motion';
import type { Carta } from '@/src/types/jogo';
import { useStrings } from '@/src/contexts/LocaleContext';
import CartaCard from '../CartaCard/CartaCard';
import DeckPilha from '../DeckPilha/DeckPilha';
import styles from './CartasVisiveis.module.css';

interface Props {
  cartas:          Carta[];
  totalCartasDeck: number;
  onPegarVisivel:  (idx: number) => void;
  onSacarDeck:     () => void;
  disabled?:       boolean;
}

const getRotation = (id: number) => ((id * 13 + 7) % 14) - 7;

export default function CartasVisiveis({ cartas, totalCartasDeck, onPegarVisivel, onSacarDeck, disabled }: Props) {
  const S = useStrings();

  return (
    <div className={styles.container}>
      <h3 className={styles.titulo}>{S.jogo.cartasMesa(cartas.length)}</h3>

      <div className={styles.mesa}>
        <DeckPilha
          totalCartas={totalCartasDeck}
          onClick={onSacarDeck}
          disabled={disabled}
        />

        <div className={styles.divisor} />

        <div className={styles.cartas}>
          {cartas.map((carta, idx) => {
            const rot = getRotation(carta.id);
            return (
              <motion.div
                key={carta.id}
                className={styles.cartaSlot}
                style={{ '--rot': `${rot}deg` } as React.CSSProperties}
                initial={{ scale: 0, rotate: rot - 15, opacity: 0 }}
                animate={{ scale: 1, rotate: rot,       opacity: 1 }}
                transition={{ delay: idx * 0.03, type: 'spring', stiffness: 260, damping: 24 }}
                whileHover={!disabled ? { scale: 1.08, rotate: 0, zIndex: 20 } : {}}
              >
                <CartaCard
                  carta={carta}
                  onClick={disabled ? undefined : () => onPegarVisivel(idx)}
                  pequena
                  index={idx}
                />
              </motion.div>
            );
          })}
          {cartas.length === 0 && (
            <span className={styles.vazia}>{S.jogo.semCartas}</span>
          )}
        </div>
      </div>
    </div>
  );
}
