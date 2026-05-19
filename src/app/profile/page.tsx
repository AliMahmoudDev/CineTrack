"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  User, Mail, Calendar, Bookmark, List, Film, Star,
  Pencil, Check, X, Heart, Clock, Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useCineStore } from "@/store/use-cine-store"
import { findUserByEmail, updateUser } from "@/lib/client-users"
import { MOVIE_GENRES } from "@/lib/genres"
import { toast } from "sonner"

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-zinc-100">{value}</p>
          <p className="text-xs text-zinc-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const watchlist = useCineStore((s) => s.watchlist)
  const lists = useCineStore((s) => s.lists)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [userRecord, setUserRecord] = useState<{
    name: string
    age: number
    favoriteGenres: number[]
    createdAt: number
  } | null>(null)

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editAge, setEditAge] = useState("")
  const [editGenres, setEditGenres] = useState<number[]>([])

  useEffect(() => {
    if (session?.user?.email) {
      const record = findUserByEmail(session.user.email)
      if (record) {
        setUserRecord({ name: record.name, age: record.age, favoriteGenres: record.favoriteGenres, createdAt: record.createdAt })
        setEditName(record.name)
        setEditAge(String(record.age))
        setEditGenres(record.favoriteGenres)
      }
    }
  }, [session?.user?.email])

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/auth/signin") }
  }, [status, router])

  const handleSave = () => {
    if (!session?.user?.email) return
    const trimmedName = editName.trim()
    const parsedAge = parseInt(editAge, 10)
    if (!trimmedName) { toast.error("Name is required"); return }
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 150) { toast.error("Please enter a valid age"); return }
    if (editGenres.length === 0) { toast.error("Pick at least one favorite genre"); return }
    const updated = updateUser(session.user.email, { name: trimmedName, age: parsedAge, favoriteGenres: editGenres })
    if (updated) {
      setUserRecord({ name: updated.name, age: updated.age, favoriteGenres: updated.favoriteGenres, createdAt: updated.createdAt })
      setEditing(false)
      toast.success("Profile updated!")
    }
  }

  const toggleGenre = (genreId: number) => {
    setEditGenres((prev) => {
      if (prev.includes(genreId)) return prev.filter((id) => id !== genreId)
      if (prev.length >= 5) { toast.error("You can pick up to 5 genres"); return prev }
      return [...prev, genreId]
    })
  }

  if (status === "loading" || !mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-zinc-800" />
            <div className="space-y-3"><div className="h-7 w-48 bg-zinc-800 rounded" /><div className="h-4 w-32 bg-zinc-800 rounded" /></div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) return null

  const watchlistCount = watchlist.length
  const listsCount = lists.length
  const totalMoviesInLists = lists.reduce((sum, l) => sum + l.movies.length, 0)
  const avgRating = watchlist.length > 0 ? (watchlist.reduce((sum, m) => sum + m.voteAverage, 0) / watchlist.length).toFixed(1) : "—"

  const userInitials = (userRecord?.name ?? session.user?.name ?? "U").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
  const genreMap = new Map(MOVIE_GENRES.map((g) => [g.id, g.name]))
  const favoriteGenreNames = userRecord?.favoriteGenres?.map((id) => genreMap.get(id)).filter(Boolean) ?? []
  const memberSince = userRecord?.createdAt ? new Date(userRecord.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 ring-2 ring-violet-500/30 ring-offset-2 ring-offset-zinc-950">
            <AvatarFallback className="bg-gradient-to-br from-violet-500/40 to-sky-500/40 text-white text-2xl font-bold">{userInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">{editing ? "Edit Profile" : userRecord?.name ?? session.user?.name ?? "User"}</h1>
            <div className="flex items-center gap-2 mt-1 text-zinc-500"><Mail className="w-3.5 h-3.5" /><span className="text-sm">{session.user?.email}</span></div>
            {userRecord?.createdAt && <div className="flex items-center gap-2 mt-1 text-zinc-600"><Clock className="w-3.5 h-3.5" /><span className="text-xs">Member since {memberSince}</span></div>}
          </div>
        </div>
        {!editing ? (
          <Button onClick={() => { setEditName(userRecord?.name ?? session.user?.name ?? ""); setEditAge(String(userRecord?.age ?? "")); setEditGenres(userRecord?.favoriteGenres ?? []); setEditing(true) }} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 gap-2"><Pencil className="w-4 h-4" /> Edit Profile</Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"><Check className="w-4 h-4" /> Save</Button>
            <Button onClick={() => setEditing(false)} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 gap-2"><X className="w-4 h-4" /> Cancel</Button>
          </div>
        )}
      </div>

      <Separator className="bg-zinc-800/60" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Bookmark} label="Watchlist" value={watchlistCount} color="bg-violet-500/20 text-violet-400" />
        <StatCard icon={List} label="Custom Lists" value={listsCount} color="bg-sky-500/20 text-sky-400" />
        <StatCard icon={Film} label="Movies in Lists" value={totalMoviesInLists} color="bg-emerald-500/20 text-emerald-400" />
        <StatCard icon={Star} label="Avg Rating" value={avgRating} color="bg-yellow-500/20 text-yellow-400" />
      </div>

      <Separator className="bg-zinc-800/60" />

      {editing ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-violet-400" /> Personal Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><label className="text-sm text-zinc-400">Display Name</label><Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-zinc-900/80 border-zinc-800 text-zinc-100 focus-visible:ring-violet-500/50" placeholder="Your name" /></div>
              <div className="space-y-2"><label className="text-sm text-zinc-400">Age</label><Input type="number" min={1} max={150} value={editAge} onChange={(e) => setEditAge(e.target.value)} className="bg-zinc-900/80 border-zinc-800 text-zinc-100 focus-visible:ring-violet-500/50" placeholder="Your age" /></div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Heart className="w-5 h-5 text-violet-400" /> Favorite Genres <span className="text-xs text-zinc-500 font-normal">({editGenres.length}/5 selected)</span></h2>
            <div className="flex flex-wrap gap-2">
              {MOVIE_GENRES.map((genre) => {
                const isSelected = editGenres.includes(genre.id)
                return (<button key={genre.id} onClick={() => toggleGenre(genre.id)} className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${isSelected ? "bg-violet-500/20 border-violet-500/50 text-violet-300" : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"}`}>{isSelected && <Check className="w-3 h-3 inline mr-1" />}{genre.name}</button>)
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><User className="w-5 h-5 text-violet-400" /> Personal Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-zinc-900/60 border-zinc-800"><CardContent className="p-4 space-y-1"><p className="text-xs text-zinc-500 flex items-center gap-1"><User className="w-3 h-3" /> Name</p><p className="text-sm font-medium text-zinc-200">{userRecord?.name ?? session.user?.name ?? "—"}</p></CardContent></Card>
              <Card className="bg-zinc-900/60 border-zinc-800"><CardContent className="p-4 space-y-1"><p className="text-xs text-zinc-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Age</p><p className="text-sm font-medium text-zinc-200">{userRecord?.age ? `${userRecord.age} years old` : "—"}</p></CardContent></Card>
              <Card className="bg-zinc-900/60 border-zinc-800"><CardContent className="p-4 space-y-1"><p className="text-xs text-zinc-500 flex items-center gap-1"><Shield className="w-3 h-3" /> Email</p><p className="text-sm font-medium text-zinc-200 break-all">{session.user?.email ?? "—"}</p></CardContent></Card>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Heart className="w-5 h-5 text-violet-400" /> Favorite Genres</h2>
            {favoriteGenreNames.length > 0 ? (
              <div className="flex flex-wrap gap-2">{favoriteGenreNames.map((name) => (<Badge key={name} variant="outline" className="border-violet-500/40 text-violet-300 px-3 py-1">{name}</Badge>))}</div>
            ) : (
              <p className="text-sm text-zinc-600">No favorite genres set. Edit your profile to add some.</p>
            )}
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Bookmark className="w-5 h-5 text-violet-400" /> Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/watchlist"><Card className="bg-zinc-900/60 border-zinc-800 hover:border-violet-500/30 transition-colors cursor-pointer group"><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-violet-500/20 flex items-center justify-center"><Bookmark className="w-5 h-5 text-violet-400" /></div><div><p className="text-sm font-medium text-zinc-200 group-hover:text-violet-300 transition-colors">My Watchlist</p><p className="text-xs text-zinc-500">{watchlistCount} movie{watchlistCount !== 1 ? "s" : ""} saved</p></div></CardContent></Card></Link>
              <Link href="/lists"><Card className="bg-zinc-900/60 border-zinc-800 hover:border-sky-500/30 transition-colors cursor-pointer group"><CardContent className="p-4 flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center"><List className="w-5 h-5 text-sky-400" /></div><div><p className="text-sm font-medium text-zinc-200 group-hover:text-sky-300 transition-colors">My Lists</p><p className="text-xs text-zinc-500">{listsCount} list{listsCount !== 1 ? "s" : ""} created</p></div></CardContent></Card></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
