// Dezenter Ton über die Web Audio API, ganz ohne Audiodatei.
// Browser erlauben Ton erst nach einer Berührung. Deshalb ruft die App primeAudio()
// auf, sobald du einen Satz abhakst.

let context: AudioContext | null = null;

export function primeAudio(): void {
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume();
  } catch {
    context = null;
  }
}

function tone(ctx: AudioContext, frequency: number, start: number, length: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

/** Zwei kurze, weiche Töne. */
export function playChime(): void {
  if (!context || context.state !== 'running') return;
  const now = context.currentTime;
  tone(context, 880, now, 0.35);
  tone(context, 1175, now + 0.18, 0.45);
}
