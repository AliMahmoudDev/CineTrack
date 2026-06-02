"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { useEffect, useRef } from "react"
import { useCineStore } from "@/store/use-cine-store"

function AuthStateHandler() {
  const { data: session } = useSession()
  const loadForUser = useCineStore((s) => s.loadForUser)
  const prevEmailRef = useRef<string | null>(null)

  // load user data when they sign in
  useEffect(() => {
    const email = session?.user?.email ?? null
    if (email && email !== prevEmailRef.current) {
      loadForUser(email)
    }
    prevEmailRef.current = email
  }, [session?.user?.email, loadForUser])

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateHandler />
      {children}
    </SessionProvider>
  )
}
