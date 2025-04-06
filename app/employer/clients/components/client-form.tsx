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
const clientFormSchema = z.object({
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

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientFormProps {
  client?: any
}

export function ClientForm({ client }: ClientFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Create default values based on client prop
  const defaultValues: Partial<ClientFormValues> = {
    nom: client?.nom || "",
    prenom: client?.prenom || "",
    email: client?.email || "",
    tlf: client?.tlf || "",
    mf: client?.mf || "",
    credit: client?.credit || 0,
  }

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
  })

  async function onSubmit(data: ClientFormValues) {
    setIsLoading(true)
    setApiError(null)

    try {
      const url = client ? `/api/employer/clients/${client.id_cl}` : "/api/employer/clients"
      const method = client ? "PUT" : "POST"

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
        title: client ? "Client mis à jour" : "Client créé",
        description: client
          ? `Le client ${data.nom} ${data.prenom} a été mis à jour avec succès.`
          : `Le client ${data.nom} ${data.prenom} a été créé avec succès.`,
      })

      // Navigate back to clients page
      router.push("/employer/clients")
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
              <Button type="button" variant="outline" onClick={() => router.push("/employer/clients")}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {client ? "Mise à jour..." : "Création..."}
                  </>
                ) : client ? (
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

