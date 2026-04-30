import type { StringsShape } from './pt-BR';

const en: StringsShape = {
  nav: {
    home:            'Home',
    manual:          'Manual',
    diagramaClasses: 'Class Diagram',
    diagramas:       'Diagrams',
    jogo:            'Play',
    equipe:          'Team',
    darkMode:        'Dark Mode',
    lightMode:       'Light Mode',
    language:        'PT',
  },

  home: {
    titulo:     'Ethnos',
    subtitulo:  'Digital implementation of the board game Ethnos',
    badge:      'Software Project · UFF',
    descricao:  'Object-oriented modeling and implementation of the Ethnos board game, with an interactive frontend and Python backend.',
    rf:         'Functional Requirements',
    rnf:        'Non-Functional Requirements',
    visaoGeral: 'About the Project',
    cards: {
      visaoGeral: {
        titulo: 'Overview',
        desc:   'Digital implementation of the Ethnos board game with tribes and kingdoms, adapted to a simplified version focused on object-oriented modeling.',
      },
      stack: {
        titulo: 'Tech Stack',
        desc:   'Game logic implemented in pure TypeScript, running entirely client-side. Next.js 15 interface with Zustand for state management.',
      },
      plataforma: {
        titulo: 'Platform',
        desc:   'Responsive web application optimized for desktop, accessible via browser without installation. Two local servers collaborating in real time.',
      },
      abordagem: {
        titulo: 'Approach',
        desc:   'Incremental development with partial deliveries focused on core rules, graphical interface, and automatic scoring as defined by the FRs.',
      },
      requisitos: {
        titulo: 'Requirements Documentation',
        desc:   'Clear documents detailing 24 Functional Requirements and 6 Non-Functional Requirements that guide the entire system implementation.',
      },
      gestao: {
        titulo: 'Project Management',
        desc:   'Effort planning, risk analysis, and continuous progress monitoring. Class, sequence, and communication diagrams generated automatically.',
      },
    },
  },

  equipe: {
    titulo:       'Our Team',
    subtitulo:    'Software Project — UFF',
    disciplina:   'Software Engineering',
    universidade: 'Universidade Federal Fluminense',
    sobreTitulo:  'About the Work',
    labels: {
      disciplina:   'Course',
      periodo:      'Semester',
      universidade: 'University',
      projeto:      'Project',
    },
    valores: {
      disciplina:   'Software Project',
      periodo:      '2026.1',
      universidade: 'Universidade Federal Fluminense',
      projeto:      'Ethnos — Ethnos Adaptation',
    },
  },

  diagramas: {
    classes:     'Class Diagram',
    sequencia:   'Sequence Diagram',
    comunicacao: 'Communication Diagram',
    jogarBando:  'Diagramas (Jogar Bando)',
    carregando:  'Loading diagram...',
  },

  jogo: {
    iniciar:         'Start Game',
    nomesJogadores:  'Player Names',
    recrutar:        'Recruit Ally',
    recrutarDeck:    'Draw from Deck',
    recrutarVisivel: 'Take from Table',
    jogarBando:      'Play Band',
    colocarMarcador: 'Place Marker',
    semMarcador:     'No Marker',
    proximoTurno:    'Next Turn',
    encerrarEra:     'End Era',
    maoCheia:        'Hand full — play a band (RF12)',
    bandoInvalido:   'Invalid band: same tribe or same region (RF14)',
    eraEncerrada:    'Era ended — 3rd Dragon revealed! (RF13)',
    fimDeJogo:       'Game over! (RF22)',
    maoVazia:        'Empty hand',
    semCartas:       'No cards on the table',
    addJogador:      '+ Add player',
    configPartida:   'Set up the game (4–6 players)',
    vencedor:        (nome: string) => `🏆 ${nome} wins!`,
    turnoAtual:      (nome: string) => `${nome}'s turn`,
    era:             (n: number) => `Era ${n} / 3`,
    pontos:          (n: number) => `${n} pts`,
    dragoes:         (n: number) => `Dragons: ${n}/3`,
    marcadores:      (n: number) => `${n} markers`,
    cartasNaMao:     (n: number) => `${n} cards in hand`,
    maoContador:     (n: number) => `Hand (${n}/10)`,
    cartasMesa:      (n: number) => `Cards on Table (${n})`,

    tribos: {
      TRIBO_1: 'Tribe 1',
      TRIBO_2: 'Tribe 2',
      TRIBO_3: 'Tribe 3',
      TRIBO_4: 'Tribe 4',
      DRAGAO:  'Dragon',
    } as Record<string, string>,

    reinos: {
      VERMELHO: 'Red Kingdom',
      AZUL:     'Blue Kingdom',
      VERDE:    'Green Kingdom',
      AMARELO:  'Yellow Kingdom',
      ROXO:     'Purple Kingdom',
      LARANJA:  'Orange Kingdom',
    } as Record<string, string>,
  },

  errors: {
    generic:    'Something went wrong. Please try again.',
    network:    'No connection to Python server. Make sure the backend is running.',
    semPartida: 'No game in progress.',
  },

  actions: {
    confirmar: 'Confirm',
    cancelar:  'Cancel',
    voltar:    'Back',
    loading:   'Loading...',
  },
};

export default en;
