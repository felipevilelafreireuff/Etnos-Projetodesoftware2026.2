'use client';
import { useStrings } from '@/src/contexts/LocaleContext';
import type { TabHome } from '@/src/hooks/home/useHomeScreen';
import styles from './RequisitosSection.module.css';

const RF = [
  { id: 'RF01', desc: 'O sistema deve montar o tabuleiro no início da partida.' },
  { id: 'RF02', desc: 'O sistema deve embaralhar os Glory Tokens e separar 3 por reino em ordem crescente.' },
  { id: 'RF03', desc: 'O sistema deve permitir que cada jogador escolha uma cor e receba suas fichas.' },
  { id: 'RF04', desc: 'O sistema deve utilizar sempre as mesmas 4 tribos em todas as partidas.' },
  { id: 'RF05', desc: 'O sistema deve fazer cada jogador sacar uma carta no início de era.' },
  { id: 'RF06', desc: 'O sistema deve revelar cartas iguais ao dobro do número de jogadores.' },
  { id: 'RF07', desc: 'O sistema deve embaralhar os 3 Dragões e adicioná-los ao deck após a distribuição inicial.' },
  { id: 'RF08', desc: 'O sistema deve definir o primeiro jogador aleatoriamente e gerar ordem de turno.' },
  { id: 'RF09', desc: 'O sistema deve permitir Recrutar Aliado ou Jogar um Bando por turno.' },
  { id: 'RF10', desc: 'O sistema deve permitir recrutar sacando do deck ou das cartas visíveis.' },
  { id: 'RF11', desc: 'Se o dragão for sacado do deck, o jogador saca outra carta.' },
  { id: 'RF12', desc: 'Com 10 cartas na mão, o jogador é obrigado a jogar um bando.' },
  { id: 'RF13', desc: 'O 3º Dragão revelado encerra a Era imediatamente.' },
  { id: 'RF14', desc: 'Um bando só é válido se todas as cartas forem da mesma Tribo ou mesma Região.' },
  { id: 'RF15', desc: 'O jogador escolhe um Líder, aplicando apenas sua habilidade.' },
  { id: 'RF16', desc: 'Após jogar o bando, o jogador descarta as cartas restantes da mão.' },
  { id: 'RF17', desc: 'Pontuação: 1–2 cartas → 0 pts; 3–4 cartas → 3 pts; 5+ cartas → 6 pts.' },
  { id: 'RF18', desc: 'Marcador só pode ser colocado se o tamanho do bando > fichas do reino.' },
  { id: 'RF19', desc: 'O jogador pode concluir sem colocar marcador caso não cumpra RF18.' },
  { id: 'RF20', desc: 'Ao fim de uma Era, todos devolvem as cartas ao baralho.' },
  { id: 'RF21', desc: 'Quem revelou o último Dragão começa a próxima Era com 2 jogadas.' },
  { id: 'RF22', desc: 'A partida encerra após o fim da 3ª Era.' },
  { id: 'RF23', desc: 'Vence o jogador com maior pontuação de Glória.' },
  { id: 'RF24', desc: 'Desempate: mais Fichas de Controle espalhadas pelas Regiões.' },
];

const RNF = [
  { id: 'RNF01', desc: 'Tempo de resposta inferior a 1 segundo para todas as ações.' },
  { id: 'RNF02', desc: 'Feedback visual claro sobre o estado do jogo a cada ação.' },
  { id: 'RNF03', desc: 'Ações válidas destacadas; ações inválidas bloqueadas automaticamente.' },
  { id: 'RNF04', desc: 'Ampliação de cartas ao hover ou por toque.' },
  { id: 'RNF05', desc: 'Código modular para facilitar futuras expansões.' },
  { id: 'RNF06', desc: 'Indicação clara de quem é o turno atual durante toda a partida.' },
];

interface Props {
  tab:    TabHome;
  setTab: (t: TabHome) => void;
}

export default function RequisitosSection({ tab, setTab }: Props) {
  const S     = useStrings();
  const items = tab === 'rf' ? RF : RNF;

  return (
    <section className={styles.section}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'rf'  ? styles.active : ''}`} onClick={() => setTab('rf')}>
          {S.home.rf}
        </button>
        <button className={`${styles.tab} ${tab === 'rnf' ? styles.active : ''}`} onClick={() => setTab('rnf')}>
          {S.home.rnf}
        </button>
      </div>
      <div className={styles.grid}>
        {items.map(item => (
          <div key={item.id} className={styles.card}>
            <span className={styles.id}>{item.id}</span>
            <p className={styles.desc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
