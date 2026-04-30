import { Carta } from './carta';
import { CorReino } from './enums';

/**
 * Conjunto de cartas jogadas por um jogador (RF14, RF15).
 *
 * Regras de validade (RF14):
 *   - Todas as cartas são da mesma Tribo, OU
 *   - Todas as cartas são da mesma Região (cor)
 *
 * Pontuação por tamanho (RF17):
 *   1–2 cartas  → 0 pontos
 *   3–4 cartas  → 3 pontos
 *   5+ cartas   → 6 pontos
 */
export class Bando {
  static readonly TABELA_PONTUACAO: Record<number, number> = { 1: 0, 2: 0, 3: 3, 4: 3 };
  static readonly PONTUACAO_ACIMA_4 = 6;

  cartas: Carta[];
  lider: Carta;

  constructor(cartas: Carta[], lider: Carta) {
    this.cartas = cartas;
    this.lider = lider;
  }

  calcularTamanho(): number {
    return this.cartas.length;
  }

  validarBando(): boolean {
    if (this.cartas.length === 0) return false;
    if (!this.cartas.includes(this.lider)) return false;

    const tribosUnicas = new Set(this.cartas.map(c => c.tribo.nome));
    const coresUnicas  = new Set(this.cartas.map(c => c.corReino));

    return tribosUnicas.size === 1 || coresUnicas.size === 1;
  }

  calcularPontuacao(): number {
    const tamanho = this.calcularTamanho();
    if (tamanho > 4) return Bando.PONTUACAO_ACIMA_4;
    return Bando.TABELA_PONTUACAO[tamanho] ?? 0;
  }

  getLider(): Carta {
    return this.lider;
  }

  getCorLider(): CorReino {
    return this.lider.corReino;
  }

  toString(): string {
    return `Bando(tamanho=${this.calcularTamanho()}, lider=${this.lider}, pontos=${this.calcularPontuacao()})`;
  }
}
