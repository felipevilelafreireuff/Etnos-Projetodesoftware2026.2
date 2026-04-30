from __future__ import annotations
from .carta import Carta


class CartasVisiveis:
    """
    Área compartilhada de cartas que todos os jogadores podem recrutar (RF10).

    Recebe cartas descartadas da mão (RF16) e dragões revelados do deck (RF11).
    É esvaziada ao fim de cada era (RF20).
    """

    def __init__(self) -> None:
        self._cartas: list[Carta] = []

    def adicionar(self, carta: Carta) -> None:
        self._cartas.append(carta)

    def adicionar_varias(self, cartas: list[Carta]) -> None:
        self._cartas.extend(cartas)

    def retirar(self, idx: int) -> Carta:
        if idx < 0 or idx >= len(self._cartas):
            raise ValueError("Índice inválido para cartas visíveis.")
        return self._cartas.pop(idx)

    def limpar(self) -> None:
        self._cartas.clear()

    def __len__(self) -> int:
        return len(self._cartas)

    def __iter__(self):
        return iter(self._cartas)

    def __repr__(self) -> str:
        return f"CartasVisiveis({len(self._cartas)} cartas)"
