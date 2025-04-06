"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Define the schema for the form
const fournisseurFormSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  tlf: z.string().min(8, {
    message: "Le numéro de téléphone doit contenir au moins 8 caractères.",
  }),
  mf: z.string().min(1, {
    message: "Le matricule fiscal est requis.",
  }),
  credit: z.coerce.number().default(0),
})

type FournisseurFormValues = z.infer<typeof fournisseurFormSchema>

interface FournisseurFormProps {
  fournisseur?: any
}

export function FournisseurForm({ fournisseur }: FournisseurFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Create default values based on fournisseur prop
  const defaultValues: Partial<FournisseurFormValues> = {
    nom: fournisseur?.nom || "",
    prenom: fournisseur?.prenom || "",
    email: fournisseur?.email || "",
    tlf: fournisseur?.tlf || "",
    mf: fournisseur?.mf || "",
    credit: fournisseur?.credit || 0,
  }

  const form = useForm<FournisseurFormValues>({
    resolver: zodResolver(fournisseurFormSchema),
    defaultValues,
  })

  async function onSubmit(data: FournisseurFormValues) {
    setIsLoading(true)
    setApiError(null)

    try {
      const url = fournisseur ? `/api/employer/fournisseurs/${fournisseur.id_fr}` : "/api/employer/fournisseurs"
      const method = fournisseur ? "PUT" : "POST"

      console.log(`${method} request to ${url} with data:`, data)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error details if available
        let errorMessage = `Server responded with status: ${response.status}`

        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.details || errorMessage
        } catch (parseError) {
          // If JSON parsing fails, use the status text
          errorMessage = `${errorMessage} (${response.statusText})`
          console.error("Error parsing error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      // Only try to parse JSON if the response is ok
      let responseData
      try {
        responseData = await response.json()
      } catch (parseError) {
        console.error("Error parsing success response:", parseError)
        throw new Error("Invalid response format from server")
      }

      toast({
        title: fournisseur ? "Fournisseur mis à jour" : "Fournisseur créé",
        description: fournisseur
          ? `Le fournisseur ${data.nom} ${data.prenom} a été mis à jour avec succès.`
          : `Le fournisseur ${data.nom} ${data.prenom} a été créé avec succès.`,
      })

      // Navigate back to fournisseurs page
      router.push("/employer/fournisseurs")
      router.refresh()
    } catch (error) {
      console.error("Form submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Une erreur s'est produite. Veuillez réessayer."
      setApiError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {apiError && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{apiError}</div>}

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jean.dupont@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tlf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+216 12 345 678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="mf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matricule Fiscal</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crédit (TND)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/employer/fournisseurs")}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {fournisseur ? "Mise à jour..." : "Création..."}
                  </>
                ) : fournisseur ? (
                  "Mettre à jour"
                ) : (
                  "Créer"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

