'use client'
import { Component, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('App error:', error)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          minHeight: '100dvh',
          background: 'var(--cream)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          textAlign: 'center',
          gap: 16,
        }}
      >
        <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 32, color: 'var(--navy)' }}>
          ஒரு நிமிடம்...
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--stone)', maxWidth: 300, lineHeight: 1.5 }}>
          Something went a little sideways. Give it a refresh and we&apos;ll be right back.
        </p>
        <button
          onClick={() => window.location.reload()}
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
          Refresh
        </button>
      </div>
    )
  }
}
