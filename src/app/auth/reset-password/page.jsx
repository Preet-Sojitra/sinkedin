'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Check if we have the required tokens for password reset
    const access_token = searchParams.get('access_token')
    const refresh_token = searchParams.get('refresh_token')

    if (!access_token || !refresh_token) {
      setShowError(true)
      setErrorMessage(
        'Invalid or expired reset link. Please request a new password reset.',
      )
    }
  }, [searchParams])

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setShowError(true)
      setErrorMessage('Passwords do not match.')
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setShowError(true)
      setErrorMessage('Password must be at least 6 characters long.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      })

      if (error) {
        console.error('Password reset error:', error)
        setShowError(true)
        setErrorMessage(
          error?.message || 'Failed to reset password. Please try again.',
        )
        return
      }

      // Success
      setShowSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (error) {
      console.error('Password reset error:', error)
      setShowError(true)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark px-6">
        <div className="w-full max-w-md">
          <div className="rounded-lg border p-8 bg-dark-secondary border-dark-border text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-4 text-light">
              Password Reset Successful!
            </h2>
            <p className="text-light-secondary mb-6">
              Your password has been updated successfully. You'll be redirected
              to the login page in a few seconds.
            </p>
            <Link
              href="/auth/login"
              className="inline-block w-full font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90 bg-accent text-light text-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-light">
            S<span className="line-through text-accent">in</span>
            kedIn
          </h1>
          <p className="mt-1 text-light-secondary">
            Time to fix that forgotten password
          </p>
        </div>

        <div className="rounded-lg border p-8 bg-dark-secondary border-dark-border">
          <h2 className="text-2xl font-bold mb-6 text-center text-light">
            Reset Your Password
          </h2>

          {showError && (
            <div className="mb-6 p-3 rounded-lg flex items-start bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-light"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-colors pr-12 bg-dark border-dark-border text-light focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Enter your new password"
                  required
                  minLength={6}
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-light"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border outline-none transition-colors pr-12 bg-dark border-dark-border text-light focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 text-light-secondary focus:outline-none"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full font-semibold py-3 px-4 rounded-lg transition-colors hover:opacity-90 bg-accent text-light"
              disabled={isLoading}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-light-secondary">
              Remember your password?{' '}
              <Link
                href="/auth/login"
                className="font-medium hover:opacity-70 transition-opacity text-accent"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
