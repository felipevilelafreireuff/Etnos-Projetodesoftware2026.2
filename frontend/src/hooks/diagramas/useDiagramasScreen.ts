'use client';
import { useState } from 'react';
import { diagramaService } from '@/src/services';

export type TabDiagrama = 'classes' | 'jogar-bando' | 'comunicacao';
export type LangCodigo  = 'python' | 'typescript';

export function useDiagramasScreen() {
  const [tab,  setTab]  = useState<TabDiagrama>('classes');
  const [lang, setLang] = useState<LangCodigo>('python');

  const classes     = diagramaService.getClasses();
  const jogarBando  = diagramaService.getJogarBando();
  const comunicacao = diagramaService.getComunicacao();
  const codigoPy    = diagramaService.getCodigoJogarBando();
  const codigoTs    = diagramaService.getCodigoJogarBandoTs();

  const mermaid =
    tab === 'classes'     ? classes    :
    tab === 'jogar-bando' ? jogarBando :
    comunicacao;

  const codigo = lang === 'python' ? codigoPy : codigoTs;

  return { tab, setTab, lang, setLang, mermaid, loading: false, error: null, codigo };
}
