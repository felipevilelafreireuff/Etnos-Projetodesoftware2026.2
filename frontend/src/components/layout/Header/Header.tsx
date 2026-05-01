'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useStrings } from '@/src/contexts/LocaleContext';
import { ROUTES } from '@/src/constants/routes';
import styles from './Header.module.css';

export default function Header() {
  const pathname               = usePathname();
  const { theme, toggleTheme } = useTheme();
  const S                      = useStrings();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { label: S.nav.home,      href: ROUTES.HOME      },
    { label: S.nav.jogo,      href: ROUTES.JOGO      },
    { label: S.nav.diagramas, href: ROUTES.DIAGRAMAS },
    { label: S.nav.manual,    href: ROUTES.MANUAL    },
    { label: S.nav.equipe,    href: ROUTES.EQUIPE    },
  ];

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <span className={styles.logo}>EtNós</span>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
            onClick={handleNavClick}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.controls}>
        <button className={styles.toggle} onClick={toggleTheme} title={theme === 'light' ? S.nav.darkMode : S.nav.lightMode}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </header>
  );
}
