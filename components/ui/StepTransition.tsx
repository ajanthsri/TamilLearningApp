import { CSSProperties, ReactNode } from 'react'

interface Props {
  /** Changing this replays the slide */
  stepKey: string | number
  direction?: 'forward' | 'back'
  children: ReactNode
  style?: CSSProperties
}

/**
 * Slides each new step in: from the right going forward, from the left going back.
 * Do not put position: fixed elements inside; the transform would trap them.
 */
export function StepTransition({ stepKey, direction = 'forward', children, style }: Props) {
  return (
    <div
      key={stepKey}
      style={{
        animation: `${direction === 'back' ? 'slideInLeft' : 'slideInRight'} 240ms ease-out backwards`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
