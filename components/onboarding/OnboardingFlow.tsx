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

type Screen = 'welcome' | 'stage' | 'check' | 'result'
const NO_IDS: number[] = []
const ADVANCE_MS = 900

interface Props {
  onComplete?: (stage: LearnerStage) => void
}

export function OnboardingFlow({ onComplete }: Props) {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [chosen, setChosen] = useState<LearnerStage | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const quiz = useQuiz(NO_IDS, NO_IDS)
  const { markSeen } = useProgress()
  const { setStage, completeOnboarding } = useLearnerStage()

  useEffect(() => () => clearTimeout(timer.current), [])

  const finish = (stage: LearnerStage) => {
    setStage(stage)
    completeOnboarding()
    onComplete?.(stage)
  }

  const continueFromStage = () => {
    if (!chosen) return
    if (chosen === 'newbie') return finish('newbie')
    quiz.buildFixedQuiz(PLACEMENT_SETS[chosen])
    setScore(0)
    setSelected(null)
    setScreen('check')
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
      if (last) setScreen('result')
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

      <div key={screen} className="page-enter" style={{ maxWidth: 440, margin: '0 auto', minHeight: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {screen === 'welcome' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 'calc(100dvh - 56px)' }}>
            <Kicker>Learn Tamil</Kicker>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0 10px' }}>
              <h1 lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 52, color: 'var(--turmeric)', lineHeight: 1.15, fontWeight: 400 }}>
                வணக்கம்
              </h1>
              <AudioButton text="வணக்கம்" size="lg" />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, maxWidth: 320 }}>
              Learning Tamil, the way it was always meant to be shared.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>
              No sign-up. No streaks. Just Tamil.
            </p>
            <div style={{ marginTop: 36 }}>
              <Primary onClick={() => setScreen('stage')}>Begin →</Primary>
            </div>
          </div>
        )}

        {screen === 'stage' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        {score} of {total}
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
