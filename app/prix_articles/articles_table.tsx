'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, X } from 'lucide-react'
import { useCart } from '@/contexts/cart_context'
import { Article } from '@/types/article'

export function ArticlesTable({ articles }: { articles: Article[] }) {
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState<number[]>([])

  const handleAddToCart = (article: Article) => {
    addToCart(article)
    setAddedToCart(prev => [...prev, article.id])
    
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== article.id))
    }, 2000)
  }

  return (
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
          {articles.map((article) => (
            <TableRow key={article.id}>
              <TableCell className="font-medium">{article.nom}</TableCell>
              <TableCell className="text-right">{Number(article.prix).toFixed(2)} TND</TableCell>
              <TableCell className="text-center">
                {article.disponibilite ? (
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
                  disabled={!article.disponibilite || addedToCart.includes(article.id)}
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
        </TableBody>
      </Table>
    </div>
  )
}

