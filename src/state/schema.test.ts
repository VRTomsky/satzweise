import { describe, expect, it } from 'vitest';
import { createDefaultData } from '../data/defaults';
import { parseAppData, parseImportFile, toExportFile } from './schema';

const today = '2026-11-23';

describe('schema', () => {
  it('lehnt ungültige Daten ab', () => {
    expect(parseAppData(null, today)).toBeNull();
    expect(parseAppData('hallo', today)).toBeNull();
    expect(parseAppData({ schemaVersion: 99 }, today)).toBeNull();
  });

  it('ergänzt fehlende Felder mit Standardwerten', () => {
    const data = parseAppData({ schemaVersion: 1, settings: { why: 'Für mich' } }, today);
    expect(data?.settings.why).toBe('Für mich');
    expect(data?.settings.weekPlan[1]).toBe('oberkoerper-a');
    expect(data?.milestones.length).toBe(4);
  });

  it('übersteht Export und Import unverändert', () => {
    const original = createDefaultData(today);
    original.measurements.push({ id: 'm1', date: today, weightKg: 100 });
    const file = JSON.parse(JSON.stringify(toExportFile(original))) as unknown;
    expect(parseImportFile(file, today)).toEqual(original);
  });
});
