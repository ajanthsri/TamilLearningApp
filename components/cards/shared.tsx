import { CSSProperties, ReactNode } from 'react'

export function StatusMark({ seen, practised, dark }: { seen: boolean; practised?: boolean; dark?: boolean }) {
  if (!seen && !practised) return null
  const label = practised ? 'Practised' : 'Seen'
  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: practised ? 'var(--success)' : dark ? 'var(--turmeric)' : 'var(--stone)',
        background: dark ? 'rgba(255,255,255,0.06)' : practised ? 'rgba(45,106,63,0.1)' : 'var(--cream)',
        padding: '2px 8px',
        borderRadius: 10,
        whiteSpace: 'nowrap',
      }}
    >
      {practised ? '✓ ' : ''}
      {label}
    </span>
  )
}

export function Badge({ children, colour }: { children: ReactNode; colour: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: colour,
        border: `1px solid ${colour}`,
        padding: '2px 8px',
        borderRadius: 10,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function RevealButton({ onClick, label = 'Reveal meaning →' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="tappable"
      style={{
        background: 'none',
        border: 'none',
        padding: '6px 0',
        fontFamily: 'var(--font-display)',
        fontSize: 15,
        letterSpacing: 1.2,
        color: 'var(--vermillion)',
        textAlign: 'left',
      }}
    >
      {label}
    </button>
  )
}

export function cardStyle(seen: boolean, index: number): CSSProperties {
  return {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    border: seen ? '1.5px solid var(--turmeric)' : '1.5px solid var(--cream-dark)',
    boxShadow: 'var(--shadow-card)',
    padding: '16px 16px 14px',
    animation: `stampIn 180ms ${Math.min(index, 10) * 60}ms ease-out backwards`,
  }
}

export const CATEGORY_COLOURS: Record<string, string> = {
  family: '#C1272D',
  greetings: '#B7791F',
  food: '#2D6A3F',
  emotions: '#8B5CB8',
  nature: '#2F6F8F',
  time: '#8C7B6B',
}

export const MOOD_COLOURS: Record<string, string> = {
  swagger: '#F5A623',
  philosophical: '#7B9ED9',
  romantic: '#D98CA0',
  political: '#6FBF7A',
  emotional: '#B08BE8',
  defiant: '#E88A4F',
}
