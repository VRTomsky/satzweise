// Alle Typen für Trainingsplan, Übungen und gespeicherte Daten an einer Stelle.

/** Datum im Format JJJJ-MM-TT, z. B. "2026-11-23". */
export type IsoDate = string;

/** Wochentag nach ISO: 1 = Montag … 7 = Sonntag. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type BenchSetting = 'flach' | '30°' | '30–45°' | '45°' | 'fast senkrecht';

export interface Exercise {
  id: string;
  /** Deutscher Name, so wie er in der App steht. */
  name: string;
  /** Englischer Name (für die Bildsuche in free-exercise-db). */
  nameEn: string;
  primaryMuscles: string[];
  bench: BenchSetting | null;
  /** Zusatz zur Bank, z. B. „hinterer Fuß drauf“. */
  benchNote?: string;
  /** true = Wiederholungen gelten pro Seite bzw. pro Bein. */
  perSide?: boolean;
  steps: string[];
  mistakes: string[];
  /** Bildpfade relativ zu public/, z. B. "exercises/Goblet_Squat/0.jpg". */
  images: string[];
  youtubeQuery: string;
}

export interface PlannedExercise {
  /** Nummer im Plan, z. B. "1" oder "6a". */
  label: string;
  exerciseId: string;
  sets: number;
  /** Wiederholungsbereich, z. B. [10, 15]. */
  reps?: [number, number];
  /** „So viele wie sauber möglich“. reps ist dann der Zielbereich. */
  repsMax?: boolean;
  /** Halteübungen in Sekunden, z. B. [30, 45]. */
  seconds?: [number, number];
  tempo?: string;
  /** Pause nach dem Satz in Sekunden. 0 = direkt weiter (erste Übung im Supersatz). */
  restSec: number;
  startLoad: string;
  /** Gleiche Gruppe = Supersatz, z. B. "6" für 6a/6b. */
  supersetGroup?: string;
  note?: string;
}

export type WorkoutKind = 'kraft' | 'aktiv' | 'ruhe';

export interface Workout {
  id: string;
  name: string;
  kind: WorkoutKind;
  description?: string;
  /** Aufwärm-Checkliste vor dem Training anzeigen. */
  warmup?: boolean;
  exercises: PlannedExercise[];
}

export type WeekPlan = Record<Weekday, string>;

// ---------- Gespeicherte Daten ----------

export interface SetLog {
  done: boolean;
  /** Geschaffte Wiederholungen oder Sekunden. */
  value?: number;
  weightKg?: number;
}

export interface DayLog {
  workoutId: string;
  /** Abgehakte Schritte der Aufwärm-Checkliste. */
  warmup: boolean[];
  /** Sätze pro Übung (Schlüssel = exerciseId). */
  sets: Record<string, SetLog[]>;
  /** Zeitpunkt, an dem das Training abgeschlossen wurde (ISO-Zeitstempel). */
  completedAt?: string;
  /** Tag pausiert (krank, Urlaub): unterbricht die Serie nicht. */
  paused?: boolean;
}

export interface Measurement {
  id: string;
  date: IsoDate;
  weightKg?: number;
  waistCm?: number;
}

interface CriterionBase {
  id: string;
  label: string;
  /** Datum, an dem das Ziel erreicht wurde. */
  doneAt?: IsoDate;
}

export type Criterion =
  | (CriterionBase & { type: 'manual' })
  | (CriterionBase & { type: 'activeWeeks'; weeks: number })
  | (CriterionBase & { type: 'weightBelow'; kg: number })
  | (CriterionBase & { type: 'weightRange'; minKg: number; maxKg: number })
  | (CriterionBase & { type: 'waistDelta'; cm: number });

export interface Milestone {
  id: string;
  title: string;
  horizon: string;
  criteria: Criterion[];
  achievedAt?: IsoDate;
}

export interface ReminderSettings {
  enabled: boolean;
  /** Uhrzeit "HH:MM". */
  time: string;
}

export interface Settings {
  weekPlan: WeekPlan;
  /** Bank-Winkel → Stufe deiner Bank, z. B. { '30°': '3' }. */
  benchLevels: Partial<Record<BenchSetting, string>>;
  reminder: ReminderSettings;
  showWeightField: boolean;
  goalText: string;
  why: string;
  /** Start des Programms. Ab hier zählen Serie und die leichte Woche. */
  startDate: IsoDate;
}

export interface TimerState {
  /** Endzeit als Millisekunden-Zeitstempel. */
  endsAt: number;
  durationSec: number;
  label: string;
}

export interface AppData {
  schemaVersion: 1;
  settings: Settings;
  logs: Record<IsoDate, DayLog>;
  measurements: Measurement[];
  milestones: Milestone[];
  timer: TimerState | null;
}
