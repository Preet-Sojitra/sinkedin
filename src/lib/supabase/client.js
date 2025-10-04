import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (typeof window === 'undefined') {
    // Node / server context (API route or standalone script)
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in env')
    }
    return createSupabaseClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY,
    )
  } else {
    // Browser / Next.js SSR context
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
  }
}
