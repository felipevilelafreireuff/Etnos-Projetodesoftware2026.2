from __future__ import annotations
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class CorReino(str, Enum):
    VERMELHO = "VERMELHO"
    AZUL     = "AZUL"
    VERDE    = "VERDE"
    AMARELO  = "AMARELO"
    ROXO     = "ROXO"
    LARANJA  = "LARANJA"


class NomeTribo(str, Enum):
    TRIBO_1 = "TRIBO_1"
    TRIBO_2 = "TRIBO_2"
    TRIBO_3 = "TRIBO_3"
    TRIBO_4 = "TRIBO_4"
    DRAGAO  = "DRAGAO"


class FonteRecrutamento(str, Enum):
    DECK     = "deck"
    VISIVEIS = "visiveis"


class EstadoJogo(str, Enum):
    CONFIGURACAO = "CONFIGURACAO"
    EM_ANDAMENTO = "EM_ANDAMENTO"
    FIM_DE_ERA   = "FIM_DE_ERA"
    FINALIZADO   = "FINALIZADO"


class CartaSchema(BaseModel):
    id:        int
    tribo:     NomeTribo
    cor_reino: CorReino
    eh_dragao: bool


class JogadorSchema(BaseModel):
    id:                     int
    nome:                   str
    cor:                    CorReino
    pontos_gloria:          int
    mao:                    list[CartaSchema]
    marcadores_disponiveis: int


class ReinoSchema(BaseModel):
    cor:                    CorReino
    marcadores_por_jogador: dict[str, int]
    fichas_gloria:          list[int]
    total_marcadores:       int


class EstadoPartidaSchema(BaseModel):
    estado:             EstadoJogo
    era_atual:          int
    turno_atual:        int
    dragoes_revelados:  int
    jogador_atual_id:   int
    jogadores:          list[JogadorSchema]
    reinos:             list[ReinoSchema]
    cartas_visiveis:    list[CartaSchema]
    total_cartas_deck:  int
    vencedor:           Optional[str] = None


class IniciarPartidaRequest(BaseModel):
    nomes: list[str]


class RecrutarRequest(BaseModel):
    fonte:       FonteRecrutamento
    idx_visivel: Optional[int] = None


class JogarBandoRequest(BaseModel):
    carta_ids:         list[int]
    lider_id:          int
    adicionar_marcador: bool = True
