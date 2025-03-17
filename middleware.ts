import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "./lib/crypto"

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value

  // If accessing protected routes without a session, redirect to login
  if (request.nextUrl.pathname.startsWith("/admin") && !session) {
    console.log("Middleware: No session found, redirecting to login")
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If accessing login page with a session, redirect to appropriate dashboard
  if (request.nextUrl.pathname === "/login" && session) {
    try {
      const decrypted = await decrypt(session)
      const userData = JSON.parse(decrypted)

      console.log("Middleware: User already logged in, redirecting based on role:", userData.role)

      // Redirect based on role
      if (userData.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url))
      } else if (userData.role === "client") {
        return NextResponse.redirect(new URL("/client", request.url))
      } else if (userData.role === "employer") {
        return NextResponse.redirect(new URL("/employer", request.url))
      }
    } catch (error) {
      console.error("Middleware: Error decrypting session:", error)
      // If there's an error decrypting the session, clear the cookie
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("session")
      return response
    }
  }

  // Check if user is trying to access admin routes but is not an admin
  if (request.nextUrl.pathname.startsWith("/admin") && session) {
    try {
      const decrypted = await decrypt(session)
      const userData = JSON.parse(decrypted)

      if (userData.role !== "admin") {
        console.log("Middleware: Non-admin user trying to access admin routes, redirecting")

        // Redirect to appropriate dashboard based on role
        if (userData.role === "client") {
          return NextResponse.redirect(new URL("/client", request.url))
        } else if (userData.role === "employer") {
          return NextResponse.redirect(new URL("/employer", request.url))
        }

        // Fallback to login if role is unknown
        return NextResponse.redirect(new URL("/login", request.url))
      }
    } catch (error) {
      console.error("Middleware: Error checking admin access:", error)
      // If there's an error, clear the cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("session")
      return response
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/client/:path*", "/employer/:path*"],
}

