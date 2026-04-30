'use client';
import { useDiagramaClassesScreen } from '@/src/hooks/diagramas/useDiagramaClassesScreen';
import { useStrings } from '@/src/contexts/LocaleContext';
import LoadingState from '@/src/components/shared/LoadingState';
import MermaidViewer from './components/MermaidViewer/MermaidViewer';
import styles from './DiagramaClasses.module.css';

export default function DiagramaClasses() {
  const S = useStrings();
  const { mermaid, loading, error } = useDiagramaClassesScreen();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{S.diagramas.classes}</h1>
      {loading && <LoadingState label={S.diagramas.carregando} />}
      {error   && <p className={styles.error}>{S.errors.network}</p>}
      {mermaid && <MermaidViewer chart={mermaid} />}
    </div>
  );
}
