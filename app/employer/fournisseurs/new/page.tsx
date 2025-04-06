import { FournisseurForm } from "../components/fournisseur-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewFournisseurPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un Fournisseur</h1>
          <p className="text-muted-foreground">Créez un nouveau fournisseur dans votre système.</p>
        </div>
      </div>
      <FournisseurForm />
    </div>
  )
}

