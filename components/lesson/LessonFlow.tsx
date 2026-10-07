'use client'
import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lesson, LessonItem, TRACKS, lessonsFor } from '@/data/lessons'
import { words } from '@/data/words'
import { letters } from '@/data/letters'
import { ENCOURAGE, UI } from '@/data/copy'
import { XP_VALUES, QuizQuestion as Q } from '@/types'
import { useProgress } from '@/hooks/useProgress'
import { useXP } from '@/hooks/useXP'
import { useLessons } from '@/hooks/useLessons'
import { useSpeech } from '@/hooks/useSpeech'
import { letterQuestion, shapeQuestion, wordQuestion } from '@/hooks/useQuiz'
import { pickRandom, shuffle } from '@/lib/store'
import { playFanfare } from '@/lib/sfx'
import { useReward } from '@/components/ui/Reward'
import { CloseButton } from '@/components/ui/PageHeader'
import { Say } from '@/components/ui/Say'
import { AudioButton } from '@/components/ui/AudioButton'
import { VictoryOverlay } from '@/components/ui/VictoryOverlay'
import { QuizQuestion } from '@/components/challenge/QuizQuestion'
import { Confetti } from '@/components/ui/Confetti'
import { TrackIcon } from './TrackIcon'

type Phase = 'intro' | 'learn' | 'check' | 'done'
type Victory = { tamil: string; xp: number; levelUp: boolean; levelName: string; levelEnglish: string }

// What one learn screen shows, resolved from the lesson item
type Card = {
  kind: 'word' | 'letter'
  id: number
  tamil: string
  roman: string
  english: string
  notes?: string
  example?: { tamil: string; roman: string; english: string }
}

function resolve(item: LessonItem): Card | null {
  if (item.kind === 'word') {
    const w = words.find(x => x.id === item.id)
    return w ? { kind: 'word', id: w.id, tamil: w.tamil, roman: w.roman, english: w.english, notes: w.notes } : null
  }
  const l = letters.find(x => x.id === item.id)
  return l ? { kind: 'letter', id: l.id, tamil: l.tamil, roman: l.roman, english: `Sounds like “${l.roman}”`, example: l.example } : null
}

function buildCheck(lesson: Lesson): Q[] {
  const ids = shuffle(lesson.items.map(i => i.id)).slice(0, lesson.checkCount)
  return ids
    .map((id, i) =>
      lesson.check === 'meaning'
        ? wordQuestion(id, i, !lesson.showRoman)
        : lesson.check === 'sound'
          ? letterQuestion(id, i)
          : shapeQuestion(id, i),
    )
    .filter((q): q is Q => q !== null)
}

export function LessonFlow({ lesson }: { lesson: Lesson }) {
  const router = useRouter()
  const track = TRACKS[lesson.track]
  const cards = useMemo(() => lesson.items.map(resolve).filter((c): c is Card => c !== null), [lesson])
  const siblings = lessonsFor(lesson.track)
  const nextInTrack = siblings.find(l => l.number === lesson.number + 1) ?? null
  // Reading practice: let them try first, don't say the word for them
  const autoSay = lesson.showRoman

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
  const { complete, setLastTrack } = useLessons()
  const { reward, rewardUI } = useReward()
  const { speak } = useSpeech()

  const leave = () => router.push(`/${lesson.track}`)
  const module = (c: Card) => (c.kind === 'word' ? 'words' : 'letters') as 'words' | 'letters'

  // ── Learn ────────────────────────────────────────────────
  const card = cards[index]

  const heard = (c: Card) => {
    markSeen(module(c), c.id)
    reward('card_heard', `${module(c)}:${c.id}`, c.tamil)
  }
  const reveal = () => {
    setRevealed(true)
    markSeen(module(card), card.id)
    reward('meaning_revealed', `${module(card)}:${card.id}`, card.tamil)
  }
  const start = () => {
    setLastTrack(lesson.track)
    setPhase('learn')
    if (autoSay) {
      setTimeout(() => speak(cards[0].tamil), 250)
      heard(cards[0])
    }
  }
  const nextCard = () => {
    setRevealed(false)
    if (index + 1 < cards.length) {
      const next = cards[index + 1]
      setIndex(index + 1)
      if (autoSay) {
        setTimeout(() => speak(next.tamil), 200)
        heard(next)
      }
    } else {
      setQuestions(buildCheck(lesson))
      setQIndex(0)
      setSelected(null)
      setScore(0)
      setEncourage(null)
      setPhase('check')
    }
  }

  // ── Check ────────────────────────────────────────────────
  const q = questions[qIndex]

  const answer = (opt: string) => {
    if (!q || selected !== null) return
    setSelected(opt)
    if (opt === q.correct) {
      setScore(s => s + 1)
      markPractised(q.module, q.itemId)
      const r = addXP('quiz_correct')
      advanceAfterVictory.current = true
      setVictory({
        tamil: q.type === 'shape' ? q.correct : q.prompt,
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
    complete(lesson.track, lesson.id)
    const r = addXPOnce('pack_completed', lesson.xpTag)
    setBonus(r ? r.gained : null)
    if (r?.leveledUp) {
      advanceAfterVictory.current = false
      setVictory({ tamil: lesson.tamil, xp: r.gained, levelUp: true, levelName: r.newLevel.tamil, levelEnglish: `${r.newLevel.roman} · ${r.newLevel.english}` })
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
  const dark = phase === 'intro' || phase === 'done'
  const stepTotal = cards.length + questions.length || cards.length + lesson.checkCount
  const step =
    phase === 'intro' ? 0 : phase === 'learn' ? index + (revealed ? 1 : 0.5) : phase === 'check' ? cards.length + qIndex + (selected ? 1 : 0) : stepTotal
  const itemNoun = cards[0]?.kind === 'letter' ? 'letters' : 'words'

  return (
    <div style={{ minHeight: '100dvh', background: dark ? 'var(--navy)' : 'var(--cream)', transition: 'background 200ms ease-out' }}>
      {/* Top bar: close, progress, where you are */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 'calc(12px + env(safe-area-inset-top)) 16px 12px',
          background: dark ? 'var(--navy)' : 'var(--cream)',
        }}
      >
        <CloseButton onClick={leave} label={`Leave lesson and go back to ${track.english}`} dark={dark} />
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: dark ? 'rgba(255,255,255,0.12)' : 'var(--cream-dark)', overflow: 'hidden' }}>
          <div style={{ width: `${(step / stepTotal) * 100}%`, height: '100%', background: `linear-gradient(90deg, var(--vermillion), var(--turmeric))`, borderRadius: 4, transition: 'width 300ms ease-out' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 1, color: dark ? 'rgba(255,255,255,0.6)' : 'var(--stone)', whiteSpace: 'nowrap' }}>
          {track.english} {lesson.number}/{siblings.length}
        </span>
      </div>

      <main
        key={`${phase}-${index}-${qIndex}`}
        style={{ animation: 'slideInRight 240ms ease-out backwards', padding: '8px 20px calc(32px + env(safe-area-inset-bottom))', maxWidth: 480, margin: '0 auto' }}
      >
        {phase === 'intro' && (
          <div style={{ color: '#fff', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 3, color: track.colour }}>
              <TrackIcon track={lesson.track} size={22} />
              {track.english.toUpperCase()} · {lesson.number}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, letterSpacing: 1.5, lineHeight: 1, margin: '8px 0 12px', fontWeight: 400 }}>{lesson.english}</h1>
            <Say tamil={lesson.tamil} roman={lesson.roman} size={24} colour="var(--turmeric)" button="light" buttonSize="sm" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginTop: 18 }}>{lesson.blurb}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
              <Chip>
                {cards.length} {itemNoun}
              </Chip>
              <Chip>{lesson.checkCount} quick questions</Chip>
              <Chip>About 2 minutes</Chip>
            </div>
            {!lesson.showRoman && (
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--turmeric)', marginTop: 16 }}>
                No romanisation in this one. Read the Tamil, then tap Hear it to check.
              </p>
            )}
            <div style={{ marginTop: 32 }}>
              <BigButton onClick={start}>Start →</BigButton>
            </div>
          </div>
        )}

        {phase === 'learn' && card && (
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: 'var(--stone)', textTransform: 'uppercase' }}>
              {card.kind === 'letter' ? 'Letter' : 'Word'} {index + 1} of {cards.length}
            </div>

            <div
              style={{
                background: 'var(--navy)',
                borderRadius: 24,
                padding: '30px 20px 26px',
                marginTop: 12,
                textAlign: 'center',
                boxShadow: 'var(--shadow-heavy)',
                borderTop: `5px solid ${lesson.colour}`,
              }}
            >
              <div lang="ta" style={{ fontFamily: 'var(--font-tamil-learn)', fontSize: card.kind === 'letter' ? 96 : card.tamil.length > 7 ? 46 : 60, color: '#fff', lineHeight: 1.2 }}>
                {card.tamil}
              </div>
              {lesson.showRoman || revealed ? (
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 22, color: 'var(--turmeric)', marginTop: 4, animation: 'pageFade 160ms ease-out both' }}>
                  {card.roman}
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Try reading it out loud first</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <HearButton text={card.tamil} onPlay={() => heard(card)} />
              </div>
            </div>

            <div style={{ minHeight: 120, marginTop: 18 }}>
              {revealed ? (
                <div style={{ animation: 'pageFade 180ms ease-out both' }}>
                  {card.kind === 'word' ? (
                    <>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: 'var(--stone)' }}>MEANS</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: 1, color: 'var(--vermillion)', lineHeight: 1.05 }}>{card.english}</div>
                      {card.notes && <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--stone)', marginTop: 6, lineHeight: 1.45 }}>{card.notes}</p>}
                    </>
                  ) : (
                    <>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, color: 'var(--stone)' }}>SOUNDS LIKE</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 40, color: 'var(--vermillion)', lineHeight: 1.1 }}>“{card.roman}”</div>
                      {card.example && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, background: 'var(--white)', border: '1.5px solid var(--cream-dark)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--stone)' }}>As in</span>
                          <Say tamil={card.example.tamil} roman={card.example.roman} size={20} colour="var(--navy)" />
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 1, color: 'var(--navy)', marginLeft: 'auto' }}>{card.example.english}</span>
                        </div>
                      )}
                    </>
                  )}
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
                  {card.kind === 'letter' ? 'What sound is it? Tap to see' : lesson.showRoman ? 'What does it mean? Tap to see' : 'What does it say? Tap to see'}
                </button>
              )}
            </div>

            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <BigButton onClick={nextCard} disabled={!revealed}>
                {index + 1 < cards.length ? `Next ${card.kind} →` : 'Quick check →'}
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
                  style={{ marginTop: 16, background: 'var(--white)', borderLeft: '4px solid var(--error-soft)', borderRadius: 'var(--radius)', padding: '12px 14px', animation: 'pageFade 160ms ease-out both' }}
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 3, color: 'var(--turmeric)' }}>
              <TrackIcon track={lesson.track} size={20} />
              {track.english.toUpperCase()} {lesson.number} COMPLETE
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: lesson.english.length > 14 ? 48 : 60, letterSpacing: 1.5, lineHeight: 1, margin: '8px 0 10px', fontWeight: 400, animation: 'levelUpStamp 400ms ease-out both' }}>
              {lesson.english}
            </h1>
            <Say tamil={UI.wellDone.tamil} roman="shabash" size={28} colour="var(--turmeric)" button="light" buttonSize="sm" />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'rgba(255,255,255,0.75)', marginTop: 14 }}>
              {cards.length} {itemNoun}, and you got {score} of {questions.length} in the check.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              {cards.map(c => (
                <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '4px 6px 4px 12px' }}>
                  <span lang="ta" style={{ fontFamily: 'var(--font-tamil-learn)', fontSize: 15 }}>
                    {c.tamil}
                  </span>
                  <AudioButton text={c.tamil} size="xs" variant="light" />
                </span>
              ))}
            </div>

            {bonus !== null && (
              <div style={{ display: 'inline-block', marginTop: 20, background: 'var(--vermillion)', fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, padding: '8px 20px', borderRadius: 24, animation: 'xpFloat 300ms 300ms ease-out both' }}>
                +{bonus} XP lesson bonus
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 30 }}>
              {nextInTrack ? (
                <Link href={`/lesson/${nextInTrack.track}/${nextInTrack.id}`} className="btn-primary" style={bigLinkStyle}>
                  Next: {nextInTrack.english} →
                </Link>
              ) : (
                <Link href="/" className="btn-primary" style={bigLinkStyle}>
                  {track.english} track done. Home →
                </Link>
              )}
              <Link href={`/${lesson.track}`} className="tappable" style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1.5, color: '#fff', textDecoration: 'none', padding: 10 }}>
                Back to {track.english}
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

const bigLinkStyle = { padding: '15px 30px', fontSize: 22 } as const

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 16, padding: '4px 12px' }}>
      {children}
    </span>
  )
}

function BigButton({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-primary" style={{ padding: '15px 30px', fontSize: 22 }}>
      {children}
    </button>
  )
}

/** Large pill play button with a label, for the main item on screen */
function HearButton({ text, onPlay }: { text: string; onPlay: () => void }) {
  const { speak, isSpeaking } = useSpeech()
  return (
    <button
      onClick={() => {
        speak(text)
        onPlay()
      }}
      className="btn-primary"
      aria-label="Hear it in Tamil"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 30,
        padding: '12px 24px 12px 16px',
        fontSize: 20,
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
