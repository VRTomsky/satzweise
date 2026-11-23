import { describe, expect, it } from 'vitest';
import type { AppData, Milestone } from '../data/types';
import { activeWeekDates, evaluateMilestones, nextMilestone } from './milestones';
import { complete, makeData } from './testUtils';

function find(milestones: Milestone[], criterionId: string) {
  for (const ms of milestones) {
    const c = ms.criteria.find((x) => x.id === criterionId);
    if (c) return c;
  }
  throw new Error(criterionId);
}

function measure(data: AppData, date: string, values: { weightKg?: number; waistCm?: number }) {
  data.measurements.push({ id: `${date}-${data.measurements.length}`, date, ...values });
  data.measurements.sort((a, b) => a.date.localeCompare(b.date));
}

describe('Etappen', () => {
  it('hakt „unter 100 kg“ nach dem 7-Tage-Schnitt ab', () => {
    const data = makeData('2026-11-23');
    measure(data, '2027-03-01', { weightKg: 101 });
    measure(data, '2027-03-03', { weightKg: 99 });
    let ms = evaluateMilestones(data.milestones, data);
    expect(find(ms, 's-gewicht').doneAt).toBeUndefined(); // Schnitt genau 100

    measure(data, '2027-03-05', { weightKg: 98 });
    ms = evaluateMilestones(data.milestones, data);
    expect(find(ms, 's-gewicht').doneAt).toBe('2027-03-05');
  });

  it('bleibt erreicht, wenn das Gewicht später wieder steigt', () => {
    const data = makeData('2026-11-23');
    measure(data, '2027-03-01', { weightKg: 99 });
    measure(data, '2027-04-01', { weightKg: 101 });
    const ms = evaluateMilestones(data.milestones, data);
    expect(find(ms, 's-gewicht').doneAt).toBe('2027-03-01');
  });

  it('nimmt das Ziel zurück, wenn der Messwert gelöscht wird', () => {
    const data = makeData('2026-11-23');
    measure(data, '2027-03-01', { weightKg: 99 });
    data.measurements = [];
    const ms = evaluateMilestones(data.milestones, data);
    expect(find(ms, 's-gewicht').doneAt).toBeUndefined();
  });

  it('misst den Bauchumfang ab der ersten Messung', () => {
    const data = makeData('2026-11-23');
    measure(data, '2026-11-23', { waistCm: 107 });
    measure(data, '2026-12-14', { waistCm: 103 });
    let ms = evaluateMilestones(data.milestones, data);
    expect(find(ms, 'g-bauch').doneAt).toBeUndefined();

    measure(data, '2027-01-11', { waistCm: 102 });
    ms = evaluateMilestones(data.milestones, data);
    expect(find(ms, 'g-bauch').doneAt).toBe('2027-01-11');
    expect(find(ms, 's-bauch').doneAt).toBeUndefined();
  });

  it('zählt Wochen mit mindestens 3 Krafttrainings', () => {
    const data = makeData('2026-11-23');
    // Woche 1: Mo, Di, Do (3 Krafttrainings) → zählt
    complete(data, '2026-11-23', '2026-11-24', '2026-11-26');
    // Woche 2: Mo, Mi (nur 1 Krafttraining + Aktivtag) → zählt nicht
    complete(data, '2026-11-30', '2026-12-02');
    // Woche 3 über den Jahreswechsel: Mo, Di, Fr
    complete(data, '2026-12-28', '2026-12-29', '2027-01-01');

    expect(activeWeekDates(data)).toEqual(['2026-11-26', '2027-01-01']);
  });

  it('hakt „12 Wochen dranbleiben“ in der zwölften aktiven Woche ab', () => {
    const data = makeData('2026-11-23');
    for (let week = 0; week < 12; week++) {
      const monday = new Date(Date.UTC(2026, 10, 23 + week * 7));
      const day = (offset: number) =>
        new Date(monday.getTime() + offset * 86_400_000).toISOString().slice(0, 10);
      complete(data, day(0), day(1), day(3));
    }
    const ms = evaluateMilestones(data.milestones, data);
    expect(find(ms, 'g-wochen').doneAt).toBe('2027-02-11');
  });

  it('markiert eine Etappe erst, wenn alle Ziele erreicht sind', () => {
    const data = makeData('2026-11-23');
    measure(data, '2026-11-23', { waistCm: 107 });
    measure(data, '2027-01-04', { waistCm: 101 });
    for (let week = 0; week < 12; week++) {
      const monday = new Date(Date.UTC(2026, 10, 23 + week * 7));
      const day = (offset: number) =>
        new Date(monday.getTime() + offset * 86_400_000).toISOString().slice(0, 10);
      complete(data, day(0), day(1), day(3));
    }
    let ms = evaluateMilestones(data.milestones, data);
    expect(ms[0].achievedAt).toBeUndefined();
    expect(nextMilestone(ms)?.id).toBe('gewohnheit');

    // Liegestütze hakst du selbst ab
    ms = ms.map((m) =>
      m.id !== 'gewohnheit'
        ? m
        : {
            ...m,
            criteria: m.criteria.map((c) =>
              c.type === 'manual' ? { ...c, doneAt: '2027-02-20' } : c,
            ),
          },
    );
    ms = evaluateMilestones(ms, data);
    expect(ms[0].achievedAt).toBe('2027-02-20');
    expect(nextMilestone(ms)?.id).toBe('sichtbar');
  });
});
