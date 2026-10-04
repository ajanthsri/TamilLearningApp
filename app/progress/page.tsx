'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { NavBar } from '@/components/ui/NavBar'
import { XPBar } from '@/components/ui/XPBar'
import { useProgress, PROGRESS_KEY } from '@/hooks/useProgress'
import { useLearnerStage } from '@/hooks/useLearnerStage'
import { XP_KEY, AWARDED_KEY } from '@/hooks/useXP'
import { removeStore, useHydrated } from '@/lib/store'
import { stages } from '@/data/stages'
import { letters } from '@/data/letters'
import { words } from '@/data/words'
import { phrases } from '@/data/phrases'
import { dialogues } from '@/data/dialogues'
import { ModuleKey } from '@/types'

const MODULES: { key: ModuleKey; tamil: string; label: string; total: number }[] = [
  { key: 'letters', tamil: 'எழுத்து', label: 'Letters', total: letters.length },
  { key: 'words', tamil: 'சொல்', label: 'Words', total: words.length },
  { key: 'phrases', tamil: 'வாக்கியம்', label: 'Phrases', total: phrases.length },
  { key: 'dialogues', tamil: 'டயலாக்', label: 'Dialogues', total: dialogues.length },
]

export default function ProgressPage() {
  const router = useRouter()
  const hydrated = useHydrated()
  const { countSeen, countPractised } = useProgress()
  const { stage, setStage, resetOnboarding } = useLearnerStage()
  const [confirming, setConfirming] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (confirming) cancelRef.current?.focus()
  }, [confirming])

  const reset = () => {
    removeStore(PROGRESS_KEY)
    removeStore(XP_KEY)
    removeStore(AWARDED_KEY)
    resetOnboarding()
    setConfirming(false)
    router.push('/')
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}>
      <PageHeader tamil="முன்னேற்றம்" title="Progress" subtitle="Your journey so far." watermark="↑" />

      <main className="page-enter" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {hydrated && <XPBar variant="dark" />}

        {/* Stage */}
        <section aria-labelledby="stage-heading">
          <SectionTitle id="stage-heading" tamil="நிலை" label="Your stage" />
          <div
            role="radiogroup"
            aria-labelledby="stage-heading"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              background: 'var(--white)',
              border: '1.5px solid var(--cream-dark)',
              borderRadius: 'var(--radius-lg)',
              padding: 4,
              gap: 4,
            }}
          >
            {stages.map(s => {
              const active = hydrated && s.stage === stage
              return (
                <button
                  key={s.stage}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStage(s.stage)}
                  className="tappable"
                  style={{
                    background: active ? 'var(--navy)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: '10px 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'background 150ms ease-out',
                  }}
                >
                  <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 13, color: active ? 'var(--turmeric)' : 'var(--stone)' }}>
                    {s.tamil}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 1, color: active ? '#fff' : 'var(--navy)' }}>
                    {s.english}
                  </span>
                </button>
              )
            })}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'var(--stone)', marginTop: 8 }}>
            This only changes where we suggest you start. Everything stays open.
          </p>
        </section>

        {/* Stats */}
        <section aria-labelledby="stats-heading">
          <SectionTitle id="stats-heading" tamil="கணக்கு" label="What you've explored" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {MODULES.map(m => {
              const seen = hydrated ? countSeen(m.key) : 0
              const practised = hydrated ? countPractised(m.key) : 0
              return (
                <div
                  key={m.key}
                  style={{
                    background: 'var(--white)',
                    border: '1.5px solid var(--cream-dark)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '14px 14px 12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1, color: 'var(--navy)' }}>{m.label}</span>
                    <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 13, color: 'var(--stone)' }}>
                      {m.tamil}
                    </span>
                  </div>
                  <Stat label="Seen" value={seen} total={m.total} colour="var(--turmeric)" />
                  <Stat label="Practised" value={practised} total={m.total} colour="var(--success)" />
                </div>
              )
            })}
          </div>
        </section>

        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <button
            onClick={() => setConfirming(true)}
            style={{ background: 'none', border: 'none', color: 'var(--stone)', fontFamily: 'var(--font-body)', fontSize: 13, textDecoration: 'underline', padding: 8, cursor: 'pointer' }}
          >
            Reset all progress
          </button>
        </div>
      </main>

      {confirming && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
          onClick={() => setConfirming(false)}
          onKeyDown={e => e.key === 'Escape' && setConfirming(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 900,
            background: 'rgba(26,31,60,0.6)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 16,
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--cream)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px 20px 18px',
              width: '100%',
              maxWidth: 420,
              boxShadow: 'var(--shadow-heavy)',
              animation: 'victoryReveal 200ms ease-out both',
            }}
          >
            <h2 id="reset-title" style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1, color: 'var(--navy)' }}>
              Start fresh?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--stone)', margin: '6px 0 20px', lineHeight: 1.45 }}>
              This clears all your progress, seen items and your stage.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                ref={cancelRef}
                onClick={() => setConfirming(false)}
                className="tappable"
                style={{
                  background: 'var(--navy)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  padding: 14,
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  letterSpacing: 1.5,
                }}
              >
                Not yet
              </button>
              <button
                onClick={reset}
                className="tappable"
                style={{
                  background: 'none',
                  color: 'var(--vermillion)',
                  border: '1.5px solid var(--vermillion)',
                  borderRadius: 'var(--radius)',
                  padding: 12,
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  letterSpacing: 1.5,
                }}
              >
                Yes, reset everything
              </button>
            </div>
          </div>
        </div>
      )}

      <NavBar />
    </div>
  )
}

function SectionTitle({ id, tamil, label }: { id: string; tamil: string; label: string }) {
  return (
    <h2 id={id} style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--stone)', marginBottom: 10, fontWeight: 400 }}>
      <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', letterSpacing: 0, textTransform: 'none' }}>
        {tamil}
      </span>{' '}
      · {label}
    </h2>
  )
}

function Stat({ label, value, total, colour }: { label: string; value: number; total: number; colour: string }) {
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--stone)', marginBottom: 3 }}>
        <span>{label}</span>
        <span>
          {value}/{total}
        </span>
      </div>
      <div style={{ height: 4, background: 'var(--cream-dark)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${(value / total) * 100}%`, height: '100%', background: colour, transition: 'width 600ms ease-out' }} />
      </div>
    </div>
  )
}
