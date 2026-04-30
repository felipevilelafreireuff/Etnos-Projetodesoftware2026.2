'use client';
import { useStrings } from '@/src/contexts/LocaleContext';
import styles from './VisaoGeralSection.module.css';

const ICONES = ['🎲', '⚙️', '🖥️', '🔁', '📋', '📊'];

export default function VisaoGeralSection() {
  const S = useStrings();
  const cards = [
    S.home.cards.visaoGeral,
    S.home.cards.stack,
    S.home.cards.plataforma,
    S.home.cards.abordagem,
    S.home.cards.requisitos,
    S.home.cards.gestao,
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.titulo}>{S.home.visaoGeral}</h2>
      <div className={styles.grid}>
        {cards.map((card, i) => (
          <div key={card.titulo} className={styles.card}>
            <span className={styles.icone}>{ICONES[i]}</span>
            <h3 className={styles.cardTitulo}>{card.titulo}</h3>
            <p className={styles.cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
