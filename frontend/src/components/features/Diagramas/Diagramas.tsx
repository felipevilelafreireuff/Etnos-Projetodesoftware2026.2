'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDiagramasScreen } from '@/src/hooks/diagramas/useDiagramasScreen';
import { useStrings } from '@/src/contexts/LocaleContext';
import LoadingState from '@/src/components/shared/LoadingState';
import MermaidViewer from '../DiagramaClasses/components/MermaidViewer/MermaidViewer';
import styles from './Diagramas.module.css';

export default function Diagramas() {
  const S = useStrings();
  const {
    tab, setTab,
    lang, setLang,
    mermaid, imagem,
    loading, error, codigo,
    easterEgg, handleTitleClick,
  } = useDiagramasScreen();

  const [aberta, setAberta] = useState(false);

  useEffect(() => {
    if (!aberta) return;
    const fechar = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberta(false); };
    window.addEventListener('keydown', fechar);
    return () => window.removeEventListener('keydown', fechar);
  }, [aberta]);

  useEffect(() => { setAberta(false); }, [tab]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title} onClick={handleTitleClick}>
        {S.diagramas.titulo}
      </h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'classes' ? styles.active : ''}`}
          onClick={() => setTab('classes')}
        >
          {S.diagramas.tabClasses}
        </button>
        <button
          className={`${styles.tab} ${tab === 'jogar-bando' ? styles.active : ''}`}
          onClick={() => setTab('jogar-bando')}
        >
          {S.diagramas.tabSequencia}
        </button>
        <button
          className={`${styles.tab} ${tab === 'comunicacao' ? styles.active : ''}`}
          onClick={() => setTab('comunicacao')}
        >
          {S.diagramas.tabComunicacao}
        </button>
      </div>

      {loading && <LoadingState label={S.diagramas.carregando} />}
      {error   && <p className={styles.error}>{S.errors.network}</p>}

      {!easterEgg && (
        <>
          <div
            className={styles.imagemContainer}
            onClick={() => setAberta(true)}
            title="Clique para ampliar"
          >
            <Image src={imagem} alt={tab} fill className={styles.imagem} unoptimized />
          </div>

          {aberta && (
            <div className={styles.modal} onClick={() => setAberta(false)}>
              <button className={styles.modalFechar} onClick={() => setAberta(false)}>✕</button>
              <div className={styles.modalConteudo} onClick={e => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagem} alt={tab} className={styles.modalImg} />
              </div>
            </div>
          )}
        </>
      )}

      {easterEgg && mermaid && <MermaidViewer chart={mermaid} />}

      {(tab === 'jogar-bando' || tab === 'comunicacao') && codigo && (
        <div className={styles.codigoBloco}>
          <div className={styles.codigoHeader}>
            <h3 className={styles.codigoTitulo}>{S.diagramas.implementacao}</h3>
            <div className={styles.langToggle}>
              <button
                className={`${styles.langBtn} ${lang === 'python' ? styles.langActive : ''}`}
                onClick={() => setLang('python')}
              >
                Python
              </button>
              <button
                className={`${styles.langBtn} ${lang === 'typescript' ? styles.langActive : ''}`}
                onClick={() => setLang('typescript')}
              >
                TypeScript
              </button>
            </div>
          </div>
          <pre className={styles.codigo}><code>{codigo}</code></pre>
        </div>
      )}
    </div>
  );
}
