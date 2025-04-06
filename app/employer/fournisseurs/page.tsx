"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { FournisseurTable } from "./components/fournisseur-table"

export default function FournisseursPage() {
  const [searchInput, setSearchInput] = useState("")
  const debouncedSearch = useDebounce(searchInput, 300)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
          <p className="text-muted-foreground">Gérez vos fournisseurs et leurs informations.</p>
        </div>
        <Button asChild>
          <Link href="/employer/fournisseurs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un Fournisseur
          </Link>
        </Button>
      </div>

      {/* Sticky search container */}
      <div className="sticky top-0 z-10 bg-background pt-2 pb-4 -mx-4 px-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des fournisseurs..."
            className="pl-8 w-full md:max-w-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      {/* Table content */}
      <div className="mt-4">
        <FournisseurTable searchQuery={debouncedSearch} />
      </div>
    </div>
  )
}

