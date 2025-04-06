import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all tables in the database
    const [rows] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `)

    const tables = (rows as any[]).map((row) => row.table_name)

    return NextResponse.json({
      status: "success",
      tables,
    })
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

