// lib/supabase/client.js
// lib/supabase/client.js
'use client'

import { createClient as createBrowserClient } from '@supabase/supabase-js'

// Convenience wrapper used throughout the app. This uses the public environment
// variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
// If those aren't set (dev without .env.local), return a safe no-op client
// so the app doesn't crash with "Failed to construct 'URL': Invalid URL".
function makeNoopClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null } }),
      getSession: async () => ({ data: { session: null } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: null,
            error: { message: 'Supabase not configured (noop)' },
          }),
        }),
      }),
    }),
    // lightweight helpers used by dev/testing helpers in code
    authHelpers: {
      signOut: async () => ({ error: null }),
      signInMock: async () => ({ data: null, error: null }),
    },
  }
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Basic validation to avoid calling the SDK with missing/placeholder values
  if (!url || !key || url.includes('<YOUR_SUPABASE_URL>')) {
    // warn to help developers
    // eslint-disable-next-line no-console
    console.warn(
      '[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Using noop client.',
    )
    return makeNoopClient()
  }

  return createBrowserClient(url, key)
}

// Exporting a createServerClient here is optional; server-side code uses
// `src/lib/supabase/server.js` which imports from `@supabase/ssr` directly.
export function createServerClient() {
  // For compatibility with imports in the app, forward to the browser client
  // factory. Server-side code should use `src/lib/supabase/server.js` instead.
  return createClient()
}
