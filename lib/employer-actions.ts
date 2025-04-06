"use server"

import pool from "./db"
import { getCurrentUser } from "./auth"
import { revalidatePath } from "next/cache"

export async function createArticle(articleData: any) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "employer") {
      throw new Error("Unauthorized")
    }

    // Check if article with same barcode already exists
    if (articleData.Art_CodBar) {
      const [existingArticles] = await pool.query("SELECT Art_ID FROM art WHERE Art_CodBar = ?", [
        articleData.Art_CodBar,
      ])
      if ((existingArticles as any[]).length > 0) {
        throw new Error("Article with this barcode already exists")
      }
    }

    // Prepare fields and values for the query
    const fields = Object.keys(articleData).filter((key) => key !== "Art_ID")
    const values = fields.map((field) => articleData[field])

    const placeholders = fields.map(() => "?").join(", ")
    const fieldNames = fields.join(", ")

    // Insert the new article
    const query = `INSERT INTO art (${fieldNames}) VALUES (${placeholders})`
    console.log("Insert query:", query)
    console.log("Insert values:", values)

    const [result] = await pool.query(query, values)
    const insertId = (result as any).insertId

    // Revalidate the articles page
    revalidatePath("/employer/articles")

    return { Art_ID: insertId, ...articleData }
  } catch (error) {
    console.error("Error creating article:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to create article")
  }
}

export async function updateArticle(id: string | number, articleData: any) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "employer") {
      throw new Error("Unauthorized")
    }

    // Check if article exists
    const [existingArticles] = await pool.query("SELECT Art_ID FROM art WHERE Art_ID = ?", [id])

    if ((existingArticles as any[]).length === 0) {
      throw new Error("Article not found")
    }

    // Check if barcode is already used by another article
    if (articleData.Art_CodBar) {
      const [codeCheck] = await pool.query("SELECT Art_ID FROM art WHERE Art_CodBar = ? AND Art_ID != ?", [
        articleData.Art_CodBar,
        id,
      ])
      if ((codeCheck as any[]).length > 0) {
        throw new Error("Another article with this barcode already exists")
      }
    }

    // Prepare fields and values for the query
    const fields = Object.keys(articleData).filter((key) => key !== "Art_ID")
    const setClause = fields.map((field) => `${field} = ?`).join(", ")
    const values = [...fields.map((field) => articleData[field]), id]

    // Update the article
    const query = `UPDATE art SET ${setClause} WHERE Art_ID = ?`
    console.log("Update query:", query)
    console.log("Update values:", values)

    await pool.query(query, values)

    // Revalidate the articles page
    revalidatePath("/employer/articles")
    revalidatePath(`/employer/articles/${id}`)

    return { Art_ID: id, ...articleData }
  } catch (error) {
    console.error("Error updating article:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to update article")
  }
}

export async function deleteArticle(id: string | number) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "employer") {
      throw new Error("Unauthorized")
    }

    // Check if article exists
    const [existingArticles] = await pool.query("SELECT Art_ID FROM art WHERE Art_ID = ?", [id])

    if ((existingArticles as any[]).length === 0) {
      throw new Error("Article not found")
    }

    // Delete the article
    await pool.query("DELETE FROM art WHERE Art_ID = ?", [id])

    // Revalidate the articles page
    revalidatePath("/employer/articles")

    return { success: true }
  } catch (error) {
    console.error("Error deleting article:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to delete article")
  }
}

