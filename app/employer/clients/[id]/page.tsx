import { ClientForm } from "../components/client-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { getClientById } from "@/lib/employer-data"
import { notFound } from "next/navigation"

export default async function EditClientPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    // For debugging
    console.log("Fetching client with ID:", params.id)

    const client = await getClientById(params.id)

    // For debugging
    console.log("Client data:", client)

    if (!client) {
      notFound()
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/employer/clients">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Modifier le Client</h1>
            <p className="text-muted-foreground">
              Modification des informations pour {client.nom} {client.prenom}
            </p>
          </div>
        </div>
        <ClientForm client={client} />
      </div>
    )
  } catch (error) {
    console.error("Error loading client:", error)
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/employer/clients">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Erreur</h1>
            <p className="text-muted-foreground">Impossible de charger les informations du client</p>
          </div>
        </div>
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Une erreur s'est produite lors du chargement des données du client. Veuillez réessayer.
          {error instanceof Error && <div className="mt-2 text-sm">Détails: {error.message}</div>}
        </div>
        <Button asChild>
          <Link href="/employer/clients">Retour à la liste des clients</Link>
        </Button>
      </div>
    )
  }
}

