'use client'
import Link from 'next/link'
import { Track, TRACKS, lessonsFor } from '@/data/lessons'
import { useLessons } from '@/hooks/useLessons'
import { useHydrated } from '@/lib/store'
import { PageHeader } from '@/components/ui/PageHeader'
import { NavBar } from '@/components/ui/NavBar'
import { AudioButton } from '@/components/ui/AudioButton'
import { TrackIcon } from './TrackIcon'

/** A track's lessons as a vertical poster-style path. Nothing is locked. */
export function TrackPage({ track }: { track: Track }) {
  const info = TRACKS[track]
  const list = lessonsFor(track)
  const hydrated = useHydrated()
  const { isComplete, nextLesson, countDone } = useLessons()
  const done = hydrated ? countDone(track) : 0
  const current = hydrated ? nextLesson(track) : list[0]

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>
      <PageHeader title={info.english} tamil={info.tamil} roman={info.roman} subtitle={info.tagline}>
        <div aria-hidden style={{ position: 'absolute', right: 18, top: 'calc(18px + env(safe-area-inset-top))', color: info.colour, opacity: 0.9 }}>
          <TrackIcon track={track} size={44} />
        </div>
        <div style={{ marginTop: 14, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
            <span>
              {done} OF {list.length} DONE
            </span>
            {done === list.length && <span style={{ color: 'var(--turmeric)' }}>TRACK COMPLETE</span>}
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
            <div style={{ width: `${(done / list.length) * 100}%`, height: '100%', background: info.colour, borderRadius: 4, transition: 'width 600ms ease-out' }} />
          </div>
        </div>
      </PageHeader>

      <main style={{ padding: '22px 16px 0', position: 'relative' }}>
        {/* The line joining the stops */}
        <div aria-hidden style={{ position: 'absolute', left: 37, top: 40, bottom: 30, width: 4, borderRadius: 2, background: 'repeating-linear-gradient(to bottom, var(--cream-dark) 0 10px, transparent 10px 18px)' }} />

        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, position: 'relative' }}>
          {list.map((l, i) => {
            const finished = hydrated && isComplete(track, l.id)
            const isCurrent = current?.id === l.id
            return (
              <li key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, animation: `stampIn 180ms ${Math.min(i, 10) * 50}ms ease-out backwards` }}>
                {/* Stop */}
                <div
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: 46,
                    height: 46,
                    marginTop: isCurrent ? 14 : 8,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    background: finished ? 'var(--navy)' : isCurrent ? info.colour : 'var(--white)',
                    color: finished ? 'var(--turmeric)' : isCurrent ? (track === 'read' ? 'var(--navy)' : '#fff') : 'var(--stone)',
                    border: finished || isCurrent ? 'none' : '2px solid var(--cream-dark)',
                    boxShadow: isCurrent ? `0 0 0 6px ${info.colour}33` : 'none',
                  }}
                >
                  {finished ? '✓' : l.number}
                </div>

                {/* Card */}
                <div
                  className="chunky"
                  style={{
                    ['--edge' as string]: finished ? '#0D1024' : isCurrent ? info.colour : 'var(--cream-dark)',
                    flex: 1,
                    minWidth: 0,
                    position: 'relative',
                    background: finished ? 'var(--navy)' : 'var(--white)',
                    color: finished ? '#fff' : 'var(--navy)',
                    border: isCurrent ? `2.5px solid ${info.colour}` : finished ? '2px solid var(--navy)' : '2px solid var(--cream-dark)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}
                >
                  <Link
                    href={`/lesson/${track}/${l.id}`}
                    className="tappable"
                    aria-label={`${info.english} ${l.number}: ${l.english}${finished ? ', done' : ''}`}
                    style={{ display: 'block', padding: isCurrent ? '16px 16px 14px' : '12px 16px', paddingRight: 56, textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: isCurrent ? 26 : 20, letterSpacing: 1, lineHeight: 1.1 }}>{l.english}</div>
                    <div lang="ta" style={{ fontFamily: 'var(--font-tamil)', fontSize: 14, opacity: 0.7, marginTop: 2 }}>
                      {l.tamil} · <em style={{ fontFamily: 'var(--font-body)' }}>{l.roman}</em>
                    </div>
                    {isCurrent && <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--stone)', marginTop: 6, lineHeight: 1.4 }}>{l.blurb}</p>}
                    {l.hint && !finished && <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 12, color: info.ink, marginTop: 4 }}>{l.hint}</div>}
                    {isCurrent && (
                      <span className="btn-primary" style={{ marginTop: 12, fontSize: 18, padding: '8px 18px', borderRadius: 20 }}>
                        {done === 0 ? 'Start →' : 'Continue →'}
                      </span>
                    )}
                  </Link>
                  <div style={{ position: 'absolute', top: isCurrent ? 14 : 10, right: 12 }}>
                    <AudioButton text={l.tamil} size="sm" variant={finished ? 'light' : 'ghost'} label={`Hear ${l.roman}`} />
                  </div>
                  {finished && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 8,
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                        letterSpacing: 2,
                        color: 'var(--turmeric)',
                        border: '2px solid var(--turmeric)',
                        borderRadius: 6,
                        padding: '1px 8px',
                        transform: 'rotate(-8deg)',
                        opacity: 0.9,
                      }}
                    >
                      DONE
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </main>
      <NavBar />
    </div>
  )
}
