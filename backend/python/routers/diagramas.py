from fastapi import APIRouter
from backend.diagram_generator import (
    get_diagrama_classes,
    get_diagrama_sequencia,
    get_diagrama_comunicacao,
    get_diagrama_jogar_bando,
    get_codigo_jogar_bando,
)

router = APIRouter()


@router.get("/classes")
def diagrama_classes():
    return {"mermaid": get_diagrama_classes()}


@router.get("/sequencia")
def diagrama_sequencia():
    return {"mermaid": get_diagrama_sequencia()}


@router.get("/comunicacao")
def diagrama_comunicacao():
    return {"mermaid": get_diagrama_comunicacao()}


@router.get("/jogar-bando")
def diagrama_jogar_bando():
    return {"mermaid": get_diagrama_jogar_bando()}


@router.get("/jogar-bando/codigo")
def codigo_jogar_bando():
    return {"codigo": get_codigo_jogar_bando()}
