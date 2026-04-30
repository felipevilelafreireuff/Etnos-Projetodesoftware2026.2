import { Carta } from './carta';

/**
 * Baralho principal do jogo.
 *
 * RF07 — os 3 Dragões são embaralhados e adicionados ao deck
 * depois que as cartas iniciais são distribuídas, garantindo
 * que fiquem na segunda metade.
 */
export class Deck {
  cartas: Carta[];

  constructor(cartas: Carta[] = []) {
    this.cartas = [...cartas];
  }

  embaralhar(): void {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cartas[i], this.cartas[j]] = [this.cartas[j], this.cartas[i]];
    }
  }

  comprar(): Carta | null {
    if (this.cartas.length === 0) return null;
    return this.cartas.shift()!;
  }

  adicionarAoFundo(cartas: Carta[]): void {
    this.cartas.push(...cartas);
  }

  adicionarAoTopo(cartas: Carta[]): void {
    this.cartas = [...cartas, ...this.cartas];
  }

  /** RF20 — devolve cartas da mão dos jogadores ao baralho no fim de era. */
  devolverCartas(cartas: Carta[]): void {
    this.cartas.push(...cartas);
    this.embaralhar();
  }

  estaVazio(): boolean {
    return this.cartas.length === 0;
  }

  tamanho(): number {
    return this.cartas.length;
  }

  toString(): string {
    return `Deck(${this.tamanho()} cartas)`;
  }
}
