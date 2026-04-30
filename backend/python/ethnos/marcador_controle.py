from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .jogador import Jogador
    from .reino import Reino


class MarcadorControle:
    """Ficha de controle de um jogador posicionada em um Reino."""

    def __init__(self, jogador: "Jogador", reino: "Reino") -> None:
        self.jogador: "Jogador" = jogador
        self.reino: "Reino" = reino

    def __repr__(self) -> str:
        return f"MarcadorControle(jogador={self.jogador.nome}, reino={self.reino.cor.value})"
