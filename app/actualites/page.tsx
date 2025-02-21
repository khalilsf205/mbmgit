import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import Image from 'next/image'

const newsArticles = [
  {
    id: 1,
    title: "Lancement de notre nouveau moteur pour rideau métallique",
    date: "15 Juin 2024",
    excerpt: "Découvrez notre dernière innovation en matière d'automatisation de rideaux métalliques.",
    image: "/liftfaster.jpg?height=200&width=300"
  },
  {
    id: 2,
    title: "MBM participe au salon de l'industrie 2024",
    date: "3 Mai 2024",
    excerpt: "Retrouvez-nous au stand 42 pour découvrir nos dernières solutions en automatisation.",
    image: "/poste.jpg?height=200&width=300"
  },
  {
    id: 3,
    title: "Nouvelle gamme de serrures haute sécurité",
    date: "20 Avril 2024",
    excerpt: "MBM lance une gamme de serrures renforcées pour une sécurité optimale de vos locaux.",
    image: "/sen.jpg?height=200&width=300"
  }
]

export default function ActualitesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-red-800">Actualités</h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsArticles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{article.date}</p>
                  <p className="text-gray-700">{article.excerpt}</p>
                  <button className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition-colors">
                    Lire la suite
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

