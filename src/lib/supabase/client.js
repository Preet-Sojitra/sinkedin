// lib/supabase/client.js
'use client' // Good practice to add this for clarity

import { createBrowserClient } from '@supabase/ssr'

// It's better to export a function for consistency, though a singleton works here.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
