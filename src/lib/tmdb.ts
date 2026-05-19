// tmdb api

const BASE_URL = "https://api.themoviedb.org/3"
const IMG_BASE = "https://image.tmdb.org/t/p"

// auth tokens
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || ""
const TMDB_API_KEY = process.env.TMDB_API_KEY || ""

// fallback img cuz api sometimes sends null
export function getPosterUrl(path: string | null, size: string = "w500"): string {
  if (!path) return "/placeholder-poster.svg"
  return `${IMG_BASE}/${size}${path}`
}

// backdrop for hero sections
export function getBackdropUrl(path: string | null, size: string = "original"): string {
  if (!path) return ""
  return `${IMG_BASE}/${size}${path}`
}

// shared fetch helper with auth
async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams(params)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // bearer auth
  if (TMDB_ACCESS_TOKEN) {
    headers["Authorization"] = `Bearer ${TMDB_ACCESS_TOKEN}`
  } else if (TMDB_API_KEY) {
    // api key fallback
    searchParams.set("api_key", TMDB_API_KEY)
  } else {
    console.error("TMDB: No API key or access token configured! Set TMDB_ACCESS_TOKEN or TMDB_API_KEY in .env.local")
    return null
  }

  const url = `${BASE_URL}${endpoint}?${searchParams.toString()}`

  const res = await fetch(url, {
    headers,
    next: { revalidate: 3600 }, // cache for 1hr
  })

  if (!res.ok) {
    console.error(`tmdb api error: ${res.status} ${res.statusText} - ${endpoint}`)
    return null
  }

  return res.json()
}

// --- Trending ---

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
  genre_ids: number[]
  popularity: number
  adult: boolean
  original_language: string
}

export interface MovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export async function getTrendingMovies(timeWindow: string = "week"): Promise<Movie[] | null> {
  const data = await tmdbFetch(`/trending/movie/${timeWindow}`)
  return data?.results ?? null
}

// --- Top Rated ---

export async function getTopRatedMovies(page: number = 1): Promise<Movie[] | null> {
  const data = await tmdbFetch("/movie/top_rated", { page: String(page) })
  return data?.results ?? null
}

// --- Popular ---

export async function getPopularMovies(page: number = 1): Promise<Movie[] | null> {
  const data = await tmdbFetch("/movie/popular", { page: String(page) })
  return data?.results ?? null
}

// --- Genres ---

export interface Genre {
  id: number
  name: string
}

export async function getMovieGenres(): Promise<Genre[] | null> {
  const data = await tmdbFetch("/genre/movie/list")
  return data?.genres ?? null
}

// --- Discover by Genre ---

export async function discoverMovies(genreId?: number, page: number = 1): Promise<MovieResponse | null> {
  const params: Record<string, string> = {
    page: String(page),
    sort_by: "popularity.desc",
    "vote_count.gte": "200",
  }
  if (genreId) {
    params.with_genres = String(genreId)
  }
  const data = await tmdbFetch("/discover/movie", params)
  return data ?? null
}

// --- Search ---

export async function searchMovies(query: string, page: number = 1): Promise<MovieResponse | null> {
  const data = await tmdbFetch("/search/movie", {
    query,
    page: String(page),
  })
  return data ?? null
}

// --- Single Movie Details ---

export interface MovieDetails extends Movie {
  runtime: number
  budget: number
  revenue: number
  tagline: string
  status: string
  genres: Genre[]
  production_companies: { id: number; name: string; logo_path: string | null }[]
  videos: { results: { key: string; type: string; site: string }[] } | null
  credits: { cast: { id: number; name: string; character: string; profile_path: string | null }[] } | null
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails | null> {
  const data = await tmdbFetch(`/movie/${movieId}`, {
    append_to_response: "videos,credits",
  })
  return data ?? null
}
