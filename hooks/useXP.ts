'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { XPAction, XPState, XP_VALUES } from '@/types'
import { getLevelFromXP, getNextLevel, getProgressToNextLevel } from '@/data/levels'
import { getStore, todayLocal, useStore, writeStore } from '@/lib/store'

export const XP_KEY = 'tamil-xp'
export const AWARDED_KEY = 'tamil-xp-awarded'
const EMPTY_XP: XPState = { total: 0, lastVisitDate: '' }
const NO_AWARDS: string[] = []

/**
 * Awards return-visit XP once per calendar day. Idempotent, so it is safe
 * for every component using useXP() to call it on mount.
 * The very first visit records the date but awards nothing.
 */
function recordVisit() {
  const prev = getStore(XP_KEY, EMPTY_XP)
  const today = todayLocal()
  if (prev.lastVisitDate === today) return
  const isReturn = prev.lastVisitDate !== ''
  writeStore(XP_KEY, {
    total: prev.total + (isReturn ? XP_VALUES.return_visit : 0),
    lastVisitDate: today,
  })
}

export function useXP() {
  const xpState = useStore(XP_KEY, EMPTY_XP)
  const [levelUp, setLevelUp] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    recordVisit()
    return () => clearTimeout(timer.current)
  }, [])

  /** Reads and writes synchronously, so the return value is always accurate. */
  const addXP = useCallback((action: XPAction) => {
    const prev = getStore(XP_KEY, EMPTY_XP)
    const gained = XP_VALUES[action]
    const newTotal = prev.total + gained
    const leveledUp = getLevelFromXP(newTotal).level > getLevelFromXP(prev.total).level

    writeStore(XP_KEY, { ...prev, total: newTotal })

    if (leveledUp) {
      setLevelUp(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setLevelUp(false), 3500)
    }
    return { gained, newTotal, leveledUp, newLevel: getLevelFromXP(newTotal) }
  }, [])

  /**
   * Awards XP only the first time a given tag is seen, e.g. 'heard:words:7'.
   * Returns null if this tag was already rewarded.
   */
  const addXPOnce = useCallback(
    (action: XPAction, tag: string) => {
      const awarded = getStore<string[]>(AWARDED_KEY, NO_AWARDS)
      const fullTag = `${action}:${tag}`
      if (awarded.includes(fullTag)) return null
      writeStore(AWARDED_KEY, [...awarded, fullTag])
      return addXP(action)
    },
    [addXP],
  )

  return {
    addXPOnce,
    xp: xpState.total,
    currentLevel: getLevelFromXP(xpState.total),
    nextLevel: getNextLevel(xpState.total),
    levelProgress: getProgressToNextLevel(xpState.total),
    levelUp,
    addXP,
  }
}
