'use client';

import React from 'react';
import styles from './PlayerBar.module.css';
import { useJogoStore } from '@/src/store/jogoStore';
import { useStrings } from '@/src/contexts/LocaleContext';

export default function PlayerBar() {
  const S = useStrings();
  const jogo = useJogoStore(state => state.jogo);
  const tick = useJogoStore(state => state.tick); // Força re-render nas mudanças
  
  if (!jogo) return null;

  const jogadores = jogo.jogadores;
  const jogadorAtual = jogo.jogadorAtual();

  return (
    <div className={styles.bar}>
      <div className={styles.playersContainer}>
        {jogadores.map(jogador => {
          const isAtivo = jogador.id === jogadorAtual.id;
          return (
            <div key={jogador.id} className={`${styles.playerCard} ${isAtivo ? styles.ativo : ''}`}>
              <div className={styles.playerName} style={{ color: jogador.cor }}>
                {jogador.nome}
              </div>
              <div className={styles.playerStats}>
                <span title="Pontos de Glória">⭐ {jogador.pontosGloria}</span>
                <span title="Cartas na Mão">🃏 {jogador.mao.length}</span>
                <span title="Marcadores Disponíveis">🔵 {jogador.marcadoresDisponiveis.length}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.centerInfo}>
        <div className={styles.logo}>EtNós</div>
        <div className={styles.pill}>{S.jogo.era(jogo.eraAtual)}</div>
        <div className={`${styles.pill} ${jogo.dragoesRevelados > 0 ? styles.pillDanger : ''}`}>
          {S.jogo.dragoes(jogo.dragoesRevelados)}
        </div>
      </div>
    </div>
  );
}
