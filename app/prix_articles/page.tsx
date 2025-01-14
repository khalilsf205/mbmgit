import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { ArticlesTable } from './articles_table'
import { CartProvider } from '@/contexts/cart_context'
import { CartSidebar } from '@/components/cart-sidebar'
import { getArticles } from '@/lib/articles'
import { ErrorBoundary } from '@/components/error-boundary'
import { Article } from '@/types/article'  // Import the Article type

export default async function PrixArticles() {
  let articles: Article[] = [];  // Explicitly type articles as Article[]
  let error: Error | null = null;

  try {
    articles = await getArticles();
  } catch (e) {
    console.error('Error in PrixArticles:', e);
    error = e instanceof Error ? e : new Error('An unknown error occurred');
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-12">Liste des Articles</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erreur!</strong>
              <span className="block sm:inline"> Une erreur s'est produite lors du chargement des articles. Veuillez réessayer plus tard.</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12">Liste des Articles</h1>
          <CartProvider>
            <ErrorBoundary fallback={<div>Une erreur s'est produite lors du chargement des articles.</div>}>
              <ArticlesTable articles={articles} />
            </ErrorBoundary>
            <CartSidebar />
          </CartProvider>
        </div>
      </main>

      <Footer />
    </div>
  )
}

