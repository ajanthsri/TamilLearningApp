'use client'
import { Suspense, useEffect, useRef } from 'react'
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
import { WordTile } from '@/components/cards/WordTile'
import { AudioButton } from '@/components/ui/AudioButton'
import { Say } from '@/components/ui/Say'
import { BackButton } from '@/components/ui/PageHeader'
import { packs } from '@/data/packs'
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

// Word topics, in the same order and with the same names as the Speak packs
const CATEGORY_TO_PACK: Record<string, string> = { greetings: 'greetings', family: 'family', food: 'food', emotions: 'feelings', nature: 'nature', time: 'time' }
const TOPICS = Object.entries(CATEGORY_TO_PACK).map(([category, packId]) => ({ category, pack: packs.find(p => p.id === packId)! }))

const SITUATIONS = Array.from(new Set(phrases.map(p => p.situation)))

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

  // Slide direction follows tab order: moving right slides in from the right
  const tabIndex = TABS.findIndex(t => t.key === tab)
  const prevTab = useRef(tabIndex)
  const prevTopic = useRef<string | null>(null)
  const topicNow = params.get('topic')
  const dir =
    tabIndex < prevTab.current || (tabIndex === prevTab.current && prevTopic.current && !topicNow) ? 'slideInLeft' : 'slideInRight'
  useEffect(() => {
    prevTab.current = tabIndex
    prevTopic.current = topicNow
  }, [tabIndex, topicNow])

  const setTab = (t: LearnTab) => router.replace(`/learn?tab=${t}`, { scroll: false })

  // Words: pick a topic first, then a grid of that topic's words
  const topicParam = params.get('topic')
  const topicInfo = tab === 'words' ? TOPICS.find(t => t.category === topicParam) ?? null : null
  const topic = topicInfo?.category ?? null
  const setTopic = (c: string | null) => {
    router.replace(c ? `/learn?tab=words&topic=${c}` : '/learn?tab=words', { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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

      <main key={`${tab}-${topic ?? ''}`} style={{ padding: '18px 16px 0', animation: `${dir} 240ms ease-out backwards` }}>
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

        {tab === 'words' && !topic && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
            {TOPICS.map((t, i) => {
              const inTopic = words.filter(w => w.category === t.category)
              const seenN = inTopic.filter(w => s('words', w.id)).length
              const done = seenN === inTopic.length
              return (
                <div
                  key={t.category}
                  style={{
                    position: 'relative',
                    background: 'var(--navy)',
                    borderRadius: 'var(--radius-lg)',
                    borderTop: `5px solid ${t.pack.colour}`,
                    boxShadow: 'var(--shadow-card)',
                    animation: `stampIn 180ms ${i * 50}ms ease-out backwards`,
                  }}
                >
                  <button
                    onClick={() => setTopic(t.category)}
                    className="tappable"
                    aria-label={`${t.pack.english}: ${seenN} of ${inTopic.length} seen`}
                    style={{ width: '100%', minHeight: 132, background: 'none', border: 'none', textAlign: 'left', padding: '14px 14px 12px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
                  >
                    <span aria-hidden lang="ta" style={{ position: 'absolute', right: 8, bottom: -6, fontFamily: 'var(--font-tamil)', fontSize: 64, color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>
                      {t.pack.tamil.slice(0, 1)}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 1, lineHeight: 1 }}>{t.pack.english}</span>
                    <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{t.pack.tamil}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: done ? 'var(--turmeric)' : 'rgba(255,255,255,0.55)', marginTop: 8 }}>
                      {done ? '✓ All seen' : `${seenN}/${inTopic.length} seen`}
                    </span>
                  </button>
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <AudioButton text={t.pack.tamil} size="xs" variant="light" label={`Hear ${t.pack.roman}`} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'words' && topicInfo && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
              <BackButton label="All topics" dark={false} onClick={() => setTopic(null)} />
              <Say tamil={topicInfo.pack.tamil} roman={topicInfo.pack.roman} size={16} colour="var(--navy)" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
              {words
                .filter(w => w.category === topicInfo.category)
                .map((w, i) => (
                  <WordTile
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
          </>
        )}

        {tab === 'phrases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {SITUATIONS.map(sit => (
              <section key={sit}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1, color: 'var(--navy)', marginBottom: 8, fontWeight: 400 }}>{sit}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {phrases
                    .filter(ph => ph.situation === sit)
                    .map((ph, i) => (
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
              </section>
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
                onBreakdown={() => reveal('dialogues')(d.id, d.tamil)}
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
