export type CorReino = 'VERMELHO' | 'AZUL' | 'VERDE' | 'AMARELO' | 'ROXO' | 'LARANJA';
export type NomeTribo = 'TRIBO_1' | 'TRIBO_2' | 'TRIBO_3' | 'TRIBO_4' | 'DRAGAO';
export type FonteRecrutamento = 'deck' | 'visiveis';
export type EstadoJogo = 'CONFIGURACAO' | 'EM_ANDAMENTO' | 'FIM_DE_ERA' | 'FINALIZADO';

export interface Carta {
  id:        number;
  tribo:     NomeTribo;
  cor_reino: CorReino;
  eh_dragao: boolean;
}

export interface Jogador {
  id:                     number;
  nome:                   string;
  cor:                    CorReino;
  pontos_gloria:          number;
  mao:                    Carta[];
  marcadores_disponiveis: number;
}

export interface Reino {
  cor:                    CorReino;
  marcadores_por_jogador: Record<string, number>;
  fichas_gloria:          number[];
  total_marcadores:       number;
}

export interface EstadoPartida {
  estado:             EstadoJogo;
  era_atual:          number;
  turno_atual:        number;
  dragoes_revelados:  number;
  jogador_atual_id:   number;
  jogadores:          Jogador[];
  reinos:             Reino[];
  cartas_visiveis:    Carta[];
  total_cartas_deck:  number;
  vencedor:           string | null;
}

export interface IniciarPartidaPayload {
  nomes: string[];
}

export interface RecrutarPayload {
  fonte:       FonteRecrutamento;
  idx_visivel?: number;
}

export interface JogarBandoPayload {
  carta_ids:         number[];
  lider_id:          number;
  adicionar_marcador: boolean;
}
