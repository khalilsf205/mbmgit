import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
        <Link href="/" className="text-2xl font-bold">
            MBM
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <address className="not-italic text-gray-400">
            <p>Rue Ezzouhour</p>
            <p>Kélibia Nabeul, TUNISIE</p>
            <p>Tel:+216 98 477 555</p>
            <p>Email:stembm22@gmail.com</p>
          </address>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/" className="hover:text-white">Accueil</Link></li>
            <li><Link href="#about-section" className="hover:text-white">A propos</Link></li>
            <li><Link href="#products-section" className="hover:text-white">Produits</Link></li>
            <li><Link href="/actualites" className="hover:text-white">Actualités</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

