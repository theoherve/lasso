import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const { pathname } = req.nextUrl
  const isLoggedIn = !!token
  const roles = (token?.roles as string[]) ?? []

  // Public routes — always accessible
  if (
    pathname === "/" ||
    pathname.startsWith("/associations") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  // Auth pages — redirect to feed if already logged in
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/feed", req.url))
    }
    return NextResponse.next()
  }

  // All routes below require authentication
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/feed", req.url))
    }
    return NextResponse.next()
  }

  // Association backoffice routes
  if (pathname.startsWith("/association")) {
    if (!roles.includes("ASSOCIATION") && !roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/feed", req.url))
    }
    return NextResponse.next()
  }

  // Volunteer routes (feed, map, missions, profile, mission/*)
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/feed/:path*",
    "/map/:path*",
    "/missions/:path*",
    "/profile/:path*",
    "/mission/:path*",
    "/association/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/api/admin/:path*",
  ],
}
