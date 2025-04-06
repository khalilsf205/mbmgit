"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Article {
  Art_ID?: number
  id?: number
  Art_CodBar?: string | number
  code?: string | number
  Categorie_ID?: number
  Art_Serie?: number
  Art_Desig?: string
  designation?: string
  Art_Unite?: string | number
  unit?: string
  Art_PuAcht?: number
  price?: number
  Art_RemF?: number
  Art_Tva?: number
  Art_PURv?: number
  Art_PrMinEX?: number
  Art_Putv?: number
  Art_Remplac?: number
  Art_Fodec?: number
  Art_Frs1?: number
  Art_Frs2?: number
  Art_Frs3?: number
  Art_StkIni?: number
  quantity?: number
  Art_StkMini?: number
  Art_StkMaxi?: number
  Societe_id?: number
  Art_RefFr?: string
  Art_NewField?: string
}

interface ArticleTableProps {
  lowStock?: boolean
  searchQuery?: string
}

export function ArticleTable({ lowStock = false, searchQuery = "" }: ArticleTableProps) {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Use a ref to track mounted state
  const isMountedRef = useRef(true)

  // Use a ref to track pending delete operations
  const pendingDeletesRef = useRef<Set<number>>(new Set())

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchArticles = async () => {
      if (!isMountedRef.current) return

      try {
        setLoading(true)
        setError(null)

        // Build the URL with search parameter if provided
        let url = `/api/employer/articles`
        const params = new URLSearchParams()

        if (lowStock) {
          params.append("lowStock", "true")
        }

        if (searchQuery && searchQuery.trim() !== "") {
          params.append("search", searchQuery)
        }

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        console.log("Fetching articles with URL:", url)

        const response = await fetch(url, { signal })

        if (!isMountedRef.current) return

        if (response.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please log in to view articles.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (!isMountedRef.current) return

        // Filter out any articles that are pending deletion
        const filteredData = data.filter((article: Article) => !pendingDeletesRef.current.has(getId(article)))

        // Sort articles alphabetically by designation
        const sortedData = [...filteredData].sort((a, b) => {
          const designationA = getDesignation(a).toLowerCase()
          const designationB = getDesignation(b).toLowerCase()
          return designationA.localeCompare(designationB)
        })

        setArticles(sortedData)
      } catch (error) {
        if (!isMountedRef.current) return

        if (error instanceof Error && error.name === "AbortError") {
          return // Ignore aborted requests
        }

        console.error("Error fetching articles:", error)
        setError(error instanceof Error ? error.message : "Failed to load articles")

        toast({
          title: "Error",
          description: "Failed to load articles. Please try again.",
          variant: "destructive",
        })
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchArticles()

    return () => {
      controller.abort()
      // Clear any pending deletes when unmounting
      pendingDeletesRef.current.clear()
      isMountedRef.current = false
    }
  }, [lowStock, refreshKey, router, searchQuery])

  const handleDeleteClick = (articleId: number) => {
    setArticleToDelete(articleId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = useCallback(async () => {
    if (!articleToDelete) return

    try {
      setIsDeleting(true)

      // 1. Immediately close the dialog
      setDeleteDialogOpen(false)

      // 2. Make the API call
      const response = await fetch(`/api/employer/articles/${articleToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete article")
      }

      // 3. Show success toast
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully.",
      })

      // 4. Force a complete page refresh
      window.location.reload()
    } catch (error) {
      console.error("Error deleting article:", error)

      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      })

      // Still refresh the data on error
      setRefreshKey((prev) => prev + 1)
    } finally {
      if (isMountedRef.current) {
        setArticleToDelete(null)
        setIsDeleting(false)
      }
    }
  }, [articleToDelete])

  const formatPrice = (price: number) => {
    // Add 19% TVA to the price
    const priceWithTVA = price * 1.19
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND" }).format(priceWithTVA)
  }

  // Helper function to get the ID field regardless of table schema
  const getId = (article: Article): number => {
    return (article.Art_ID || article.id || 0) as number
  }

  // Helper function to get the code field regardless of table schema
  const getCode = (article: Article) => article.Art_CodBar || article.code

  // Helper function to get the designation field regardless of table schema
  const getDesignation = (article: Article) => article.Art_Desig || article.designation || ""

  // Helper function to get the purchase price field regardless of table schema
  const getPurchasePrice = (article: Article) => article.Art_PuAcht || article.price || 0

  // Helper function to get the sale price field regardless of table schema
  const getSalePrice = (article: Article) => article.Art_PURv || article.price || 0

  // Helper function to get the stock field regardless of table schema
  const getStock = (article: Article) => article.Art_StkIni || article.quantity || 0

  // Helper function to get the minimum stock field regardless of table schema
  const getMinStock = (article: Article) => article.Art_StkMini || 5 // Default to 5 if not available

  return (
    <>
      <div className="rounded-md border">
        <Table key={`article-table-${refreshKey}`}>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Prix Achat</TableHead>
              <TableHead>Prix Vente</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading articles...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-destructive">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <p>Error loading articles: {error}</p>
                    <Button variant="outline" size="sm" onClick={() => setRefreshKey((prev) => prev + 1)}>
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No articles found.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => {
                const id = getId(article)
                return (
                  <TableRow key={`article-${id}`}>
                    <TableCell>{getCode(article)}</TableCell>
                    <TableCell>{getDesignation(article)}</TableCell>
                    <TableCell>{formatPrice(getPurchasePrice(article))}</TableCell>
                    <TableCell>{formatPrice(getSalePrice(article))}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStock(article)}
                        {getStock(article) <= getMinStock(article) && (
                          <Badge variant="destructive" className="ml-2">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/employer/articles/${id}`} className="flex items-center">
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center text-destructive focus:text-destructive"
                            onClick={() => handleDeleteClick(id as number)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the article and remove its data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

