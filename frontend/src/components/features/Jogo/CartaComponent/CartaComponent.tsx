'use client';

import React, { useState } from 'react';
import styles from './CartaComponent.module.css';
import { Carta } from '../../../../../../backend/ts/carta';
import { useStrings } from '@/src/contexts/LocaleContext';
import { ASSETS, NomeTriboAsset } from '@/src/constants/assets';

interface CartaProps {
  carta: Carta;
  selecionada?: boolean;
  tamanho?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  desabilitada?: boolean;
}

const EMOJI_FALLBACK: Record<string, string> = {
  TRIBO_1: '🌿',
  TRIBO_2: '⚒️',
  TRIBO_3: '💀',
  TRIBO_4: '🌊',
  DRAGAO:  '🐉',
};

export default function CartaComponent({ carta, selecionada = false, tamanho = 'md', onClick, desabilitada = false }: CartaProps) {
  const S = useStrings();
  const [imgFailed, setImgFailed] = useState(false);

  const triboNome = carta.tribo.nome as NomeTriboAsset;
  const triboName = S.jogo.tribos[carta.tribo.nome] || carta.tribo.nome;
  const imgSrc    = ASSETS.tribos[triboNome];
  const showImg   = !!imgSrc && !imgFailed;

  return (
    <div
      className={`${styles.carta} ${styles[tamanho]} ${selecionada ? styles.selecionada : ''} ${desabilitada ? styles.desabilitada : ''}`}
      onClick={!desabilitada ? onClick : undefined}
      style={{ borderColor: `var(--color-reino-${carta.corReino})` }}
      data-tribo={showImg ? undefined : carta.tribo.nome}
    >
      <div className={styles.header}>
        <span className={styles.triboNome}>{triboName}</span>
      </div>

      <div className={styles.center}>
        {showImg ? (
          <img
            src={imgSrc}
            alt={triboName}
            className={styles.triboImg}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className={styles.emoji}>{EMOJI_FALLBACK[carta.tribo.nome] ?? '❓'}</span>
        )}
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
