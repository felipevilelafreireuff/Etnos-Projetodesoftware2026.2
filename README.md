# EtNós — Projeto de Software (UFF 2026.1)

Implementação digital do jogo de tabuleiro **EtNós** (adaptação do Ethnos).  
Projeto acadêmico da disciplina de Projeto de Software — UFF, 2026.1.

---

## O que é o EtNós

Jogo de tabuleiro para 4–6 jogadores onde cada um recruta cartas de tribos e as joga em bandos para conquistar territórios (reinos) no mapa. Ao final de 3 eras, quem acumular mais pontos de glória vence.

---

## Estrutura do repositório

```
Etnos-Projetodesoftware2026.2/
├── backend/
│   ├── python/ethnos/     ← lógica do jogo em Python (implementação principal)
│   └── ts/                ← espelho TypeScript + strings dos diagramas Mermaid
└── frontend/              ← interface web (Next.js 15 App Router)
    ├── app/               ← rotas: /, /diagramas, /manual, /equipe, /jogo
    ├── public/assets/     ← PNGs do Unreal Engine (ver README dentro)
    └── src/
        ├── components/    ← componentes React por feature
        ├── constants/     ← strings PT/EN, rotas, assets
        ├── contexts/      ← tema (claro/escuro) e idioma (PT/EN)
        ├── hooks/         ← hooks por feature
        ├── services/      ← diagramaService, jogoService, api
        └── store/         ← estado global do jogo (Zustand)
```

---

## Backend Python

Todas as regras do jogo vivem em `backend/python/ethnos/`. Sem dependências externas.

| Classe | Responsabilidade |
|---|---|
| `Jogo` | Controlador central: eras, turnos, dragões, pontuação final |
| `Jogador` | Mão de cartas, marcadores, pontos de glória |
| `Reino` | Um dos 6 territórios do mapa; controla fichas e marcadores |
| `Bando` | Grupo de cartas jogado pelo jogador; valida e pontua |
| `Deck` | Baralho: embaralhar, comprar, devolver ao fim de era |
| `CartasVisiveis` | Mesa de cartas abertas para recrutamento |
| `Carta` | Unidade básica: tribo + cor do reino + é dragão? |
| `Tribo` | Nome + habilidade especial |
| `Habilidade` | ABC + `HabilidadeNula` (Null Object) |
| `FichaGloria` | Token de pontuação em cada reino |
| `MarcadorControle` | Peça do jogador posicionada em um reino |

**Regras críticas:**
- Mão máxima: 10 cartas
- Bando válido: todas da mesma tribo **ou** todas da mesma cor de reino
- Pontuação: 0 / 0 / 3 / 3 / 6 / 6 por tamanho do bando
- Marcador entra no reino só se `tamanho_bando > marcadores já presentes`
- 3º dragão revelado encerra a era
- Quem revelou o 3º dragão começa a próxima era com 2 jogadas

---

## Frontend

Interface web em Next.js 15 com CSS Modules. Nenhum Tailwind.

### Rotas

| Rota | O que mostra |
|---|---|
| `/` | Página inicial com visão geral do projeto |
| `/diagramas` | Diagrama de classes, sequência e comunicação (Mermaid) |
| `/manual` | Regras completas do jogo |
| `/equipe` | Integrantes do grupo |
| `/jogo` | Interface jogável (não aparece no nav — acesso direto pela URL) |

### Tela de jogo (`/jogo`)

Layout fixo em camadas:

```
┌─────────────────────────────────────┐  Header do site (nav: Início, Diagramas…)
├─────────────────────────────────────┤  PlayerBar (jogadores, era, dragões)
│  Cartas  │       Mapa SVG      │ Ações │  ← área principal
│ visíveis │   6 reinos + ocean  │ + log │
├─────────────────────────────────────┤
│         Mão do jogador (cartas)     │  PlayerHand (fixed bottom)
└─────────────────────────────────────┘
```

**Componentes principais:**

| Componente | O que faz |
|---|---|
| `SetupPartida` | Tela inicial: 4–6 jogadores inserem seus nomes |
| `PlayerBar` | Faixa fixa abaixo do Header: stats de cada jogador, era atual, dragões |
| `GameMap` | Mapa SVG vetorial com 6 territórios orgânicos, texturas animadas, fichas de glória e marcadores dos jogadores |
| `RecruitmentPool` | Sidebar esquerda: cartas visíveis na mesa + deck |
| `ActionPanel` | Sidebar direita: botões de ação + log de jogo |
| `PlayerHand` | Rodapé fixo: cartas do jogador atual sobrepostas (hover expande) |
| `CartaComponent` | Carta individual: imagem PNG (quando disponível) ou gradiente + emoji |

### Assets PNG (Unreal Engine)

Quando o render do UE estiver pronto, basta colocar os arquivos em `frontend/public/assets/`:

```
assets/
├── map/mapa-fundo.png        ← fundo do mapa (sobreposto pelo SVG interativo)
├── tribos/TRIBO_1.png        ← arte do personagem nas cartas
├── tribos/TRIBO_2.png
├── tribos/TRIBO_3.png
├── tribos/TRIBO_4.png
├── tribos/DRAGAO.png
└── ui/setup-bg.png           ← background da tela de configuração
```

Enquanto os PNGs não existem, o jogo usa gradientes SVG e emojis como fallback automático. Os caminhos estão centralizados em `frontend/src/constants/assets.ts`.

### Sistema de strings (i18n)

Todo texto visível na UI vem de `useStrings()` → `S.namespace.chave`.  
Fonte da verdade: `frontend/src/constants/strings/pt-BR.ts`  
Espelho obrigatório: `frontend/src/constants/strings/en.ts`

### Diagramas

Todas as strings Mermaid vivem em `backend/ts/diagramas.ts`.  
O frontend nunca gera Mermaid — só consome via `diagramaService`.

| Export | Tipo | Conteúdo |
|---|---|---|
| `DIAGRAMA_CLASSES` | `classDiagram` | Todas as classes + relacionamentos |
| `DIAGRAMA_SEQUENCIA` | `sequenceDiagram` | Fluxo de `jogar_bando` |
| `DIAGRAMA_COMUNICACAO` | `flowchart LR` | Diagrama de comunicação numerado |
| `CODIGO_JOGAR_BANDO` | — | Implementação Python |
| `CODIGO_JOGAR_BANDO_TS` | — | Implementação TypeScript |

---

## Como rodar

```bash
cd frontend
npm install
npm run dev
# Acesse http://localhost:3000
```

---

## O que ainda falta

- [ ] Nomes reais das 4 tribos (atualmente `TRIBO_1..4`)
- [ ] Habilidades concretas de cada tribo (subclasses de `Habilidade`)
- [ ] PNGs do Unreal Engine (mapa, personagens, background)
- [ ] Testes automatizados
- [ ] `Manual.tsx` ainda não usa `useStrings()` (conteúdo estático longo)
