import { useEffect, useRef, type CSSProperties } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TimerBar } from '../features/timer/TimerBar';
import { useApp } from '../state/useApp';
import styles from './Layout.module.css';
import { TabBar } from './TabBar';

export function Layout() {
  const { pathname } = useLocation();
  const { data } = useApp();
  const first = useRef(true);

  // Nach einem Seitenwechsel nach oben scrollen und den Fokus auf die Überschrift setzen,
  // damit Screenreader die neue Seite ansagen.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true });
  }, [pathname]);

  // Platz unten freihalten, solange die Timer-Leiste sichtbar ist.
  const mainStyle = { '--bottom-extra': data.timer ? '72px' : '0px' } as CSSProperties;

  return (
    <>
      {/* Kein normaler #-Link, weil der HashRouter das # für die Seiten benutzt. */}
      <button
        type="button"
        className="skip-link"
        onClick={() => document.querySelector<HTMLElement>('main h1')?.focus()}
      >
        Zum Inhalt springen
      </button>
      <main id="main" className={styles.main} style={mainStyle}>
        <Outlet />
      </main>
      <TimerBar />
      <TabBar />
    </>
  );
}
