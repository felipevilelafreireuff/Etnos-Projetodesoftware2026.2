'use client';

import React, { useState } from 'react';
import styles from './PlayerHand.module.css';
import { useJogoStore } from '@/src/store/jogoStore';
import { useStrings } from '@/src/contexts/LocaleContext';
import CartaComponent from '../CartaComponent/CartaComponent';

export default function PlayerHand() {
  const S = useStrings();
  const jogo = useJogoStore(state => state.jogo);
  const cartasSelecionadas = useJogoStore(state => state.cartasSelecionadas);
  const toggleCartaBando = useJogoStore(state => state.toggleCartaBando);
  const tick = useJogoStore(state => state.tick);
  
  const [isHovered, setIsHovered] = useState(false);

  if (!jogo) return null;

  const jogadorAtual = jogo.jogadorAtual();
  const mao = jogadorAtual.mao;

  return (
    <div 
      className={styles.handContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.handLabel}>
        {S.jogo.maoContador(mao.length)}
      </div>
      
      <div className={`${styles.cards} ${isHovered ? styles.cardsExpanded : ''}`}>
        {mao.length === 0 && (
          <div className={styles.emptyHand}>{S.jogo.maoVazia}</div>
        )}
        
        {mao.map((carta, index) => {
          const isSelected = cartasSelecionadas.some(c => c.id === carta.id);
          
          return (
            <div 
              key={carta.id} 
              className={styles.cardWrapper}
              style={{ zIndex: index }}
            >
              <CartaComponent
                carta={carta}
                tamanho="lg"
                selecionada={isSelected}
                onClick={() => toggleCartaBando(carta)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
