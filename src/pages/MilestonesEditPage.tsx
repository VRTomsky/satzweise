import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Field } from '../components/Field';
import fieldStyles from '../components/Field.module.css';
import { icon, iconSm } from '../components/icon';
import { DecimalInput } from '../components/NumberInput';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { createDefaultMilestones } from '../data/defaults';
import type { Criterion, Milestone } from '../data/types';
import styles from '../features/settings/Settings.module.css';
import { newId } from '../state/ids';
import { useApp } from '../state/useApp';

const TYPE_HINT: Record<Criterion['type'], string> = {
  manual: 'hakst du selbst ab',
  activeWeeks: 'automatisch: Wochen mit mindestens 3 Krafttrainings',
  weightBelow: 'automatisch: 7-Tage-Schnitt unter diesem Gewicht',
  weightRange: 'automatisch: 7-Tage-Schnitt in diesem Bereich',
  waistDelta: 'automatisch: so viele cm weniger als bei der ersten Messung',
};

function CriterionNumbers({
  criterion,
  onChange,
}: {
  criterion: Criterion;
  onChange: (c: Criterion) => void;
}) {
  const num = (v: number | undefined, fallback: number) => v ?? fallback;
  switch (criterion.type) {
    case 'manual':
      return null;
    case 'activeWeeks':
      return (
        <DecimalInput
          label="Anzahl Wochen"
          unit="Wo."
          value={criterion.weeks}
          onChange={(v) => onChange({ ...criterion, weeks: Math.round(num(v, 1)) })}
        />
      );
    case 'weightBelow':
      return (
        <DecimalInput
          label="Gewicht unter"
          unit="kg"
          value={criterion.kg}
          onChange={(v) => onChange({ ...criterion, kg: num(v, criterion.kg) })}
        />
      );
    case 'waistDelta':
      return (
        <DecimalInput
          label="Zentimeter weniger"
          unit="cm"
          value={criterion.cm}
          onChange={(v) => onChange({ ...criterion, cm: num(v, criterion.cm) })}
        />
      );
    case 'weightRange':
      return (
        <span className={styles.criterionNumbers}>
          <DecimalInput
            label="Gewicht von"
            unit="kg"
            value={criterion.minKg}
            onChange={(v) => onChange({ ...criterion, minKg: num(v, criterion.minKg) })}
          />
          <DecimalInput
            label="Gewicht bis"
            unit="kg"
            value={criterion.maxKg}
            onChange={(v) => onChange({ ...criterion, maxKg: num(v, criterion.maxKg) })}
          />
        </span>
      );
  }
}

export function MilestonesEditPage() {
  const { data, dispatch } = useApp();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Milestone[]>(() => structuredClone(data.milestones));
  const [confirmReset, setConfirmReset] = useState(false);

  const updateMilestone = (id: string, change: (ms: Milestone) => Milestone) =>
    setDraft((list) => list.map((ms) => (ms.id === id ? change(ms) : ms)));

  const updateCriterion = (msId: string, criterion: Criterion) =>
    updateMilestone(msId, (ms) => ({
      ...ms,
      criteria: ms.criteria.map((c) => (c.id === criterion.id ? criterion : c)),
    }));

  const save = () => {
    dispatch({ type: 'milestones/set', milestones: draft });
    navigate('/mehr/einstellungen');
  };

  return (
    <>
      <PageHeader
        back={{ to: '/mehr/einstellungen', label: 'Einstellungen' }}
        title="Etappen"
        subtitle="Passe Namen, Zeiträume und Ziele an. Automatische Ziele hakt die App selbst ab."
      />

      {draft.map((ms, i) => (
        <Section key={ms.id} title={`Etappe ${i + 1}`}>
          <Card className={styles.milestoneEdit}>
            <Field label="Name" htmlFor={`title-${ms.id}`}>
              <input
                id={`title-${ms.id}`}
                className={fieldStyles.input}
                value={ms.title}
                onChange={(e) => updateMilestone(ms.id, (m) => ({ ...m, title: e.target.value }))}
              />
            </Field>
            <Field label="Zeitraum" htmlFor={`horizon-${ms.id}`}>
              <input
                id={`horizon-${ms.id}`}
                className={fieldStyles.input}
                value={ms.horizon}
                onChange={(e) => updateMilestone(ms.id, (m) => ({ ...m, horizon: e.target.value }))}
              />
            </Field>

            <ul className={styles.criterionList}>
              {ms.criteria.map((c, ci) => (
                <li key={c.id} className={styles.criterionEdit}>
                  <Field label={`Ziel ${ci + 1}`} htmlFor={`label-${c.id}`}>
                    <input
                      id={`label-${c.id}`}
                      className={fieldStyles.input}
                      value={c.label}
                      onChange={(e) => updateCriterion(ms.id, { ...c, label: e.target.value })}
                    />
                  </Field>
                  <div className={styles.criterionRow}>
                    <CriterionNumbers criterion={c} onChange={(nc) => updateCriterion(ms.id, nc)} />
                    <p className={styles.typeHint}>{TYPE_HINT[c.type]}</p>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={`Ziel „${c.label}“ entfernen`}
                      onClick={() =>
                        updateMilestone(ms.id, (m) => ({
                          ...m,
                          criteria: m.criteria.filter((x) => x.id !== c.id),
                        }))
                      }
                    >
                      <Trash2 {...iconSm} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <Button
              variant="ghost"
              icon={<Plus {...icon} />}
              onClick={() =>
                updateMilestone(ms.id, (m) => ({
                  ...m,
                  criteria: [...m.criteria, { id: newId(), type: 'manual', label: 'Neues Ziel' }],
                }))
              }
            >
              Ziel hinzufügen
            </Button>
          </Card>
        </Section>
      ))}

      <div className={styles.footer}>
        <Button variant="primary" block onClick={save}>
          Speichern
        </Button>
        <Button variant="ghost" block onClick={() => setConfirmReset(true)}>
          Auf Standard zurücksetzen
        </Button>
      </div>

      <ConfirmDialog
        open={confirmReset}
        title="Etappen zurücksetzen?"
        confirmLabel="Zurücksetzen"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setDraft(createDefaultMilestones());
          setConfirmReset(false);
        }}
      >
        <p>
          Die Etappen werden auf die ursprünglichen Werte gesetzt. Selbst abgehakte Ziele musst du
          danach neu abhaken. Gespeichert wird erst, wenn du auf „Speichern“ tippst.
        </p>
      </ConfirmDialog>
    </>
  );
}
