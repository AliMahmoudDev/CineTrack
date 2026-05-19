"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const errorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password. Please try again.",
  SessionRequired: "Please sign in to access this page.",
  default: "Something went wrong. Please try again.",
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") ?? "default"
  const message = errorMessages[error] ?? errorMessages.default

  return (
    <div className="text-center space-y-5 max-w-sm">
      <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold">Authentication Error</h1>
      <p className="text-zinc-400">{message}</p>
      <Link href="/auth/signin">
        <Button className="bg-violet-500 hover:bg-violet-600 text-white gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Button>
      </Link>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="text-center space-y-5 max-w-sm">
          <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto animate-pulse" />
          <p className="text-zinc-500">Loading...</p>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
