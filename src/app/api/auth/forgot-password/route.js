// api/auth/forgot-password/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const { email } = await request.json()

    // --- 1. Backend Validation ---
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 },
      )
    }

    // --- 2. Supabase Logic ---
    const supabase = await createClient()
    console.log('Supabase client created:', !!supabase, !!supabase?.auth)

    if (!supabase || !supabase.auth) {
      console.error('Failed to create Supabase client or auth is missing')
      return NextResponse.json(
        { error: 'Server configuration error. Please try again later.' },
        { status: 500 },
      )
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`,
    })

    // --- 3. Error Handling ---
    if (error) {
      console.error('Supabase forgot password error:', error)
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again.' },
        { status: 500 },
      )
    }

    // --- 4. Success Response ---
    // Always return success even if email doesn't exist (security best practice)
    return NextResponse.json(
      {
        message:
          "If an account with that email exists, we've sent you a password reset link.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Forgot password API error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    )
  }
}
