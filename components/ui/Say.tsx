'use client'
import { CSSProperties } from 'react'
import { AudioButton } from './AudioButton'

interface Props {
  tamil: string
  roman?: string
  size?: number
  colour?: string
  /** Button style. 'light' for dark backgrounds. */
  button?: 'vermillion' | 'navy' | 'ghost' | 'light'
  buttonSize?: 'xs' | 'sm' | 'md'
  onPlay?: () => void
  style?: CSSProperties
}

/** Tamil text with a play button beside it. Use anywhere Tamil appears. */
export function Say({ tamil, roman, size = 18, colour = 'inherit', button = 'ghost', buttonSize = 'xs', onPlay, style }: Props) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, verticalAlign: 'middle', ...style }}>
      <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0 }}>
        <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: size, color: colour, lineHeight: 1.3 }}>
          {tamil}
        </span>
        {roman && (
          <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: Math.max(12, size * 0.55), opacity: 0.7, color: colour, lineHeight: 1.2 }}>
            {roman}
          </span>
        )}
      </span>
      <AudioButton text={tamil} size={buttonSize} variant={button} onPlay={onPlay} label={`Hear ${roman ?? 'this'} in Tamil`} />
    </span>
  )
}
