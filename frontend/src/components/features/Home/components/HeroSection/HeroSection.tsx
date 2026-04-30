'use client';
import { useStrings } from '@/src/contexts/LocaleContext';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const S = useStrings();
  return (
    <section className={styles.hero}>
      <div className={styles.aurora} aria-hidden />
      <div className={styles.content}>
        <div className={styles.badge}>{S.home.badge}</div>
        <h1 className={styles.title}>{S.home.titulo}</h1>
        <p className={styles.subtitle}>{S.home.subtitulo}</p>
        <p className={styles.desc}>{S.home.descricao}</p>
      </div>
    </section>
  );
}
