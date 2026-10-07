'use client'
import { useState, KeyboardEvent } from 'react'
import { Word } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { CATEGORY_COLOURS, StatusMark } from './shared'

interface Props {
  word: Word
  seen: boolean
  practised?: boolean
  index?: number
  onHear: () => void
  onReveal: () => void
}

/** Compact word card for grids. Tap to flip to the meaning. */
export function WordTile({ word, seen, practised, index = 0, onHear, onReveal }: Props) {
  const [flipped, setFlipped] = useState(false)
  const colour = CATEGORY_COLOURS[word.category] ?? 'var(--stone)'

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
    textAlign: 'center' as const,
    padding: '14px 10px 10px',
    boxShadow: 'var(--shadow-card)',
    overflow: 'hidden',
  }

  return (
    <div
      className={`flip tappable ${flipped ? 'flipped' : ''}`}
      style={{ height: 168, animation: `stampIn 180ms ${Math.min(index, 10) * 40}ms ease-out backwards` }}
    >
      <div
        className="flip-inner"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${word.roman}. Tap to ${flipped ? 'show the Tamil' : 'see what it means'}`}
        onClick={toggle}
        onKeyDown={onKey}
      >
        {/* Front: Tamil */}
        <div
          className="flip-face"
          style={{ ...face, background: 'var(--white)', border: seen ? '2px solid var(--turmeric)' : '2px solid var(--cream-dark)', borderTop: `5px solid ${colour}` }}
        >
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <StatusMark seen={seen} practised={practised} />
          </div>
          <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: word.tamil.length > 7 ? 21 : 26, color: 'var(--navy)', lineHeight: 1.3, marginTop: 6 }}>
            {word.tamil}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', marginBottom: 8 }}>{word.roman}</div>
          <AudioButton text={word.tamil} onPlay={onHear} size="sm" />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--stone)', marginTop: 6 }}>Tap to see meaning</div>
        </div>

        {/* Back: meaning */}
        <div className="flip-face flip-back" style={{ ...face, background: 'var(--navy)', border: `2px solid ${colour}` }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 1, color: 'var(--turmeric)', lineHeight: 1.05 }}>{word.english}</div>
          <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 15, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
            {word.tamil}
          </div>
          {word.notes && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11.5,
                color: 'rgba(255,255,255,0.65)',
                marginTop: 6,
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {word.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
