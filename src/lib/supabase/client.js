// lib/supabase/client.js
'use client'

import { createBrowserClient } from '@supabase/ssr'

// Export a factory that either returns a real client when envs are present,
// or a safe stub for local/dev usage when they're not.
export function createClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: null }),
        // Ensure returned shapes match what the app expects ({ data: { user } })
        signUp: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: { user: null }, error: null }),
        signIn: async () => ({ data: { user: null }, error: null }),
      },
      from: () => ({ select: async () => ({ data: [], error: null }) }),
    }
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
