import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { icon } from '../components/icon';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { Segmented } from '../components/Segmented';
import type { Measurement } from '../data/types';
import { seriesOf, summarize, type MetricKey } from '../domain/average';
import { formatShort } from '../domain/dates';
import { formatNumber, formatSigned } from '../domain/format';
import { GoalCard } from '../features/progress/GoalCard';
import { LineChart } from '../features/progress/LineChart';
import { MeasurementSheet } from '../features/progress/MeasurementSheet';
import { MilestoneList } from '../features/progress/MilestoneList';
import styles from '../features/progress/Progress.module.css';
import { useApp } from '../state/useApp';

const METRICS: Record<MetricKey, { label: string; unit: string }> = {
  weightKg: { label: 'Gewicht', unit: 'kg' },
  waistCm: { label: 'Bauchumfang', unit: 'cm' },
};

const VISIBLE_ENTRIES = 8;

function describe(m: Measurement): string {
  return [
    m.weightKg !== undefined ? `${formatNumber(m.weightKg)} kg` : null,
    m.waistCm !== undefined ? `${formatNumber(m.waistCm)} cm Bauch` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function ProgressPage() {
  const { data, today } = useApp();
  const [metric, setMetric] = useState<MetricKey>('weightKg');
  const [editing, setEditing] = useState<Measurement | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { label, unit } = METRICS[metric];
  const points = seriesOf(data.measurements, metric);
  const summary = summarize(points);
  const entries = [...data.measurements].reverse();
  const visible = showAll ? entries : entries.slice(0, VISIBLE_ENTRIES);

  const openSheet = (m: Measurement | null) => {
    setEditing(m);
    setSheetOpen(true);
  };

  const stats: [string, string][] = [
    [
      'Aktuell (Schnitt)',
      summary.current !== null ? `${formatNumber(summary.current)} ${unit}` : '–',
    ],
    ['Seit Start', summary.sinceStart !== null ? formatSigned(summary.sinceStart, unit) : '–'],
    ['Letzte 4 Wochen', summary.last4Weeks !== null ? formatSigned(summary.last4Weeks, unit) : '–'],
  ];

  return (
    <>
      <PageHeader title="Fortschritt" />
      <GoalCard />

      <Section
        title="Messwerte"
        action={
          <Button variant="ghost" icon={<Plus {...icon} />} onClick={() => openSheet(null)}>
            Eintragen
          </Button>
        }
      >
        <Segmented
          label="Messgröße"
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'weightKg', label: 'Gewicht' },
            { value: 'waistCm', label: 'Bauchumfang' },
          ]}
        />

        {points.length === 0 ? (
          <Card className={styles.empty}>
            <p>Noch kein {label} eingetragen.</p>
            <p className={styles.meta}>
              Trag deinen Startwert ein. Ab dann zeigt das Diagramm den 7-Tage-Schnitt.
            </p>
            <Button variant="primary" onClick={() => openSheet(null)}>
              Startwert eintragen
            </Button>
          </Card>
        ) : (
          <Card>
            <dl className={styles.stats}>
              {stats.map(([term, value]) => (
                <div key={term} className={styles.stat}>
                  <dt>{term}</dt>
                  <dd className="num">{value}</dd>
                </div>
              ))}
            </dl>
            <LineChart points={points} unit={unit} label={label} />
          </Card>
        )}
      </Section>

      {entries.length > 0 && (
        <Section title="Einträge">
          <ul className={styles.entries}>
            {visible.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  className={styles.entry}
                  onClick={() => openSheet(m)}
                  aria-label={`${formatShort(m.date)}: ${describe(m)}. Bearbeiten`}
                >
                  <span className="num">{formatShort(m.date)}</span>
                  <span className={`${styles.entryValue} num`}>{describe(m)}</span>
                </button>
              </li>
            ))}
          </ul>
          {entries.length > VISIBLE_ENTRIES && (
            <Button variant="ghost" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Weniger anzeigen' : `Alle ${entries.length} anzeigen`}
            </Button>
          )}
        </Section>
      )}

      <Section title="Etappen" description="Ziele aus deinen Messwerten hakt die App selbst ab.">
        <MilestoneList />
      </Section>

      <MeasurementSheet
        open={sheetOpen}
        measurement={editing}
        today={today}
        onClose={() => setSheetOpen(false)}
      />
    </>
  );
}
