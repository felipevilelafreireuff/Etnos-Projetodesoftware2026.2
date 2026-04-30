'use client';
import { useDiagramasScreen } from '@/src/hooks/diagramas/useDiagramasScreen';
import { useStrings } from '@/src/contexts/LocaleContext';
import LoadingState from '@/src/components/shared/LoadingState';
import MermaidViewer from '../DiagramaClasses/components/MermaidViewer/MermaidViewer';
import styles from './Diagramas.module.css';

export default function Diagramas() {
  const S = useStrings();
  const { tab, setTab, mermaid, loading, error, codigo } = useDiagramasScreen();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Diagramas</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'classes' ? styles.active : ''}`}
          onClick={() => setTab('classes')}
        >
          Classes
        </button>
        <button
          className={`${styles.tab} ${tab === 'jogar-bando' ? styles.active : ''}`}
          onClick={() => setTab('jogar-bando')}
        >
          Sequência — jogarBando()
        </button>
        <button
          className={`${styles.tab} ${tab === 'comunicacao' ? styles.active : ''}`}
          onClick={() => setTab('comunicacao')}
        >
          Comunicação — jogarBando()
        </button>
      </div>

      {loading && <LoadingState label={S.diagramas.carregando} />}
      {error   && <p className={styles.error}>{S.errors.network}</p>}
      {mermaid && <MermaidViewer chart={mermaid} />}
      {tab === 'jogar-bando' && codigo && (
        <div className={styles.codigoBloco}>
          <h3 className={styles.codigoTitulo}>Implementação</h3>
          <pre className={styles.codigo}><code>{codigo}</code></pre>
        </div>
      )}
    </div>
  );
}
