'use client';
import { useState, useRef, useCallback } from 'react';
import { diagramaService } from '@/src/services';
import { ASSETS } from '@/src/constants/assets';

export type TabDiagrama = 'classes' | 'jogar-bando' | 'comunicacao';
export type LangCodigo  = 'python' | 'typescript';

const EASTER_EGG_CLICKS     = 3;
const EASTER_EGG_TIMEOUT_MS = 1500;

export function useDiagramasScreen() {
  const [tab,       setTab]       = useState<TabDiagrama>('classes');
  const [lang,      setLang]      = useState<LangCodigo>('python');
  const [easterEgg, setEasterEgg] = useState(false);

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = useCallback(() => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    if (clickCountRef.current >= EASTER_EGG_CLICKS) {
      setEasterEgg(prev => !prev);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, EASTER_EGG_TIMEOUT_MS);
    }
  }, []);

  const classes     = diagramaService.getClasses();
  const jogarBando  = diagramaService.getJogarBando();
  const comunicacao = diagramaService.getComunicacao();
  const codigoPy    = diagramaService.getCodigoJogarBando();
  const codigoTs    = diagramaService.getCodigoJogarBandoTs();

  const mermaid =
    tab === 'classes'     ? classes    :
    tab === 'jogar-bando' ? jogarBando :
    comunicacao;

  const imagem =
    tab === 'classes'     ? ASSETS.diagramas.classes     :
    tab === 'jogar-bando' ? ASSETS.diagramas.sequencia   :
    ASSETS.diagramas.comunicacao;

  const codigo = lang === 'python' ? codigoPy : codigoTs;

  return { tab, setTab, lang, setLang, mermaid, imagem, loading: false, error: null, codigo, easterEgg, handleTitleClick };
}
