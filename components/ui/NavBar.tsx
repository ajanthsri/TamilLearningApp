'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',          labelTamil: 'வீடு',  label: 'Home'      },
  { href: '/learn',     labelTamil: 'கற்க',  label: 'Learn'     },
  { href: '/challenge', labelTamil: 'தேர்வு', label: 'Challenge' },
  { href: '/write',     labelTamil: 'எழுது', label: 'Write'     },
  { href: '/progress',  labelTamil: 'முன்னேற்றம்', label: 'Progress' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--navy)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'stretch',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100,
    }}>
      {NAV.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px',
              textDecoration: 'none',
              gap: 3,
              borderTop: active ? '2px solid var(--vermillion)' : '2px solid transparent',
              transition: 'border-color 120ms',
            }}
            className="tappable"
          >
            <span style={{
              fontFamily: 'var(--font-tamil)',
              fontSize: active ? 16 : 14,
              color: active ? 'var(--turmeric)' : 'rgba(255,255,255,0.4)',
              lineHeight: 1,
              transition: 'font-size 120ms, color 120ms',
            }}>
              {item.labelTamil}
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: active ? 'var(--vermillion)' : 'rgba(255,255,255,0.25)',
            }}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
