import { Check, CircleCheck } from 'lucide-react';
import { icon } from '../../components/icon';
import type { Criterion, Milestone } from '../../data/types';
import { formatShort } from '../../domain/dates';
import { criterionDetail } from '../../domain/milestones';
import { useApp } from '../../state/useApp';
import styles from './Progress.module.css';

function CriterionRow({ milestone, criterion }: { milestone: Milestone; criterion: Criterion }) {
  const { data, dispatch, today } = useApp();
  const done = Boolean(criterion.doneAt);
  const detail = criterionDetail(criterion, data);
  const box = (
    <span className={`${styles.box} ${done ? styles.boxDone : ''}`} aria-hidden>
      {done && <Check size={14} strokeWidth={2.75} />}
    </span>
  );
  const text = (
    <span className={styles.criterionText}>
      <span className={done ? styles.criterionDone : undefined}>{criterion.label}</span>
      <span className={styles.meta}>
        {criterion.type === 'manual' ? 'hakst du selbst ab' : 'automatisch'}
        {detail && ` · ${detail}`}
        {criterion.doneAt && ` · am ${formatShort(criterion.doneAt)}`}
      </span>
    </span>
  );

  if (criterion.type !== 'manual') {
    return (
      <li className={styles.criterion}>
        {box}
        {text}
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        className={`${styles.criterion} ${styles.criterionButton}`}
        onClick={() =>
          dispatch({
            type: 'criterion/toggle',
            milestoneId: milestone.id,
            criterionId: criterion.id,
            today,
          })
        }
      >
        {box}
        {text}
      </button>
    </li>
  );
}

/** Alle Etappen mit ihren Zielen. Erreichte Etappen werden ruhig markiert. */
export function MilestoneList() {
  const { data } = useApp();

  return (
    <ol className={styles.milestones}>
      {data.milestones.map((ms, i) => (
        <li key={ms.id} className={styles.milestone}>
          <div className={styles.milestoneHead}>
            <span className={`${styles.step} ${ms.achievedAt ? styles.stepDone : ''} num`}>
              {ms.achievedAt ? <CircleCheck {...icon} /> : i + 1}
            </span>
            <div>
              <h3 className={styles.milestoneTitle}>{ms.title}</h3>
              <p className={styles.meta}>
                {ms.achievedAt ? `Erreicht am ${formatShort(ms.achievedAt)}` : ms.horizon}
              </p>
            </div>
          </div>
          <ul className={styles.criteria}>
            {ms.criteria.map((c) => (
              <CriterionRow key={c.id} milestone={ms} criterion={c} />
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
