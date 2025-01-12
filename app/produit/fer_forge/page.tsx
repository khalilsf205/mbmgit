import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'

const products = [
  {
    id: 1,
    name: 'Fer Carré',
    image: '/fc.jpg?height=300&width=400',
    category: 'Fer'
  },
  {
    id: 2,
    name: 'Fer Rond',
    image: '/fr.jpg?height=300&width=400',
    category: 'Fer'
  },
  {
    id: 3,
    name: 'Fer Plat',
    image: '/fp.jpg?height=300&width=400',
    category: 'Fer'
  },
  {
    id: 4,
    name: 'Tube Carré',
    image: '/tc.jpg?height=300&width=400',
    category: 'Tube'
  } ,
  {
    id: 5,
    name: 'Tube Rond',
    image: '/tro.jpg?height=300&width=400',
    category: 'Tube'
  } ,
  {
    id: 6,
    name: 'Tube Rectangulaire',
    image: '/tr.jpg?height=300&width=400',
    category: 'Tube'
  } ,
  {
    id: 7,
    name: 'Corniere',
    image: '/cor.jpg?height=300&width=400',
    category: 'Corniere'
  }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12">Fer Forgé</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/produit/fer_forge/${product.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 ease-in-out group-hover:-translate-y-1">
                  <div className="relative h-64 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <h2 className="text-lg font-semibold group-hover:text-red-800 transition-colors">
                      {product.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

