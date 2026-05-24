"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Lock, User, Calendar, Loader2, Film, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, findUserByEmail } from "@/lib/client-users"
import { MOVIE_GENRES } from "@/lib/genres"
import { toast } from "sonner"

export default function SignUpPage() {
  const [step, setStep] = useState(1)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleNextStep = useCallback(() => {
    setError("")
    try {
      if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        const msg = "Please fill in all fields"
        setError(msg)
        toast.error(msg)
        return
      }
      if (!email.includes("@") || !email.includes(".")) {
        const msg = "Please enter a valid email address"
        setError(msg)
        toast.error(msg)
        return
      }
      if (password.length < 6) {
        const msg = "Password must be at least 6 characters"
        setError(msg)
        toast.error(msg)
        return
      }
      if (password !== confirmPassword) {
        const msg = "Passwords don't match"
        setError(msg)
        toast.error(msg)
        return
      }
      try {
        const existingUser = findUserByEmail(email)
        if (existingUser) {
          const msg = "This email is already registered"
          setError(msg)
          toast.error(msg)
          return
        }
      } catch {
        console.log("Could not check existing users, proceeding anyway")
      }
      setStep(2)
    } catch (err) {
      console.error("Step 1 validation error:", err)
      setError("Something went wrong. Please try again.")
      toast.error("Something went wrong. Please try again.")
    }
  }, [email, password, confirmPassword])

  const toggleGenre = useCallback((genreId: number) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genreId)) return prev.filter((id) => id !== genreId)
      if (prev.length >= 5) { toast.error("You can pick up to 5 genres"); return prev }
      return [...prev, genreId]
    })
  }, [])

  const handleSignUp = useCallback(async () => {
    setError("")
    if (!name.trim()) { setError("Please enter your name"); toast.error("Please enter your name"); return }
    if (!age || parseInt(age) < 1 || parseInt(age) > 150) { setError("Please enter a valid age"); toast.error("Please enter a valid age"); return }
    if (selectedGenres.length === 0) { setError("Please pick at least one favorite genre"); toast.error("Please pick at least one favorite genre"); return }

    setLoading(true)
    try {
      const user = createUser({ email, password, name: name.trim(), age: parseInt(age), favoriteGenres: selectedGenres })
      if (!user) throw new Error("Failed to create user account")

      const userInfo = JSON.stringify({ id: user.id, name: user.name, email: user.email })
      const response = await fetch("/api/auth/direct-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInfo }),
      })
      const data = await response.json()
      if (data.ok) {
        toast.success("Account created! Welcome to CineTrack!")
        window.location.href = "/"
      } else {
        throw new Error(data.error || "Failed to create session")
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Something went wrong")
      toast.error(err.message || "Failed to create account")
      setLoading(false)
    }
  }, [email, password, name, age, selectedGenres])

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Image src="/cinetrack-logo-full.png" alt="CineTrack" width={180} height={80} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-zinc-500 mt-1">Join CineTrack and start tracking movies</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}

        <div className="flex items-center gap-2 justify-center">
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? "w-10 bg-violet-500" : "w-6 bg-zinc-800"}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? "w-10 bg-violet-500" : "w-6 bg-zinc-800"}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input id="signup-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError("") }} placeholder="you@example.com" className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 [color-scheme:dark]" autoComplete="email" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleNextStep() } }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input id="signup-password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError("") }} placeholder="Min 6 characters" className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 [color-scheme:dark]" autoComplete="new-password" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleNextStep() } }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input id="signup-confirm" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError("") }} placeholder="Re-enter your password" className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 [color-scheme:dark]" autoComplete="new-password" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleNextStep() } }} />
              </div>
            </div>
            <Button type="button" onClick={handleNextStep} className="w-full bg-violet-500 hover:bg-violet-600 text-white gap-2 h-11">
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input id="signup-name" type="text" value={name} onChange={(e) => { setName(e.target.value); setError("") }} placeholder="Your name" className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 [color-scheme:dark]" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSignUp() } }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-age">Age</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input id="signup-age" type="number" min={1} max={150} value={age} onChange={(e) => { setAge(e.target.value); setError("") }} placeholder="Your age" className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50 [color-scheme:dark]" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSignUp() } }} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Favorite Genres <span className="text-zinc-600 font-normal">(pick 1-5)</span></Label>
              <div className="flex flex-wrap gap-2">
                {MOVIE_GENRES.map((genre) => {
                  const isSelected = selectedGenres.includes(genre.id)
                  return (
                    <button key={genre.id} type="button" onClick={() => toggleGenre(genre.id)} className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${isSelected ? "bg-violet-500/20 border-violet-500/50 text-violet-300" : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"}`}>
                      {isSelected && <Check className="w-3 h-3 inline mr-1" />}{genre.name}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" onClick={() => { setStep(1); setError("") }} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 flex-1">Back</Button>
              <Button type="button" onClick={handleSignUp} disabled={loading} className="bg-violet-500 hover:bg-violet-600 text-white gap-2 flex-1 h-11">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-violet-400 hover:text-violet-300 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
