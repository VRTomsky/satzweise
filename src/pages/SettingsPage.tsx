import { Target } from 'lucide-react';
import { Field } from '../components/Field';
import fieldStyles from '../components/Field.module.css';
import { icon } from '../components/icon';
import { List, ListRow } from '../components/ListRow';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { Select } from '../components/Select';
import { Toggle } from '../components/Toggle';
import { EXERCISES } from '../data/exercises';
import { WORKOUTS } from '../data/plan';
import type { BenchSetting, Weekday } from '../data/types';
import { isIsoDate, WEEKDAY_NAMES } from '../domain/dates';
import { DataSettings } from '../features/settings/DataSettings';
import { ReminderSettings } from '../features/settings/ReminderSettings';
import styles from '../features/settings/Settings.module.css';
import { useApp } from '../state/useApp';

const BENCH_ORDER: BenchSetting[] = ['flach', '30°', '30–45°', '45°', 'fast senkrecht'];
const USED_BENCH = BENCH_ORDER.filter((b) => EXERCISES.some((e) => e.bench === b));
const LEVELS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5, 6, 7];

export function SettingsPage() {
  const { data, dispatch } = useApp();
  const { settings } = data;
  const update = (patch: Partial<typeof settings>) => dispatch({ type: 'settings/update', patch });

  return (
    <>
      <PageHeader back={{ to: '/mehr', label: 'Mehr' }} title="Einstellungen" />

      <Section title="Ziel">
        <Field label="Mein Ziel" htmlFor="goal">
          <textarea
            id="goal"
            className={fieldStyles.input}
            rows={4}
            value={settings.goalText}
            onChange={(e) => update({ goalText: e.target.value })}
          />
        </Field>
        <Field label="Mein Warum" htmlFor="why-settings">
          <textarea
            id="why-settings"
            className={fieldStyles.input}
            rows={4}
            value={settings.why}
            placeholder="Warum machst du das?"
            onChange={(e) => update({ why: e.target.value })}
          />
        </Field>
        <List>
          <ListRow
            to="/mehr/einstellungen/etappen"
            leading={<Target {...icon} />}
            title="Etappen bearbeiten"
            meta={`${data.milestones.length} Etappen`}
          />
        </List>
      </Section>

      <Section title="Wochenplan" description="Welches Training an welchem Tag dran ist.">
        <div className={styles.weekGrid}>
          {WEEKDAYS.map((day) => (
            <Field key={day} label={WEEKDAY_NAMES[day]} htmlFor={`day-${day}`}>
              <Select
                id={`day-${day}`}
                value={settings.weekPlan[day]}
                onChange={(e) =>
                  update({ weekPlan: { ...settings.weekPlan, [day]: e.target.value } })
                }
              >
                {WORKOUTS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </Select>
            </Field>
          ))}
        </div>
        <Field
          label="Programmstart"
          htmlFor="start-date"
          hint="Ab hier zählen deine Serie und die leichte Woche (jede 8. Woche)."
        >
          <input
            id="start-date"
            type="date"
            className={fieldStyles.input}
            value={settings.startDate}
            onChange={(e) => isIsoDate(e.target.value) && update({ startDate: e.target.value })}
          />
        </Field>
      </Section>

      <Section
        title="Bank-Stufen"
        description="Welche Stufe deiner Bank passt zu welchem Winkel? Dann steht in den Übungen direkt die Stufe."
      >
        <div className={styles.grid}>
          {USED_BENCH.map((bench) => (
            <Field key={bench} label={bench} htmlFor={`bench-${bench}`}>
              <Select
                id={`bench-${bench}`}
                value={settings.benchLevels[bench] ?? ''}
                onChange={(e) =>
                  update({
                    benchLevels: { ...settings.benchLevels, [bench]: e.target.value || undefined },
                  })
                }
              >
                <option value="">nicht festgelegt</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    Stufe {l}
                  </option>
                ))}
              </Select>
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Training">
        <Toggle
          label="Gewicht pro Satz eintragen"
          description="Zeigt beim Training zusätzlich ein Feld für kg"
          checked={settings.showWeightField}
          onChange={(showWeightField) => update({ showWeightField })}
        />
      </Section>

      <Section title="Erinnerung">
        <ReminderSettings />
      </Section>

      <Section title="Daten">
        <DataSettings />
      </Section>

      <Section title="Über">
        <dl className={styles.about}>
          <div>
            <dt>Version</dt>
            <dd className="num">{__APP_VERSION__}</dd>
          </div>
          <div>
            <dt>Übungsbilder</dt>
            <dd>
              <a
                href="https://github.com/yuhonas/free-exercise-db"
                target="_blank"
                rel="noopener noreferrer"
              >
                free-exercise-db
              </a>{' '}
              von yuhonas, Public Domain (Unlicense)
            </dd>
          </div>
          <div>
            <dt>Datenschutz</dt>
            <dd>Kein Konto, kein Server, kein Tracking. Alles bleibt auf diesem Gerät.</dd>
          </div>
        </dl>
      </Section>
    </>
  );
}
