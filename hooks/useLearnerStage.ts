'use client'
import { useCallback } from 'react'
import { LearnerStage } from '@/types'
import { removeStore, useHydrated, useStore, writeStore } from '@/lib/store'

export const STAGE_KEY = 'tamil-stage'
export const ONBOARDING_KEY = 'tamil-onboarding-complete'

const VALID: LearnerStage[] = ['newbie', 'intermediate', 'advanced']

export function useLearnerStage() {
  const stored = useStore<string | null>(STAGE_KEY, null)
  const complete = useStore<boolean>(ONBOARDING_KEY, false)
  const mounted = useHydrated()

  const stage: LearnerStage = VALID.includes(stored as LearnerStage)
    ? (stored as LearnerStage)
    : 'newbie'

  const setStage = useCallback((s: LearnerStage) => writeStore(STAGE_KEY, s), [])
  const completeOnboarding = useCallback(() => writeStore(ONBOARDING_KEY, true), [])
  const resetOnboarding = useCallback(() => {
    removeStore(STAGE_KEY)
    removeStore(ONBOARDING_KEY)
  }, [])

  return {
    stage,
    onboardingComplete: complete === true,
    mounted,
    setStage,
    completeOnboarding,
    resetOnboarding,
  }
}
