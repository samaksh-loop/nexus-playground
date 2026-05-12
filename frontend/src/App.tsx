import { useEffect, useState } from 'react'
import './App.css'

type Health = { ok: boolean; service: string }

function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/health')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<Health>
      })
      .then((data) => {
        if (!cancelled) {
          setHealth(data)
          setError(null)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setHealth(null)
          setError(e instanceof Error ? e.message : 'Request failed')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="shell">
      <header className="header">
        <h1>Nexus Playground</h1>
        <p className="tagline">Vendor webhook diagnostics (local)</p>
      </header>

      <section className="panel" aria-live="polite">
        <h2>Backend</h2>
        {health && (
          <p className="ok">
            Connected — <code>{health.service}</code>
          </p>
        )}
        {error && (
          <p className="err">
            Not reachable ({error}). Run{' '}
            <code>npm run dev</code> in <code>backend/</code> (port 3001).
          </p>
        )}
        {!health && !error && <p className="muted">Checking…</p>}
      </section>
    </main>
  )
}

export default App
