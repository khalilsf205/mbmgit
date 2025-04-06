import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: "Not authenticated",
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error checking auth status:", error)
    return NextResponse.json(
      {
        authenticated: false,
        error: "Error checking authentication status",
      },
      { status: 500 },
    )
  }
}

