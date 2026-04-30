from __future__ import annotations
import random

from .carta import Carta
from .cartas_visiveis import CartasVisiveis
from .deck import Deck
from .enums import CorReino, EstadoJogo, FonteRecrutamento, NomeTribo
from .ficha_gloria import FichaGloria
from .habilidade import HabilidadeNula
from .jogador import Jogador
from .reino import Reino
from .bando import Bando
from .marcador_controle import MarcadorControle
from .tribo import Tribo


TOTAL_ERAS = 3
TOTAL_DRAGOES = 3
TOTAL_REINOS = 6
FICHAS_POR_REINO = 3

_VALORES_FICHAS_GLORIA = list(range(1, 19))  # [1..18] — RF02
_CARTAS_POR_TRIBO = 12


class Jogo:
    """
    Controlador central do jogo EtNós.

    Gerencia o fluxo completo:
      Configuração → Era (início → loop de rodadas → fim) × 3 → Fim do jogo
    """

    def __init__(self) -> None:
        self.deck: Deck = Deck()
        self.cartas_visiveis: CartasVisiveis = CartasVisiveis()
        self.area_dragoes: list[Carta] = []

        self.jogadores: list[Jogador] = []
        self.reinos: list[Reino] = []

        self.estado: EstadoJogo = EstadoJogo.CONFIGURACAO
        self.era_atual: int = 0
        self.turno_atual: int = 0

        self.dragoes_revelados: int = 0
        self.jogador_revelou_dragao: Jogador | None = None

        self._idx_jogador_atual: int = 0
        self._jogadas_extras: int = 0  # RF21 — bônus de 2 jogadas no início de era

    # ------------------------------------------------------------------
    # RF01 / RF02 / RF03 — Configuração da partida
    # ------------------------------------------------------------------

    def configurar_partida(
        self,
        jogadores: list[Jogador],
        deck: Deck,
        reinos: list[Reino],
    ) -> None:
        if not (4 <= len(jogadores) <= 6):
            raise ValueError("O jogo requer entre 4 e 6 jogadores (RF01 / RNF01).")

        self.jogadores = jogadores
        self.deck = deck
        self.reinos = reinos

        for jogador in self.jogadores:
            jogador.inicializar_marcadores()

        self.estado = EstadoJogo.EM_ANDAMENTO

    # ------------------------------------------------------------------
    # RF05 / RF06 / RF07 / RF08 — Início de Era
    # ------------------------------------------------------------------

    def iniciar_era(self) -> None:
        self.era_atual += 1
        self.dragoes_revelados = 0
        self.turno_atual = 0

        # RF05 — cada jogador saca uma carta
        for jogador in self.jogadores:
            carta = self.deck.comprar()
            if carta:
                jogador.receber_carta(carta)

        # RF06 — revelar dobro do número de jogadores em cartas visíveis
        qtd_visiveis = len(self.jogadores) * 2
        for _ in range(qtd_visiveis):
            carta = self.deck.comprar()
            if carta:
                self.cartas_visiveis.adicionar(carta)

        # RF07 — embaralhar os 3 dragões e adicionar ao fundo do deck
        dragoes = self._criar_dragoes()
        random.shuffle(dragoes)
        self.deck.adicionar_ao_fundo(dragoes)

        # RF08 — na primeira era escolhe aleatório; a partir da segunda,
        # quem revelou o último dragão começa (com 2 jogadas — RF21)
        if self.era_atual == 1:
            self._idx_jogador_atual = random.randrange(len(self.jogadores))
        else:
            if self.jogador_revelou_dragao:
                self._idx_jogador_atual = self.jogadores.index(self.jogador_revelou_dragao)
            self._jogadas_extras = 2  # RF21

        self.jogador_revelou_dragao = None

    # ------------------------------------------------------------------
    # RF09 / RF10 / RF11 / RF12 / RF13 — Ações de turno
    # ------------------------------------------------------------------

    def validar_recrutamento(
        self,
        jogador: Jogador,
        fonte: FonteRecrutamento,
        idx_visivel: int | None = None,
    ) -> Carta | None:
        """
        RF12 — bloqueia se mão cheia.
        RF10 — delega a ação ao jogador (deck) ou retira das visíveis.
        RF11 — dragão do deck: revela e jogador recruta outra carta.
        RF13 — 3º dragão encerra a era.
        """
        if jogador.mao_cheia():
            raise ValueError(f"{jogador.nome} tem 10 cartas — deve jogar um bando (RF12).")

        if fonte == FonteRecrutamento.VISIVEIS:
            if idx_visivel is None or idx_visivel >= len(self.cartas_visiveis):
                raise ValueError("Índice inválido para cartas visíveis.")
            carta = self.cartas_visiveis.retirar(idx_visivel)
            jogador.receber_carta(carta)
            return carta

        # RF10 — é o jogador quem recruta do deck
        carta = jogador.recrutar(self.deck)
        if carta is None:
            return None

        if carta.eh_dragao:
            # RF11 — dragão não entra na mão, vai direto para a área
            self._revelar_dragao(carta, jogador)
            if self.estado == EstadoJogo.FIM_DE_ERA:
                return carta
            return self.validar_recrutamento(jogador, FonteRecrutamento.DECK)

        jogador.receber_carta(carta)
        return carta

    def processar_bando(
        self,
        jogador: Jogador,
        bando: Bando,
        adicionar_marcador: bool = True,
    ) -> None:
        """
        RF15 — aplica habilidade do líder.
        RF16 — descarta mão restante para cartas visíveis.
        RF17 — atribui pontos de glória.
        RF18 / RF19 — tenta adicionar marcador de controle.
        """
        # RF17 — pontuação
        pontos = bando.calcular_pontuacao()
        jogador.receber_pontos(pontos)

        # RF15 — habilidade do líder: Bando → Carta(lider) → Tribo → Habilidade
        lider = bando.get_lider()
        tribo = lider.get_tribo()
        tribo.aplicar_habilidade(jogador, self, bando)

        # RF18 / RF19 — marcador de controle
        if adicionar_marcador:
            reino = self.get_reino(bando.get_cor_lider())
            if reino and reino.pode_adicionar_marcador(bando.calcular_tamanho()):
                jogador.posicionar_marcador(reino)

        # RF16 — descarta mão restante para cartas visíveis
        jogador.descartar_mao(self.cartas_visiveis)

    # ------------------------------------------------------------------
    # RF20 / RF21 — Fim de Era
    # ------------------------------------------------------------------

    def encerrar_era(self) -> None:
        """RF20 — todos devolvem cartas ao baralho."""
        for jogador in self.jogadores:
            self.deck.devolver_cartas(jogador.mao)
            jogador.mao = []

        self.cartas_visiveis.limpar()
        self.area_dragoes = []

        if self.era_atual >= TOTAL_ERAS:
            self._encerrar_partida()
        else:
            self.estado = EstadoJogo.EM_ANDAMENTO
            self.iniciar_era()

    # ------------------------------------------------------------------
    # RF22 / RF23 / RF24 — Fim do jogo
    # ------------------------------------------------------------------

    def _encerrar_partida(self) -> None:
        self.estado = EstadoJogo.FINALIZADO

    def declarar_vencedor(self) -> Jogador:
        """RF23 — maior pontuação; RF24 — desempate por marcadores."""
        return max(
            self.jogadores,
            key=lambda j: (
                j.pontos_gloria,
                j.contar_marcadores_no_tabuleiro(self.reinos),
            ),
        )

    # ------------------------------------------------------------------
    # Controle de turno
    # ------------------------------------------------------------------

    def jogador_atual(self) -> Jogador:
        return self.jogadores[self._idx_jogador_atual]

    def proximo_turno(self) -> None:
        if self.estado != EstadoJogo.EM_ANDAMENTO:
            return

        # RF21 — jogadas extras para quem revelou o último dragão
        if self._jogadas_extras > 0:
            self._jogadas_extras -= 1
            return

        self._idx_jogador_atual = (self._idx_jogador_atual + 1) % len(self.jogadores)
        self.turno_atual += 1

    # ------------------------------------------------------------------
    # Helpers internos
    # ------------------------------------------------------------------

    def get_reino(self, cor: CorReino) -> Reino | None:
        return next((r for r in self.reinos if r.cor == cor), None)

    def _revelar_dragao(self, carta: Carta, jogador: Jogador) -> None:
        self.area_dragoes.append(carta)
        self.dragoes_revelados += 1
        self.jogador_revelou_dragao = jogador

        # RF13 — 3º dragão encerra a era imediatamente
        if self.dragoes_revelados >= TOTAL_DRAGOES:
            self.estado = EstadoJogo.FIM_DE_ERA

    def _criar_dragoes(self) -> list[Carta]:
        from .tribo import Tribo
        tribo_dragao = Tribo(NomeTribo.DRAGAO)
        return [
            Carta(
                id=1000 + i,
                tribo=tribo_dragao,
                cor_reino=list(CorReino)[0],
                eh_dragao=True,
            )
            for i in range(TOTAL_DRAGOES)
        ]

    # ------------------------------------------------------------------
    # Fábrica — monta um jogo padrão pronto para jogar
    # ------------------------------------------------------------------

    @staticmethod
    def criar_partida(nomes_jogadores: list[str]) -> "Jogo":
        """Monta uma partida completa do zero."""
        jogo = Jogo()
        reinos    = Jogo._montar_reinos()
        deck      = Jogo._montar_deck()
        jogadores = Jogo._montar_jogadores(nomes_jogadores)
        jogo.configurar_partida(jogadores, deck, reinos)
        return jogo

    @staticmethod
    def _montar_reinos() -> list[Reino]:
        """RF02 — embaralha fichas e distribui 3 por reino em ordem crescente."""
        fichas_pool = _VALORES_FICHAS_GLORIA.copy()
        random.shuffle(fichas_pool)
        reinos = []
        for i, cor in enumerate(CorReino):
            valores = sorted(fichas_pool[i * 3: i * 3 + 3])
            fichas = [FichaGloria(valor=valores[j], espaco=j + 1) for j in range(3)]
            reinos.append(Reino(cor=cor, fichas_gloria=fichas))
        return reinos

    @staticmethod
    def _montar_deck() -> Deck:
        """RF04 — 4 tribos fixas; cada tribo cobre todos os reinos."""
        tribos = [Tribo(nome, HabilidadeNula()) for nome in NomeTribo if nome != NomeTribo.DRAGAO]
        cartas: list[Carta] = []
        id_counter = 1
        for tribo in tribos:
            for cor in CorReino:
                for _ in range(_CARTAS_POR_TRIBO // len(list(CorReino))):
                    cartas.append(Carta(id=id_counter, tribo=tribo, cor_reino=cor))
                    id_counter += 1
        deck = Deck(cartas)
        deck.embaralhar()
        return deck

    @staticmethod
    def _montar_jogadores(nomes: list[str]) -> list[Jogador]:
        """RF03 — associa uma cor de reino aleatória a cada jogador."""
        cores = list(CorReino)
        random.shuffle(cores)
        return [Jogador(id=i + 1, nome=nome, cor=cores[i]) for i, nome in enumerate(nomes)]

    def __repr__(self) -> str:
        return (
            f"Jogo(era={self.era_atual}/{TOTAL_ERAS}, "
            f"turno={self.turno_atual}, "
            f"estado={self.estado.name}, "
            f"dragoes={self.dragoes_revelados}/{TOTAL_DRAGOES})"
        )
