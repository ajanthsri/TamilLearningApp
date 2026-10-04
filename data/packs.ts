// Newbie learning path: short packs of everyday words, in order.
export type Pack = {
  id: string
  number: number
  tamil: string
  roman: string
  english: string
  blurb: string
  wordIds: number[]
  colour: string
}

export const packs: Pack[] = [
  {
    id: 'greetings',
    number: 1,
    tamil: 'வணக்கம்',
    roman: 'vanakkam',
    english: 'Greetings',
    blurb: 'Hello, thank you, yes and no. Enough to walk into any Tamil house.',
    wordIds: [7, 8, 9, 10, 11],
    colour: '#C1272D',
  },
  {
    id: 'family',
    number: 2,
    tamil: 'குடும்பம்',
    roman: 'kudumbam',
    english: 'Family',
    blurb: 'Amma, appa, and who to call anna at a wedding.',
    wordIds: [1, 2, 3, 4, 5, 6, 31],
    colour: '#B7791F',
  },
  {
    id: 'food',
    number: 3,
    tamil: 'சாப்பாடு',
    roman: 'saappaadu',
    english: 'Food',
    blurb: 'Rice, string hoppers and a cup of koppi.',
    wordIds: [12, 13, 14, 15, 16, 17],
    colour: '#2D6A3F',
  },
  {
    id: 'feelings',
    number: 4,
    tamil: 'உணர்வுகள்',
    roman: 'unarvugal',
    english: 'Feelings',
    blurb: 'Love, joy, and the look amma gives you.',
    wordIds: [18, 19, 20, 21, 22],
    colour: '#8B5CB8',
  },
  {
    id: 'nature',
    number: 5,
    tamil: 'இயற்கை',
    roman: 'iyarkai',
    english: 'Nature',
    blurb: 'Sea, sky, rain and the trees back home.',
    wordIds: [23, 24, 25, 26, 27],
    colour: '#2F6F8F',
  },
  {
    id: 'time',
    number: 6,
    tamil: 'நேரம்',
    roman: 'neram',
    english: 'Time',
    blurb: 'Yesterday, today and tomorrow.',
    wordIds: [28, 29, 30],
    colour: '#6B5B4B',
  },
]

export function getPack(id: string): Pack | undefined {
  return packs.find(p => p.id === id)
}
