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
    console.log("User in fournisseur GET API:", user.role)

    // Temporarily allow any authenticated user to access this endpoint
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    // }

    const { id } = params

    // Check if the fournisseur table exists
    try {
      const [tables] = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = 'fournisseur'
      `)

      const tableExists = (tables as any[]).length > 0
      if (!tableExists) {
        return NextResponse.json({ error: "Fournisseur table not found in database" }, { status: 500 })
      }
    } catch (error) {
      console.error("Error checking for fournisseur table:", error)
      return NextResponse.json(
        {
          error: "Database error",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }

    const [rows] = await pool.query(
      `SELECT id_fr, nom, prenom, email, tlf, mf, credit
       FROM fournisseur 
       WHERE id_fr = ?`,
      [id],
    )

    const fournisseurs = rows as any[]
    if (fournisseurs.length === 0) {
      return NextResponse.json({ error: "Fournisseur not found" }, { status: 404 })
    }

    return NextResponse.json(fournisseurs[0])
  } catch (error) {
    console.error("Error fetching fournisseur:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch fournisseur",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

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

    // Check if fournisseur exists
    try {
      const [existingFournisseurs] = await pool.query("SELECT id_fr FROM fournisseur WHERE id_fr = ?", [id])

      if ((existingFournisseurs as any[]).length === 0) {
        return NextResponse.json({ error: "Fournisseur not found" }, { status: 404 })
      }

      // Update the fournisseur
      const query = `
        UPDATE fournisseur 
        SET nom = ?, prenom = ?, email = ?, tlf = ?, mf = ?, credit = ?
        WHERE id_fr = ?
      `
      const values = [body.nom, body.prenom, body.email, body.tlf, body.mf, body.credit || 0, id]

      await pool.query(query, values)

      return NextResponse.json({
        id_fr: id,
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
    console.error("Error updating fournisseur:", error)
    return NextResponse.json(
      {
        error: "Failed to update fournisseur",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("DELETE request received for fournisseur ID:", params.id)

  try {
    const user = await getCurrentUser()
    console.log("User authentication check:", user ? "Authenticated" : "Not authenticated")

    if (!user) {
      console.log("Authentication failed")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = params
    console.log("Attempting to delete fournisseur with ID:", id)

    // Check if fournisseur exists
    console.log("Checking if fournisseur exists")
    const [existingFournisseurs] = await pool.query("SELECT id_fr FROM fournisseur WHERE id_fr = ?", [id])

    console.log("Query result:", existingFournisseurs)

    if ((existingFournisseurs as any[]).length === 0) {
      console.log("Fournisseur not found")
      return NextResponse.json({ error: "Fournisseur not found" }, { status: 404 })
    }

    // Check for foreign key constraints (optional)
    // You can add a query here to check if the fournisseur is referenced in other tables

    // Delete the fournisseur
    console.log("Deleting fournisseur")
    await pool.query("DELETE FROM fournisseur WHERE id_fr = ?", [id])
    console.log("Fournisseur deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE handler:", error)

    // More detailed error information
    let errorMessage = "Failed to delete fournisseur"
    const errorDetails = error instanceof Error ? error.message : String(error)

    // Check for specific MySQL errors
    if (error instanceof Error && error.message.includes("foreign key constraint")) {
      errorMessage = "Cannot delete this fournisseur because it is referenced by other records"
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    )
  }
}

