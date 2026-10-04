'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { LearnerStage } from '@/types'
import { stages, getStageInfo } from '@/data/stages'
import { PLACEMENT_SETS, placementSuggestion } from '@/data/placement'
import { useQuiz } from '@/hooks/useQuiz'
import { useProgress } from '@/hooks/useProgress'
import { useLearnerStage } from '@/hooks/useLearnerStage'
import { AudioButton } from '@/components/ui/AudioButton'
import { QuizQuestion } from '@/components/challenge/QuizQuestion'
import { StageCard } from './StageCard'
import { Avatar } from '@/components/ui/Avatar'
import { BackButton } from '@/components/ui/PageHeader'
import { characters } from '@/data/avatars'
import { useProfile, NAME_MAX } from '@/hooks/useProfile'
import { SHOW_STAGE_SELECTION } from '@/lib/config'

type Screen = 'welcome' | 'dialect' | 'avatar' | 'stage' | 'check' | 'result'
const NO_IDS: number[] = []
const ADVANCE_MS = 900

interface Props {
  onComplete?: (stage: LearnerStage) => void
}

export function OnboardingFlow({ onComplete }: Props) {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [dir, setDir] = useState<'forward' | 'back'>('forward')
  const go = (next: Screen, d: 'forward' | 'back' = 'forward') => {
    setDir(d)
    setScreen(next)
  }
  const [chosen, setChosen] = useState<LearnerStage | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const quiz = useQuiz(NO_IDS, NO_IDS)
  const { markSeen } = useProgress()
  const { setStage, completeOnboarding } = useLearnerStage()
  const { character, hasAvatar, setAvatar, setDialect, setName } = useProfile()
  const [nameDraft, setNameDraft] = useState('')

  useEffect(() => () => clearTimeout(timer.current), [])

  const finish = (stage: LearnerStage) => {
    setStage(stage)
    completeOnboarding()
    onComplete?.(stage)
  }

  const continueFromAvatar = () => {
    if (!hasAvatar) setAvatar(character.id)
    setName(nameDraft)
    if (SHOW_STAGE_SELECTION) go('stage')
    else finish('newbie')
  }

  const continueFromStage = () => {
    if (!chosen) return
    if (chosen === 'newbie') return finish('newbie')
    quiz.buildFixedQuiz(PLACEMENT_SETS[chosen])
    setScore(0)
    setSelected(null)
    go('check')
  }

  const answer = (opt: string) => {
    const q = quiz.currentQuestion
    if (!q || selected !== null) return
    setSelected(opt)
    const correct = quiz.submitAnswer(q.id, opt)
    if (correct) {
      setScore(s => s + 1)
      markSeen(q.module, q.itemId)
    }
    const last = quiz.currentIndex + 1 >= quiz.questions.length
    timer.current = setTimeout(() => {
      setSelected(null)
      if (last) go('result')
      else quiz.advance()
    }, ADVANCE_MS)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'var(--navy)',
        color: '#fff',
        overflowY: 'auto',
        padding: 'calc(28px + env(safe-area-inset-top)) 20px calc(28px + env(safe-area-inset-bottom))',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'fixed',
          right: -30,
          bottom: -20,
          fontFamily: 'var(--font-tamil)',
          fontSize: 260,
          lineHeight: 1,
          color: 'rgba(255,255,255,0.035)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        த
      </div>

      <div
        key={screen}
        style={{ animation: `${dir === 'back' ? 'slideInLeft' : 'slideInRight'} 240ms ease-out backwards`, maxWidth: 440, margin: '0 auto', minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {screen === 'welcome' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100dvh - 56px)' }}>
            <Kicker>Learn Tamil</Kicker>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, letterSpacing: 1.5, lineHeight: 1, margin: '8px 0 18px', fontWeight: 400 }}>
              Welcome.
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
                maxWidth: 340,
              }}
            >
              <AudioButton text="வணக்கம்" size="lg" />
              <div>
                <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 28, color: 'var(--turmeric)', lineHeight: 1.2 }}>
                  வணக்கம்
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                  <em>vanakkam</em> means hello. Tap play to hear it.
                </div>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, maxWidth: 330, marginTop: 20 }}>
              Learn Tamil the way your family speaks it. A few words at a time, with a play button on everything.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 10 }}>
              No sign-up. No streaks. Just Tamil.
            </p>
            <div style={{ marginTop: 32 }}>
              <Primary onClick={() => go('dialect')}>Let&apos;s begin →</Primary>
            </div>
          </div>
        )}

        {screen === 'dialect' && (
          <>
            <BackButton label="Back" onClick={() => go('welcome', 'back')} />
            <StepDots step={1} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1, lineHeight: 1.05, marginTop: 14, fontWeight: 400 }}>
              Which Tamil do you want to learn?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: '8px 0 20px', lineHeight: 1.45 }}>
              The script is the same, but everyday words and accents differ. We teach one properly rather than mixing them.
            </p>
            <div role="radiogroup" aria-label="Dialect" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ChoiceCard selected title="Sri Lankan Tamil" tamil="இலங்கைத் தமிழ்" body="As spoken in Jaffna, Colombo and most of the UK diaspora. Ammamma, koppi, and ஓம் for yes." onClick={() => setDialect('lk')} />
              <ChoiceCard disabled title="Indian Tamil" tamil="இந்தியத் தமிழ்" body="As spoken in Tamil Nadu. Coming soon." badge="Coming soon" />
            </div>
            <div style={{ marginTop: 24 }}>
              <Primary
                onClick={() => {
                  setDialect('lk')
                  go('avatar')
                }}
              >
                Continue →
              </Primary>
            </div>
          </>
        )}

        {screen === 'avatar' && (
          <>
            <BackButton label="Back" onClick={() => go('dialect', 'back')} />
            <StepDots step={2} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1, lineHeight: 1.05, marginTop: 14, fontWeight: 400 }}>
              Pick your character
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: '8px 0 18px', lineHeight: 1.45 }}>
              They start as a child and grow up as you learn.
            </p>
            <div role="radiogroup" aria-label="Character" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {characters.map((c, i) => {
                const selected = hasAvatar && character.id === c.id
                return (
                  <button
                    key={c.id}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setAvatar(c.id)}
                    className="tappable"
                    style={{
                      background: selected ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.04)',
                      border: selected ? '2px solid var(--turmeric)' : '2px solid rgba(255,255,255,0.1)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '10px 4px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      color: '#fff',
                      animation: `stampIn 180ms ${i * 50}ms ease-out backwards`,
                    }}
                  >
                    <Avatar character={c} level={1} size={72} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1 }}>{c.name}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{c.meaning}</span>
                  </button>
                )
              })}
            </div>
            {hasAvatar && (
              <div style={{ marginTop: 18, animation: 'pageFade 200ms ease-out both' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>
                  {character.name} as you level up
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {[1, 2, 3, 4, 5].map(l => (
                    <Avatar key={l} character={character} level={l} size={l === 1 ? 44 : 52} />
                  ))}
                </div>
              </div>
            )}
            <label style={{ display: 'block', marginTop: 22 }}>
              <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1, marginBottom: 6 }}>
                What should we call you? <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, letterSpacing: 0, color: 'rgba(255,255,255,0.5)' }}>(optional)</span>
              </span>
              <input
                value={nameDraft}
                onChange={e => setNameDraft(e.target.value.slice(0, NAME_MAX))}
                maxLength={NAME_MAX}
                autoComplete="given-name"
                placeholder="Your first name"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  borderRadius: 'var(--radius)',
                  padding: '12px 14px',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            </label>
            <div style={{ marginTop: 20 }}>
              <Primary onClick={continueFromAvatar} disabled={!hasAvatar}>
                Start learning →
              </Primary>
            </div>
          </>
        )}

        {screen === 'stage' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <BackButton label="Back" onClick={() => go('avatar', 'back')} />
              <TextButton onClick={() => finish('newbie')}>Skip</TextButton>
            </div>
            <h2 lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 24, lineHeight: 1.4, color: 'var(--turmeric)', fontWeight: 400, marginTop: 8 }}>
              உங்களுக்கு எவ்வளவு தமிழ் தெரியும்?
            </h2>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1, lineHeight: 1.1, marginBottom: 20 }}>
              How much Tamil do you have?
            </p>
            <div role="radiogroup" aria-label="Your stage" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stages.map((s, i) => (
                <StageCard key={s.stage} info={s} index={i} selected={chosen === s.stage} onSelect={() => setChosen(s.stage)} />
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <Primary onClick={continueFromStage} disabled={!chosen}>
                Continue →
              </Primary>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 14 }}>
              You can change this anytime. Nothing is locked.
            </p>
          </>
        )}

        {screen === 'check' && quiz.currentQuestion && (
          <>
            <Kicker>Quick check</Kicker>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '4px 0 16px', lineHeight: 1.45 }}>
              5 questions. No score, no pressure. It just helps us suggest where to start.
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18 }} aria-label={`Question ${quiz.currentIndex + 1} of ${quiz.questions.length}`}>
              {quiz.questions.map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    background: i < quiz.currentIndex || (i === quiz.currentIndex && selected) ? 'var(--turmeric)' : 'rgba(255,255,255,0.15)',
                    transition: 'background 200ms ease-out',
                  }}
                />
              ))}
            </div>
            <QuizQuestion
              question={quiz.currentQuestion}
              onAnswer={answer}
              disabled={selected !== null}
              selected={selected}
              showNotSure
              autoPlay={chosen === 'intermediate' && quiz.currentQuestion.type === 'word'}
              dark
            />
          </>
        )}

        {screen === 'result' && chosen && chosen !== 'newbie' && (
          <Result chosen={chosen} score={score} total={quiz.questions.length} onPick={finish} />
        )}
      </div>
    </div>
  )
}

function Result({
  chosen,
  score,
  total,
  onPick,
}: {
  chosen: 'intermediate' | 'advanced'
  score: number
  total: number
  onPick: (s: LearnerStage) => void
}) {
  const suggestion = placementSuggestion(chosen, score)
  const chosenInfo = getStageInfo(chosen)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100dvh - 56px)' }}>
      <Kicker>
        You got {score} of {total}
      </Kicker>
      {suggestion === null ? (
        <>
          <h2 lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 40, color: 'var(--turmeric)', fontWeight: 400, lineHeight: 1.3 }}>
            நல்லது.
          </h2>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, letterSpacing: 1, lineHeight: 1.1 }}>{chosenInfo.english} it is.</p>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
            {chosenInfo.homeSubline}
          </p>
          <div style={{ marginTop: 32 }}>
            <Primary onClick={() => onPick(chosen)}>Let&apos;s go →</Primary>
          </div>
        </>
      ) : (
        <>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, letterSpacing: 1, lineHeight: 1.15 }}>
            {suggestion === 'advanced' ? 'You might be Advanced.' : `We'd suggest starting at ${getStageInfo(suggestion).english}.`}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
            {suggestion === 'advanced' ? 'Five out of five. Want to jump up?' : "But it's your call. Everything stays open either way."}
          </p>
          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            <Primary onClick={() => onPick(suggestion)}>
              {suggestion === 'advanced' ? 'Switch to Advanced' : `Start at ${getStageInfo(suggestion).english}`}
            </Primary>
            <Secondary onClick={() => onPick(chosen)}>Keep {chosenInfo.english}</Secondary>
          </div>
        </>
      )}
    </div>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--vermillion)' }}>
      {children}
    </div>
  )
}

function Primary({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tappable"
      style={{
        background: disabled ? 'rgba(255,255,255,0.12)' : 'var(--vermillion)',
        color: disabled ? 'rgba(255,255,255,0.4)' : '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '14px 30px',
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        letterSpacing: 1.5,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 150ms ease-out',
      }}
    >
      {children}
    </button>
  )
}

function Secondary({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="tappable"
      style={{
        background: 'none',
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.35)',
        borderRadius: 'var(--radius)',
        padding: '12px 26px',
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        letterSpacing: 1.5,
      }}
    >
      {children}
    </button>
  )
}

function TextButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="tappable"
      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 1.5, padding: 8 }}
    >
      {children}
    </button>
  )
}

function StepDots({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 18 }} aria-label={`Step ${step} of 2`}>
      {[1, 2].map(i => (
        <div key={i} style={{ width: 28, height: 4, borderRadius: 2, background: i <= step ? 'var(--turmeric)' : 'rgba(255,255,255,0.15)' }} />
      ))}
    </div>
  )
}

function ChoiceCard({
  title,
  tamil,
  body,
  badge,
  selected,
  disabled,
  onClick,
}: {
  title: string
  tamil: string
  body: string
  badge?: string
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      role="radio"
      aria-checked={!!selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className={disabled ? undefined : 'tappable'}
      style={{
        textAlign: 'left',
        background: selected ? 'rgba(245,166,35,0.1)' : 'rgba(255,255,255,0.04)',
        border: selected ? '2px solid var(--turmeric)' : '2px solid rgba(255,255,255,0.12)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 18px',
        color: '#fff',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 1, color: selected ? 'var(--turmeric)' : '#fff' }}>{title}</span>
        {badge ? (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1.2, border: '1px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '2px 8px' }}>{badge}</span>
        ) : (
          selected && <span aria-hidden style={{ color: 'var(--turmeric)', fontSize: 20 }}>✓</span>
        )}
      </div>
      <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 15, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{tamil}</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 6, lineHeight: 1.4 }}>{body}</div>
    </button>
  )
}
