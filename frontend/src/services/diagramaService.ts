import {
  DIAGRAMA_CLASSES,
  DIAGRAMA_SEQUENCIA,
  DIAGRAMA_COMUNICACAO,
  DIAGRAMA_JOGAR_BANDO,
  CODIGO_JOGAR_BANDO,
  CODIGO_JOGAR_BANDO_TS,
} from '../../../backend/ts/diagramas';

export const diagramaService = {
  getClasses:              (): string => DIAGRAMA_CLASSES,
  getSequencia:            (): string => DIAGRAMA_SEQUENCIA,
  getComunicacao:          (): string => DIAGRAMA_COMUNICACAO,
  getJogarBando:           (): string => DIAGRAMA_JOGAR_BANDO,
  getCodigoJogarBando:     (): string => CODIGO_JOGAR_BANDO,
  getCodigoJogarBandoTs:   (): string => CODIGO_JOGAR_BANDO_TS,
};
