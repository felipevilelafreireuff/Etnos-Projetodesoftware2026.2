from backend.ethnos.jogo import Jogo

_jogo: Jogo | None = None


def get_jogo() -> Jogo:
    global _jogo
    if _jogo is None:
        raise RuntimeError("Partida não iniciada. Chame POST /partida/iniciar primeiro.")
    return _jogo


def set_jogo(jogo: Jogo) -> None:
    global _jogo
    _jogo = jogo


def reset_jogo() -> None:
    global _jogo
    _jogo = None
