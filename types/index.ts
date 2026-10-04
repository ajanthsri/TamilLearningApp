// ─── Content Types ───────────────────────────────────────────────────────────

export type Letter = {
  id: number
  tamil: string
  roman: string
  type: 'vowel' | 'consonant'
  example: {
    tamil: string
    roman: string
    english: string
  }
}

export type Word = {
  id: number
  tamil: string
  roman: string
  english: string
  category: 'family' | 'food' | 'greetings' | 'emotions' | 'nature' | 'time'
  notes?: string
}

export type Phrase = {
  id: number
  tamil: string
  roman: string
  english: string
  situation: string
  literal?: string
}

export type DialogueWord = {
  tamil: string
  roman: string
  english: string
}

export type Dialogue = {
  id: number
  tamil: string
  roman: string
  english: string
  inspiration: string
  mood: 'swagger' | 'philosophical' | 'romantic' | 'political' | 'emotional' | 'defiant'
  notes?: string
  /** The line split into words, in order, for the newbie breakdown */
  breakdown?: DialogueWord[]
}

export type Level = {
  level: number
  tamil: string
  roman: string
  english: string
  xpRequired: number
}

// ─── Progress Types ───────────────────────────────────────────────────────────

export type ModuleKey = 'letters' | 'words' | 'phrases' | 'dialogues'

export type ProgressState = {
  seen: Record<ModuleKey, number[]>
  practised: Record<ModuleKey, number[]>
}

export const EMPTY_PROGRESS: ProgressState = {
  seen: { letters: [], words: [], phrases: [], dialogues: [] },
  practised: { letters: [], words: [], phrases: [], dialogues: [] },
}

// ─── XP Types ─────────────────────────────────────────────────────────────────

export type XPAction =
  | 'card_heard'
  | 'meaning_revealed'
  | 'quiz_correct'
  | 'quiz_completed'
  | 'writing_completed'
  | 'return_visit'
  | 'pack_completed'

export const XP_VALUES: Record<XPAction, number> = {
  card_heard: 5,
  meaning_revealed: 10,
  quiz_correct: 25,
  quiz_completed: 50,
  writing_completed: 15,
  return_visit: 30,
  pack_completed: 40,
}

export type XPState = {
  total: number
  lastVisitDate: string // local date YYYY-MM-DD
}

// ─── Learner Stage (not the same as XP levels) ───────────────────────────────

export type LearnerStage = 'newbie' | 'intermediate' | 'advanced'

export type LearnTab = 'letters' | 'words' | 'phrases' | 'dialogues'

export type StageInfo = {
  stage: LearnerStage
  tamil: string
  roman: string
  english: string
  description: string
  homeSubline: string
  defaultLearnTab: LearnTab
  startHereTitle: string
  startHereCopy: string
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

export type PlacementSeed = {
  type: 'word' | 'letter'
  id: number
  hideRoman?: boolean
}

export type QuizQuestion = {
  id: string
  type: 'word' | 'letter'
  module: ModuleKey
  prompt: string         // Tamil text
  promptRoman: string
  correct: string        // Answer text
  options: string[]      // 4 options including correct
  itemId: number
  hideRoman?: boolean
}
