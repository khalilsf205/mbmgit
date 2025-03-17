import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()

    // Get all cookies
    const allCookies = cookieStore.getAll()

    // Delete each cookie
    for (const cookie of allCookies) {
      cookieStore.delete(cookie.name)
    }

    return NextResponse.json({
      success: true,
      message: `Cleared ${allCookies.length} cookies`,
      cookies: allCookies.map((c) => c.name),
    })
  } catch (error) {
    console.error("Error clearing cookies:", error)
    return NextResponse.json({ success: false, error: "An error occurred while clearing cookies" }, { status: 500 })
  }
}

