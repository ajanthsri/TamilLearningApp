'use client'
import { useCallback, useMemo } from 'react'
import { Lesson, Track, TRACK_ORDER, lessonsFor } from '@/data/lessons'
import { getStore, removeStore, useStore, writeStore } from '@/lib/store'

export const LESSONS_KEY = 'tamil-lessons-complete'
export const LEGACY_PACKS_KEY = 'tamil-packs-complete'
export const LAST_TRACK_KEY = 'tamil-last-track'
const NONE: string[] = []

/** Lesson completion across Speak, Read and Write. Stored as 'track:id'. */
export function useLessons() {
  const done = useStore<string[]>(LESSONS_KEY, NONE)
  // Packs finished before tracks existed count as Speak lessons
  const legacy = useStore<string[]>(LEGACY_PACKS_KEY, NONE)
  const lastTrack = useStore<Track>(LAST_TRACK_KEY, 'speak')

  const all = useMemo(() => new Set([...done, ...legacy.map(id => `speak:${id}`)]), [done, legacy])

  const isComplete = useCallback((track: Track, id: string) => all.has(`${track}:${id}`), [all])

  const complete = useCallback((track: Track, id: string) => {
    const prev = getStore<string[]>(LESSONS_KEY, NONE)
    const key = `${track}:${id}`
    if (!prev.includes(key)) writeStore(LESSONS_KEY, [...prev, key])
  }, [])

  const setLastTrack = useCallback((t: Track) => writeStore(LAST_TRACK_KEY, t), [])

  const nextLesson = useCallback(
    (track: Track): Lesson | null => lessonsFor(track).find(l => !all.has(`${l.track}:${l.id}`)) ?? null,
    [all],
  )

  const countDone = useCallback((track: Track) => lessonsFor(track).filter(l => all.has(`${l.track}:${l.id}`)).length, [all])

  /** Next lesson in the track you used last, then the other tracks in order. */
  const continueLesson: Lesson | null = useMemo(() => {
    const order = [lastTrack, ...TRACK_ORDER.filter(t => t !== lastTrack)]
    for (const t of order) {
      const next = lessonsFor(t).find(l => !all.has(`${l.track}:${l.id}`))
      if (next) return next
    }
    return null
  }, [all, lastTrack])

  const resetLessons = useCallback(() => {
    removeStore(LESSONS_KEY)
    removeStore(LEGACY_PACKS_KEY)
    removeStore(LAST_TRACK_KEY)
  }, [])

  return { isComplete, complete, nextLesson, countDone, continueLesson, lastTrack, setLastTrack, resetLessons }
}
