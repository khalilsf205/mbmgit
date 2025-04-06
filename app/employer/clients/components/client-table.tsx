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

interface Client {
  id_cl: number
  nom: string
  prenom: string
  email: string
  tlf: string
  mf: string
  credit: number
}

interface ClientTableProps {
  searchQuery?: string
}

export function ClientTable({ searchQuery = "" }: ClientTableProps) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<number | null>(null)
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

    const fetchClients = async () => {
      if (!isMountedRef.current) return

      try {
        setLoading(true)
        setError(null)

        // Build the URL with search parameter if provided
        let url = `/api/employer/clients`
        if (searchQuery && searchQuery.trim() !== "") {
          url += `?search=${encodeURIComponent(searchQuery)}`
        }

        const response = await fetch(url, { signal })

        if (!isMountedRef.current) return

        if (response.status === 401) {
          toast({
            title: "Authentification requise",
            description: "Veuillez vous connecter pour voir les clients.",
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

        // Sort clients alphabetically by name
        const sortedData = [...data].sort((a, b) => {
          return `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`)
        })

        setClients(sortedData)
      } catch (error) {
        if (!isMountedRef.current) return

        if (error instanceof Error && error.name === "AbortError") {
          return // Ignore aborted requests
        }

        console.error("Error fetching clients:", error)
        setError(error instanceof Error ? error.message : "Failed to load clients")

        toast({
          title: "Erreur",
          description: "Impossible de charger les clients. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        if (isMountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchClients()

    return () => {
      controller.abort()
    }
  }, [refreshKey, router, searchQuery])

  const handleDeleteClick = (clientId: number) => {
    setClientToDelete(clientId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = useCallback(async () => {
    if (!clientToDelete) return

    try {
      setIsDeleting(true)

      // Close the dialog
      setDeleteDialogOpen(false)

      // Make the API call
      const response = await fetch(`/api/employer/clients/${clientToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete client")
      }

      // Show success toast
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès.",
      })

      // Refresh the data
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error deleting client:", error)

      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      if (isMountedRef.current) {
        setClientToDelete(null)
        setIsDeleting(false)
      }
    }
  }, [clientToDelete])

  const formatCredit = (credit: number) => {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "TND" }).format(credit)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table key={`client-table-${refreshKey}`}>
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
                    <span>Chargement des clients...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-destructive">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <p>Erreur lors du chargement des clients: {error}</p>
                    <Button variant="outline" size="sm" onClick={() => setRefreshKey((prev) => prev + 1)}>
                      Réessayer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Aucun client trouvé.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={`client-${client.id_cl}`}>
                  <TableCell>
                    <div className="font-medium">
                      {client.nom} {client.prenom}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-sm">{client.email}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="text-sm">{client.tlf}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{client.mf}</TableCell>
                  <TableCell>{formatCredit(client.credit)}</TableCell>
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
                          <Link href={`/employer/clients/${client.id_cl}`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(client.id_cl)}
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
              Cette action ne peut pas être annulée. Cela supprimera définitivement le client et toutes ses données
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

