'use client'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Avatar } from '@/components/ui/Avatar'
import { Say } from '@/components/ui/Say'
import { AudioButton } from '@/components/ui/AudioButton'
import { DialogueCard } from '@/components/cards/DialogueCard'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { TrackIcon } from '@/components/lesson/TrackIcon'
import { useReward } from '@/components/ui/Reward'
import { useProgress } from '@/hooks/useProgress'
import { useLearnerStage } from '@/hooks/useLearnerStage'
import { useXP } from '@/hooks/useXP'
import { useProfile } from '@/hooks/useProfile'
import { useLessons } from '@/hooks/useLessons'
import { useBadges } from '@/hooks/useBadges'
import { BadgeCelebration } from '@/components/ui/Badge'
import { dialogues } from '@/data/dialogues'
import { TRACKS, TRACK_ORDER, lessonsFor } from '@/data/lessons'
import { UI } from '@/data/copy'
import { ModuleKey } from '@/types'

const MODULES: ModuleKey[] = ['letters', 'words', 'phrases', 'dialogues']

const PRACTISE = [
  { href: '/challenge', title: 'Challenge', tamil: UI.challenge.tamil, subtitle: '5 quick questions', accent: 'var(--turmeric)', bg: '#2D1F3C', icon: '?' },
  { href: '/learn', title: 'Browse all', tamil: UI.learn.tamil, subtitle: 'Every letter, word and phrase', accent: '#7B9ED9', bg: '#1F2438', icon: 'அ' },
]

function dialogueOfTheDay() {
  const d = new Date()
  const localDay = Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000)
  return dialogues[localDay % dialogues.length]
}

function Home() {
  const { countSeen, isSeen, markSeen } = useProgress()
  const { xp, currentLevel, nextLevel, levelProgress } = useXP()
  const { character, name } = useProfile()
  const { continueLesson, countDone, nextLesson } = useLessons()
  const { reward, rewardUI } = useReward()
  const { fresh, markCelebrated } = useBadges()
  const dialogue = dialogueOfTheDay()

  const firstTime = MODULES.reduce((n, m) => n + countSeen(m), 0) === 0
  const startedAny = TRACK_ORDER.some(t => countDone(t) > 0)
  const next = continueLesson
  const nextTrack = next ? TRACKS[next.track] : null

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>
      {/* ── Hero: you, your level, your XP ── */}
      <header
        style={{
          background: 'var(--navy)',
          padding: 'calc(20px + env(safe-area-inset-top)) 18px 20px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid var(--vermillion)',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', right: -24, top: -10, fontFamily: 'var(--font-tamil)', fontSize: 190, color: 'rgba(255,255,255,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
          த
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <Link href="/progress" aria-label="Your stats and character" className="tappable" style={{ flexShrink: 0, lineHeight: 0 }}>
            <Avatar character={character} level={currentLevel.level} size={80} />
          </Link>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>
              {firstTime ? 'Welcome' : 'Welcome back'}
              {name ? `, ${name}` : ''}
            </div>
            <div style={{ marginTop: 4 }}>
              <Say tamil={UI.hello.tamil} roman="vanakkam" size={16} colour="var(--turmeric)" button="light" />
            </div>
          </div>
        </div>

        {/* Level + XP */}
        <div style={{ marginTop: 16, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: 'rgba(255,255,255,0.5)' }}>LEVEL {currentLevel.level}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1, color: '#fff' }}>{currentLevel.english.split(' — ')[0]}</span>
              <Say tamil={currentLevel.tamil} size={14} colour="rgba(255,255,255,0.6)" button="light" />
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1, color: 'var(--turmeric)' }}>{xp}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', marginLeft: 4 }}>XP</span>
            </div>
          </div>
          {nextLevel && (
            <>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.12)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(3, levelProgress.percent)}%`, height: '100%', background: 'linear-gradient(90deg, var(--vermillion), var(--turmeric))', borderRadius: 6, transition: 'width 600ms ease-out' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>
                {levelProgress.required - levelProgress.current} XP until {character.name} grows up to{' '}
                <strong style={{ color: '#fff', fontWeight: 600 }}>{nextLevel.english.split(' — ')[0]}</strong>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="page-enter" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* ── Continue ── */}
        <section aria-labelledby="continue-heading">
          {next && nextTrack ? (
            <div
              className="chunky"
              style={{
                ['--edge' as string]: '#7A1519',
                position: 'relative',
                background: 'var(--vermillion)',
                borderRadius: 20,
                overflow: 'hidden',
                color: '#fff',
              }}
            >
              <div aria-hidden lang="ta" style={{ position: 'absolute', right: -6, bottom: -26, fontFamily: 'var(--font-tamil)', fontSize: 120, color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>
                {next.tamil.slice(0, 1)}
              </div>
              <Link href={`/lesson/${next.track}/${next.id}`} className="tappable" style={{ display: 'block', padding: '18px 18px 16px', color: '#fff', textDecoration: 'none', position: 'relative' }}>
                <div id="continue-heading" style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2.5, opacity: 0.9 }}>
                  <TrackIcon track={next.track} size={16} />
                  {startedAny ? 'CONTINUE' : 'START HERE'} · {nextTrack.english.toUpperCase()} {next.number} OF {lessonsFor(next.track).length}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, letterSpacing: 1, lineHeight: 1, marginTop: 6, paddingRight: 40 }}>{next.english}</div>
                <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 16, opacity: 0.85, marginTop: 2 }}>
                  {next.tamil} · <em style={{ fontFamily: 'var(--font-body)' }}>{next.roman}</em>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: 0.9 }}>About 2 minutes</span>
                  <span style={{ background: '#fff', color: 'var(--vermillion)', fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1.5, padding: '8px 18px', borderRadius: 24 }}>
                    {startedAny ? 'Go →' : 'Start →'}
                  </span>
                </div>
              </Link>
              <div style={{ position: 'absolute', top: 14, right: 14 }}>
                <AudioButton text={next.tamil} size="sm" variant="light" label={`Hear ${next.roman}`} />
              </div>
            </div>
          ) : (
            <Link
              href="/challenge"
              className="tappable"
              style={{ display: 'block', background: 'var(--navy)', borderRadius: 20, padding: 20, color: '#fff', textDecoration: 'none', borderTop: '5px solid var(--turmeric)' }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2.5, color: 'var(--turmeric)' }}>EVERY LESSON DONE</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1, lineHeight: 1.05, marginTop: 4 }}>Test yourself →</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.8, marginTop: 6 }}>Mix everything you have learned in a 5 question challenge.</p>
            </Link>
          )}
        </section>

        {/* ── Three skills ── */}
        <section aria-labelledby="skills-heading">
          <SectionTitle id="skills-heading">Your three skills</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
            {TRACK_ORDER.map((t, i) => {
              const info = TRACKS[t]
              const total = lessonsFor(t).length
              const d = countDone(t)
              const up = nextLesson(t)
              return (
                <div
                  key={t}
                  className="chunky"
                  style={{
                    ['--edge' as string]: '#0D1024',
                    position: 'relative',
                    background: 'var(--navy)',
                    borderRadius: 'var(--radius-lg)',
                    borderTop: `5px solid ${info.colour}`,
                    animation: `stampIn 180ms ${i * 60}ms ease-out backwards`,
                  }}
                >
                  <Link
                    href={`/${t}`}
                    className="tappable"
                    aria-label={`${info.english}: ${d} of ${total} done`}
                    style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '12px 10px 10px', color: '#fff', textDecoration: 'none', minHeight: 150 }}
                  >
                    <span style={{ color: info.colour }}>
                      <TrackIcon track={t} size={28} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 1, lineHeight: 1, marginTop: 6 }}>{info.english}</span>
                    <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                      {info.tamil}
                    </span>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.25, marginTop: 6 }}>
                      {up ? `Next: ${up.english}` : 'All done'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                      <span style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                        <span style={{ display: 'block', width: `${(d / total) * 100}%`, height: '100%', background: info.colour }} />
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'rgba(255,255,255,0.75)' }}>
                        {d}/{total}
                      </span>
                    </span>
                  </Link>
                  <div style={{ position: 'absolute', top: 10, right: 8 }}>
                    <AudioButton text={info.tamil} size="xs" variant="light" label={`Hear ${info.roman}`} />
                  </div>
                </div>
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

        {/* ── Practise ── */}
        <section aria-labelledby="practise-heading">
          <SectionTitle id="practise-heading">Practise</SectionTitle>
          <nav aria-label="Practise" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
            {PRACTISE.map(card => (
              <Link
                key={card.href}
                href={card.href}
                className="chunky"
                style={{
                  ['--edge' as string]: '#0D1024',
                  position: 'relative',
                  overflow: 'hidden',
                  background: card.bg,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 14px 12px',
                  textDecoration: 'none',
                  borderTop: `4px solid ${card.accent}`,
                  minHeight: 104,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <span aria-hidden lang="ta" style={{ position: 'absolute', right: 8, top: 2, fontFamily: 'var(--font-tamil)', fontSize: 44, color: 'rgba(255,255,255,0.08)' }}>
                  {card.icon}
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>{card.title}</span>
                <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  {card.tamil}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{card.subtitle}</span>
              </Link>
            ))}
          </nav>
        </section>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--stone)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>No streaks. No pressure. Just Tamil.</p>
      </main>

      {rewardUI}
      {fresh.length > 0 && <BadgeCelebration badge={fresh[0]} remaining={fresh.length - 1} onDone={() => markCelebrated(fresh[0].id)} />}
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
