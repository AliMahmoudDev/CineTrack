import { NextResponse } from "next/server"
import { getMovieGenres } from "@/lib/tmdb"
import { MOVIE_GENRES } from "@/lib/genres"

export async function GET() {
  try {
    const genres = await getMovieGenres()
    // fallback to hardcoded genres
    return NextResponse.json({ genres: genres ?? MOVIE_GENRES })
  } catch {
    // fallback
    return NextResponse.json({ genres: MOVIE_GENRES })
  }
}
