'use client'
import { useCallback, useMemo } from 'react'
import { ModuleKey, ProgressState, EMPTY_PROGRESS } from '@/types'
import { getStore, useStore, writeStore } from '@/lib/store'

export const PROGRESS_KEY = 'tamil-progress'

/** Older or hand-edited data may be missing modules; fill the gaps. */
function normalise(p: ProgressState): ProgressState {
  if (p === EMPTY_PROGRESS) return p
  return {
    seen: { ...EMPTY_PROGRESS.seen, ...(p?.seen ?? {}) },
    practised: { ...EMPTY_PROGRESS.practised, ...(p?.practised ?? {}) },
  }
}

function current(): ProgressState {
  return normalise(getStore(PROGRESS_KEY, EMPTY_PROGRESS))
}

export function useProgress() {
  const raw = useStore(PROGRESS_KEY, EMPTY_PROGRESS)
  const progress = useMemo(() => normalise(raw), [raw])

  const markSeen = useCallback((module: ModuleKey, id: number) => {
    const prev = current()
    if (prev.seen[module].includes(id)) return
    writeStore(PROGRESS_KEY, {
      ...prev,
      seen: { ...prev.seen, [module]: [...prev.seen[module], id] },
    })
  }, [])

  /** Practised implies seen. */
  const markPractised = useCallback((module: ModuleKey, id: number) => {
    const prev = current()
    if (prev.practised[module].includes(id)) return
    const seen = prev.seen[module].includes(id)
      ? prev.seen
      : { ...prev.seen, [module]: [...prev.seen[module], id] }
    writeStore(PROGRESS_KEY, {
      seen,
      practised: { ...prev.practised, [module]: [...prev.practised[module], id] },
    })
  }, [])

  const isSeen = useCallback(
    (module: ModuleKey, id: number) => progress.seen[module].includes(id),
    [progress],
  )
  const isPractised = useCallback(
    (module: ModuleKey, id: number) => progress.practised[module].includes(id),
    [progress],
  )
  const countSeen = useCallback((module: ModuleKey) => progress.seen[module].length, [progress])
  const countPractised = useCallback(
    (module: ModuleKey) => progress.practised[module].length,
    [progress],
  )

  const clearAll = useCallback(() => writeStore(PROGRESS_KEY, EMPTY_PROGRESS), [])

  return { progress, markSeen, markPractised, isSeen, isPractised, countSeen, countPractised, clearAll }
}
