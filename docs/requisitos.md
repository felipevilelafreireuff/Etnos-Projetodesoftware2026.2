# Requisitos — EtNós (Versão Adaptada)

## Requisitos Funcionais (RF)

### 1. Configuração da Partida

| ID | Descrição |
|---|---|
| RF01 | O sistema deve montar o tabuleiro no início da partida. |
| RF02 | O sistema deve embaralhar os Glory Tokens e separar 3, colocando-os nos Espaços de Glória de cada Reino em ordem crescente. |
| RF03 | O sistema deve permitir que cada jogador escolha uma das 6 cores disponíveis e receba todas as suas Fichas de Controle. |

### 2. Início de Era

| ID | Descrição |
|---|---|
| RF04 | O sistema deve utilizar sempre as mesmas 4 tribos em todas as partidas, sem embaralhamento de preparação. |
| RF05 | O sistema deve fazer com que cada jogador saque uma carta do baralho e a adicione à sua mão. |
| RF06 | O sistema deve revelar do baralho um número de cartas igual ao dobro do número de jogadores (ex: 4 jogadores → 8 cartas visíveis). |
| RF07 | O sistema deve embaralhar as 3 cartas de Dragão e adicioná-las ao deck após as cartas iniciais serem distribuídas. |
| RF08 | O sistema deve definir o primeiro jogador de forma aleatória e gerar uma ordem de turno a partir dele. |

### 3. Turnos Durante a Era (Loop de Rodadas)

| ID | Descrição |
|---|---|
| RF09 | O sistema deve permitir que, no seu turno, o jogador escolha entre as ações "Recrutar Aliado" ou "Jogar um Bando". |
| RF10 | O sistema deve permitir que o jogador recrute um aliado sacando uma carta do baralho virado para baixo ou das cartas visíveis. |
| RF11 | O sistema deve, caso a carta sacada do baralho seja um Dragão, revelá-la e permitir que o jogador saque outra carta do baralho. |
| RF12 | O sistema deve impedir a ação de "Recrutar Aliado" caso o jogador possua 10 cartas na mão, obrigando-o a jogar um bando. |
| RF13 | O sistema deve encerrar a Era imediatamente caso o terceiro Dragão seja revelado. |
| RF14 | O sistema deve permitir que o jogador jogue um bando apenas se todas as cartas forem da mesma Tribo ou todas forem da mesma Região (cor). |
| RF15 | O sistema deve permitir que o jogador escolha um Líder para o bando, aplicando apenas a habilidade desse Líder. |
| RF16 | O sistema deve, após a jogada do bando, obrigar o jogador a descartar todas as cartas restantes da mão para a área de cartas visíveis. |
| RF17 | O sistema deve calcular e atribuir pontos de Glória conforme o tamanho do bando: tamanho 1–2 → 0 pts; tamanho 3–4 → 3 pts; tamanho 5+ → 6 pts. |
| RF18 | O sistema deve permitir que o jogador adicione uma Ficha de Controle a uma Região somente se o número de cartas do bando for maior que o número de fichas de Controle já existentes naquela Região. |
| RF19 | O sistema deve permitir que o jogador conclua a jogada sem adicionar ficha de Controle caso não cumpra a condição do RF18. |

### 4. Fim de Uma Era

| ID | Descrição |
|---|---|
| RF20 | O sistema deve fazer com que todos os jogadores devolvam as cartas da mão ao baralho ao fim de uma Era. |
| RF21 | O sistema deve permitir que o jogador que revelou o último Dragão inicie a próxima Era e realize duas jogadas consecutivas (após os passos de início de Era serem concluídos). |

### 5. Fim do Jogo e Vencedor

| ID | Descrição |
|---|---|
| RF22 | O sistema deve encerrar a partida após o fim da terceira Era. |
| RF23 | O sistema deve declarar vencedor o jogador com maior pontuação de Glória. |
| RF24 | O sistema deve aplicar o critério de desempate: em caso de empate em pontos de Glória, vence o jogador com mais Fichas de Controle espalhadas pelas Regiões. |

---

## Requisitos Não Funcionais (RNF)

| ID | Descrição |
|---|---|
| RNF01 | O sistema deve apresentar tempo de resposta inferior a 1 segundo para todas as ações do jogador. |
| RNF02 | O sistema deve fornecer feedback visual claro sobre o estado do jogo a cada ação. |
| RNF03 | O sistema deve destacar ações válidas e bloquear automaticamente ações inválidas. |
| RNF04 | O sistema deve permitir ampliação de cartas ao passar o cursor (hover) ou por toque. |
| RNF05 | O sistema deve possuir código modular para facilitar futuras expansões. |
| RNF06 | O sistema deve indicar claramente de quem é o turno atual durante toda a partida. |
