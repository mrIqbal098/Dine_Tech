import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Read Authorization header from incoming request
  const authHeader = request.headers.get("authorization") || "";

  // If no auth header present, redirect to admin login
  if (!authHeader) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Forward the auth header to the backend /api/auth/me to validate session
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const resp = await fetch(`${apiBase}/api/auth/me`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    if (resp.ok) {
      // User is authenticated — allow the request
      return NextResponse.next();
    }
  } catch (err) {
    // ignore and redirect below
    console.error("middleware auth check failed:", err);
  }

  // If validation failed, redirect to login
  return NextResponse.redirect(new URL("/admin", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/dashboard", "/admin/menu"],
};