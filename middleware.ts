import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Public routes
  const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/error"]
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // API routes and webhooks are public
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/webhooks")) {
    return NextResponse.next()
  }
  
  // Check if user is authenticated
  const isAuthenticated = !!req.auth
  
  // Redirect to signin if trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", req.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // Redirect to dashboard if authenticated user tries to access auth pages
  if (isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
