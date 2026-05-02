from __future__ import annotations
from typing import TYPE_CHECKING

from .carta import Carta
from .cartas_visiveis import CartasVisiveis
from .deck import Deck
from .enums import CorReino
from .marcador_controle import MarcadorControle

if TYPE_CHECKING:
    from .jogo import Jogo
    from .bando import Bando
    from .reino import Reino


LIMITE_MAO = 10  # RF12


class Jogador:
    """
    Representa um jogador humano (RF03, RNF01).

    Responsabilidades:
      - Manter sua mão de cartas
      - Possuir marcadores de controle disponíveis
      - Acumular pontos de glória
    """

    def __init__(self, id: int, nome: str, cor: CorReino, total_marcadores: int = 12) -> None:
        self.id: int = id
        self.nome: str = nome
        self.cor: CorReino = cor
        self.pontos_gloria: int = 0
        self.mao: list[Carta] = []
        self.marcadores_disponiveis: list[MarcadorControle] = []
        self._total_marcadores = total_marcadores

    # RF12 — verificar se mão está cheia
    def mao_cheia(self) -> bool:
        return len(self.mao) >= LIMITE_MAO

    # RF10 — o jogador recruta: busca do deck; quem decide se entra na mão é o Jogo
    def recrutar(self, deck: Deck) -> Carta | None:
        return deck.comprar()

    # RF14 — ação do jogador: valida, remove da mão e delega ao Jogo
    def jogar_bando(self, bando: "Bando", jogo: "Jogo") -> None:
        if not bando.validar_bando():
            raise ValueError("Bando inválido: cartas devem ser da mesma tribo ou mesma região.")
        for carta in bando.cartas:
            self.mao.remove(carta)
        jogo.processar_bando(self, bando)

    def receber_carta(self, carta: Carta) -> None:
        self.mao.append(carta)

    # RF16 — descarta toda a mão para as cartas visíveis
    def descartar_mao(self, cartas_visiveis: CartasVisiveis) -> None:
        cartas_visiveis.adicionar_varias(self.mao)
        self.mao = []

    # RF17 — recebe pontos de glória
    def receber_pontos(self, pontos: int) -> None:
        self.pontos_gloria += pontos

    # RF18 — consome um marcador disponível para posicionar no reino
    def posicionar_marcador(self, reino: "Reino") -> MarcadorControle | None:
        if not self.marcadores_disponiveis:
            return None
        marcador = self.marcadores_disponiveis.pop()
        marcador.reino = reino
        reino.adicionar_marcador(marcador)
        return marcador

    def inicializar_marcadores(self) -> None:
        from .reino import Reino
        self.marcadores_disponiveis = [
            MarcadorControle(jogador=self, reino=None)  # type: ignore[arg-type]
            for _ in range(self._total_marcadores)
        ]

    def contar_marcadores_no_tabuleiro(self, reinos: list["Reino"]) -> int:
        """RF24 — critério de desempate."""
        return sum(reino.contar_marcadores_jogador(self) for reino in reinos)

    def __repr__(self) -> str:
        return (
            f"Jogador({self.nome}, cor={self.cor.value}, "
            f"pontos={self.pontos_gloria}, mao={len(self.mao)} cartas)"
        )
