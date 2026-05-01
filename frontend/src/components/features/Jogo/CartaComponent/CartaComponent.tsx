'use client';

import React from 'react';
import styles from './CartaComponent.module.css';
import { Carta } from '../../../../../../backend/ts/carta';
import { useStrings } from '@/src/contexts/LocaleContext';

interface CartaProps {
  carta: Carta;
  selecionada?: boolean;
  tamanho?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  desabilitada?: boolean;
}

export default function CartaComponent({ carta, selecionada = false, tamanho = 'md', onClick, desabilitada = false }: CartaProps) {
  const S = useStrings();

  const getEmoji = (triboNome: string) => {
    switch (triboNome) {
      case 'TRIBO_1': return '🌿';
      case 'TRIBO_2': return '⚒️';
      case 'TRIBO_3': return '💀';
      case 'TRIBO_4': return '🌊';
      case 'DRAGAO': return '🐉';
      default: return '❓';
    }
  };

  const triboName = S.jogo.tribos[carta.tribo.nome] || carta.tribo.nome;
  const emoji = getEmoji(carta.tribo.nome);

  return (
    <div
      className={`${styles.carta} ${styles[tamanho]} ${selecionada ? styles.selecionada : ''} ${desabilitada ? styles.desabilitada : ''}`}
      onClick={!desabilitada ? onClick : undefined}
      style={{
        borderColor: `var(--color-reino-${carta.corReino})`,
      }}
      data-tribo={carta.tribo.nome}
    >
      <div className={styles.header}>
        <span className={styles.triboNome}>{triboName}</span>
      </div>
      <div className={styles.center}>
        <span className={styles.emoji}>{emoji}</span>
      </div>
      <div className={styles.footer}>
        <div 
          className={styles.gem}
          style={{ backgroundColor: `var(--color-reino-${carta.corReino})` }}
        />
      </div>
    </div>
  );
}
