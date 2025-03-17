"use client"

import React, { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Define the type for user data (match your database schema)
type User = {
  id: string
  username: string
  email: string
  created_at: string // assuming the date is in string format
}

export function RecentUsers() {
  const [recentUsers, setRecentUsers] = useState<User[]>([])

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/users") // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data: User[] = await response.json()
        setRecentUsers(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Function to extract initials from the username
  const getInitials = (username: string) => {
    if (!username) return "??"
    const names = username.split(" ")
    const initials = names.map((n) => n[0]).join("")
    return initials.substring(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-4">
      {recentUsers.map((user) => (
        <div key={user.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(user.created_at).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  )
}