"use client"

// Client-side authentication utilities
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

// Type for user data
export interface User {
  id: number
  username: string
  email: string
  role: string
}

// Login function for client components
export async function loginUserClient(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    return await response.json()
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

// Logout function for client components
export async function logoutUserClient() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "An error occurred during logout" }
  }
}

// Hook for handling logout with navigation
export function useLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const result = await logoutUserClient()

      if (result.success) {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully.",
        })

        // Force a hard navigation to clear any client-side state
        window.location.href = "/login"
      } else {
        console.error("Logout failed:", result.error)
        toast({
          title: "Error",
          description: result.error || "Failed to log out. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return handleLogout
}

