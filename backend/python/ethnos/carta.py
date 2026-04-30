from __future__ import annotations
from .enums import CorReino
from .tribo import Tribo


class Carta:
    """
    Representa uma carta do jogo.
    Cada carta pertence a uma Tribo e a uma Região (cor).
    Cartas de Dragão são tratadas separadamente (RF11, RF13).
    """

    def __init__(
        self,
        id: int,
        tribo: Tribo,
        cor_reino: CorReino,
        eh_dragao: bool = False,
    ) -> None:
        self.id: int = id
        self.tribo: Tribo = tribo
        self.cor_reino: CorReino = cor_reino
        self.eh_dragao: bool = eh_dragao

    def get_tribo(self) -> Tribo:
        return self.tribo

    def __repr__(self) -> str:
        if self.eh_dragao:
            return "Carta(Dragão)"
        return f"Carta(id={self.id}, tribo={self.tribo.nome.value}, cor={self.cor_reino.value})"
