# Arquitetura Frontend — EtNós (Next.js)

> Adaptado da arquitetura HobbyMap. Backend Python (FastAPI) expõe os endpoints;
> Next.js consome a API e cuida de toda a camada visual.

---

## Princípio Fundamental

```
lógica   → hooks      (estado do jogo, fetch, validação)
render   → componente (só JSX, sem fetch, sem lógica)
api      → services   (toda comunicação com o FastAPI)
texto    → strings.ts (todo texto visível ao usuário)
visual   → theme/     (todo valor de design como constante nomeada)
contrato → types/     (todos os tipos de domínio espelhando o Python)
```

> Componente não pensa — só renderiza o que o hook retorna.
> Hook é o cérebro — toda lógica, fetch, validação, transformação.
> Service é o canal — toda API passa por aqui, nunca fetch direto.

---

## As 4 Rotas

```
/                    → HomePage       (RF e RNF do projeto)
/diagrama-classes    → DiagramaClassesPage   (gerado via Mermaid)
/diagramas           → DiagramasPage  (sequência + comunicação via Mermaid)
/jogo                → JogoPage       (partida jogável, conectada ao FastAPI)
```

---

## Estrutura de Pastas

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx                        → <HomeScreen />
│   ├── diagrama-classes/
│   │   └── page.tsx                   → <DiagramaClassesScreen />
│   ├── diagramas/
│   │   └── page.tsx                   → <DiagramasScreen />
│   └── jogo/
│       └── page.tsx                   → <JogoScreen />
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   └── Modal/
│   │   │
│   │   ├── features/
│   │   │   ├── Home/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Home.module.css
│   │   │   │   ├── components/
│   │   │   │   │   ├── RequisitosSection/   ← lista de RF e RNF
│   │   │   │   │   └── HeroSection/         ← animated background React Bits
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── DiagramaClasses/
│   │   │   │   ├── DiagramaClasses.tsx
│   │   │   │   ├── DiagramaClasses.module.css
│   │   │   │   ├── components/
│   │   │   │   │   └── MermaidViewer/       ← renderiza o Mermaid
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── Diagramas/
│   │   │   │   ├── Diagramas.tsx
│   │   │   │   ├── Diagramas.module.css
│   │   │   │   ├── components/
│   │   │   │   │   ├── DiagramaSequencia/
│   │   │   │   │   └── DiagramaComunicacao/
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── Jogo/
│   │   │       ├── Jogo.tsx
│   │   │       ├── Jogo.module.css
│   │   │       ├── components/
│   │   │       │   ├── Tabuleiro/           ← os 6 reinos
│   │   │       │   ├── MaoDoCarta/          ← cartas do jogador atual
│   │   │       │   ├── CartasVisiveis/      ← área de recrutamento
│   │   │       │   ├── PainelJogadores/     ← pontos + marcadores
│   │   │       │   ├── CartaCard/           ← React Bits SpotlightCard
│   │   │       │   └── StatusTurno/         ← de quem é o turno
│   │   │       └── index.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── EmptyState/
│   │   │   ├── LoadingState/
│   │   │   └── NavPill/                     ← React Bits Pill Nav (4 tabs)
│   │   │
│   │   └── layout/
│   │       └── Header/
│   │
│   ├── screens/
│   │   ├── HomeScreen/
│   │   ├── DiagramaClassesScreen/
│   │   ├── DiagramasScreen/
│   │   └── JogoScreen/
│   │
│   ├── hooks/
│   │   ├── shared/
│   │   │   ├── useAsyncData.ts
│   │   │   └── useIsMobile.ts
│   │   ├── home/
│   │   │   └── useHomeScreen.ts            ← carrega RF e RNF
│   │   ├── diagramas/
│   │   │   ├── useDiagramaClassesScreen.ts ← busca Mermaid do backend
│   │   │   └── useDiagramasScreen.ts
│   │   └── jogo/
│   │       ├── useJogoScreen.ts            ← orquestra o estado geral
│   │       ├── useRecruitarAliado.ts       ← RF10 / RF11 / RF12
│   │       ├── useJogarBando.ts            ← RF14 / RF15 / RF16 / RF17
│   │       └── useTabuleiro.ts             ← estado visual dos reinos
│   │
│   ├── services/
│   │   ├── api.ts                          ← instância axios (baseURL FastAPI)
│   │   ├── jogoService.ts                  ← todas as ações do jogo
│   │   ├── diagramaService.ts              ← busca Mermaid gerado pelo Python
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── jogo/
│   │   │   └── index.ts                    ← Carta, Bando, Jogador, Reino, EstadoJogo
│   │   └── shared/
│   │       └── index.ts                    ← ApiResponse<T>
│   │
│   ├── constants/
│   │   ├── strings.ts
│   │   ├── routes.ts
│   │   └── icons.ts
│   │
│   └── theme/
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       ├── shadows.ts
│       ├── radius.ts
│       ├── animation.ts
│       ├── zIndex.ts
│       └── index.ts
│
└── public/
```

---

## Design System

### theme/colors.ts

```typescript
export const colors = {
  // Superfícies — tema medieval escuro
  bg:          '#0f0d0a',
  surface:     '#1c1812',
  surfaceHigh: '#2a2118',
  border:      '#3d2f1f',

  // Primária — ouro
  gold:        '#d4a017',
  goldLight:   '#e8bf4a',
  goldDark:    '#a37a10',

  // Texto
  parchment:   '#f5e6c8',
  textMuted:   '#a89070',
  textFaint:   '#6b5a42',

  // Estados
  success:     '#27ae60',
  error:       '#c0392b',
  warning:     '#f39c12',

  // Reinos — espelham CorReino do Python
  reino: {
    VERMELHO: '#c0392b',
    AZUL:     '#2980b9',
    VERDE:    '#27ae60',
    AMARELO:  '#f39c12',
    ROXO:     '#8e44ad',
    LARANJA:  '#e67e22',
  },
} as const;
```

> Para trocar a cor de um reino: mude APENAS aqui. Todo o sistema reflete a mudança.

### theme/typography.ts

```typescript
// Heading: Cinzel (Google Fonts — medieval, legível)
// Body:    Inter

export const FONT_SIZE = {
  xs:   12,
  sm:   14,
  base: 16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const FONT_WEIGHT = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
} as const;
```

### theme/spacing.ts — Grid de 8px

```typescript
export const SPACING = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
} as const;
```

### theme/shadows.ts

```typescript
export const SHADOWS = {
  sm:   '0 1px 3px rgba(0,0,0,0.30)',
  md:   '0 4px 6px rgba(0,0,0,0.40)',
  lg:   '0 10px 15px rgba(0,0,0,0.50)',
  gold: '0 0 12px rgba(212,160,23,0.40)',   // brilho dourado para cartas selecionadas
} as const;
```

### theme/radius.ts

```typescript
export const RADIUS = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  card: 10,   // cartas do jogo
  full: 9999,
} as const;
```

### globals.css — CSS Variables (fonte única de verdade para o CSS)

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  /* Superfícies */
  --color-bg:           #0f0d0a;
  --color-surface:      #1c1812;
  --color-surface-high: #2a2118;
  --color-border:       #3d2f1f;

  /* Primária */
  --color-gold:         #d4a017;
  --color-gold-light:   #e8bf4a;
  --color-gold-dark:    #a37a10;

  /* Texto */
  --color-parchment:    #f5e6c8;
  --color-text-muted:   #a89070;
  --color-text-faint:   #6b5a42;

  /* Estados */
  --color-success:      #27ae60;
  --color-error:        #c0392b;
  --color-warning:      #f39c12;

  /* Reinos — espelham CorReino do Python */
  --color-reino-VERMELHO: #c0392b;
  --color-reino-AZUL:     #2980b9;
  --color-reino-VERDE:    #27ae60;
  --color-reino-AMARELO:  #f39c12;
  --color-reino-ROXO:     #8e44ad;
  --color-reino-LARANJA:  #e67e22;

  /* Spacing */
  --spacing-xs:  4px;
  --spacing-sm:  8px;
  --spacing-md:  12px;
  --spacing-lg:  16px;
  --spacing-xl:  20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;
  --spacing-4xl: 48px;
  --spacing-5xl: 64px;

  /* Typography */
  --font-heading:    'Cinzel', serif;
  --font-body:       'Inter', sans-serif;
  --font-size-xs:    12px;
  --font-size-sm:    14px;
  --font-size-base:  16px;
  --font-size-lg:    18px;
  --font-size-xl:    20px;
  --font-size-2xl:   24px;
  --font-size-3xl:   30px;

  /* Radius */
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-card: 10px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm:   0 1px 3px rgba(0,0,0,0.30);
  --shadow-md:   0 4px 6px rgba(0,0,0,0.40);
  --shadow-lg:   0 10px 15px rgba(0,0,0,0.50);
  --shadow-gold: 0 0 12px rgba(212,160,23,0.40);

  /* Z-index */
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-modal:    300;
  --z-toast:    400;
}
```

---

## React Bits — O que usar onde

| Componente React Bits | Onde no projeto |
|---|---|
| `Aurora` / `Beams` (background) | `HeroSection` na homepage |
| `SpotlightCard` | `CartaCard` — cada carta do jogo |
| `TiltedCard` | Cards de RF e RNF na homepage |
| `Pill Nav` | `NavPill` — navegação entre as 4 tabs |
| `GradientText` / `SplitText` | Títulos das seções (`<h1>`, `<h2>`) |
| `Magnet` | Botões de ação do turno |

```typescript
// Exemplo — CartaCard usando SpotlightCard
import { SpotlightCard } from 'react-bits';

export function CartaCard({ carta, onClick }: CartaCardProps) {
  return (
    <SpotlightCard
      className={styles.carta}
      style={{ '--reino-color': `var(--color-reino-${carta.corReino})` } as CSSProperties}
      onClick={onClick}
    >
      <span className={styles.tribo}>{STRINGS.jogo.tribos[carta.tribo]}</span>
      <span className={styles.reino}>{STRINGS.jogo.reinos[carta.corReino]}</span>
    </SpotlightCard>
  );
}
```

---

## Types — Espelho do Python

```typescript
// src/types/jogo/index.ts

export type CorReino = 'VERMELHO' | 'AZUL' | 'VERDE' | 'AMARELO' | 'ROXO' | 'LARANJA';
export type NomeTribo = 'TRIBO_1' | 'TRIBO_2' | 'TRIBO_3' | 'TRIBO_4' | 'DRAGAO';
export type FonteRecrutamento = 'deck' | 'visiveis';
export type EstadoJogo = 'CONFIGURACAO' | 'EM_ANDAMENTO' | 'FIM_DE_ERA' | 'FINALIZADO';

export interface Carta {
  id: number;
  tribo: NomeTribo;
  corReino: CorReino;
  ehDragao: boolean;
}

export interface Jogador {
  id: number;
  nome: string;
  cor: CorReino;
  pontosGloria: number;
  mao: Carta[];
  marcadoresDisponiveis: number;
}

export interface Reino {
  cor: CorReino;
  marcadoresPorJogador: Record<string, number>;   // jogadorId → quantidade
  fichasGloria: number[];
}

export interface EstadoPartida {
  estado: EstadoJogo;
  eraAtual: number;
  turnoAtual: number;
  draoesRevelados: number;
  jogadorAtualId: number;
  jogadores: Jogador[];
  reinos: Reino[];
  cartasVisiveis: Carta[];
}
```

---

## Services

### services/jogoService.ts

```typescript
import api from './api';
import type { EstadoPartida, FonteRecrutamento } from '@/src/types/jogo';

export const jogoService = {
  iniciarPartida: (nomes: string[]) =>
    api.post<EstadoPartida>('/partida/iniciar', { nomes }).then(r => r.data),

  getEstado: () =>
    api.get<EstadoPartida>('/partida/estado').then(r => r.data),

  recrutarAliado: (fonte: FonteRecrutamento, idxVisivel?: number) =>
    api.post<EstadoPartida>('/partida/recrutar', { fonte, idx_visivel: idxVisivel }).then(r => r.data),

  jogarBando: (cartaIds: number[], adicionarMarcador: boolean) =>
    api.post<EstadoPartida>('/partida/jogar-bando', { carta_ids: cartaIds, adicionar_marcador: adicionarMarcador }).then(r => r.data),

  proximoTurno: () =>
    api.post<EstadoPartida>('/partida/proximo-turno').then(r => r.data),
};
```

### services/diagramaService.ts

```typescript
import api from './api';

export const diagramaService = {
  getClasses: () =>
    api.get<{ mermaid: string }>('/diagramas/classes').then(r => r.data.mermaid),

  getSequencia: () =>
    api.get<{ mermaid: string }>('/diagramas/sequencia').then(r => r.data.mermaid),

  getComunicacao: () =>
    api.get<{ mermaid: string }>('/diagramas/comunicacao').then(r => r.data.mermaid),
};
```

---

## Hooks

### hooks/jogo/useJogoScreen.ts

```typescript
export interface UseJogoScreenReturn {
  estado: EstadoPartida | null;
  loading: boolean;
  cartasSelecionadas: number[];
  handleRecruitarDoDeck: () => Promise<void>;
  handleRecruitarVisivel: (idx: number) => Promise<void>;
  handleSelecionarCarta: (id: number) => void;
  handleJogarBando: (adicionarMarcador: boolean) => Promise<void>;
  handleProximoTurno: () => Promise<void>;
}
```

### hooks/diagramas/useDiagramaClassesScreen.ts

```typescript
export interface UseDiagramaClassesReturn {
  mermaid: string | null;
  loading: boolean;
  error: boolean;
}
```

---

## Strings

```typescript
// src/constants/strings.ts
export const STRINGS = {
  nav: {
    home:            'Início',
    diagramaClasses: 'Diagrama de Classes',
    diagramas:       'Diagramas',
    jogo:            'Jogar',
  },

  home: {
    titulo:   'EtNós',
    subtitulo: 'Jogo de tabuleiro digital — UFF 6º Período',
    rf:       'Requisitos Funcionais',
    rnf:      'Requisitos Não Funcionais',
  },

  jogo: {
    recrutar:        'Recrutar Aliado',
    recrutarDeck:    'Sacar do Baralho',
    recrutarVisivel: 'Pegar da Mesa',
    jogarBando:      'Jogar Bando',
    colocarMarcador: 'Colocar Marcador',
    semMarcador:     'Sem Marcador',
    proximoTurno:    'Próximo Turno',
    maoCheia:        'Mão cheia — jogue um bando (RF12)',
    bandoInvalido:   'Bando inválido: mesma tribo ou mesma região (RF14)',
    erraEncerrada:   'Era encerrada — 3º Dragão revelado! (RF13)',
    fimDeJogo:       'Fim de jogo! (RF22)',
    vencedor:        (nome: string) => `${nome} venceu!`,
    turnoAtual:      (nome: string) => `Turno de ${nome}`,
    era:             (n: number) => `Era ${n} / 3`,
    pontos:          (n: number) => `${n} pts`,

    tribos: {
      TRIBO_1: 'Tribo 1',
      TRIBO_2: 'Tribo 2',
      TRIBO_3: 'Tribo 3',
      TRIBO_4: 'Tribo 4',
      DRAGAO:  'Dragão',
    } as Record<string, string>,

    reinos: {
      VERMELHO: 'Reino Vermelho',
      AZUL:     'Reino Azul',
      VERDE:    'Reino Verde',
      AMARELO:  'Reino Amarelo',
      ROXO:     'Reino Roxo',
      LARANJA:  'Reino Laranja',
    } as Record<string, string>,
  },

  errors: {
    generic:  'Algo deu errado. Tente novamente.',
    network:  'Sem conexão com o servidor Python.',
  },
} as const;
```

---

## Rotas

```typescript
// src/constants/routes.ts
export const ROUTES = {
  HOME:             '/',
  DIAGRAMA_CLASSES: '/diagrama-classes',
  DIAGRAMAS:        '/diagramas',
  JOGO:             '/jogo',
} as const;
```

---

## Conexão com o Backend Python

```
[Next.js : 3000]  →  HTTP (axios)  →  [FastAPI : 8000]  →  src/ethnos/*.py
```

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
});

export default api;
```

```bash
# Para rodar em desenvolvimento — dois terminais
uvicorn main:app --reload          # terminal 1 → FastAPI na porta 8000
npm run dev                        # terminal 2 → Next.js na porta 3000
```

---

## Princípios Resumidos

1. **Componente não pensa** — só renderiza o que o hook retorna
2. **Hook é o cérebro** — toda lógica, fetch, seleção de cartas, validação de bando
3. **Service é o canal** — toda comunicação com o FastAPI passa por aqui
4. **Strings são constantes** — nenhum texto literal em JSX
5. **Tokens são lei** — trocar `--color-reino-VERMELHO` em um lugar muda o sistema inteiro
6. **Types espelham o Python** — mesmos nomes, mesma estrutura, camelCase no TS
7. **Hierarquia de 3 camadas** — Rota → Screen → Feature
8. **React Bits para animação** — SpotlightCard nas cartas, Pill Nav na navegação, Aurora no hero
