'use client'
import { useCallback, useMemo } from 'react'
import { badges, Badge } from '@/data/badges'
import { lessonsFor } from '@/data/lessons'
import { useProgress } from './useProgress'
import { useXP } from './useXP'
import { useLessons } from './useLessons'
import { getStore, removeStore, useStore, writeStore } from '@/lib/store'

export const BADGES_SEEN_KEY = 'tamil-badges-seen'
export const CHALLENGE_BEST_KEY = 'tamil-challenge-best'
const NONE: string[] = []

/** Record a challenge score; only the best is kept. */
export function recordChallengeScore(score: number) {
  const best = getStore<number>(CHALLENGE_BEST_KEY, 0)
  if (score > best) writeStore(CHALLENGE_BEST_KEY, score)
}

export function useBadges() {
  const { progress } = useProgress()
  const { xp, currentLevel } = useXP()
  const { isComplete, countDone } = useLessons()
  const challengeBest = useStore<number>(CHALLENGE_BEST_KEY, 0)
  const celebrated = useStore<string[]>(BADGES_SEEN_KEY, NONE)

  const earned: Badge[] = useMemo(
    () =>
      badges.filter(b =>
        b.earned({
          progress,
          xp,
          level: currentLevel.level,
          isComplete,
          countDone,
          totalIn: t => lessonsFor(t).length,
          challengeBest,
        }),
      ),
    [progress, xp, currentLevel.level, isComplete, countDone, challengeBest],
  )

  /** Earned but not yet celebrated */
  const fresh = useMemo(() => earned.filter(b => !celebrated.includes(b.id)), [earned, celebrated])

  const markCelebrated = useCallback((id: string) => {
    const prev = getStore<string[]>(BADGES_SEEN_KEY, NONE)
    if (!prev.includes(id)) writeStore(BADGES_SEEN_KEY, [...prev, id])
  }, [])

  const resetBadges = useCallback(() => {
    removeStore(BADGES_SEEN_KEY)
    removeStore(CHALLENGE_BEST_KEY)
  }, [])

  return { all: badges, earned, isEarned: (id: string) => earned.some(b => b.id === id), fresh, markCelebrated, resetBadges }
}
