'use client'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Avatar } from '@/components/ui/Avatar'
import { Say } from '@/components/ui/Say'
import { DialogueCard } from '@/components/cards/DialogueCard'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { useReward } from '@/components/ui/Reward'
import { useProgress } from '@/hooks/useProgress'
import { useLearnerStage } from '@/hooks/useLearnerStage'
import { useXP } from '@/hooks/useXP'
import { useProfile } from '@/hooks/useProfile'
import { usePacks } from '@/hooks/usePacks'
import { dialogues } from '@/data/dialogues'
import { UI } from '@/data/copy'
import { ModuleKey } from '@/types'

const MODULES: ModuleKey[] = ['letters', 'words', 'phrases', 'dialogues']

const EXPLORE = [
  { href: '/learn', title: 'Learn', tamil: UI.learn.tamil, subtitle: 'Browse every letter, word and phrase', accent: 'var(--vermillion)', bg: 'var(--navy)', icon: 'அ' },
  { href: '/challenge', title: 'Challenge', tamil: UI.challenge.tamil, subtitle: '5 quick questions', accent: 'var(--turmeric)', bg: '#2D1F3C', icon: '?' },
  { href: '/write', title: 'Write', tamil: UI.write.tamil, subtitle: 'Spot the vowel shapes', accent: '#6FBF7A', bg: '#1F2E28', icon: 'எ' },
]

function dialogueOfTheDay() {
  const d = new Date()
  const localDay = Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000)
  return dialogues[localDay % dialogues.length]
}

function Home() {
  const { countSeen, countPractised, isSeen, markSeen } = useProgress()
  const { xp, currentLevel, nextLevel, levelProgress } = useXP()
  const { character } = useProfile()
  const { packs, isComplete, nextPack, completedCount } = usePacks()
  const { reward, rewardUI } = useReward()
  const dialogue = dialogueOfTheDay()

  const totalSeen = MODULES.reduce((n, m) => n + countSeen(m), 0)
  const totalPractised = MODULES.reduce((n, m) => n + countPractised(m), 0)
  const firstTime = totalSeen === 0

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>
      {/* ── Hero: you, your level, your XP ── */}
      <header
        style={{
          background: 'var(--navy)',
          padding: 'calc(20px + env(safe-area-inset-top)) 18px 22px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid var(--vermillion)',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -24,
            top: -10,
            fontFamily: 'var(--font-tamil)',
            fontSize: 190,
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          த
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <Link href="/progress" aria-label="Your stats and character" className="tappable" style={{ flexShrink: 0, lineHeight: 0 }}>
            <Avatar character={character} level={currentLevel.level} size={84} />
          </Link>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>
              {firstTime ? 'Welcome' : 'Welcome back'}
            </div>
            <div style={{ marginTop: 4 }}>
              <Say tamil={UI.hello.tamil} roman="vanakkam" size={16} colour="var(--turmeric)" button="light" />
            </div>
          </div>
        </div>

        {/* Level + XP */}
        <div style={{ marginTop: 18, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginBottom: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 2, color: 'rgba(255,255,255,0.5)' }}>LEVEL {currentLevel.level}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1, color: '#fff' }}>{currentLevel.english.split(' — ')[0]}</span>
                <Say tamil={currentLevel.tamil} size={14} colour="rgba(255,255,255,0.6)" button="light" />
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1, color: 'var(--turmeric)' }}>{xp}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 2, color: 'rgba(255,255,255,0.5)' }}>XP</div>
            </div>
          </div>
          {nextLevel && (
            <>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.12)', borderRadius: 6, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.max(3, levelProgress.percent)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--vermillion), var(--turmeric))',
                    borderRadius: 6,
                    transition: 'width 600ms ease-out',
                  }}
                />
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>
                {levelProgress.required - levelProgress.current} XP until {character.name} grows up to <strong style={{ color: '#fff', fontWeight: 600 }}>{nextLevel.english.split(' — ')[0]}</strong>
              </div>
            </>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 16, position: 'relative' }}>
          {[
            { label: 'Words heard', value: totalSeen },
            { label: 'Practised', value: totalPractised },
            { label: 'Packs done', value: `${completedCount}/${packs.length}` },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius)', padding: '8px 10px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, color: 'var(--turmeric)' }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      <main className="page-enter" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* ── Continue ── */}
        <section aria-labelledby="continue-heading">
          {nextPack ? (
            <Link
              href={`/pack/${nextPack.id}`}
              className="tappable"
              style={{
                display: 'block',
                background: 'var(--vermillion)',
                borderRadius: 20,
                padding: '18px 18px 16px',
                color: '#fff',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(193,39,45,0.35)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div aria-hidden style={{ position: 'absolute', right: -6, bottom: -26, fontFamily: 'var(--font-tamil)', fontSize: 120, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>
                {nextPack.tamil.slice(0, 1)}
              </div>
              <div id="continue-heading" style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2.5, opacity: 0.85 }}>
                {completedCount === 0 ? 'START HERE' : 'CONTINUE'} · PACK {nextPack.number} OF {packs.length}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, letterSpacing: 1, lineHeight: 1, marginTop: 4 }}>{nextPack.english}</div>
              <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 17, opacity: 0.85, marginTop: 2 }}>
                {nextPack.tamil} · <em style={{ fontFamily: 'var(--font-body)' }}>{nextPack.roman}</em>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.9, marginTop: 8, maxWidth: 270, lineHeight: 1.4 }}>{nextPack.blurb}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, position: 'relative' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.85 }}>{nextPack.wordIds.length} words · 2 minutes</span>
                <span style={{ background: '#fff', color: 'var(--vermillion)', fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1.5, padding: '8px 18px', borderRadius: 24 }}>
                  {completedCount === 0 ? 'Start →' : 'Go →'}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/challenge"
              className="tappable"
              style={{ display: 'block', background: 'var(--navy)', borderRadius: 20, padding: 20, color: '#fff', textDecoration: 'none', borderTop: '5px solid var(--turmeric)' }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2.5, color: 'var(--turmeric)' }}>ALL 6 PACKS DONE</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1, lineHeight: 1.05, marginTop: 4 }}>Test yourself →</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.8, marginTop: 6 }}>Mix everything you have learned in a 5 question challenge.</p>
            </Link>
          )}
        </section>

        {/* ── Path ── */}
        <section aria-labelledby="path-heading">
          <SectionTitle id="path-heading">Your path</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            {packs.map((p, i) => {
              const done = isComplete(p.id)
              const current = nextPack?.id === p.id
              return (
                <Link
                  key={p.id}
                  href={`/pack/${p.id}`}
                  className="tappable"
                  aria-label={`Pack ${p.number}: ${p.english}${done ? ', done' : ''}`}
                  style={{
                    background: done ? 'var(--navy)' : 'var(--white)',
                    border: current ? `2px solid var(--vermillion)` : done ? '2px solid var(--navy)' : '2px solid var(--cream-dark)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '10px 10px 9px',
                    textDecoration: 'none',
                    color: done ? '#fff' : 'var(--navy)',
                    position: 'relative',
                    animation: `stampIn 180ms ${i * 50}ms ease-out backwards`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: done ? 'var(--turmeric)' : 'var(--stone)' }}>{p.number}</span>
                    {done && (
                      <span aria-hidden style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--turmeric)', color: 'var(--navy)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                        ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, letterSpacing: 0.5, lineHeight: 1.1, marginTop: 2 }}>{p.english}</div>
                  <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 12, opacity: 0.6, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.tamil}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Line of the day ── */}
        <section aria-labelledby="dotd-heading">
          <SectionTitle id="dotd-heading" hint="Tap any word to hear it">
            Cinema line of the day
          </SectionTitle>
          <DialogueCard
            dialogue={dialogue}
            label="Line of the day"
            seen={isSeen('dialogues', dialogue.id)}
            onHear={() => {
              markSeen('dialogues', dialogue.id)
              reward('card_heard', `dialogues:${dialogue.id}`, dialogue.tamil)
            }}
            onBreakdown={() => {
              markSeen('dialogues', dialogue.id)
              reward('meaning_revealed', `dialogues:${dialogue.id}`, dialogue.tamil)
            }}
          />
        </section>

        {/* ── More ── */}
        <section aria-labelledby="more-heading">
          <SectionTitle id="more-heading">More to explore</SectionTitle>
          <nav aria-label="Modules" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {EXPLORE.map((card, i) => (
              <Link
                key={card.href}
                href={card.href}
                className="tappable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: card.bg,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-card)',
                  borderLeft: `5px solid ${card.accent}`,
                  animation: `stampIn 180ms ${i * 60 + 100}ms ease-out backwards`,
                }}
              >
                <span aria-hidden lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 30, color: card.accent, width: 36, textAlign: 'center', lineHeight: 1 }}>
                  {card.icon}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', letterSpacing: 1, lineHeight: 1.1 }}>
                    {card.title} <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 0 }}>{card.tamil}</span>
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{card.subtitle}</span>
                </span>
                <span aria-hidden style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'rgba(255,255,255,0.5)' }}>→</span>
              </Link>
            ))}
          </nav>
        </section>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--stone)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
          No streaks. No pressure. Just Tamil.
        </p>
      </main>

      {rewardUI}
      <NavBar />
    </div>
  )
}

function SectionTitle({ id, children, hint }: { id: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
      <h2 id={id} style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1, color: 'var(--navy)', fontWeight: 400 }}>
        {children}
      </h2>
      {hint && <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: 'var(--stone)' }}>{hint}</span>}
    </div>
  )
}

export default function HomePage() {
  const { mounted, onboardingComplete } = useLearnerStage()

  // Until localStorage has been read we can't know whether to show onboarding,
  // so show a plain navy screen rather than flashing the home page.
  if (!mounted) return <div style={{ minHeight: '100dvh', background: 'var(--navy)' }} />
  if (!onboardingComplete) return <OnboardingFlow />
  return <Home />
}
