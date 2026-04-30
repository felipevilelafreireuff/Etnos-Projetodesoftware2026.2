import { Jogo } from './jogo';

/**
 * Ponto de entrada simplificado para montar uma partida do zero.
 * A lógica central de montagem está em Jogo.criarPartida (equivalente
 * ao método estático criar_partida do Python).
 */
export class FabricaJogo {
  static montar(nomes: string[]): Jogo {
    return Jogo.criarPartida(nomes);
  }
}
