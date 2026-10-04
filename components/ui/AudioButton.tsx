'use client'
import { useSpeech } from '@/hooks/useSpeech'

interface Props {
  text: string
  onPlay?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'vermillion' | 'navy' | 'ghost'
}

export function AudioButton({ text, onPlay, size = 'md', variant = 'vermillion' }: Props) {
  const { speak, isSpeaking, isAvailable } = useSpeech()

  const handlePlay = () => {
    speak(text)
    onPlay?.()
  }

  const sizes = { sm: '32px', md: '40px', lg: '48px' }
  const iconSizes = { sm: 12, md: 14, lg: 18 }

  const colours = {
    vermillion: { bg: 'var(--vermillion)', color: '#fff', border: 'none' },
    navy:       { bg: 'var(--navy)',       color: '#fff', border: 'none' },
    ghost:      { bg: 'transparent',       color: 'var(--stone)', border: '1.5px solid var(--stone-light)' },
  }

  const c = colours[variant]

  return (
    <button
      onClick={handlePlay}
      disabled={!isAvailable}
      aria-label="Listen to Tamil pronunciation"
      title={!isAvailable ? 'Audio not available on this browser' : undefined}
      style={{
        width: sizes[size],
        height: sizes[size],
        borderRadius: '50%',
        background: c.bg,
        color: c.color,
        border: c.border,
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        animation: isSpeaking ? 'audioPulse 600ms ease-out' : 'none',
        transition: 'transform 80ms ease-out, opacity 200ms',
      }}
      className="tappable"
    >
      <svg width={iconSizes[size]} height={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    </button>
  )
}
