const ptBR = {
  nav: {
    home:            'Início',
    manual:          'Manual',
    diagramaClasses: 'Diagrama de Classes',
    diagramas:       'Diagramas',
    jogo:            'Jogar',
    equipe:          'Equipe',
    darkMode:        'Modo Escuro',
    lightMode:       'Modo Claro',
    language:        'EN',
  },

  home: {
    titulo:       'EtNós',
    subtitulo:    'Implementação digital do jogo de tabuleiro EtNós',
    badge:        'Projeto de Software · UFF',
    descricao:    'Modelagem e implementação orientada a objetos do jogo EtNós, com frontend interativo e backend Python.',
    rf:           'Requisitos Funcionais',
    rnf:          'Requisitos Não Funcionais',
    visaoGeral:   'Sobre o Projeto',
    cards: {
      visaoGeral: {
        titulo: 'Visão Geral',
        desc:   'Implementação digital do jogo de tabuleiro EtNós com tribos e reinos, adaptado para uma versão simplificada com foco em modelagem orientada a objetos.',
      },
      stack: {
        titulo: 'Stack Tecnológica',
        desc:   'Lógica do jogo implementada em TypeScript puro, rodando inteiramente no cliente. Interface em Next.js 15 com Zustand para gerenciamento de estado.',
      },
      plataforma: {
        titulo: 'Plataforma',
        desc:   'Aplicação web responsiva otimizada para desktop, acessível via browser sem instalação. Dois servidores locais colaborando em tempo real.',
      },
      abordagem: {
        titulo: 'Abordagem',
        desc:   'Desenvolvimento incremental com entregas parciais focadas nas regras do núcleo, interface gráfica e pontuação automática conforme os RFs definidos.',
      },
      requisitos: {
        titulo: 'Documentação de Requisitos',
        desc:   'Documentos claros detalhando 24 Requisitos Funcionais e 6 Requisitos Não Funcionais que guiam toda a implementação do sistema.',
      },
      gestao: {
        titulo: 'Gestão do Projeto',
        desc:   'Planejamento de esforço, análise de riscos e monitoramento contínuo do progresso. Diagramas de classes, sequência e comunicação gerados automaticamente.',
      },
    },
  },

  equipe: {
    titulo:       'Nossa Equipe',
    subtitulo:    'Projeto de Software — UFF',
    disciplina:   'Engenharia de Software',
    universidade: 'Universidade Federal Fluminense',
    sobreTitulo:  'Sobre o Trabalho',
    labels: {
      disciplina:   'Disciplina',
      periodo:      'Período',
      universidade: 'Universidade',
      atividade:    'Atividade',
      professor:    'Professor',
    },
    valores: {
      disciplina:   'Projeto de Software',
      periodo:      '2026.1',
      universidade: 'Universidade Federal Fluminense',
      atividade:    'Trabalho - 1a rodada',
      professor:    'João Felipe Nicolaci Pimentel',
    },
  },

  diagramas: {
    titulo:          'Diagramas',
    classes:         'Diagrama de Classes',
    sequencia:       'Diagrama de Sequência',
    comunicacao:     'Diagrama de Comunicação',
    jogarBando:      'Diagramas (Jogar Bando)',
    carregando:      'Carregando diagrama...',
    tabClasses:      'Classes',
    tabSequencia:    'Sequência — jogarBando()',
    tabComunicacao:  'Comunicação — jogarBando()',
    implementacao:   'Implementação',
  },

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
    generic:    'Algo deu errado. Tente novamente.',
    network:    'Sem conexão com o servidor Python. Verifique se o backend está rodando.',
    semPartida: 'Nenhuma partida em andamento.',
  },

  actions: {
    confirmar: 'Confirmar',
    cancelar:  'Cancelar',
    voltar:    'Voltar',
    loading:   'Carregando...',
  },
} as const;

export default ptBR;

type DeepLoose<T> =
  T extends string ? string :
  T extends (...args: infer A) => infer R ? (...args: A) => R :
  { [K in keyof T]: DeepLoose<T[K]> };

export type StringsShape = DeepLoose<typeof ptBR>;
