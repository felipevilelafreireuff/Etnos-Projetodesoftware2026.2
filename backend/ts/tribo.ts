import { NomeTribo } from './enums';
import { Habilidade, HabilidadeNula } from './habilidade';
import type { Jogador } from './jogador';
import type { Jogo } from './jogo';
import type { Bando } from './bando';

/** RF04 — 4 tribos fixas em todas as partidas. */
export class Tribo {
  nome: NomeTribo;
  habilidade: Habilidade;

  constructor(nome: NomeTribo, habilidade?: Habilidade) {
    this.nome = nome;
    this.habilidade = habilidade ?? new HabilidadeNula();
  }

  /** RF15 — delega para a habilidade concreta da tribo. */
  aplicarHabilidade(jogador: Jogador, jogo: Jogo, bando: Bando): void {
    this.habilidade.executar(jogador, jogo, bando);
  }

  toString(): string {
    return `Tribo(${this.nome})`;
  }
}
