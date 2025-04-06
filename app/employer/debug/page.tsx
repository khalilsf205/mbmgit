"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function DebugPage() {
  // Keep existing state variables
  const [dbStatus, setDbStatus] = useState<"loading" | "success" | "error">("loading")
  const [dbMessage, setDbMessage] = useState("")
  const [dbDetails, setDbDetails] = useState<any>(null)
  const [tables, setTables] = useState<string[]>([])
  const [tableData, setTableData] = useState<any>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(false)

  // Keep existing useEffect and functions

  const initializeDatabase = async () => {
    try {
      setInitLoading(true)

      const response = await fetch("/api/employer/init-db", {
        method: "POST",
      })

      const data = await response.json()

      if (data.status === "success") {
        toast({
          title: "Success",
          description: data.message,
        })

        // Refresh tables and connection status
        await testDbConnection()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initialize database",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initializing database:", error)
      toast({
        title: "Error",
        description: "Failed to initialize database",
        variant: "destructive",
      })
    } finally {
      setInitLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Debug</h1>
        <p className="text-muted-foreground">Check your database connection and tables.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={testDbConnection} disabled={dbStatus === "loading"}>
          {dbStatus === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>

        <Button onClick={initializeDatabase} disabled={initLoading || dbStatus !== "success"}>
          {initLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing...
            </>
          ) : (
            "Initialize Database with Sample Data"
          )}
        </Button>
      </div>

      {/* Keep the rest of the component */}
    </div>
  )
}

