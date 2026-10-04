'use client'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Say } from './Say'

interface Props {
  title: string
  tamil: string
  roman?: string
  subtitle: string
  watermark?: string
  /** Where the back button goes. Defaults to Home. */
  backHref?: string
  backLabel?: string
  children?: ReactNode
}

/** Header for module pages: English first, Tamil with a play button, and a way back. */
export function PageHeader({ title, tamil, roman, subtitle, watermark, backHref = '/', backLabel = 'Home', children }: Props) {
  const router = useRouter()

  return (
    <header
      style={{
        background: 'var(--navy)',
        padding: 'calc(12px + env(safe-area-inset-top)) 20px 20px',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '3px solid var(--vermillion)',
      }}
    >
      {watermark && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -10,
            top: '55%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-tamil)',
            fontSize: 140,
            color: 'rgba(255,255,255,0.05)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {watermark}
        </div>
      )}

      <BackButton label={backLabel} onClick={() => router.push(backHref)} />

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: 1.5, color: '#fff', lineHeight: 1, marginTop: 14, fontWeight: 400 }}>
        {title}
      </h1>
      <div style={{ marginTop: 6, position: 'relative' }}>
        <Say tamil={tamil} roman={roman} size={18} colour="var(--turmeric)" button="light" />
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 8, maxWidth: 300 }}>
        {subtitle}
      </p>
      {children}
    </header>
  )
}

export function BackButton({ label, onClick, dark = true }: { label: string; onClick: () => void; dark?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="tappable"
      aria-label={label === 'Back' ? 'Back' : `Back to ${label}`}
      style={{
        display: 'inline-flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 6,
        background: dark ? 'rgba(255,255,255,0.1)' : 'var(--white)',
        border: dark ? 'none' : '1.5px solid var(--cream-dark)',
        color: dark ? '#fff' : 'var(--navy)',
        borderRadius: 20,
        padding: '7px 14px 7px 10px',
        minHeight: 36,
        fontFamily: 'var(--font-display)',
        fontSize: 15,
        letterSpacing: 1,
        position: 'relative',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
  )
}

export function CloseButton({ onClick, label = 'Close', dark = true }: { onClick: () => void; label?: string; dark?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="tappable"
      aria-label={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: 'none',
        background: dark ? 'rgba(255,255,255,0.1)' : 'var(--cream-dark)',
        color: dark ? '#fff' : 'var(--navy)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  )
}
