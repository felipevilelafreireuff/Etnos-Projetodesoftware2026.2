import { CorReino } from './enums';
import { FichaGloria } from './fichaGloria';
import { MarcadorControle } from './marcadorControle';
import type { Jogador } from './jogador';

/**
 * Representa uma das 6 Regiões do tabuleiro (RF01, RF02).
 *
 * Controle: quem tiver mais MarcadorControle neste reino é o controlador.
 * FichaGloria: 3 fichas por reino, entregues em ordem crescente (RF02).
 */
export class Reino {
  cor: CorReino;
  fichasGloria: FichaGloria[];
  marcadores: MarcadorControle[];

  constructor(cor: CorReino, fichasGloria: FichaGloria[]) {
    this.cor = cor;
    this.fichasGloria = [...fichasGloria].sort((a, b) => a.espaco - b.espaco);
    this.marcadores = [];
  }

  /** RF18 — condição para adicionar marcador */
  podeAdicionarMarcador(tamanhoBando: number): boolean {
    return tamanhoBando > this.contarMarcadores();
  }

  adicionarMarcador(marcador: MarcadorControle): void {
    this.marcadores.push(marcador);
  }

  contarMarcadores(): number {
    return this.marcadores.length;
  }

  contarMarcadoresJogador(jogador: Jogador): number {
    return this.marcadores.filter(m => m.jogador === jogador).length;
  }

  /** Retorna o jogador com mais marcadores neste reino. null se vazio. */
  calcularControle(): Jogador | null {
    if (this.marcadores.length === 0) return null;

    const contagem = new Map<Jogador, number>();
    for (const m of this.marcadores) {
      contagem.set(m.jogador, (contagem.get(m.jogador) ?? 0) + 1);
    }

    let melhorJogador: Jogador | null = null;
    let melhorContagem = 0;
    for (const [jogador, count] of contagem) {
      if (count > melhorContagem) {
        melhorContagem = count;
        melhorJogador = jogador;
      }
    }
    return melhorJogador;
  }

  proximaFichaGloria(): FichaGloria | null {
    for (const ficha of this.fichasGloria) {
      if (!ficha.atribuida) return ficha;
    }
    return null;
  }

  toString(): string {
    return `Reino(${this.cor}, marcadores=${this.contarMarcadores()})`;
  }
}
