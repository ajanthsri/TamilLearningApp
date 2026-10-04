'use client'
import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pack, packs } from '@/data/packs'
import { words } from '@/data/words'
import { ENCOURAGE, UI } from '@/data/copy'
import { XP_VALUES, QuizQuestion as Q } from '@/types'
import { useProgress } from '@/hooks/useProgress'
import { useXP } from '@/hooks/useXP'
import { usePacks } from '@/hooks/usePacks'
import { useSpeech } from '@/hooks/useSpeech'
import { wordQuestion } from '@/hooks/useQuiz'
import { pickRandom, shuffle } from '@/lib/store'
import { playFanfare } from '@/lib/sfx'
import { useReward } from '@/components/ui/Reward'
import { CloseButton } from '@/components/ui/PageHeader'
import { Say } from '@/components/ui/Say'
import { AudioButton } from '@/components/ui/AudioButton'
import { VictoryOverlay } from '@/components/ui/VictoryOverlay'
import { QuizQuestion } from '@/components/challenge/QuizQuestion'
import { Confetti } from '@/components/ui/Confetti'

type Phase = 'intro' | 'learn' | 'check' | 'done'
const CHECK_LENGTH = 3

type Victory = { tamil: string; xp: number; levelUp: boolean; levelName: string; levelEnglish: string }

export function PackFlow({ pack }: { pack: Pack }) {
  const router = useRouter()
  const items = useMemo(() => pack.wordIds.map(id => words.find(w => w.id === id)!).filter(Boolean), [pack])
  const nextPack = packs.find(p => p.number === pack.number + 1) ?? null

  const [phase, setPhase] = useState<Phase>('intro')
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [questions, setQuestions] = useState<Q[]>([])
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [encourage, setEncourage] = useState<{ tamil: string; english: string } | null>(null)
  const [victory, setVictory] = useState<Victory | null>(null)
  const [bonus, setBonus] = useState<number | null>(null)
  const advanceAfterVictory = useRef(false)

  const { markSeen, markPractised } = useProgress()
  const { addXP, addXPOnce } = useXP()
  const { complete } = usePacks()
  const { reward, rewardUI } = useReward()
  const { speak } = useSpeech()

  const leave = () => router.push('/')

  // ── Learn phase ──────────────────────────────────────────
  const word = items[index]

  const hear = () => {
    markSeen('words', word.id)
    reward('card_heard', `words:${word.id}`, word.tamil)
  }
  const reveal = () => {
    setRevealed(true)
    markSeen('words', word.id)
    reward('meaning_revealed', `words:${word.id}`, word.tamil)
  }
  const nextWord = () => {
    setRevealed(false)
    if (index + 1 < items.length) {
      setIndex(index + 1)
      // Say the next word straight away; the tap counts as a user gesture
      const next = items[index + 1]
      setTimeout(() => speak(next.tamil), 200)
      markSeen('words', next.id)
      reward('card_heard', `words:${next.id}`, next.tamil)
    } else {
      startCheck()
    }
  }

  // ── Check phase ──────────────────────────────────────────
  const startCheck = () => {
    const ids = shuffle(pack.wordIds).slice(0, CHECK_LENGTH)
    setQuestions(ids.map((id, i) => wordQuestion(id, i)!).filter(Boolean))
    setQIndex(0)
    setSelected(null)
    setScore(0)
    setEncourage(null)
    setPhase('check')
  }

  const q = questions[qIndex]

  const answer = (opt: string) => {
    if (!q || selected !== null) return
    setSelected(opt)
    if (opt === q.correct) {
      setScore(s => s + 1)
      markPractised('words', q.itemId)
      const r = addXP('quiz_correct')
      advanceAfterVictory.current = true
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
    }
  }

  const nextQuestion = () => {
    setSelected(null)
    setEncourage(null)
    if (qIndex + 1 < questions.length) setQIndex(qIndex + 1)
    else finish()
  }

  const finish = () => {
    complete(pack.id)
    const r = addXPOnce('pack_completed', pack.id)
    setBonus(r ? r.gained : null)
    if (r?.leveledUp) {
      advanceAfterVictory.current = false
      setVictory({ tamil: pack.tamil, xp: r.gained, levelUp: true, levelName: r.newLevel.tamil, levelEnglish: `${r.newLevel.roman} · ${r.newLevel.english}` })
    }
    setPhase('done')
    playFanfare()
  }

  const dismissVictory = () => {
    setVictory(null)
    if (advanceAfterVictory.current) {
      advanceAfterVictory.current = false
      nextQuestion()
    }
  }

  // ── Layout ───────────────────────────────────────────────
  const stepTotal = items.length + CHECK_LENGTH
  const step = phase === 'intro' ? 0 : phase === 'learn' ? index + (revealed ? 1 : 0.5) : phase === 'check' ? items.length + qIndex + (selected ? 1 : 0) : stepTotal

  return (
    <div style={{ minHeight: '100dvh', background: phase === 'intro' || phase === 'done' ? 'var(--navy)' : 'var(--cream)', transition: 'background 200ms ease-out' }}>
      {/* Top bar: progress + close */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 'calc(12px + env(safe-area-inset-top)) 16px 12px',
          background: phase === 'intro' || phase === 'done' ? 'var(--navy)' : 'var(--cream)',
        }}
      >
        <CloseButton onClick={leave} label="Leave pack and go home" dark={phase === 'intro' || phase === 'done'} />
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: phase === 'intro' || phase === 'done' ? 'rgba(255,255,255,0.12)' : 'var(--cream-dark)', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(step / stepTotal) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--vermillion), var(--turmeric))',
              borderRadius: 4,
              transition: 'width 300ms ease-out',
            }}
          />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 1, color: phase === 'intro' || phase === 'done' ? 'rgba(255,255,255,0.6)' : 'var(--stone)' }}>
          Pack {pack.number}/{packs.length}
        </span>
      </div>

      <main key={`${phase}-${index}-${qIndex}`} style={{ animation: 'slideInRight 240ms ease-out backwards', padding: '8px 20px calc(32px + env(safe-area-inset-bottom))', maxWidth: 480, margin: '0 auto' }}>
        {phase === 'intro' && (
          <div style={{ color: '#fff', paddingTop: 24 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3, color: pack.colour === '#6B5B4B' ? 'var(--turmeric)' : pack.colour, filter: 'brightness(1.4)' }}>
              PACK {pack.number}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 60, letterSpacing: 1.5, lineHeight: 1, margin: '6px 0 12px', fontWeight: 400 }}>{pack.english}</h1>
            <Say tamil={pack.tamil} roman={pack.roman} size={26} colour="var(--turmeric)" button="light" buttonSize="sm" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginTop: 18 }}>{pack.blurb}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <Chip>{items.length} words</Chip>
              <Chip>{CHECK_LENGTH} quick questions</Chip>
              <Chip>About 2 minutes</Chip>
            </div>
            <div style={{ marginTop: 36 }}>
              <BigButton
                onClick={() => {
                  setPhase('learn')
                  setTimeout(() => speak(items[0].tamil), 250)
                  hear()
                }}
              >
                Start →
              </BigButton>
            </div>
          </div>
        )}

        {phase === 'learn' && word && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: 'var(--stone)', textTransform: 'uppercase' }}>
              Word {index + 1} of {items.length}
            </div>

            <div
              style={{
                background: 'var(--navy)',
                borderRadius: 24,
                padding: '30px 20px 26px',
                marginTop: 12,
                textAlign: 'center',
                boxShadow: 'var(--shadow-heavy)',
                borderTop: `5px solid ${pack.colour}`,
              }}
            >
              <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: word.tamil.length > 7 ? 46 : 60, color: '#fff', lineHeight: 1.25 }}>
                {word.tamil}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 20, color: 'var(--turmeric)', marginTop: 4 }}>{word.roman}</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <HearButton text={word.tamil} onPlay={hear} />
              </div>
            </div>

            <div style={{ minHeight: 120, marginTop: 18 }}>
              {revealed ? (
                <div style={{ animation: 'pageFade 180ms ease-out both' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: 'var(--stone)' }}>MEANS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: 1, color: 'var(--vermillion)', lineHeight: 1.05 }}>{word.english}</div>
                  {word.notes && <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--stone)', marginTop: 6, lineHeight: 1.45 }}>{word.notes}</p>}
                </div>
              ) : (
                <button
                  onClick={reveal}
                  className="tappable"
                  style={{
                    width: '100%',
                    background: 'var(--white)',
                    border: '2px dashed var(--stone-light)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '22px 16px',
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    letterSpacing: 1.5,
                    color: 'var(--navy)',
                  }}
                >
                  What does it mean? Tap to see
                </button>
              )}
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <BigButton onClick={nextWord} disabled={!revealed}>
                {index + 1 < items.length ? 'Next word →' : 'Quick check →'}
              </BigButton>
            </div>
          </div>
        )}

        {phase === 'check' && q && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: 'var(--stone)', marginBottom: 12 }}>
              QUICK CHECK · {qIndex + 1} OF {questions.length}
            </div>
            <QuizQuestion question={q} onAnswer={answer} disabled={selected !== null} selected={selected} />
            {encourage && (
              <>
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
                  <Say tamil={encourage.tamil} size={17} colour="var(--navy)" />
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--stone)', marginTop: 2 }}>{encourage.english}</div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                  <BigButton onClick={nextQuestion}>{qIndex + 1 < questions.length ? 'Next →' : 'Finish →'}</BigButton>
                </div>
              </>
            )}
          </div>
        )}

        {phase === 'done' && (
          <div style={{ color: '#fff', textAlign: 'center', paddingTop: 28 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 3, color: 'var(--turmeric)' }}>PACK {pack.number} COMPLETE</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, letterSpacing: 1.5, lineHeight: 1, margin: '8px 0 10px', fontWeight: 400, animation: 'levelUpStamp 400ms ease-out both' }}>
              {pack.english}
            </h1>
            <Say tamil={UI.wellDone.tamil} roman="shabash" size={28} colour="var(--turmeric)" button="light" buttonSize="sm" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.75)', marginTop: 14 }}>
              {items.length} new words, and you got {score} of {questions.length} in the check.
            </p>

            {/* The words you just learned */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              {items.map(w => (
                <span key={w.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '4px 6px 4px 12px' }}>
                  <span lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 15 }}>{w.tamil}</span>
                  <AudioButton text={w.tamil} size="xs" variant="light" />
                </span>
              ))}
            </div>

            {bonus !== null && (
              <div
                style={{
                  display: 'inline-block',
                  marginTop: 20,
                  background: 'var(--vermillion)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  letterSpacing: 2,
                  padding: '8px 20px',
                  borderRadius: 24,
                  animation: 'xpFloat 300ms 300ms ease-out both',
                }}
              >
                +{bonus} XP pack bonus
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 30 }}>
              {nextPack ? (
                <Link href={`/pack/${nextPack.id}`} className="tappable" style={bigLinkStyle}>
                  Next: {nextPack.english} →
                </Link>
              ) : (
                <Link href="/challenge" className="tappable" style={bigLinkStyle}>
                  All packs done. Try a challenge →
                </Link>
              )}
              <Link href="/" className="tappable" style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1.5, color: '#fff', textDecoration: 'none', padding: 10 }}>
                Back home
              </Link>
            </div>
          </div>
        )}
      </main>

      {phase === 'done' && <Confetti />}
      {rewardUI}
      <VictoryOverlay
        visible={victory !== null}
        tamil={victory?.tamil ?? ''}
        xpGained={victory?.xp ?? XP_VALUES.quiz_correct}
        isLevelUp={victory?.levelUp}
        levelName={victory?.levelName}
        levelNameEnglish={victory?.levelEnglish}
        onDismiss={dismissVictory}
      />
    </div>
  )
}

const bigLinkStyle = {
  background: 'var(--vermillion)',
  color: '#fff',
  borderRadius: 'var(--radius)',
  padding: '15px 30px',
  fontFamily: 'var(--font-display)',
  fontSize: 22,
  letterSpacing: 1.5,
  textDecoration: 'none',
  boxShadow: 'var(--shadow-heavy)',
} as const

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: '4px 12px' }}>
      {children}
    </span>
  )
}

function BigButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tappable"
      style={{
        background: disabled ? 'var(--cream-dark)' : 'var(--vermillion)',
        color: disabled ? 'var(--stone-light)' : '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        padding: '15px 30px',
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        letterSpacing: 1.5,
        boxShadow: disabled ? 'none' : 'var(--shadow-card)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 150ms ease-out',
      }}
    >
      {children}
    </button>
  )
}

/** Large pill play button with a label, for the main word on screen */
function HearButton({ text, onPlay }: { text: string; onPlay: () => void }) {
  const { speak, isSpeaking } = useSpeech()
  return (
    <button
      onClick={() => {
        speak(text)
        onPlay()
      }}
      className="tappable"
      aria-label="Hear it in Tamil"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        background: 'var(--vermillion)',
        color: '#fff',
        border: 'none',
        borderRadius: 30,
        padding: '12px 24px 12px 16px',
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        letterSpacing: 1.5,
        animation: isSpeaking ? 'audioPulse 600ms ease-out' : 'none',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
      </svg>
      Hear it
    </button>
  )
}
