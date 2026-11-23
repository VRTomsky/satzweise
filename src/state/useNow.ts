import { useEffect, useState } from 'react';

/** Aktuelle Uhrzeit, die sich regelmäßig aktualisiert. */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const update = () => setNow(new Date());
    const id = window.setInterval(update, intervalMs);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', update);
    };
  }, [intervalMs]);
  return now;
}
