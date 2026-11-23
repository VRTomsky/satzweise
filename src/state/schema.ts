// Prüft gespeicherte oder importierte Daten und bringt sie auf die aktuelle Schema-Version.
// Ändert sich das Datenformat später, erhöhst du CURRENT_SCHEMA und ergänzt MIGRATIONS.

import { createDefaultData } from '../data/defaults';
import type { AppData, IsoDate } from '../data/types';

export const CURRENT_SCHEMA = 1;

type RawData = Record<string, unknown>;

/**
 * Schritt von Version n auf n + 1. Beispiel für später:
 * 1: (d) => ({ ...d, schemaVersion: 2, neuesFeld: [] })
 */
const MIGRATIONS: Record<number, (data: RawData) => RawData> = {};

function isRecord(value: unknown): value is RawData {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseAppData(raw: unknown, today: IsoDate): AppData | null {
  if (!isRecord(raw)) return null;

  let data: RawData = raw;
  let version = typeof data.schemaVersion === 'number' ? data.schemaVersion : 0;
  if (version < 1 || version > CURRENT_SCHEMA) return null;

  while (version < CURRENT_SCHEMA) {
    const step = MIGRATIONS[version];
    if (!step) return null;
    data = step(data);
    version += 1;
  }

  const defaults = createDefaultData(today);
  const settings = isRecord(data.settings) ? data.settings : {};

  return {
    schemaVersion: 1,
    settings: {
      ...defaults.settings,
      ...settings,
      weekPlan: {
        ...defaults.settings.weekPlan,
        ...(isRecord(settings.weekPlan) ? settings.weekPlan : {}),
      },
      reminder: {
        ...defaults.settings.reminder,
        ...(isRecord(settings.reminder) ? settings.reminder : {}),
      },
      benchLevels: isRecord(settings.benchLevels) ? settings.benchLevels : {},
    } as AppData['settings'],
    logs: (isRecord(data.logs) ? data.logs : {}) as AppData['logs'],
    measurements: (Array.isArray(data.measurements)
      ? data.measurements
      : []) as AppData['measurements'],
    milestones: (Array.isArray(data.milestones)
      ? data.milestones
      : defaults.milestones) as AppData['milestones'],
    timer: (isRecord(data.timer) ? data.timer : null) as AppData['timer'],
  };
}

/** Verpackung für den Export als Datei. */
export function toExportFile(data: AppData, now: Date = new Date()) {
  return { app: 'satzweise', exportedAt: now.toISOString(), data };
}

/** Liest eine Export-Datei (oder direkt gespeicherte Daten). */
export function parseImportFile(raw: unknown, today: IsoDate): AppData | null {
  if (isRecord(raw) && raw.app === 'satzweise' && 'data' in raw) {
    return parseAppData(raw.data, today);
  }
  return parseAppData(raw, today);
}
