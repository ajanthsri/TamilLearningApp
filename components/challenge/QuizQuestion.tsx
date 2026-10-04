'use client'
import { useEffect } from 'react'
import { QuizQuestion as Q } from '@/types'
import { AudioButton } from '@/components/ui/AudioButton'
import { useSpeech } from '@/hooks/useSpeech'

export const NOT_SURE = '__not_sure__'

interface Props {
  question: Q
  onAnswer: (answer: string) => void
  disabled: boolean
  /** The option the user tapped, once they have answered */
  selected: string | null
  showNotSure?: boolean
  autoPlay?: boolean
  dark?: boolean
}

const LABEL: Record<Q['type'], string> = {
  word: 'What does this mean?',
  letter: 'What sound does this letter make?',
  shape: 'Which letter makes this sound?',
}

export function QuizQuestion({ question, onAnswer, disabled, selected, showNotSure, autoPlay, dark }: Props) {
  const { speak, isAvailable } = useSpeech()
  const isShape = question.type === 'shape'
  // What the play button says: the Tamil on screen, or for 'shape' the letter being asked for
  const audioText = isShape ? question.correct : question.prompt

  useEffect(() => {
    if (autoPlay && isAvailable) {
      const t = setTimeout(() => speak(audioText), 250)
      return () => clearTimeout(t)
    }
  }, [question.id, autoPlay, isAvailable, speak, audioText])

  const answered = selected !== null
  const ink = dark ? '#fff' : 'var(--navy)'
  const muted = dark ? 'rgba(255,255,255,0.55)' : 'var(--stone)'

  const optionStyle = (opt: string) => {
    const isCorrect = opt === question.correct
    const isPicked = opt === selected
    let background = dark ? 'rgba(255,255,255,0.04)' : 'var(--white)'
    let border = dark ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid var(--navy)'
    let color = ink
    let animation = 'none'
    if (answered && isCorrect) {
      background = 'var(--turmeric)'
      border = '1.5px solid var(--turmeric)'
      color = 'var(--navy)'
      animation = 'popIn 260ms ease-out'
    } else if (answered && isPicked) {
      background = 'var(--error-soft)'
      border = '1.5px solid var(--error-soft)'
      color = 'var(--navy)'
      animation = 'nudge 320ms ease-in-out'
    } else if (answered) {
      color = muted
    }
    return { background, border, color, animation }
  }

  return (
    <div key={question.id} style={{ animation: 'slideInRight 240ms ease-out backwards' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: muted, marginBottom: 12 }}>
        {LABEL[question.type]}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: dark ? 'rgba(255,255,255,0.05)' : 'var(--navy)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 20px',
          marginBottom: 18,
        }}
      >
        <div style={{ minWidth: 0 }}>
          {isShape ? (
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 56, color: 'var(--turmeric)', lineHeight: 1.1 }}>
              “{question.prompt}”
            </div>
          ) : (
            <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: question.type === 'letter' ? 64 : 40, color: 'var(--turmeric)', lineHeight: 1.2 }}>
              {question.prompt}
            </div>
          )}
          {!question.hideRoman && (
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>{question.promptRoman}</div>
          )}
        </div>
        <AudioButton text={audioText} size="lg" label={isShape ? 'Hear the sound' : undefined} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isShape ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
        {question.options.map(opt => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            disabled={disabled}
            className="chunky"
            lang={isShape ? 'ta' : undefined}
            aria-label={isShape ? `Letter ${opt}` : undefined}
            style={{
              ...optionStyle(opt),
              ['--edge' as string]: answered ? 'transparent' : dark ? 'rgba(0,0,0,0.45)' : 'var(--navy)',
              borderRadius: 'var(--radius)',
              padding: isShape ? 0 : '14px 10px',
              minHeight: isShape ? 72 : 56,
              fontFamily: isShape ? 'var(--font-tamil)' : 'var(--font-body)',
              fontSize: isShape ? 34 : question.type === 'letter' ? 22 : 15,
              fontStyle: question.type === 'letter' ? 'italic' : 'normal',
              lineHeight: 1.25,
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {showNotSure && (
        <button
          onClick={() => onAnswer(NOT_SURE)}
          disabled={disabled}
          className="tappable"
          style={{
            width: '100%',
            marginTop: 10,
            background: 'none',
            border: dark ? '1.5px dashed rgba(255,255,255,0.25)' : '1.5px dashed var(--stone-light)',
            borderRadius: 'var(--radius)',
            padding: '12px',
            fontFamily: 'var(--font-body)',
            fontStyle: 'italic',
            fontSize: 14,
            color: selected === NOT_SURE ? (dark ? '#fff' : 'var(--navy)') : muted,
            cursor: disabled ? 'default' : 'pointer',
          }}
        >
          Not sure
        </button>
      )}
    </div>
  )
}
