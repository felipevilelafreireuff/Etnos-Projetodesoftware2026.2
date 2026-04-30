'use client';
import { createContext, useContext, useState } from 'react';
import { LOCALES, DEFAULT_STRINGS } from '@/src/constants/strings';
import type { Locale, StringsShape } from '@/src/constants/strings';

interface LocaleContextValue {
  locale:       Locale;
  strings:      StringsShape;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale:       'pt-BR',
  strings:      DEFAULT_STRINGS,
  toggleLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale] = useState<Locale>('pt-BR');

  const toggleLocale = () => {};

  return (
    <LocaleContext.Provider value={{ locale, strings: LOCALES[locale], toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useStrings(): StringsShape {
  return useContext(LocaleContext).strings;
}
