"use client"

import { Flame, Star, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MovieCard } from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Movie } from "@/lib/tmdb"

// skeleton fallback
function MovieCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
      <Skeleton className="w-full aspect-[2/3] rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  )
}

function MovieGrid({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }, (_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.slice(0, 18).map((m) => (
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

export function HomeTabs({
  trending,
  topRated,
  popular,
}: {
  trending: Movie[]
  topRated: Movie[]
  popular: Movie[]
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Tabs defaultValue="trending" className="space-y-6">
        <TabsList className="bg-zinc-900/80 border border-zinc-800 h-auto p-1">
          <TabsTrigger
            value="trending"
            className="data-[state=active]:bg-violet-500 data-[state=active]:text-white text-zinc-400 gap-2 px-4 py-2"
          >
            <Flame className="w-4 h-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger
            value="toprated"
            className="data-[state=active]:bg-sky-500 data-[state=active]:text-white text-zinc-400 gap-2 px-4 py-2"
          >
            <Star className="w-4 h-4" />
            Top Rated
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-zinc-400 gap-2 px-4 py-2"
          >
            <TrendingUp className="w-4 h-4" />
            Popular
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending">
          <MovieGrid movies={trending} />
        </TabsContent>
        <TabsContent value="toprated">
          <MovieGrid movies={topRated} />
        </TabsContent>
        <TabsContent value="popular">
          <MovieGrid movies={popular} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
