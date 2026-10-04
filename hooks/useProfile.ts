'use client'
import { useCallback } from 'react'
import { removeStore, useStore, writeStore } from '@/lib/store'
import { getCharacter } from '@/data/avatars'

export type Dialect = 'lk' | 'in'

export const AVATAR_KEY = 'tamil-avatar'
export const DIALECT_KEY = 'tamil-dialect'
export const SFX_KEY = 'tamil-sfx'
export const NAME_KEY = 'tamil-name'
export const NAME_MAX = 20

/** Things the user chose about themselves. Stays on their device. */
export function useProfile() {
  const avatarId = useStore<string | null>(AVATAR_KEY, null)
  const dialect = useStore<Dialect>(DIALECT_KEY, 'lk')
  const sfx = useStore<boolean>(SFX_KEY, true)
  const name = useStore<string>(NAME_KEY, '')

  return {
    character: getCharacter(avatarId),
    hasAvatar: avatarId !== null,
    dialect,
    sfx,
    name: name.trim(),
    setName: useCallback((n: string) => {
      const clean = n.replace(/\s+/g, ' ').slice(0, NAME_MAX)
      if (clean.trim()) writeStore(NAME_KEY, clean)
      else removeStore(NAME_KEY)
    }, []),
    setAvatar: useCallback((id: string) => writeStore(AVATAR_KEY, id), []),
    setDialect: useCallback((d: Dialect) => writeStore(DIALECT_KEY, d), []),
    setSfx: useCallback((on: boolean) => writeStore(SFX_KEY, on), []),
    resetProfile: useCallback(() => {
      removeStore(AVATAR_KEY)
      removeStore(DIALECT_KEY)
      removeStore(NAME_KEY)
    }, []),
  }
}
