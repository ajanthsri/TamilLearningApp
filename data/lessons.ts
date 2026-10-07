import { packs } from './packs'

export type Track = 'speak' | 'read' | 'write'

export type LessonItem = { kind: 'word'; id: number } | { kind: 'letter'; id: number }

/** meaning: see Tamil → pick English · sound: see a letter → pick its sound · shape: get a sound → pick the letter */
export type CheckKind = 'meaning' | 'sound' | 'shape'

export type Lesson = {
  track: Track
  id: string
  number: number
  english: string
  tamil: string
  roman: string
  blurb: string
  colour: string
  items: LessonItem[]
  /** Show romanisation on the learn screens. Off for reading practice. */
  showRoman: boolean
  check: CheckKind
  checkCount: number
  /** Soft suggestion shown on the path. Nothing is ever locked. */
  hint?: string
  /** Tag for the one-time completion XP. Speak keeps the old pack ids so no one is paid twice. */
  xpTag: string
}

export type TrackInfo = {
  track: Track
  english: string
  tamil: string
  roman: string
  colour: string
  /** Darker shade for text on light backgrounds */
  ink: string
  tagline: string
}

export const TRACKS: Record<Track, TrackInfo> = {
  speak: { track: 'speak', english: 'Speak', tamil: 'பேசு', roman: 'pesu', colour: '#C1272D', ink: '#C1272D', tagline: 'Hear everyday words and say them back.' },
  read: { track: 'read', english: 'Read', tamil: 'படி', roman: 'padi', colour: '#F5A623', ink: '#8F5A00', tagline: 'Learn the letters, then read words without help.' },
  write: { track: 'write', english: 'Write', tamil: 'எழுது', roman: 'ezhuthu', colour: '#6FBF7A', ink: '#2D6A3F', tagline: 'Hear a sound and find its shape.' },
}

export const TRACK_ORDER: Track[] = ['speak', 'read', 'write']

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
const letterItems = (ids: number[]): LessonItem[] => ids.map(id => ({ kind: 'letter', id }))

// ── Speak: the six word packs ────────────────────────────────
const speak: Lesson[] = packs.map(p => ({
  track: 'speak',
  id: p.id,
  number: p.number,
  english: p.english,
  tamil: p.tamil,
  roman: p.roman,
  blurb: p.blurb,
  colour: p.colour,
  items: p.wordIds.map(id => ({ kind: 'word', id })),
  showRoman: true,
  check: 'meaning',
  checkCount: 3,
  xpTag: p.id,
}))

// ── Read: letters first, then the pack words with no romanisation ──
const readLetters: Lesson[] = [
  {
    track: 'read', id: 'vowels-1', number: 1, english: 'First vowels', tamil: 'உயிர் எழுத்து', roman: 'uyir ezhuthu',
    blurb: 'Six vowel shapes: அ to ஊ. Every Tamil word is built from these.', colour: '#F5A623',
    items: letterItems(range(1, 6)), showRoman: true, check: 'sound', checkCount: 4, xpTag: 'read:vowels-1',
  },
  {
    track: 'read', id: 'vowels-2', number: 2, english: 'More vowels', tamil: 'உயிர் எழுத்து', roman: 'uyir ezhuthu',
    blurb: 'The other six vowels: எ to ஔ.', colour: '#E88A4F',
    items: letterItems(range(7, 12)), showRoman: true, check: 'sound', checkCount: 4, xpTag: 'read:vowels-2',
  },
  {
    track: 'read', id: 'consonants-1', number: 3, english: 'First consonants', tamil: 'மெய் எழுத்து', roman: 'mei ezhuthu',
    blurb: 'Six common consonants: க ச த ந ப ம.', colour: '#B7791F',
    items: letterItems(range(13, 18)), showRoman: true, check: 'sound', checkCount: 4, xpTag: 'read:consonants-1',
  },
]

const readWords: Lesson[] = packs.map((p, i) => ({
  track: 'read',
  id: `words-${p.id}`,
  number: readLetters.length + i + 1,
  english: `Read: ${p.english}`,
  tamil: p.tamil,
  roman: p.roman,
  blurb: `The ${p.english.toLowerCase()} words, with no romanisation. Try reading first, then tap to hear.`,
  colour: p.colour,
  items: p.wordIds.map(id => ({ kind: 'word', id })),
  showRoman: false,
  check: 'meaning',
  checkCount: 3,
  hint: `Best after Speak: ${p.english}`,
  xpTag: `read:words-${p.id}`,
}))

// ── Write: hear a sound, find the shape ──────────────────────
const write: Lesson[] = [
  {
    track: 'write', id: 'vowels-1', number: 1, english: 'First shapes', tamil: 'அ ஆ இ ஈ உ', roman: 'a aa i ii u',
    blurb: 'Five vowels. Some are twins with a small tail, so look closely.', colour: '#6FBF7A',
    items: letterItems(range(1, 5)), showRoman: true, check: 'shape', checkCount: 5, xpTag: 'write:vowels-1',
  },
  {
    track: 'write', id: 'vowels-2', number: 2, english: 'More vowel shapes', tamil: 'ஊ எ ஏ ஐ ஒ ஓ ஔ', roman: 'uu e ee ai o oo au',
    blurb: 'The rest of the vowels. Watch the loops.', colour: '#2D6A3F',
    items: letterItems(range(6, 12)), showRoman: true, check: 'shape', checkCount: 5, xpTag: 'write:vowels-2',
  },
  {
    track: 'write', id: 'consonants-1', number: 3, english: 'Consonant shapes', tamil: 'க ச த ந ப ம', roman: 'ka sa tha na pa ma',
    blurb: 'Six consonants you will see everywhere.', colour: '#2F6F8F',
    items: letterItems(range(13, 18)), showRoman: true, check: 'shape', checkCount: 5, xpTag: 'write:consonants-1',
  },
]

export const lessons: Lesson[] = [...speak, ...readLetters, ...readWords, ...write]

export function lessonsFor(track: Track): Lesson[] {
  return lessons.filter(l => l.track === track)
}

export function getLesson(track: string, id: string): Lesson | undefined {
  return lessons.find(l => l.track === track && l.id === id)
}

export function isTrack(v: string): v is Track {
  return v === 'speak' || v === 'read' || v === 'write'
}
