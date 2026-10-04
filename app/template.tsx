// Next re-mounts this on every navigation, so each page fades in.
// Opacity only: a transform here would break position: fixed (nav, overlays).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div style={{ animation: 'routeFade 200ms ease-out backwards' }}>{children}</div>
}
