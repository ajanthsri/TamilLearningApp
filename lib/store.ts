'use client'
import { useSyncExternalStore } from 'react'

/**
 * Tiny localStorage-backed store.
 *
 * Every component that reads a key gets the same value, and every write
 * notifies all readers. Without this, two components using useXP() would
 * each hold their own copy and drift apart.
 *
 * Server render and the first client render both see `fallback`, so there
 * is no hydration mismatch. Use `useHydrated()` to know when real values
 * are available.
 */

type Listener = () => void

const listeners = new Map<string, Set<Listener>>()
const cache = new Map<string, unknown>()

function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T
  let value = fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw !== null) value = JSON.parse(raw) as T
  } catch {
    // Private mode, blocked storage or bad JSON: fall back silently
  }
  cache.set(key, value)
  return value
}

export function writeStore<T>(key: string, value: T) {
  cache.set(key, value)
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: keep the in-memory value for this session
  }
  listeners.get(key)?.forEach(l => l())
}

export function removeStore(key: string) {
  cache.delete(key)
  try {
    window.localStorage.removeItem(key)
  } catch {}
  listeners.get(key)?.forEach(l => l())
}

export function getStore<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  return read(key, fallback)
}

function subscribe(key: string, listener: Listener) {
  if (!listeners.has(key)) listeners.set(key, new Set())
  listeners.get(key)!.add(listener)
  return () => {
    listeners.get(key)?.delete(listener)
  }
}

export function useStore<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    l => subscribe(key, l),
    () => read(key, fallback),
    () => fallback,
  )
}

const noopSubscribe = () => () => {}

/** False during server render and hydration, true once on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

/** Local calendar date, YYYY-MM-DD. (toISOString would give the UTC date.) */
export function todayLocal(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Unbiased shuffle (Fisher–Yates). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
