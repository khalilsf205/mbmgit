import { UserForm } from "@/components/admin/user-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { getUserById } from "@/lib/data"

export default async function EditUserPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getUserById(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground">Update user information.</p>
        </div>
      </div>
      <UserForm user={user} />
    </div>
  )
}

