import { CorReino } from './enums';
import { Tribo } from './tribo';

/**
 * Representa uma carta do jogo.
 * Cada carta pertence a uma Tribo e a uma Região (cor).
 * Cartas de Dragão são tratadas separadamente (RF11, RF13).
 */
export class Carta {
  id: number;
  tribo: Tribo;
  corReino: CorReino;
  ehDragao: boolean;

  constructor(id: number, tribo: Tribo, corReino: CorReino, ehDragao = false) {
    this.id = id;
    this.tribo = tribo;
    this.corReino = corReino;
    this.ehDragao = ehDragao;
  }

  getTribo(): Tribo {
    return this.tribo;
  }

  toString(): string {
    if (this.ehDragao) return 'Carta(Dragão)';
    return `Carta(id=${this.id}, tribo=${this.tribo.nome}, cor=${this.corReino})`;
  }
}
