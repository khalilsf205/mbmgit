'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Check, X, Search } from 'lucide-react'
import { useCart } from '@/contexts/cart_context'
import { Article } from '@/types/article'

export function ArticlesTable({ articles }: { articles: Article[] }) {
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleAddToCart = (article: Article) => {
    addToCart(article)
    setAddedToCart(prev => [...prev, article.id])
    
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== article.id))
    }, 2000)
  }

  const formatPrice = (prix: number): string => {
    return prix.toFixed(3) + ' TND'
  }

  const filteredAndSortedArticles = useMemo(() => {
    return articles
      .filter(article => 
        article.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [articles, searchQuery])

  const getArticleKey = (article: Article): number => {
    return article.id;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500">
        {filteredAndSortedArticles.length} article{filteredAndSortedArticles.length !== 1 ? 's' : ''} trouvé{filteredAndSortedArticles.length !== 1 ? 's' : ''}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Article</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-center">Disponibilité</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedArticles.map((article) => (
              <TableRow key={getArticleKey(article)}>
                <TableCell className="font-medium">{article.name}</TableCell>
                <TableCell className="text-right">{formatPrice(article.prix*1.19)}</TableCell>
                <TableCell className="text-center">
                  {article.inStock ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-4 h-4 mr-1" />
                      En stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <X className="w-4 h-4 mr-1" />
                      Rupture
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleAddToCart(article)}
                    disabled={!article.inStock || addedToCart.includes(article.id)}
                    variant={addedToCart.includes(article.id) ? "secondary" : "default"}
                  >
                    {addedToCart.includes(article.id) ? (
                      "Ajouté ✓"
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Ajouter au panier
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredAndSortedArticles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  Aucun article trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

