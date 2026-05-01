# Implementar UI do Jogo EtNós — Guia Completo para IA

## REGRA MAIS IMPORTANTE
**Mexer APENAS em `frontend/`. Nunca tocar em `backend/` (nem python, nem ts).
A lógica do jogo já está 100% implementada. Só construir a camada visual.**

---

## O que é o projeto

EtNós é uma adaptação digital do board game Ethnos. É um projeto acadêmico da UFF (2026.1).
A lógica do jogo já existe em `backend/ts/` e roda 100% client-side (sem servidor).
O frontend é Next.js 15 App Router.

Repositório: https://github.com/felipevilelafreireuff/Etnos-Projetodesoftware2026.2

---

## Estrutura do projeto (não modificar nada fora de frontend/)

```
Etnos-Projetodesoftware2026.2/
├── backend/
│   ├── python/ethnos/     ← NÃO TOCAR
│   └── ts/                ← NÃO TOCAR (só importar)
│       ├── jogo.ts        ← class Jogo
│       ├── jogador.ts     ← class Jogador
│       ├── bando.ts       ← class Bando
│       ├── carta.ts       ← class Carta
│       ├── reino.ts       ← class Reino
│       ├── deck.ts        ← class Deck
│       ├── tribo.ts       ← class Tribo
│       ├── enums.ts       ← EstadoJogo, CorReino, NomeTribo, FonteRecrutamento
│       ├── cartas_visiveis.ts (ou cartasVisiveis.ts)
│       ├── marcadorControle.ts
│       ├── fichaGloria.ts
│       └── diagramas.ts   ← strings Mermaid (não mexer)
└── frontend/              ← TRABALHAR APENAS AQUI
    ├── app/
    │   ├── layout.tsx     ← não modificar
    │   ├── globals.css    ← não modificar
    │   ├── icon.svg       ← não modificar
    │   └── jogo/
    │       └── page.tsx   ← modificar: renderizar <JogoScreen/>
    └── src/
        ├── components/features/Jogo/   ← CRIAR TUDO AQUI
        ├── store/jogoStore.ts          ← MODIFICAR: implementar estado completo
        ├── services/jogoService.ts     ← pode usar se precisar
        ├── constants/strings/pt-BR.ts ← ADICIONAR chaves que faltem no namespace jogo
        ├── constants/strings/en.ts    ← ESPELHAR exatamente as mesmas chaves
        └── hooks/jogo/                ← criar hooks se precisar
```

---

## Regras de convenção OBRIGATÓRIAS (não negociáveis)

### CSS
- **CSS Modules APENAS** — arquivo `.module.css` por componente. Sem Tailwind, sem styled-components, sem inline styles (exceto valores dinâmicos como cor do reino)
- Usar as variáveis CSS do `globals.css` (listadas abaixo). Nunca hardcodar cores
- Dark mode via `[data-theme="dark"]` no seletor CSS — já funciona automaticamente

### Strings / i18n
- **TODO texto visível na UI deve vir de `useStrings()`** — nunca hardcodar strings em português ou inglês no JSX
- Hook: `const S = useStrings()` importado de `@/src/contexts/LocaleContext`
- Se uma chave não existir em `pt-BR.ts`, adicionar lá E em `en.ts` antes de usar
- As chaves do namespace `jogo` já existem (ver seção abaixo)

### TypeScript
- `'use client'` em todo componente com estado ou interação
- Sem `any` — tipar corretamente usando os tipos do backend/ts/
- camelCase para variáveis/funções, PascalCase para componentes

### Componentes
- Um arquivo `.tsx` + um arquivo `.module.css` por componente
- Sem comentários que expliquem o "o quê" — só o "por quê" quando não óbvio

---

## Variáveis CSS disponíveis (globals.css)

```css
/* Cores de superfície */
--color-bg              /* fundo da página */
--color-surface         /* superfícies de cards/painéis */
--color-surface-high    /* superfície levemente mais clara */
--color-border          /* bordas */

/* Cores de destaque */
--color-gold            /* dourado/terracota primário */
--color-gold-light      /* dourado mais claro */
--color-gold-dark       /* dourado mais escuro */
--color-parchment       /* texto principal (quase branco no dark, quase preto no light) */
--color-text-muted      /* texto secundário */
--color-text-faint      /* texto muito suave */

/* Cores dos reinos (tokens fixos, iguais em ambos os temas) */
--color-reino-VERMELHO: #B84035
--color-reino-AZUL:     #2E6B9E
--color-reino-VERDE:    #4A7B3F
--color-reino-AMARELO:  #C8922A
--color-reino-ROXO:     #7B4F8E
--color-reino-LARANJA:  #C46830

/* Sombras */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-gold

/* Espaçamentos */
--spacing-xs: 4px  | --spacing-sm: 8px   | --spacing-md: 12px
--spacing-lg: 16px | --spacing-xl: 20px  | --spacing-2xl: 24px
--spacing-3xl: 32px| --spacing-4xl: 48px | --spacing-5xl: 64px

/* Tipografia */
--font-heading: 'Lora', serif
--font-body:    'Inter', sans-serif
--font-size-xs: 12px | --font-size-sm: 14px | --font-size-base: 16px
--font-size-lg: 18px | --font-size-xl: 20px

/* Bordas */
--radius-sm, --radius-md, --radius-lg, --radius-xl

/* Header */
--header-height   /* usar no padding-top do main */
```

---

## Strings existentes no namespace `jogo` (pt-BR.ts)

```typescript
jogo: {
  iniciar:         'Iniciar Partida',
  nomesJogadores:  'Nomes dos Jogadores',
  recrutar:        'Recrutar Aliado',
  recrutarDeck:    'Sacar do Baralho',
  recrutarVisivel: 'Pegar da Mesa',
  jogarBando:      'Jogar Bando',
  colocarMarcador: 'Colocar Marcador',
  semMarcador:     'Sem Marcador',
  proximoTurno:    'Próximo Turno',
  encerrarEra:     'Encerrar Era',
  maoCheia:        'Mão cheia — jogue um bando (RF12)',
  bandoInvalido:   'Bando inválido: mesma tribo ou mesma região (RF14)',
  eraEncerrada:    'Era encerrada — 3º Dragão revelado! (RF13)',
  fimDeJogo:       'Fim de jogo! (RF22)',
  maoVazia:        'Mão vazia',
  semCartas:       'Nenhuma carta na mesa',
  addJogador:      '+ Adicionar jogador',
  configPartida:   'Configure a partida (4–6 jogadores)',
  vencedor:        (nome: string) => `🏆 ${nome} venceu!`,
  turnoAtual:      (nome: string) => `Turno de ${nome}`,
  era:             (n: number) => `Era ${n} / 3`,
  pontos:          (n: number) => `${n} pts`,
  dragoes:         (n: number) => `Dragões: ${n}/3`,
  marcadores:      (n: number) => `${n} marcadores`,
  cartasNaMao:     (n: number) => `${n} cartas na mão`,
  maoContador:     (n: number) => `Mão (${n}/10)`,
  cartasMesa:      (n: number) => `Cartas na Mesa (${n})`,
  tribos: { TRIBO_1, TRIBO_2, TRIBO_3, TRIBO_4, DRAGAO } as Record<string, string>,
  reinos: { VERMELHO, AZUL, VERDE, AMARELO, ROXO, LARANJA } as Record<string, string>,
}
```

Se precisar de chaves adicionais, adicionar em `pt-BR.ts` E `en.ts` mantendo as mesmas chaves.

---

## Design de referência (do Stitch)

O layout é dividido assim:

```
┌─────────────────── HEADER FIXO (h: ~96px) ───────────────────────┐
│  [P1 ativo]  [P2]  [P3]  [ EtNós | Era II | 🐉 1/3 ]  [P4] [P5] [P6] │
├──────────────┬───────────────────────────────────┬────────────────┤
│  RECRUTAMENTO│                                   │    AÇÕES       │
│  (w: ~256px) │         MAPA DOS REINOS           │  (w: ~256px)  │
│              │         (SVG central)             │                │
│  4-6 cartas  │                                   │  Botões de     │
│  visíveis    │   marcadores + fichas de glória   │  ação + log    │
│  (mesa)      │                                   │                │
├──────────────┴───────────────────────────────────┴────────────────┤
│              MÃO DO JOGADOR ATUAL (h: ~128px fixo)                │
│         cartas sobrepostas, hover abre leque, selecionada brilha  │
└───────────────────────────────────────────────────────────────────┘
```

### Visual geral
- Fundo escuro tipo mesa de jogo: `var(--color-bg)` no dark = `#1C1510`
- Painéis laterais mais escuros com textura sutil
- Dourado (`var(--color-gold)`) como cor de destaque principal
- Fontes: `var(--font-heading)` para títulos de reino/destaque, `var(--font-body)` para UI

---

## Componentes a criar

### 1. `JogoScreen.tsx` — orquestrador principal
- Lê estado do `jogoStore`
- Se `jogo === null`: renderiza `<SetupPartida/>`
- Se `jogo !== null`: renderiza o layout completo do jogo

### 2. `SetupPartida/` — tela de configuração
- Inputs para 4–6 nomes de jogadores
- Botão "Iniciar Partida" chama `store.iniciarPartida(nomes)`
- Validação: mínimo 4, máximo 6 nomes não vazios
- Todo texto via `S.jogo.*`

### 3. `PlayerBar/` — header com jogadores
- Tira para cada jogador: nome, pontos de glória, cartas na mão, marcadores disponíveis
- Jogador ativo: borda dourada + `var(--shadow-gold)`
- Centro: logo "EtNós", pill de era, pill de dragões (vermelho quando > 0)
- Fixo no topo (`position: fixed; top: 0`)

### 4. `RecruitmentPool/` — sidebar esquerda (cartas visíveis)
- Lista as cartas em `jogo.cartasVisiveis`
- Cada carta: `<CartaComponent tamanho="md" onClick={() => store.recrutarDaMesa(idx)}/>`
- Título via `S.jogo.cartasMesa(n)`

### 5. `GameMap/` — área central com o mapa SVG
- SVG inline com 6 reinos como formas orgânicas (não hexágonos)
- Cada reino:
  - Preenchimento semitransparente com `var(--color-reino-VERMELHO)` etc.
  - Nome do reino via `S.jogo.reinos[cor]`
  - Fichas de glória (diamantes/hexágonos com valor numérico)
  - Marcadores dos jogadores (círculos coloridos, cor do jogador)
  - Hover: `filter: brightness(1.3)` se jogador pode colocar marcador ali
  - Click: chama `store.posicionarMarcador(cor)` quando em fase correta

### 6. `ActionPanel/` — sidebar direita
Botões em ordem:
- **Sacar do Baralho** (`S.jogo.recrutarDeck`) — desabilitado se mão cheia ou já recrutou
- **Pegar da Mesa** (`S.jogo.recrutarVisivel`) — igual
- **Jogar Bando** (`S.jogo.jogarBando`) — habilitado se `cartasSelecionadas.length >= 1` e bando válido
- **Próximo Turno** (`S.jogo.proximoTurno`) — sempre disponível após ação
- Log de jogo: últimas 10 ações em caixa com scroll

### 7. `PlayerHand/` — footer com mão do jogador atual
- Cartas sobrepostas: `margin-left: -1.5rem` no padrão
- Hover no container: abre leque suavemente (`gap` maior com transição)
- Carta selecionada para bando: `transform: translateY(-1.5rem)` + `var(--shadow-gold)`
- Click em carta: `store.toggleCartaBando(carta)`
- Fixo no rodapé (`position: fixed; bottom: 0`)

### 8. `CartaComponent/` — carta reutilizável
```tsx
interface CartaProps {
  carta: Carta
  selecionada?: boolean
  tamanho?: 'sm' | 'md' | 'lg'  // sm=64px, md=96px, lg=128px de largura
  onClick?: () => void
  desabilitada?: boolean
}
```
- Proporção sempre `3/4`
- Borda da cor do reino: `var(--color-reino-VERMELHO)` etc. (via style inline para o valor dinâmico)
- Imagem: **placeholder por tribo** usando emoji/ícone centralizado + gradiente de fundo por tribo:
  - TRIBO_1: gradiente verde + 🌿
  - TRIBO_2: gradiente marrom/dourado + ⚒️
  - TRIBO_3: gradiente roxo escuro + 💀
  - TRIBO_4: gradiente azul + 🌊
  - DRAGAO: gradiente vermelho escuro + 🐉
- Nome da tribo no topo via `S.jogo.tribos[carta.tribo.nome]`
- Gem colorida do reino no rodapé (círculo pequeno com `var(--color-reino-X)`)
- Quando `selecionada`: borda dourada 2px + `var(--shadow-gold)`
- Quando `desabilitada`: `opacity: 0.5; cursor: not-allowed`

---

## Zustand Store (`src/store/jogoStore.ts`)

Implementar este estado completo:

```typescript
import { create } from 'zustand'
import { Jogo } from '../../../backend/ts/jogo'
import { Carta } from '../../../backend/ts/carta'
import { CorReino } from '../../../backend/ts/enums'

interface JogoStore {
  // Estado
  jogo: Jogo | null
  cartasSelecionadas: Carta[]
  mensagem: string | null
  log: string[]

  // Ações
  iniciarPartida: (nomes: string[]) => void
  recrutarDoDeck: () => void
  recrutarDaMesa: (idx: number) => void
  toggleCartaBando: (carta: Carta) => void
  jogarBando: () => void
  posicionarMarcador: (cor: CorReino) => void
  proximoTurno: () => void
  resetar: () => void
}
```

Cada ação chama o método correspondente na instância `jogo`:
- `iniciarPartida(nomes)` → `Jogo.criarPartida(nomes)` (método static)
- `recrutarDoDeck()` → `jogo.validarRecrutamento(jogadorAtual, FonteRecrutamento.DECK)`
- `recrutarDaMesa(idx)` → `jogo.validarRecrutamento(jogadorAtual, FonteRecrutamento.VISIVEIS, idx)`
- `jogarBando()` → cria `new Bando(cartasSelecionadas)` e chama `jogadorAtual.jogarBando(bando, jogo)`
- `proximoTurno()` → `jogo.proximoTurno()`

Após cada ação: atualizar `log` com descrição da ação, limpar `cartasSelecionadas` se necessário.

---

## Fluxo de jogo (para referência visual)

1. **Setup**: jogadores inserem nomes → `iniciarPartida(nomes)` → jogo começa na Era 1
2. **Turno**: jogador ativo pode:
   - Recrutar (do deck ou da mesa) — pega 1 carta por ação
   - Jogar bando — seleciona cartas da mão, clica "Jogar Bando"
3. **Jogar bando**: bando válido = mesma tribo OU mesma cor de reino. Mínimo 1 carta
4. **Dragão**: quando 3º dragão é revelado, era encerra
5. **Era**: ao encerrar, cartas voltam ao deck (não descartam)
6. **Fim**: após 3 eras, `jogo.declararVencedor()` retorna o Jogador vencedor

---

## Regras de negócio (implementadas no backend — não reimplementar)

| Regra | Método no backend |
|---|---|
| Mão máxima 10 cartas | `jogador.maoCheia()` |
| Bando válido | `bando.validarBando()` |
| Pontuação 0/0/3/3/6/6... | `bando.calcularPontuacao()` |
| Marcador só entra se tamanho_bando > marcadores no reino | `reino.podeAdicionarMarcador(n)` |
| 3º dragão encerra era | lógica interna do `Jogo` |
| Desempate | `jogador.contarMarcadoresNoTabuleiro(reinos)` |

---

## O que NÃO fazer

- ❌ Não criar nova lógica de jogo — tudo já está em `backend/ts/`
- ❌ Não usar Tailwind — CSS Modules apenas
- ❌ Não hardcodar texto em português ou inglês — sempre `useStrings()`
- ❌ Não modificar nenhum arquivo de `backend/`
- ❌ Não modificar `globals.css`, `layout.tsx`, `icon.svg`
- ❌ Não criar servidor ou API — o jogo roda 100% client-side
- ❌ Não adicionar dependências sem verificar se já existe no `package.json`
- ❌ Não adicionar comentários explicando "o que" o código faz — só "por quê" quando não óbvio

---

## Checklist de entrega

- [ ] `app/jogo/page.tsx` renderiza `<JogoScreen/>`
- [ ] `SetupPartida` funciona para 4–6 jogadores
- [ ] `PlayerBar` mostra todos os jogadores com destaque no ativo
- [ ] `RecruitmentPool` mostra cartas da mesa clicáveis
- [ ] `GameMap` com 6 reinos SVG + marcadores + fichas de glória
- [ ] `ActionPanel` com botões habilitados/desabilitados corretamente
- [ ] `PlayerHand` com leque de cartas, seleção e brilho
- [ ] `CartaComponent` com gradiente por tribo + cor do reino
- [ ] `jogoStore` implementado com todas as ações
- [ ] Todo texto via `useStrings()`
- [ ] Nenhum arquivo em `backend/` foi modificado
- [ ] CSS Modules em todos os componentes novos
