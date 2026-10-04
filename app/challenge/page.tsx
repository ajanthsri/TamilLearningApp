'use client'
import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/PageHeader'
import { NavBar } from '@/components/ui/NavBar'
import { VictoryOverlay } from '@/components/ui/VictoryOverlay'
import { QuizQuestion } from '@/components/challenge/QuizQuestion'
import { useQuiz } from '@/hooks/useQuiz'
import { useProgress } from '@/hooks/useProgress'
import { useXP } from '@/hooks/useXP'
import { useLearnerStage } from '@/hooks/useLearnerStage'
import { pickRandom } from '@/lib/store'
import { XP_VALUES } from '@/types'
import { ENCOURAGE, RESULT } from '@/data/copy'


function resultCopy(score: number) {
  if (score === 5) return RESULT.perfect
  if (score === 4) return RESULT.great
  if (score === 3) return RESULT.good
  return RESULT.start
}

type Victory = { tamil: string; xp: number; levelUp: boolean; levelName?: string; levelEnglish?: string }

export default function ChallengePage() {
  const { progress, markPractised } = useProgress()
  const { addXP } = useXP()
  const { stage } = useLearnerStage()
  const quiz = useQuiz(progress.seen.words, progress.seen.letters, stage)

  const [started, setStarted] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [encourage, setEncourage] = useState<{ tamil: string; english: string } | null>(null)
  const [showNext, setShowNext] = useState(false)
  const [victory, setVictory] = useState<Victory | null>(null)
  const [bonus, setBonus] = useState<number | null>(null)
  const bonusGiven = useRef(false)
  const nextTimer = useRef<ReturnType<typeof setTimeout>>()

  const q = quiz.currentQuestion

  const start = () => {
    quiz.buildQuiz()
    setStarted(true)
    setSelected(null)
    setEncourage(null)
    setShowNext(false)
    setBonus(null)
    bonusGiven.current = false
  }

  const next = () => {
    clearTimeout(nextTimer.current)
    setSelected(null)
    setEncourage(null)
    setShowNext(false)
    const finishing = quiz.currentIndex + 1 >= quiz.questions.length
    quiz.advance()
    if (finishing) finish()
  }

  const finish = () => {
    if (bonusGiven.current) return
    bonusGiven.current = true
    // The last answer was recorded on an earlier render, so answers is complete here
    const score = Object.values(quiz.answers).filter(Boolean).length
    if (score >= 3) {
      const r = addXP('quiz_completed')
      setBonus(r.gained)
      if (r.leveledUp) {
        setVictory({ tamil: 'சபாஷ்!', xp: r.gained, levelUp: true, levelName: r.newLevel.tamil, levelEnglish: `${r.newLevel.roman} · ${r.newLevel.english}` })
      }
    }
  }

  const answer = (opt: string) => {
    if (!q || selected !== null) return
    setSelected(opt)
    const correct = quiz.submitAnswer(q.id, opt)
    if (correct) {
      markPractised(q.module, q.itemId)
      const r = addXP('quiz_correct')
      setVictory({
        tamil: q.prompt,
        xp: r.gained,
        levelUp: r.leveledUp,
        levelName: r.newLevel.tamil,
        levelEnglish: `${r.newLevel.roman} · ${r.newLevel.english}`,
      })
    } else {
      const line = pickRandom(ENCOURAGE)
      setEncourage({ tamil: line.tamil, english: line.english.replace('{answer}', q.correct) })
      nextTimer.current = setTimeout(() => setShowNext(true), 1500)
    }
  }

  const dismissVictory = () => {
    const wasAnswer = selected !== null && !quiz.isComplete
    setVictory(null)
    if (wasAnswer) next()
  }

  const result = useMemo(() => resultCopy(quiz.score), [quiz.score])

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(90px + env(safe-area-inset-bottom))' }}>
      <PageHeader tamil="தேர்வு" title="Challenge" subtitle="Let's see what's stayed with you." watermark="?" />

      <main style={{ padding: '20px 16px' }}>
        {!started && (
          <div className="page-enter" style={{ textAlign: 'center', padding: '24px 8px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--navy)', lineHeight: 1.5, marginBottom: 6 }}>
              Five quick questions from what you&apos;ve explored, plus a few words everyone knows.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--stone)', marginBottom: 24 }}>
              +{XP_VALUES.quiz_correct} XP for each one you get. No penalty for the rest.
            </p>
            <PrimaryButton onClick={start}>Start →</PrimaryButton>
          </div>
        )}

        {started && !quiz.isComplete && q && (
          <>
            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ flex: 1, height: 6, background: 'var(--cream-dark)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${((quiz.currentIndex + (selected ? 1 : 0)) / quiz.questions.length) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--vermillion), var(--turmeric))',
                    transition: 'width 300ms ease-out',
                  }}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 1, color: 'var(--stone)' }}>
                {quiz.currentIndex + 1} / {quiz.questions.length}
              </span>
            </div>

            <QuizQuestion question={q} onAnswer={answer} disabled={selected !== null} selected={selected} />

            {encourage && (
              <div
                role="status"
                style={{
                  marginTop: 16,
                  background: 'var(--white)',
                  borderLeft: '4px solid var(--error-soft)',
                  borderRadius: 'var(--radius)',
                  padding: '12px 14px',
                  animation: 'pageFade 160ms ease-out both',
                }}
              >
                <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 18, color: 'var(--navy)' }}>
                  {encourage.tamil}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--stone)' }}>{encourage.english}</div>
              </div>
            )}

            {showNext && (
              <div style={{ marginTop: 16, textAlign: 'right', animation: 'pageFade 160ms ease-out both' }}>
                <PrimaryButton onClick={next}>Next →</PrimaryButton>
              </div>
            )}
          </>
        )}

        {started && quiz.isComplete && (
          <div className="page-enter" style={{ textAlign: 'center', padding: '16px 4px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 72, lineHeight: 1, color: 'var(--vermillion)', letterSpacing: 2 }}>
              {quiz.score}/{quiz.questions.length}
            </div>
            <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 26, color: 'var(--navy)', marginTop: 10 }}>
              {result.tamil}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'var(--stone)', marginTop: 4, marginBottom: 18 }}>
              {result.english}
            </p>
            {bonus !== null && (
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
                  marginBottom: 22,
                  animation: 'xpFloat 300ms 200ms ease-out both',
                }}
              >
                +{bonus} XP challenge bonus
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
              <Link
                href="/learn"
                className="tappable"
                style={{
                  background: 'var(--vermillion)',
                  color: '#fff',
                  borderRadius: 'var(--radius)',
                  padding: '12px 28px',
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  letterSpacing: 1.5,
                  textDecoration: 'none',
                }}
              >
                Explore more →
              </Link>
              <button
                onClick={start}
                className="tappable"
                style={{ background: 'none', border: 'none', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 1.2, color: 'var(--navy)', padding: 8 }}
              >
                Play again
              </button>
            </div>
          </div>
        )}
      </main>

      <VictoryOverlay
        visible={victory !== null}
        tamil={victory?.tamil ?? ''}
        xpGained={victory?.xp ?? 0}
        isLevelUp={victory?.levelUp}
        levelName={victory?.levelName}
        levelNameEnglish={victory?.levelEnglish}
        onDismiss={dismissVictory}
      />
      <NavBar />
    </div>
  )
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="tappable"
      style={{
        background: 'var(--vermillion)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '12px 28px',
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        letterSpacing: 1.5,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </button>
  )
}
