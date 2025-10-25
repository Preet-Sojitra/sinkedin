import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          try {
            cookies.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          } catch {
            // Ignore errors in server components
          }
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const url = request.nextUrl

  // -------------------------------
  // Not logged in → redirect to login for protected routes
  // -------------------------------
  const protectedRoutes = ['/feed', '/profile']
  if (
    !user &&
    protectedRoutes.some((route) => url.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL('/auth/login', url))
  }

  // -------------------------------
  // Logged in → check if profile exists
  // -------------------------------
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    // If no profile → redirect to /welcome when accessing protected routes
    if (
      !profile &&
      protectedRoutes.some((route) => url.pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL('/welcome', url))
    }

    // Optional: if profile exists and user tries to visit /welcome → redirect to feed
    if (profile && url.pathname.startsWith('/welcome')) {
      return NextResponse.redirect(new URL('/feed', url))
    }
  }

  return response
}

export const config = {
  // Only protect specific routes
  matcher: ['/feed/:path*', '/profile/:path*'],
}
