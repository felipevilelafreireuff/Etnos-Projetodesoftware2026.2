# Diagrama de Classes — EtNós

> Tradução textual do diagrama de classes atual mapeado para o código Python em `src/ethnos/`.

---

## Enumerações

### `EstadoJogo`
```
CONFIGURACAO
EM_ANDAMENTO
FIM_DE_ERA
FINALIZADO
```

### `CorReino`
```
VERMELHO | AZUL | VERDE | AMARELO | ROXO | LARANJA
```

### `NomeTribo`
```
TRIBO_1 | TRIBO_2 | TRIBO_3 | TRIBO_4   ← 4 tribos fixas (RF04)
DRAGAO                                   ← uso interno para cartas de dragão
```

### `FonteRecrutamento`
```
DECK | VISIVEIS
```

---

## Interface

### `Habilidade` *(ABC)*
| Método | Retorno | Descrição |
|---|---|---|
| `executar(jogador, jogo, bando)` | `None` | Aplica o efeito especial da tribo (RF15) |

Implementações concretas:
- `HabilidadeNula` — sem efeito (padrão atual)
- *(a definir)* — uma por tribo real

---

## Classes Principais

### `Jogo`
| Atributo | Tipo | Descrição |
|---|---|---|
| `deck` | `Deck` | Baralho principal |
| `cartas_visiveis` | `List[Carta]` | Cartas expostas (RF06, RF10) |
| `area_dragoes` | `List[Carta]` | Dragões revelados (RF11, RF13) |
| `jogadores` | `List[Jogador]` | 4 a 6 jogadores (RF01) |
| `reinos` | `List[Reino]` | 6 reinos fixos (RF01) |
| `estado` | `EstadoJogo` | Estado atual do jogo |
| `era_atual` | `int` | Era corrente (1–3) |
| `turno_atual` | `int` | Contador de turnos da era |
| `dragoes_revelados` | `int` | Qtd de dragões revelados (0–3) |
| `jogador_revelou_dragao` | `Jogador?` | Quem revelou o último dragão (RF21) |

| Método | Descrição |
|---|---|
| `configurar_partida(jogadores, deck, reinos)` | RF01–RF03 |
| `iniciar_era()` | RF05–RF08 |
| `recrutar_aliado(jogador, fonte, idx?)` | RF10–RF13 |
| `jogar_bando(jogador, bando, adicionar_marcador)` | RF14–RF19 |
| `encerrar_era()` | RF20–RF22 |
| `declarar_vencedor()` | RF23–RF24 |
| `proximo_turno()` | Avança o índice do jogador atual |
| `jogador_atual()` | Retorna o jogador do turno |
| `get_reino(cor)` | Busca um reino pela cor |

---

### `Jogador`
| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | `int` | Identificador único |
| `nome` | `str` | Nome do jogador |
| `cor` | `CorReino` | Cor escolhida (RF03) |
| `pontos_gloria` | `int` | Pontuação acumulada |
| `mao` | `List[Carta]` | Cartas na mão (0–10) |
| `marcadores_disponiveis` | `List[MarcadorControle]` | Fichas ainda não posicionadas |

| Método | Descrição |
|---|---|
| `mao_cheia()` | True se mão tiver 10 cartas (RF12) |
| `receber_carta(carta)` | Adiciona carta à mão |
| `descartar_mao(cartas_visiveis)` | RF16 — move mão para visíveis |
| `receber_pontos(pontos)` | RF17 |
| `posicionar_marcador(reino)` | RF18 — consome um marcador disponível |
| `contar_marcadores_no_tabuleiro(reinos)` | RF24 — critério de desempate |

---

### `Reino`
| Atributo | Tipo | Descrição |
|---|---|---|
| `cor` | `CorReino` | Identificador da região |
| `fichas_gloria` | `List[FichaGloria]` | 3 fichas (espaços I, II, III) — RF02 |
| `marcadores` | `List[MarcadorControle]` | Fichas de controle posicionadas |

| Método | Descrição |
|---|---|
| `pode_adicionar_marcador(tamanho_bando)` | RF18 — tamanho > qtd marcadores |
| `adicionar_marcador(marcador)` | Posiciona marcador no reino |
| `calcular_controle()` | Jogador com mais marcadores |
| `contar_marcadores_jogador(jogador)` | RF24 |
| `proxima_ficha_gloria()` | Primeira ficha ainda não atribuída |

---

## Elementos do Jogo

### `Carta`
| Atributo | Tipo | Descrição |
|---|---|---|
| `id` | `int` | Identificador único |
| `tribo` | `Tribo` | Tribo à qual pertence |
| `cor_reino` | `CorReino` | Região (cor) da carta |
| `eh_dragao` | `bool` | True para cartas de Dragão (RF11, RF13) |

---

### `Bando`
| Atributo | Tipo | Descrição |
|---|---|---|
| `cartas` | `List[Carta]` | Cartas que compõem o bando |
| `lider` | `Carta` | Carta escolhida como líder (RF15) |

| Método | Descrição |
|---|---|
| `validar_bando()` | RF14 — mesma tribo OU mesma cor |
| `calcular_tamanho()` | Qtd de cartas |
| `calcular_pontuacao()` | RF17 — 0 / 3 / 6 pts |
| `get_cor_lider()` | Cor do reino do líder |

Tabela de pontuação (RF17):

| Tamanho | Pontos |
|---|---|
| 1 ou 2 | 0 |
| 3 ou 4 | 3 |
| 5 ou mais | 6 |

---

### `Deck`
| Atributo | Tipo | Descrição |
|---|---|---|
| `cartas` | `List[Carta]` | Pilha de cartas |

| Método | Descrição |
|---|---|
| `embaralhar()` | Randomiza a ordem |
| `comprar()` | Remove e retorna o topo |
| `devolver_cartas(cartas)` | RF20 — devolve mãos ao baralho e embaralha |
| `adicionar_ao_fundo(cartas)` | RF07 — insere dragões no fundo |

---

## Classes de Apoio

### `Tribo`
| Atributo | Tipo | Descrição |
|---|---|---|
| `nome` | `NomeTribo` | Identificador da tribo |
| `habilidade` | `Habilidade` | Efeito especial (RF15) |

---

### `FichaGloria`
| Atributo | Tipo | Descrição |
|---|---|---|
| `valor` | `int` | Pontos de glória do token |
| `espaco` | `int` | Posição no reino: 1 = I, 2 = II, 3 = III |
| `atribuida` | `bool` | Se já foi concedida a um jogador |

---

### `MarcadorControle`
| Atributo | Tipo | Descrição |
|---|---|---|
| `jogador` | `Jogador` | Dono do marcador |
| `reino` | `Reino` | Região onde está posicionado |

---

## Relações e Multiplicidades

| De | Para | Multiplicidade | Papel |
|---|---|---|---|
| `Jogo` | `Jogador` | 4..6 | jogadores |
| `Jogo` | `Reino` | 6 | reinos |
| `Jogo` | `Deck` | 1 | deck |
| `Jogo` | `EstadoJogo` | 1 | estado |
| `Jogador` | `Carta` | 0..10 | mao |
| `Jogador` | `MarcadorControle` | 0..* | marcadores_disponiveis |
| `Reino` | `FichaGloria` | 3 | fichas_gloria |
| `Reino` | `MarcadorControle` | 0..* | marcadores |
| `MarcadorControle` | `Jogador` | 1 | jogador |
| `MarcadorControle` | `Reino` | 1 | reino |
| `Deck` | `Carta` | 0..* | cartas |
| `Bando` | `Carta` | 1..* | cartas |
| `Tribo` | `Habilidade` | 1 | habilidade |
| `Carta` | `Tribo` | 1 | tribo |
| `Carta` | `CorReino` | 1 | cor_reino |
