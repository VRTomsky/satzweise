import type { DayStatus } from '../../domain/streak';

const LABELS: Record<DayStatus, string> = {
  done: 'Erledigt',
  rest: 'Ruhetag',
  paused: 'Pausiert',
  open: 'Offen',
  missed: 'Offen',
  future: 'Offen',
};

export function statusLabel(status: DayStatus): string {
  return LABELS[status];
}
