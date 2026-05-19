"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Lock, Loader2, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyUser, type UserRecord } from "@/lib/client-users"
import { toast } from "sonner"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      const msg = "Please fill in all fields"
      setError(msg)
      toast.error(msg)
      return
    }

    setLoading(true)

    try {
      // verify user
      let user: UserRecord | null = null
      try {
        user = verifyUser(email, password)
      } catch {
        console.log("Could not verify user from localStorage")
      }

      if (!user) {
        const msg = "Invalid email or password"
        setError(msg)
        toast.error(msg)
        setLoading(false)
        return
      }

      // create session
      const userInfo = JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
      })

      const response = await fetch("/api/auth/direct-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInfo }),
      })

      const data = await response.json()

      if (data.ok) {
        toast.success("Welcome back!")
        window.location.href = "/"
      } else {
        throw new Error(data.error || "Failed to sign in")
      }
    } catch (err: any) {
      console.error("Sign in error:", err)
      setError(err.message || "Something went wrong")
      toast.error(err.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }, [email, password])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Image
            src="/cinetrack-logo-full.png"
            alt="CineTrack"
            width={180}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-zinc-500 mt-1">Sign in to your CineTrack account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                placeholder="you@example.com"
                className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                placeholder="Enter your password"
                className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50"
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white gap-2 h-11"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-violet-400 hover:text-violet-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
