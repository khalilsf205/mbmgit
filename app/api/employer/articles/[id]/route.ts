import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import pool from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Extract id from params
    const { id } = params

    // Check which table to use
    const [tables] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `)

    const tableNames = (tables as any[]).map((t) => t.table_name || t.TABLE_NAME)
    const useArticleTable = !tableNames.includes("art") && tableNames.includes("article")
    const tableName = useArticleTable ? "article" : "art"

    // Get column information for the table
    const [columns] = await pool.query(
      `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = DATABASE() AND table_name = ?
    `,
      [tableName],
    )

    const columnNames = (columns as any[]).map((c) => c.column_name || c.COLUMN_NAME)
    console.log(`Columns in ${tableName} table:`, columnNames)

    let rows

    if (useArticleTable) {
      // Build a query with only the columns that exist
      const validColumns = ["id", "code", "designation", "description", "price", "quantity", "unit", "category"].filter(
        (col) => columnNames.includes(col),
      )

      if (validColumns.length === 0) {
        return NextResponse.json({ error: "No valid columns to select" }, { status: 400 })
      }
      ;[rows] = await pool.query(`SELECT ${validColumns.join(", ")} FROM article WHERE id = ?`, [id])
    } else {
      // Build a query with only the columns that exist
      const validColumns = [
        "Art_ID",
        "Art_CodBar",
        "Categorie_ID",
        "Art_Serie",
        "Art_Desig",
        "Art_Unite",
        "Art_PuAcht",
        "Art_RemF",
        "Art_Tva",
        "Art_PURv",
        "Art_PrMinEX",
        "Art_Putv",
        "Art_Remplac",
        "Art_Fodec",
        "Art_Frs1",
        "Art_Frs2",
        "Art_Frs3",
        "Art_StkIni",
        "Art_StkMini",
        "Art_StkMaxi",
        "Societe_id",
        "Art_RefFr",
        "Art_NewField",
      ].filter((col) => columnNames.includes(col))

      if (validColumns.length === 0) {
        return NextResponse.json({ error: "No valid columns to select" }, { status: 400 })
      }
      ;[rows] = await pool.query(`SELECT ${validColumns.join(", ")} FROM art WHERE Art_ID = ?`, [id])
    }

    const articles = rows as any[]
    if (articles.length === 0) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(articles[0])
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch article",
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

    // Extract id from params
    const { id } = params
    const body = await request.json()

    // Check which table to use
    const [tables] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `)

    const tableNames = (tables as any[]).map((t) => t.table_name || t.TABLE_NAME)
    const useArticleTable = !tableNames.includes("art") && tableNames.includes("article")
    const tableName = useArticleTable ? "article" : "art"

    // Get column information for the table
    const [columns] = await pool.query(
      `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = DATABASE() AND table_name = ?
    `,
      [tableName],
    )

    const columnNames = (columns as any[]).map((c) => c.column_name || c.COLUMN_NAME)
    console.log(`Columns in ${tableName} table:`, columnNames)

    if (useArticleTable) {
      // Check if article exists
      const [existingArticles] = await pool.query("SELECT id FROM article WHERE id = ?", [id])

      if ((existingArticles as any[]).length === 0) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }

      // Check if code is already used by another article
      if (body.code && columnNames.includes("code")) {
        const [codeCheck] = await pool.query("SELECT id FROM article WHERE code = ? AND id != ?", [body.code, id])
        if ((codeCheck as any[]).length > 0) {
          return NextResponse.json({ error: "Another article with this code already exists" }, { status: 400 })
        }
      }

      // Prepare fields and values for the query - only include fields that exist in the table
      const fields = Object.keys(body)
        .filter((key) => key !== "id")
        .filter((key) => columnNames.includes(key))

      if (fields.length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
      }

      const setClause = fields.map((field) => `${field} = ?`).join(", ")
      const values = [...fields.map((field) => body[field]), id]

      // Update the article
      const query = `UPDATE article SET ${setClause} WHERE id = ?`
      console.log("Update query:", query)
      console.log("Update values:", values)

      await pool.query(query, values)

      return NextResponse.json({
        id: id,
        ...body,
      })
    } else {
      // Check if article exists
      const [existingArticles] = await pool.query("SELECT Art_ID FROM art WHERE Art_ID = ?", [id])

      if ((existingArticles as any[]).length === 0) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }

      // Check if barcode is already used by another article
      if (body.Art_CodBar && columnNames.includes("Art_CodBar")) {
        const [codeCheck] = await pool.query("SELECT Art_ID FROM art WHERE Art_CodBar = ? AND Art_ID != ?", [
          body.Art_CodBar,
          id,
        ])
        if ((codeCheck as any[]).length > 0) {
          return NextResponse.json({ error: "Another article with this barcode already exists" }, { status: 400 })
        }
      }

      // Prepare fields and values for the query - only include fields that exist in the table
      const fields = Object.keys(body)
        .filter((key) => key !== "Art_ID")
        .filter((key) => columnNames.includes(key))

      if (fields.length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
      }

      const setClause = fields.map((field) => `${field} = ?`).join(", ")
      const values = [...fields.map((field) => body[field]), id]

      // Update the article
      const query = `UPDATE art SET ${setClause} WHERE Art_ID = ?`
      console.log("Update query:", query)
      console.log("Update values:", values)

      await pool.query(query, values)

      return NextResponse.json({
        Art_ID: id,
        ...body,
      })
    }
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      {
        error: "Failed to update article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the user - this is already async
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get the ID from params
    const { id } = params

    // Execute the delete operation directly without any checks
    try {
      // Determine which table to use
      const [tables] = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE()
      `)

      const tableNames = (tables as any[]).map((t) => t.table_name || t.TABLE_NAME)
      const useArticleTable = !tableNames.includes("art") && tableNames.includes("article")

      // Execute the delete query
      if (useArticleTable) {
        await pool.query("DELETE FROM article WHERE id = ?", [id])
      } else {
        await pool.query("DELETE FROM art WHERE Art_ID = ?", [id])
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Database error during delete:", error)
      return NextResponse.json({ error: "Database error during delete operation" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in DELETE handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

