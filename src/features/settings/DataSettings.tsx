import { Download, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { icon } from '../../components/icon';
import type { AppData } from '../../data/types';
import { evaluateMilestones } from '../../domain/milestones';
import { readJsonFile, saveJsonFile } from '../../services/files';
import { storage } from '../../services/storage';
import { parseImportFile, toExportFile } from '../../state/schema';
import { useApp } from '../../state/useApp';
import styles from './Settings.module.css';

export function DataSettings() {
  const { data, dispatch, today } = useApp();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<AppData | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = parseImportFile(await readJsonFile(file), today);
      if (!parsed) throw new Error('ungültig');
      setPending(parsed);
    } catch {
      setMessage({
        text: 'Die Datei konnte nicht gelesen werden. Wähle eine Export-Datei von Satzweise.',
        error: true,
      });
    }
  };

  return (
    <div className={styles.group}>
      <p className={styles.hint}>
        Alle Daten liegen nur auf diesem Gerät. Sichere sie ab und zu als Datei, z. B. bevor du das
        Handy wechselst.
      </p>
      <div className={styles.buttons}>
        <Button
          icon={<Download {...icon} />}
          onClick={async () => {
            try {
              await saveJsonFile(`satzweise-${today}.json`, toExportFile(data));
              setMessage({ text: 'Export gespeichert.' });
            } catch {
              setMessage({ text: 'Export abgebrochen.', error: true });
            }
          }}
        >
          Daten exportieren
        </Button>
        <Button icon={<Upload {...icon} />} onClick={() => fileInput.current?.click()}>
          Daten importieren
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {message && (
        <p className={message.error ? styles.error : styles.success} role="status">
          {message.text}
        </p>
      )}

      <div className={styles.danger}>
        <Button variant="danger" icon={<Trash2 {...icon} />} onClick={() => setConfirmReset(true)}>
          Alle Daten löschen
        </Button>
      </div>

      <ConfirmDialog
        open={pending !== null}
        title="Daten importieren?"
        confirmLabel="Importieren"
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending) {
            dispatch({
              type: 'data/replace',
              data: { ...pending, milestones: evaluateMilestones(pending.milestones, pending) },
            });
          }
          setPending(null);
          setMessage({ text: 'Daten importiert.' });
        }}
      >
        <p>Deine aktuellen Daten werden durch die Datei ersetzt.</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmReset}
        title="Alle Daten löschen?"
        confirmLabel="Endgültig löschen"
        danger
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          storage.clear();
          dispatch({ type: 'data/reset', today });
          setConfirmReset(false);
          setMessage({ text: 'Alle Daten wurden gelöscht.' });
        }}
      >
        <p>
          Trainings, Messwerte, Etappen und Einstellungen werden gelöscht. Das lässt sich nicht
          rückgängig machen. Exportiere vorher, wenn du etwas behalten willst.
        </p>
      </ConfirmDialog>
    </div>
  );
}
