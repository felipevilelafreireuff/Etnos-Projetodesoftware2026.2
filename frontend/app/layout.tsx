import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { LocaleProvider } from '@/src/contexts/LocaleContext';
import Header from '@/src/components/layout/Header';

export const metadata: Metadata = {
  title: 'EtNós — UFF 6º Período',
  description: 'Implementação digital do jogo de tabuleiro EtNós',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <LocaleProvider>
            <Header />
            <main style={{ paddingTop: 'var(--header-height)', minHeight: '100vh' }}>
              {children}
            </main>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
