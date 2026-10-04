'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', labelTamil: 'வீடு', label: 'Home' },
  { href: '/learn', labelTamil: 'கற்க', label: 'Learn' },
  { href: '/challenge', labelTamil: 'தேர்வு', label: 'Challenge' },
  { href: '/write', labelTamil: 'எழுது', label: 'Write' },
  { href: '/progress', labelTamil: 'நிலை', label: 'Stats' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--navy)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      {NAV.map(item => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className="tappable"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '9px 2px 8px',
              minHeight: 56,
              textDecoration: 'none',
              gap: 4,
              borderTop: active ? '3px solid var(--vermillion)' : '3px solid transparent',
              transition: 'border-color 120ms ease-out',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 17,
                letterSpacing: 1,
                lineHeight: 1,
                color: active ? 'var(--turmeric)' : 'rgba(255,255,255,0.7)',
              }}
            >
              {item.label}
            </span>
            <span
              lang="ta"
              style={{
                fontFamily: 'var(--font-tamil)',
                fontSize: 11,
                whiteSpace: 'nowrap',
                color: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
                lineHeight: 1.2,
              }}
            >
              {item.labelTamil}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
