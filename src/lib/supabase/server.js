import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // If env vars are missing, return a safe stub so server components don't crash.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      auth: {
        // minimal stubs used by the app
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscriber: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
      },
      // Provide a chainable query builder that resolves to an empty result set.
      from: () => {
        const builder = {
          select() {
            return builder;
          },
          order() {
            return builder;
          },
          limit() {
            return builder;
          },
          eq() {
            return builder;
          },
          single() {
            return builder;
          },
          range: async () => ({ data: [], error: null }),
          // Add these methods that might be called
          insert: async () => ({ data: null, error: null }),
          update: async () => ({ data: null, error: null }),
          delete: async () => ({ data: null, error: null }),
        };
        return builder;
      },
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    };
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
