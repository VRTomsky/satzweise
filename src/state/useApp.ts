import { useContext } from 'react';
import { AppStateContext, type AppState } from './context';

export function useApp(): AppState {
  const state = useContext(AppStateContext);
  if (!state) throw new Error('useApp muss innerhalb von AppStateProvider benutzt werden.');
  return state;
}
