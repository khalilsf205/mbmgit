import { ArticleForm } from "@/components/employer/article-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { getArticleById } from "@/lib/employer-data"

export default async function EditArticlePage({
  params,
}: {
  params: { id: string }
}) {
  const article = await getArticleById(params.id)

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
          <p className="text-muted-foreground">Update article information.</p>
        </div>
      </div>
      <ArticleForm article={article} />
    </div>
  )
}

