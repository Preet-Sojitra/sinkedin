// middleware.js
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request) {
  // This `response` object is used to set cookies.
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value, options)
            )
            supabaseResponse = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) => {
              supabaseResponse.cookies.set(name, value, options)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // This will also make the session available to the rest of your app.
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Optional: Route protection
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user && request.nextUrl.pathname.startsWith("/welcome")) {
    // If the user is not logged in and tries to access a protected route,
    // redirect them to the login page.
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // MUST return the response object
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
