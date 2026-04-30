import ptBR from './pt-BR';
import en    from './en';

export type { StringsShape } from './pt-BR';
export type Locale = 'pt-BR' | 'en';

export const LOCALES: Record<Locale, typeof ptBR> = { 'pt-BR': ptBR, en };

export const DEFAULT_STRINGS = ptBR;
