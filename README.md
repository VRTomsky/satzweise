# Satzweise

Mein Trainingsplan für zu Hause als Web-App: Sätze abhaken, Pausentimer, Wochenübersicht,
Messwerte mit Diagramm und Etappen zu meinem Ziel. Kein Login, kein Server, alle Daten bleiben
auf dem Gerät. Läuft offline und lässt sich als App auf dem Handy installieren.

**Online:** https://vrtomsky.github.io/satzweise/

## Projekt starten

Voraussetzung: [Node.js](https://nodejs.org/) ab Version 22.

```bash
npm install
npm run dev
```

Dann im Browser öffnen: http://localhost:5173/satzweise/

| Befehl                        | Was er macht                                             |
| ----------------------------- | -------------------------------------------------------- |
| `npm run dev`                 | Startet die App zum Entwickeln (lädt bei Änderungen neu) |
| `npm run build`               | Prüft die Typen und baut die fertige App nach `dist/`    |
| `npm run preview`             | Zeigt den fertigen Build an (zum Testen von Offline/PWA) |
| `npm test`                    | Führt die Tests aus (Serie, Progression, Etappen …)      |
| `npm run lint`                | Prüft den Code auf Fehler                                |
| `npm run format`              | Formatiert den Code einheitlich (Prettier)               |
| `npm run generate-pwa-assets` | Erzeugt die App-Icons neu aus `public/icon.svg`          |

## Plan bearbeiten

Alle Inhalte stehen als normale, typisierte Daten in `src/data/`. Nach dem Speichern lädt die
App im Dev-Modus sofort neu.

### `src/data/plan.ts` – Trainings und Wochenplan

Jedes Training (`WORKOUTS`) hat eine Liste von Übungen. Pro Übung kannst du ändern:

| Feld            | Bedeutung                                          | Beispiel            |
| --------------- | -------------------------------------------------- | ------------------- |
| `label`         | Nummer im Plan                                     | `'1'`, `'6a'`       |
| `exerciseId`    | Welche Übung (siehe `exercises.ts`)                | `'kh-bankdruecken'` |
| `sets`          | Anzahl Sätze                                       | `3`                 |
| `reps`          | Wiederholungsbereich                               | `[10, 15]`          |
| `repsMax`       | „So viele wie sauber möglich“, `reps` ist das Ziel | `true`              |
| `seconds`       | Halteübung in Sekunden statt Wiederholungen        | `[30, 45]`          |
| `tempo`         | Tempo                                              | `'3-1-1'`           |
| `restSec`       | Pause in Sekunden (0 = direkt weiter im Supersatz) | `90`                |
| `startLoad`     | Startgewicht als Text                              | `'2 × 10 kg'`       |
| `supersetGroup` | Gleiche Gruppe = Supersatz                         | `'6'`               |
| `note`          | Zusatzhinweis                                      | beliebiger Text     |

`DEFAULT_WEEK_PLAN` legt fest, welches Training an welchem Wochentag dran ist (1 = Montag).
Das kannst du aber auch direkt in der App unter **Mehr → Einstellungen** ändern.
`WARMUP_STEPS` ist die Aufwärm-Checkliste.

### Weitere Dateien

- `src/data/exercises.ts` – Übungen: Name, Muskeln, Bank-Einstellung, Ausführung, häufige Fehler,
  Bilder, YouTube-Suchbegriff
- `src/data/basics.ts` – Texte der Seite „Grundlagen“
- `src/data/defaults.ts` – Startwerte für Ziel-Text, Etappen und Einstellungen

## Übungsbilder

Alle Bilder stammen aus [free-exercise-db](https://github.com/yuhonas/free-exercise-db) von
yuhonas (Public Domain / Unlicense). Es wurden nur die benötigten Bilder ins Repo kopiert
(`public/exercises/`) und als WebP verkleinert, damit die App offline schnell bleibt.

Für **alle 28 Übungen** gab es eine passende Übung. Drei Bilder zeigen ein anderes Gewicht,
die Bewegung ist aber dieselbe:

- Kurzhantel-Thruster → Bild „Kettlebell Thruster“
- Einbeiniges rumänisches Kreuzheben → Bild „Kettlebell One-Legged Deadlift“
- Hip Thrust → Bild „Barbell Hip Thrust“

**Eigenes Bild ergänzen:** Lege die Datei z. B. unter `public/exercises/Mein_Bild/0.webp` ab und
trag den Pfad in `src/data/exercises.ts` bei der Übung unter `images` ein. Ist `images` leer, zeigt
die App einen schlichten Platzhalter mit dem Übungsnamen.

## Wo die Daten liegen

Alles wird im `localStorage` des Browsers gespeichert (Schlüssel `satzweise:data`). Das
Speicher-Modul hat eine **Schema-Version** (`src/state/schema.ts`). Ändert sich später das
Datenformat, erhöhst du `CURRENT_SCHEMA` und schreibst in `MIGRATIONS` einen Schritt, der alte
Daten umbaut. So gehen keine Einträge verloren.

Unter **Mehr → Einstellungen → Daten** kannst du alles als JSON-Datei exportieren und wieder
importieren. Mach das ab und zu, z. B. bevor du das Handy wechselst oder den Browser-Speicher
löschst.

## Ordnerstruktur

```
src/
  data/        Trainingsplan, Übungen, Texte, Startwerte, Typen
  domain/      reine Logik ohne React (Datum, Serie, Progression, Etappen) + Tests
  services/    alles Gerätespezifische (Speichern, Benachrichtigung, Vibration, Ton, Wake Lock, Dateien)
  state/       App-Zustand: Reducer, Schema-Version, Context
  components/  schlichte UI-Bausteine (Button, Card, Sheet, Toggle …)
  features/    Teile einzelner Seiten (Heute, Timer, Woche, Fortschritt …)
  pages/       die Seiten der App
  styles/      Design-Tokens (Farben, Abstände, Schrift) und Grundstile
```

## Deployment auf GitHub Pages

Der Workflow `.github/workflows/deploy.yml` baut die App bei jedem Push auf `main`, prüft Lint
und Tests und veröffentlicht sie auf GitHub Pages.

### Einmalig einrichten

1. Das Repo `satzweise` auf GitHub anlegen (ist schon erledigt).
2. Im Projektordner das Repo verbinden und hochladen:
   ```bash
   git remote add origin https://github.com/VRTomsky/satzweise.git
   git push -u origin main
   ```
3. Auf GitHub im Repo auf **Settings → Pages** gehen.
4. Unter **Build and deployment → Source** den Eintrag **GitHub Actions** wählen.
5. Unter **Actions** den Workflow „Deploy“ öffnen. Ist der erste Lauf vor Schritt 4
   fehlgeschlagen, auf **Re-run all jobs** klicken.
6. Nach ein bis zwei Minuten ist die App unter https://vrtomsky.github.io/satzweise/ erreichbar.

### Danach

Jeder `git push` auf `main` veröffentlicht automatisch die neue Version. Die installierte App auf
dem Handy holt sich das Update beim nächsten Öffnen selbst.

**Anderer Repo-Name?** Dann in `vite.config.ts` die Zeile mit `'/satzweise/'` anpassen.

## Auf dem Handy installieren

- **Android (Chrome):** Seite öffnen → Menü (⋮) → **App installieren** bzw. **Zum Startbildschirm hinzufügen**.
- **iPhone (Safari):** Teilen-Symbol → **Zum Home-Bildschirm**.

Danach läuft die App auch ohne Internet.

## Erinnerungen: was im Browser geht und was nicht

- **Im Browser:** Nach deiner Erlaubnis kommt zur eingestellten Uhrzeit eine Benachrichtigung,
  **aber nur, solange die App offen ist** oder als installierte App noch im Hintergrund läuft.
  Ist sie ganz geschlossen, kann eine Webseite ohne Server nichts auslösen.
- **Banner:** Öffnest du die App nach der Erinnerungszeit und hast noch nicht trainiert, steht
  oben auf „Heute“ ein Hinweis. Das funktioniert immer.
- **In der APK:** Mit `@capacitor/local-notifications` plant das Handy die Erinnerung selbst. Sie
  kommt dann zuverlässig, auch wenn die App geschlossen ist. Dafür muss nur
  `src/services/reminders.ts` ausgetauscht werden.

## Später: Android-APK mit Capacitor

Die App ist dafür vorbereitet: Alle Pfade sind relativ zum `base`-Pfad, und alles
Gerätespezifische läuft über `src/services/`. Die Schritte:

1. Capacitor installieren:
   ```bash
   npm install @capacitor/core @capacitor/android
   npm install -D @capacitor/cli
   npx cap init Satzweise de.satzweise.app --web-dir dist
   ```
2. Mit relativem Pfad bauen: `BASE=./ npm run build` (in PowerShell: `$env:BASE='./'; npm run build`).
3. Android-Projekt anlegen und Dateien kopieren:
   ```bash
   npx cap add android
   npx cap sync android
   ```
4. In [Android Studio](https://developer.android.com/studio) öffnen (`npx cap open android`) und
   über **Build → Build APK(s)** die APK erstellen.
5. Gerätefunktionen austauschen (nur in `src/services/`):
   - Erinnerungen: `@capacitor/local-notifications` in `reminders.ts` und `notifications.ts`
   - Vibration: `@capacitor/haptics` in `vibration.ts`
   - Bildschirm anlassen: `@capacitor-community/keep-awake` in `wakeLock.ts`
   - Speichern: optional `@capacitor/preferences` in `storage.ts`
   - Export/Import: `@capacitor/filesystem` und `@capacitor/share` in `files.ts`

## Technik

Vite, React, TypeScript (strict), CSS Modules mit Design-Tokens, lucide-react, React Router
(HashRouter), vite-plugin-pwa, Vitest, ESLint, Prettier.
