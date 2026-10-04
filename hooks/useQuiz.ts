'use client'
import { useCallback, useState } from 'react'
import { words } from '@/data/words'
import { letters } from '@/data/letters'
import { LearnerStage, PlacementSeed, QuizQuestion } from '@/types'
import { shuffle } from '@/lib/store'

export type { QuizQuestion }

export const QUIZ_LENGTH = 5

// Always in the word pool, so the quiz works on first open:
// vanakkam, amma, appa, aam, illai
export const SEED_WORD_IDS = [7, 1, 2, 9, 10]

const LETTER_SHARE = 0.3

function distinct(values: string[], exclude: string, n: number): string[] {
  return shuffle([...new Set(values)].filter(v => v !== exclude)).slice(0, n)
}

export function wordQuestion(id: number, index: number, hideRoman = false): QuizQuestion | null {
  const w = words.find(x => x.id === id)
  if (!w) return null
  return {
    id: `word-${w.id}-${index}`,
    type: 'word',
    module: 'words',
    prompt: w.tamil,
    promptRoman: w.roman,
    correct: w.english,
    options: shuffle([w.english, ...distinct(words.map(x => x.english), w.english, 3)]),
    itemId: w.id,
    hideRoman,
  }
}

export function letterQuestion(id: number, index: number): QuizQuestion | null {
  const l = letters.find(x => x.id === id)
  if (!l) return null
  // Prefer distractors of the same type (vowel vs consonant) so it isn't a giveaway
  const sameType = letters.filter(x => x.type === l.type).map(x => x.roman)
  return {
    id: `letter-${l.id}-${index}`,
    type: 'letter',
    module: 'letters',
    prompt: l.tamil,
    promptRoman: l.roman,
    correct: l.roman,
    options: shuffle([l.roman, ...distinct(sameType, l.roman, 3)]),
    itemId: l.id,
    // The romanisation is the answer, so it is always hidden on letter questions
    hideRoman: true,
  }
}

/** Hear or see a sound, pick the letter that makes it. Options are letters of the same type. */
export function shapeQuestion(id: number, index: number): QuizQuestion | null {
  const l = letters.find(x => x.id === id)
  if (!l) return null
  const sameType = letters.filter(x => x.type === l.type).map(x => x.tamil)
  return {
    id: `shape-${l.id}-${index}`,
    type: 'shape',
    module: 'letters',
    prompt: l.roman,
    promptRoman: l.roman,
    correct: l.tamil,
    options: shuffle([l.tamil, ...distinct(sameType, l.tamil, 3)]),
    itemId: l.id,
    hideRoman: true,
  }
}

export function useQuiz(seenWordIds: number[], seenLetterIds: number[], stage: LearnerStage = 'newbie') {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [isComplete, setIsComplete] = useState(false)

  const start = (qs: QuizQuestion[]) => {
    setQuestions(qs)
    setCurrentIndex(0)
    setAnswers({})
    setIsComplete(false)
  }

  const buildQuiz = useCallback(() => {
    const wordPool = shuffle(
      words.filter(w => seenWordIds.includes(w.id) || SEED_WORD_IDS.includes(w.id)).map(w => w.id),
    )
    // Letters need 4+ seen, except for Advanced, who can get any letter from day one
    const seenLetters = letters.filter(l => seenLetterIds.includes(l.id)).map(l => l.id)
    const letterPool = shuffle(
      seenLetters.length >= 4 ? seenLetters : stage === 'advanced' ? letters.map(l => l.id) : [],
    )

    const qs: QuizQuestion[] = []
    for (let i = 0; i < QUIZ_LENGTH; i++) {
      const wantLetter = letterPool.length > 0 && (Math.random() < LETTER_SHARE || wordPool.length === 0)
      const q = wantLetter
        ? letterQuestion(letterPool.pop()!, i)
        : wordPool.length > 0
          ? wordQuestion(wordPool.pop()!, i)
          : null
      if (q) qs.push(q)
    }
    start(qs)
  }, [seenWordIds, seenLetterIds, stage])

  const buildFixedQuiz = useCallback((seeds: PlacementSeed[]) => {
    const qs = seeds
      .map((s, i) => (s.type === 'word' ? wordQuestion(s.id, i, s.hideRoman) : letterQuestion(s.id, i)))
      .filter((q): q is QuizQuestion => q !== null)
    start(qs)
  }, [])

  /** Records the first answer only. Returns whether it was correct. */
  const submitAnswer = useCallback(
    (questionId: string, answer: string): boolean => {
      const question = questions.find(q => q.id === questionId)
      if (!question) return false
      const correct = answer === question.correct
      setAnswers(prev => (questionId in prev ? prev : { ...prev, [questionId]: correct }))
      return correct
    },
    [questions],
  )

  const advance = useCallback(() => {
    if (currentIndex + 1 >= questions.length) setIsComplete(true)
    else setCurrentIndex(currentIndex + 1)
  }, [currentIndex, questions.length])

  const score = Object.values(answers).filter(Boolean).length
  const currentQuestion = questions[currentIndex] ?? null

  return {
    questions,
    currentQuestion,
    currentIndex,
    answers,
    score,
    isComplete,
    buildQuiz,
    buildFixedQuiz,
    submitAnswer,
    advance,
  }
}
