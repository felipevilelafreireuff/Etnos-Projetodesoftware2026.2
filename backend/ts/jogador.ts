import { Carta } from './carta';
import { CartasVisiveis } from './cartasVisiveis';
import { Deck } from './deck';
import { CorReino } from './enums';
import { MarcadorControle } from './marcadorControle';
import type { Jogo } from './jogo';
import type { Bando } from './bando';
import type { Reino } from './reino';

export const LIMITE_MAO = 10; // RF12

/**
 * Representa um jogador humano (RF03, RNF01).
 *
 * Responsabilidades:
 *   - Manter sua mão de cartas
 *   - Possuir marcadores de controle disponíveis
 *   - Acumular pontos de glória
 */
export class Jogador {
  id: number;
  nome: string;
  cor: CorReino;
  pontosGloria: number;
  mao: Carta[];
  marcadoresDisponiveis: MarcadorControle[];
  private _totalMarcadores: number;

  constructor(id: number, nome: string, cor: CorReino, totalMarcadores = 12) {
    this.id = id;
    this.nome = nome;
    this.cor = cor;
    this.pontosGloria = 0;
    this.mao = [];
    this.marcadoresDisponiveis = [];
    this._totalMarcadores = totalMarcadores;
  }

  /** RF12 — verificar se mão está cheia */
  maoCheia(): boolean {
    return this.mao.length >= LIMITE_MAO;
  }

  /** RF10 — o jogador recruta: busca do deck; quem decide se entra na mão é o Jogo */
  recrutar(deck: Deck): Carta | null {
    return deck.comprar();
  }

  /** RF14 — ação do jogador: valida, remove da mão e delega ao Jogo */
  jogarBando(bando: Bando, jogo: Jogo): void {
    if (!bando.validarBando()) {
      throw new Error('Bando inválido: cartas devem ser da mesma tribo ou mesma região (RF14).');
    }
    for (const carta of bando.cartas) {
      const idx = this.mao.indexOf(carta);
      if (idx !== -1) this.mao.splice(idx, 1);
    }
    jogo.processarBando(this, bando);
  }

  receberCarta(carta: Carta): void {
    this.mao.push(carta);
  }

  /** RF16 — descarta toda a mão para as cartas visíveis */
  descartarMao(cartasVisiveis: CartasVisiveis): void {
    cartasVisiveis.adicionarVarias(this.mao);
    this.mao = [];
  }

  /** RF17 — recebe pontos de glória */
  receberPontos(pontos: number): void {
    this.pontosGloria += pontos;
  }

  /** RF18 — consome um marcador disponível para posicionar no reino */
  posicionarMarcador(reino: Reino): MarcadorControle | null {
    if (this.marcadoresDisponiveis.length === 0) return null;
    const marcador = this.marcadoresDisponiveis.pop()!;
    marcador.reino = reino;
    reino.adicionarMarcador(marcador);
    return marcador;
  }

  inicializarMarcadores(): void {
    this.marcadoresDisponiveis = Array.from(
      { length: this._totalMarcadores },
      () => new MarcadorControle(this, null),
    );
  }

  /** RF24 — critério de desempate. */
  contarMarcadoresNoTabuleiro(reinos: Reino[]): number {
    return reinos.reduce((acc, reino) => acc + reino.contarMarcadoresJogador(this), 0);
  }

  toString(): string {
    return `Jogador(${this.nome}, cor=${this.cor}, pontos=${this.pontosGloria}, mao=${this.mao.length} cartas)`;
  }
}
