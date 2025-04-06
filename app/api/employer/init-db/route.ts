import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS article (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        designation VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        unit VARCHAR(20),
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Check if we already have sample data
    const [existingArticles] = await pool.query("SELECT COUNT(*) as count FROM article")
    const count = (existingArticles as any[])[0].count

    if (count === 0) {
      // Insert sample data
      const sampleArticles = [
        {
          code: "ART001",
          designation: "Laptop Dell XPS 13",
          description: "High-performance laptop with 16GB RAM and 512GB SSD",
          price: 1299.99,
          quantity: 15,
          unit: "piece",
          category: "electronics",
        },
        {
          code: "ART002",
          designation: "Office Chair",
          description: "Ergonomic office chair with lumbar support",
          price: 249.99,
          quantity: 8,
          unit: "piece",
          category: "furniture",
        },
        {
          code: "ART003",
          designation: "Wireless Mouse",
          description: "Bluetooth wireless mouse with long battery life",
          price: 39.99,
          quantity: 30,
          unit: "piece",
          category: "electronics",
        },
        {
          code: "ART004",
          designation: "Coffee Beans",
          description: "Premium Arabica coffee beans, 1kg bag",
          price: 24.99,
          quantity: 5,
          unit: "kg",
          category: "food",
        },
        {
          code: "ART005",
          designation: "Desk Lamp",
          description: "LED desk lamp with adjustable brightness",
          price: 49.99,
          quantity: 12,
          unit: "piece",
          category: "electronics",
        },
      ]

      for (const article of sampleArticles) {
        await pool.query(
          `INSERT INTO article (code, designation, description, price, quantity, unit, category) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            article.code,
            article.designation,
            article.description,
            article.price,
            article.quantity,
            article.unit,
            article.category,
          ],
        )
      }

      return NextResponse.json({
        status: "success",
        message: "Database initialized with sample data",
        articlesAdded: sampleArticles.length,
      })
    } else {
      return NextResponse.json({
        status: "success",
        message: "Database already contains data",
        existingArticles: count,
      })
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

