import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import fieldStyles from '../../components/Field.module.css';
import { iconSm } from '../../components/icon';
import { ProgressBar } from '../../components/ProgressBar';
import { Sheet } from '../../components/Sheet';
import { milestoneProgress, nextMilestone } from '../../domain/milestones';
import { useApp } from '../../state/useApp';
import styles from './Progress.module.css';

function WhyForm({ initial, onSave }: { initial: string; onSave: (why: string) => void }) {
  const [text, setText] = useState(initial);
  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        onSave(text.trim());
      }}
    >
      <Field
        label="Warum machst du das?"
        htmlFor="why"
        hint="Nur für dich. Lies es, wenn es mal schwerfällt."
      >
        <textarea
          id="why"
          className={fieldStyles.input}
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      <Button type="submit" variant="primary" block>
        Speichern
      </Button>
    </form>
  );
}

/** Ziel-Karte: Ziel in einem Satz, „Mein Warum“ und die nächste Etappe. */
export function GoalCard() {
  const { data, dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const { goalText, why } = data.settings;
  const next = nextMilestone(data.milestones);
  const progress = next ? milestoneProgress(next) : null;

  return (
    <Card className={styles.goal}>
      <p className={styles.overline}>Mein Ziel</p>
      <p className={styles.goalText}>{goalText}</p>

      <div className={styles.why}>
        <div className={styles.whyHead}>
          <p className={styles.overline}>Mein Warum</p>
          {why && (
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setEditing(true)}
              aria-label="Mein Warum bearbeiten"
            >
              <Pencil {...iconSm} />
            </button>
          )}
        </div>
        {why ? (
          <p className={styles.whyText}>{why}</p>
        ) : (
          <Button variant="ghost" className={styles.whyButton} onClick={() => setEditing(true)}>
            Aufschreiben, warum du das machst
          </Button>
        )}
      </div>

      {next && progress ? (
        <div className={styles.next}>
          <div className={styles.nextHead}>
            <p className={styles.overline}>Nächste Etappe</p>
            <p className={`${styles.meta} num`}>
              {progress.done} von {progress.total} Zielen
            </p>
          </div>
          <p className={styles.nextTitle}>
            {next.title} <span className={styles.meta}>({next.horizon})</span>
          </p>
          <ProgressBar
            value={progress.done}
            max={progress.total}
            label={`Fortschritt Etappe ${next.title}`}
          />
        </div>
      ) : (
        <p className={styles.next}>Alle Etappen erreicht.</p>
      )}

      <Sheet open={editing} onClose={() => setEditing(false)} title="Mein Warum">
        <WhyForm
          initial={why}
          onSave={(text) => {
            dispatch({ type: 'settings/update', patch: { why: text } });
            setEditing(false);
          }}
        />
      </Sheet>
    </Card>
  );
}
