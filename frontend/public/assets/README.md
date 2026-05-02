# Assets — EtNós

Pasta para os PNGs exportados do Unreal Engine.
Enquanto os arquivos não existem, o jogo usa gradientes/SVG como fallback automático.

## Estrutura esperada

```
assets/
├── map/
│   └── mapa-fundo.png        ← Render completo do mapa (1000×680 ou maior)
├── tribos/
│   ├── TRIBO_1.png           ← Arte do personagem da Tribo 1
│   ├── TRIBO_2.png           ← Arte do personagem da Tribo 2
│   ├── TRIBO_3.png           ← Arte do personagem da Tribo 3
│   ├── TRIBO_4.png           ← Arte do personagem da Tribo 4
│   └── DRAGAO.png            ← Arte do Dragão
└── ui/
    └── setup-bg.png          ← Background da tela de configuração da partida
```

## Como trocar os assets

Todos os caminhos estão centralizados em:
`frontend/src/constants/assets.ts`

Basta colocar os PNGs nas pastas acima — nenhuma mudança de código necessária.

## Especificações sugeridas para o Unreal Engine

| Asset | Resolução | Formato |
|---|---|---|
| `mapa-fundo.png` | 2000×1360 (2×) | PNG sem fundo ou com fundo oceano |
| `TRIBO_*.png` | 256×341 (proporção 3:4) | PNG com fundo transparente |
| `DRAGAO.png` | 256×341 (proporção 3:4) | PNG com fundo transparente |
| `setup-bg.png` | 1920×1080 | PNG ou JPG |
