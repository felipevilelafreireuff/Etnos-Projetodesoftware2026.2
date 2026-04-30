/** Diagrama de classes Mermaid do projeto EtNós. */
export const DIAGRAMA_CLASSES = `classDiagram
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
    <<abstract>>
    +executar(jogador, jogo, bando)* void
  }
  class HabilidadeNula {
    +executar(jogador, jogo, bando) void
  }
  class Tribo {
    +nome : NomeTribo
    +habilidade : Habilidade
    +aplicarHabilidade(jogador, jogo, bando) void
  }
  class FichaGloria {
    +valor : number
    +espaco : number
    +atribuida : boolean
  }
  class MarcadorControle {
    +jogador : Jogador
    +reino : Reino | null
  }
  class Carta {
    +id : number
    +tribo : Tribo
    +corReino : CorReino
    +ehDragao : boolean
    +getTribo() Tribo
  }
  class CartasVisiveis {
    +adicionar(carta) void
    +adicionarVarias(cartas) void
    +retirar(idx) Carta
    +limpar() void
    +length() number
    +toArray() Carta[]
  }
  class Bando {
    +cartas : Carta[]
    +lider : Carta
    +calcularTamanho() number
    +validarBando() boolean
    +calcularPontuacao() number
    +getLider() Carta
    +getCorLider() CorReino
  }
  class Deck {
    +cartas : Carta[]
    +embaralhar() void
    +comprar() Carta
    +adicionarAoFundo(cartas) void
    +adicionarAoTopo(cartas) void
    +devolverCartas(cartas) void
    +estaVazio() boolean
    +tamanho() number
  }
  class Reino {
    +cor : CorReino
    +fichasGloria : FichaGloria[]
    +marcadores : MarcadorControle[]
    +podeAdicionarMarcador(tamanhoBando) boolean
    +adicionarMarcador(marcador) void
    +contarMarcadores() number
    +calcularControle() Jogador
    +proximaFichaGloria() FichaGloria
  }
  class Jogador {
    +id : number
    +nome : string
    +cor : CorReino
    +pontosGloria : number
    +mao : Carta[]
    +marcadoresDisponiveis : MarcadorControle[]
    +maoCheia() boolean
    +receberCarta(carta) void
    +descartarMao(cartasVisiveis) void
    +receberPontos(pontos) void
    +posicionarMarcador(reino) MarcadorControle
    +jogarBando(bando, jogo) void
    +contarMarcadoresNoTabuleiro(reinos) number
  }
  class Jogo {
    +deck : Deck
    +cartasVisiveis : CartasVisiveis
    +jogadores : Jogador[]
    +reinos : Reino[]
    +estado : EstadoJogo
    +eraAtual : number
    +turnoAtual : number
    +dragoesRevelados : number
    +configurarPartida(jogadores, deck, reinos) void
    +iniciarEra() void
    +validarRecrutamento(jogador, fonte, idx) Carta
    +processarBando(jogador, bando, adicionarMarcador) void
    +encerrarEra() void
    +declararVencedor() Jogador
    +jogadorAtual() Jogador
    +proximoTurno() void
    +getReino(cor) Reino
    +criarPartida(nomes)$ Jogo
  }
  class FabricaJogo {
    +montar(nomes)$ Jogo
  }

  Habilidade <|-- HabilidadeNula
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
  Jogador "1" --> "0..10" Carta
  Jogador "1" --> "0..12" MarcadorControle
  Jogo --> EstadoJogo
  Jogo "1" --> "1" Deck
  Jogo "1" --> "1" CartasVisiveis
  Jogo "1" --> "4..6" Jogador
  Jogo "1" --> "6" Reino
  FabricaJogo ..> Jogo
`;

/** Diagrama de sequência — fluxo completo de jogar um bando. */
export const DIAGRAMA_SEQUENCIA = `sequenceDiagram
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
`;

/** Diagrama de comunicação UML — fluxo jogar bando com mensagens numeradas. */
export const DIAGRAMA_COMUNICACAO = `%%{init:{'flowchart':{'nodeSpacing':60,'rankSpacing':90}}}%%
graph TB
  Origem(["●"])
  Jogador[":Jogador"]
  Jogo[":Jogo"]
  Bando[":Bando"]
  Carta[":Carta"]
  Tribo[":Tribo"]
  Reino[":Reino"]
  Marcador[":MarcadorControle"]

  classDef obj fill:#f0f4ff,stroke:#4a6fa5,stroke-width:2px,padding:10px,font-size:15px
  class Jogador,Jogo,Bando,Carta,Tribo,Reino,Marcador obj

  Origem -->|"1: jogar_bando(bando)"| Jogador
  Jogador -->|"1.1: validar_bando()"| Bando
  Jogador -->|"1.2: [loop] mao.remove(carta)"| Jogador
  Jogador -->|"1.3: processar_bando(bando)"| Jogo
  Jogo -->|"1.3.1: get_lider()"| Bando
  Jogo -->|"1.3.2: get_tribo()"| Carta
  Jogo -->|"1.3.3: aplicar_habilidade(j,g,b)"| Tribo
  Jogo -->|"1.3.4: calcular_pontuacao()"| Bando
  Jogo -->|"1.3.5: receber_pontos(pontos)"| Jogador
  Jogo -->|"1.3.6: get_cor_lider()"| Bando
  Jogo -->|"1.3.7: get_reino(cor)"| Jogo
  Jogo -->|"1.3.8: pode_adicionar_marcador(n)"| Reino
  Jogo -->|"1.3.9: [opt] posicionar_marcador(r)"| Jogador
  Jogador -->|"1.3.9.1: <<create>>"| Marcador
  Jogador -->|"1.3.9.2: adicionar_marcador(m)"| Reino
  Jogo -->|"1.3.10: descartar_mao(visiveis)"| Jogador
  Jogador -->|"1.4: proximo_turno()"| Jogo
`;

/** Diagrama de sequência detalhado — jogar bando (estilo UML de comunicação). */
export const DIAGRAMA_JOGAR_BANDO = `sequenceDiagram
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
`;

/** Trecho de código Python que ilustra o fluxo jogar-bando. */
export const CODIGO_JOGAR_BANDO = `\
class Jogador:
    def jogar_bando(self, bando: Bando, jogo: Jogo) -> None:
        if not bando.validar_bando():
            raise ValueError("Bando inválido (RF14).")
        for carta in bando.cartas:
            self.mao.remove(carta)
        jogo.processar_bando(self, bando)

    def descartar_mao(self, cartas_visiveis: CartasVisiveis) -> None:
        cartas_visiveis.adicionar_varias(self.mao)
        self.mao = []

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
        if not self.cartas or self.lider not in self.cartas:
            return False
        return (
            len({c.tribo.nome for c in self.cartas}) == 1 or
            len({c.cor_reino  for c in self.cartas}) == 1
        )

    def calcular_pontuacao(self) -> int:
        n = self.calcular_tamanho()
        return self.PONTUACAO_ACIMA_4 if n > 4 else self.TABELA_PONTUACAO.get(n, 0)

    def get_lider(self) -> Carta:
        return self.lider

    def get_cor_lider(self) -> CorReino:
        return self.lider.cor_reino


class Tribo:
    def aplicar_habilidade(self, jogador: Jogador, jogo: Jogo, bando: Bando) -> None:
        self.habilidade.executar(jogador, jogo, bando)


class Reino:
    def pode_adicionar_marcador(self, tamanho_bando: int) -> bool:
        return tamanho_bando > self.contar_marcadores()

    def adicionar_marcador(self, marcador: MarcadorControle) -> None:
        self.marcadores.append(marcador)


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
        self._idx_atual = (self._idx_atual + 1) % len(self.jogadores)
        self.turno_atual += 1
`;
