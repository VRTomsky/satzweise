// Startwerte für Ziel, Etappen und Einstellungen. Alles davon kannst du in der App ändern.

import { DEFAULT_WEEK_PLAN } from './plan';
import type { AppData, IsoDate, Milestone, Settings } from './types';

export const DEFAULT_GOAL_TEXT =
  'In einigen Jahren athletisch und schlank: etwa 85–92 kg, breite Schultern und sichtbare Bauchmuskeln. Jason Duval ist die Richtung, nicht die Messlatte.';

export const DEFAULT_REMINDER_TIME = '18:30';

export function createDefaultMilestones(): Milestone[] {
  return [
    {
      id: 'gewohnheit',
      title: 'Gewohnheit',
      horizon: 'ca. 3 Monate',
      criteria: [
        { id: 'g-wochen', type: 'activeWeeks', weeks: 12, label: '12 Wochen dranbleiben' },
        { id: 'g-liegestuetze', type: 'manual', label: '10 saubere Liegestütze am Boden' },
        { id: 'g-bauch', type: 'waistDelta', cm: 5, label: 'Bauchumfang −5 cm' },
      ],
    },
    {
      id: 'sichtbar',
      title: 'Sichtbarer Fortschritt',
      horizon: 'ca. 6–12 Monate',
      criteria: [
        { id: 's-gewicht', type: 'weightBelow', kg: 100, label: 'Unter 100 kg' },
        { id: 's-liegestuetze', type: 'manual', label: '20 Liegestütze am Stück' },
        { id: 's-bauch', type: 'waistDelta', cm: 10, label: 'Bauchumfang −10 cm' },
        { id: 's-klimmzug', type: 'manual', label: 'Klimmzug-Training gestartet' },
      ],
    },
    {
      id: 'athletisch',
      title: 'Athletisch',
      horizon: '1–2 Jahre',
      criteria: [
        {
          id: 'a-bauch',
          type: 'waistDelta',
          cm: 15,
          label: 'Bauchumfang deutlich kleiner (−15 cm)',
        },
        { id: 'a-schultern', type: 'manual', label: 'Breitere Schultern sichtbar' },
        { id: 'a-klimmzuege', type: 'manual', label: '10 Klimmzüge' },
      ],
    },
    {
      id: 'langfristig',
      title: 'Langfristiges Ziel',
      horizon: 'mehrere Jahre',
      criteria: [
        { id: 'l-gewicht', type: 'weightRange', minKg: 85, maxKg: 92, label: 'Ca. 85–92 kg' },
        { id: 'l-koerper', type: 'manual', label: 'Athletischer, schlanker Körper' },
        { id: 'l-bauchmuskeln', type: 'manual', label: 'Sichtbare Bauchmuskeln' },
      ],
    },
  ];
}

export function createDefaultSettings(today: IsoDate): Settings {
  return {
    weekPlan: { ...DEFAULT_WEEK_PLAN },
    benchLevels: {},
    reminder: { enabled: false, time: DEFAULT_REMINDER_TIME },
    showWeightField: false,
    goalText: DEFAULT_GOAL_TEXT,
    why: '',
    startDate: today,
  };
}

export function createDefaultData(today: IsoDate): AppData {
  return {
    schemaVersion: 1,
    settings: createDefaultSettings(today),
    logs: {},
    measurements: [],
    milestones: createDefaultMilestones(),
    timer: null,
  };
}
