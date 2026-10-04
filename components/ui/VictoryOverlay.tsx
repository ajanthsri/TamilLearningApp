'use client'
import { useEffect, useRef, useState } from 'react'
import { pickRandom } from '@/lib/store'
import { PRAISE } from '@/data/copy'
import { playCorrect } from '@/lib/sfx'
import { AudioButton } from './AudioButton'


const FLASH_MS = 280
const DISMISS_MS = 1800
const DISMISS_LEVELUP_MS = 3500
const LEVELUP_AT_MS = 900

interface Props {
  visible: boolean
  tamil: string
  xpGained: number
  isLevelUp?: boolean
  levelName?: string
  levelNameEnglish?: string
  onDismiss: () => void
}

type Phase = 'flash' | 'reveal' | 'levelup'

export function VictoryOverlay({ visible, tamil, xpGained, isLevelUp, levelName, levelNameEnglish, onDismiss }: Props) {
  const [phase, setPhase] = useState<Phase>('flash')
  const [praise, setPraise] = useState(PRAISE[0])

  // Keep the latest callback without restarting timers when the parent re-renders
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    if (!visible) return
    setPraise(pickRandom(PRAISE))
    playCorrect()
    setPhase('flash')
    const timers = [
      setTimeout(() => setPhase('reveal'), FLASH_MS),
      setTimeout(() => dismissRef.current(), isLevelUp ? DISMISS_LEVELUP_MS : DISMISS_MS),
    ]
    if (isLevelUp) timers.push(setTimeout(() => setPhase('levelup'), LEVELUP_AT_MS))
    return () => timers.forEach(clearTimeout)
  }, [visible, isLevelUp])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="assertive"
      aria-label="Correct answer"
      onClick={() => dismissRef.current()}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, cursor: 'pointer' }}
    >
      {phase === 'flash' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--vermillion)',
            animation: `victoryFlash ${FLASH_MS}ms ease-out forwards`,
          }}
        />
      )}

      {phase !== 'flash' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--navy)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
            animation: 'victoryReveal 220ms ease-out both',
            overflow: 'hidden',
          }}
        >
          {/* Sunburst behind the word, poster style */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: 720,
              height: 720,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -58%)',
              background:
                'repeating-conic-gradient(from 0deg, rgba(245,166,35,0.07) 0deg 6deg, transparent 6deg 18deg)',
              maskImage: 'radial-gradient(circle, #000 20%, transparent 65%)',
              WebkitMaskImage: 'radial-gradient(circle, #000 20%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ width: 48, height: 2, background: 'var(--vermillion)', marginBottom: 28 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', marginBottom: 16 }}>
          <div
            lang="ta"
            style={{
              fontFamily: 'var(--font-tamil)',
              fontSize: tamil.length > 8 ? 44 : 56,
              color: 'var(--turmeric)',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {tamil}
          </div>
          <AudioButton text={tamil} size="md" variant="light" />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative' }}>
            <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 20, color: '#fff', marginBottom: 4 }}>
              {praise.tamil}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
              {praise.english}
            </div>
          </div>

          <div
            style={{
              background: 'var(--vermillion)',
              borderRadius: 24,
              padding: '8px 20px',
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              color: '#fff',
              letterSpacing: 2,
              animation: 'xpFloat 300ms 200ms ease-out both',
              position: 'relative',
            }}
          >
            +{xpGained} XP
          </div>

          {phase === 'levelup' && levelName && (
            <div style={{ marginTop: 32, textAlign: 'center', animation: 'levelUpStamp 400ms ease-out both', position: 'relative' }}>
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--turmeric)',
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-display)',
                  marginBottom: 8,
                }}
              >
                Level up
              </div>
              <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 42, color: '#fff', lineHeight: 1.2 }}>
                {levelName}
              </div>
              {levelNameEnglish && (
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                  {levelNameEnglish}
                </div>
              )}
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 'calc(24px + env(safe-area-inset-bottom))', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>
            tap to continue
          </div>
        </div>
      )}
    </div>
  )
}
