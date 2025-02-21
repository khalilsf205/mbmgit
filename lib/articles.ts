import { Article } from '@/types/article'
import pool from '@/lib/db'

export async function getArticles(): Promise<Article[]> {
  try {
    const [rows] = await pool.query('SELECT ART_ID, Art_Desig, Art_Putv, Art_StkIni FROM Art')
    
    const articles = (rows as any[]).map(row => ({
      id: row.ART_ID,
      name: row.Art_Desig,
      prix: parseFloat(row.Art_Putv) || 0, 
      inStock: row.Art_StkIni > 0 
    }));

    console.log('Articles fetched successfully:', articles)
    return articles
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}

