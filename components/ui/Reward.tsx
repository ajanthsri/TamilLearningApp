'use client'
import { useCallback, useState } from 'react'
import { XPAction } from '@/types'
import { useXP } from '@/hooks/useXP'
import { VictoryOverlay } from './VictoryOverlay'

type Toast = { amount: number; key: number }
type LevelUp = { tamil: string; xp: number; levelName: string; levelEnglish: string }

/**
 * Small rewards for exploring (hearing a card, revealing a meaning).
 * Shows a quiet "+5 XP" chip, or the full level-up overlay if this
 * reward crossed a level threshold.
 */
export function useReward() {
  const { addXPOnce } = useXP()
  const [toast, setToast] = useState<Toast | null>(null)
  const [levelUp, setLevelUp] = useState<LevelUp | null>(null)

  const reward = useCallback(
    (action: XPAction, tag: string, tamil: string) => {
      const result = addXPOnce(action, tag)
      if (!result) return
      if (result.leveledUp) {
        setLevelUp({
          tamil,
          xp: result.gained,
          levelName: result.newLevel.tamil,
          levelEnglish: `${result.newLevel.roman} · ${result.newLevel.english}`,
        })
      } else {
        const key = Date.now()
        setToast({ amount: result.gained, key })
        setTimeout(() => setToast(t => (t?.key === key ? null : t)), 1400)
      }
    },
    [addXPOnce],
  )

  const rewardUI = (
    <>
      {toast && (
        <div
          key={toast.key}
          role="status"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 'calc(84px + env(safe-area-inset-bottom))',
            transform: 'translateX(-50%)',
            zIndex: 200,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: 'var(--navy)',
              color: 'var(--turmeric)',
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: 1.5,
              padding: '6px 16px',
              borderRadius: 20,
              boxShadow: 'var(--shadow-heavy)',
              animation: 'xpFloat 220ms ease-out both',
            }}
          >
            +{toast.amount} XP
          </div>
        </div>
      )}
      <VictoryOverlay
        visible={levelUp !== null}
        tamil={levelUp?.tamil ?? ''}
        xpGained={levelUp?.xp ?? 0}
        isLevelUp
        levelName={levelUp?.levelName}
        levelNameEnglish={levelUp?.levelEnglish}
        onDismiss={() => setLevelUp(null)}
      />
    </>
  )

  return { reward, rewardUI }
}
