'use client'

import { useSession } from 'next-auth/react'

export function useUser() {
  const { data: session } = useSession()
  
  return {
    user: {
      email: session?.user?.email || '',
      // Add other user properties as needed
    }
  }
}

