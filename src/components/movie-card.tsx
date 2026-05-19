import Link from "next/link"
import { Star } from "lucide-react"
import { getPosterUrl } from "@/lib/tmdb"
import { WatchlistBtn } from "@/components/watchlist-btn"
import { AddToListBtn } from "@/components/add-to-list-btn"

// movie card - used everywhere so it gets its own component

interface MovieCardProps {
  id: number
  title: string
  posterPath: string | null
  voteAverage: number
  releaseDate: string
}

export function MovieCard({ id, title, posterPath, voteAverage, releaseDate }: MovieCardProps) {
  const posterUrl = getPosterUrl(posterPath)
  const year = releaseDate?.split("-")[0] ?? "—"
  const rating = voteAverage?.toFixed(1) ?? "—"

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden transition-transform duration-300 hover:scale-105 hover:border-zinc-700">
      {/* poster - clickable area */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Link href={`/movie/${id}`} className="block w-full h-full">
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>
        {/* rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md pointer-events-none">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-[11px] font-semibold text-white">{rating}</span>
        </div>
        {/* watchlist btn - outside Link so clicks work */}
        <WatchlistBtn
          movieId={id}
          title={title}
          posterPath={posterPath}
          voteAverage={voteAverage}
          releaseDate={releaseDate}
        />
        {/* add to list btn - outside Link so clicks work */}
        <AddToListBtn
          movieId={id}
          movieTitle={title}
          moviePoster={posterPath}
          movieRating={voteAverage}
          movieDate={releaseDate}
        />
      </div>

      {/* info - also clickable */}
      <Link href={`/movie/${id}`}>
        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-medium text-zinc-100 line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-zinc-500">{year}</p>
        </div>
      </Link>
    </div>
  )
}
