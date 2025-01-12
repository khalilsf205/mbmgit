import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ResellerSection() {
  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Vous êtes revendeur ou installateur?</h2>
          <p className="text-xl text-gray-600 mb-6">Contactez-nous pour plus d&apos;informations!</p>
          <Link href="/contact" passHref>
            <Button className="bg-red-500 hover:bg-red-600">
              Nous contacter
            </Button>
          </Link>
        </div>
        <div>
          <Image
            src="/handshake.jpg"
            alt="Business handshake"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
}

