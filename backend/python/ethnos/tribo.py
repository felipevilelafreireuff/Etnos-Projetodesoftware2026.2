from __future__ import annotations
from typing import TYPE_CHECKING
from .enums import NomeTribo
from .habilidade import Habilidade, HabilidadeNula

if TYPE_CHECKING:
    from .jogador import Jogador
    from .jogo import Jogo
    from .bando import Bando


class Tribo:
    """RF04 — 4 tribos fixas em todas as partidas."""

    def __init__(self, nome: NomeTribo, habilidade: Habilidade | None = None) -> None:
        self.nome: NomeTribo = nome
        self.habilidade: Habilidade = habilidade if habilidade else HabilidadeNula()

    def aplicar_habilidade(self, jogador: "Jogador", jogo: "Jogo", bando: "Bando") -> None:
        """RF15 — delega para a habilidade concreta da tribo."""
        self.habilidade.executar(jogador, jogo, bando)

    def __repr__(self) -> str:
        return f"Tribo({self.nome.value})"
