import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  // No session — redirect to sign in with return URL
  if (!session) {
    const signInUrl = new URL("/auth", req.url);
    signInUrl.searchParams.set("mode", "signin");
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin guard — only applicationRole ADMIN may access /admin (dashboard)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const appRole = (session.user as any)?.applicationRole;
    if (appRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    // Protect /admin but NOT /admin/login (public login page)
    "/admin",
    "/admin/((?!login).*)",
    "/onboarding/:path*",
  ],
};
