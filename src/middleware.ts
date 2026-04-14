import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "super-secret-tour-key";
const encodedKey = new TextEncoder().encode(secretKey);

const isProtectedRoute = (pathname: string) => pathname.startsWith("/admin") && pathname !== "/admin/login";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (isProtectedRoute(pathname)) {
    const session = req.cookies.get("admin_session")?.value;

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }

    try {
      await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
      });
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }
  }

  // Redirect authenticated user away from login
  if (pathname === "/admin/login") {
    const session = req.cookies.get("admin_session")?.value;
    if (session) {
      try {
        await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      } catch {
        // Invalid session on login page, just continue
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
