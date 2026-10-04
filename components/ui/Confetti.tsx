'use client'
import { CSSProperties, useMemo } from 'react'

const COLOURS = ['#C1272D', '#F5A623', '#FDFAF4', '#6FBF7A', '#7B9ED9', '#D98CA0']

/** One-shot poster-colour confetti. Purely decorative. */
export function Confetti({ count = 46 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 400,
        duration: 1600 + Math.random() * 1200,
        drift: (Math.random() - 0.5) * 120,
        spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 8,
        colour: COLOURS[i % COLOURS.length],
        round: Math.random() > 0.7,
      })),
    [count],
  )

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1100 }}>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={
            {
              position: 'absolute',
              top: 0,
              left: `${p.left}%`,
              width: p.round ? p.w : p.w,
              height: p.round ? p.w : p.h,
              borderRadius: p.round ? '50%' : 2,
              background: p.colour,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}deg`,
              animation: `confettiFall ${p.duration}ms ${p.delay}ms ease-in-out both`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
