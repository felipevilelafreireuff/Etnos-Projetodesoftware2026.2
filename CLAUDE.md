# EtNós — Projeto de Software (UFF 6º Período)

## O que é este projeto

Implementação digital do jogo de tabuleiro **EtNós** (versão adaptada do Ethnos).
O objetivo acadêmico é modelar e implementar as regras do jogo, com foco em
design orientado a objetos, diagrama de classes e requisitos funcionais.

## Estrutura do projeto

```
PROJETODESOFTWARE/
├── CLAUDE.md              ← este arquivo
├── docs/
│   ├── requisitos.md      ← RF e RNF completos
│   └── classes.md         ← diagrama de classes descrito em texto
└── src/
    └── ethnos/
        ├── __init__.py
        ├── enums.py           ← EstadoJogo, CorReino, NomeTribo, FonteRecrutamento
        ├── habilidade.py      ← interface Habilidade + HabilidadeNula
        ├── tribo.py           ← Tribo (4 fixas, RF04)
        ├── carta.py           ← Carta (tribo + cor_reino + eh_dragao)
        ├── ficha_gloria.py    ← FichaGloria (Glory Token)
        ├── marcador_controle.py ← MarcadorControle (ficha de controle)
        ├── bando.py           ← Bando (validação + pontuação)
        ├── deck.py            ← Deck (embaralhar, comprar, devolver)
        ├── reino.py           ← Reino (6 regiões, marcadores, fichas)
        ├── jogador.py         ← Jogador (mão, marcadores, pontos)
        ├── jogo.py            ← Jogo (controlador central do fluxo)
        └── fabrica.py         ← FabricaJogo (monta partida do zero)
```

## Linguagem e dependências

- **Python 3.11+**
- Sem dependências externas (só stdlib: `random`, `abc`, `enum`, `collections`)
- Frontend: a ser definido (RNF exige compatibilidade web — candidato: FastAPI + WebSockets)

## Regras de negócio críticas

| Regra | Onde está |
|---|---|
| Mão máxima de 10 cartas | `jogador.py` → `LIMITE_MAO` |
| Bando válido: mesma tribo OU mesma cor | `bando.py` → `validar_bando()` |
| Pontuação: 0 / 3 / 6 por tamanho | `bando.py` → `calcular_pontuacao()` |
| Marcador: tamanho_bando > fichas na região | `reino.py` → `pode_adicionar_marcador()` |
| 3º dragão encerra a era | `jogo.py` → `_revelar_dragao()` |
| Quem revelou o dragão começa a próxima era com 2 jogadas | `jogo.py` → `iniciar_era()` |
| Fim de era devolve cartas ao deck (não descarta) | `deck.py` → `devolver_cartas()` |
| Desempate: mais marcadores no tabuleiro | `jogador.py` → `contar_marcadores_no_tabuleiro()` |

## O que ainda falta implementar

- [ ] Nomes reais das 4 tribos (atualmente `TRIBO_1..4` em `enums.py`)
- [ ] Habilidades concretas de cada tribo (subclasses de `Habilidade`)
- [ ] Camada web (frontend + API)
- [ ] Testes automatizados

## Convenções

- snake_case para métodos e atributos
- Type hints em todos os métodos públicos
- Sem comentários que expliquem o "o quê" — só o "por quê" quando não óbvio
- Referência ao RF correspondente em docstrings onde a regra não é autoexplicativa
