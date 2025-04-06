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
      SELECT id_fr, nom, prenom, email, tlf, mf, credit
      FROM fournisseur
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
    console.error("Error fetching fournisseurs:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch fournisseurs",
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

    // Insert the new fournisseur
    const query = `
      INSERT INTO fournisseur (nom, prenom, email, tlf, mf, credit)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const values = [body.nom, body.prenom, body.email, body.tlf, body.mf, body.credit || 0]

    const [result] = await pool.query(query, values)
    const insertId = (result as any).insertId

    return NextResponse.json({
      id_fr: insertId,
      ...body,
    })
  } catch (error) {
    console.error("Error creating fournisseur:", error)
    return NextResponse.json(
      {
        error: "Failed to create fournisseur",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

