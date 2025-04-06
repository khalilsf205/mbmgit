import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Log the authentication status for debugging
    console.log("Authentication check:", {
      userExists: !!user,
      userRole: user?.role,
      isAuthorized: user?.role === "employer",
    })

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // For testing purposes, temporarily allow any authenticated user to access this endpoint
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    // }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const lowStock = searchParams.get("lowStock") === "true"

    console.log("Search params:", { search, lowStock })

    // Check if the art table exists
    try {
      const [tables] = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE()
      `)

      const tableNames = (tables as any[]).map((t) => t.table_name || t.TABLE_NAME)
      console.log("Available tables:", tableNames)

      // If art table doesn't exist, try to use article table instead
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

      // Build a query based on the available columns
      let query
      const params: any[] = []

      if (useArticleTable) {
        // Use article table schema
        query = `
          SELECT 
            id as Art_ID, 
            code as Art_CodBar, 
            designation as Art_Desig, 
            price as Art_PuAcht, 
            price as Art_PURv, 
            quantity as Art_StkIni, 
            unit as Art_Unite
          FROM article
        `

        const conditions = []

        if (lowStock && columnNames.includes("quantity")) {
          conditions.push("quantity <= 5") // Assuming 5 is a low stock threshold
        }

        if (search && search.trim() !== "") {
          if (useArticleTable) {
            conditions.push("(code LIKE ? OR designation LIKE ?)")
            params.push(`%${search}%`, `%${search}%`)
          } else {
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
            ]
            const searchableColumns = ["Art_CodBar", "Art_Desig", "Art_RefFr"].filter((col) =>
              validColumns.includes(col),
            )

            if (searchableColumns.length > 0) {
              const searchCondition = "(" + searchableColumns.map((col) => `${col} LIKE ?`).join(" OR ") + ")"
              conditions.push(searchCondition)

              // Add parameters for each searchable column
              searchableColumns.forEach(() => params.push(`%${search}%`))
            }
          }
        }

        if (conditions.length > 0) {
          query += " WHERE " + conditions.join(" AND ")
        }
      } else {
        // Use art table schema - but only include columns that actually exist
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

        // Ensure we have at least the essential columns
        if (!validColumns.includes("Art_ID")) {
          throw new Error("Required column 'Art_ID' not found in table")
        }

        query = `
          SELECT 
            ${validColumns.join(", ")}
          FROM art
        `

        const conditions = []

        if (lowStock && validColumns.includes("Art_StkIni") && validColumns.includes("Art_StkMini")) {
          conditions.push("Art_StkIni <= Art_StkMini")
        }

        if (search && search.trim() !== "") {
          const searchableColumns = ["Art_CodBar", "Art_Desig", "Art_RefFr"].filter((col) => validColumns.includes(col))

          if (searchableColumns.length > 0) {
            const searchCondition = "(" + searchableColumns.map((col) => `${col} LIKE ?`).join(" OR ") + ")"
            conditions.push(searchCondition)

            // Add parameters for each searchable column
            searchableColumns.forEach(() => params.push(`%${search}%`))
          }
        }

        if (conditions.length > 0) {
          query += " WHERE " + conditions.join(" AND ")
        }
      }

      console.log("Executing query:", query, "with params:", params)

      const [rows] = await pool.query(query, params)
      console.log("Query result count:", (rows as any[]).length)

      return NextResponse.json(rows)
    } catch (error) {
      console.error("Error checking database schema:", error)
      throw error
    }
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch articles",
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

    // For testing purposes, temporarily allow any authenticated user to access this endpoint
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    // }

    const body = await request.json()
    console.log("POST request body:", body)

    // Check if we should use article or art table
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
      // Check if article with same code already exists
      if (body.code) {
        const [existingArticles] = await pool.query("SELECT id FROM article WHERE code = ?", [body.code])
        if ((existingArticles as any[]).length > 0) {
          return NextResponse.json({ error: "Article with this code already exists" }, { status: 400 })
        }
      }

      // Prepare fields and values for the query - only include fields that exist in the table
      const fields = Object.keys(body)
        .filter((key) => key !== "id")
        .filter((key) => columnNames.includes(key))

      const values = fields.map((field) => body[field])

      const placeholders = fields.map(() => "?").join(", ")
      const fieldNames = fields.join(", ")

      // Insert the new article
      const query = `INSERT INTO article (${fieldNames}) VALUES (${placeholders})`
      console.log("Insert query:", query)
      console.log("Insert values:", values)

      const [result] = await pool.query(query, values)
      const insertId = (result as any).insertId

      return NextResponse.json({
        id: insertId,
        ...body,
      })
    } else {
      // Check if article with same barcode already exists
      if (body.Art_CodBar && columnNames.includes("Art_CodBar")) {
        const [existingArticles] = await pool.query("SELECT Art_ID FROM art WHERE Art_CodBar = ?", [body.Art_CodBar])
        if ((existingArticles as any[]).length > 0) {
          return NextResponse.json({ error: "Article with this barcode already exists" }, { status: 400 })
        }
      }

      // Prepare fields and values for the query - only include fields that exist in the table
      const fields = Object.keys(body)
        .filter((key) => key !== "Art_ID")
        .filter((key) => columnNames.includes(key))

      const values = fields.map((field) => body[field])

      const placeholders = fields.map(() => "?").join(", ")
      const fieldNames = fields.join(", ")

      // Insert the new article
      const query = `INSERT INTO art (${fieldNames}) VALUES (${placeholders})`
      console.log("Insert query:", query)
      console.log("Insert values:", values)

      const [result] = await pool.query(query, values)
      const insertId = (result as any).insertId

      return NextResponse.json({
        Art_ID: insertId,
        ...body,
      })
    }
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      {
        error: "Failed to create article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

