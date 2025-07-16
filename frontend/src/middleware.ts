import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     * - forgot-password
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password).*)",
  ],
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("user_token")?.value

  // If the user is not authenticated, redirect to the login page
  if (!token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
} 