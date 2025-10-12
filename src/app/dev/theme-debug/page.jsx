'use client'

import { useEffect, useState } from 'react'

export default function ThemeDebugPage() {
  const [vars, setVars] = useState({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    setVars({
      background: cs.getPropertyValue('--background').trim(),
      foreground: cs.getPropertyValue('--foreground').trim(),
      card: cs.getPropertyValue('--card').trim(),
    })
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Theme debug</h1>
      <p className="mb-2">
        Computed CSS variables from <code>document.documentElement</code>:
      </p>
      <pre className="bg-dark-secondary border border-dark-border rounded p-4">
        {JSON.stringify(vars, null, 2)}
      </pre>
      <p className="mt-4">
        Also check document.documentElement.classList:{' '}
        <strong>
          {typeof window !== 'undefined'
            ? document.documentElement.className
            : 'server'}
        </strong>
      </p>
    </main>
  )
}
