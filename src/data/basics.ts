// Inhalte der Seite „Grundlagen“. Reiner Text, hier kannst du alles anpassen.

export interface BasicsBlock {
  heading?: string;
  text?: string;
  items?: string[];
  ordered?: boolean;
}

export interface BasicsSection {
  id: string;
  title: string;
  blocks: BasicsBlock[];
}

export const PROGRESSION: BasicsSection = {
  id: 'progression',
  title: 'Progression',
  blocks: [
    {
      heading: 'Doppelte Progression',
      text: 'Jede Übung hat einen Wiederholungsbereich, z. B. 10–15. Schaffst du in allen Sätzen sauber die obere Grenze, machst du die Übung beim nächsten Mal schwerer.',
    },
    {
      heading: 'Schwerer machen, wenn das Gewicht nicht reicht',
      ordered: true,
      items: [
        'Mehr Gewicht, falls vorhanden.',
        'Langsamer absenken (4 Sekunden).',
        '2 Sekunden Pause in der untersten Position.',
        '1½-Wiederholungen: runter, halb hoch, wieder runter, ganz hoch. Das zählt als 1 Wiederholung.',
        'Einen 4. Satz hinzufügen.',
      ],
    },
    {
      heading: 'Intensität',
      text: 'Beende einen Satz, wenn noch 1–2 saubere Wiederholungen gehen würden. Im letzten Satz einer Übung gehst du bis kurz vor das Muskelversagen.',
    },
    {
      heading: 'Pausen',
      text: '90 Sekunden bei großen Übungen, 60 Sekunden bei kleinen. Mit deinen leichten Gewichten reicht das, und das Training bleibt bei etwa 60 Minuten.',
    },
    {
      heading: 'Leichte Woche',
      text: 'Alle 8 Wochen machst du nur 2 Sätze pro Übung. Die App erinnert dich daran.',
    },
  ],
};

export const BASICS: BasicsSection[] = [
  PROGRESSION,
  {
    id: 'ernaehrung',
    title: 'Ernährung',
    blocks: [
      {
        text: 'Einfache Regeln statt Kalorienzählen.',
      },
      {
        ordered: true,
        items: [
          'Eiweiß zu jeder Mahlzeit: 1–2 handflächengroße Portionen, z. B. Hähnchen, Fisch, Eier, Magerquark, Skyr, Hüttenkäse, Linsen oder Tofu.',
          'Teller-Regel: ½ Gemüse oder Salat, ¼ Eiweiß, ¼ Beilage (Kartoffeln, Reis, Nudeln, Brot).',
          'Getränke: Wasser ist super. Energydrinks (auch Zero) höchstens einen am Tag und nur vormittags, weil Koffein später den Schlaf stört.',
          'Backwaren und Süßes geplant statt täglich, z. B. 2–3 Mal pro Woche.',
          'Mittags ist ein Proteinshake okay. Proteinriegel sind oft eher Süßigkeiten. Besser etwas von zu Hause mitnehmen: Vollkornbrot mit Belag, Skyr mit Obst.',
          'Langsam essen: Nachschlag erst nach 10 Minuten, wenn du dann noch Hunger hast.',
          'Nicht hungern, keine Crash-Diät. Du bist noch im Wachstum: 3 Mahlzeiten, bei Bedarf 1 Snack.',
          'Gutes Tempo: im Schnitt etwa 0,5 kg pro Woche. Manche Wochen bleibt die Waage stehen. Das ist normal, gerade wenn gleichzeitig Muskeln wachsen.',
        ],
      },
    ],
  },
  {
    id: 'schlaf',
    title: 'Schlaf',
    blocks: [
      {
        text: 'Jugendliche brauchen 8–10 Stunden Schlaf. Bei 6:20 Uhr Aufstehen heißt das: gegen 22:15 Uhr ins Bett.',
      },
    ],
  },
  {
    id: 'messen',
    title: 'Fortschritt messen',
    blocks: [
      {
        items: [
          'Gewicht 2× pro Woche, morgens nach dem Toilettengang, immer unter gleichen Bedingungen. Der Wochenschnitt zählt.',
          'Bauchumfang 1× pro Woche auf Höhe des Bauchnabels.',
          'Einmal im Monat ein Foto.',
        ],
      },
      {
        heading: 'Schritte',
        text: 'Langsam steigern. Ziel: 8.000+ Schritte pro Tag, auch am Wochenende.',
      },
    ],
  },
  {
    id: 'sicherheit',
    title: 'Sicherheit',
    blocks: [
      {
        items: [
          'Technik vor Gewicht.',
          'Muskelkater ist normal. Bei stechenden Schmerzen oder Gelenkschmerzen brichst du die Übung ab.',
          'Bei Schwindel aufhören und etwas trinken.',
          'Die Bank muss immer fest stehen.',
        ],
      },
    ],
  },
];
