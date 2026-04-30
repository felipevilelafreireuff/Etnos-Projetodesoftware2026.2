'use client';
import styles from './Manual.module.css';

const REINOS = [
  { nome: 'Vermelho', cor: 'VERMELHO' },
  { nome: 'Azul',     cor: 'AZUL'     },
  { nome: 'Verde',    cor: 'VERDE'     },
  { nome: 'Amarelo',  cor: 'AMARELO'  },
  { nome: 'Roxo',     cor: 'ROXO'     },
  { nome: 'Laranja',  cor: 'LARANJA'  },
];

const TRIBOS = [
  { nome: 'Tribo 1', desc: 'Habilidade especial ativada ao jogar o bando.' },
  { nome: 'Tribo 2', desc: 'Habilidade especial ativada ao jogar o bando.' },
  { nome: 'Tribo 3', desc: 'Habilidade especial ativada ao jogar o bando.' },
  { nome: 'Tribo 4', desc: 'Habilidade especial ativada ao jogar o bando.' },
  { nome: 'Dragão',  desc: 'Carta especial. O 3º dragão revelado encerra a era imediatamente.' },
];

const PONTUACAO = [
  { tamanho: '1 – 2 cartas', pontos: '0 pts' },
  { tamanho: '3 – 4 cartas', pontos: '3 pts' },
  { tamanho: '5+ cartas',    pontos: '6 pts' },
];

function Secao({ id, icone, titulo, children }: { id: string; icone: string; titulo: string; children: React.ReactNode }) {
  return (
    <section id={id} className={styles.secao}>
      <div className={styles.secaoHeader}>
        <span className={styles.icone}>{icone}</span>
        <h2 className={styles.secaoTitulo}>{titulo}</h2>
      </div>
      <div className={styles.secaoConteudo}>{children}</div>
    </section>
  );
}

function Regra({ numero, texto }: { numero: string; texto: string }) {
  return (
    <div className={styles.regra}>
      <span className={styles.regraNum}>{numero}</span>
      <p className={styles.regraTexto}>{texto}</p>
    </div>
  );
}

export default function Manual() {
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroAurora} aria-hidden />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Guia Completo</span>
          <h1 className={styles.heroTitulo}>Manual do Jogo</h1>
          <p className={styles.heroSub}>EtNós — Adaptação digital de Ethnos</p>
          <p className={styles.heroDesc}>
            Para 4 a 6 jogadores · 3 eras por partida · Vence quem acumular mais pontos de glória
          </p>
        </div>
      </header>

      <div className={styles.conteudo}>

        {/* ── Visão Geral ── */}
        <Secao id="visao-geral" icone="🎲" titulo="Visão Geral">
          <p>
            EtNós é um jogo de construção de bandos onde cada jogador recruta aliados de diferentes
            tribos e reinos para disputar o controle dos 6 reinos do tabuleiro.
            Ao longo de <strong>3 eras</strong>, você acumula pontos de glória jogando bandos e
            posicionando marcadores estrategicamente.
          </p>
          <div className={styles.destaquesGrid}>
            <div className={styles.destaqueCard}>
              <span className={styles.destaqueNum}>4–6</span>
              <span className={styles.destaqueLbl}>Jogadores</span>
            </div>
            <div className={styles.destaqueCard}>
              <span className={styles.destaqueNum}>3</span>
              <span className={styles.destaqueLbl}>Eras</span>
            </div>
            <div className={styles.destaqueCard}>
              <span className={styles.destaqueNum}>6</span>
              <span className={styles.destaqueLbl}>Reinos</span>
            </div>
            <div className={styles.destaqueCard}>
              <span className={styles.destaqueNum}>10</span>
              <span className={styles.destaqueLbl}>Limite de Mão</span>
            </div>
          </div>
        </Secao>

        {/* ── Componentes ── */}
        <Secao id="componentes" icone="🃏" titulo="Componentes">
          <ul className={styles.lista}>
            <li><strong>72 cartas de aliados</strong> — 12 por tribo, cada uma com uma cor de reino</li>
            <li><strong>Cartas de Dragão</strong> — espalhadas no baralho; a 3ª encerra a era</li>
            <li><strong>Marcadores de controle</strong> — até 12 por jogador para marcar reinos</li>
            <li><strong>Fichas de glória</strong> — 3 por reino; atribuídas a quem controla cada região</li>
            <li><strong>Área de cartas visíveis</strong> — cartas na mesa disponíveis para recrutamento</li>
          </ul>
        </Secao>

        {/* ── Reinos ── */}
        <Secao id="reinos" icone="🏰" titulo="Reinos">
          <p className={styles.paragrafo}>
            Há 6 reinos no tabuleiro, cada um identificado por uma cor. Controlar reinos ao fim
            das eras rende fichas de glória acumuladas.
          </p>
          <div className={styles.reinosGrid}>
            {REINOS.map(r => (
              <div key={r.cor} className={styles.reinoCard}>
                <span
                  className={styles.reinoDot}
                  style={{ background: `var(--color-reino-${r.cor})` }}
                />
                <span className={styles.reinoNome}>{r.nome}</span>
              </div>
            ))}
          </div>
        </Secao>

        {/* ── Tribos ── */}
        <Secao id="tribos" icone="⚔️" titulo="Tribos">
          <p className={styles.paragrafo}>
            Existem 4 tribos de aliados, cada uma com uma habilidade especial que é ativada
            automaticamente ao jogar um bando liderado por aquela tribo. Além delas, há as
            cartas de Dragão — sem tribo, mas com poder de encerrar a era.
          </p>
          <div className={styles.tribosGrid}>
            {TRIBOS.map(t => (
              <div key={t.nome} className={`${styles.triboCard} ${t.nome === 'Dragão' ? styles.dragao : ''}`}>
                <h4 className={styles.triboNome}>{t.nome}</h4>
                <p className={styles.triboDesc}>{t.desc}</p>
              </div>
            ))}
          </div>
        </Secao>

        {/* ── Turno ── */}
        <Secao id="turno" icone="🔄" titulo="Estrutura do Turno">
          <p className={styles.paragrafo}>
            No seu turno, execute <strong>exatamente uma</strong> das duas ações abaixo.
            Se sua mão estiver cheia (10 cartas), você é obrigado a jogar um bando.
          </p>

          <div className={styles.acoesGrid}>
            <div className={styles.acaoCard}>
              <h3 className={styles.acaoTitulo}>Recrutar Aliado</h3>
              <p className={styles.acaoDesc}>
                Compre uma carta do topo do baralho (desconhecida) <strong>ou</strong> pegue
                qualquer carta da área de cartas visíveis na mesa.
                A carta vai direto para a sua mão.
              </p>
              <div className={styles.acaoDetalhe}>
                Limite de mão: <strong>10 cartas</strong>. Se cheia, jogue um bando obrigatoriamente.
              </div>
            </div>

            <div className={styles.acaoCard}>
              <h3 className={styles.acaoTitulo}>Jogar Bando</h3>
              <p className={styles.acaoDesc}>
                Escolha um conjunto de cartas da sua mão, defina um líder entre elas e
                jogue o bando. O líder determina a habilidade ativada e o reino disputado.
              </p>
              <div className={styles.acaoDetalhe}>
                Após jogar, toda a mão restante é descartada para a área de cartas visíveis.
              </div>
            </div>
          </div>
        </Secao>

        {/* ── Regras do Bando ── */}
        <Secao id="bando" icone="📜" titulo="Regras do Bando">
          <p className={styles.paragrafo}>
            Um bando é válido quando todas as cartas obedecem <strong>uma</strong> das duas condições:
          </p>

          <div className={styles.validacaoGrid}>
            <div className={styles.validacaoCard}>
              <span className={styles.validacaoIcone}>⚔️</span>
              <h4>Mesma Tribo</h4>
              <p>Todas as cartas do bando pertencem à mesma tribo, independente da cor de reino.</p>
            </div>
            <div className={styles.validacaoOu}>OU</div>
            <div className={styles.validacaoCard}>
              <span className={styles.validacaoIcone}>🏰</span>
              <h4>Mesma Cor de Reino</h4>
              <p>Todas as cartas do bando têm a mesma cor de reino, independente da tribo.</p>
            </div>
          </div>

          <div className={styles.aviso}>
            ⚠️ O líder deve estar entre as cartas do bando. Bandos com apenas 1 ou 2 cartas não
            rendem pontos, mas ainda ativam a habilidade do líder.
          </div>
        </Secao>

        {/* ── Pontuação ── */}
        <Secao id="pontuacao" icone="✨" titulo="Pontuação do Bando">
          <p className={styles.paragrafo}>
            A pontuação depende do <strong>tamanho do bando</strong> jogado:
          </p>

          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Tamanho do Bando</th>
                <th>Pontos de Glória</th>
              </tr>
            </thead>
            <tbody>
              {PONTUACAO.map(p => (
                <tr key={p.tamanho}>
                  <td>{p.tamanho}</td>
                  <td className={styles.pts}>{p.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.dica}>
            💡 Bandos grandes rendem mais pontos — vale a pena acumular cartas na mão antes de jogar.
          </div>
        </Secao>

        {/* ── Controle de Reinos ── */}
        <Secao id="controle" icone="🚩" titulo="Controle de Reinos">
          <p className={styles.paragrafo}>
            Após jogar um bando, você pode tentar posicionar um marcador de controle no reino
            correspondente à cor do líder do bando.
          </p>

          <div className={styles.regraBox}>
            <h4 className={styles.regraBoxTitulo}>Condição para colocar marcador</h4>
            <p>
              O <strong>tamanho do bando</strong> jogado deve ser <strong>maior</strong> que o
              número de marcadores já presentes naquele reino.
            </p>
            <code className={styles.regraCode}>
              tamanho_bando &gt; marcadores_no_reino
            </code>
          </div>

          <p className={styles.paragrafo}>
            O jogador com mais marcadores em um reino ao final da era <strong>controla</strong> esse
            reino e recebe as fichas de glória acumuladas nele.
          </p>
        </Secao>

        {/* ── Dragões ── */}
        <Secao id="dragoes" icone="🐉" titulo="Dragões">
          <p className={styles.paragrafo}>
            Cartas de Dragão são especiais: não pertencem a nenhuma tribo e podem ser usadas
            em bandos de qualquer cor. Mas cuidado — elas têm um efeito poderoso.
          </p>

          <div className={styles.dragaoBox}>
            <div className={styles.dragaoItem}>
              <span>🐉</span>
              <div>
                <strong>1º e 2º Dragão</strong>
                <p>Revelados normalmente. O contador de dragões avança.</p>
              </div>
            </div>
            <div className={styles.dragaoItem}>
              <span>💥</span>
              <div>
                <strong>3º Dragão</strong>
                <p>
                  A era encerra imediatamente. O jogador que revelou o 3º dragão começa
                  a próxima era com <strong>2 ações extras</strong>.
                </p>
              </div>
            </div>
          </div>
        </Secao>

        {/* ── Fim de Era ── */}
        <Secao id="fim-era" icone="⏳" titulo="Fim de Era">
          <div className={styles.passosList}>
            <Regra numero="1" texto="A era termina quando o 3º dragão é revelado ou o baralho esgota." />
            <Regra numero="2" texto="Calcula-se o controle de cada reino: quem tiver mais marcadores recebe as fichas de glória." />
            <Regra numero="3" texto="Todas as cartas na mão dos jogadores retornam ao baralho — não são descartadas." />
            <Regra numero="4" texto="O baralho é reembaralhado para a próxima era." />
            <Regra numero="5" texto="O jogador que revelou o 3º dragão começa a próxima era (com 2 ações extras)." />
          </div>
        </Secao>

        {/* ── Vitória ── */}
        <Secao id="vitoria" icone="🏆" titulo="Condição de Vitória">
          <p className={styles.paragrafo}>
            Após <strong>3 eras completas</strong>, os pontos de glória de todos os jogadores são
            somados. O jogador com mais pontos vence.
          </p>

          <div className={styles.empateBox}>
            <strong>Em caso de empate:</strong> vence o jogador com mais marcadores de controle
            posicionados no tabuleiro.
          </div>

          <div className={styles.dicaFinal}>
            <h4>Estratégia</h4>
            <ul>
              <li>Bandos grandes (5+) valem 6 pts — acumule cartas antes de jogar.</li>
              <li>Controlar reinos com muitas fichas acumuladas é decisivo no final de cada era.</li>
              <li>Fique de olho nos dragões — o 3º pode encerrar a era no pior momento.</li>
              <li>A habilidade do líder do bando pode mudar o rumo do jogo.</li>
            </ul>
          </div>
        </Secao>

      </div>
    </div>
  );
}
