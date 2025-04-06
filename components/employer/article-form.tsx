"use client"

import { useState, useEffect } from "react"
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
const articleFormSchema = z.object({
  Art_CodBar: z.string().optional(),
  Categorie_ID: z.coerce.number().int().optional(),
  Art_Serie: z.coerce.number().int().optional(),
  Art_Desig: z.string().min(2, {
    message: "Designation must be at least 2 characters.",
  }),
  Art_Unite: z.coerce.number().int().optional(),
  Art_PuAcht: z.coerce.number().min(0, {
    message: "Purchase price must be a positive number.",
  }),
  Art_RemF: z.coerce.number().min(0).optional(),
  Art_Tva: z.coerce.number().min(0).optional(),
  Art_PURv: z.coerce.number().min(0, {
    message: "Sale price must be a positive number.",
  }),
  Art_PrMinEX: z.coerce.number().min(0).optional(),
  Art_Putv: z.coerce.number().min(0).optional(),
  Art_Remplac: z.coerce.number().min(0).optional(),
  Art_Fodec: z.coerce.number().min(0).optional(),
  Art_Frs1: z.coerce.number().int().optional(),
  Art_Frs2: z.coerce.number().int().optional(),
  Art_Frs3: z.coerce.number().int().optional(),
  Art_StkIni: z.coerce.number().int().min(0, {
    message: "Initial stock must be a positive number.",
  }),
  Art_StkMini: z.coerce.number().int().min(0).optional(),
  Art_StkMaxi: z.coerce.number().int().min(0).optional(),
  Societe_id: z.coerce.number().int().optional(),
  Art_RefFr: z.string().optional(),
  Art_NewField: z.string().optional(),
})

type ArticleFormValues = z.infer<typeof articleFormSchema>

interface ArticleFormProps {
  article?: any
}

export function ArticleForm({ article }: ArticleFormProps = {}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formInitialized, setFormInitialized] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  // Create default values based on article prop
  const getDefaultValues = () => {
    return {
      Art_CodBar: article?.Art_CodBar?.toString() || "",
      Categorie_ID: article?.Categorie_ID || undefined,
      Art_Serie: article?.Art_Serie || undefined,
      Art_Desig: article?.Art_Desig || "",
      Art_Unite: article?.Art_Unite || undefined,
      Art_PuAcht: article?.Art_PuAcht || 0,
      Art_RemF: article?.Art_RemF || 0,
      Art_Tva: article?.Art_Tva || 0,
      Art_PURv: article?.Art_PURv || 0,
      Art_PrMinEX: article?.Art_PrMinEX || 0,
      Art_Putv: article?.Art_Putv || 0,
      Art_Remplac: article?.Art_Remplac || 0,
      Art_Fodec: article?.Art_Fodec || 0,
      Art_Frs1: article?.Art_Frs1 || undefined,
      Art_Frs2: article?.Art_Frs2 || undefined,
      Art_Frs3: article?.Art_Frs3 || undefined,
      Art_StkIni: article?.Art_StkIni || 0,
      Art_StkMini: article?.Art_StkMini || 0,
      Art_StkMaxi: article?.Art_StkMaxi || 0,
      Societe_id: article?.Societe_id || undefined,
      Art_RefFr: article?.Art_RefFr || "",
      Art_NewField: article?.Art_NewField || "",
    }
  }

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    if (article && !formInitialized) {
      // Reset form with article data when it becomes available
      form.reset(getDefaultValues())
      setFormInitialized(true)
    }
  }, [article, form, formInitialized])

  async function onSubmit(data: ArticleFormValues) {
    setIsLoading(true)
    setApiError(null)

    try {
      const url = article ? `/api/employer/articles/${article.Art_ID || article.id}` : "/api/employer/articles"

      const method = article ? "PUT" : "POST"

      console.log("Submitting form data:", data)
      console.log("Request URL:", url)
      console.log("Request method:", method)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("API error response:", responseData)
        throw new Error(responseData.error || responseData.details || "Failed to save article")
      }

      toast({
        title: article ? "Article updated" : "Article created",
        description: article
          ? "The article has been updated successfully."
          : "The article has been created successfully.",
      })

      // Navigate back to articles page
      router.push("/employer/articles")
      router.refresh()
    } catch (error) {
      console.error("Form submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again."
      setApiError(errorMessage)
      toast({
        title: "Error",
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
                name="Art_CodBar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code Barre</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Art_Desig"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="Categorie_ID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorie</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Art_Serie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serie</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Art_Unite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unité</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="Art_PuAcht"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix d'achat</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Art_PURv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de vente</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Art_Tva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TVA</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="Art_StkIni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Initial</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Art_StkMini"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Minimum</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="Art_StkMaxi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Maximum</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="Art_RefFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence Fournisseur</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/employer/articles")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {article ? "Updating..." : "Creating..."}
                  </>
                ) : article ? (
                  "Update Article"
                ) : (
                  "Create Article"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

