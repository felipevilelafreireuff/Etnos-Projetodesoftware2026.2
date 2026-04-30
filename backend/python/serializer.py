from backend.ethnos.jogo import Jogo
from backend.ethnos.carta import Carta
from backend.ethnos.jogador import Jogador
from backend.ethnos.reino import Reino
from backend.ethnos.enums import NomeTribo

from .schemas import (
    CartaSchema,
    JogadorSchema,
    ReinoSchema,
    EstadoPartidaSchema,
)


def serializar_carta(carta: Carta) -> CartaSchema:
    tribo_nome = carta.tribo.nome.name if not carta.eh_dragao else NomeTribo.DRAGAO.name
    return CartaSchema(
        id=carta.id,
        tribo=tribo_nome,
        cor_reino=carta.cor_reino.name,
        eh_dragao=carta.eh_dragao,
    )


def serializar_jogador(jogador: Jogador) -> JogadorSchema:
    return JogadorSchema(
        id=jogador.id,
        nome=jogador.nome,
        cor=jogador.cor.name,
        pontos_gloria=jogador.pontos_gloria,
        mao=[serializar_carta(c) for c in jogador.mao],
        marcadores_disponiveis=len(jogador.marcadores_disponiveis),
    )


def serializar_reino(reino: Reino) -> ReinoSchema:
    marcadores_por_jogador: dict[str, int] = {}
    for marcador in reino.marcadores:
        jid = str(marcador.jogador.id)
        marcadores_por_jogador[jid] = marcadores_por_jogador.get(jid, 0) + 1

    fichas = [f.valor for f in reino.fichas_gloria]

    return ReinoSchema(
        cor=reino.cor.name,
        marcadores_por_jogador=marcadores_por_jogador,
        fichas_gloria=fichas,
        total_marcadores=len(reino.marcadores),
    )


def serializar_jogo(jogo: Jogo) -> EstadoPartidaSchema:
    vencedor = None
    if jogo.estado.name == "FINALIZADO":
        vencedor = jogo.declarar_vencedor().nome

    return EstadoPartidaSchema(
        estado=jogo.estado.name,
        era_atual=jogo.era_atual,
        turno_atual=jogo.turno_atual,
        dragoes_revelados=jogo.dragoes_revelados,
        jogador_atual_id=jogo.jogador_atual().id,
        jogadores=[serializar_jogador(j) for j in jogo.jogadores],
        reinos=[serializar_reino(r) for r in jogo.reinos],
        cartas_visiveis=[serializar_carta(c) for c in jogo.cartas_visiveis],
        total_cartas_deck=jogo.deck.tamanho(),
        vencedor=vencedor,
    )
