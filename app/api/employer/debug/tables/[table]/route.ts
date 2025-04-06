import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { table: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tableName = params.table

    // Validate table name to prevent SQL injection
    // This is a simple validation, you might want to enhance it
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      return NextResponse.json(
        {
          status: "error",
          error: "Invalid table name",
        },
        { status: 400 },
      )
    }

    // Get table data (limit to 100 rows for safety)
    const [rows] = await pool.query(`SELECT * FROM ${tableName} LIMIT 100`)

    return NextResponse.json({
      status: "success",
      data: rows,
    })
  } catch (error) {
    console.error(`Error fetching data for table ${params.table}:`, error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

