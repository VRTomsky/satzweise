import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DayPage } from './pages/DayPage';
import { ExercisePage } from './pages/ExercisePage';
import { MorePage } from './pages/MorePage';
import { ProgressPage } from './pages/ProgressPage';
import { TodayPage } from './pages/TodayPage';
import { WeekPage } from './pages/WeekPage';
import { AppStateProvider } from './state/AppState';

export function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<TodayPage />} />
            <Route path="woche" element={<WeekPage />} />
            <Route path="woche/:date" element={<DayPage />} />
            <Route path="uebung/:exerciseId" element={<ExercisePage />} />
            <Route path="fortschritt" element={<ProgressPage />} />
            <Route path="mehr" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
}
