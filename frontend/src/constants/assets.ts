/**
 * Registro central de assets visuais.
 * Quando os PNGs do Unreal Engine ficarem prontos, só mudar os caminhos aqui.
 * Estrutura esperada em /public/assets/:
 *   map/mapa-fundo.png
 *   tribos/TRIBO_1.png, TRIBO_2.png, TRIBO_3.png, TRIBO_4.png, DRAGAO.png
 *   ui/setup-bg.png
 */

export const ASSETS = {
  map: {
    fundo:   '/assets/map/mapa-fundo.png',
  },
  tribos: {
    TRIBO_1: '/assets/tribos/TRIBO_1.png',
    TRIBO_2: '/assets/tribos/TRIBO_2.png',
    TRIBO_3: '/assets/tribos/TRIBO_3.png',
    TRIBO_4: '/assets/tribos/TRIBO_4.png',
    DRAGAO:  '/assets/tribos/DRAGAO.png',
  },
  ui: {
    setupBg: '/assets/ui/setup-bg.png',
  },
  diagramas: {
    classes:     '/assets/diagramas/diagramadeclasses.jpg',
    sequencia:   '/assets/diagramas/diagramadesequencia.jpg',
    comunicacao: '/assets/diagramas/diagramadecomunicacao.jpg',
  },
} as const;

export type NomeTriboAsset = keyof typeof ASSETS.tribos;
