import pool from "./db"

export async function getUserById(id: number) {
  try {
    const [rows] = await pool.query("SELECT id, username, email, role, is_active FROM user WHERE id = ?", [id])

    const users = rows as any[]
    if (users.length === 0) return null

    const user = users[0]

    // Map database fields to form fields
    return {
      id: user.id,
      name: user.username,
      email: user.email,
      type: user.role === "admin" ? "client" : user.role, // Default to client for admin users in the form
      status: "active", // Default status
      isAdmin: user.role === "admin",
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    throw new Error("Failed to fetch user")
  }
}

export async function getUsers(role?: string) {
  try {
    let query = "SELECT id, username, email, role, created_at FROM user"
    const params = []

    if (role && role !== "all") {
      query += " WHERE role = ?"
      params.push(role)
    }

    query += " ORDER BY created_at DESC"

    const [rows] = await pool.query(query, params)
    return rows as any[]
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

