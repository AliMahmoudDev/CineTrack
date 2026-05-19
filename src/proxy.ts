import { NextResponse } from "next/server"
import type { NextProxyRequest } from "next/server"

// protected routes
const protectedRoutes = ["/watchlist", "/lists", "/profile"]

export function proxy(request: NextProxyRequest) {
  const { pathname } = request.nextUrl

  // check protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected) {
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value

    if (!sessionToken) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // redirect logged-in users away from auth
  const isAuthPage = pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup")
  if (isAuthPage) {
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value

    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/watchlist/:path*", "/lists/:path*", "/profile/:path*", "/auth/signin", "/auth/signup"],
}
