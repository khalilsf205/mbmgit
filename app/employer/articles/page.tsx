"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/hooks/use-debounce"
import { ArticleTable } from "@/components/employer/article-table"

export default function ArticlesPage() {
  const [searchInput, setSearchInput] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const debouncedSearch = useDebounce(searchInput, 300)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">Manage your inventory of articles and products.</p>
        </div>
        <Button asChild>
          <Link href="/employer/articles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Article
          </Link>
        </Button>
      </div>

      {/* Sticky search and tabs container */}
      <div className="sticky top-0 z-10 bg-background pt-2 pb-4 -mx-4 px-4 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-8 w-full md:max-w-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Articles</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table content */}
      <div className="mt-4">
        {activeTab === "all" ? (
          <ArticleTable searchQuery={debouncedSearch} />
        ) : (
          <ArticleTable lowStock={true} searchQuery={debouncedSearch} />
        )}
      </div>
    </div>
  )
}

