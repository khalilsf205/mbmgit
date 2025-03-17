"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useLogout } from "@/lib/auth-client"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function LogoutButton({ variant = "default", className }: LogoutButtonProps) {
  const handleLogout = useLogout()

  return (
    <Button variant={variant} className={className} onClick={handleLogout} aria-label="Logout">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}

