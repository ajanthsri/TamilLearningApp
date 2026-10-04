'use client'
import { useEffect, useRef } from 'react'
import { Badge } from '@/data/badges'
import { playFanfare } from '@/lib/sfx'
import { Confetti } from './Confetti'
import { Say } from './Say'

/** A poster-style medallion: sunburst disc, ribbon tails, Tamil glyph. Greyed when locked. */
export function Medal({ badge, earned, size = 84 }: { badge: Badge; earned: boolean; size?: number }) {
  const c = earned ? badge.colour : '#B5A898'
  const id = `m-${badge.id}-${earned ? 1 : 0}`
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" role="img" aria-label={`${badge.title}${earned ? '' : ' (locked)'}`} style={{ opacity: earned ? 1 : 0.55 }}>
      <defs>
        <clipPath id={id}>
          <circle cx="50" cy="48" r="40" />
        </clipPath>
      </defs>
      {/* Ribbon tails */}
      <path d="M30 78 L22 112 L36 104 L44 112 L46 80 Z" fill={earned ? '#C1272D' : '#9C9184'} />
      <path d="M70 78 L78 112 L64 104 L56 112 L54 80 Z" fill={earned ? '#9B1F23' : '#8C7B6B'} />
      {/* Disc */}
      <circle cx="50" cy="48" r="44" fill={earned ? '#F5A623' : '#D6CDBF'} />
      <circle cx="50" cy="48" r="40" fill="#1A1F3C" />
      <g clipPath={`url(#${id})`}>
        {Array.from({ length: 16 }).map((_, i) => (
          <path key={i} d="M50 48 L46 0 L54 0 Z" fill={c} opacity={0.22} transform={`rotate(${i * 22.5} 50 48)`} />
        ))}
      </g>
      <circle cx="50" cy="48" r="40" fill="none" stroke={c} strokeWidth="2.5" />
      <text x="50" y="62" textAnchor="middle" fontSize={badge.glyph.length > 1 ? 30 : 38} fill={earned ? '#FDFAF4' : '#B5A898'} fontFamily="'Tiro Tamil', 'Noto Sans Tamil', serif">
        {badge.glyph}
      </text>
    </svg>
  )
}

/** Full-screen "new badge" moment. Shows once per badge. */
export function BadgeCelebration({ badge, remaining, onDone }: { badge: Badge; remaining: number; onDone: () => void }) {
  const played = useRef<string | null>(null)
  useEffect(() => {
    if (played.current !== badge.id) {
      played.current = badge.id
      playFanfare()
    }
  }, [badge.id])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(26,31,60,0.94)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        color: '#fff',
        textAlign: 'center',
        animation: 'victoryReveal 220ms ease-out both',
      }}
    >
      <Confetti count={36} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 4, color: 'var(--turmeric)' }}>NEW BADGE</div>
      <div key={badge.id} style={{ margin: '14px 0 8px', animation: 'levelUpStamp 420ms ease-out both' }}>
        <Medal badge={badge} earned size={150} />
      </div>
      <h2 id="badge-title" style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: 1.5, lineHeight: 1, fontWeight: 400 }}>
        {badge.title}
      </h2>
      <div style={{ marginTop: 8 }}>
        <Say tamil={badge.tamil} size={20} colour="var(--turmeric)" button="light" />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.75)', marginTop: 10 }}>{badge.how}.</p>
      <button onClick={onDone} className="btn-primary" style={{ marginTop: 28, padding: '14px 34px', fontSize: 22 }} autoFocus>
        {remaining > 0 ? `Nice! (${remaining} more)` : 'Nice!'}
      </button>
    </div>
  )
}
