import { Track } from '@/data/lessons'

/** Speech bubble (Speak), open book (Read), pen nib (Write). Uses currentColor. */
export function TrackIcon({ track, size = 24 }: { track: Track; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true as const }
  if (track === 'speak') {
    return (
      <svg {...common} fill="currentColor">
        <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <circle cx="8" cy="10.5" r="1.4" fill="var(--navy)" />
        <circle cx="12" cy="10.5" r="1.4" fill="var(--navy)" />
        <circle cx="16" cy="10.5" r="1.4" fill="var(--navy)" />
      </svg>
    )
  }
  if (track === 'read') {
    return (
      <svg {...common} fill="currentColor">
        <path d="M2 5.5C4.5 4 8 4 11 5.5V20c-3-1.5-6.5-1.5-9 0V5.5z" />
        <path d="M22 5.5C19.5 4 16 4 13 5.5V20c3-1.5 6.5-1.5 9 0V5.5z" />
      </svg>
    )
  }
  return (
    <svg {...common} fill="currentColor">
      <path d="M14.6 3.4a2 2 0 0 1 2.8 0l3.2 3.2a2 2 0 0 1 0 2.8L9.4 20.6 3 22l1.4-6.4L14.6 3.4z" />
      <path d="M13 5l6 6" stroke="var(--navy)" strokeWidth="1.6" />
    </svg>
  )
}
