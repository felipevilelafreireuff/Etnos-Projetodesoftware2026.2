/** Diagrama de classes Mermaid do projeto EtNós. */
export const DIAGRAMA_CLASSES = `classDiagram
  class Jogo {
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
    +criarPartida(nomes) Jogo
  }
  class Jogador {
    +id : number
    +nome : string
    +cor : string
    +pontosGloria : number
    +maoCheia() boolean
    +recrutar(deck) Carta
    +receberCarta(carta) void
    +descartarMao(cartasVisiveis) void
    +receberPontos(pontos) void
    +posicionarMarcador(reino) MarcadorControle
    +jogarBando(bando, jogo) void
    +contarMarcadoresNoTabuleiro(reinos) number
  }
  class Reino {
    +cor : string
    +podeAdicionarMarcador(tamanhoBando) boolean
    +adicionarMarcador(marcador) void
    +calcularControle() Jogador
    +proximaFichaGloria() FichaGloria
  }
  class Deck {
    +embaralhar() void
    +comprar() Carta
    +adicionarAoFundo(cartas) void
    +devolverCartas(cartas) void
  }
  class Bando {
    +lider : Carta
    +calcularTamanho() number
    +validarBando() boolean
    +calcularPontuacao() number
    +getCorLider() string
  }
  class Carta {
    +id : number
    +corReino : string
    +ehDragao : boolean
    +getTribo() Tribo
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
  class CartasVisiveis {
    +adicionar(carta) void
    +adicionarVarias(cartas) void
    +retirar(idx) Carta
    +limpar() void
  }
  class EstadoJogo {
    <<enumeration>>
    CONFIGURACAO
    EM_ANDAMENTO
    FIM_DE_ERA
    FINALIZADO
  }
  class Habilidade {
    <<abstract>>
    +executar(jogador, jogo, bando)* void
  }
  class Tribo {
    +nome : string
    +habilidade : Habilidade
    +aplicarHabilidade(jogador, jogo, bando) void
  }
  Jogo --> EstadoJogo
  Jogo "1" --> "4..6" Jogador
  Jogo "1" --> "6" Reino
  Jogo "1" --> "1" Deck
  Jogo "1" --> "1" CartasVisiveis
  Jogador "1" --> "0..10" Carta
  Reino "1" --> "3" FichaGloria
  Reino --> MarcadorControle
  Jogador "1" --> "0..12" MarcadorControle
  Bando "1" --> "1..*" Carta
  Deck "1" --> "*" Carta
  Carta --> Tribo
  Tribo --> Habilidade
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
export const DIAGRAMA_COMUNICACAO = `%%{init:{'flowchart':{'nodeSpacing':130,'rankSpacing':260,'htmlLabels':true},'themeVariables':{'fontSize':'20px'}}}%%
graph LR
  Origem(["●"])
  Jogador[":Jogador"]
  Jogo[":Jogo"]
  Bando[":Bando"]
  Carta[":Carta"]
  Tribo[":Tribo"]
  Reino[":Reino"]
  Marcador[":MarcadorControle"]

  LoopMao["1.2* loop para cada carta na mão<br/>mao.remove(carta)<br/><i>↩ volta para si mesmo</i>"]:::nota
  SelfReino["1.3.7: get_reino(cor)<br/><i>↩ volta para si mesmo</i>"]:::nota

  classDef nota fill:#ede8df,stroke:#8a6a50,stroke-dasharray:3 2,font-size:16px,color:#3b2a1a

  LoopMao ~~~ SelfReino

  Jogo -->|"1.3.5: receber_pontos<br/>1.3.9: posicionar_marcador<br/>1.3.10: descartar_mao"| Jogador

  Origem -->|"1: jogar_bando(bando)"| Jogador

  Jogador -->|"1.1: validar_bando()"| Bando

  Jogador -.->|"1.2"| LoopMao

  Jogador -->|"1.3: processar_bando(bando)"| Jogo
  Jogador -->|"1.4: proximo_turno()"| Jogo

  Jogo -->|"1.3.1: get_lider()<br/>1.3.4: calcular_pontuacao()<br/>1.3.6: get_cor_lider()"| Bando

  Jogo -->|"1.3.2: get_tribo()"| Carta

  Jogo -->|"1.3.3: aplicar_habilidade(j,g,b)"| Tribo

  Jogo -.->|"1.3.7"| SelfReino

  Jogo -->|"1.3.8: pode_adicionar_marcador(n)"| Reino

  Jogador -->|"1.3.9.1: &lt;&lt;create&gt;&gt;"| Marcador

  Jogador -->|"1.3.9.2: adicionar_marcador(m)"| Reino
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

/** Trecho de código TypeScript que ilustra o fluxo jogar-bando. */
export const CODIGO_JOGAR_BANDO_TS = `\
class Jogador {
  jogarBando(bando: Bando, jogo: Jogo): void {
    if (!bando.validarBando()) {
      throw new Error("Bando inválido (RF14).");
    }
    for (const carta of bando.cartas) {
      this.mao.splice(this.mao.indexOf(carta), 1);
    }
    jogo.processarBando(this, bando);
  }

  descartarMao(cartasVisiveis: CartasVisiveis): void {
    cartasVisiveis.adicionarVarias(this.mao);
    this.mao = [];
  }

  receberPontos(pontos: number): void {
    this.pontosGloria += pontos;
  }

  posicionarMarcador(reino: Reino): MarcadorControle | null {
    if (!this.marcadoresDisponiveis.length) return null;
    const marcador = this.marcadoresDisponiveis.pop()!;
    marcador.reino = reino;
    reino.adicionarMarcador(marcador);
    return marcador;
  }
}

class Bando {
  cartas: Carta[];
  lider: Carta;
  static readonly TABELA_PONTUACAO: Record<number, number> = { 1: 0, 2: 0, 3: 3, 4: 3 };
  static readonly PONTUACAO_ACIMA_4 = 6;

  validarBando(): boolean {
    if (!this.cartas.length || !this.cartas.includes(this.lider)) return false;
    return (
      new Set(this.cartas.map(c => c.tribo.nome)).size === 1 ||
      new Set(this.cartas.map(c => c.corReino)).size  === 1
    );
  }

  calcularPontuacao(): number {
    const n = this.calcularTamanho();
    return n > 4 ? Bando.PONTUACAO_ACIMA_4 : (Bando.TABELA_PONTUACAO[n] ?? 0);
  }

  getLider(): Carta       { return this.lider; }
  getCorLider(): CorReino { return this.lider.corReino; }
}

class Tribo {
  aplicarHabilidade(jogador: Jogador, jogo: Jogo, bando: Bando): void {
    this.habilidade.executar(jogador, jogo, bando);
  }
}

class Reino {
  podeAdicionarMarcador(tamanhoBando: number): boolean {
    return tamanhoBando > this.contarMarcadores();
  }

  adicionarMarcador(marcador: MarcadorControle): void {
    this.marcadores.push(marcador);
  }
}

class Jogo {
  processarBando(jogador: Jogador, bando: Bando): void {
    const lider = bando.getLider();
    const tribo = lider.getTribo();
    tribo.aplicarHabilidade(jogador, this, bando);

    const pontos = bando.calcularPontuacao();
    jogador.receberPontos(pontos);

    const reino = this.getReino(bando.getCorLider());
    if (reino && reino.podeAdicionarMarcador(bando.calcularTamanho())) {
      jogador.posicionarMarcador(reino);
    }

    jogador.descartarMao(this.cartasVisiveis);
  }

  proximoTurno(): void {
    this._idxAtual = (this._idxAtual + 1) % this.jogadores.length;
    this.turnoAtual++;
  }
}
`;

/** Trecho de código Python que ilustra o fluxo jogar-bando. */
export const CODIGO_JOGAR_BANDO = `\
class Jogador:
    def jogar_bando(self, bando: Bando, jogo: Jogo) -> None:
        if not bando.validar_bando():
            raise ValueError("Bando inválido.")
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
