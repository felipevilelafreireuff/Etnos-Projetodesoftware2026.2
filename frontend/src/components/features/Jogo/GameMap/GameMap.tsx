'use client';

import React from 'react';
import styles from './GameMap.module.css';
import { useJogoStore } from '@/src/store/jogoStore';
import { useStrings } from '@/src/contexts/LocaleContext';
import { CorReino } from '../../../../../../backend/ts/enums';

const TERRITORIOS: Record<string, {
  d: string;
  labelX: number;
  labelY: number;
  icone: string;
  gradFrom: string;
  gradTo: string;
}> = {
  VERMELHO: {
    d: 'M 0,0 L 500,0 C 470,100 440,180 410,230 C 360,260 290,275 210,278 C 140,270 70,252 30,238 C 10,225 0,205 0,180 Z',
    labelX: 185, labelY: 135,
    icone: '🌋',
    gradFrom: '#9b2020', gradTo: '#3a0808',
  },
  VERDE: {
    d: 'M 500,0 L 1000,0 L 1000,235 C 870,250 770,262 700,270 C 630,262 570,245 520,225 C 505,190 500,90 500,0 Z',
    labelX: 760, labelY: 118,
    icone: '🌲',
    gradFrom: '#2d6e2d', gradTo: '#0f300f',
  },
  AZUL: {
    d: 'M 0,180 C 10,210 30,235 70,248 C 140,262 210,272 240,280 C 232,355 210,420 180,458 C 125,472 58,468 0,452 Z',
    labelX: 92, labelY: 315,
    icone: '🌊',
    gradFrom: '#1a5080', gradTo: '#071828',
  },
  ROXO: {
    d: 'M 210,278 C 290,275 360,260 410,230 C 440,180 505,190 520,225 C 570,245 630,262 700,270 C 728,332 722,405 695,450 C 620,480 535,490 465,486 C 395,482 325,464 275,438 C 248,403 238,340 240,280 Z',
    labelX: 468, labelY: 368,
    icone: '⛰️',
    gradFrom: '#5a2878', gradTo: '#200a30',
  },
  LARANJA: {
    d: 'M 0,452 C 58,468 125,472 180,458 C 210,420 232,355 240,280 C 238,340 248,403 275,438 C 325,464 395,482 465,486 C 458,548 430,600 390,638 C 302,660 160,668 0,662 Z',
    labelX: 155, labelY: 558,
    icone: '🌾',
    gradFrom: '#904a10', gradTo: '#3a1a04',
  },
  AMARELO: {
    d: 'M 465,486 C 535,490 620,480 695,450 C 722,405 728,332 700,270 C 770,262 870,250 1000,235 L 1000,680 L 0,680 L 0,662 C 160,668 302,660 390,638 C 430,600 458,548 465,486 Z',
    labelX: 755, labelY: 555,
    icone: '🏜️',
    gradFrom: '#907010', gradTo: '#3a2c04',
  },
};

const PLAYER_COLORS = ['#e05555', '#5580e0', '#50b850', '#d4a020', '#a050d0', '#e07830'];

export default function GameMap() {
  const S = useStrings();
  const jogo    = useJogoStore(s => s.jogo);
  const tick    = useJogoStore(s => s.tick);
  const posicionarMarcador = useJogoStore(s => s.posicionarMarcador);

  if (!jogo) return null;

  return (
    <div className={styles.container}>
      <svg
        className={styles.svg}
        viewBox="0 0 1000 680"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ── Oceano animado ── */}
          <pattern id="wavePattern" x="0" y="0" width="120" height="30" patternUnits="userSpaceOnUse">
            <path d="M 0,15 C 20,5 40,25 60,15 C 80,5 100,25 120,15" fill="none" stroke="rgba(80,140,200,0.18)" strokeWidth="2">
              <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-120 0" dur="6s" repeatCount="indefinite" />
            </path>
            <path d="M 0,22 C 15,14 35,30 60,22 C 85,14 105,30 120,22" fill="none" stroke="rgba(80,140,200,0.10)" strokeWidth="1.5">
              <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="-120 0" dur="9s" repeatCount="indefinite" />
            </path>
          </pattern>

          {/* ── Padrão: lava (Vermelho) ── */}
          <pattern id="pVermelho" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 5,20 L 12,8 L 20,18 L 28,6 L 35,20" fill="none" stroke="rgba(255,100,20,0.22)" strokeWidth="1.5" />
            <circle cx="20" cy="32" r="3" fill="rgba(255,60,0,0.15)" />
          </pattern>

          {/* ── Padrão: floresta (Verde) ── */}
          <pattern id="pVerde" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <polygon points="18,4 26,20 10,20" fill="rgba(60,160,60,0.20)" />
            <polygon points="18,14 24,28 12,28" fill="rgba(40,120,40,0.15)" />
          </pattern>

          {/* ── Padrão: ondas (Azul) ── */}
          <pattern id="pAzul" x="0" y="0" width="50" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0,10 C 12,2 25,18 50,10" fill="none" stroke="rgba(80,160,240,0.25)" strokeWidth="2" />
          </pattern>

          {/* ── Padrão: montanhas (Roxo) ── */}
          <pattern id="pRoxo" x="0" y="0" width="50" height="40" patternUnits="userSpaceOnUse">
            <polygon points="10,36 25,8 40,36" fill="rgba(160,100,220,0.14)" stroke="rgba(120,60,180,0.20)" strokeWidth="1" />
            <polygon points="28,36 40,18 52,36" fill="rgba(140,80,200,0.10)" />
          </pattern>

          {/* ── Padrão: savana (Laranja) ── */}
          <pattern id="pLaranja" x="0" y="0" width="30" height="24" patternUnits="userSpaceOnUse">
            <line x1="0" y1="18" x2="30" y2="18" stroke="rgba(200,120,30,0.20)" strokeWidth="1.5" />
            <line x1="4" y1="18" x2="6" y2="10" stroke="rgba(200,140,40,0.25)" strokeWidth="1" />
            <line x1="14" y1="18" x2="16" y2="8" stroke="rgba(200,140,40,0.25)" strokeWidth="1" />
            <line x1="24" y1="18" x2="26" y2="12" stroke="rgba(200,140,40,0.25)" strokeWidth="1" />
          </pattern>

          {/* ── Padrão: dunas (Amarelo) ── */}
          <pattern id="pAmarelo" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
            <path d="M 0,20 Q 30,6 60,20" fill="rgba(200,170,30,0.18)" />
            <path d="M 0,28 Q 30,14 60,28" fill="rgba(200,170,30,0.10)" />
          </pattern>

          {/* ── Gradientes radiais por reino ── */}
          {Object.entries(TERRITORIOS).map(([cor, t]) => (
            <radialGradient key={cor} id={`grad${cor}`} cx="50%" cy="45%" r="60%">
              <stop offset="0%"   stopColor={t.gradFrom} stopOpacity="0.92" />
              <stop offset="100%" stopColor={t.gradTo}   stopOpacity="0.98" />
            </radialGradient>
          ))}

          {/* ── Filtro de brilho (hover) ── */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* ── Sombra interna suave ── */}
          <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0" result="shadow" />
            <feComposite in2="SourceGraphic" operator="in" result="shadowCropped" />
            <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="shadowCropped" /></feMerge>
          </filter>
        </defs>

        {/* ── Fundo oceano ── */}
        <rect width="1000" height="680" fill="#071828" />
        <rect width="1000" height="680" fill="url(#wavePattern)" />
        <radialGradient id="oceanVignette" cx="50%" cy="50%" r="70%">
          <stop offset="30%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <rect width="1000" height="680" fill="url(#oceanVignette)" />

        {/* ── Territórios ── */}
        {jogo.reinos.map((reino) => {
          const t    = TERRITORIOS[reino.cor as string];
          const pId  = `p${reino.cor}`;
          if (!t) return null;

          const fichas    = reino.fichasGloria;
          const marcadores = reino.marcadores;
          const nomeLabel  = S.jogo.reinos[reino.cor as CorReino] ?? reino.cor;

          return (
            <g key={reino.cor} className={styles.reinoGroup} onClick={() => posicionarMarcador(reino.cor as CorReino)}>
              {/* Preenchimento com gradiente */}
              <path d={t.d} fill={`url(#grad${reino.cor})`} className={styles.reinoFill} />

              {/* Textura de terreno */}
              <path d={t.d} fill={`url(#${pId})`} className={styles.reinoTextura} />

              {/* Borda do território */}
              <path d={t.d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" className={styles.reinoBorda} />

              {/* Borda interna escura para profundidade */}
              <path d={t.d} fill="none" stroke="rgba(0,0,0,0.40)" strokeWidth="6" strokeLinejoin="round" className={styles.reinoBordaInterna} />

              {/* Ícone de terreno */}
              <text x={t.labelX} y={t.labelY - 36} textAnchor="middle" fontSize="28" className={styles.terrainIcon}>
                {t.icone}
              </text>

              {/* Nome do reino */}
              <rect
                x={t.labelX - 52} y={t.labelY - 22}
                width="104" height="24"
                rx="4"
                fill="rgba(0,0,0,0.55)"
              />
              <text x={t.labelX} y={t.labelY - 5} textAnchor="middle" className={styles.reinoNome}>
                {nomeLabel}
              </text>

              {/* Fichas de Glória */}
              <g transform={`translate(${t.labelX}, ${t.labelY + 22})`}>
                {fichas.map((ficha, idx) => {
                  const offset = (idx - (fichas.length - 1) / 2) * 32;
                  return (
                    <g key={idx} transform={`translate(${offset}, 0)`}>
                      <polygon
                        points="0,-13 11,-6 11,6 0,13 -11,6 -11,-6"
                        fill={ficha.atribuida ? 'rgba(80,80,80,0.7)' : '#d4af37'}
                        stroke={ficha.atribuida ? 'rgba(120,120,120,0.5)' : '#f0cc55'}
                        strokeWidth="1.5"
                        className={styles.fichaGloria}
                      />
                      <text textAnchor="middle" y="4" className={styles.fichaValor}>
                        {ficha.valor}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* Marcadores dos jogadores */}
              <g transform={`translate(${t.labelX}, ${t.labelY + 68})`}>
                {marcadores.map((m, idx) => {
                  const angle  = (idx / Math.max(marcadores.length, 1)) * Math.PI * 2 - Math.PI / 2;
                  const radius = marcadores.length > 1 ? 18 : 0;
                  const mx     = Math.cos(angle) * radius;
                  const my     = Math.sin(angle) * radius;
                  const pIdx   = jogo.jogadores.findIndex(j => j.id === m.jogador.id);
                  const cor    = PLAYER_COLORS[pIdx >= 0 ? pIdx : 0];
                  return (
                    <g key={idx} transform={`translate(${mx}, ${my})`}>
                      <circle r="10" fill={cor} stroke="rgba(255,255,255,0.9)" strokeWidth="2" className={styles.marcador} />
                      <text textAnchor="middle" y="4" className={styles.marcadorInicial}>
                        {m.jogador.nome[0]?.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          );
        })}

        {/* ── Decorações de borda do mapa ── */}
        <rect x="2" y="2" width="996" height="676" fill="none" stroke="rgba(180,140,60,0.25)" strokeWidth="3" rx="4" />
        <rect x="8" y="8" width="984" height="664" fill="none" stroke="rgba(180,140,60,0.12)" strokeWidth="1.5" rx="2" />
      </svg>
    </div>
  );
}
