import { ReactNode } from 'react'

interface Props {
  tamil: string
  title: string
  subtitle: string
  watermark?: string
  children?: ReactNode
}

/** Navy poster-style header used at the top of each module page. */
export function PageHeader({ tamil, title, subtitle, watermark, children }: Props) {
  return (
    <header
      style={{
        background: 'var(--navy)',
        padding: 'calc(28px + env(safe-area-inset-top)) 20px 22px',
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
            top: '50%',
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
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'var(--vermillion)',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <h1 lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 34, color: '#fff', lineHeight: 1.2, fontWeight: 400 }}>
        {tamil}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(255,255,255,0.55)',
          marginTop: 4,
          maxWidth: 280,
        }}
      >
        {subtitle}
      </p>
      {children}
    </header>
  )
}
