from __future__ import annotations
import random
from .carta import Carta


class Deck:
    """
    Baralho principal do jogo.

    RF07 — os 3 Dragões são embaralhados e adicionados ao deck
    depois que as cartas iniciais são distribuídas, garantindo
    que fiquem na segunda metade.
    """

    def __init__(self, cartas: list[Carta] | None = None) -> None:
        self.cartas: list[Carta] = cartas if cartas else []

    def embaralhar(self) -> None:
        random.shuffle(self.cartas)

    def comprar(self) -> Carta | None:
        if not self.cartas:
            return None
        return self.cartas.pop(0)

    def adicionar_ao_fundo(self, cartas: list[Carta]) -> None:
        self.cartas.extend(cartas)

    def adicionar_ao_topo(self, cartas: list[Carta]) -> None:
        self.cartas = cartas + self.cartas

    def devolver_cartas(self, cartas: list[Carta]) -> None:
        """RF20 — devolve cartas da mão dos jogadores ao baralho no fim de era."""
        self.cartas.extend(cartas)
        self.embaralhar()

    def esta_vazio(self) -> bool:
        return len(self.cartas) == 0

    def tamanho(self) -> int:
        return len(self.cartas)

    def __repr__(self) -> str:
        return f"Deck({self.tamanho()} cartas)"
