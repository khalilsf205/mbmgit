import Image from 'next/image'

export function ProductsSection() {
  const products = [
    {
      name: "Poste Sodure",
      image: "/poste.jpg?height=200&width=300",
    },
    {
      name: "Moteur porte collisant",
      image: "/beninca.jpg?height=200&width=300",
    },
    {
      name: "Toles larmée",
      image: "/zing.jpg?height=200&width=300",
    }
  ]

  return (
    <section id='products-section' className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-8 mb-8">
          <h2 className="text-3xl font-bold text-black">Produits</h2>
          <Image
            src="/quality.jpg?height=100&width=100"
            alt="Quality Guarantee"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.name} className="bg-white p-4 rounded-lg shadow-md">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="w-full object-cover rounded-md"
              />
              <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

