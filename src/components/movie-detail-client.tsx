"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Star, Clock, Calendar, ArrowLeft, Play, Bookmark, BookmarkCheck,
  DollarSign, Film, Globe, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getPosterUrl } from "@/lib/tmdb"
import { useCineStore } from "@/store/use-cine-store"
import type { MovieDetails } from "@/lib/tmdb"

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export function MovieDetailClient({
  movie,
  backdropUrl,
  posterUrl,
  trailerKey,
  cast,
}: {
  movie: MovieDetails
  backdropUrl: string
  posterUrl: string
  trailerKey: string | null
  cast: CastMember[]
}) {
  const [trailerOpen, setTrailerOpen] = useState(false)
  const isInWatchlist = useCineStore((s) => s.isInWatchlist(movie.id))
  const addToWatchlist = useCineStore((s) => s.addToWatchlist)
  const removeFromWatchlist = useCineStore((s) => s.removeFromWatchlist)
  const saved = isInWatchlist

  const formatCurrency = (n: number) => {
    if (!n) return "—"
    return `$${(n / 1_000_000).toFixed(1)}M`
  }

  const formatRuntime = (mins: number) => {
    if (!mins) return "—"
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}m`
  }

  return (
    <div>
      {/* backdrop hero */}
      <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 to-transparent" />

        {/* back button */}
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* poster */}
          <div className="flex-shrink-0">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-48 md:w-64 rounded-xl border border-zinc-800 shadow-2xl shadow-black/50"
            />
          </div>

          {/* info */}
          <div className="flex-1 space-y-5 pt-2">
            {/* title + tagline */}
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-zinc-500 italic mt-1">&ldquo;{movie.tagline}&rdquo;</p>
              )}
            </div>

            {/* genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g) => (
                <Badge
                  key={g.id}
                  variant="outline"
                  className="border-violet-500/40 text-violet-300"
                >
                  {g.name}
                </Badge>
              ))}
            </div>

            {/* quick stats */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-white">{movie.vote_average?.toFixed(1)}</span>
                <span className="text-zinc-600">({movie.vote_count?.toLocaleString()})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatRuntime(movie.runtime)}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {movie.release_date ?? "—"}
              </span>
              {movie.original_language && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  {movie.original_language.toUpperCase()}
                </span>
              )}
            </div>

            {/* action buttons */}
            <div className="flex items-center gap-3">
              {trailerKey && (
                <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Watch Trailer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/95 border-zinc-800 max-w-4xl p-0 overflow-hidden">
                    {trailerOpen && (
                      <iframe
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                        title="Movie Trailer"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full aspect-video"
                      />
                    )}
                  </DialogContent>
                </Dialog>
              )}
              <Button
                size="lg"
                variant="outline"
                className={`gap-2 ${
                  saved
                    ? "border-sky-500/50 text-sky-400 hover:bg-sky-500/10"
                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800/60"
                }`}
                onClick={() => {
                  if (saved) {
                    removeFromWatchlist(movie.id)
                  } else {
                    addToWatchlist({ id: movie.id, title: movie.title, posterPath: movie.poster_path, voteAverage: movie.vote_average, releaseDate: movie.release_date })
                  }
                }}
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>

            {/* overview */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-zinc-400 leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-zinc-800/60" />

        {/* cast section */}
        {cast.length > 0 && (
          <section className="space-y-4 mb-10">
            <h3 className="text-xl font-bold">Top Cast</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {cast.map((person) => (
                <div key={person.id} className="text-center space-y-1.5">
                  <img
                    src={getPosterUrl(person.profile_path, "w185")}
                    alt={person.name}
                    className="w-full aspect-square object-cover rounded-full border border-zinc-800"
                  />
                  <p className="text-xs font-medium text-zinc-200 line-clamp-1">{person.name}</p>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* extra info */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Budget
            </p>
            <p className="text-sm font-semibold">{formatCurrency(movie.budget)}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Revenue
            </p>
            <p className="text-sm font-semibold">{formatCurrency(movie.revenue)}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Film className="w-3 h-3" /> Status
            </p>
            <p className="text-sm font-semibold">{movie.status || "—"}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-1">
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Globe className="w-3 h-3" /> Language
            </p>
            <p className="text-sm font-semibold">{movie.original_language?.toUpperCase() ?? "—"}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
