'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './MermaidViewer.module.css';

interface MermaidViewerProps {
  chart: string;
}

function getMermaidConfig(isDark: boolean) {
  if (isDark) {
    return {
      theme: 'dark' as const,
      themeVariables: {
        primaryColor:        '#1c1812',
        primaryTextColor:    '#f5e6c8',
        primaryBorderColor:  '#d4a017',
        lineColor:           '#a89070',
        secondaryColor:      '#2a2118',
        tertiaryColor:       '#0f0d0a',
        background:          '#0f0d0a',
        mainBkg:             '#1c1812',
        nodeBorder:          '#d4a017',
        clusterBkg:          '#2a2118',
        titleColor:          '#d4a017',
        edgeLabelBackground: '#1c1812',
        fontSize:            '15px',
        // sequência
        actorBkg:            '#2a2118',
        actorBorder:         '#d4a017',
        actorTextColor:      '#f5e6c8',
        actorLineColor:      '#d4a017',
        activationBorderColor: '#d4a017',
        activationBkgColor:  '#2a2118',
        signalColor:         '#c8a87a',
        signalTextColor:     '#f5e6c8',
        labelBoxBkgColor:    '#1c1812',
        labelBoxBorderColor: '#d4a017',
        labelTextColor:      '#f5e6c8',
        loopTextColor:       '#f5e6c8',
        noteBorderColor:     '#d4a017',
        noteBkgColor:        '#2a2118',
        noteTextColor:       '#f5e6c8',
      },
    };
  }

  return {
    theme: 'base' as const,
    themeVariables: {
      primaryColor:        '#EDE8DF',
      primaryTextColor:    '#2B2B2B',
      primaryBorderColor:  '#C05E42',
      lineColor:           '#6B5B4A',
      secondaryColor:      '#E3DDD3',
      tertiaryColor:       '#F5F2ED',
      background:          '#F5F2ED',
      mainBkg:             '#EDE8DF',
      nodeBorder:          '#C05E42',
      clusterBkg:          '#E3DDD3',
      titleColor:          '#C05E42',
      edgeLabelBackground: '#EDE8DF',
      fontSize:            '15px',
      // sequência
      actorBkg:            '#EDE8DF',
      actorBorder:         '#C05E42',
      actorTextColor:      '#2B2B2B',
      actorLineColor:      '#C05E42',
      activationBorderColor: '#C05E42',
      activationBkgColor:  '#EDE8DF',
      signalColor:         '#6B5B4A',
      signalTextColor:     '#2B2B2B',
      labelBoxBkgColor:    '#EDE8DF',
      labelBoxBorderColor: '#C05E42',
      labelTextColor:      '#2B2B2B',
      loopTextColor:       '#2B2B2B',
      noteBorderColor:     '#C8922A',
      noteBkgColor:        '#FFF8E8',
      noteTextColor:       '#2B2B2B',
    },
  };
}

export default function MermaidViewer({ chart }: MermaidViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') === 'dark'
      : false
  );

  // Detecta mudança de tema
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current || !chart) return;

    import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, sequence: { mirrorActors: false, boxTextMargin: 4 }, ...getMermaidConfig(isDark) });

      const id = `mermaid-${Date.now()}`;
      ref.current!.innerHTML = '';

      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
    });
  }, [chart, isDark]);

  return <div ref={ref} className={styles.viewer} />;
}
