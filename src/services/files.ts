// Dateien speichern und lesen (Export/Import).
// App: Datei in den Cache schreiben und über „Teilen“ speichern (z. B. in Drive oder Downloads).
// Browser: normaler Download.

import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { isNativeApp } from './platform';

export async function saveJsonFile(filename: string, data: unknown): Promise<void> {
  const json = JSON.stringify(data, null, 2);

  if (isNativeApp) {
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: json,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    });
    await Share.share({ title: 'Satzweise-Sicherung', files: [uri] });
    return;
  }

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readJsonFile(file: File): Promise<unknown> {
  const text = await file.text();
  return JSON.parse(text) as unknown;
}
