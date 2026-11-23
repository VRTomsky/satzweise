import { useState } from 'react';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import fieldStyles from '../../components/Field.module.css';
import { DecimalInput } from '../../components/NumberInput';
import { Sheet } from '../../components/Sheet';
import type { IsoDate, Measurement } from '../../data/types';
import { isIsoDate } from '../../domain/dates';
import { useApp } from '../../state/useApp';
import { newId } from '../../state/ids';
import styles from './Progress.module.css';

interface Props {
  /** Bestehender Eintrag zum Bearbeiten, sonst neuer Eintrag. */
  measurement: Measurement | null;
  today: IsoDate;
  onClose: () => void;
}

function validate(date: string, weight?: number, waist?: number): string | null {
  if (!isIsoDate(date)) return 'Bitte ein gültiges Datum wählen.';
  if (weight === undefined && waist === undefined) {
    return 'Trag mindestens Gewicht oder Bauchumfang ein.';
  }
  if (weight !== undefined && (weight < 30 || weight > 300)) {
    return 'Das Gewicht sollte zwischen 30 und 300 kg liegen.';
  }
  if (waist !== undefined && (waist < 40 || waist > 250)) {
    return 'Der Bauchumfang sollte zwischen 40 und 250 cm liegen.';
  }
  return null;
}

/** Formular: Gewicht und/oder Bauchumfang mit Datum. */
export function MeasurementForm({ measurement, today, onClose }: Props) {
  const { dispatch } = useApp();
  const [date, setDate] = useState(measurement?.date ?? today);
  const [weight, setWeight] = useState(measurement?.weightKg);
  const [waist, setWaist] = useState(measurement?.waistCm);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = () => {
    const problem = validate(date, weight, waist);
    if (problem) {
      setError(problem);
      return;
    }
    dispatch({
      type: 'measurement/save',
      measurement: { id: measurement?.id ?? newId(), date, weightKg: weight, waistCm: waist },
    });
    onClose();
  };

  return (
    <form
      className={styles.form}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <Field label="Datum" htmlFor="m-date">
        <input
          id="m-date"
          type="date"
          className={fieldStyles.input}
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>
      <div className={styles.formRow}>
        <Field label="Gewicht" htmlFor="m-weight" hint="morgens, nach dem Toilettengang">
          <DecimalInput
            id="m-weight"
            label="Gewicht"
            unit="kg"
            value={weight}
            onChange={setWeight}
          />
        </Field>
        <Field label="Bauchumfang" htmlFor="m-waist" hint="auf Höhe des Bauchnabels">
          <DecimalInput
            id="m-waist"
            label="Bauchumfang"
            unit="cm"
            value={waist}
            onChange={setWaist}
          />
        </Field>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.formActions}>
        <Button type="submit" variant="primary" block>
          Speichern
        </Button>
        {measurement &&
          (confirmDelete ? (
            <Button
              variant="danger"
              block
              onClick={() => {
                dispatch({ type: 'measurement/delete', id: measurement.id });
                onClose();
              }}
            >
              Wirklich löschen
            </Button>
          ) : (
            <Button variant="ghost" block onClick={() => setConfirmDelete(true)}>
              Eintrag löschen
            </Button>
          ))}
      </div>
    </form>
  );
}

export function MeasurementSheet({ open, ...props }: Props & { open: boolean }) {
  return (
    <Sheet
      open={open}
      onClose={props.onClose}
      title={props.measurement ? 'Messwert bearbeiten' : 'Messwert eintragen'}
    >
      {/* key: Formular neu aufbauen, wenn ein anderer Eintrag geöffnet wird */}
      <MeasurementForm key={props.measurement?.id ?? 'neu'} {...props} />
    </Sheet>
  );
}
