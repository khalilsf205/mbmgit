"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function SettingsForm() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure theme component only renders client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "system",
    },
  })

  // Update form value when theme changes
  useEffect(() => {
    if (mounted) {
      form.setValue("theme", theme as "light" | "dark" | "system")
    }
  }, [theme, mounted, form])

  function onSubmit(data: AppearanceFormValues) {
    setTheme(data.theme)
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been updated.",
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Theme</FormLabel>
              <FormDescription>Select the theme for the dashboard.</FormDescription>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-3 gap-4"
                >
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>
                    <div
                      className={`flex items-center justify-center rounded-md border-2 border-muted p-4 hover:border-accent ${field.value === "light" ? "border-primary" : ""}`}
                    >
                      <div className="space-y-2 text-center">
                        <div className="w-8 h-8 rounded-full bg-[#eaeaea] mx-auto"></div>
                        <div className="text-sm font-medium">Light</div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>
                    <div
                      className={`flex items-center justify-center rounded-md border-2 border-muted p-4 hover:border-accent ${field.value === "dark" ? "border-primary" : ""}`}
                    >
                      <div className="space-y-2 text-center">
                        <div className="w-8 h-8 rounded-full bg-[#1e1e1e] mx-auto"></div>
                        <div className="text-sm font-medium">Dark</div>
                      </div>
                    </div>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <RadioGroupItem value="system" className="sr-only" />
                    </FormControl>
                    <div
                      className={`flex items-center justify-center rounded-md border-2 border-muted p-4 hover:border-accent ${field.value === "system" ? "border-primary" : ""}`}
                    >
                      <div className="space-y-2 text-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#eaeaea] to-[#1e1e1e] mx-auto"></div>
                        <div className="text-sm font-medium">System</div>
                      </div>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Update preferences</Button>
      </form>
    </Form>
  )
}

