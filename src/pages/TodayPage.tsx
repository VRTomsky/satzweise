import { PageHeader } from '../components/PageHeader';
import { formatLong } from '../domain/dates';
import { workoutForDay } from '../domain/schedule';
import { useApp } from '../state/useApp';

export function TodayPage() {
  const { data, today } = useApp();
  const workout = workoutForDay(data, today);
  return <PageHeader overline={formatLong(today)} title={workout.name} />;
}
