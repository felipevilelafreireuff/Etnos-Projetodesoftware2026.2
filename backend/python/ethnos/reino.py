from __future__ import annotations
from typing import TYPE_CHECKING
from collections import Counter

from .enums import CorReino
from .ficha_gloria import FichaGloria
from .marcador_controle import MarcadorControle

if TYPE_CHECKING:
    from .jogador import Jogador


class Reino:
    """
    Representa uma das 6 Regiões do tabuleiro (RF01, RF02).

    Controle: quem tiver mais MarcadorControle neste reino é o controlador.
    FichaGloria: 3 fichas por reino, entregues em ordem crescente (RF02).
    """

    def __init__(self, cor: CorReino, fichas_gloria: list[FichaGloria]) -> None:
        self.cor: CorReino = cor
        self.fichas_gloria: list[FichaGloria] = sorted(fichas_gloria, key=lambda f: f.espaco)
        self.marcadores: list[MarcadorControle] = []

    # RF18 — condição para adicionar marcador
    def pode_adicionar_marcador(self, tamanho_bando: int) -> bool:
        return tamanho_bando > self.contar_marcadores()

    def adicionar_marcador(self, marcador: MarcadorControle) -> None:
        self.marcadores.append(marcador)

    def contar_marcadores(self) -> int:
        return len(self.marcadores)

    def contar_marcadores_jogador(self, jogador: "Jogador") -> int:
        return sum(1 for m in self.marcadores if m.jogador is jogador)

    def calcular_controle(self) -> "Jogador | None":
        """Retorna o jogador com mais marcadores neste reino. None se vazio."""
        if not self.marcadores:
            return None
        contagem = Counter(m.jogador for m in self.marcadores)
        mais_alto = contagem.most_common(1)[0]
        return mais_alto[0]

    def proxima_ficha_gloria(self) -> FichaGloria | None:
        for ficha in self.fichas_gloria:
            if not ficha.atribuida:
                return ficha
        return None

    def __repr__(self) -> str:
        return (
            f"Reino({self.cor.value}, "
            f"marcadores={self.contar_marcadores()})"
        )
