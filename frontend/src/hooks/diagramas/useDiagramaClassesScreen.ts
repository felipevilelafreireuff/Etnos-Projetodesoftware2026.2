'use client';
import { diagramaService } from '@/src/services';

export function useDiagramaClassesScreen() {
  const mermaid = diagramaService.getClasses();
  return { mermaid, loading: false, error: null, refetch: () => {} };
}
