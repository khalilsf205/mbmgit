import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/logout-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ClientDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "client") {
    // Redirect to appropriate dashboard based on role
    if (user.role === "admin") {
      redirect("/admin")
    } else if (user.role === "employer") {
      redirect("/employer")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-6">
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-lg font-semibold">Client Dashboard</h1>
          <LogoutButton variant="outline" />
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Welcome, {user.username}!</h2>
            <p className="text-muted-foreground">Here's your client dashboard overview.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-muted-foreground">Username:</div>
                  <div>{user.username}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-muted-foreground">Email:</div>
                  <div>{user.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium text-muted-foreground">Role:</div>
                  <div className="capitalize">{user.role}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No recent activity to display.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You have no new notifications.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

