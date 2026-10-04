'use client'
import { useXP } from '@/hooks/useXP'

export function XPBar() {
  const { xp, currentLevel, nextLevel, levelProgress } = useXP()

  return (
    <div style={{
      background: 'var(--navy)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      color: '#fff',
    }}>
      {/* Level title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-tamil)',
            fontSize: 28,
            lineHeight: 1.1,
            color: 'var(--turmeric)',
          }}>
            {currentLevel.tamil}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2, fontFamily: 'var(--font-display)' }}>
            {currentLevel.roman} · {currentLevel.english}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--turmeric)', letterSpacing: 1 }}>
            {xp}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: 1, textTransform: 'uppercase' }}>XP</div>
        </div>
      </div>

      {/* Progress bar */}
      {nextLevel && (
        <>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 4,
            height: 6,
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${levelProgress.percent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--vermillion), var(--turmeric))',
              borderRadius: 4,
              transition: 'width 600ms ease-out',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>
              {levelProgress.current} / {levelProgress.required} XP
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5 }}>
              Next: {nextLevel.roman}
            </span>
          </div>
        </>
      )}

      {!nextLevel && (
        <div style={{ fontSize: 11, color: 'var(--turmeric)', textAlign: 'center', marginTop: 4, fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
          Maximum level reached. நீ கற்றவர்.
        </div>
      )}
    </div>
  )
}
