import { Article } from '@/types/article'
import pool from '@/lib/db'

export async function getArticles(): Promise<Article[]> {
  try {
    const [rows] = await pool.query('SELECT * FROM articles')
    console.log('Articles fetched successfully:', rows)
    return rows as Article[]
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error // Re-throw the error to be caught by the error boundary
  }
}

