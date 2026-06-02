"use client"

import { Suspense, useState, useCallback, useTransition, useMemo, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, X, Loader2, ArrowUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MovieCard } from "@/components/movie-card"
import { searchMoviesAction } from "@/actions/search"
import type { Movie } from "@/lib/tmdb"

// sort options
type SortKey = "default" | "rating" | "date" | "title" | "popularity"

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "rating", label: "Rating" },
  { key: "date", label: "Release Date" },
  { key: "title", label: "Title (A-Z)" },
  { key: "popularity", label: "Popularity" },
]

function sortMovies(movies: Movie[], sortKey: SortKey): Movie[] {
  if (sortKey === "default") return movies
  const sorted = [...movies]
  switch (sortKey) {
    case "rating":
      return sorted.sort((a, b) => b.vote_average - a.vote_average)
    case "date":
      return sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case "popularity":
      return sorted.sort((a, b) => b.popularity - a.popularity)
    default:
      return sorted
  }
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }, (_, i) => (
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

// search content
function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""

  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(!!initialQuery)
  const [sortBy, setSortBy] = useState<SortKey>("default")
  const [sortOpen, setSortOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // apply sorting
  const sortedResults = useMemo(() => sortMovies(results, sortBy), [results, sortBy])

  // reset sort when new search
  const handleSearch = useCallback(async (searchQuery: string) => {
    const q = searchQuery.trim()
    if (!q) return

    setLoading(true)
    setSearched(true)
    setSortBy("default")
    router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })

    startTransition(async () => {
      const data = await searchMoviesAction(q)
      setResults(data?.results ?? [])
      setLoading(false)
    })
  }, [router])

  // auto-search debounce: trigger search 8 seconds after user stops typing
  useEffect(() => {
    // clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    const trimmed = query.trim()
    // only set timer if there's a query and it's different from what we already searched
    if (trimmed && trimmed !== initialQuery) {
      timerRef.current = setTimeout(() => {
        handleSearch(trimmed)
      }, 800)
    }

    // cleanup on unmount or before next effect run
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [query, handleSearch, initialQuery])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* search header */}
      <div className="space-y-6 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Search{" "}
          <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
            Movies
          </span>
        </h1>

        {/* search bar */}
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              placeholder="Search for a movie..."
              className="pl-10 bg-zinc-900/80 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </Button>
        </div>
      </div>

      {/* results */}
      {loading ? (
        <SkeletonGrid />
      ) : searched && results.length > 0 ? (
        <div className="space-y-4">
          {/* results header with sort */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-500">
              Found {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            <Popover open={sortOpen} onOpenChange={setSortOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/60 gap-2"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {SORT_OPTIONS.find((o) => o.key === sortBy)?.label}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-44 bg-zinc-900 border-zinc-800 p-1" align="end">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSortBy(opt.key)
                      setSortOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                      sortBy === opt.key
                        ? "text-violet-300 bg-violet-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.key && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedResults.map((m) => (
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
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
          <p className="text-lg text-zinc-400">No results found</p>
          <p className="text-sm text-zinc-600 mt-1">try a different search term</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
          <p className="text-lg text-zinc-400">Start searching</p>
          <p className="text-sm text-zinc-600 mt-1">
            type a movie name — search triggers automatically or press Enter
          </p>
        </div>
      )}
    </div>
  )
}

// search page
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6 mb-10">
            <div className="h-10 w-64 bg-zinc-800/50 rounded-lg" />
            <div className="h-10 w-full max-w-2xl bg-zinc-800/50 rounded-lg" />
          </div>
          <SkeletonGrid />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
