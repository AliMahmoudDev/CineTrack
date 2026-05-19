import { getMovieDetails, getBackdropUrl, getPosterUrl } from "@/lib/tmdb"
import { MovieDetailClient } from "@/components/movie-detail-client"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// movie page metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieDetails(parseInt(id, 10))

  if (!movie) {
    return {
      title: "Movie Not Found",
      description: "The movie you are looking for could not be found on CineTrack.",
    }
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : undefined

  const description =
    movie.overview
      ? movie.overview.length > 160
        ? movie.overview.slice(0, 157) + "..."
        : movie.overview
      : `Explore details, ratings, cast, and more for ${movie.title} on CineTrack.`

  return {
    title: movie.title,
    description,
    keywords: [
      movie.title,
      ...(movie.genres?.map((g) => g.name) ?? []),
      "movie",
      "film",
      "review",
      "rating",
      "cast",
      "CineTrack",
    ],
    alternates: {
      canonical: `/movie/${id}`,
    },
    openGraph: {
      title: `${movie.title} | CineTrack`,
      description,
      url: `/movie/${id}`,
      type: "video.movie",
      images: posterUrl
        ? [
            {
              url: posterUrl,
              width: 780,
              height: 1170,
              alt: `${movie.title} poster`,
            },
          ]
        : undefined,
      releaseDate: movie.release_date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} | CineTrack`,
      description,
      images: posterUrl ? [posterUrl] : undefined,
    },
  }
}

// JSON-LD
function MovieJsonLd({ movie }: { movie: NonNullable<Awaited<ReturnType<typeof getMovieDetails>>> }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview ?? undefined,
    image: movie.poster_path
      ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
      : undefined,
    datePublished: movie.release_date || undefined,
    genre: movie.genres?.map((g) => g.name).join(", ") || undefined,
    aggregateRating: movie.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average.toFixed(1),
          bestRating: "10",
          ratingCount: movie.vote_count?.toString() || "0",
        }
      : undefined,
    director: movie.credits?.crew
      ?.filter((c) => c.job === "Director")
      .slice(0, 3)
      .map((d) => ({
        "@type": "Person",
        name: d.name,
      })) || undefined,
    actor: movie.credits?.cast
      ?.slice(0, 5)
      .map((a) => ({
        "@type": "Person",
        name: a.name,
      })) || undefined,
  }

  // cleanup
  const cleaned = JSON.parse(JSON.stringify(schema))

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleaned) }}
    />
  )
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const movie = await getMovieDetails(parseInt(id, 10))

  if (!movie) notFound()

  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const posterUrl = getPosterUrl(movie.poster_path, "w780")
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  )
  const cast = movie.credits?.cast?.slice(0, 12) ?? []

  return (
    <>
      <MovieJsonLd movie={movie} />
      <MovieDetailClient
        movie={movie}
        backdropUrl={backdropUrl}
        posterUrl={posterUrl}
        trailerKey={trailer?.key ?? null}
        cast={cast}
      />
    </>
  )
}
