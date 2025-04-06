"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setDebugInfo(null)

    try {
      // Log the values being submitted (for debugging)
      console.log("Submitting login with:", values)

      // Use the API endpoint instead of the server action
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const result = await response.json()
      console.log("Login result:", result)

      if (result.success && result.user) {
        // Show success message
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.username}! Role: ${result.user.role}`,
        })

        // Set debug info
        setDebugInfo(`Login successful. User: ${result.user.username}, Role: ${result.user.role}`)

        // Redirect based on role
        if (result.user.role === "admin") {
          console.log("Redirecting to admin dashboard...")
          // Use replace instead of push for a cleaner navigation experience
          router.replace("/admin")
        } else if (result.user.role === "client") {
          router.replace("/client")
        } else if (result.user.role === "employer") {
          router.replace("/employer")
        }
        

        // Force a refresh to update the UI based on the new auth state
        router.refresh()
      } else {
        // Show error message
        toast({
          title: "Login failed",
          description: result.error || "Invalid email or password",
          variant: "destructive",
        })

        // Set debug info
        setDebugInfo(`Login failed: ${result.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Login error:", error)

      // Show error message
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })

      // Set debug info
      setDebugInfo(`Error during login: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* Debug information - remove in production */}
              {debugInfo && (
                <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  <p className="font-mono">{debugInfo}</p>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Don&apos;t have an account? Contact your administrator.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

