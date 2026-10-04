'use client'
import { useMemo, useState } from 'react'
import { letters } from '@/data/letters'
import { Letter } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { useProgress } from '@/hooks/useProgress'
import { useXP } from '@/hooks/useXP'
import { pickRandom, shuffle } from '@/lib/store'
import { NICE, NUDGE } from '@/data/copy'

// First five vowels: அ ஆ இ ஈ உ
const TARGET_IDS = [1, 2, 3, 4, 5]
const VOWELS = letters.filter(l => l.type === 'vowel')


type Item = { target: Letter; options: Letter[] }

function buildItems(): Item[] {
  return TARGET_IDS.map(id => {
    const target = letters.find(l => l.id === id)!
    // Neighbouring vowels look alike (அ/ஆ, இ/ஈ), which makes the choice meaningful
    const others = shuffle(VOWELS.filter(v => v.id !== id)).slice(0, 3)
    return { target, options: shuffle([target, ...others]) }
  })
}

interface Props {
  onFinish: (result: { gained: number; leveledUp: boolean; levelName: string; levelEnglish: string }) => void
}

export function WritingPractice({ onFinish }: Props) {
  const items = useMemo(buildItems, [])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ tamil: string; english: string } | null>(null)
  const { markPractised } = useProgress()
  const { addXP } = useXP()

  const item = items[index]
  const answered = picked !== null
  const correct = picked === item.target.id

  const choose = (l: Letter) => {
    if (answered) return
    setPicked(l.id)
    if (l.id === item.target.id) {
      markPractised('letters', l.id)
      setFeedback(pickRandom(NICE))
    } else {
      setFeedback(pickRandom(NUDGE))
    }
  }

  const next = () => {
    if (index + 1 >= items.length) {
      const r = addXP('writing_completed')
      onFinish({
        gained: r.gained,
        leveledUp: r.leveledUp,
        levelName: r.newLevel.tamil,
        levelEnglish: `${r.newLevel.roman} · ${r.newLevel.english}`,
      })
      return
    }
    setIndex(index + 1)
    setPicked(null)
    setFeedback(null)
  }

  return (
    <div key={index} style={{ animation: 'questionWipe 260ms ease-out both' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {items.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 5,
              borderRadius: 3,
              background: i < index || (i === index && answered) ? 'var(--vermillion)' : 'var(--cream-dark)',
            }}
          />
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--stone)' }}>
        Which Tamil letter makes this sound?
      </div>
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 72,
          color: 'var(--navy)',
          lineHeight: 1,
          margin: '12px 0 20px',
        }}
      >
        “{item.target.roman}”
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        {item.options.map(l => {
          const isTarget = l.id === item.target.id
          const isPicked = l.id === picked
          const bg = answered && isTarget ? 'var(--turmeric)' : answered && isPicked ? 'var(--error-soft)' : 'var(--white)'
          return (
            <button
              key={l.id}
              onClick={() => choose(l)}
              disabled={answered}
              className="tappable"
              aria-label={`Letter option ${l.tamil}`}
              lang="ta"
              style={{
                aspectRatio: '1',
                background: bg,
                border: answered && (isTarget || isPicked) ? 'none' : '1.5px solid var(--navy)',
                borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-tamil)',
                fontSize: 34,
                padding: 0,
                color: 'var(--navy)',
                opacity: answered && !isTarget && !isPicked ? 0.45 : 1,
                cursor: answered ? 'default' : 'pointer',
                transition: 'background 150ms ease-out',
              }}
            >
              {l.tamil}
            </button>
          )
        })}
      </div>

      {feedback && (
        <div
          role="status"
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: 'var(--white)',
            borderLeft: `4px solid ${correct ? 'var(--turmeric)' : 'var(--error-soft)'}`,
            borderRadius: 'var(--radius)',
            padding: '12px 14px',
            animation: 'pageFade 160ms ease-out both',
          }}
        >
          <div>
            <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 18, color: 'var(--navy)' }}>
              {feedback.tamil}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--stone)' }}>
              {feedback.english} {!correct && <>It&apos;s <span lang="ta" style={{ fontFamily: 'var(--font-tamil)' }}>{item.target.tamil}</span>.</>}
            </div>
          </div>
          <AudioButton text={item.target.tamil} size="sm" variant="navy" />
        </div>
      )}

      {answered && (
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button
            onClick={next}
            className="tappable"
            style={{
              background: 'var(--vermillion)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '12px 28px',
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              letterSpacing: 1.5,
            }}
          >
            {index + 1 >= items.length ? 'Finish →' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}
