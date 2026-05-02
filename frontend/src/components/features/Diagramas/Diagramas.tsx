'use client';
import Image from 'next/image';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useDiagramasScreen } from '@/src/hooks/diagramas/useDiagramasScreen';
import { useStrings } from '@/src/contexts/LocaleContext';
import LoadingState from '@/src/components/shared/LoadingState';
import MermaidViewer from '../DiagramaClasses/components/MermaidViewer/MermaidViewer';
import styles from './Diagramas.module.css';

function ImagemZoom({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen]   = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos]     = useState({ x: 0, y: 0 });
  const dragging  = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const openLightbox  = useCallback(() => { setOpen(true); setScale(1); setPos({ x: 0, y: 0 }); }, []);
  const closeLightbox = useCallback(() => setOpen(false), []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.min(8, Math.max(0.5, s - e.deltaY * 0.002)));
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPos(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className={styles.imagemContainer} onClick={openLightbox} title="Clique para ampliar">
        <Image src={src} alt={alt} fill className={styles.imagem} unoptimized />
        <div className={styles.zoomHint}>🔍</div>
      </div>

      {open && (
        <div
          className={styles.lightboxOverlay}
          onClick={closeLightbox}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <button className={styles.lightboxClose} onClick={closeLightbox}>✕</button>
          <div
            className={styles.lightboxInner}
            onClick={e => e.stopPropagation()}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, cursor: dragging.current ? 'grabbing' : 'grab' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className={styles.lightboxImg} draggable={false} />
          </div>
          <div className={styles.lightboxDica}>Scroll para zoom · Arraste para mover · Esc para fechar</div>
        </div>
      )}
    </>
  );
}

export default function Diagramas() {
  const S = useStrings();
  const {
    tab, setTab,
    lang, setLang,
    mermaid, imagem,
    loading, error, codigo,
    easterEgg, handleTitleClick,
  } = useDiagramasScreen();

  return (
    <div className={styles.page}>
      <h1
        className={styles.title}
        onClick={handleTitleClick}
      >
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

      {!easterEgg && <ImagemZoom src={imagem} alt={tab} />}

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
