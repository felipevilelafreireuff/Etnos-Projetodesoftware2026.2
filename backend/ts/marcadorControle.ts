import type { Jogador } from './jogador';
import type { Reino } from './reino';

/** Ficha de controle de um jogador posicionada em um Reino. */
export class MarcadorControle {
  jogador: Jogador;
  reino: Reino | null;

  constructor(jogador: Jogador, reino: Reino | null) {
    this.jogador = jogador;
    this.reino = reino;
  }

  toString(): string {
    return `MarcadorControle(jogador=${this.jogador.nome}, reino=${this.reino?.cor ?? 'null'})`;
  }
}
