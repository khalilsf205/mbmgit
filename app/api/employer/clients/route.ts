import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")

    let query = `
      SELECT id_cl, nom, prenom, email, tlf, mf, credit
      FROM client_local
    `
    const params: any[] = []

    if (search && search.trim() !== "") {
      query += ` WHERE nom LIKE ? OR prenom LIKE ? OR email LIKE ? OR mf LIKE ?`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
    }

    query += ` ORDER BY nom, prenom`

    const [rows] = await pool.query(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch clients",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()

    // Insert the new client
    const query = `
      INSERT INTO client_local (nom, prenom, email, tlf, mf, credit)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const values = [body.nom, body.prenom, body.email, body.tlf, body.mf, body.credit || 0]

    const [result] = await pool.query(query, values)
    const insertId = (result as any).insertId

    return NextResponse.json({
      id_cl: insertId,
      ...body,
    })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      {
        error: "Failed to create client",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

