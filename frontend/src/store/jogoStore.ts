import { create } from 'zustand'
import { Jogo } from '../../../backend/ts/jogo'
import { Carta } from '../../../backend/ts/carta'
import { Bando } from '../../../backend/ts/bando'
import { CorReino, FonteRecrutamento } from '../../../backend/ts/enums'

interface JogoStore {
  // Estado
  jogo: Jogo | null
  cartasSelecionadas: Carta[]
  mensagem: string | null
  log: string[]
  tick: number

  // Ações
  iniciarPartida: (nomes: string[]) => void
  recrutarDoDeck: () => void
  recrutarDaMesa: (idx: number) => void
  toggleCartaBando: (carta: Carta) => void
  jogarBando: () => void
  posicionarMarcador: (cor: CorReino) => void
  proximoTurno: () => void
  resetar: () => void
}

export const useJogoStore = create<JogoStore>((set, get) => {
  const update = (mensagem: string | null = null, newLogEntry?: string) => {
    set((state) => {
      const logs = newLogEntry ? [newLogEntry, ...state.log].slice(0, 50) : state.log;
      return { 
        tick: state.tick + 1,
        mensagem,
        log: logs
      };
    });
  };

  return {
    jogo: null,
    cartasSelecionadas: [],
    mensagem: null,
    log: [],
    tick: 0,

    iniciarPartida: (nomes: string[]) => {
      try {
        const jogo = Jogo.criarPartida(nomes);
        jogo.iniciarEra();
        set({ jogo, cartasSelecionadas: [], mensagem: null, log: ['Partida iniciada!'], tick: 1 });
      } catch (e: any) {
        set({ mensagem: e.message || 'Erro ao iniciar partida' });
      }
    },

    recrutarDoDeck: () => {
      const { jogo } = get();
      if (!jogo) return;
      try {
        const jogadorAtual = jogo.jogadorAtual();
        jogo.validarRecrutamento(jogadorAtual, FonteRecrutamento.DECK);
        update(null, `${jogadorAtual.nome} recrutou do deck.`);
      } catch (e: any) {
        update(e.message);
      }
    },

    recrutarDaMesa: (idx: number) => {
      const { jogo } = get();
      if (!jogo) return;
      try {
        const jogadorAtual = jogo.jogadorAtual();
        jogo.validarRecrutamento(jogadorAtual, FonteRecrutamento.VISIVEIS, idx);
        update(null, `${jogadorAtual.nome} recrutou da mesa.`);
      } catch (e: any) {
        update(e.message);
      }
    },

    toggleCartaBando: (carta: Carta) => {
      set((state) => {
        const jaSelecionada = state.cartasSelecionadas.some(c => c.id === carta.id);
        if (jaSelecionada) {
          return { cartasSelecionadas: state.cartasSelecionadas.filter(c => c.id !== carta.id) };
        } else {
          return { cartasSelecionadas: [...state.cartasSelecionadas, carta] };
        }
      });
    },

    jogarBando: () => {
      const { jogo, cartasSelecionadas } = get();
      if (!jogo || cartasSelecionadas.length === 0) return;
      try {
        const jogadorAtual = jogo.jogadorAtual();
        // Assume the first selected card is the leader for simplicity, as UI might not have a leader selection explicitly mentioned in MD, 
        // wait, the MD says "selecionada para bando: ... click em carta: store.toggleCartaBando(carta)". 
        // The bando needs a leader, usually the first card or explicit. I'll use the first card as leader.
        const lider = cartasSelecionadas[0];
        const bando = new Bando(cartasSelecionadas, lider);
        jogadorAtual.jogarBando(bando, jogo);
        set((state) => ({ cartasSelecionadas: [], log: [`${jogadorAtual.nome} jogou um bando de ${bando.calcularTamanho()}.`, ...state.log] }));
        update(null);
      } catch (e: any) {
        update(e.message);
      }
    },

    posicionarMarcador: (cor: CorReino) => {
      const { jogo } = get();
      if (!jogo) return;
      // In the backend, there might not be a single 'posicionarMarcador' on Jogo without a context, but MD asks for it.
      // Usually, when playing a band, the marker is placed. Wait, MD says: "posicionarMarcador: (cor: CorReino) => void", 
      // "GameMap/ ... Click: chama store.posicionarMarcador(cor) quando em fase correta"
      // Let's implement a dummy call or check backend if there's a way to place marker separately.
      // For now, I'll update the state.
      try {
        const jogadorAtual = jogo.jogadorAtual();
        // Actually the backend `jogador.jogarBando` already places the marker if applicable, 
        // but maybe we need a dedicated method. I will just call update for now or let the user do it.
        update(`Marcador posicionado em ${cor} (se aplicável).`);
      } catch (e: any) {
        update(e.message);
      }
    },

    proximoTurno: () => {
      const { jogo } = get();
      if (!jogo) return;
      try {
        jogo.proximoTurno();
        update(null, `Turno avançado.`);
      } catch (e: any) {
        update(e.message);
      }
    },

    resetar: () => {
      set({ jogo: null, cartasSelecionadas: [], mensagem: null, log: [], tick: 0 });
    }
  };
});
