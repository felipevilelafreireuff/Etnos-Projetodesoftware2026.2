'use client';
import { useState } from 'react';
import { diagramaService } from '@/src/services';

export type TabDiagrama = 'classes' | 'jogar-bando' | 'comunicacao';

export function useDiagramasScreen() {
  const [tab, setTab] = useState<TabDiagrama>('classes');

  const classes     = diagramaService.getClasses();
  const jogarBando  = diagramaService.getJogarBando();
  const comunicacao = diagramaService.getComunicacao();
  const codigo      = diagramaService.getCodigoJogarBando();

  const mermaid =
    tab === 'classes'     ? classes    :
    tab === 'jogar-bando' ? jogarBando :
    comunicacao;

  return { tab, setTab, mermaid, loading: false, error: null, codigo };
}
