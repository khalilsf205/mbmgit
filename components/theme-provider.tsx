"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define the Attribute type to match next-themes expectations
type Attribute = "class" | "data-theme" | "data-mode"

// Define the ThemeProviderProps type with the correct Attribute type
type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: Attribute | Attribute[]
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
  forcedTheme?: string
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use suppressHydrationWarning to prevent hydration mismatch warnings
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

