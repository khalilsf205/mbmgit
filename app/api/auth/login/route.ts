import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import pool from "@/lib/db"
import bcrypt from "bcrypt"
import { encrypt } from "@/lib/crypto"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Log the login attempt
    console.log("API login attempt for:", email)

    // Find user by email
    const [users] = await pool.query("SELECT id, username, email, password, role FROM user WHERE email = ?", [email])

    const userArray = users as any[]
    if (userArray.length === 0) {
      console.log("No user found with email:", email)
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    const user = userArray[0]
    console.log("Found user:", { id: user.id, email: user.email, role: user.role })

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("Password match:", passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    const session = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    }

    // Encrypt session and store in cookie
    const encryptedSession = await encrypt(JSON.stringify(session))
    const cookieStore = await cookies()

    cookieStore.set("session", encryptedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    console.log("Login successful, session created for user:", user.email)

    // Return success response with user data
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("API login error:", error)
    return NextResponse.json({ success: false, error: "An error occurred during login" }, { status: 500 })
  }
}

