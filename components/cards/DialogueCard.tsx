'use client'
import { Dialogue } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { MOOD_COLOURS, StatusMark } from './shared'

interface Props {
  dialogue: Dialogue
  seen: boolean
  practised?: boolean
  index?: number
  /** Small label top-left, e.g. "Dialogue of the day" */
  label?: string
  onHear: () => void
}

export function DialogueCard({ dialogue, seen, practised, index = 0, label = 'Dialogue', onHear }: Props) {
  const mood = MOOD_COLOURS[dialogue.mood] ?? '#F5A623'

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
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, position: 'relative' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
            In the spirit of
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.35 }}>
            {dialogue.inspiration}
          </div>
        </div>
        <AudioButton text={dialogue.tamil} onPlay={onHear} size="md" />
      </div>
    </article>
  )
}
