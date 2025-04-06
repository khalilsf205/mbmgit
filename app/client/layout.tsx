import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "client") {
    if (user.role === "admin") {
      redirect("/admin")
    } else if (user.role === "employer") {
      redirect("/employer")
    }
  }

  return <div className="flex h-screen bg-background">{children}</div>
}

