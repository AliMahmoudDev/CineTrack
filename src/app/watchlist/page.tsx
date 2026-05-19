"use client"

import Link from "next/link"
import { Bookmark, Trash2, Film, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCineStore } from "@/store/use-cine-store"
import { getPosterUrl } from "@/lib/tmdb"

export default function WatchlistPage() {
  const items = useCineStore((s) => s.watchlist)
  const removeFromWatchlist = useCineStore((s) => s.removeFromWatchlist)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Bookmark className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Your Watchlist is Empty</h1>
        <p className="text-zinc-500 mb-6">
          start adding movies you wanna watch and they&apos;ll show up here
        </p>
        <Link href="/discover">
          <Button className="bg-violet-500 hover:bg-violet-600 text-white gap-2">
            <Film className="w-4 h-4" />
            Discover Movies
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Bookmark className="w-7 h-7 text-violet-400" />
          My Watchlist
        </h1>
        <p className="text-zinc-500 mt-1">
          {items.length} movie{items.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden transition-transform duration-300 hover:scale-105 hover:border-zinc-700 relative"
          >
            <Link href={`/movie/${item.id}`}>
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={getPosterUrl(item.posterPath)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] font-semibold text-white">
                    {item.voteAverage?.toFixed(1) ?? "—"}
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <h3 className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500">
                  {item.releaseDate?.split("-")[0] ?? "—"}
                </p>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-zinc-400 hover:text-red-400 hover:bg-black/80 h-7 w-7 rounded-full"
              onClick={(e) => {
                e.preventDefault()
                removeFromWatchlist(item.id)
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
