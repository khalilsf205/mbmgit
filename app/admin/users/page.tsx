import { UserTable } from "@/components/admin/user-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your users, both clients and employers.</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search users..." className="pl-8" />
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="employers">Employers</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <UserTable userType="all" />
        </TabsContent>
        <TabsContent value="clients" className="mt-4">
          <UserTable userType="client" />
        </TabsContent>
        <TabsContent value="employers" className="mt-4">
          <UserTable userType="employer" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

