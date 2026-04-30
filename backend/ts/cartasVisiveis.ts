import { Carta } from './carta';

/**
 * Área compartilhada de cartas que todos os jogadores podem recrutar (RF10).
 *
 * Recebe cartas descartadas da mão (RF16) e dragões revelados do deck (RF11).
 * É esvaziada ao fim de cada era (RF20).
 */
export class CartasVisiveis {
  private _cartas: Carta[];

  constructor() {
    this._cartas = [];
  }

  adicionar(carta: Carta): void {
    this._cartas.push(carta);
  }

  adicionarVarias(cartas: Carta[]): void {
    this._cartas.push(...cartas);
  }

  retirar(idx: number): Carta {
    if (idx < 0 || idx >= this._cartas.length) {
      throw new Error('Índice inválido para cartas visíveis.');
    }
    return this._cartas.splice(idx, 1)[0];
  }

  limpar(): void {
    this._cartas = [];
  }

  get length(): number {
    return this._cartas.length;
  }

  [Symbol.iterator](): Iterator<Carta> {
    return this._cartas[Symbol.iterator]();
  }

  toArray(): Carta[] {
    return [...this._cartas];
  }

  toString(): string {
    return `CartasVisiveis(${this._cartas.length} cartas)`;
  }
}
