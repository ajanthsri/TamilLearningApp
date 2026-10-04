'use client'
import { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { NavBar } from '@/components/ui/NavBar'
import { WritingPractice } from '@/components/write/WritingPractice'
import { VictoryOverlay } from '@/components/ui/VictoryOverlay'
import { Say } from '@/components/ui/Say'
import { AudioButton } from '@/components/ui/AudioButton'

type Phase = 'intro' | 'practice' | 'done'

export default function WritePage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [run, setRun] = useState(0)
  const [xp, setXp] = useState(0)
  const [levelUp, setLevelUp] = useState<{ name: string; english: string } | null>(null)

  const button = {
    background: 'var(--vermillion)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '12px 28px',
    fontFamily: 'var(--font-display)',
    fontSize: 18,
    letterSpacing: 1.5,
    textDecoration: 'none',
    display: 'inline-block',
  } as const

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}>
      <PageHeader tamil="எழுது" roman="ezhuthu" title="Write" subtitle="Recognise the shape. Feel the language." watermark="எ" />

      <main style={{ padding: '22px 16px' }}>
        {phase === 'intro' && (
          <div className="page-enter" style={{ textAlign: 'center', padding: '20px 8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, marginBottom: 16 }}>
              {[
                ['அ', 'a'],
                ['ஆ', 'aa'],
                ['இ', 'i'],
                ['ஈ', 'ii'],
                ['உ', 'u'],
              ].map(([t, r]) => (
                <div key={t} style={{ background: 'var(--navy)', borderRadius: 'var(--radius)', padding: '10px 4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 34, color: '#fff', lineHeight: 1.1 }}>{t}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'var(--turmeric)' }}>{r}</span>
                  <AudioButton text={t} size="xs" variant="light" />
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--navy)', lineHeight: 1.5, marginBottom: 6 }}>
              The first five vowels. Tap each one to hear it. Then we&apos;ll give you a sound and you pick its shape.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', marginBottom: 24 }}>
              Look closely. Some of them are twins with a small tail.
            </p>
            <button onClick={() => setPhase('practice')} className="tappable" style={button}>
              Start →
            </button>
          </div>
        )}

        {phase === 'practice' && (
          <WritingPractice
            key={run}
            onFinish={r => {
              setXp(r.gained)
              if (r.leveledUp) setLevelUp({ name: r.levelName, english: r.levelEnglish })
              setPhase('done')
            }}
          />
        )}

        {phase === 'done' && (
          <div className="page-enter" style={{ textAlign: 'center', padding: '24px 8px' }}>
            <Say tamil="நல்லாச் செய்தீங்க." size={30} colour="var(--navy)" buttonSize="sm" />
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'var(--stone)', margin: '4px 0 16px' }}>
              You did it. Five shapes closer to reading Tamil.
            </p>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--navy)',
                color: 'var(--turmeric)',
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                letterSpacing: 1.5,
                padding: '6px 16px',
                borderRadius: 20,
                marginBottom: 24,
                animation: 'xpFloat 300ms 200ms ease-out both',
              }}
            >
              +{xp} XP
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <Link href="/learn?tab=letters" className="tappable" style={button}>
                See all the letters →
              </Link>
              <button
                onClick={() => {
                  setRun(r => r + 1)
                  setPhase('practice')
                }}
                className="tappable"
                style={{ background: 'none', border: 'none', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 1.2, color: 'var(--navy)', padding: 8 }}
              >
                Practise again
              </button>
            </div>
          </div>
        )}
      </main>
      <VictoryOverlay
        visible={levelUp !== null}
        tamil="நல்லாச் செய்தீங்க"
        xpGained={xp}
        isLevelUp
        levelName={levelUp?.name}
        levelNameEnglish={levelUp?.english}
        onDismiss={() => setLevelUp(null)}
      />
      <NavBar />
    </div>
  )
}
