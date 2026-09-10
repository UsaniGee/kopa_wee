import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

/**
 * Edge-compatible middleware for KopaWee route protection.
 *
 * Strategy:
 *  - Token presence check: unauthenticated → redirect to /auth
 *  - Admin guard: non-admin on /admin/* → redirect to /dashboard
 *  - All other protected routes: pass through if token exists
 *
 * Public routes (/, /auth/*, /api/auth/*) are excluded via the matcher below.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // No session token — redirect to sign in with return URL
  if (!token) {
    const signInUrl = new URL("/auth", req.url);
    signInUrl.searchParams.set("mode", "signin");
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin guard — only applicationRole: ADMIN may access /admin/*
  if (pathname.startsWith("/admin")) {
    if (token.applicationRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding/:path*",
  ],
};
