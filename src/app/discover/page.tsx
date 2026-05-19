import type { Metadata } from "next"
import { getMovieGenres, discoverMovies } from "@/lib/tmdb"
import { DiscoverClient } from "@/components/discover-client"

// discover metadata
export const metadata: Metadata = {
  title: "Discover Movies by Genre",
  description:
    "Browse and discover movies across all genres — Action, Comedy, Horror, Drama, Sci-Fi, and more. Find your next favorite film with CineTrack's powerful genre filter.",
  alternates: {
    canonical: "/discover",
  },
  openGraph: {
    title: "Discover Movies by Genre | CineTrack",
    description:
      "Browse and discover movies across all genres. Find your next favorite film with CineTrack's powerful genre filter.",
    url: "/discover",
  },
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; page?: string }>
}) {
  const params = await searchParams
  const genreId = params.genre ? parseInt(params.genre, 10) : null
  const page = parseInt(params.page ?? "1", 10)

  const [genres, movieData] = await Promise.all([
    getMovieGenres(),
    discoverMovies(genreId ?? undefined, page),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* re-mount on genre change */}
      <DiscoverClient
        key={genreId ?? "all"}
        genres={genres ?? []}
        initialMovies={movieData?.results ?? []}
        initialGenre={genreId}
        initialPage={page}
        totalPages={Math.min(movieData?.total_pages ?? 1, 500)}
      />
    </div>
  )
}
