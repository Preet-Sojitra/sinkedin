import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function createClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
  )
}
