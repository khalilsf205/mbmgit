import { ArticleForm } from "@/components/employer/article-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/employer/articles">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Article</h1>
          <p className="text-muted-foreground">Create a new article in your inventory.</p>
        </div>
      </div>
      <ArticleForm />
    </div>
  )
}

