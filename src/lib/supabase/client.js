// lib/supabase/client.js
"use client";

import { createBrowserClient } from "@supabase/ssr";

// Export a factory that either returns a real client when envs are present,
// or a safe stub for local/dev usage when they're not.
export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Development mode warning
    if (typeof window !== "undefined" && !window.__supabase_warning_shown) {
      console.warn("⚠️ SUPABASE NOT CONFIGURED ⚠️");
      console.warn("Supabase environment variables are missing.");
      console.warn("Please create a .env.local file with:");
      console.warn("- NEXT_PUBLIC_SUPABASE_URL");
      console.warn("- NEXT_PUBLIC_SUPABASE_ANON_KEY");
      console.warn("See README.md for setup instructions.");
      window.__supabase_warning_shown = true;
    }

    return {
      auth: {
        getUser: async () => ({
          data: { user: null },
          error: { message: "Supabase is not configured. Please set up environment variables." },
        }),
        getSession: async () => ({
          data: { session: null },
          error: { message: "Supabase is not configured." },
        }),
        onAuthStateChange: () => ({ data: { subscriber: { unsubscribe: () => {} } } }),
        signUp: async () => ({
          data: { user: null },
          error: {
            message:
              "Supabase is not configured. Please set up your .env.local file with Supabase credentials.",
          },
        }),
        signInWithOAuth: async () => ({
          data: { user: null },
          error: {
            message:
              "Supabase is not configured. Please set up your .env.local file with Supabase credentials.",
          },
        }),
        signInWithPassword: async () => ({
          data: { user: null },
          error: {
            message:
              "Supabase is not configured. Please set up your .env.local file with Supabase credentials. See README.md for instructions.",
          },
        }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: async () => ({ data: [], error: null }),
        insert: async () => ({ data: null, error: { message: "Supabase is not configured." } }),
        update: async () => ({ data: null, error: { message: "Supabase is not configured." } }),
        delete: async () => ({ data: null, error: { message: "Supabase is not configured." } }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: { message: "Supabase is not configured." } }),
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
