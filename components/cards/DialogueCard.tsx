'use client'
import { useRef, useState } from 'react'
import { Dialogue, DialogueWord } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { useSpeech } from '@/hooks/useSpeech'
import { MOOD_COLOURS, StatusMark } from './shared'

interface Props {
  dialogue: Dialogue
  seen: boolean
  practised?: boolean
  index?: number
  /** Small label top-left, e.g. "Dialogue of the day" */
  label?: string
  onHear: () => void
  /** Called the first time the word-by-word breakdown is opened */
  onBreakdown?: () => void
}

export function DialogueCard({ dialogue, seen, practised, index = 0, label = 'Dialogue', onHear, onBreakdown }: Props) {
  const mood = MOOD_COLOURS[dialogue.mood] ?? '#F5A623'
  const [open, setOpen] = useState(false)
  const opened = useRef(false)
  const words = dialogue.breakdown ?? []

  const toggle = () => {
    if (!open && !opened.current) {
      opened.current = true
      onBreakdown?.()
    }
    setOpen(o => !o)
  }

  return (
    <article
      style={{
        background: 'var(--navy)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 18px 16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-heavy)',
        animation: `stampIn 180ms ${Math.min(index, 10) * 60}ms ease-out backwards`,
      }}
    >
      {/* Spotlight in the mood colour */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          background: `radial-gradient(circle, ${mood}2e, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 8, position: 'relative' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <StatusMark seen={seen} practised={practised} dark />
          <span
            style={{
              background: mood + '28',
              color: mood,
              fontSize: 11,
              fontFamily: 'var(--font-display)',
              letterSpacing: 1.5,
              padding: '3px 8px',
              borderRadius: 12,
              textTransform: 'uppercase',
            }}
          >
            {dialogue.mood}
          </span>
        </div>
      </div>

      <div style={{ borderLeft: `4px solid ${mood}`, paddingLeft: 14, marginBottom: 14, position: 'relative' }}>
        <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 20, color: '#fff', lineHeight: 1.6, marginBottom: 6 }}>
          {dialogue.tamil}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'rgba(250,243,224,0.55)', marginBottom: 6, lineHeight: 1.45 }}>
          {dialogue.roman}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.45 }}>
          “{dialogue.english}”
        </div>
        {words.length > 0 && (
          <button
            onClick={toggle}
            aria-expanded={open}
            className="tappable"
            style={{
              marginTop: 10,
              background: open ? 'transparent' : 'rgba(245,166,35,0.14)',
              border: '1.5px solid rgba(245,166,35,0.6)',
              borderRadius: 18,
              padding: '6px 14px',
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              letterSpacing: 1.2,
              color: 'var(--turmeric)',
            }}
          >
            {open ? 'Hide words ↑' : 'Break it down, word by word ↓'}
          </button>
        )}
      </div>

      {open && <WordChips words={words} accent={mood} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, position: 'relative' }}>
        {dialogue.credit ? (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
              From the film
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, letterSpacing: 1, color: '#fff', lineHeight: 1.2 }}>
              {dialogue.credit.actor} <span style={{ color: mood }}>·</span> {dialogue.credit.film} ({dialogue.credit.year})
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              Quoted for learning. Film Tamil (Chennai).
            </div>
          </div>
        ) : (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
              In the spirit of
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.35 }}>
              {dialogue.inspiration}
            </div>
          </div>
        )}
        <AudioButton text={dialogue.tamil} onPlay={onHear} size="md" />
      </div>
    </article>
  )
}

/** The line split into words. Tap a word to hear it. */
function WordChips({ words, accent }: { words: DialogueWord[]; accent: string }) {
  const { speak } = useSpeech()
  const [active, setActive] = useState<number | null>(null)

  return (
    <div style={{ position: 'relative', marginBottom: 16, animation: 'pageFade 180ms ease-out both' }}>
      <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
        Tap any word to hear it.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {words.map((w, i) => {
          const isActive = active === i
          return (
            <button
              key={`${w.tamil}-${i}`}
              onClick={() => {
                setActive(i)
                speak(w.tamil)
              }}
              className="tappable"
              aria-label={`Hear ${w.roman}, means ${w.english}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                maxWidth: '100%',
                background: isActive ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.06)',
                border: isActive ? '1.5px solid var(--turmeric)' : `1.5px solid ${accent}40`,
                borderRadius: 12,
                padding: '7px 11px 8px',
                textAlign: 'left',
                animation: `stampIn 180ms ${i * 45}ms ease-out backwards`,
                transition: 'border-color 120ms ease-out, background 120ms ease-out',
              }}
            >
              <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 18, color: '#fff', lineHeight: 1.3, overflowWrap: 'anywhere' }}>
                {w.tamil}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: 'var(--turmeric)' }}>{w.roman}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{w.english}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
