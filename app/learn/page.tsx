'use client'
import { Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LearnTab, ModuleKey, XPAction } from '@/types'
import { letters } from '@/data/letters'
import { words } from '@/data/words'
import { phrases } from '@/data/phrases'
import { dialogues } from '@/data/dialogues'
import { getStageInfo } from '@/data/stages'
import { useProgress } from '@/hooks/useProgress'
import { useLearnerStage } from '@/hooks/useLearnerStage'
import { useReward } from '@/components/ui/Reward'
import { PageHeader } from '@/components/ui/PageHeader'
import { NavBar } from '@/components/ui/NavBar'
import { LetterCard } from '@/components/cards/LetterCard'
import { WordCard } from '@/components/cards/WordCard'
import { PhraseCard } from '@/components/cards/PhraseCard'
import { DialogueCard } from '@/components/cards/DialogueCard'
import { useHydrated } from '@/lib/store'

const TABS: { key: LearnTab; tamil: string; label: string }[] = [
  { key: 'letters', tamil: 'எழுத்து', label: 'Letters' },
  { key: 'words', tamil: 'சொல்', label: 'Words' },
  { key: 'phrases', tamil: 'வாக்கியம்', label: 'Phrases' },
  { key: 'dialogues', tamil: 'டயலாக்', label: 'Dialogues' },
]

const INTRO: Record<LearnTab, { tamil: string; body: string }> = {
  letters: { tamil: 'எழுத்துக்கள்', body: 'Every Tamil word starts with one of these shapes. Tap a card to see it in a word.' },
  words: { tamil: 'வார்த்தைகள்', body: 'Words your family uses every day.' },
  phrases: { tamil: 'வாக்கியங்கள்', body: 'Things worth saying out loud.' },
  dialogues: { tamil: 'டயலாக்', body: 'Original lines in the spirit of Tamil cinema.' },
}

const TOTALS: Record<LearnTab, number> = {
  letters: letters.length,
  words: words.length,
  phrases: phrases.length,
  dialogues: dialogues.length,
}

const isTab = (v: string | null): v is LearnTab => TABS.some(t => t.key === v)

function LearnContent() {
  const router = useRouter()
  const params = useSearchParams()
  const hydrated = useHydrated()
  const { stage } = useLearnerStage()
  const { isSeen, isPractised, markSeen, countSeen, countPractised } = useProgress()
  const { reward, rewardUI } = useReward()
  const firstCard = useRef<HTMLDivElement>(null)

  const param = params.get('tab')
  const tab: LearnTab = isTab(param) ? param : hydrated ? getStageInfo(stage).defaultLearnTab : 'words'

  const setTab = (t: LearnTab) => router.replace(`/learn?tab=${t}`, { scroll: false })

  const act = (module: ModuleKey, action: XPAction) => (id: number, tamil: string) => {
    markSeen(module, id)
    reward(action, `${module}:${id}`, tamil)
  }
  const hear = (m: ModuleKey) => act(m, 'card_heard')
  const reveal = (m: ModuleKey) => act(m, 'meaning_revealed')

  const seenCount = hydrated ? countSeen(tab) : 0
  const practisedCount = hydrated ? countPractised(tab) : 0
  const s = (m: ModuleKey, id: number) => hydrated && isSeen(m, id)
  const p = (m: ModuleKey, id: number) => hydrated && isPractised(m, id)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}>
      <PageHeader tamil="கற்க" roman="karka" title="Learn" subtitle="Browse everything. Tap play on anything Tamil." watermark="அ" />

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Learn sections"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'var(--cream)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderBottom: '1px solid var(--cream-dark)',
          boxShadow: '0 2px 8px rgba(26,31,60,0.05)',
        }}
      >
        {TABS.map(t => {
          const active = t.key === tab
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className="tappable"
              style={{
                background: 'none',
                border: 'none',
                borderBottom: active ? '3px solid var(--vermillion)' : '3px solid transparent',
                padding: '10px 2px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 14, color: active ? 'var(--navy)' : 'var(--stone)' }}>
                {t.tamil}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: active ? 'var(--vermillion)' : 'var(--stone-light)',
                }}
              >
                {t.label}
              </span>
            </button>
          )
        })}
      </div>

      <main key={tab} className="page-enter" style={{ padding: '18px 16px 0' }}>
        {/* Intro + counts */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <h2 lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 22, color: 'var(--navy)', fontWeight: 400 }}>
              {INTRO[tab].tamil}
            </h2>
            <span style={{ fontSize: 13, color: 'var(--stone)', whiteSpace: 'nowrap' }}>
              {seenCount}/{TOTALS[tab]} seen · {practisedCount} practised
            </span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', marginTop: 2 }}>
            {INTRO[tab].body}
          </p>
          {tab === 'letters' && seenCount === 0 && (
            <button
              onClick={() => firstCard.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="tappable"
              style={{
                marginTop: 10,
                background: 'var(--vermillion)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '8px 18px',
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                letterSpacing: 1.2,
              }}
            >
              Begin →
            </button>
          )}
        </div>

        {tab === 'letters' && (
          <>
            {(['vowel', 'consonant'] as const).map(type => (
              <section key={type} style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 2, color: 'var(--stone)', marginBottom: 10, textTransform: 'uppercase' }}>
                  {type === 'vowel' ? <><span lang="ta" style={{ fontFamily: 'var(--font-tamil)' }}>உயிர்</span> · Vowels</> : <><span lang="ta" style={{ fontFamily: 'var(--font-tamil)' }}>மெய்</span> · Consonants</>}
                </h3>
                <div ref={type === 'vowel' ? firstCard : undefined} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {letters
                    .filter(l => l.type === type)
                    .map((l, i) => (
                      <LetterCard
                        key={l.id}
                        letter={l}
                        index={i}
                        seen={s('letters', l.id)}
                        practised={p('letters', l.id)}
                        onHear={() => hear('letters')(l.id, l.tamil)}
                        onReveal={() => reveal('letters')(l.id, l.tamil)}
                      />
                    ))}
                </div>
              </section>
            ))}
          </>
        )}

        {tab === 'words' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {words.map((w, i) => (
              <WordCard
                key={w.id}
                word={w}
                index={i}
                seen={s('words', w.id)}
                practised={p('words', w.id)}
                onHear={() => hear('words')(w.id, w.tamil)}
                onReveal={() => reveal('words')(w.id, w.tamil)}
              />
            ))}
          </div>
        )}

        {tab === 'phrases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {phrases.map((ph, i) => (
              <PhraseCard
                key={ph.id}
                phrase={ph}
                index={i}
                seen={s('phrases', ph.id)}
                practised={p('phrases', ph.id)}
                onHear={() => hear('phrases')(ph.id, ph.tamil)}
                onReveal={() => reveal('phrases')(ph.id, ph.tamil)}
              />
            ))}
          </div>
        )}

        {tab === 'dialogues' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {dialogues.map((d, i) => (
              <DialogueCard
                key={d.id}
                dialogue={d}
                index={i}
                seen={s('dialogues', d.id)}
                onHear={() => hear('dialogues')(d.id, d.tamil)}
              />
            ))}
          </div>
        )}
      </main>

      {rewardUI}
      <NavBar />
    </div>
  )
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: 'var(--cream)' }} />}>
      <LearnContent />
    </Suspense>
  )
}
