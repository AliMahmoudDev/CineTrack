"use client"

import { useState, useCallback, useTransition, useEffect } from "react"
import { SlidersHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MovieCard } from "@/components/movie-card"
import { getDiscoverAction } from "@/actions/discover"
import { type Genre, type Movie } from "@/lib/tmdb"

function GenreFilter({
  genres,
  activeGenre,
  onGenreChange,
}: {
  genres: Genre[]
  activeGenre: number | null
  onGenreChange: (id: number | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={activeGenre === null ? "default" : "outline"}
        className={`cursor-pointer transition-colors ${
          activeGenre === null
            ? "bg-violet-500 text-white hover:bg-violet-600"
            : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
        }`}
        onClick={() => onGenreChange(null)}
      >
        All
      </Badge>
      {genres.map((g) => (
        <Badge
          key={g.id}
          variant={activeGenre === g.id ? "default" : "outline"}
          className={`cursor-pointer transition-colors ${
            activeGenre === g.id
              ? "bg-violet-500 text-white hover:bg-violet-600"
              : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
          }`}
          onClick={() => onGenreChange(g.id)}
        >
          {g.name}
        </Badge>
      ))}
    </div>
  )
}

function MovieGrid({ movies }: { movies: Movie[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((m) => (
        <MovieCard
          key={m.id}
          id={m.id}
          title={m.title}
          posterPath={m.poster_path}
          voteAverage={m.vote_average}
          releaseDate={m.release_date}
        />
      ))}
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
          <Skeleton className="w-full aspect-[2/3] rounded-none" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DiscoverClient({
  genres,
  initialMovies,
  initialGenre,
  initialPage,
  totalPages,
}: {
  genres: Genre[]
  initialMovies: Movie[]
  initialGenre: number | null
  initialPage: number
  totalPages: number
}) {
  const [movies, setMovies] = useState(initialMovies)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pages, setPages] = useState(totalPages)
  const [activeGenre, setActiveGenre] = useState(initialGenre)
  const [isPending, startTransition] = useTransition()

  // fetch movies
  const fetchMovies = useCallback(async (genreId: number | null, page: number = 1) => {
    setLoading(true)
    setMovies([])
    setCurrentPage(1)

    startTransition(async () => {
      const data = await getDiscoverAction(genreId ?? undefined, page)
      if (data?.results) {
        setMovies(data.results)
        setCurrentPage(page)
        setPages(Math.min(data.total_pages ?? 1, 500))
      }
      setLoading(false)
    })
  }, [])

  // genre change
  const handleGenreChange = useCallback((genreId: number | null) => {
    setActiveGenre(genreId)
    fetchMovies(genreId, 1)
  }, [fetchMovies])

  // load more
  const handleLoadMore = useCallback(async () => {
    const nextPage = currentPage + 1
    setLoading(true)

    startTransition(async () => {
      const data = await getDiscoverAction(activeGenre ?? undefined, nextPage)
      if (data?.results) {
        setMovies((prev) => [...prev, ...data.results])
        setCurrentPage(nextPage)
        setPages(data.total_pages ?? 1)
      }
      setLoading(false)
    })
  }, [currentPage, activeGenre])

  // sync server data
  useEffect(() => {
    setMovies(initialMovies)
    setCurrentPage(initialPage)
    setPages(totalPages)
    setActiveGenre(initialGenre)
  }, [initialMovies, initialPage, totalPages, initialGenre])

  return (
    <div className="space-y-8">
      {/* header */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          Discover{" "}
          <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            Movies
          </span>
        </h1>
        <p className="text-zinc-500">
          browse by genre, find your next favorite film
        </p>
      </div>

      {/* genre filter */}
      <GenreFilter
        genres={genres}
        activeGenre={activeGenre}
        onGenreChange={handleGenreChange}
      />

      {/* movies */}
      {loading && movies.length === 0 ? (
        <SkeletonGrid />
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <SlidersHorizontal className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No movies found</p>
          <p className="text-sm mt-1">try picking a different genre</p>
        </div>
      )}

      {/* load more */}
      {currentPage < pages && movies.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 gap-2"
            onClick={handleLoadMore}
            disabled={loading || isPending}
          >
            {loading || isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
