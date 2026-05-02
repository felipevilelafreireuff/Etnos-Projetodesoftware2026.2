'use client';

import React, { useState } from 'react';
import styles from './SetupPartida.module.css';
import { useJogoStore } from '@/src/store/jogoStore';
import { useStrings } from '@/src/contexts/LocaleContext';
import { ASSETS } from '@/src/constants/assets';

export default function SetupPartida() {
  const S = useStrings();
  const iniciarPartida = useJogoStore(state => state.iniciarPartida);
  const mensagem = useJogoStore(state => state.mensagem);
  const [nomes, setNomes] = useState<string[]>(['', '', '', '']);

  const handleChange = (index: number, value: string) => {
    const newNomes = [...nomes];
    newNomes[index] = value;
    setNomes(newNomes);
  };

  const handleAdd = () => {
    if (nomes.length < 6) {
      setNomes([...nomes, '']);
    }
  };

  const handleRemove = (index: number) => {
    if (nomes.length > 4) {
      const newNomes = [...nomes];
      newNomes.splice(index, 1);
      setNomes(newNomes);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nomesValidos = nomes.map(n => n.trim()).filter(n => n.length > 0);
    if (nomesValidos.length >= 4 && nomesValidos.length <= 6) {
      iniciarPartida(nomesValidos);
    }
  };

  return (
    <div
      className={styles.container}
      style={ASSETS.ui.setupBg ? { backgroundImage: `url(${ASSETS.ui.setupBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>{S.jogo.configPartida}</h2>
        {mensagem && <div className={styles.error}>{mensagem}</div>}
        
        <div className={styles.inputs}>
          {nomes.map((nome, i) => (
            <div key={i} className={styles.inputGroup}>
              <input
                className={styles.input}
                type="text"
                value={nome}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder={`${S.jogo.nomesJogadores} ${i + 1}`}
                required
              />
              {nomes.length > 4 && (
                <button 
                  type="button" 
                  className={styles.removeBtn} 
                  onClick={() => handleRemove(i)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {nomes.length < 6 && (
          <button type="button" className={styles.addBtn} onClick={handleAdd}>
            {S.jogo.addJogador}
          </button>
        )}

        <button type="submit" className={styles.submitBtn}>
          {S.jogo.iniciar}
        </button>
      </form>
    </div>
  );
}
