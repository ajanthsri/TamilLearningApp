'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { AudioButton } from '@/components/ui/AudioButton'
import { useXP } from '@/hooks/useXP'
import { useProgress } from '@/hooks/useProgress'
import { dialogues } from '@/data/dialogues'
import { getLevelFromXP, getNextLevel, getProgressToNextLevel } from '@/data/levels'

// Mood colour map
const MOOD_COLOURS: Record<string, string> = {
  swagger:      '#F5A623',
  philosophical:'#7B9ED9',
  romantic:     '#D98CA0',
  political:    '#6FBF7A',
  emotional:    '#B08BE8',
  defiant:      '#E88A4F',
}

function DialogueOfTheDay() {
  const dialogue = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % dialogues.length
    return dialogues[dayIndex]
  }, [])

  const moodColour = MOOD_COLOURS[dialogue.mood] ?? '#F5A623'

  return (
    <div style={{
      background: 'var(--navy)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 20px 18px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-heavy)',
    }}>
      {/* Decorative corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${moodColour}22, transparent 70%)`,
      }} />

      {/* Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
        }}>
          டயலாக் of the day
        </span>
        <span style={{
          background: moodColour + '28',
          color: moodColour,
          fontSize: 9,
          fontFamily: 'var(--font-display)',
          letterSpacing: 1.5,
          padding: '3px 8px',
          borderRadius: 12,
          textTransform: 'uppercase',
        }}>
          {dialogue.mood}
        </span>
      </div>

      {/* Left accent border */}
      <div style={{
        borderLeft: `3px solid ${moodColour}`,
        paddingLeft: 14,
        marginBottom: 14,
      }}>
        {/* Tamil dialogue */}
        <div style={{
          fontFamily: 'var(--font-tamil)',
          fontSize: 18,
          color: '#fff',
          lineHeight: 1.6,
          marginBottom: 6,
        }}>
          {dialogue.tamil}
        </div>
        {/* Romanisation */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 12,
          color: 'rgba(255,255,255,0.45)',
          marginBottom: 4,
        }}>
          {dialogue.roman}
        </div>
        {/* English */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'rgba(255,255,255,0.7)',
        }}>
          "{dialogue.english}"
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
          {dialogue.inspiration}
        </div>
        <AudioButton text={dialogue.tamil} size="sm" variant="navy" />
      </div>
    </div>
  )
}

function XPSection() {
  const { xp, currentLevel, nextLevel, levelProgress } = useXP()

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      border: '1.5px solid var(--cream-dark)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-tamil)', fontSize: 22, color: 'var(--navy)', lineHeight: 1 }}>
            {currentLevel.tamil}
          </div>
          <div style={{ fontSize: 10, color: 'var(--stone)', letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginTop: 2 }}>
            {currentLevel.roman} · {currentLevel.english}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--vermillion)', letterSpacing: 1 }}>
            {xp}
          </div>
          <div style={{ fontSize: 10, color: 'var(--stone)', letterSpacing: 1.5, textTransform: 'uppercase' }}>XP</div>
        </div>
      </div>

      {nextLevel && (
        <>
          <div style={{ background: 'var(--cream-dark)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
            <div style={{
              width: `${levelProgress.percent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--vermillion), var(--turmeric))',
              borderRadius: 4,
              transition: 'width 600ms ease-out',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--stone)', letterSpacing: 0.5 }}>
              {levelProgress.current} / {levelProgress.required} XP
            </span>
            <span style={{ fontSize: 10, color: 'var(--stone)', letterSpacing: 0.5 }}>
              Next: {nextLevel.roman}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

const MODULE_CARDS = [
  {
    href: '/learn',
    titleTamil: 'கற்க',
    title: 'Learn',
    subtitle: 'Letters · Words · Phrases',
    accent: 'var(--vermillion)',
    bg: 'var(--navy)',
    icon: 'அ',
  },
  {
    href: '/challenge',
    titleTamil: 'தேர்வு',
    title: 'Challenge',
    subtitle: '5-question quiz',
    accent: 'var(--turmeric)',
    bg: '#2D1F3C',
    icon: '?',
  },
  {
    href: '/write',
    titleTamil: 'எழுது',
    title: 'Write',
    subtitle: 'Tamil vowels practice',
    accent: '#6FBF7A',
    bg: '#1F2E28',
    icon: '✍',
  },
  {
    href: '/progress',
    titleTamil: 'முன்னேற்றம்',
    title: 'Progress',
    subtitle: 'Your learning journey',
    accent: '#7B9ED9',
    bg: '#1F2438',
    icon: '↑',
  },
]

export default function HomePage() {
  const { countSeen, countPractised } = useProgress()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{
        background: 'var(--navy)',
        padding: '48px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Tamil watermark */}
        <div style={{
          position: 'absolute',
          right: -20,
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-tamil)',
          fontSize: 160,
          color: 'rgba(255,255,255,0.04)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          த
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'var(--vermillion)',
          marginBottom: 8,
        }}>
          Learn Tamil
        </div>

        {/* App title */}
        <div style={{
          fontFamily: 'var(--font-tamil)',
          fontSize: 48,
          color: '#fff',
          lineHeight: 1,
          marginBottom: 4,
        }}>
          தமிழ்
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          maxWidth: 260,
        }}>
          Learning Tamil, the way it was always meant to be shared.
        </div>

        {/* Seen / practised counts */}
        {mounted && (
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            {[
              { label: 'Seen', value: countSeen('words') + countSeen('letters') + countSeen('phrases') + countSeen('dialogues') },
              { label: 'Practised', value: countPractised('words') + countPractised('letters') + countPractised('phrases') + countPractised('dialogues') },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--turmeric)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* XP Bar */}
        {mounted && <XPSection />}

        {/* Dialogue of the Day */}
        <div>
          <DialogueOfTheDay />
        </div>

        {/* Module cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {MODULE_CARDS.map((card, i) => (
            <Link
              key={card.href}
              href={card.href}
              style={{
                background: card.bg,
                borderRadius: 'var(--radius-lg)',
                padding: '18px 16px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                animation: `stampIn 180ms ${i * 60 + 100}ms ease-out both`,
                borderTop: `3px solid ${card.accent}`,
              }}
              className="tappable"
            >
              {/* Watermark icon */}
              <div style={{
                position: 'absolute', right: 10, bottom: 4,
                fontFamily: 'var(--font-tamil)',
                fontSize: 48,
                color: 'rgba(255,255,255,0.06)',
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {card.icon}
              </div>

              <div style={{ fontFamily: 'var(--font-tamil)', fontSize: 20, color: card.accent, lineHeight: 1 }}>
                {card.titleTamil}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', letterSpacing: 1 }}>
                {card.title}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                {card.subtitle}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer tagline */}
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 11, color: 'var(--stone)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
            No streaks. No pressure. Just Tamil.
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
