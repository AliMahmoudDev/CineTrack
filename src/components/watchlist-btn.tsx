"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCineStore } from "@/store/use-cine-store"

// tiny watchlist toggle btn
export function WatchlistBtn({
  movieId,
  title,
  posterPath,
  voteAverage,
  releaseDate,
}: {
  movieId: number
  title: string
  posterPath: string | null
  voteAverage: number
  releaseDate: string
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const isInWatchlist = useCineStore((s) => s.isInWatchlist(movieId))
  const addToWatchlist = useCineStore((s) => s.addToWatchlist)
  const removeFromWatchlist = useCineStore((s) => s.removeFromWatchlist)
  const saved = isInWatchlist

  const handleClick = () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }
    if (saved) {
      removeFromWatchlist(movieId)
    } else {
      addToWatchlist({ id: movieId, title, posterPath, voteAverage, releaseDate })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-2 left-2 h-7 w-7 rounded-full backdrop-blur-sm transition-colors ${
        saved
          ? "bg-sky-500/30 text-sky-400 hover:bg-sky-500/50"
          : "bg-black/60 text-zinc-400 hover:text-white hover:bg-black/80"
      }`}
      onClick={handleClick}
    >
      {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
    </Button>
  )
}
