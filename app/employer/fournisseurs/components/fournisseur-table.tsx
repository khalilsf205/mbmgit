"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2, Loader2, AlertTriangle, Mail, Phone } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface Fournisseur {
  id_fr: number
  nom: string
  prenom: string
  email: string
  tlf: string
  mf: string
  credit: number
}

interface FournisseurTableProps {
  searchQuery?: string
}

export function FournisseurTable({ searchQuery = "" }: FournisseurTableProps) {
  const router = useRouter()
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [fournisseurToDelete, setFournisseurToDelete] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Use a ref to track mounted state
  const isMountedRef = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchFournisseurs = async () => {
      if (!isMountedRef.current) return

      try {
        setLoading(true)
        setError(null)

        // Build the URL with search parameter if provided
        let url = `/api/employer/fournisseurs`
        if (searchQuery && searchQuery.trim() !== "") {
          url += `?search=${encodeURIComponent(searchQuery)}`
        }

        const response = await fetch(url, { signal })

        if (!isMountedRef.current) return

        if (response.status === 401) {
          toast({
            title: "Authentification requise",
            description: "Veuillez vous connecter pour voir les fournisseurs.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (!isMountedRef.current) return

        // Sort fournisseurs alphabetically by name
        const sortedData = [...data].sort((a, b) => {
          return `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`)
        })

        setFournisseurs(sortedData)
      } catch (error) {
        if (!isMountedRef.current) return

        if (error instanceof Error && error.name === "AbortError") {
          return // Ignore aborted requests
        }

        console.error("Error fetching fournisseurs:", error)
        setError(error instanceof Error ? error.message : "Failed to load fournisseurs")

        toast({
          title: "Erreur",
          description: "Impossible de charger les fournisseurs. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchFournisseurs()

    return () => {
      controller.abort()
    }
  }, [refreshKey, router, searchQuery])

  const handleDeleteClick = (fournisseurId: number) => {
    setFournisseurToDelete(fournisseurId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = useCallback(async () => {
    if (!fournisseurToDelete) return

    try {
      setIsDeleting(true)

      // Close the dialog
      setDeleteDialogOpen(false)

      console.log("Sending DELETE request for fournisseur ID:", fournisseurToDelete)

      // Make the API call
      const response = await fetch(`/api/employer/fournisseurs/${fournisseurToDelete}`, {
        method: "DELETE",
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("Delete request failed:", response.status, responseData)
        throw new Error(responseData.error || `Failed with status: ${response.status}`)
      }

      // Show success toast
      toast({
        title: "Fournisseur supprimé",
        description: "Le fournisseur a été supprimé avec succès.",
      })

      // Refresh the data
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error deleting fournisseur:", error)

      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Impossible de supprimer le fournisseur. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      if (isMountedRef.current) {
        setFournisseurToDelete(null)
        setIsDeleting(false)
      }
    }
  }, [fournisseurToDelete, toast, setRefreshKey])

  const formatCredit = (credit: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND" }).format(credit)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table key={`fournisseur-table-${refreshKey}`}>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Matricule Fiscal</TableHead>
              <TableHead>Crédit</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Chargement des fournisseurs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-destructive">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <p>Erreur lors du chargement des fournisseurs: {error}</p>
                    <Button variant="outline" size="sm" onClick={() => setRefreshKey((prev) => prev + 1)}>
                      Réessayer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : fournisseurs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Aucun fournisseur trouvé.
                </TableCell>
              </TableRow>
            ) : (
              fournisseurs.map((fournisseur) => (
                <TableRow key={`fournisseur-${fournisseur.id_fr}`}>
                  <TableCell>
                    <div className="font-medium">
                      {fournisseur.nom} {fournisseur.prenom}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-sm">{fournisseur.email}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-sm">{fournisseur.tlf}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{fournisseur.mf}</TableCell>
                  <TableCell>{formatCredit(fournisseur.credit)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/employer/fournisseurs/${fournisseur.id_fr}`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(fournisseur.id_fr)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le fournisseur et toutes ses données
              associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

