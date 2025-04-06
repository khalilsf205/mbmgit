import { FournisseurForm } from "../components/fournisseur-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { getFournisseurById } from "@/lib/employer-data"
import { notFound } from "next/navigation"

export default async function EditFournisseurPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    // For debugging
    console.log("Fetching fournisseur with ID:", params.id)

    const fournisseur = await getFournisseurById(params.id)

    // For debugging
    console.log("Fournisseur data:", fournisseur)

    if (!fournisseur) {
      notFound()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/employer/fournisseurs">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modifier le Fournisseur</h1>
            <p className="text-muted-foreground">
              Modification des informations pour {fournisseur.nom} {fournisseur.prenom}
            </p>
          </div>
        </div>
        <FournisseurForm fournisseur={fournisseur} />
      </div>
    )
  } catch (error) {
    console.error("Error loading fournisseur:", error)
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/employer/fournisseurs">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Erreur</h1>
            <p className="text-muted-foreground">Impossible de charger les informations du fournisseur</p>
          </div>
        </div>
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Une erreur s'est produite lors du chargement des données du fournisseur. Veuillez réessayer.
          {error instanceof Error && <div className="mt-2 text-sm">Détails: {error.message}</div>}
        </div>
        <Button asChild>
          <Link href="/employer/fournisseurs">Retour à la liste des fournisseurs</Link>
        </Button>
      </div>
    )
  }
}

