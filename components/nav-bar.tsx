'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, LogOut, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const productCategories = [
  { title: "Accessoire rideau métallique", href: "/produit/accessoire_rideau" },
  { title: "Accessoire portail coulissant", href: "/produit/portail_coulissant" },
  { title: "Accessoire portail battant", href: "/produit/portail_battant" },
  { title: "Automatisme portail", href: "/produit/automatisme_portail" },
  { title: "Automatisme rideau métallique", href: "/produit/rideau_metallique" },
  { title: "Motif fer forgé", href: "/produit/fer_forge" },
  { title: "Accessoires carrosserie industrielle", href: "/produit/carrosserie" },
  { title: "Serrure", href: "/produit/serrure" }
]

export function NavBar() {
  const [isHovered, setIsHovered] = useState(false)
  const [user, setUser] = useState<{ username: string } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await fetch('/api/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // If the token is invalid, clear it from localStorage
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          setUser(null);
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <nav className="bg-gradient-to-r from-red-800 to-red-700 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            MBM
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-gray-200 transition-colors">
              Accueil
            </Link>
            
            <div 
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button 
                className="flex items-center gap-1 hover:text-gray-200 transition-colors focus:outline-none"
              >
                Produit
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    {productCategories.map((category, index) => (
                      <Link
                        key={category.title}
                        href={category.href}
                        className={`block px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-red-50`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: 'fadeIn 0.5s ease-out forwards',
                        }}
                      >
                        {category.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link href="/actualites" className="hover:text-gray-200 transition-colors">
              Actualités
            </Link>
            <Link href="/contact" className="hover:text-gray-200 transition-colors">
              Contact
            </Link>
          </div>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/prix_articles" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
              <ShoppingCart className="h-4 w-4" />
              Prix d'articles
            </Link>
            <span className="text-sm">{user.username}</span>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 hover:text-gray-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
            Connexion
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  )
}

