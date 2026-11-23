// Schlankes eigenes SVG-Liniendiagramm.
// Hauptlinie = 7-Tage-Durchschnitt, Einzelwerte nur als dezente Punkte.

import { averageSeries, type Point } from '../../domain/average';
import { diffDays, formatDayDot, formatShort } from '../../domain/dates';
import { formatNumber } from '../../domain/format';
import styles from './Progress.module.css';

interface Props {
  points: Point[];
  unit: string;
  label: string;
}

const WIDTH = 340;
const HEIGHT = 190;
const PAD = { top: 12, right: 12, bottom: 26, left: 40 };

/** Schöne Rasterwerte für die y-Achse, z. B. 104, 106, 108. */
function niceTicks(min: number, max: number): number[] {
  const range = Math.max(max - min, 1);
  const rough = range / 3;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= rough) ?? rough;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 0.001; v += step) ticks.push(Number(v.toFixed(2)));
  if (ticks[ticks.length - 1] < max) ticks.push(Number((start + ticks.length * step).toFixed(2)));
  return ticks;
}

export function LineChart({ points, unit, label }: Props) {
  if (points.length === 0) return null;

  const avg = averageSeries(points);
  const values = points.map((p) => p.value);
  const ticks = niceTicks(Math.min(...values), Math.max(...values));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  const first = points[0].date;
  const last = points[points.length - 1].date;
  const days = Math.max(diffDays(first, last), 1);

  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (date: string) =>
    PAD.left + (points.length === 1 ? innerW / 2 : (diffDays(first, date) / days) * innerW);
  const y = (v: number) => PAD.top + (1 - (v - yMin) / (yMax - yMin || 1)) * innerH;

  const path = avg
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.date).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(' ');
  const latest = avg[avg.length - 1];

  const summary =
    avg.length > 1
      ? `${label}, 7-Tage-Schnitt: von ${formatNumber(avg[0].value)} ${unit} am ${formatShort(first)} auf ${formatNumber(latest.value)} ${unit} am ${formatShort(last)}.`
      : `${label}: ${formatNumber(latest.value)} ${unit} am ${formatShort(last)}.`;

  return (
    <figure className={styles.chart}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.svg}
        role="img"
        aria-label={summary}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(t)}
              y2={y(t)}
              className={styles.grid}
            />
            <text x={PAD.left - 8} y={y(t)} className={styles.axisY}>
              {formatNumber(t)}
            </text>
          </g>
        ))}

        <text x={PAD.left} y={HEIGHT - 6} className={styles.axisX}>
          {formatDayDot(first)}
        </text>
        {points.length > 1 && (
          <text
            x={WIDTH - PAD.right}
            y={HEIGHT - 6}
            className={`${styles.axisX} ${styles.axisEnd}`}
          >
            {formatDayDot(last)}
          </text>
        )}

        {points.map((p, i) => (
          <circle
            key={`${p.date}-${i}`}
            cx={x(p.date)}
            cy={y(p.value)}
            r={3}
            className={styles.dot}
          />
        ))}

        {avg.length > 1 && <path d={path} className={styles.line} />}
        <circle cx={x(latest.date)} cy={y(latest.value)} r={4.5} className={styles.latest} />
      </svg>
      <figcaption className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendLine} aria-hidden /> 7-Tage-Schnitt
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} aria-hidden /> Einzelwerte
        </span>
        <span className={styles.legendUnit}>in {unit}</span>
      </figcaption>
    </figure>
  );
}
