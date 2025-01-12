import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'

export default function prix_articles() {
  return (
    <div className="min-h-screen flex flex-col ">
      <NavBar />
      
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-12">jadet 3lik ya3tek 3asba</h1>
        </div>
      </main>

      <Footer />
    </div>
  )
}

