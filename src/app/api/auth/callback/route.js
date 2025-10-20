//api/auth/callback/route.js
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, error_description);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  if (code) {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Exchange code error:", error);
        return NextResponse.redirect(`${origin}/auth/auth-code-error`);
      }

      if (data.user) {
        const user = data.user;

        // Check if this is the user's first sign-in.
        // For a new user, `last_sign_in_at` will be null or the same as `created_at`.
        // A small buffer (e.g., 10 seconds) can account for any minor delays.
        const isNewUser =
          !user.last_sign_in_at ||
          new Date(user.last_sign_in_at).getTime() <= new Date(user.created_at).getTime() + 10000;

        if (isNewUser) {
          return NextResponse.redirect(`${origin}/welcome`);
        } else {
          return NextResponse.redirect(`${origin}/feed`);
        }
      }
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  // No code or error provided
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
