//api/auth/callback/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // // The user will be redirected to the homepage after auth
  // const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    // console.log("Supabase callback data:", data)

    if (!error && data.user) {
      const user = data.user

      // Check if this is the user's first sign-in.
      // For a new user, `last_sign_in_at` will be null or the same as `created_at`.
      // A small buffer (e.g., 10 seconds) can account for any minor delays.
      const isNewUser =
        !user.last_sign_in_at ||
        new Date(user.last_sign_in_at).getTime() <=
          new Date(user.created_at).getTime() + 10000
      // console.log("Is new user:", isNewUser)

      if (isNewUser) {
        return NextResponse.redirect(`${origin}/welcome`)
      } else {
        return NextResponse.redirect(`${origin}/feed`)
      }
    }
    return NextResponse.redirect(`${origin}/auth/auth-code-error`) // TODO: Create this page
  }
}
