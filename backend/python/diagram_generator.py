DIAGRAMA_CLASSES = """classDiagram
  class EstadoJogo {
    <<enumeration>>
    CONFIGURACAO
    EM_ANDAMENTO
    FIM_DE_ERA
    FINALIZADO
  }
  class CorReino {
    <<enumeration>>
    VERMELHO
    AZUL
    VERDE
    AMARELO
    ROXO
    LARANJA
  }
  class NomeTribo {
    <<enumeration>>
    TRIBO_1
    TRIBO_2
    TRIBO_3
    TRIBO_4
    DRAGAO
  }
  class FonteRecrutamento {
    <<enumeration>>
    DECK
    VISIVEIS
  }
  class Habilidade {
    <<interface>>
    +executar(jogador, jogo, bando)*
  }
  class HabilidadeNula {
    +executar(jogador, jogo, bando)
  }
  class Tribo {
    +nome : NomeTribo
    +habilidade : Habilidade
  }
  class FichaGloria {
    +valor : int
    +espaco : int
    +atribuida : bool
  }
  class MarcadorControle {
    +jogador : Jogador
    +reino : Reino
  }
  class Carta {
    +id : int
    +tribo : Tribo
    +cor_reino : CorReino
    +eh_dragao : bool
  }
  class Bando {
    +cartas : list[Carta]
    +lider : Carta
    +calcular_tamanho() int
    +validar_bando() bool
    +calcular_pontuacao() int
    +get_cor_lider() CorReino
  }
  class Deck {
    +cartas : list[Carta]
    +embaralhar()
    +comprar() Carta
    +devolver_cartas(cartas)
    +adicionar_ao_fundo(cartas)
  }
  class Reino {
    +cor : CorReino
    +fichas_gloria : list[FichaGloria]
    +marcadores : list[MarcadorControle]
    +pode_adicionar_marcador(tamanho) bool
    +adicionar_marcador(marcador)
    +contar_marcadores() int
    +calcular_controle() Jogador
    +proxima_ficha_gloria() FichaGloria
  }
  class Jogador {
    +id : int
    +nome : str
    +cor : CorReino
    +pontos_gloria : int
    +mao : list[Carta]
    +marcadores_disponiveis : list[MarcadorControle]
    +mao_cheia() bool
    +receber_carta(carta)
    +descartar_mao(visiveis)
    +receber_pontos(pontos)
    +posicionar_marcador(reino)
    +contar_marcadores_no_tabuleiro(reinos) int
  }
  class Jogo {
    +deck : Deck
    +cartas_visiveis : list[Carta]
    +jogadores : list[Jogador]
    +reinos : list[Reino]
    +estado : EstadoJogo
    +era_atual : int
    +dragoes_revelados : int
    +configurar_partida(jogadores, deck, reinos)
    +iniciar_era()
    +recrutar_aliado(jogador, fonte, idx) Carta
    +jogar_bando(jogador, bando, marcador)
    +encerrar_era()
    +declarar_vencedor() Jogador
    +jogador_atual() Jogador
    +proximo_turno()
  }
  class FabricaJogo {
    +montar(nomes)$ Jogo
  }

  Habilidade <|.. HabilidadeNula
  Tribo --> NomeTribo
  Tribo --> Habilidade
  Carta --> Tribo
  Carta --> CorReino
  Bando "1" --> "1..*" Carta
  Deck "1" --> "*" Carta
  Reino --> CorReino
  Reino "1" --> "3" FichaGloria
  Reino "1" --> "*" MarcadorControle
  MarcadorControle --> Jogador
  MarcadorControle --> Reino
  Jogador --> CorReino
  Jogador "1" --> "*" Carta
  Jogador "1" --> "*" MarcadorControle
  Jogo --> EstadoJogo
  Jogo "1" --> "1" Deck
  Jogo "1" --> "*" Carta
  Jogo "1" --> "4..6" Jogador
  Jogo "1" --> "6" Reino
  FabricaJogo ..> Jogo
"""

DIAGRAMA_SEQUENCIA = """sequenceDiagram
  actor Jogador
  participant Frontend
  participant FastAPI
  participant Jogo
  participant Bando
  participant Carta
  participant Tribo
  participant Habilidade
  participant Reino

  note over Jogador,Reino: Fluxo: Jogar Bando (RF14–RF19)

  Jogador->>Frontend: Seleciona cartas + define Líder
  Frontend->>FastAPI: POST /partida/jogar-bando {carta_ids, lider_id}
  FastAPI->>Jogo: jogar_bando(jogador, bando, adicionar_marcador)

  Jogo->>Bando: validar_bando()
  note right of Bando: RF14 — mesma tribo OU mesma cor
  Bando-->>Jogo: true / false
  alt Bando inválido
    Jogo-->>FastAPI: ValueError (RF14)
    FastAPI-->>Frontend: 422 Unprocessable Entity
  end

  Jogo->>Bando: calcular_pontuacao()
  note right of Bando: RF17 — 0/3/6 pts por tamanho
  Bando-->>Jogo: pontos

  Jogo->>Jogador: receber_pontos(pontos)

  note over Jogo,Habilidade: RF15 — cadeia de mensagens para aplicar habilidade do líder
  Jogo->>Bando: get_lider()
  Bando-->>Jogo: Carta (líder)
  Jogo->>Carta: get_tribo()
  Carta-->>Jogo: Tribo
  Jogo->>Tribo: aplicar_habilidade(jogador, jogo, bando)
  Tribo->>Habilidade: executar(jogador, jogo, bando)
  Habilidade-->>Tribo: (efeito aplicado)

  alt adicionar_marcador = true (RF18)
    Jogo->>Reino: pode_adicionar_marcador(tamanho_bando)
    note right of Reino: RF18 — tamanho > fichas existentes
    Reino-->>Jogo: true / false
    alt Pode adicionar
      Jogo->>Jogador: posicionar_marcador(reino)
    end
  end

  Jogo->>Jogador: descartar_mao(cartas_visiveis)
  note right of Jogador: RF16 — descarta mão restante

  FastAPI-->>Frontend: EstadoPartida atualizado
  Frontend-->>Jogador: Tabuleiro e pontos atualizados
"""

DIAGRAMA_COMUNICACAO = """graph TB
  subgraph Frontend["Frontend — Next.js"]
    UI["Interface do Usuário"]
    Hook["useJogoScreen"]
    Service["jogoService"]
  end

  subgraph Backend["Backend — FastAPI"]
    Router["routers/partida.py"]
    Serializer["serializer.py"]
    State["game_state.py"]
  end

  subgraph Dominio["Domínio — Python"]
    Jogo["Jogo"]
    Jogador["Jogador"]
    Deck["Deck"]
    Bando["Bando"]
    Reino["Reino"]
  end

  UI -->|"ação do usuário"| Hook
  Hook -->|"chama service"| Service
  Service -->|"HTTP POST/GET"| Router
  Router -->|"get_jogo()"| State
  State -->|"instância"| Jogo
  Router -->|"serializar_jogo()"| Serializer
  Serializer -->|"JSON"| Router
  Router -->|"EstadoPartida"| Service
  Service -->|"dados"| Hook
  Hook -->|"estado"| UI

  Jogo -->|"gerencia"| Jogador
  Jogo -->|"gerencia"| Deck
  Jogo -->|"valida"| Bando
  Jogo -->|"controla"| Reino
"""


DIAGRAMA_JOGAR_BANDO = """sequenceDiagram
  participant Origem as ●
  participant Jogador as :Jogador
  participant Jogo as :Jogo
  participant Bando as :Bando
  participant Carta as :Carta
  participant Tribo as :Tribo
  participant Reino as :Reino
  participant Marcador as :MarcadorControle

  Origem->>+Jogador: jogar_bando(bando)

  Jogador->>+Bando: validar_bando()
  Bando-->>-Jogador: bool

  alt bando válido
    loop para cada carta no bando
      Jogador->>+Jogador: mao.remove(carta)
      deactivate Jogador
    end

    Jogador->>+Jogo: processar_bando(bando)

    Jogo->>+Bando: get_lider()
    Bando-->>-Jogo: :Carta

    Jogo->>+Carta: get_tribo()
    Carta-->>-Jogo: :Tribo

    Jogo->>+Tribo: aplicar_habilidade(jogador, jogo, bando)
    deactivate Tribo

    Jogo->>+Bando: calcular_pontuacao()
    Bando-->>-Jogo: int (pontos)

    Jogo->>Jogador: receber_pontos(pontos)

    Jogo->>+Bando: get_cor_lider()
    Bando-->>-Jogo: CorReino

    Jogo->>+Jogo: get_reino(cor)
    deactivate Jogo

    Jogo->>+Reino: pode_adicionar_marcador(tamanho_bando)
    Reino-->>-Jogo: bool

    opt pode adicionar marcador
      Jogo->>+Jogador: posicionar_marcador(reino)
      Jogador->>+Marcador: <<create>>
      Marcador-->>-Jogador: :MarcadorControle
      Jogador->>+Reino: adicionar_marcador(marcador)
      deactivate Reino
      deactivate Jogador
    end

    Jogo->>Jogador: descartar_mao(cartas_visiveis)

    deactivate Jogo

    Jogador->>+Jogo: proximo_turno()
    deactivate Jogo
  else bando inválido
    activate Bando
    Bando-->>-Jogador: ValueError
  end

  deactivate Jogador
"""


CODIGO_JOGAR_BANDO = """\
class Jogador:
    def jogar_bando(self, bando: Bando, jogo: Jogo) -> None:
        if not bando.validar_bando():
            raise ValueError("Bando inválido (RF14).")
        for carta in bando.cartas:
            self.mao.remove(carta)
        jogo.processar_bando(self, bando)

    def receber_pontos(self, pontos: int) -> None:
        self.pontos_gloria += pontos

    def posicionar_marcador(self, reino: Reino) -> MarcadorControle | None:
        if not self.marcadores_disponiveis:
            return None
        marcador = self.marcadores_disponiveis.pop()
        marcador.reino = reino
        reino.adicionar_marcador(marcador)
        return marcador


class Bando:
    cartas: list[Carta]
    lider: Carta
    TABELA_PONTUACAO = {1: 0, 2: 0, 3: 3, 4: 3}
    PONTUACAO_ACIMA_4 = 6

    def validar_bando(self) -> bool:
        if not self.cartas:
            return False
        if self.lider not in self.cartas:
            return False
        todas_mesma_tribo = len({c.tribo.nome for c in self.cartas}) == 1
        todas_mesma_cor   = len({c.cor_reino  for c in self.cartas}) == 1
        return todas_mesma_tribo or todas_mesma_cor

    def calcular_pontuacao(self) -> int:
        tamanho = self.calcular_tamanho()
        if tamanho > 4:
            return self.PONTUACAO_ACIMA_4
        return self.TABELA_PONTUACAO.get(tamanho, 0)


class Tribo:
    def aplicar_habilidade(self, jogador: Jogador, jogo: Jogo, bando: Bando) -> None:
        self.habilidade.executar(jogador, jogo, bando)


class Reino:
    def pode_adicionar_marcador(self, tamanho_bando: int) -> bool:
        return tamanho_bando > self.contar_marcadores()

    def adicionar_marcador(self, marcador: MarcadorControle) -> None:
        self.marcadores.append(marcador)


class CartasVisiveis:
    def adicionar_varias(self, cartas: list[Carta]) -> None:
        self.cartas.extend(cartas)


class Jogador:
    def descartar_mao(self, cartas_visiveis: CartasVisiveis) -> None:
        cartas_visiveis.adicionar_varias(self.mao)
        self.mao = []


class Jogo:
    def processar_bando(self, jogador: Jogador, bando: Bando) -> None:
        lider = bando.get_lider()
        tribo = lider.get_tribo()
        tribo.aplicar_habilidade(jogador, self, bando)

        pontos = bando.calcular_pontuacao()
        jogador.receber_pontos(pontos)

        reino = self.get_reino(bando.get_cor_lider())
        if reino and reino.pode_adicionar_marcador(bando.calcular_tamanho()):
            jogador.posicionar_marcador(reino)

        jogador.descartar_mao(self.cartas_visiveis)

    def proximo_turno(self) -> None:
        self._idx_jogador_atual = (self._idx_jogador_atual + 1) % len(self.jogadores)
        self.turno_atual += 1
"""


def get_codigo_jogar_bando() -> str:
    return CODIGO_JOGAR_BANDO


def get_diagrama_classes() -> str:
    return DIAGRAMA_CLASSES


def get_diagrama_sequencia() -> str:
    return DIAGRAMA_SEQUENCIA


def get_diagrama_comunicacao() -> str:
    return DIAGRAMA_COMUNICACAO


def get_diagrama_jogar_bando() -> str:
    return DIAGRAMA_JOGAR_BANDO
