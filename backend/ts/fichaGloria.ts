/**
 * Representa um Glory Token (RF02).
 * Cada Reino recebe 3 fichas nos espaços I, II e III em ordem crescente.
 */
export class FichaGloria {
  valor: number;
  espaco: number; // 1, 2 ou 3 (espaços I, II, III)
  atribuida: boolean;

  constructor(valor: number, espaco: number) {
    this.valor = valor;
    this.espaco = espaco;
    this.atribuida = false;
  }

  toString(): string {
    return `FichaGloria(espaco=${this.espaco}, valor=${this.valor})`;
  }
}
