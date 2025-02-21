import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ChevronLeft, Mail } from 'lucide-react'
import Link from 'next/link'

const productCategories = {
  accessoire_rideau: [
    { id: 1, name: 'Lames', image: '/lamec.jpg', description: 'Lames pour rideau métallique' },
    { id: 2, name: 'Boite a ressort', image: '/boite_ressort.kpg.jpg', description: 'Boîte à ressort pour rideau métallique' },
    { id: 3, name: 'Ressort', image: '/ressort.jpg', description: 'Ressort pour rideau métallique' },
    { id: 4, name: 'Support universel', image: '/support_universel.jpg', description: 'Support universel pour rideau métallique' },
    { id: 5, name: 'Glissiere', image: '/glissiere.jpg', description: 'Glissière pour rideau métallique' },
    { id: 6, name: 'Flasque', image: '/flasque.jpg', description: 'Flasque pour rideau métallique' },
  ],
  automatisme_portail: [
    { id: 1, name: 'Crémaillères', image: '/cremaillere.jpg', description: 'Crémaillères pour portail automatique' },
    { id: 2, name: 'Moteur collisant Beninca', image: '/beninca.jpg', description: 'Moteur coulissant Beninca pour portail automatique' },
    { id: 3, name: 'Moteur collisant Oxygene', image: '/oxygene.jpg', description: 'Moteur coulissant Oxygene pour portail automatique' },
    { id: 4, name: 'Moteur collisant Somphy', image: '/somphy.jpg', description: 'Moteur coulissant Somphy pour portail automatique' },
  ],
  carrosserie: [
    { id: 1, name: 'Laque', image: '/laq.jpg', description: 'Laque pour carrosserie' },
    { id: 2, name: 'Tournevis', image: '/tour.jpg', description: 'Tournevis pour carrosserie' },
    { id: 3, name: 'Vis', image: '/vis.jpg', description: 'Vis pour carrosserie' },
    { id: 4, name: 'Chinyoure', image: '/chin.jpg', description: 'Chinyoure pour carrosserie' },
  ],
  fer_forge: [
    { id: 1, name: 'Fer Carré', image: '/fc.jpg', description: 'Fer carré pour fer forgé' },
    { id: 2, name: 'Fer Rond', image: '/fr.jpg', description: 'Fer rond pour fer forgé' },
    { id: 3, name: 'Fer Plat', image: '/fp.jpg', description: 'Fer plat pour fer forgé' },
    { id: 4, name: 'Tube Carré', image: '/tc.jpg', description: 'Tube carré pour fer forgé' },
    { id: 5, name: 'Tube Rond', image: '/tro.jpg', description: 'Tube rond pour fer forgé' },
    { id: 6, name: 'Tube Rectangulaire', image: '/tr.jpg', description: 'Tube rectangulaire pour fer forgé' },
    { id: 7, name: 'Corniere', image: '/cor.jpg', description: 'Cornière pour fer forgé' },
  ],
  portail_battant: [
    { id: 1, name: 'Plexyglass', image: '/plexy.jpg', description: 'Plexiglass pour portail battant' },
    { id: 2, name: 'Polycarbon', image: '/poly.jpg', description: 'Polycarbon pour portail battant' },
    { id: 3, name: 'Plaques inccasables', image: '/plq_inc.jpg', description: 'Plaques incassables pour portail battant' },
    { id: 4, name: 'Alucobond', image: '/alucobond.jpg', description: 'Alucobond pour portail battant' },
  ],
  portail_coulissant: [
    { id: 1, name: 'Galet métallique', image: '/galet.jpg', description: 'Galet métallique pour portail coulissant' },
    { id: 2, name: 'Guide a 4 roue', image: '/guide.jpg', description: 'Guide à 4 roues pour portail coulissant' },
    { id: 3, name: 'Arrettoire', image: '/arret.jpg', description: 'Arrêtoir pour portail coulissant' },
    { id: 4, name: 'Lampe Clignotante', image: '/lampe.jpg', description: 'Lampe clignotante pour portail coulissant' },
  ],
  rideau_metallique: [
    { id: 1, name: 'Moteur Rideau LiftFaster', image: '/liftfaster.jpg', description: 'Moteur LiftFaster pour rideau métallique' },
    { id: 2, name: 'Moteur Rideau Eldino', image: '/eldino.jpg', description: 'Moteur Eldino pour rideau métallique' },
    { id: 3, name: 'Moteur Rideau Pujol', image: '/pujol.jpg', description: 'Moteur Pujol pour rideau métallique' },
    { id: 4, name: 'Moteur Rideau ACM', image: '/acm.jpg', description: 'Moteur ACM pour rideau métallique' },
  ],
  serrure: [
    { id: 1, name: 'Serrure port Normal', image: '/sen.jpg', description: 'Serrure pour porte normale' },
    { id: 2, name: 'Serrure port Rideau', image: '/ser.jpg', description: 'Serrure pour rideau métallique' },
    { id: 3, name: 'Serrure port Collissant', image: '/sec.jpg', description: 'Serrure pour porte coulissante' },
    { id: 4, name: 'Serrure port Bascullant', image: '/seb.jpg', description: 'Serrure pour porte basculante' },
  ],
}

const categoryNames: { [key: string]: string } = {
  accessoire_rideau: "Accessoire rideau métallique",
  automatisme_portail: "Automatisme portail",
  carrosserie: "Quincaillerie",
  fer_forge: "Fer Forgé",
  portail_battant: "Accessoire portail battant",
  portail_coulissant: "Accessoire portail coulissant",
  rideau_metallique: "Automatisme rideau métallique",
  serrure: "Serrures"
}

export default function ProductPage({ params }: { params: { category: string, id: string } }) {
  const category = productCategories[params.category as keyof typeof productCategories]
  const product = category?.find(p => p.id === parseInt(params.id))
  
  if (!product) {
    return <div>Produit non trouvé</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link 
            href={`/produit/${params.category}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour aux {categoryNames[params.category] || params.category}
          </Link>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative h-[300px] md:h-[400px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 mb-2 capitalize">{categoryNames[params.category] || params.category}</p>
              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <Button className="w-full md:w-auto flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Demander plus d&apos;informations
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

