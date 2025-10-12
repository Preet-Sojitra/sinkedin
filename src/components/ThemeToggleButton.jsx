'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

function getInitialTheme() {
  try {
    const t = localStorage.getItem('theme')
    if (t === 'light' || t === 'dark') return t
  } catch (e) {
    // ignore
  }
  // fall back to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return 'dark'
}

export default function ThemeToggleButton() {
  // start with null on server to avoid rendering different markup than client
  const [theme, setTheme] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Resolve initial theme in the browser to avoid SSR/CSR mismatches
    let initial = null
    try {
      const cookieMatch = document.cookie.match(/(?:^|;\s*)theme=([^;]+)/)
      if (cookieMatch) initial = cookieMatch[1]
    } catch (e) {}
    if (!initial) initial = getInitialTheme()
    setTheme(initial)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (theme == null) return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem('theme', theme)
      // also set a cookie so server-rendered HTML can match the user's choice
      document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch (e) {
      // ignore
    }
  }, [theme])

  // Render a neutral placeholder on server to avoid hydration mismatch.
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        title="Toggle theme"
        className="p-2 rounded-md border bg-card text-foreground opacity-0"
      >
        {/* empty placeholder */}
      </button>
    )
  }

  const isLight = theme === 'light'

  return (
    <button
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className={
        'transition-colors flex items-center justify-center ' +
        (isLight
          ? 'p-2 rounded-md border border-border bg-card text-foreground'
          : 'p-2 rounded-full bg-accent text-primary-foreground shadow-sm')
      }
    >
      {isLight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </button>
  )
}
