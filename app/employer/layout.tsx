import type React from "react"
import { EmployerSidebar } from "@/components/employer/sidebar"
import { Header } from "@/components/employer/header"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "employer") {
    if (user.role === "admin") {
      redirect("/admin")
    } else if (user.role === "client") {
      redirect("/client")
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <EmployerSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto p-0">{children}</main>
      </div>
    </div>
  )
}

