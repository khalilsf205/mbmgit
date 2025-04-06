import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // For debugging
    console.log("User in client GET API:", user.role)

    // Temporarily allow any authenticated user to access this endpoint
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    // }

    const { id } = params

    // Check if the client_local table exists
    try {
      const [tables] = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = 'client_local'
      `)

      const tableExists = (tables as any[]).length > 0
      if (!tableExists) {
        return NextResponse.json({ error: "Client_local table not found in database" }, { status: 500 })
      }
    } catch (error) {
      console.error("Error checking for client_local table:", error)
      return NextResponse.json(
        {
          error: "Database error",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }

    const [rows] = await pool.query(
      `SELECT id_cl, nom, prenom, email, tlf, mf, credit
       FROM client_local 
       WHERE id_cl = ?`,
      [id],
    )

    const clients = rows as any[]
    if (clients.length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    return NextResponse.json(clients[0])
  } catch (error) {
    console.error("Error fetching client:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch client",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Keep the rest of the file unchanged

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Temporarily allow any authenticated user to access this endpoint
    // if (user.role !== "employer") {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    // }

    const { id } = params

    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: "Could not parse JSON body",
        },
        { status: 400 },
      )
    }

    // Check if client exists
    try {
      const [existingClients] = await pool.query("SELECT id_cl FROM client_local WHERE id_cl = ?", [id])

      if ((existingClients as any[]).length === 0) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 })
      }

      // Update the client
      const query = `
        UPDATE client_local 
        SET nom = ?, prenom = ?, email = ?, tlf = ?, mf = ?, credit = ?
        WHERE id_cl = ?
      `
      const values = [body.nom, body.prenom, body.email, body.tlf, body.mf, body.credit || 0, id]

      await pool.query(query, values)

      return NextResponse.json({
        id_cl: id,
        ...body,
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(
        {
          error: "Database error",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error updating client:", error)
    return NextResponse.json(
      {
        error: "Failed to update client",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

