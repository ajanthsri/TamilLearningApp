'use client'
import { useState, KeyboardEvent } from 'react'
import { Letter } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { StatusMark } from './shared'

interface Props {
  letter: Letter
  seen: boolean
  practised?: boolean
  index?: number
  onHear: () => void
  onReveal: () => void
}

export function LetterCard({ letter, seen, practised, index = 0, onHear, onReveal }: Props) {
  const [flipped, setFlipped] = useState(false)

  const toggle = () => {
    if (!flipped) onReveal()
    setFlipped(f => !f)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  const face = {
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    boxShadow: 'var(--shadow-card)',
  }

  return (
    <div
      className={`flip tappable ${flipped ? 'flipped' : ''}`}
      style={{ height: 150, animation: `stampIn 180ms ${Math.min(index, 10) * 40}ms ease-out backwards` }}
    >
      <div
        className="flip-inner"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`Letter ${letter.roman}. Tap to ${flipped ? 'show the letter' : 'see an example word'}`}
        onClick={toggle}
        onKeyDown={onKey}
      >
        {/* Front */}
        <div
          className="flip-face"
          style={{
            ...face,
            background: 'var(--navy)',
            border: seen ? '2px solid var(--turmeric)' : '2px solid transparent',
          }}
        >
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <StatusMark seen={seen} practised={practised} dark />
          </div>
          <div lang="ta" style={{ fontFamily: 'var(--font-tamil-learn)', fontSize: 52, color: '#fff', lineHeight: 1.1 }}>
            {letter.tamil}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
            {letter.roman}
          </div>
          <div onClick={e => e.stopPropagation()}>
            <AudioButton text={letter.tamil} onPlay={onHear} size="sm" variant="vermillion" />
          </div>
        </div>

        {/* Back */}
        <div
          className="flip-face flip-back"
          style={{ ...face, background: 'var(--white)', border: '2px solid var(--turmeric)', gap: 2 }}
        >
          <div lang="ta" style={{ fontFamily: 'var(--font-tamil-learn)', fontSize: 26, color: 'var(--navy)', lineHeight: 1.3, textAlign: 'center' }}>
            {letter.example.tamil}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'var(--stone)' }}>
            {letter.example.roman}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 1, color: 'var(--vermillion)', marginBottom: 6 }}>
            {letter.example.english}
          </div>
          <div onClick={e => e.stopPropagation()}>
            <AudioButton text={letter.example.tamil} size="sm" variant="ghost" />
          </div>
        </div>
      </div>
    </div>
  )
}
