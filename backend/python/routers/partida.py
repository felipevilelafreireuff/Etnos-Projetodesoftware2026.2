from fastapi import APIRouter, HTTPException

from backend.ethnos.jogo import Jogo
from backend.ethnos.bando import Bando
from backend.ethnos.enums import FonteRecrutamento

from backend.schemas import (
    EstadoPartidaSchema,
    IniciarPartidaRequest,
    RecrutarRequest,
    JogarBandoRequest,
)
from backend.game_state import get_jogo, set_jogo, reset_jogo
from backend.serializer import serializar_jogo

router = APIRouter()


def _get_jogo_ou_404():
    try:
        return get_jogo()
    except RuntimeError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/iniciar", response_model=EstadoPartidaSchema)
def iniciar_partida(body: IniciarPartidaRequest):
    if not (4 <= len(body.nomes) <= 6):
        raise HTTPException(status_code=400, detail="O jogo requer entre 4 e 6 jogadores.")
    reset_jogo()
    jogo = Jogo.criar_partida(body.nomes)
    jogo.iniciar_era()
    set_jogo(jogo)
    return serializar_jogo(jogo)


@router.get("/estado", response_model=EstadoPartidaSchema)
def estado_partida():
    return serializar_jogo(_get_jogo_ou_404())


@router.post("/recrutar", response_model=EstadoPartidaSchema)
def recrutar_aliado(body: RecrutarRequest):
    jogo = _get_jogo_ou_404()
    jogador = jogo.jogador_atual()
    try:
        fonte = FonteRecrutamento.DECK if body.fonte == "deck" else FonteRecrutamento.VISIVEIS
        jogo.validar_recrutamento(jogador, fonte, body.idx_visivel)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return serializar_jogo(jogo)


@router.post("/jogar-bando", response_model=EstadoPartidaSchema)
def jogar_bando(body: JogarBandoRequest):
    jogo    = _get_jogo_ou_404()
    jogador = jogo.jogador_atual()

    cartas_por_id = {c.id: c for c in jogador.mao}
    cartas = [cartas_por_id[cid] for cid in body.carta_ids if cid in cartas_por_id]
    lider  = cartas_por_id.get(body.lider_id)

    if not lider or not cartas:
        raise HTTPException(status_code=422, detail="Cartas ou líder inválidos.")

    bando = Bando(cartas=cartas, lider=lider)
    try:
        jogador.jogar_bando(bando, jogo)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return serializar_jogo(jogo)


@router.post("/proximo-turno", response_model=EstadoPartidaSchema)
def proximo_turno():
    jogo = _get_jogo_ou_404()
    jogo.proximo_turno()
    return serializar_jogo(jogo)


@router.post("/encerrar-era", response_model=EstadoPartidaSchema)
def encerrar_era():
    jogo = _get_jogo_ou_404()
    jogo.encerrar_era()
    return serializar_jogo(jogo)
