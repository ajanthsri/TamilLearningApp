'use client'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { XPBar } from '@/components/ui/XPBar'
import { DialogueCard } from '@/components/cards/DialogueCard'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { useReward } from '@/components/ui/Reward'
import { useProgress } from '@/hooks/useProgress'
import { useLearnerStage } from '@/hooks/useLearnerStage'
import { dialogues } from '@/data/dialogues'
import { getStageInfo } from '@/data/stages'
import { ModuleKey } from '@/types'

const MODULES: ModuleKey[] = ['letters', 'words', 'phrases', 'dialogues']

const MODULE_CARDS = [
  { href: '/learn', titleTamil: 'கற்க', title: 'Learn', subtitle: 'Letters · Words · Phrases', accent: 'var(--vermillion)', bg: 'var(--navy)', icon: 'அ' },
  { href: '/challenge', titleTamil: 'தேர்வு', title: 'Challenge', subtitle: '5 quick questions', accent: 'var(--turmeric)', bg: '#2D1F3C', icon: '?' },
  { href: '/write', titleTamil: 'எழுது', title: 'Write', subtitle: 'Recognise the vowels', accent: '#6FBF7A', bg: '#1F2E28', icon: 'எ' },
  { href: '/progress', titleTamil: 'முன்னேற்றம்', title: 'Progress', subtitle: 'Your journey so far', accent: '#7B9ED9', bg: '#1F2438', icon: '↑' },
]

function dialogueOfTheDay() {
  const d = new Date()
  const localDay = Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000)
  return dialogues[localDay % dialogues.length]
}

function Home() {
  const { stage } = useLearnerStage()
  const { countSeen, countPractised, isSeen, markSeen } = useProgress()
  const { reward, rewardUI } = useReward()
  const info = getStageInfo(stage)
  const dialogue = dialogueOfTheDay()

  const totalSeen = MODULES.reduce((n, m) => n + countSeen(m), 0)
  const totalPractised = MODULES.reduce((n, m) => n + countPractised(m), 0)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}>
      {/* Header */}
      <header
        style={{
          background: 'var(--navy)',
          padding: 'calc(44px + env(safe-area-inset-top)) 20px 26px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '3px solid var(--vermillion)',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-tamil)',
            fontSize: 170,
            color: 'rgba(255,255,255,0.045)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          த
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--vermillion)', marginBottom: 6 }}>
          Learn Tamil
        </div>
        <h1 lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 52, color: '#fff', lineHeight: 1.1, fontWeight: 400 }}>
          தமிழ்
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 280, marginTop: 6 }}>
          {info.homeSubline}
        </p>

        <div style={{ display: 'flex', gap: 24, marginTop: 18 }}>
          {[
            { label: 'Seen', value: totalSeen },
            { label: 'Practised', value: totalPractised },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, color: 'var(--turmeric)' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      <main className="page-enter" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <XPBar />

        <DialogueCard
          dialogue={dialogue}
          label="டயலாக் of the day"
          seen={isSeen('dialogues', dialogue.id)}
          onHear={() => {
            markSeen('dialogues', dialogue.id)
            reward('card_heard', `dialogues:${dialogue.id}`, dialogue.tamil)
          }}
        />

        {/* Start here */}
        <Link
          href={`/learn?tab=${info.defaultLearnTab}`}
          className="tappable"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '5px solid var(--turmeric)',
            boxShadow: 'var(--shadow-card)',
            padding: '14px 16px',
            textDecoration: 'none',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--stone)' }}>
              <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', letterSpacing: 0, textTransform: 'none' }}>இங்கே தொடங்கு</span> · Start here
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 1, color: 'var(--navy)', lineHeight: 1.2 }}>{info.startHereTitle}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--stone)' }}>{info.startHereCopy}</div>
          </div>
          <span aria-hidden style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--vermillion)' }}>→</span>
        </Link>

        {/* Modules */}
        <nav aria-label="Modules" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {MODULE_CARDS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              className="tappable"
              style={{
                background: card.bg,
                borderRadius: 'var(--radius-lg)',
                padding: '18px 16px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                animation: `stampIn 180ms ${i * 60 + 100}ms ease-out backwards`,
                borderTop: `3px solid ${card.accent}`,
                minHeight: 118,
              }}
            >
              <div
                aria-hidden
                style={{ position: 'absolute', right: 10, bottom: 0, fontFamily: 'var(--font-tamil)', fontSize: 56, color: 'rgba(255,255,255,0.07)', lineHeight: 1, userSelect: 'none' }}
              >
                {card.icon}
              </div>
              <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: card.titleTamil.length > 6 ? 16 : 20, color: card.accent, lineHeight: 1.3 }}>
                {card.titleTamil}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', letterSpacing: 1, lineHeight: 1 }}>{card.title}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{card.subtitle}</div>
            </Link>
          ))}
        </nav>

        <p style={{ textAlign: 'center', paddingTop: 8, fontSize: 13, color: 'var(--stone)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
          No streaks. No pressure. Just Tamil.
        </p>
      </main>

      {rewardUI}
      <NavBar />
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
