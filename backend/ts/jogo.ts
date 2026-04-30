import { Carta } from './carta';
import { CartasVisiveis } from './cartasVisiveis';
import { Deck } from './deck';
import { CorReino, EstadoJogo, FonteRecrutamento, NomeTribo } from './enums';
import { FichaGloria } from './fichaGloria';
import { HabilidadeNula } from './habilidade';
import { Jogador } from './jogador';
import { Reino } from './reino';
import { Bando } from './bando';
import { Tribo } from './tribo';

const TOTAL_ERAS    = 3;
const TOTAL_DRAGOES = 3;
const FICHAS_POR_REINO = 3;

const VALORES_FICHAS_GLORIA = Array.from({ length: 18 }, (_, i) => i + 1); // [1..18] — RF02
const CARTAS_POR_TRIBO = 12;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Controlador central do jogo EtNós.
 *
 * Gerencia o fluxo completo:
 *   Configuração → Era (início → loop de rodadas → fim) × 3 → Fim do jogo
 */
export class Jogo {
  deck: Deck;
  cartasVisiveis: CartasVisiveis;
  areaDragoes: Carta[];

  jogadores: Jogador[];
  reinos: Reino[];

  estado: EstadoJogo;
  eraAtual: number;
  turnoAtual: number;

  dragoesRevelados: number;
  jogadorRevelouDragao: Jogador | null;

  private _idxJogadorAtual: number;
  private _jogadasExtras: number; // RF21 — bônus de 2 jogadas no início de era

  constructor() {
    this.deck = new Deck();
    this.cartasVisiveis = new CartasVisiveis();
    this.areaDragoes = [];

    this.jogadores = [];
    this.reinos = [];

    this.estado = EstadoJogo.CONFIGURACAO;
    this.eraAtual = 0;
    this.turnoAtual = 0;

    this.dragoesRevelados = 0;
    this.jogadorRevelouDragao = null;

    this._idxJogadorAtual = 0;
    this._jogadasExtras = 0;
  }

  // ------------------------------------------------------------------
  // RF01 / RF02 / RF03 — Configuração da partida
  // ------------------------------------------------------------------

  configurarPartida(jogadores: Jogador[], deck: Deck, reinos: Reino[]): void {
    if (jogadores.length < 4 || jogadores.length > 6) {
      throw new Error('O jogo requer entre 4 e 6 jogadores (RF01 / RNF01).');
    }

    this.jogadores = jogadores;
    this.deck = deck;
    this.reinos = reinos;

    for (const jogador of this.jogadores) {
      jogador.inicializarMarcadores();
    }

    this.estado = EstadoJogo.EM_ANDAMENTO;
  }

  // ------------------------------------------------------------------
  // RF05 / RF06 / RF07 / RF08 — Início de Era
  // ------------------------------------------------------------------

  iniciarEra(): void {
    this.eraAtual += 1;
    this.dragoesRevelados = 0;
    this.turnoAtual = 0;

    // RF05 — cada jogador saca uma carta
    for (const jogador of this.jogadores) {
      const carta = this.deck.comprar();
      if (carta) jogador.receberCarta(carta);
    }

    // RF06 — revelar dobro do número de jogadores em cartas visíveis
    const qtdVisiveis = this.jogadores.length * 2;
    for (let i = 0; i < qtdVisiveis; i++) {
      const carta = this.deck.comprar();
      if (carta) this.cartasVisiveis.adicionar(carta);
    }

    // RF07 — embaralhar os 3 dragões e adicionar ao fundo do deck
    const dragoes = shuffle(this._criarDragoes());
    this.deck.adicionarAoFundo(dragoes);

    // RF08 — na primeira era escolhe aleatório; a partir da segunda,
    // quem revelou o último dragão começa (com 2 jogadas — RF21)
    if (this.eraAtual === 1) {
      this._idxJogadorAtual = Math.floor(Math.random() * this.jogadores.length);
    } else {
      if (this.jogadorRevelouDragao) {
        this._idxJogadorAtual = this.jogadores.indexOf(this.jogadorRevelouDragao);
      }
      this._jogadasExtras = 2; // RF21
    }

    this.jogadorRevelouDragao = null;
  }

  // ------------------------------------------------------------------
  // RF09 / RF10 / RF11 / RF12 / RF13 — Ações de turno
  // ------------------------------------------------------------------

  /**
   * RF12 — bloqueia se mão cheia.
   * RF10 — delega a ação ao jogador (deck) ou retira das visíveis.
   * RF11 — dragão do deck: revela e jogador recruta outra carta.
   * RF13 — 3º dragão encerra a era.
   */
  validarRecrutamento(
    jogador: Jogador,
    fonte: FonteRecrutamento,
    idxVisivel?: number,
  ): Carta | null {
    if (jogador.maoCheia()) {
      throw new Error(`${jogador.nome} tem 10 cartas — deve jogar um bando (RF12).`);
    }

    if (fonte === FonteRecrutamento.VISIVEIS) {
      if (idxVisivel === undefined || idxVisivel >= this.cartasVisiveis.length) {
        throw new Error('Índice inválido para cartas visíveis.');
      }
      const carta = this.cartasVisiveis.retirar(idxVisivel);
      jogador.receberCarta(carta);
      return carta;
    }

    // RF10 — é o jogador quem recruta do deck
    const carta = jogador.recrutar(this.deck);
    if (carta === null) return null;

    if (carta.ehDragao) {
      // RF11 — dragão não entra na mão, vai direto para a área
      this._revelarDragao(carta, jogador);
      if (this.estado === EstadoJogo.FIM_DE_ERA) return carta;
      return this.validarRecrutamento(jogador, FonteRecrutamento.DECK);
    }

    jogador.receberCarta(carta);
    return carta;
  }

  /**
   * RF15 — aplica habilidade do líder.
   * RF16 — descarta mão restante para cartas visíveis.
   * RF17 — atribui pontos de glória.
   * RF18 / RF19 — tenta adicionar marcador de controle.
   */
  processarBando(jogador: Jogador, bando: Bando, adicionarMarcador = true): void {
    // RF17 — pontuação
    const pontos = bando.calcularPontuacao();
    jogador.receberPontos(pontos);

    // RF15 — habilidade do líder: Bando → Carta(lider) → Tribo → Habilidade
    const lider = bando.getLider();
    const tribo = lider.getTribo();
    tribo.aplicarHabilidade(jogador, this, bando);

    // RF18 / RF19 — marcador de controle
    if (adicionarMarcador) {
      const reino = this.getReino(bando.getCorLider());
      if (reino && reino.podeAdicionarMarcador(bando.calcularTamanho())) {
        jogador.posicionarMarcador(reino);
      }
    }

    // RF16 — descarta mão restante para cartas visíveis
    jogador.descartarMao(this.cartasVisiveis);
  }

  // ------------------------------------------------------------------
  // RF20 / RF21 — Fim de Era
  // ------------------------------------------------------------------

  /** RF20 — todos devolvem cartas ao baralho. */
  encerrarEra(): void {
    for (const jogador of this.jogadores) {
      this.deck.devolverCartas(jogador.mao);
      jogador.mao = [];
    }

    this.cartasVisiveis.limpar();
    this.areaDragoes = [];

    if (this.eraAtual >= TOTAL_ERAS) {
      this._encerrarPartida();
    } else {
      this.estado = EstadoJogo.EM_ANDAMENTO;
      this.iniciarEra();
    }
  }

  // ------------------------------------------------------------------
  // RF22 / RF23 / RF24 — Fim do jogo
  // ------------------------------------------------------------------

  private _encerrarPartida(): void {
    this.estado = EstadoJogo.FINALIZADO;
  }

  /** RF23 — maior pontuação; RF24 — desempate por marcadores. */
  declararVencedor(): Jogador {
    return this.jogadores.reduce((melhor, jogador) => {
      const pontosMelhor  = melhor.pontosGloria;
      const pontosJogador = jogador.pontosGloria;

      if (pontosJogador > pontosMelhor) return jogador;
      if (pontosJogador === pontosMelhor) {
        const mTabuleiro = jogador.contarMarcadoresNoTabuleiro(this.reinos);
        const mMelhor    = melhor.contarMarcadoresNoTabuleiro(this.reinos);
        return mTabuleiro > mMelhor ? jogador : melhor;
      }
      return melhor;
    });
  }

  // ------------------------------------------------------------------
  // Controle de turno
  // ------------------------------------------------------------------

  jogadorAtual(): Jogador {
    return this.jogadores[this._idxJogadorAtual];
  }

  proximoTurno(): void {
    if (this.estado !== EstadoJogo.EM_ANDAMENTO) return;

    // RF21 — jogadas extras para quem revelou o último dragão
    if (this._jogadasExtras > 0) {
      this._jogadasExtras -= 1;
      return;
    }

    this._idxJogadorAtual = (this._idxJogadorAtual + 1) % this.jogadores.length;
    this.turnoAtual += 1;
  }

  // ------------------------------------------------------------------
  // Helpers internos
  // ------------------------------------------------------------------

  getReino(cor: CorReino): Reino | null {
    return this.reinos.find(r => r.cor === cor) ?? null;
  }

  private _revelarDragao(carta: Carta, jogador: Jogador): void {
    this.areaDragoes.push(carta);
    this.dragoesRevelados += 1;
    this.jogadorRevelouDragao = jogador;

    // RF13 — 3º dragão encerra a era imediatamente
    if (this.dragoesRevelados >= TOTAL_DRAGOES) {
      this.estado = EstadoJogo.FIM_DE_ERA;
    }
  }

  private _criarDragoes(): Carta[] {
    const triboDragao = new Tribo(NomeTribo.DRAGAO);
    return Array.from({ length: TOTAL_DRAGOES }, (_, i) =>
      new Carta(1000 + i, triboDragao, Object.values(CorReino)[0] as CorReino, true),
    );
  }

  // ------------------------------------------------------------------
  // Fábrica — monta um jogo padrão pronto para jogar
  // ------------------------------------------------------------------

  static criarPartida(nomesJogadores: string[]): Jogo {
    const jogo     = new Jogo();
    const reinos   = Jogo._montarReinos();
    const deck     = Jogo._montarDeck();
    const jogadores = Jogo._montarJogadores(nomesJogadores);
    jogo.configurarPartida(jogadores, deck, reinos);
    return jogo;
  }

  /** RF02 — embaralha fichas e distribui 3 por reino em ordem crescente. */
  private static _montarReinos(): Reino[] {
    const fichasPool = shuffle([...VALORES_FICHAS_GLORIA]);
    const cores = Object.values(CorReino) as CorReino[];
    return cores.map((cor, i) => {
      const valores = fichasPool.slice(i * FICHAS_POR_REINO, i * FICHAS_POR_REINO + FICHAS_POR_REINO).sort((a, b) => a - b);
      const fichas  = valores.map((v, j) => new FichaGloria(v, j + 1));
      return new Reino(cor, fichas);
    });
  }

  /** RF04 — 4 tribos fixas; cada tribo cobre todos os reinos. */
  private static _montarDeck(): Deck {
    const tribosNomes = (Object.values(NomeTribo) as NomeTribo[]).filter(n => n !== NomeTribo.DRAGAO);
    const tribos = tribosNomes.map(nome => new Tribo(nome, new HabilidadeNula()));
    const cores  = Object.values(CorReino) as CorReino[];

    const cartas: Carta[] = [];
    let idCounter = 1;
    for (const tribo of tribos) {
      for (const cor of cores) {
        const qtd = CARTAS_POR_TRIBO / cores.length;
        for (let k = 0; k < qtd; k++) {
          cartas.push(new Carta(idCounter++, tribo, cor));
        }
      }
    }

    const deck = new Deck(cartas);
    deck.embaralhar();
    return deck;
  }

  /** RF03 — associa uma cor de reino aleatória a cada jogador. */
  private static _montarJogadores(nomes: string[]): Jogador[] {
    const cores = shuffle(Object.values(CorReino) as CorReino[]);
    return nomes.map((nome, i) => new Jogador(i + 1, nome, cores[i]));
  }

  toString(): string {
    return `Jogo(era=${this.eraAtual}/${TOTAL_ERAS}, turno=${this.turnoAtual}, estado=${this.estado}, dragoes=${this.dragoesRevelados}/${TOTAL_DRAGOES})`;
  }
}
