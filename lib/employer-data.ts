import pool from "./db"
import { getCurrentUser } from "./auth"

export async function getArticleById(id: string | number) {
  try {
    const user = await getCurrentUser()

    // For debugging
    console.log("Current user in getArticleById:", user ? { id: user.id, role: user.role } : "No user found")

    if (!user) {
      throw new Error("Not authenticated")
    }

    // Temporarily allow any authenticated user to access this data
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   throw new Error("Unauthorized")
    // }

    const [rows] = await pool.query(
      `SELECT Art_ID, Art_CodBar, Categorie_ID, Art_Serie, Art_Desig, Art_Unite, Art_PuAcht, Art_RemF, Art_Tva, Art_PURv, Art_PrMinEX, Art_Putv, Art_Remplac, Art_Fodec, Art_Frs1, Art_Frs2, Art_Frs3, Art_StkIni, Art_StkMini, Art_StkMaxi, Societe_id, Art_RefFr, Art_NewField
       FROM art 
       WHERE Art_ID = ?`,
      [id],
    )

    const articles = rows as any[]
    if (articles.length === 0) return null

    return articles[0]
  } catch (error) {
    console.error("Error fetching article by ID:", error)
    throw new Error("Failed to fetch article")
  }
}

export async function getFournisseurById(id: string | number) {
  try {
    const user = await getCurrentUser()

    // For debugging
    console.log("Current user in getFournisseurById:", user ? { id: user.id, role: user.role } : "No user found")

    if (!user) {
      throw new Error("Not authenticated")
    }

    // Temporarily allow any authenticated user to access this data
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   throw new Error("Unauthorized")
    // }

    // Check if the fournisseur table exists
    try {
      const [tables] = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = 'fournisseur'
      `)

      const tableExists = (tables as any[]).length > 0
      if (!tableExists) {
        console.error("Fournisseur table does not exist")
        throw new Error("Fournisseur table not found in database")
      }
    } catch (error) {
      console.error("Error checking for fournisseur table:", error)
      throw error
    }

    const [rows] = await pool.query(
      `SELECT id_fr, nom, prenom, email, tlf, mf, credit
       FROM fournisseur 
       WHERE id_fr = ?`,
      [id],
    )

    const fournisseurs = rows as any[]
    if (fournisseurs.length === 0) return null

    return fournisseurs[0]
  } catch (error) {
    console.error("Error fetching fournisseur by ID:", error)
    throw new Error("Failed to fetch fournisseur")
  }
}

export async function getClientById(id: string | number) {
  try {
    const user = await getCurrentUser()

    // For debugging
    console.log("Current user in getClientById:", user ? { id: user.id, role: user.role } : "No user found")

    if (!user) {
      throw new Error("Not authenticated")
    }

    // Temporarily allow any authenticated user to access this data
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   throw new Error("Unauthorized")
    // }

    // Check if the client_local table exists
    try {
      const [tables] = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() AND table_name = 'client_local'
      `)

      const tableExists = (tables as any[]).length > 0
      if (!tableExists) {
        console.error("Client_local table does not exist")
        throw new Error("Client_local table not found in database")
      }
    } catch (error) {
      console.error("Error checking for client_local table:", error)
      throw error
    }

    const [rows] = await pool.query(
      `SELECT id_cl, nom, prenom, email, tlf, mf, credit
       FROM client_local 
       WHERE id_cl = ?`,
      [id],
    )

    const clients = rows as any[]
    if (clients.length === 0) return null

    return clients[0]
  } catch (error) {
    console.error("Error fetching client by ID:", error)
    throw new Error("Failed to fetch client")
  }
}

export async function getFournisseurs(options: { search?: string } = {}) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    // Temporarily allow any authenticated user to access this data
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   throw new Error("Unauthorized")
    // }

    let query = `
      SELECT id_fr, nom, prenom, email, tlf, mf, credit
      FROM fournisseur
    `
    const params: any[] = []

    if (options.search) {
      query += ` WHERE nom LIKE ? OR prenom LIKE ? OR email LIKE ? OR mf LIKE ?`
      params.push(`%${options.search}%`, `%${options.search}%`, `%${options.search}%`, `%${options.search}%`)
    }

    query += ` ORDER BY nom, prenom`

    const [rows] = await pool.query(query, params)
    return rows as any[]
  } catch (error) {
    console.error("Error fetching fournisseurs:", error)
    throw new Error("Failed to fetch fournisseurs")
  }
}

export async function getClients(options: { search?: string } = {}) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      throw new Error("Not authenticated")
    }

    // Temporarily allow any authenticated user to access this data
    // Remove this condition in production and use the proper role check
    // if (user.role !== "employer") {
    //   throw new Error("Unauthorized")
    // }

    let query = `
      SELECT id_cl, nom, prenom, email, tlf, mf, credit
      FROM client_local
    `
    const params: any[] = []

    if (options.search) {
      query += ` WHERE nom LIKE ? OR prenom LIKE ? OR email LIKE ? OR mf LIKE ?`
      params.push(`%${options.search}%`, `%${options.search}%`, `%${options.search}%`, `%${options.search}%`)
    }

    query += ` ORDER BY nom, prenom`

    const [rows] = await pool.query(query, params)
    return rows as any[]
  } catch (error) {
    console.error("Error fetching clients:", error)
    throw new Error("Failed to fetch clients")
  }
}

