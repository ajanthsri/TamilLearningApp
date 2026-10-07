import type { Metadata, Viewport } from 'next'
import '@fontsource/tiro-tamil/400.css'
import '@fontsource/noto-sans-tamil/400.css'
import '@fontsource/noto-sans-tamil/500.css'
import '@fontsource/noto-sans-tamil/600.css'
import '@fontsource/bebas-neue/400.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/400-italic.css'
import '@fontsource/lora/600.css'
import './globals.css'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

export const metadata: Metadata = {
  title: 'தமிழ் — Learn Tamil',
  description:
    'Learn Tamil through the alphabet, everyday words, real phrases, and the spirit of Tamil cinema. Free, no sign-up, made for the diaspora.',
  openGraph: {
    title: 'தமிழ் — Learn Tamil',
    description: 'Learning Tamil, the way it was always meant to be shared.',
    locale: 'en_GB',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1A1F3C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
