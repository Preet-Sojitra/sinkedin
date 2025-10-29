'use client'

import { createClient } from '@supabase/supabase-js'

const createClientForBrowser = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

const supabase = createClientForBrowser()

export default supabase
