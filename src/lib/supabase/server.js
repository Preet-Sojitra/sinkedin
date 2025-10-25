import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function makeNoopServerClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      getUser: async () => ({ data: { user: null } }),
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
  }
}

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If envs are missing, return noop server client to avoid runtime errors
  if (!url || !key || url.includes('<YOUR_SUPABASE_URL>')) {
    // eslint-disable-next-line no-console
    console.warn(
      '[supabase] Server: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Using noop server client.',
    )
    return makeNoopServerClient()
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
