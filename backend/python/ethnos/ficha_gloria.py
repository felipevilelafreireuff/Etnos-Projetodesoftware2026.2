class FichaGloria:
    """
    Representa um Glory Token (RF02).
    Cada Reino recebe 3 fichas nos espaços I, II e III em ordem crescente.
    """

    def __init__(self, valor: int, espaco: int) -> None:
        self.valor: int = valor
        self.espaco: int = espaco  # 1, 2 ou 3 (espaços I, II, III)
        self.atribuida: bool = False

    def __repr__(self) -> str:
        return f"FichaGloria(espaco={self.espaco}, valor={self.valor})"
