import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // Get the cookies
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("session")

    // Get the current user
    const user = await getCurrentUser()

    return NextResponse.json({
      sessionCookieExists: !!sessionCookie,
      user: user
        ? {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          }
        : null,
      allCookies: cookieStore.getAll().map((c) => c.name),
    })
  } catch (error) {
    console.error("Error in auth debug:", error)
    return NextResponse.json(
      {
        error: "Error checking authentication",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

