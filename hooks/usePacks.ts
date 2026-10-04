'use client'
import { useCallback, useMemo } from 'react'
import { packs, Pack } from '@/data/packs'
import { getStore, useStore, writeStore } from '@/lib/store'

export const PACKS_KEY = 'tamil-packs-complete'
const NONE: string[] = []

export function usePacks() {
  const done = useStore<string[]>(PACKS_KEY, NONE)

  const complete = useCallback((id: string) => {
    const prev = getStore<string[]>(PACKS_KEY, NONE)
    if (!prev.includes(id)) writeStore(PACKS_KEY, [...prev, id])
  }, [])

  const isComplete = useCallback((id: string) => done.includes(id), [done])

  /** First pack not yet finished, in path order. null when all are done. */
  const nextPack: Pack | null = useMemo(() => packs.find(p => !done.includes(p.id)) ?? null, [done])

  return { packs, done, complete, isComplete, nextPack, completedCount: done.filter(id => packs.some(p => p.id === id)).length }
}
