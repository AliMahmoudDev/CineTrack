import { Film, TrendingUp, Star, Play, Flame, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MovieCard } from "@/components/movie-card"
import { getTrendingMovies, getTopRatedMovies, getPopularMovies, type Movie } from "@/lib/tmdb"

// home metadata
export const metadata: Metadata = {
  title: "Discover, Track & Organize Movies",
  description:
    "Explore trending movies, top-rated films, and popular picks. Build your personal watchlist and create custom movie lists with CineTrack — your personal cinema companion.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CineTrack - Discover, Track & Organize Movies",
    description:
      "Explore trending movies, top-rated films, and popular picks. Build your personal watchlist and create custom movie lists.",
    url: "/",
  },
}

// hero section
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-sky-500/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Image
            src="/cinetrack-logo-full.png"
            alt="CineTrack"
            width={220}
            height={100}
            className="mx-auto shadow-lg shadow-violet-500/20"
            priority
          />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Track Every{" "}
            <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
              Movie
            </span>{" "}
            You Love
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Discover trending films, build your watchlist, and never lose track
            of what you wanna watch next. Your personal cinema companion.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/search">
              <Button
                size="lg"
                className="bg-violet-500 hover:bg-violet-600 text-white gap-2"
              >
                <Search className="w-4 h-4" />
                Search Movies
              </Button>
            </Link>
            <Link href="/discover">
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/60 gap-2"
              >
                <Play className="w-4 h-4" />
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

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

// trending section
function TrendingSection({ movies }: { movies: Movie[] | null }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="w-5 h-5 text-violet-400" />
            Trending Now
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            what everyone is watching this week
          </p>
        </div>
        <Link href="/discover">
          <Button
            variant="ghost"
            className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
          >
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies ? (
          movies.slice(0, 12).map((m) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              posterPath={m.poster_path}
              voteAverage={m.vote_average}
              releaseDate={m.release_date}
            />
          ))
        ) : (
          // fallback if api fails
          Array.from({ length: 6 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))
        )}
      </div>
    </section>
  )
}

// top rated section
function TopRatedSection({ moviesList }: { moviesList: Movie[] | null }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-sky-400" />
            Top Rated
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            all-time classics and critically acclaimed
          </p>
        </div>
        <Link href="/discover">
          <Button
            variant="ghost"
            className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10"
          >
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {moviesList ? (
          moviesList.slice(0, 12).map((movieData) => (
            <MovieCard
              key={movieData.id}
              id={movieData.id}
              title={movieData.title}
              posterPath={movieData.poster_path}
              voteAverage={movieData.vote_average}
              releaseDate={movieData.release_date}
            />
          ))
        ) : (
          Array.from({ length: 6 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))
        )}
      </div>
    </section>
  )
}

// popular section
function PopularSection({ popularData }: { popularData: Movie[] | null }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Popular Right Now
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            the most talked-about movies atm
          </p>
        </div>
        <Link href="/discover">
          <Button
            variant="ghost"
            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
          >
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {popularData ? (
          popularData.slice(0, 12).map((m) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              posterPath={m.poster_path}
              voteAverage={m.vote_average}
              releaseDate={m.release_date}
            />
          ))
        ) : (
          Array.from({ length: 6 }, (_, i) => (
            <MovieCardSkeleton key={i} />
          ))
        )}
      </div>
    </section>
  )
}

// force dynamic
export const dynamic = "force-dynamic"

export default async function Home() {
  const [trending, topRated, popular] = await Promise.all([
    getTrendingMovies("week"),
    getTopRatedMovies(),
    getPopularMovies(),
  ])

  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrendingSection movies={trending} />
      <TopRatedSection moviesList={topRated} />
      <PopularSection popularData={popular} />
    </div>
  )
}
