'use client'
import { useState } from 'react'
import { Word } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { Badge, CATEGORY_COLOURS, RevealButton, StatusMark, cardStyle } from './shared'

interface Props {
  word: Word
  seen: boolean
  practised?: boolean
  index?: number
  onHear: () => void
  onReveal: () => void
}

export function WordCard({ word, seen, practised, index = 0, onHear, onReveal }: Props) {
  const [revealed, setRevealed] = useState(false)

  return (
    <article style={cardStyle(seen, index)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
        <Badge colour={CATEGORY_COLOURS[word.category] ?? 'var(--stone)'}>{word.category}</Badge>
        <StatusMark seen={seen} practised={practised} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div lang="ta" style={{ fontFamily: 'var(--font-tamil-learn)', fontSize: 28, color: 'var(--navy)', lineHeight: 1.3 }}>
            {word.tamil}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)' }}>
            {word.roman}
          </div>
        </div>
        <AudioButton text={word.tamil} onPlay={onHear} size="md" />
      </div>

      <div style={{ marginTop: 8, minHeight: 30 }}>
        {revealed ? (
          <div style={{ animation: 'pageFade 160ms ease-out both' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1, color: 'var(--vermillion)' }}>
              {word.english}
            </div>
            {word.notes && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--stone)', marginTop: 2, lineHeight: 1.45 }}>
                {word.notes}
              </p>
            )}
          </div>
        ) : (
          <RevealButton
            onClick={() => {
              setRevealed(true)
              onReveal()
            }}
          />
        )}
      </div>
    </article>
  )
}
