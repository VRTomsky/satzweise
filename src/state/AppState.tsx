// Stellt deine Daten der ganzen App zur Verfügung und speichert jede Änderung sofort.

import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { createDefaultData } from '../data/defaults';
import type { AppData, IsoDate } from '../data/types';
import { todayIso } from '../domain/dates';
import { storage } from '../services/storage';
import { AppStateContext } from './context';
import { reducer } from './reducer';
import { parseAppData } from './schema';

function loadInitial(): AppData {
  const today = todayIso();
  return parseAppData(storage.load(), today) ?? createDefaultData(today);
}

/** Aktuelles Datum, das sich um Mitternacht und beim Zurückkehren in die App aktualisiert. */
function useToday(): IsoDate {
  const [today, setToday] = useState(todayIso);

  useEffect(() => {
    const update = () => setToday(todayIso());
    const id = window.setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return today;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, undefined, loadInitial);
  const today = useToday();

  useEffect(() => {
    storage.save(data);
  }, [data]);

  const value = useMemo(() => ({ data, dispatch, today }), [data, today]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
