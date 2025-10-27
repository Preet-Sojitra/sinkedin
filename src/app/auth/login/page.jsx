'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setShowError(false)
    setErrorMessage('')
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error('Login error:', error)
        setShowError(true)
        setErrorMessage(error?.message || 'An unexpected error occurred.')
        return // Important to stop the function here
      }

      if (data.user) {
        router.replace('/feed')
        router.refresh() // Ensures layout re-renders with new auth state
      }
    } catch (error) {
      console.error('Login error:', error)
      setShowError(true)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
      },
    })

    if (error) {
      console.error('Google login error:', error)
      setShowError(true)
      setErrorMessage(error?.message || 'An unexpected error occurred.')
      return
    }

    // Handle successful Google login if needed
    if (data.user) {
      router.push('/feed')
      router.refresh() // Ensures layout re-renders with new auth state
    }
  }

  return (
    <div className="min-h-screen flex bg-dark">
      {/* Left Side - Branding & Motivation (unchanged) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 bg-dark-secondary">
        {/* ... your left side content ... */}
        <div className="max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-light">
              S<span className="line-through text-accent">in</span>
              kedIn
            </h1>
            <p className="mt-2 text-lg text-light-secondary">
              Welcome back to the chaos. We saved you a spot by the fire.
            </p>
          </div>
          <div
            className="rounded-lg p-6 mb-8"
            style={{
              backgroundColor: 'rgba(224, 49, 49, 0.1)',
              border: '1px solid rgba(224, 49, 49, 0.3)',
            }}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-accent">🎭</div>
              <div>
                <h3 className="font-semibold mb-2 text-accent">
                  Ready for More Shenanigans?
                </h3>
                <p className="text-sm leading-relaxed text-light">
                  Time to dive back into today's collection of cringe,
                  commiseration, and career cautionary tales. Your daily dose of
                  'it could be worse' awaits.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-light">
              <div className="w-2 h-2 rounded-full mr-3 bg-accent"></div>
              <span className="text-sm">
                LinkedIn shows the highlight reel. We live in the outtakes.
              </span>
            </div>
            <div className="flex items-center text-light">
              <div className="w-2 h-2 rounded-full mr-3 bg-accent"></div>
              <span className="text-sm">
                Find your people - the ones who also hit 'Reply All' on that
                email.
              </span>
            </div>
            <div className="flex items-center text-light">
              <div className="w-2 h-2 rounded-full mr-3 bg-accent"></div>
              <span className="text-sm">
                Your daily reminder that someone, somewhere, is failing harder
                than you
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-light">
              S<span className="line-through text-accent">in</span>
              kedIn
            </h1>
            <p className="mt-1 text-light-secondary">
              Welcome back to the chaos
            </p>
          </div>

          <div className="rounded-lg border p-8 bg-dark-secondary border-dark-border">
            <h2 className="text-2xl font-bold mb-6 text-center text-light">
              Welcome Back, Loser
            </h2>

            {/* Social Login Buttons */}
            <div className="mb-6">
              <button
                className="w-full py-3 px-4 rounded-lg flex items-center justify-center transition-colors border hover:opacity-80 bg-dark border-dark-border text-light"
                onClick={handleGoogleLogin}
                aria-label="Continue with Google"
              >
                <Mail className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-grow border-t border-dark-border"></div>
              <span className="px-4 text-sm text-light-secondary">or</span>
              <div className="flex-grow border-t border-dark-border"></div>
            </div>

            {showError && (
              <div className="mb-2 text-sm text-red-500 text-center">
                {errorMessage}
              </div>
            )}

            {/* 4. Use form's onSubmit handler */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-light"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-colors bg-dark border-dark-border text-light focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="back.to.misery@disaster.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2 text-light"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border outline-none transition-colors pr-12 bg-dark border-dark-border text-light focus:border-accent focus:ring-1 focus:ring-accent"
                    placeholder="The one you probably forgot"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 text-light-secondary focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* // TODO v2: Add reset password */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 rounded border border-dark-border focus:ring-accent focus:ring-2 transition-colors h-4 w-4 text-accent bg-dark"
                  />
                  <span className="text-sm text-light-secondary">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm hover:opacity-70 transition-opacity text-accent"
                >
                  Forgot password?
                </a>
              </div> */}

              {/* 5. Change button type to "submit" */}
              <button
                type="submit"
                className="w-full font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90 bg-accent text-light"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Back to the Disaster'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-light-secondary">
                New to professional disasters?{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium hover:opacity-70 transition-opacity text-accent"
                >
                  Join the chaos
                </Link>
              </p>
            </div>

            <div className="mt-6 p-3 rounded-lg flex items-start bg-dark">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-accent" />
              <p className="text-xs text-light-secondary">
                By logging in, you acknowledge that your career is probably
                still a mess, and that's totally fine here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
