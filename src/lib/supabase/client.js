// lib/supabase/client.js
"use client";

import { createBrowserClient } from "@supabase/ssr";

// Export a factory that either returns a real client when envs are present,
// or a safe stub for local/dev usage when they're not.
export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscriber: { unsubscribe: () => {} } } }),
        // Ensure returned shapes match what the app expects ({ data: { user } })
        signUp: async () => ({ data: { user: null }, error: null }),
        signInWithOAuth: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: async () => ({ data: [], error: null }),
        insert: async () => ({ data: null, error: null }),
        update: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
      channel: () => ({
        on: () => ({ subscribe: () => {} }),
        subscribe: () => {},
        unsubscribe: () => {},
      }),
      removeChannel: () => {},
    };
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
