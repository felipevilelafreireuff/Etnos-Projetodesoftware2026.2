'use client';
import { useState, useCallback } from 'react';
import { useJogoStore } from '@/src/store/jogoStore';
import { FonteRecrutamento } from '../../../../backend/ts/enums';
import type { EstadoPartida } from '@/src/types/jogo';

export interface UseJogoScreenReturn {
  estado:             EstadoPartida | null;
  loading:            boolean;
  erro:               string | null;
  cartasSelecionadas: number[];
  liderId:            number | null;
  fase:               'setup' | 'jogando';
  nomesInput:         string[];
  handleSetNomes:     (nomes: string[]) => void;
  handleIniciar:      () => void;
  handleRecruitarDeck:    () => void;
  handleRecruitarVisivel: (idx: number) => void;
  handleSelecionarCarta:  (id: number) => void;
  handleDefinirLider:     (id: number) => void;
  handleJogarBando:       (adicionarMarcador: boolean) => void;
  handleProximoTurno:     () => void;
  handleEncerrarEra:      () => void;
}

export function useJogoScreen(): UseJogoScreenReturn {
  const { estado, erro, iniciarPartida, recrutar, jogarBando, proximoTurno, encerrarEra, limparErro } =
    useJogoStore();

  const [cartasSelecionadas, setCartasSelecionadas] = useState<number[]>([]);
  const [liderId,            setLiderId]            = useState<number | null>(null);
  const [fase,               setFase]               = useState<'setup' | 'jogando'>('setup');
  const [nomesInput,         setNomesInput]         = useState<string[]>(['', '', '', '']);

  const handleSetNomes = useCallback((nomes: string[]) => setNomesInput(nomes), []);

  const handleIniciar = useCallback(() => {
    limparErro();
    const nomes = nomesInput.filter(n => n.trim().length > 0);
    iniciarPartida(nomes);
    setFase('jogando');
    setCartasSelecionadas([]);
    setLiderId(null);
  }, [nomesInput, iniciarPartida, limparErro]);

  const handleRecruitarDeck = useCallback(() => {
    limparErro();
    recrutar(FonteRecrutamento.DECK);
  }, [recrutar, limparErro]);

  const handleRecruitarVisivel = useCallback((idx: number) => {
    limparErro();
    recrutar(FonteRecrutamento.VISIVEIS, idx);
  }, [recrutar, limparErro]);

  const handleSelecionarCarta = useCallback((id: number) => {
    setCartasSelecionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
    );
  }, []);

  const handleDefinirLider = useCallback((id: number) => {
    setLiderId(prev => (prev === id ? null : id));
  }, []);

  const handleJogarBando = useCallback((adicionarMarcador: boolean) => {
    if (!liderId || cartasSelecionadas.length === 0) return;
    limparErro();
    jogarBando(cartasSelecionadas, liderId, adicionarMarcador);
    setCartasSelecionadas([]);
    setLiderId(null);
  }, [liderId, cartasSelecionadas, jogarBando, limparErro]);

  const handleProximoTurno = useCallback(() => {
    limparErro();
    proximoTurno();
    setCartasSelecionadas([]);
    setLiderId(null);
  }, [proximoTurno, limparErro]);

  const handleEncerrarEra = useCallback(() => {
    limparErro();
    encerrarEra();
    setCartasSelecionadas([]);
    setLiderId(null);
  }, [encerrarEra, limparErro]);

  return {
    estado,
    loading: false, // operações síncronas — sem loading state
    erro,
    cartasSelecionadas,
    liderId,
    fase,
    nomesInput,
    handleSetNomes,
    handleIniciar,
    handleRecruitarDeck,
    handleRecruitarVisivel,
    handleSelecionarCarta,
    handleDefinirLider,
    handleJogarBando,
    handleProximoTurno,
    handleEncerrarEra,
  };
}
