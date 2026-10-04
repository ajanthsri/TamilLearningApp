'use client'
import { StageInfo } from '@/types'

interface Props {
  info: StageInfo
  selected: boolean
  index: number
  onSelect: () => void
}

export function StageCard({ info, selected, index, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
      className="tappable"
      style={{
        width: '100%',
        textAlign: 'left',
        background: selected ? 'rgba(245,166,35,0.1)' : 'rgba(255,255,255,0.04)',
        border: selected ? '2px solid var(--turmeric)' : '2px solid rgba(255,255,255,0.15)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        animation: `stampIn 180ms ${index * 60 + 100}ms ease-out backwards`,
        transition: 'background 150ms ease-out, border-color 150ms ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 1.5, color: selected ? 'var(--turmeric)' : '#fff' }}>
          {info.english}
        </span>
        <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 18, color: selected ? 'var(--turmeric)' : 'rgba(255,255,255,0.6)' }}>
          {info.tamil}
        </span>
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
        {info.description}
      </span>
    </button>
  )
}
