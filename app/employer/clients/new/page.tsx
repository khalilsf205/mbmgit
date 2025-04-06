import { ClientForm } from "../components/client-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewClientPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Ajouter un Client</h1>
          <p className="text-muted-foreground">Créez un nouveau client dans votre système.</p>
        </div>
      </div>
      <ClientForm />
    </div>
  )
}

