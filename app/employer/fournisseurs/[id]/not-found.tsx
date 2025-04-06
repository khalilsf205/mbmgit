import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FournisseurNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Fournisseur non trouvé</h1>
      <p className="text-muted-foreground mb-8">Le fournisseur que vous recherchez n'existe pas ou a été supprimé.</p>
      <Button asChild>
        <Link href="/employer/fournisseurs">Retour à la liste des fournisseurs</Link>
      </Button>
    </div>
  )
}

