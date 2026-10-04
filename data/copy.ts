// Tamil lines used in the interface (not lesson content).
// Sri Lankan Tamil friendly forms. To be checked by a native speaker.

export type Line = { tamil: string; english: string }

/** Correct answer, shown on the victory screen */
export const PRAISE: Line[] = [
  { tamil: 'அது சரிதான்!', english: "That's exactly right." },
  { tamil: 'அருமை!', english: 'Brilliant.' },
  { tamil: 'நல்லாச் சொன்னீங்க.', english: 'Well said.' },
  { tamil: 'சரியாச் சொன்னீங்க!', english: 'Perfect.' },
  { tamil: 'ஓம்!', english: "Yes, you've got it." },
  { tamil: 'அம்மம்மா பெருமைப்படுவா.', english: 'Ammamma would be proud.' },
  { tamil: 'உங்களுக்குத் தெரியும்.', english: 'You already knew that.' },
  { tamil: 'சபாஷ்!', english: 'Well done.' },
  { tamil: 'சரி சரி!', english: "That's it!" },
]

/** Wrong answer. {answer} is replaced with the correct answer. */
export const ENCOURAGE: Line[] = [
  { tamil: 'கிட்டத்தட்ட.', english: 'Almost. It was “{answer}”.' },
  { tamil: 'கிட்ட வந்திட்டீங்க.', english: "You're getting there. It was “{answer}”." },
  { tamil: 'இந்த முறை இல்லை.', english: "But you'll get it next time. It was “{answer}”." },
  { tamil: 'திரும்பக் கேளுங்கோ.', english: 'Listen one more time. It was “{answer}”.' },
  { tamil: 'பரவாயில்லை.', english: "Don't worry. Even appa forgot this one. It was “{answer}”." },
]

/** Smaller praise used inside Write and packs */
export const NICE: Line[] = [
  { tamil: 'சரி!', english: "That's the one." },
  { tamil: 'அருமை!', english: 'Beautifully spotted.' },
  { tamil: 'ஓம்!', english: 'Yes, exactly.' },
  { tamil: 'நல்லாப் பார்த்தீங்க.', english: 'Good eye.' },
]

export const NUDGE: Line[] = [
  { tamil: 'கிட்டத்தட்ட.', english: 'Almost. Look at the shape again.' },
  { tamil: 'பரவாயில்லை.', english: 'No worries. This one is tricky.' },
  { tamil: 'கிட்ட வந்திட்டீங்க.', english: "You're getting there." },
]

export const RESULT: Record<'perfect' | 'great' | 'good' | 'start', Line> = {
  perfect: { tamil: 'ஐந்துக்கு ஐந்து!', english: 'Perfect. Ammamma would be proud.' },
  great: { tamil: 'நல்லா இருக்கு.', english: 'Really good. Explore more and come back.' },
  good: { tamil: 'தொடர்ந்து படியுங்கோ.', english: 'Keep going. Every word you hear stays with you.' },
  start: { tamil: 'ஆரம்பம்தான்.', english: 'Every expert was once a beginner. Explore more and try again.' },
}

/** Single words and short labels that appear around the app */
export const UI = {
  hello: { tamil: 'வணக்கம்', english: 'Hello' },
  learn: { tamil: 'கற்க', english: 'Learn' },
  challenge: { tamil: 'தேர்வு', english: 'Challenge' },
  write: { tamil: 'எழுது', english: 'Write' },
  progress: { tamil: 'முன்னேற்றம்', english: 'Progress' },
  home: { tamil: 'வீடு', english: 'Home' },
  wellDone: { tamil: 'சபாஷ்!', english: 'Well done!' },
  didIt: { tamil: 'நல்லாச் செய்தீங்க.', english: 'You did it.' },
  startHere: { tamil: 'இங்கே தொடங்குங்கோ', english: 'Start here' },
  dialogue: { tamil: 'டயலாக்', english: 'Dialogue' },
} satisfies Record<string, Line>
