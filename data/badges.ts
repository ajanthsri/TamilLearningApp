import { ProgressState } from '@/types'
import { Track } from './lessons'

export type BadgeState = {
  progress: ProgressState
  xp: number
  level: number
  isComplete: (track: Track, id: string) => boolean
  countDone: (track: Track) => number
  totalIn: (track: Track) => number
  challengeBest: number
}

export type Badge = {
  id: string
  title: string
  tamil: string
  /** How you earn it, shown on locked badges too */
  how: string
  glyph: string
  colour: string
  earned: (s: BadgeState) => boolean
}

// Worked out from what is already stored, so badges can't drift out of sync.
export const badges: Badge[] = [
  { id: 'first-word', title: 'First word', tamil: 'முதல் சொல்', how: 'Hear your first Tamil word', glyph: 'அ', colour: '#C1272D', earned: s => s.progress.seen.words.length > 0 },
  { id: 'vanakkam', title: 'Vanakkam!', tamil: 'வணக்கம்', how: 'Finish Speak: Greetings', glyph: 'வ', colour: '#E88A4F', earned: s => s.isComplete('speak', 'greetings') },
  { id: 'letter-reader', title: 'Letter reader', tamil: 'எழுத்து', how: 'Finish Read: First vowels', glyph: 'எ', colour: '#F5A623', earned: s => s.isComplete('read', 'vowels-1') },
  { id: 'shape-spotter', title: 'Shape spotter', tamil: 'வடிவம்', how: 'Finish Write: First shapes', glyph: 'ஆ', colour: '#6FBF7A', earned: s => s.isComplete('write', 'vowels-1') },
  { id: 'century', title: 'Century', tamil: 'நூறு', how: 'Earn 100 XP', glyph: '௱', colour: '#7B9ED9', earned: s => s.xp >= 100 },
  { id: 'student', title: 'Student', tamil: 'மாணவர்', how: 'Reach level 2', glyph: 'ம', colour: '#B08BE8', earned: s => s.level >= 2 },
  { id: 'film-fan', title: 'Film fan', tamil: 'சினிமா', how: 'Hear or break down a cinema line', glyph: 'சி', colour: '#D98CA0', earned: s => s.progress.seen.dialogues.length > 0 },
  { id: 'perfect-five', title: 'Perfect five', tamil: 'ஐந்துக்கு ஐந்து', how: 'Get 5 out of 5 in a challenge', glyph: '௫', colour: '#F5A623', earned: s => s.challengeBest >= 5 },
  { id: 'chatterbox', title: 'Chatterbox', tamil: 'பேச்சாளர்', how: 'Finish every Speak lesson', glyph: 'பே', colour: '#C1272D', earned: s => s.countDone('speak') === s.totalIn('speak') },
]
