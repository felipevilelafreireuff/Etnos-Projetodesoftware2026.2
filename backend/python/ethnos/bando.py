from __future__ import annotations
from typing import TYPE_CHECKING

from .carta import Carta
from .enums import CorReino

if TYPE_CHECKING:
    pass


class Bando:
    """
    Conjunto de cartas jogadas por um jogador (RF14, RF15).

    Regras de validade (RF14):
      - Todas as cartas são da mesma Tribo, OU
      - Todas as cartas são da mesma Região (cor)

    Pontuação por tamanho (RF17):
      1–2 cartas  → 0 pontos
      3–4 cartas  → 3 pontos
      5+ cartas   → 6 pontos
    """

    TABELA_PONTUACAO = {1: 0, 2: 0, 3: 3, 4: 3}
    PONTUACAO_ACIMA_4 = 6

    def __init__(self, cartas: list[Carta], lider: Carta) -> None:
        self.cartas: list[Carta] = cartas
        self.lider: Carta = lider

    def calcular_tamanho(self) -> int:
        return len(self.cartas)

    def validar_bando(self) -> bool:
        if not self.cartas:
            return False
        if self.lider not in self.cartas:
            return False

        todas_mesma_tribo = len({c.tribo.nome for c in self.cartas}) == 1
        todas_mesma_cor = len({c.cor_reino for c in self.cartas}) == 1

        return todas_mesma_tribo or todas_mesma_cor

    def calcular_pontuacao(self) -> int:
        tamanho = self.calcular_tamanho()
        if tamanho > 4:
            return self.PONTUACAO_ACIMA_4
        return self.TABELA_PONTUACAO.get(tamanho, 0)

    def get_lider(self) -> Carta:
        return self.lider

    def get_cor_lider(self) -> CorReino:
        return self.lider.cor_reino

    def __repr__(self) -> str:
        return (
            f"Bando(tamanho={self.calcular_tamanho()}, "
            f"lider={self.lider}, "
            f"pontos={self.calcular_pontuacao()})"
        )
