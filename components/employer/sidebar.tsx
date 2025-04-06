"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ClipboardCheck,
  Settings,
  LogOut,
  UserCircle,
  Store,
  Bug,
} from "lucide-react"
import { useLogout } from "@/lib/auth-client"

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/employer",
    icon: LayoutDashboard,
  },
  {
    name: "Articles",
    href: "/employer/articles",
    icon: Package,
  },
  {
    name: "Fournisseurs",
    href: "/employer/fournisseurs",
    icon: Store,
  },
  {
    name: "Clients",
    href: "/employer/clients",
    icon: Users,
  },
  {
    name: "Bons de Livraison",
    href: "/employer/bons-livraison",
    icon: Truck,
  },
  {
    name: "Bons de Réception",
    href: "/employer/bons-reception",
    icon: ClipboardCheck,
  },
  {
    name: "Profile",
    href: "/employer/profile",
    icon: UserCircle,
  },
  {
    name: "Settings",
    href: "/employer/settings",
    icon: Settings,
  },
  {
    name: "Debug",
    href: "/employer/debug",
    icon: Bug,
  },
]

export function EmployerSidebar() {
  const pathname = usePathname()
  const handleLogout = useLogout()

  return (
    <div className="hidden border-r bg-background md:flex md:w-64 md:flex-col">
      <div className="flex flex-col h-full">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/employer" className="flex items-center gap-2">
            <span className="font-bold text-xl">Employer Panel</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

