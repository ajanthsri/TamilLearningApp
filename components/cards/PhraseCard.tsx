'use client'
import { useState } from 'react'
import { Phrase } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { Badge, RevealButton, StatusMark, cardStyle } from './shared'

interface Props {
  phrase: Phrase
  seen: boolean
  practised?: boolean
  index?: number
  onHear: () => void
  onReveal: () => void
}

export function PhraseCard({ phrase, seen, practised, index = 0, onHear, onReveal }: Props) {
  const [revealed, setRevealed] = useState(false)

  return (
    <article style={cardStyle(seen, index)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 8 }}>
        <Badge colour="var(--navy)">{phrase.situation}</Badge>
        <StatusMark seen={seen} practised={practised} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div lang="ta" style={{ fontFamily: 'var(--font-tamil-learn)', fontSize: 22, color: 'var(--navy)', lineHeight: 1.45 }}>
            {phrase.tamil}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', marginTop: 2 }}>
            {phrase.roman}
          </div>
        </div>
        <AudioButton text={phrase.tamil} onPlay={onHear} size="md" />
      </div>

      <div style={{ marginTop: 8, minHeight: 30 }}>
        {revealed ? (
          <div style={{ animation: 'pageFade 160ms ease-out both' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16, color: 'var(--navy)' }}>
              {phrase.english}
            </div>
            {phrase.literal && (
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'var(--stone)', marginTop: 2 }}>
                Literally: “{phrase.literal}”
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
