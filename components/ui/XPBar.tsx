'use client'
import { useXP } from '@/hooks/useXP'

interface Props {
  variant?: 'light' | 'dark'
}

export function XPBar({ variant = 'light' }: Props) {
  const { xp, currentLevel, nextLevel, levelProgress } = useXP()
  const dark = variant === 'dark'

  const muted = dark ? 'rgba(255,255,255,0.5)' : 'var(--stone)'

  return (
    <section
      aria-label="Your level and XP"
      style={{
        background: dark ? 'var(--navy)' : 'var(--white)',
        border: dark ? 'none' : '1.5px solid var(--cream-dark)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div
            lang="ta"
            style={{
              fontFamily: 'var(--font-tamil)',
              fontSize: 24,
              lineHeight: 1.2,
              color: dark ? 'var(--turmeric)' : 'var(--navy)',
            }}
          >
            {currentLevel.tamil}
          </div>
          <div
            style={{
              fontSize: 12,
              color: muted,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginTop: 2,
              fontFamily: 'var(--font-display)',
            }}
          >
            {currentLevel.roman} · {currentLevel.english}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1, color: dark ? 'var(--turmeric)' : 'var(--vermillion)', letterSpacing: 1 }}>
            {xp}
          </div>
          <div style={{ fontSize: 11, color: muted, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>XP</div>
        </div>
      </div>

      {nextLevel ? (
        <>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={levelProgress.percent}
            aria-label={`Progress to ${nextLevel.roman}`}
            style={{
              background: dark ? 'rgba(255,255,255,0.12)' : 'var(--cream-dark)',
              borderRadius: 4,
              height: 6,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${levelProgress.percent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--vermillion), var(--turmeric))',
                borderRadius: 4,
                transition: 'width 600ms ease-out',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: muted }}>
            <span>
              {levelProgress.current} / {levelProgress.required} XP
            </span>
            <span>
              Next: {nextLevel.roman}
            </span>
          </div>
        </>
      ) : (
        <div style={{ fontSize: 12, color: 'var(--turmeric)', textAlign: 'center', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
          Highest level reached. <span lang="ta">நீ கற்றவர்.</span>
        </div>
      )}
    </section>
  )
}
