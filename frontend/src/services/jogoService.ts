import { useJogoStore } from '@/src/store/jogoStore';
import { FonteRecrutamento } from '../../../backend/ts/enums';
import type {
  EstadoPartida,
  IniciarPartidaPayload,
  RecrutarPayload,
  JogarBandoPayload,
} from '@/src/types/jogo';

/**
 * Wrapper síncrono em torno do Zustand store.
 * Mantém a mesma assinatura de antes (retorna Promise<EstadoPartida>)
 * para compatibilidade com os hooks existentes.
 */
export const jogoService = {
  iniciarPartida(payload: IniciarPartidaPayload): Promise<EstadoPartida> {
    useJogoStore.getState().iniciarPartida(payload.nomes);
    return resolverEstado();
  },

  getEstado(): Promise<EstadoPartida> {
    return resolverEstado();
  },

  recrutarAliado(payload: RecrutarPayload): Promise<EstadoPartida> {
    const fonte = payload.fonte === 'deck' ? FonteRecrutamento.DECK : FonteRecrutamento.VISIVEIS;
    useJogoStore.getState().recrutar(fonte, payload.idx_visivel);
    return resolverEstado();
  },

  jogarBando(payload: JogarBandoPayload): Promise<EstadoPartida> {
    useJogoStore.getState().jogarBando(
      payload.carta_ids,
      payload.lider_id,
      payload.adicionar_marcador,
    );
    return resolverEstado();
  },

  proximoTurno(): Promise<EstadoPartida> {
    useJogoStore.getState().proximoTurno();
    return resolverEstado();
  },

  encerrarEra(): Promise<EstadoPartida> {
    useJogoStore.getState().encerrarEra();
    return resolverEstado();
  },
};

function resolverEstado(): Promise<EstadoPartida> {
  const { estado, erro } = useJogoStore.getState();
  if (erro) return Promise.reject(new Error(erro));
  if (!estado) return Promise.reject(new Error('Partida não iniciada.'));
  return Promise.resolve(estado);
}
