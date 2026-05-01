'use client';

import React from 'react';
import styles from './ActionPanel.module.css';
import { useJogoStore } from '@/src/store/jogoStore';
import { useStrings } from '@/src/contexts/LocaleContext';

export default function ActionPanel() {
  const S = useStrings();
  const jogo = useJogoStore(state => state.jogo);
  const log = useJogoStore(state => state.log);
  const mensagem = useJogoStore(state => state.mensagem);
  const tick = useJogoStore(state => state.tick);
  const cartasSelecionadas = useJogoStore(state => state.cartasSelecionadas);
  
  const recrutarDoDeck = useJogoStore(state => state.recrutarDoDeck);
  const jogarBando = useJogoStore(state => state.jogarBando);
  const proximoTurno = useJogoStore(state => state.proximoTurno);

  if (!jogo) return null;

  const jogadorAtual = jogo.jogadorAtual();
  const isMaoCheia = jogadorAtual.mao.length >= 10;
  const podeJogarBando = cartasSelecionadas.length >= 1; // Simplified validation for UI enable/disable

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{S.jogo.turnoAtual(jogadorAtual.nome)}</h3>
      
      {mensagem && (
        <div className={styles.mensagem}>{mensagem}</div>
      )}

      <div className={styles.actions}>
        <button 
          className={styles.btnPrimary} 
          onClick={recrutarDoDeck}
          disabled={isMaoCheia}
        >
          {S.jogo.recrutarDeck}
        </button>

        <button 
          className={styles.btnSecondary} 
          onClick={jogarBando}
          disabled={!podeJogarBando}
        >
          {S.jogo.jogarBando}
        </button>

        <button 
          className={styles.btnOutline} 
          onClick={proximoTurno}
        >
          {S.jogo.proximoTurno}
        </button>
      </div>

      <div className={styles.logContainer}>
        <h4 className={styles.logTitle}>Log de Ações</h4>
        <div className={styles.logList}>
          {log.map((entry, i) => (
            <div key={i} className={styles.logEntry}>
              {entry}
            </div>
          ))}
          {log.length === 0 && <div className={styles.logEmpty}>Nenhuma ação ainda.</div>}
        </div>
      </div>
    </div>
  );
}
