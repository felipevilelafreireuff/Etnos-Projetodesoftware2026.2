from __future__ import annotations
from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .jogador import Jogador
    from .jogo import Jogo
    from .bando import Bando


class Habilidade(ABC):
    """Interface base para habilidades de tribo (RF15)."""

    @abstractmethod
    def executar(self, jogador: "Jogador", jogo: "Jogo", bando: "Bando") -> None:
        pass


class HabilidadeNula(Habilidade):
    """Habilidade padrão para tribos sem efeito especial definido."""

    def executar(self, jogador: "Jogador", jogo: "Jogo", bando: "Bando") -> None:
        pass
