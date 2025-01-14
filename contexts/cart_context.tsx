'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { Article } from '@/types/article'

type CartItem = {
 article: Article;
 quantity: number;
}

type CartContextType = {
 items: CartItem[];
 addToCart: (article: Article) => void;
 removeFromCart: (articleId: number) => void;
 isOpen: boolean;
 openSidebar: () => void;
 closeSidebar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
 const [items, setItems] = useState<CartItem[]>([])
 const [isOpen, setIsOpen] = useState(false)

 const addToCart = useCallback((article: Article) => {
   setItems(currentItems => {
     const existingItem = currentItems.find(item => item.article.id === article.id)
     
     if (existingItem) {
       return currentItems.map(item =>
         item.article.id === article.id
           ? { ...item, quantity: item.quantity + 1 }
           : item
       )
     }

     return [...currentItems, { article, quantity: 1 }]
   })
   setIsOpen(true)
 }, [])

 const removeFromCart = useCallback((articleId: number) => {
   setItems(currentItems => 
     currentItems.filter(item => item.article.id !== articleId)
   )
 }, [])

 const openSidebar = useCallback(() => setIsOpen(true), [])
 const closeSidebar = useCallback(() => setIsOpen(false), [])

 return (
   <CartContext.Provider value={{ items, addToCart, removeFromCart, isOpen, openSidebar, closeSidebar }}>
     {children}
   </CartContext.Provider>
 )
}

export function useCart() {
 const context = useContext(CartContext)
 if (context === undefined) {
   throw new Error('useCart must be used within a CartProvider')
 }
 return context
}

