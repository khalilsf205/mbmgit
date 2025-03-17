"use server"

import pool from "./db"
import bcrypt from "bcrypt"

export async function createUser(userData: {
  name: string
  email: string
  password: string
  type: "client" | "employer"
  status: "active" | "inactive"
  isAdmin: boolean
}) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Determine the role based on isAdmin or type
    const role = userData.isAdmin ? "admin" : userData.type === "employer" ? "employer" : "client"

    // Check if user already exists
    const [existingUsers] = await pool.query("SELECT id FROM user WHERE email = ?", [userData.email])

    if ((existingUsers as any[]).length > 0) {
      throw new Error("User with this email already exists")
    }

    // Insert the new user
    const [result] = await pool.query(
      `INSERT INTO user (username, email, password, role) 
       VALUES (?, ?, ?, ?)`,
      [userData.name, userData.email, hashedPassword, role],
    )

    const insertId = (result as any).insertId
    return { id: insertId, ...userData, password: undefined }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function updateUser(
  id: number,
  userData: {
    name: string
    email: string
    password?: string
    type: "client" | "employer"
    status: "active" | "inactive"
    isAdmin: boolean
  },
) {
  try {
    // Check if user exists
    const [existingUsers] = await pool.query("SELECT id FROM user WHERE id = ?", [id])

    if ((existingUsers as any[]).length === 0) {
      throw new Error("User not found")
    }

    // Determine the role based on isAdmin or type
    const role = userData.isAdmin ? "admin" : userData.type === "employer" ? "employer" : "client"

    // If password is provided, hash it
    let hashedPassword
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10)
    }

    // Update the user
    if (userData.password) {
      await pool.query(
        `UPDATE user 
         SET username = ?, email = ?, password = ?, role = ?
         WHERE id = ?`,
        [userData.name, userData.email, hashedPassword, role, id],
      )
    } else {
      await pool.query(
        `UPDATE user 
         SET username = ?, email = ?, role = ?
         WHERE id = ?`,
        [userData.name, userData.email, role, id],
      )
    }

    return { id, ...userData, password: undefined }
  } catch (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }
}

export async function deleteUser(id: number) {
  try {
    // Check if user exists
    const [existingUsers] = await pool.query("SELECT id FROM user WHERE id = ?", [id])

    if ((existingUsers as any[]).length === 0) {
      throw new Error("User not found")
    }

    // Delete the user
    await pool.query("DELETE FROM user WHERE id = ?", [id])

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }
}

export async function updateProfile(
  id: number,
  data: {
    username: string
    email: string
    currentPassword?: string
    newPassword?: string
  },
) {
  try {
    // Check if user exists
    const [users] = await pool.query("SELECT id, username, email, password FROM user WHERE id = ?", [id])

    const userArray = users as any[]
    if (userArray.length === 0) {
      return { success: false, error: "User not found" }
    }

    const user = userArray[0]

    // If changing password, verify current password
    if (data.currentPassword && data.newPassword) {
      const passwordMatch = await bcrypt.compare(data.currentPassword, user.password)
      if (!passwordMatch) {
        return { success: false, error: "Current password is incorrect" }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(data.newPassword, 10)

      // Update user with new password
      await pool.query("UPDATE user SET username = ?, email = ?, password = ? WHERE id = ?", [
        data.username,
        data.email,
        hashedPassword,
        id,
      ])
    } else {
      // Update user without changing password
      await pool.query("UPDATE user SET username = ?, email = ? WHERE id = ?", [data.username, data.email, id])
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

