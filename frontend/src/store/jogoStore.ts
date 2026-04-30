import { create } from 'zustand';

import { Jogo } from '../../../backend/ts/jogo';
import { Bando } from '../../../backend/ts/bando';
import { FonteRecrutamento } from '../../../backend/ts/enums';

import type {
  EstadoPartida,
  Carta as CartaFrontend,
  Jogador as JogadorFrontend,
  Reino as ReinoFrontend,
} from '@/src/types/jogo';
import type { Carta } from '../../../backend/ts/carta';
import type { Jogador } from '../../../backend/ts/jogador';
import type { Reino } from '../../../backend/ts/reino';

// ---------------------------------------------------------------------------
// Serializer — converte objetos do domínio TS para o formato EstadoPartida
// ---------------------------------------------------------------------------

function serializarCarta(carta: Carta): CartaFrontend {
  return {
    id:        carta.id,
    tribo:     carta.tribo.nome as CartaFrontend['tribo'],
    cor_reino: carta.corReino   as CartaFrontend['cor_reino'],
    eh_dragao: carta.ehDragao,
  };
}

function serializarJogador(jogador: Jogador): JogadorFrontend {
  return {
    id:                     jogador.id,
    nome:                   jogador.nome,
    cor:                    jogador.cor as JogadorFrontend['cor'],
    pontos_gloria:          jogador.pontosGloria,
    mao:                    jogador.mao.map(serializarCarta),
    marcadores_disponiveis: jogador.marcadoresDisponiveis.length,
  };
}

function serializarReino(reino: Reino): ReinoFrontend {
  const marcadoresPorJogador: Record<string, number> = {};
  for (const marcador of reino.marcadores) {
    const jid = String(marcador.jogador.id);
    marcadoresPorJogador[jid] = (marcadoresPorJogador[jid] ?? 0) + 1;
  }

  return {
    cor:                    reino.cor as ReinoFrontend['cor'],
    marcadores_por_jogador: marcadoresPorJogador,
    fichas_gloria:          reino.fichasGloria.map(f => f.valor),
    total_marcadores:       reino.marcadores.length,
  };
}

function serializarJogo(jogo: Jogo): EstadoPartida {
  let vencedor: string | null = null;
  if (jogo.estado === 'FINALIZADO') {
    vencedor = jogo.declararVencedor().nome;
  }

  return {
    estado:             jogo.estado as EstadoPartida['estado'],
    era_atual:          jogo.eraAtual,
    turno_atual:        jogo.turnoAtual,
    dragoes_revelados:  jogo.dragoesRevelados,
    jogador_atual_id:   jogo.jogadorAtual().id,
    jogadores:          jogo.jogadores.map(serializarJogador),
    reinos:             jogo.reinos.map(serializarReino),
    cartas_visiveis:    [...jogo.cartasVisiveis].map(serializarCarta),
    total_cartas_deck:  jogo.deck.tamanho(),
    vencedor,
  };
}

// ---------------------------------------------------------------------------
// Store Zustand
// ---------------------------------------------------------------------------

export interface JogoState {
  jogo:   Jogo | null;
  estado: EstadoPartida | null;
  erro:   string | null;
}

export interface JogoActions {
  iniciarPartida:  (nomes: string[]) => void;
  recrutar:        (fonte: FonteRecrutamento, idx?: number) => void;
  jogarBando:      (cartaIds: number[], liderId: number, adicionarMarcador: boolean) => void;
  proximoTurno:    () => void;
  encerrarEra:     () => void;
  limparErro:      () => void;
}

type JogoStore = JogoState & JogoActions;

export const useJogoStore = create<JogoStore>((set, get) => ({
  jogo:   null,
  estado: null,
  erro:   null,

  iniciarPartida(nomes: string[]) {
    try {
      const jogo = Jogo.criarPartida(nomes);
      jogo.iniciarEra();
      const estado = serializarJogo(jogo);
      set({ jogo, estado, erro: null });
    } catch (e) {
      set({ erro: e instanceof Error ? e.message : 'Erro ao iniciar partida.' });
    }
  },

  recrutar(fonte: FonteRecrutamento, idx?: number) {
    const { jogo } = get();
    if (!jogo) { set({ erro: 'Partida não iniciada.' }); return; }
    try {
      const jogador = jogo.jogadorAtual();
      jogo.validarRecrutamento(jogador, fonte, idx);
      set({ estado: serializarJogo(jogo), erro: null });
    } catch (e) {
      set({ erro: e instanceof Error ? e.message : 'Erro ao recrutar.' });
    }
  },

  jogarBando(cartaIds: number[], liderId: number, adicionarMarcador: boolean) {
    const { jogo } = get();
    if (!jogo) { set({ erro: 'Partida não iniciada.' }); return; }
    try {
      const jogador = jogo.jogadorAtual();
      const cartasPorId = new Map(jogador.mao.map(c => [c.id, c]));
      const cartas = cartaIds.map(id => cartasPorId.get(id)).filter(Boolean) as Carta[];
      const lider  = cartasPorId.get(liderId);

      if (!lider || cartas.length === 0) {
        throw new Error('Cartas ou líder inválidos.');
      }

      const bando = new Bando(cartas, lider);
      jogador.jogarBando(bando, jogo);
      set({ estado: serializarJogo(jogo), erro: null });
    } catch (e) {
      set({ erro: e instanceof Error ? e.message : 'Erro ao jogar bando.' });
    }
  },

  proximoTurno() {
    const { jogo } = get();
    if (!jogo) { set({ erro: 'Partida não iniciada.' }); return; }
    try {
      jogo.proximoTurno();
      set({ estado: serializarJogo(jogo), erro: null });
    } catch (e) {
      set({ erro: e instanceof Error ? e.message : 'Erro ao avançar turno.' });
    }
  },

  encerrarEra() {
    const { jogo } = get();
    if (!jogo) { set({ erro: 'Partida não iniciada.' }); return; }
    try {
      jogo.encerrarEra();
      set({ estado: serializarJogo(jogo), erro: null });
    } catch (e) {
      set({ erro: e instanceof Error ? e.message : 'Erro ao encerrar era.' });
    }
  },

  limparErro() {
    set({ erro: null });
  },
}));
