import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role")

    let query = "SELECT id, username, email, role, created_at,is_active FROM user"
    const params = []

    if (role && role !== "all") {
      query += " WHERE role = ?"
      params.push(role)
    }

    query += " ORDER BY created_at DESC"

    const [rows] = await pool.query(query, params)

    // Format dates for JSON serialization
    const users = (rows as any[]).map((user) => ({
      ...user,
      created_at: user.created_at ? user.created_at.toISOString() : null,
    }))

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

