'use client';

import React from 'react';
import styles from './RecruitmentPool.module.css';
import { useJogoStore } from '@/src/store/jogoStore';
import { useStrings } from '@/src/contexts/LocaleContext';
import CartaComponent from '../CartaComponent/CartaComponent';

export default function RecruitmentPool() {
  const S = useStrings();
  const jogo = useJogoStore(state => state.jogo);
  const tick = useJogoStore(state => state.tick);
  const recrutarDaMesa = useJogoStore(state => state.recrutarDaMesa);

  if (!jogo) return null;

  const cartas = Array.from(jogo.cartasVisiveis);

  return (
    <div className={styles.pool}>
      <h3 className={styles.title}>{S.jogo.cartasMesa(cartas.length)}</h3>
      
      {cartas.length === 0 ? (
        <div className={styles.empty}>{S.jogo.semCartas}</div>
      ) : (
        <div className={styles.cartas}>
          {cartas.map((carta, index) => (
            <CartaComponent 
              key={`${carta.id}-${index}`} 
              carta={carta} 
              tamanho="md" 
              onClick={() => recrutarDaMesa(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
