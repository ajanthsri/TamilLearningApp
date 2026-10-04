import { Dialogue } from '@/types'
import { filmLines } from './film-lines'
import { SHOW_FILM_LINES } from '@/lib/config'

// Breakdown glosses to be checked by a native speaker.

/** Original lines written in the spirit of Tamil cinema */
export const originalDialogues: Dialogue[] = [
  {
    id: 1,
    tamil: 'நான் யாரையும் தேடவில்லை. ஆனால் தேவைப்பட்டால் கண்டுபிடிப்பேன்.',
    roman: 'Naan yaaraiyum thedavillai. Aanaal thevaipattaal kandupidippeen.',
    english: "I don't look for anyone. But if needed, I will find them.",
    inspiration: 'The Everyman Hero — cool, philosophical, unstoppable',
    mood: 'swagger',
    notes: 'The quiet confidence of someone who needs nothing but fears nothing either.',
    breakdown: [
      { tamil: 'நான்', roman: 'naan', english: 'I' },
      { tamil: 'யாரையும்', roman: 'yaaraiyum', english: 'anyone' },
      { tamil: 'தேடவில்லை', roman: 'thedavillai', english: "don't look for" },
      { tamil: 'ஆனால்', roman: 'aanaal', english: 'but' },
      { tamil: 'தேவைப்பட்டால்', roman: 'thevaipattaal', english: 'if needed' },
      { tamil: 'கண்டுபிடிப்பேன்', roman: 'kandupidippeen', english: 'I will find' },
    ],
  },
  {
    id: 2,
    tamil: 'மனிதன் தோற்கலாம். ஆனால் மனசு தோற்கக்கூடாது.',
    roman: 'Manithan thoarkalaam. Aanaal manasu thoarkakuudaadhu.',
    english: 'A man can lose. But the mind must not.',
    inspiration: 'The Thinking Man — emotional, layered, searching',
    mood: 'philosophical',
    notes: 'On resilience — the body may fall, but the spirit refuses.',
    breakdown: [
      { tamil: 'மனிதன்', roman: 'manithan', english: 'a person' },
      { tamil: 'தோற்கலாம்', roman: 'thoarkalaam', english: 'can lose' },
      { tamil: 'ஆனால்', roman: 'aanaal', english: 'but' },
      { tamil: 'மனசு', roman: 'manasu', english: 'the heart, the mind' },
      { tamil: 'தோற்கக்கூடாது', roman: 'thoarkakkuudaadhu', english: 'must not lose' },
    ],
  },
  {
    id: 3,
    tamil: 'நீ இல்லாத இடமும் என் நினைவில் நிறைந்திருக்கிறது.',
    roman: 'Nee illaadha idamum en ninaivil niraindhirukkiradhu.',
    english: 'Even places without you are filled with my memories of you.',
    inspiration: 'The Romantic — poetic, longing, beautiful',
    mood: 'romantic',
    notes: 'Longing and love in a single image.',
    breakdown: [
      { tamil: 'நீ', roman: 'nee', english: 'you' },
      { tamil: 'இல்லாத', roman: 'illaadha', english: 'without (you)' },
      { tamil: 'இடமும்', roman: 'idamum', english: 'even the place' },
      { tamil: 'என்', roman: 'en', english: 'my' },
      { tamil: 'நினைவில்', roman: 'ninaivil', english: 'in memory' },
      { tamil: 'நிறைந்திருக்கிறது', roman: 'niraindhirukkiradhu', english: 'is filled' },
    ],
  },
  {
    id: 4,
    tamil: 'நாங்கள் எழுதிய வரலாறு யாரும் அழிக்க முடியாது.',
    roman: 'Naangal ezhuthiya varalaaru yaarum azhikka mudiyaadhu.',
    english: 'The history we wrote, no one can erase.',
    inspiration: 'The Voice of the People — proud, conscious, clear',
    mood: 'political',
    notes: 'On cultural pride and the permanence of collective memory.',
    breakdown: [
      { tamil: 'நாங்கள்', roman: 'naangal', english: 'we' },
      { tamil: 'எழுதிய', roman: 'ezhuthiya', english: 'that (we) wrote' },
      { tamil: 'வரலாறு', roman: 'varalaaru', english: 'history' },
      { tamil: 'யாரும்', roman: 'yaarum', english: 'no one' },
      { tamil: 'அழிக்க', roman: 'azhikka', english: 'to erase' },
      { tamil: 'முடியாது', roman: 'mudiyaadhu', english: 'cannot' },
    ],
  },
  {
    id: 5,
    tamil: 'என்னால் முடியும் என்று நம்பினேன். அதுவே போதும்.',
    roman: "Ennaal mudiyum endru nambineen. Adhuvee poodhum.",
    english: 'I believed I could. That was enough.',
    inspiration: "The People's Champion — defiant, warm, unstoppable",
    mood: 'defiant',
    notes: 'Self-belief as the only prerequisite for action.',
    breakdown: [
      { tamil: 'என்னால்', roman: 'ennaal', english: 'by me' },
      { tamil: 'முடியும்', roman: 'mudiyum', english: 'can (do it)' },
      { tamil: 'என்று', roman: 'endru', english: 'that (quoting)' },
      { tamil: 'நம்பினேன்', roman: 'nambineen', english: 'I believed' },
      { tamil: 'அதுவே', roman: 'adhuvee', english: 'that itself' },
      { tamil: 'போதும்', roman: 'poodhum', english: 'is enough' },
    ],
  },
]

/** Film lines alternate with originals, so the line of the day mixes both */
function interleave(a: Dialogue[], b: Dialogue[]): Dialogue[] {
  const out: Dialogue[] = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i])
    if (b[i]) out.push(b[i])
  }
  return out
}

/** Every line the app shows. Film lines only when SHOW_FILM_LINES is on. */
export const dialogues: Dialogue[] = SHOW_FILM_LINES ? interleave(filmLines, originalDialogues) : originalDialogues
