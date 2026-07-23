/**
 * Next.js Middleware
 * Protects all /admin routes — redirects unauthenticated users to /admin/login
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !session?.user) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // If already logged in, redirect away from login page
  if (isLoginPage && session?.user) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
