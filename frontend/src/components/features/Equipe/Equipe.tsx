'use client';
import { useStrings } from '@/src/contexts/LocaleContext';
import styles from './Equipe.module.css';

const MEMBROS = [
  { nome: 'Felipe Freire',                      papel: 'Desenvolvimento & Arquitetura',  iniciais: 'FF' },
  { nome: 'Leon Stevans',                       papel: 'Desenvolvimento Backend',         iniciais: 'LS' },
  { nome: 'Carlos Henrique Nascimento',         papel: 'Modelagem & Diagramas',          iniciais: 'CH' },
  { nome: 'Luiz Eduardo Ribeiro Abreu Miranda', papel: 'Requisitos & Documentação',      iniciais: 'LE' },
  { nome: 'Ricardo França',                     papel: 'Desenvolvimento Frontend',        iniciais: 'RF' },
  { nome: 'Jonathan Melo',                      papel: 'Testes & Qualidade',             iniciais: 'JM' },
];

const CORES = [
  'var(--color-reino-VERMELHO)',
  'var(--color-reino-AZUL)',
  'var(--color-reino-VERDE)',
  'var(--color-reino-AMARELO)',
  'var(--color-reino-ROXO)',
  'var(--color-reino-LARANJA)',
];

export default function Equipe() {
  const S = useStrings();
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.aurora} aria-hidden />
        <div className={styles.headerContent}>
          <h1 className={styles.titulo}>{S.equipe.titulo}</h1>
          <p className={styles.subtitulo}>{S.equipe.subtitulo}</p>
          <p className={styles.uni}>{S.equipe.universidade} · {S.equipe.disciplina}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {MEMBROS.map((membro, i) => (
          <div key={membro.nome} className={styles.card}>
            <div className={styles.avatar} style={{ background: CORES[i] }}>
              {membro.iniciais}
            </div>
            <div className={styles.info}>
              <h3 className={styles.nome}>{membro.nome}</h3>
              <p className={styles.papel}>{membro.papel}</p>
            </div>
            <div className={styles.barra} style={{ background: CORES[i] }} />
          </div>
        ))}
      </div>

      <div className={styles.projeto}>
        <h2 className={styles.projetoTitulo}>{S.equipe.sobreTitulo}</h2>
        <div className={styles.projetoGrid}>
          <div className={styles.projetoCard}>
            <span className={styles.projetoLabel}>{S.equipe.labels.disciplina}</span>
            <span className={styles.projetoValor}>{S.equipe.valores.disciplina}</span>
          </div>
          <div className={styles.projetoCard}>
            <span className={styles.projetoLabel}>{S.equipe.labels.periodo}</span>
            <span className={styles.projetoValor}>{S.equipe.valores.periodo}</span>
          </div>
          <div className={styles.projetoCard}>
            <span className={styles.projetoLabel}>{S.equipe.labels.universidade}</span>
            <span className={styles.projetoValor}>{S.equipe.valores.universidade}</span>
          </div>
          <div className={styles.projetoCard}>
            <span className={styles.projetoLabel}>{S.equipe.labels.projeto}</span>
            <span className={styles.projetoValor}>{S.equipe.valores.projeto}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
