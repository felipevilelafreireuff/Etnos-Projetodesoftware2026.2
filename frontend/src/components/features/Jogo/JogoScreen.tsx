'use client';

import React from 'react';
import styles from './JogoScreen.module.css';
import { useJogoStore } from '@/src/store/jogoStore';
import SetupPartida from './SetupPartida/SetupPartida';
import PlayerBar from './PlayerBar/PlayerBar';
import RecruitmentPool from './RecruitmentPool/RecruitmentPool';
import GameMap from './GameMap/GameMap';
import ActionPanel from './ActionPanel/ActionPanel';
import PlayerHand from './PlayerHand/PlayerHand';

export default function JogoScreen() {
  const jogo = useJogoStore(state => state.jogo);
  const tick = useJogoStore(state => state.tick);

  if (!jogo) {
    return <SetupPartida />;
  }

  return (
    <div className={styles.container}>
      <PlayerBar />
      
      <main className={styles.mainArea}>
        <RecruitmentPool />
        <GameMap />
        <ActionPanel />
      </main>

      <PlayerHand />
    </div>
  );
}
