"use server"

import { cookies } from "next/headers"
import pool from "./db"
import bcrypt from "bcrypt"
import { encrypt, decrypt } from "./crypto"

// Define a type for the login result
type LoginResult =
  | { success: true; user: { id: any; username: any; email: any; role: any } }
  | { success: false; error: string }

export async function loginUser({ email, password }: { email: string; password: string }): Promise<LoginResult> {
  try {
    // Add debug logging
    console.log("Attempting login for email:", email)

    // Find user by email
    const [users] = await pool.query("SELECT id, username, email, password, role FROM user WHERE email = ?", [email])

    const userArray = users as any[]
    if (userArray.length === 0) {
      console.log("No user found with email:", email)
      return { success: false, error: "Invalid email or password" }
    }

    const user = userArray[0]
    console.log("Found user:", { id: user.id, email: user.email, role: user.role })

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("Password match:", passwordMatch)

    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
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

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logoutUser() {
  // Get the cookies object
  const cookieStore = await cookies()

  // Now delete the cookie
  cookieStore.delete("session")

  return { success: true }
}

export async function getCurrentUser() {
  try {
    // Get the cookies object - this must be awaited
    const cookieStore = await cookies()

    // Get the session cookie
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      console.log("No session cookie found")
      return null
    }

    try {
      const decrypted = await decrypt(sessionCookie.value)
      const session = JSON.parse(decrypted)

      // Check if session is expired
      if (session.expires < Date.now()) {
        // Delete the expired cookie
        console.log("Session expired, clearing cookie")
        cookieStore.delete("session")
        return null
      }

      console.log("Session found for user:", session.email, "with role:", session.role)

      return {
        id: session.id,
        username: session.username,
        email: session.email,
        role: session.role,
      }
    } catch (error) {
      // If there's any error with decryption or parsing,
      // delete the invalid cookie and return null
      console.error("Session cookie is invalid, clearing it:", error)
      cookieStore.delete("session")
      return null
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

