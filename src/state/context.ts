import { createContext } from 'react';
import type { AppData, IsoDate } from '../data/types';
import type { Action } from './reducer';

export interface AppState {
  data: AppData;
  dispatch: (action: Action) => void;
  today: IsoDate;
}

export const AppStateContext = createContext<AppState | null>(null);
