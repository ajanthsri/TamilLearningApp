import { Character, HairStyle } from '@/data/avatars'

interface Props {
  character: Character
  /** XP level 1–5. The avatar grows up as this rises. */
  level: number
  size?: number
  title?: string
}

const FRAME = ['#B5A898', '#CD7F32', '#C9CED6', '#F5A623', '#F5A623']
const HAIR_DARK = '#1E1717'
const HAIR_GREY = '#C8C3BC'

/**
 * Poster-style avatar drawn in SVG.
 * 1 child · 2 student (collar, book) · 3 young adult (scarf) ·
 * 4 speaker (speech bubble) · 5 elder (grey hair, glasses, jasmine garland)
 */
export function Avatar({ character: c, level, size = 72, title }: Props) {
  const lv = Math.min(5, Math.max(1, level))
  const child = lv === 1
  const elder = lv === 5

  // Geometry
  const cx = 60
  const r = child ? 27 : 25
  const cy = child ? 58 : 52
  const shoulderW = child ? 26 : 34
  const bodyTop = cy + r + (child ? 2 : 5)
  const hair = elder ? HAIR_GREY : HAIR_DARK
  const clip = `clip-${c.id}-${lv}`

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={title ?? `${c.name} avatar`}>
      <defs>
        <clipPath id={clip}>
          <circle cx="60" cy="60" r="56" />
        </clipPath>
      </defs>

      {/* Backdrop with poster sunburst */}
      <circle cx="60" cy="60" r="58" fill={c.backdrop} />
      <g clipPath={`url(#${clip})`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={i}
            d="M60 60 L54 -10 L66 -10 Z"
            fill={c.outfit}
            opacity={0.18}
            transform={`rotate(${i * 30} 60 60)`}
          />
        ))}

        {/* Long hair sits behind the head and shoulders */}
        <BackHair style={c.hair} cx={cx} cy={cy} r={r} colour={hair} child={child} />

        {/* Body */}
        <path
          d={`M${cx - shoulderW - 6} 124 Q${cx - shoulderW} ${bodyTop + 2} ${cx} ${bodyTop} Q${cx + shoulderW} ${bodyTop + 2} ${cx + shoulderW + 6} 124 Z`}
          fill={c.outfit}
        />
        {/* Neck */}
        <rect x={cx - 5} y={cy + r - 6} width="10" height="12" rx="4" fill={c.skin} />

        {/* Level 2: school collar */}
        {lv === 2 && (
          <path d={`M${cx - 11} ${bodyTop + 1} L${cx} ${bodyTop + 12} L${cx + 11} ${bodyTop + 1}`} fill="#FDFAF4" stroke="#FDFAF4" strokeWidth="2" strokeLinejoin="round" />
        )}
        {/* Level 3+: scarf over one shoulder */}
        {lv >= 3 && !elder && (
          <path d={`M${cx - shoulderW + 4} ${bodyTop + 6} L${cx + 6} ${bodyTop + 30} L${cx + 16} ${bodyTop + 30} L${cx - shoulderW + 14} ${bodyTop + 2} Z`} fill="#F5A623" opacity="0.9" />
        )}

        {/* Head */}
        <circle cx={cx} cy={cy} r={r} fill={c.skin} />
        {/* Ears */}
        <circle cx={cx - r + 1} cy={cy + 3} r="4" fill={c.skin} />
        <circle cx={cx + r - 1} cy={cy + 3} r="4" fill={c.skin} />

        <FrontHair style={c.hair} cx={cx} cy={cy} r={r} colour={hair} />

        {/* Face */}
        <circle cx={cx - 9} cy={cy + 3} r={child ? 3 : 2.3} fill="#1A1F3C" />
        <circle cx={cx + 9} cy={cy + 3} r={child ? 3 : 2.3} fill="#1A1F3C" />
        {child && (
          <>
            <circle cx={cx - 13} cy={cy + 10} r="3.5" fill="#E8A090" opacity="0.6" />
            <circle cx={cx + 13} cy={cy + 10} r="3.5" fill="#E8A090" opacity="0.6" />
          </>
        )}
        <path d={`M${cx - 6} ${cy + 11} Q${cx} ${cy + 16} ${cx + 6} ${cy + 11}`} stroke="#1A1F3C" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Level 5: glasses and jasmine garland */}
        {elder && (
          <>
            <g stroke="#1A1F3C" strokeWidth="1.6" fill="none">
              <circle cx={cx - 9} cy={cy + 3} r="5.5" />
              <circle cx={cx + 9} cy={cy + 3} r="5.5" />
              <path d={`M${cx - 2.5} ${cy + 3} L${cx + 2.5} ${cy + 3}`} />
            </g>
            {Array.from({ length: 9 }).map((_, i) => {
              const t = (i / 8) * Math.PI
              const x = cx - Math.cos(t) * 20
              const y = bodyTop + 2 + Math.sin(t) * 14
              return <circle key={i} cx={x} cy={y} r="3.2" fill={i % 2 ? '#F5A623' : '#FDFAF4'} />
            })}
          </>
        )}
      </g>

      {/* Level 2: a book held up */}
      {lv === 2 && (
        <g transform="translate(78 82) rotate(-12)">
          <rect width="20" height="15" rx="2" fill="#FDFAF4" />
          <rect x="9" width="2" height="15" fill="#C1272D" />
        </g>
      )}

      {/* Level 4: speech bubble */}
      {lv === 4 && (
        <g>
          <path d="M80 10 h26 a6 6 0 0 1 6 6 v12 a6 6 0 0 1 -6 6 h-14 l-6 6 v-6 h-6 a6 6 0 0 1 -6 -6 v-12 a6 6 0 0 1 6 -6 z" fill="#FDFAF4" />
          <text x="93" y="27" textAnchor="middle" fontSize="13" fill="#C1272D" fontFamily="'Tiro Tamil', 'Noto Sans Tamil', serif">அ</text>
        </g>
      )}

      {/* Frame: bronze, silver, gold as you level up */}
      <circle cx="60" cy="60" r="57" fill="none" stroke={FRAME[lv - 1]} strokeWidth={lv >= 4 ? 4 : 3} />
      {elder && <circle cx="60" cy="60" r="52" fill="none" stroke="#F5A623" strokeWidth="1" opacity="0.6" />}
    </svg>
  )
}

function BackHair({ style, cx, cy, r, colour, child }: { style: HairStyle; cx: number; cy: number; r: number; colour: string; child: boolean }) {
  if (style === 'long') {
    return <rect x={cx - r - 4} y={cy - r + 2} width={(r + 4) * 2} height={r * 2 + (child ? 12 : 22)} rx={r} fill={colour} />
  }
  if (style === 'braid') {
    return (
      <g fill={colour}>
        <circle cx={cx} cy={cy} r={r + 3} />
        {[0, 1, 2, 3].map(i => (
          <ellipse key={i} cx={cx + r - 2} cy={cy + r - 2 + i * 9} rx="5" ry="6" />
        ))}
        <circle cx={cx + r - 2} cy={cy + r + 34} r="3" fill="#C1272D" />
      </g>
    )
  }
  if (style === 'ponytail') {
    return (
      <g fill={colour}>
        <circle cx={cx} cy={cy} r={r + 3} />
        <ellipse cx={cx + r + 6} cy={cy - 2} rx="9" ry="16" transform={`rotate(20 ${cx + r + 6} ${cy - 2})`} />
      </g>
    )
  }
  if (style === 'bun') {
    return (
      <g fill={colour}>
        <circle cx={cx} cy={cy} r={r + 3} />
        <circle cx={cx} cy={cy - r - 4} r={r * 0.48} />
      </g>
    )
  }
  if (style === 'curly') {
    return (
      <g fill={colour}>
        {Array.from({ length: 11 }).map((_, i) => {
          const t = Math.PI + (i / 10) * Math.PI
          return <circle key={i} cx={cx + Math.cos(t) * (r + 1)} cy={cy - 2 + Math.sin(t) * (r + 1)} r="8" />
        })}
      </g>
    )
  }
  return <circle cx={cx} cy={cy - 1} r={r + 2.5} fill={colour} />
}

function FrontHair({ style, cx, cy, r, colour }: { style: HairStyle; cx: number; cy: number; r: number; colour: string }) {
  // A cap of hair over the forehead; shape varies slightly by style
  const dip = style === 'short' || style === 'curly' ? 0.42 : 0.3
  const side = style === 'long' || style === 'braid' ? 6 : 2
  return (
    <path
      d={`M${cx - r - 1} ${cy + side} A${r + 1} ${r + 1} 0 0 1 ${cx + r + 1} ${cy + side} L${cx + r - 3} ${cy - 3} Q${cx + 4} ${cy - r * dip} ${cx - 2} ${cy - r * 0.62} Q${cx - r * 0.7} ${cy - r * dip} ${cx - r + 3} ${cy - 3} Z`}
      fill={colour}
    />
  )
}
