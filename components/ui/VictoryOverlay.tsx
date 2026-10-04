'use client'
import { useEffect, useState } from 'react'

const PRAISE = [
  { tamil: 'அது சரிதான்!', english: "That's exactly right." },
  { tamil: 'பாரு!', english: 'Look at you go.' },
  { tamil: 'நல்லா சொன்னே.', english: 'Well said.' },
  { tamil: 'சரியா சொன்னே!', english: 'Perfect.' },
  { tamil: 'ஆமா!', english: "Yes — you've got it." },
  { tamil: 'தெரியும் உனக்கு.', english: 'You already knew that.' },
  { tamil: 'அழகா சொன்னே.', english: 'Beautifully said.' },
  { tamil: 'சரி சரி!', english: "That's it!" },
]

interface Props {
  visible: boolean
  tamil: string
  xpGained: number
  isLevelUp?: boolean
  levelName?: string
  levelNameEnglish?: string
  onDismiss: () => void
}

export function VictoryOverlay({ visible, tamil, xpGained, isLevelUp, levelName, levelNameEnglish, onDismiss }: Props) {
  const [praise] = useState(() => PRAISE[Math.floor(Math.random() * PRAISE.length)])
  const [phase, setPhase] = useState<'flash' | 'reveal' | 'levelup' | 'done'>('done')

  useEffect(() => {
    if (!visible) { setPhase('done'); return }
    setPhase('flash')
    const t1 = setTimeout(() => setPhase('reveal'), 280)
    const t2 = setTimeout(() => {
      if (isLevelUp) setPhase('levelup')
      else { setPhase('done'); onDismiss() }
    }, 2000)
    const t3 = isLevelUp ? setTimeout(() => { setPhase('done'); onDismiss() }, 3800) : null
    return () => { clearTimeout(t1); clearTimeout(t2); if (t3) clearTimeout(t3) }
  }, [visible, isLevelUp, onDismiss])

  if (phase === 'done') return null

  return (
    <div onClick={onDismiss} style={{ position: 'fixed', inset: 0, zIndex: 1000, cursor: 'pointer' }}>
      {/* Flash */}
      {phase === 'flash' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--vermillion)',
          animation: 'victoryFlash 280ms ease-out forwards',
        }} />
      )}

      {/* Main reveal */}
      {(phase === 'reveal' || phase === 'levelup') && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--navy)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 32,
          animation: 'victoryReveal 220ms ease-out forwards',
        }}>
          {/* Decorative line */}
          <div style={{ width: 48, height: 2, background: 'var(--vermillion)', marginBottom: 28 }} />

          {/* Tamil word that was correct */}
          <div style={{
            fontFamily: 'var(--font-tamil)',
            fontSize: 56,
            color: 'var(--turmeric)',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 16,
          }}>
            {tamil}
          </div>

          {/* Praise */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-tamil)', fontSize: 20, color: '#fff', marginBottom: 4 }}>
              {praise.tamil}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
              {praise.english}
            </div>
          </div>

          {/* XP gained */}
          <div style={{
            background: 'var(--vermillion)',
            borderRadius: 24,
            padding: '8px 20px',
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: '#fff',
            letterSpacing: 2,
            animation: 'xpFloat 300ms 200ms ease-out both',
          }}>
            +{xpGained} XP
          </div>

          {/* Level up bonus */}
          {phase === 'levelup' && levelName && (
            <div style={{
              marginTop: 32,
              textAlign: 'center',
              animation: 'levelUpStamp 400ms 100ms ease-out both',
            }}>
              <div style={{ fontSize: 11, color: 'var(--turmeric)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                Level Up
              </div>
              <div style={{ fontFamily: 'var(--font-tamil)', fontSize: 42, color: '#fff' }}>
                {levelName}
              </div>
              {levelNameEnglish && (
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                  {levelNameEnglish}
                </div>
              )}
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 24, fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>
            tap to continue
          </div>
        </div>
      )}
    </div>
  )
}
