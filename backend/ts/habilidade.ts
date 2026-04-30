import type { Jogador } from './jogador';
import type { Jogo } from './jogo';
import type { Bando } from './bando';

/** Interface base para habilidades de tribo (RF15). */
export abstract class Habilidade {
  abstract executar(jogador: Jogador, jogo: Jogo, bando: Bando): void;
}

/** Habilidade padrão para tribos sem efeito especial definido. */
export class HabilidadeNula extends Habilidade {
  executar(_jogador: Jogador, _jogo: Jogo, _bando: Bando): void {
    // sem efeito
  }
}
