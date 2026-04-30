import Spinner from '@/src/components/ui/Spinner';
import styles from './LoadingState.module.css';

export default function LoadingState({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className={styles.container}>
      <Spinner size={32} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
