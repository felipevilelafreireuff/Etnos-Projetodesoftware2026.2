from enum import Enum, auto


class EstadoJogo(Enum):
    CONFIGURACAO = auto()
    EM_ANDAMENTO = auto()
    FIM_DE_ERA = auto()
    FINALIZADO = auto()


class CorReino(Enum):
    VERMELHO = "Vermelho"
    AZUL = "Azul"
    VERDE = "Verde"
    AMARELO = "Amarelo"
    ROXO = "Roxo"
    LARANJA = "Laranja"


class NomeTribo(Enum):
    # As 4 tribos fixas do jogo (RF04)
    TRIBO_1 = "Tribo 1"
    TRIBO_2 = "Tribo 2"
    TRIBO_3 = "Tribo 3"
    TRIBO_4 = "Tribo 4"
    DRAGAO = "Dragão"


class FonteRecrutamento(Enum):
    DECK = "deck"
    VISIVEIS = "visiveis"
