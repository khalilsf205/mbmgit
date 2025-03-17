import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()

    // Check if the session cookie exists before trying to delete it
    const sessionCookie = cookieStore.get("session")

    if (sessionCookie) {
      cookieStore.delete("session")
      console.log("Session cookie deleted successfully")
    } else {
      console.log("No session cookie found to delete")
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred during logout",
      },
      {
        status: 500,
      },
    )
  }
}

